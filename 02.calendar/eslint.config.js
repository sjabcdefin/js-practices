import globals from "globals";
import pluginJs from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  { languageOptions: { globals: globals.nodeBuiltin } },
  pluginJs.configs.recommended,
  eslintPluginPrettierRecommended,
];
