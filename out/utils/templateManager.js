"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateManager = void 0;
const fabricConfig_1 = require("./fabricConfig");
/**
 * Fabric project templates (build.gradle, fabric.mod.json, etc.)
 */
class TemplateManager {
    static getModInitializer(_modId, _packageName) {
        throw new Error('Method not implemented.');
    }
    static getGradleProperties(_config) {
        throw new Error('Method not implemented.');
    }
    static getModsToml(_modId, _modName) {
        throw new Error('Method not implemented.');
    }
    /**
     * Create a new Fabric mod project in the given folder
     */
    static async createModProject(folderUri, modId, modName) {
        const fs = require("fs/promises");
        const path = require("path");
        const config = fabricConfig_1.FabricConfigManager.getConfig();
        // Create build.gradle
        const buildGradle = this.getBuildGradle(config);
        await fs.writeFile(path.join(folderUri.fsPath, "build.gradle"), buildGradle, "utf8");
        // Create fabric.mod.json
        const modJson = this.getFabricModJson(modId, modName);
        await fs.mkdir(path.join(folderUri.fsPath, "src", "main", "resources"), {
            recursive: true,
        });
        await fs.writeFile(path.join(folderUri.fsPath, "src", "main", "resources", "fabric.mod.json"), modJson, "utf8");
        // Add more files as needed (README, .gitignore, etc.)
    }
    static getBuildGradle(config) {
        return `plugins {
  id 'fabric-loom' version '${config.loomVersion}'
  id 'maven-publish'
}

version = project.mod_version
group = project.maven_group

repositories {
  maven { name = "Fabric"; url = "https://maven.fabricmc.net/" }
}

dependencies {
  minecraft "com.mojang:minecraft:${config.minecraftVersion}"
  mappings "net.fabricmc:yarn:${config.yarnMappings}:v2"
  modImplementation "net.fabricmc:fabric-loader:${config.loaderVersion}"
  modImplementation "net.fabricmc.fabric-api:fabric-api:${config.fabricApiVersion}"
}

processResources {
  inputs.property "version", project.version
  filteringCharset "UTF-8"
  filesMatching("fabric.mod.json") {
    expand "version": project.version
  }
}

java {
  withSourcesJar()
  sourceCompatibility = JavaVersion.VERSION_${config.javaVersion}
  targetCompatibility = JavaVersion.VERSION_${config.javaVersion}
}`;
    }
    static getFabricModJson(modId, modName) {
        return `{
  "schemaVersion": 1,
  "id": "${modId}",
  "version": "\${version}",
  "name": "${modName}",
  "description": "A Fabric mod for Minecraft",
  "authors": ["Your Name"],
  "contact": {
    "homepage": "https://github.com/yourusername/${modId}",
    "sources": "https://github.com/yourusername/${modId}"
  },
  "license": "MIT",
  "icon": "assets/${modId}/icon.png",
  "environment": "*",
  "entrypoints": {
    "main": ["${modId}.Mod"]
  },
  "mixins": ["${modId}.mixins.json"],
  "depends": {
    "fabricloader": ">=0.15.0",
    "minecraft": "${fabricConfig_1.FabricConfigManager.getConfig().minecraftVersion}",
    "java": ">=21",
    "fabric-api": "*"
  }
}`;
    }
}
exports.TemplateManager = TemplateManager;
//# sourceMappingURL=templateManager.js.map