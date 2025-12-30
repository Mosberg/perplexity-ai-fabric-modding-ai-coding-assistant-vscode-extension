import { BaseGenerator } from "./baseGenerator";

// src/generators/rendererGenerator.ts
export class RendererGenerator extends BaseGenerator {
  async generate(name: string): Promise<string> {
    // CLIENT-ONLY renderer registration + model JSON
    const config = this.getFabricConfig();
    return `// CLIENT: src/client/java/${config.packageName}/client/render/${name}Renderer.java
@Environment(EnvType.CLIENT)
public class ${name}Renderer implements EntityRenderer<${name}Entity> {
  public ${name}Renderer(EntityRendererFactory.Context ctx) {}

  @Override
  public void render(${name}Entity entity, ...){}
}`;
  }
}
