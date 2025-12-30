"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenGenerator = void 0;
const baseGenerator_1 = require("./baseGenerator");
// src/generators/screenGenerator.ts
class ScreenGenerator extends baseGenerator_1.BaseGenerator {
    async generate(name) {
        return `// Screen + ScreenHandler for GUI
public class ${name}ScreenHandler extends NamedScreenHandlerFactory { ... }`;
    }
}
exports.ScreenGenerator = ScreenGenerator;
//# sourceMappingURL=screenGenerator.js.map