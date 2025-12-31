import * as vscode from 'vscode';
import type { FabricConfig } from '../types/fabric.types';

export class FabricConfigManager {
  private static readonly DEFAULTS: FabricConfig = {
    minecraftVersion: '1.21.10',
    yarnMappings: '1.21.10+build.3',
    loaderVersion: '0.18.4',
    fabricApiVersion: '0.138.4+1.21.10',
    loomVersion: '1.14.10',
    javaVersion: 21,
    modId: 'mana',
    packageName: 'dk.mosberg'
  } as const;

  /**
   * Get complete Fabric configuration
   */
  static getConfig(): FabricConfig {
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
  static async update(key: keyof FabricConfig, value: string | number): Promise<void> {
    await vscode.workspace.getConfiguration('fabric').update(
      key,
      value,
      vscode.ConfigurationTarget.Workspace
    );
  }

  /**
   * Validate current config
   */
  static validateConfig(): { valid: boolean; errors: string[] } {
    const config = this.getConfig();
    const errors: string[] = [];

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
  static getBuildGradleVars(): Record<string, string> {
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
  static getModJsonVars(): Record<string, string> {
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
  static async isFabricProject(): Promise<boolean> {
    const fabricModJson = await vscode.workspace.findFiles('**/fabric.mod.json', '**/node_modules/**', 1);
    const buildGradle = await vscode.workspace.findFiles('**/build.gradle', '**/node_modules/**', 1);

    return fabricModJson.length > 0 || buildGradle.length > 0;
  }

  /**
   * Get recommended mod ID from workspace
   */
  static async getRecommendedModId(): Promise<string> {
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
