const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = [...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:playwright/recommended",
), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        parser: tsParser,
    },

    rules: {
        indent: ["error", "tab", {
            ignoredNodes: ["PropertyDefinition"],
        }],

        "@typescript-eslint/no-namespace": "off",
        "no-inner-declarations": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "warn",
        "playwright/no-nested-step": "off",
        "playwright/prefer-strict-equal": "error",
        "playwright/prefer-to-be": "warn",
        "playwright/prefer-to-contain": "error",
        "playwright/prefer-to-have-length": "error",
        "playwright/missing-playwright-await": "off",
        "playwright/no-skipped-test": "off",
    },
}];