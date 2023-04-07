import ts from 'typescript';

export class StringifiedSourceCodeBuilder {
  readonly #printer: ts.Printer;

  constructor() {
    this.#printer = ts.createPrinter({
      newLine: ts.NewLineKind.LineFeed,
    });
  }

  public build(sourceFile: ts.SourceFile): string {
    const apiJsonSchemaIdEnumTsSource: string =
      this.#printer.printFile(sourceFile);

    return apiJsonSchemaIdEnumTsSource;
  }
}
