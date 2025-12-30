"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGenerator = void 0;
const vscode = __importStar(require("vscode"));
const validators_1 = require("../utils/validators");
/**
 * Abstract base class for all Fabric code generators
 * Provides shared functionality: validation, templating, Fabric config
 */
class BaseGenerator {
    constructor(context) {
        this.context = context;
    }
    /**
     * Validate generator input
     */
    validateName(name, type) {
        const validation = validators_1.Validators.validateClassName(name);
        if (!validation.valid) {
            throw new Error(`Invalid ${type} name "${name}": ${validation.error}`);
        }
    }
    /**
     * Get current Fabric configuration
     */
    getFabricConfig() {
        const config = vscode.workspace.getConfiguration("fabric");
        return {
            minecraftVersion: config.get("minecraftVersion", "1.21.10"),
            fabricApiVersion: config.get("fabricApiVersion", "0.138.4+1.21.10"),
            modId: config.get("modId", "mana"),
            packageName: config.get("packageName", "dk.mosberg"),
        };
    }
    /**
     * Generate standard Fabric imports
     */
    getFabricImports() {
        return [
            `import net.fabricmc.api.ModInitializer;`,
            `import net.fabricmc.fabric.api.item.v1.FabricItemGroup;`,
            `import net.minecraft.registry.Registries;`,
            `import net.minecraft.registry.Registry;`,
            `import net.minecraft.util.Identifier;`,
            `import org.slf4j.Logger;`,
            `import org.slf4j.LoggerFactory;`,
        ];
    }
    /**
     * Generate mod identifier
     */
    modId(name) {
        // Identifier is not defined; fallback to string format
        const modId = this.getFabricConfig().modId;
        return `${modId}:${name.toLowerCase()}`;
    }
    /**
     * Format Java class header
     */
    javaClassHeader(packageName, className, modId, imports = []) {
        return `package ${packageName};

${imports.join("\n")}

public class ${className} {
  public static final String MOD_ID = "${modId}";
  private static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);
`;
    }
}
exports.BaseGenerator = BaseGenerator;
//# sourceMappingURL=baseGenerator.js.map