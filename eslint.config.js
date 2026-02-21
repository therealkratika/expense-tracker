import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  eslintConfigPrettier, // ⬅️ disables conflicting ESLint formatting rules

  // 🔵 Frontend (React + Vite)
  {
    files: ["src/**/*.{js,jsx}", "frontend/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      "react/react-in-jsx-scope": "off",
      "react-refresh/only-export-components": "warn",

      // 🧹 Prettier formatting as ESLint rule
      "prettier/prettier": "warn",

      "no-unused-vars": "warn",
      "no-console": "warn",
    },
    settings: {
      react: { version: "detect" },
    },
  },

  // 🟢 Backend (Node.js)
  {
    files: ["backend/**/*.js"],
    plugins: { prettier },
    rules: {
      "no-console": "off",
      "prettier/prettier": "warn",
    },
  },
];