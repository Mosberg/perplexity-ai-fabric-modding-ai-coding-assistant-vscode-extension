import { BaseGenerator } from "./baseGenerator";

// src/generators/configGenerator.ts
export class ConfigGenerator extends BaseGenerator {
  async generate(_name: string): Promise<string> {
    return `// Cloth Config integration
@ConfigEntry.Gui.RequiresRestart
public static boolean mySetting = true;`;
  }
}
