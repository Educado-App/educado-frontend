import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    {
    ignores: ["__tests__/*", "cypress/*"],
    },
    ...compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:tailwindcss/recommended",
    ),
    {
        files: [".js", ".jsx", "ts", ".tsx"],
        plugins: {
            "@typescript-eslint": typescriptEslint,
        },
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 5,
            sourceType: "script",
            parserOptions: {
                project: ["./tsconfig.json"],
            },
        },
        rules: {
            "@typescript-eslint/strict-boolean-expressions": [2, {
                allowString: false,
                allowNumber: false,
            }],
            "no-console": ["error", {
                allow: ["error"],
            }],
        },
    }
];