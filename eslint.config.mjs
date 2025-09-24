import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["packages/backend/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
    rules: {
      // Estilo de variables
      'no-var': 'error',
      'prefer-const': 'error',

      // Comparaciones estrictas
      'eqeqeq': ['error', 'always'],

      // Comillas simples
      'quotes': ['error', 'single', { avoidEscape: true }],

      // Punto y coma al final
      'semi': ['error', 'never'],

      // Espacios en llaves de objetos
      'object-curly-spacing': ['error', 'always'],

      // Espaciado en funciones flecha
      'arrow-spacing': ['error', { before: true, after: true }],

      // No console.log en producción
      'no-console': 0,

      // Uso de const si no se reasigna
      'prefer-destructuring': ['error', {
        object: true,
        array: false
      }, {
          enforceForRenamedProperties: false
        }],

      // Uso de template literals en lugar de concatenación
      'prefer-template': 'error',

      // Máximo una declaración por línea
      'max-len': ['error', { code: 100 }],
    }
  }, {
    files: ["packages/frontend/src/**/*.{js,jsx,mjs,cjs}"],
    ...pluginReact.configs.flat.recommended,
    settings: { react: { version: "detect" } },
  },
]);
