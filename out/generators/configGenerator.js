"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigGenerator = void 0;
const baseGenerator_1 = require("./baseGenerator");
// src/generators/configGenerator.ts
class ConfigGenerator extends baseGenerator_1.BaseGenerator {
    async generate(_name) {
        return `// Cloth Config integration
@ConfigEntry.Gui.RequiresRestart
public static boolean mySetting = true;`;
    }
}
exports.ConfigGenerator = ConfigGenerator;
//# sourceMappingURL=configGenerator.js.map