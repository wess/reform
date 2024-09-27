import { 
  useState, 
  useRef, 
  useEffect 
} from "react";

import { 
  ZodObject, 
  z 
} from "zod";

type FieldError = { message: string };

interface UseFormOptions {
    /**
     * Callback function to be called when the form is submitted with valid data.
     * @param event - The event object containing form data and preventDefault method.
     */
    onValidSubmit?: (event: { preventDefault: () => void; data: any }) => void;

    /**
     * Callback function to be called when the form is submitted with invalid data.
     * @param errors - The errors object containing validation errors for each field.
     */
    onInvalidSubmit?: (errors: Record<string, FieldError[]>) => void;
}

interface FormState<T> {
    /**
     * Reference to the HTML form element.
     */
    ref: React.RefObject<HTMLFormElement>;

    /**
     * Field object containing functions to get field names.
     */
    fields: {
        [K in keyof T]: () => string;
    };

    /**
     * Errors object containing functions to get class names for fields with errors.
     */
    errors: {
        [K in keyof T]: (className: string) => string;
    };

    /**
     * Validation state of the form.
     */
    validation: {
        success: boolean;
        data?: T;
        errors?: Record<keyof T, FieldError[]>;
    } | null;
}

/**
 * Custom hook to handle form validation and submission using Zod schema.
 * @param formName - The name of the form, used to prefix field names.
 * @param schema - The Zod schema for form validation.
 * @param options - Optional configuration for valid and invalid submit callbacks.
 * @returns An object containing form state, field functions, and error functions.
 */
export function useForm<T extends z.ZodRawShape>(
    formName: string,
    schema: ZodObject<T>,
    options: UseFormOptions = {}
): FormState<z.infer<ZodObject<T>>> {
    const [validation, setValidation] = useState<{
        success: boolean;
        data?: z.infer<typeof schema>;
        errors?: Record<keyof T, FieldError[]>;
    } | null>(null);

    const ref = useRef<HTMLFormElement>(null);

    /**
     * Validate form data against the provided schema and set the validation state.
     */
    const validate = () => {
        if (!ref.current) return;
        const formData = new FormData(ref.current);
        const data: Record<string, any> = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        const result = schema.safeParse(data);

        if (result.success) {
            setValidation({ success: true, data: result.data });
            options.onValidSubmit && options.onValidSubmit({ preventDefault: () => {}, data: result.data });
        } else {
            const formattedErrors: Record<keyof T, FieldError[]> = {} as Record<keyof T, FieldError[]>;
            result.error.errors.forEach((error) => {
                if (!formattedErrors[error.path[0]]) {
                    (formattedErrors as any)[error.path[0]] = [];
                }
                formattedErrors[error.path[0]].push({ message: error.message });
            });
            setValidation({ success: false, errors: formattedErrors });
            options.onInvalidSubmit && options.onInvalidSubmit(formattedErrors);
        }
    };

    useEffect(() => {
        if (!ref.current) return;
        const form = ref.current;
        form.addEventListener("submit", validate);
        return () => form.removeEventListener("submit", validate);
    }, [ref.current]);

    const fields: FormState<z.infer<typeof schema>>["fields"] = {} as any;
    const errors: FormState<z.infer<typeof schema>>["errors"] = {} as any;

    for (const field in schema.shape) {
      if (Object.prototype.hasOwnProperty.call(schema.shape, field)) {
          fields[field] = () => `${formName}-${field}`;
          errors[field] = (className: string) =>
              validation && validation.errors && validation.errors[field] ? className : "";
      }
    }

    return {
        ref,
        fields,
        errors,
        validation,
    };
}
