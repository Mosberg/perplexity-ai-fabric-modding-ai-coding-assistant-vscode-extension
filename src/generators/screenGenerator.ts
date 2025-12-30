import { BaseGenerator } from "./baseGenerator";

// src/generators/screenGenerator.ts
export class ScreenGenerator extends BaseGenerator {
  async generate(name: string): Promise<string> {
    return `// Screen + ScreenHandler for GUI
public class ${name}ScreenHandler extends NamedScreenHandlerFactory { ... }`;
  }
}
