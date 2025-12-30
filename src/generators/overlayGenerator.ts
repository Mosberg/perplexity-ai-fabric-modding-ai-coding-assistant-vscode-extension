import { BaseGenerator } from "./baseGenerator";

// src/generators/overlayGenerator.ts
export class OverlayGenerator extends BaseGenerator {
  async generate(name: string): Promise<string> {
    return `@Environment(EnvType.CLIENT)
public class ${name}HudOverlay implements HudRenderCallback { ... }`;
  }
}
