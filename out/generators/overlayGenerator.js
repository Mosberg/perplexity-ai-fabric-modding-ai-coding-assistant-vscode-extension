"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverlayGenerator = void 0;
const baseGenerator_1 = require("./baseGenerator");
// src/generators/overlayGenerator.ts
class OverlayGenerator extends baseGenerator_1.BaseGenerator {
    async generate(name) {
        return `@Environment(EnvType.CLIENT)
public class ${name}HudOverlay implements HudRenderCallback { ... }`;
    }
}
exports.OverlayGenerator = OverlayGenerator;
//# sourceMappingURL=overlayGenerator.js.map