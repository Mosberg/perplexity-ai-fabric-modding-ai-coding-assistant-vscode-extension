import * as vscode from "vscode";
import type { GeneratorType } from "../types/fabric.types";
import { Validators } from "../utils/validators";

/**
 * Abstract base class for all Fabric code generators
 * Provides shared functionality: validation, templating, Fabric config
 */
export abstract class BaseGenerator {
  protected readonly context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  /**
   * Generate code for given name/type
   */
  abstract generate(name: string): Promise<string>;

  /**
   * Validate generator input
   */
  protected validateName(name: string, type: GeneratorType): void {
    const validation = Validators.validateClassName(name);
    if (!validation.valid) {
      throw new Error(`Invalid ${type} name "${name}": ${validation.error}`);
    }
  }

  /**
   * Get current Fabric configuration
   */
  protected getFabricConfig(): Record<string, string> {
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
  protected getFabricImports(): string[] {
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
  protected modId(name: string): string {
    // Identifier is not defined; fallback to string format
    const modId = this.getFabricConfig().modId;
    return `${modId}:${name.toLowerCase()}`;
  }

  /**
   * Format Java class header
   */
  protected javaClassHeader(
    packageName: string,
    className: string,
    modId: string,
    imports: string[] = []
  ): string {
    return `package ${packageName};

${imports.join("\n")}

public class ${className} {
  public static final String MOD_ID = "${modId}";
  private static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);
`;
  }
}
