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
exports.FabricConfigManager = void 0;
const vscode = __importStar(require("vscode"));
class FabricConfigManager {
    /**
     * Get complete Fabric configuration
     */
    static getConfig() {
        const config = vscode.workspace.getConfiguration('fabric');
        return {
            minecraftVersion: config.get('minecraftVersion', this.DEFAULTS.minecraftVersion),
            yarnMappings: config.get('yarnMappings', this.DEFAULTS.yarnMappings),
            loaderVersion: config.get('loaderVersion', this.DEFAULTS.loaderVersion),
            fabricApiVersion: config.get('fabricApiVersion', this.DEFAULTS.fabricApiVersion),
            loomVersion: config.get('loomVersion', this.DEFAULTS.loomVersion),
            javaVersion: config.get('javaVersion', this.DEFAULTS.javaVersion),
            modId: config.get('modId', this.DEFAULTS.modId),
            packageName: config.get('packageName', this.DEFAULTS.packageName)
        };
    }
    /**
     * Update specific config value
     */
    static async update(key, value) {
        await vscode.workspace.getConfiguration('fabric').update(key, value, vscode.ConfigurationTarget.Workspace);
    }
    /**
     * Validate current config
     */
    static validateConfig() {
        const config = this.getConfig();
        const errors = [];
        if (!/^[a-z0-9_]+$/.test(config.modId)) {
            errors.push(`Invalid modId: "${config.modId}" (lowercase only)`);
        }
        if (!/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)*$/.test(config.packageName)) {
            errors.push(`Invalid package: "${config.packageName}" (reverse domain)`);
        }
        return { valid: errors.length === 0, errors };
    }
    /**
     * Get build.gradle template vars
     */
    static getBuildGradleVars() {
        const config = this.getConfig();
        return {
            minecraft_version: config.minecraftVersion,
            yarn_mappings: config.yarnMappings,
            loader_version: config.loaderVersion,
            fabric_version: config.fabricApiVersion,
            loom_version: config.loomVersion,
            java_version: config.javaVersion.toString(),
            mod_version: '1.0.0',
            maven_group: config.packageName.replace(/\./g, '-'),
            mod_id: config.modId
        };
    }
    /**
     * Get fabric.mod.json template vars
     */
    static getModJsonVars() {
        const config = this.getConfig();
        return {
            mod_id: config.modId,
            package_name: config.packageName,
            minecraft_version: config.minecraftVersion,
            version: '${version}'
        };
    }
    /**
     * Check if Fabric project detected in workspace
     */
    static async isFabricProject() {
        const fabricModJson = await vscode.workspace.findFiles('**/fabric.mod.json', '**/node_modules/**', 1);
        const buildGradle = await vscode.workspace.findFiles('**/build.gradle', '**/node_modules/**', 1);
        return fabricModJson.length > 0 || buildGradle.length > 0;
    }
    /**
     * Get recommended mod ID from workspace
     */
    static async getRecommendedModId() {
        if (await this.isFabricProject()) {
            return this.getConfig().modId;
        }
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (workspaceFolder) {
            return workspaceFolder.name.toLowerCase().replace(/[^a-z0-9_]/g, '_');
        }
        return this.DEFAULTS.modId;
    }
}
exports.FabricConfigManager = FabricConfigManager;
FabricConfigManager.DEFAULTS = {
    minecraftVersion: '1.21.10',
    yarnMappings: '1.21.10+build.3',
    loaderVersion: '0.18.4',
    fabricApiVersion: '0.138.4+1.21.10',
    loomVersion: '1.14.10',
    javaVersion: 21,
    modId: 'mana',
    packageName: 'dk.mosberg'
};
//# sourceMappingURL=fabricConfig.js.map