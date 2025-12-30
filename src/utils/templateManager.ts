import type { FabricConfig } from "../types/fabric.types";
import { FabricConfigManager } from "./fabricConfig";

/**
 * Fabric project templates (build.gradle, fabric.mod.json, etc.)
 */
export class TemplateManager {
  static getBuildGradle(config: FabricConfig): string {
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
  modImplementation "net.fabricmc.fabric-api:fabric-api:${config.fabricVersion}"
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

  static getFabricModJson(modId: string, modName: string): string {
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
    "minecraft": "${FabricConfigManager.getConfig().minecraftVersion}",
    "java": ">=21",
    "fabric-api": "*"
  }
}`;
  }
}
