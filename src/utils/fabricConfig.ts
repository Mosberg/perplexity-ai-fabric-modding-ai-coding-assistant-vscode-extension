import * as vscode from "vscode";
import type { FabricConfig } from "../types/fabric.types";

/**
 * Fabric project configuration manager
 */
export class FabricConfigManager {
  private static readonly DEFAULTS: FabricConfig = {
    minecraftVersion: "1.21.10",
    yarnMappings: "1.21.10+build.3",
    loaderVersion: "0.18.4",
    fabricVersion: "0.138.4+1.21.10",
    loomVersion: "1.14.10",
    javaVersion: 21,
    modId: "mana",
    packageName: "dk.mosberg",
  };

  static getConfig(): FabricConfig {
    const config = vscode.workspace.getConfiguration("fabric");
    return {
      minecraftVersion: config.get(
        "minecraftVersion",
        this.DEFAULTS.minecraftVersion
      ),
      yarnMappings: config.get("yarnMappings", this.DEFAULTS.yarnMappings),
      loaderVersion: config.get("loaderVersion", this.DEFAULTS.loaderVersion),
      fabricVersion: config.get("fabricVersion", this.DEFAULTS.fabricVersion),
      loomVersion: config.get("loomVersion", this.DEFAULTS.loomVersion),
      javaVersion: config.get("javaVersion", this.DEFAULTS.javaVersion),
      modId: config.get("modId", this.DEFAULTS.modId),
      packageName: config.get("packageName", this.DEFAULTS.packageName),
    };
  }

  static async update(
    key: keyof FabricConfig,
    value: string | number
  ): Promise<void> {
    const config = vscode.workspace.getConfiguration("fabric");
    await config.update(key, value, vscode.ConfigurationTarget.Global);
  }
}
