"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RendererGenerator = void 0;
const baseGenerator_1 = require("./baseGenerator");
// src/generators/rendererGenerator.ts
class RendererGenerator extends baseGenerator_1.BaseGenerator {
    async generate(name) {
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
exports.RendererGenerator = RendererGenerator;
//# sourceMappingURL=rendererGenerator.js.map