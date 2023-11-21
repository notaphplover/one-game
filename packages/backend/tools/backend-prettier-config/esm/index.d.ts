interface PrettierConfig {
  printWidth: number;
  tabWidth: number;
  useTabs: boolean;
  semi: boolean;
  singleQuote: boolean;
  bracketSpacing: boolean;
  arrowParens: "avoid" | "always";
  endOfLine: "auto" | "lf" | "crlf" | "cr";
  trailingComma: "none" | "es5" | "all";
}

declare const config: PrettierConfig;

export default config;
