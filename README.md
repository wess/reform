
# ReForm

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-%E2%9C%93-blue)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-%E2%9C%93-green)](https://bun.sh)

ReForm is a lightweight and flexible form management library built with Bun, TypeScript, React, and Zod. It provides a simple and powerful way to manage form state, validation, and submission with minimal boilerplate code.

## Features

- 📦 **Easy to Use**: Simple API to manage form state and validation.
- ⚡ **Bun & React Integration**: Built for Bun and React applications.
- 🛠️ **TypeScript Support**: Strongly typed for safer code.
- ✅ **Validation with Zod**: Leverage Zod schemas for robust form validation.

## Installation

To use ReForm in your project, you can install it via Bun:

```bash
bun add reform
```

## Usage

```typescript
import React from "react";
import { z } from "zod";
import { useForm } from "reform";

const FormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    password: z
        .string()
        .min(10, "Password must be at least 10 characters long")
        .refine((pw) => /[0-9]/.test(pw), "Password must contain a number"),
});

function SignupForm() {
    const form = useForm("signup", FormSchema, {
        onValidSubmit(e) {
            e.preventDefault();
            alert("Form is valid: " + JSON.stringify(e.data, null, 2));
        },
    });

    const disabled = form.validation?.success === false;

    return (
        <form ref={form.ref}>
            <div>
                <label>Name:</label>
                <input type="text" name={form.fields.name()} className={form.errors.name("error")} />
                {form.errors.name((e) => <div className="error">{e.message}</div>)}
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name={form.fields.password()} className={form.errors.password("error")} />
                {form.errors.password((e) => <div className="error">{e.message}</div>)}
            </div>
            <button type="submit" disabled={disabled}>Signup</button>
            <pre>Validation status: {JSON.stringify(form.validation, null, 2)}</pre>
        </form>
    );
}
```

## API

### `useForm(formName, schema, options)`

- `formName`: A unique identifier for the form, used to prefix field names.
- `schema`: A Zod object schema for form validation.
- `options`: Optional configuration object with the following properties:
  - `onValidSubmit(e)`: Callback executed when form data is valid.
  - `onInvalidSubmit(errors)`: Callback executed when form data is invalid.

### `FormState`

The `useForm` hook returns an object with the following properties:

- **`ref`**: React reference for the form element.
- **`fields`**: Object containing functions to get field names.
- **`errors`**: Object containing functions to get class names or render error messages.
- **`validation`**: Current validation state, including `success`, `data`, and `errors`.

## Contributing

We welcome contributions to ReForm! If you have suggestions, issues, or want to contribute code, please open an issue or submit a pull request on the [GitHub repository](https://github.com/yourusername/reform).

### Running Locally

To run the project locally:

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/reform.git
    cd reform
    ```

2. Install dependencies:
    ```bash
    bun install
    ```

3. Build the project:
    ```bash
    bun build
    ```

4. Run the project:
    ```bash
    bun dev
    ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Acknowledgements

- [React](https://reactjs.org/)
- [Bun](https://bun.sh/)
- [Zod](https://github.com/colinhacks/zod)

---

Made with ❤️ using [Bun](https://bun.sh).
