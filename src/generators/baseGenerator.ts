import * as vscode from 'vscode';
import type { FabricConfig, GenerationResult, GeneratorType } from '../types/fabric.types';
import type { ValidationResult } from '../types/improved-types';
import { Validators } from '../utils/validators';

export abstract class BaseGenerator {
  protected readonly context: vscode.ExtensionContext;
  protected readonly config: FabricConfig;

  constructor(context: vscode.ExtensionContext, config: FabricConfig) {
    this.context = context;
    this.config = config;
  }

  /**
   * Generate code for given name/type (IMPLEMENT IN SUBCLASSES)
   */
  abstract generate(name: string): Promise<string>;

  /**
   * Validate generator input (STRICT)
   */
  protected validateName(name: string, type: GeneratorType): void {
    const validation = this.getValidationForType(type)(name);

    if (!validation.valid) {
      const error = new Error(`Invalid ${type} name "${name}": ${validation.error}`);
      throw error;
    }
  }

  /**
   * Get Fabric identifier
   */
  protected modId(name: string): string {
    return `Identifier.of("${this.config.modId}", "${name.toLowerCase()}")`;
  }

  /**
   * Get Java package for type
   */
  protected getPackage(type: GeneratorType): string {
    const packages = {
      entity: 'dk.mosberg.entity',
      block: 'dk.mosberg.block',
      item: 'dk.mosberg.item',
      command: 'dk.mosberg.command',
      renderer: 'dk.mosberg.client.render',
      screen: 'dk.mosberg.client.screen',
      overlay: 'dk.mosberg.client.overlay',
      config: 'dk.mosberg.config',
      mixin: 'dk.mosberg.mixin'
    };

    return packages[type] || this.config.packageName;
  }

  /**
   * Standard Fabric imports (1.21.10)
   */
  protected getFabricImports(type: GeneratorType): string[] {
    const commonImports = [
      'import net.minecraft.util.Identifier;',
      'import net.minecraft.registry.Registries;',
      'import net.minecraft.registry.Registry;',
      'import net.fabricmc.api.ModInitializer;',
      `import ${this.config.packageName}.Mana;`
    ];

    const typeImports: Record<GeneratorType, string[]> = {
      entity: [
        'import net.minecraft.entity.EntityType;',
        'import net.minecraft.entity.LivingEntity;',
        'import net.minecraft.entity.SpawnGroup;',
        'import net.minecraft.entity.ai.goal.MeleeAttackGoal;',
        'import net.minecraft.entity.ai.goal.WanderAroundFarGoal;',
        'import net.minecraft.entity.ai.goal.LookAroundGoal;',
        'import net.minecraft.entity.attribute.DefaultAttributeContainer;',
        'import net.minecraft.entity.attribute.EntityAttributes;',
        'import net.minecraft.entity.damage.DamageSource;',
        'import net.minecraft.entity.player.PlayerEntity;',
        'import net.minecraft.world.World;',
        'import net.minecraft.sound.SoundEvent;',
        'import net.minecraft.util.Identifier;',
        'import net.minecraft.registry.Registries;',
        'import net.minecraft.registry.Registry;'
      ],
      block: [
        'import net.minecraft.block.Block;',
        'import net.minecraft.block.BlockState;',
        'import net.minecraft.block.Material;',
        'import net.minecraft.block.ShapeContext;',
        'import net.minecraft.item.BlockItem;',
        'import net.minecraft.item.Item;',
        'import net.minecraft.item.ItemGroup;',
        'import net.minecraft.sound.BlockSoundGroup;',
        'import net.minecraft.util.math.BlockPos;',
        'import net.minecraft.util.shape.VoxelShape;',
        'import net.minecraft.util.shape.VoxelShapes;',
        'import net.minecraft.world.BlockView;',
        'import net.minecraft.registry.Registries;',
        'import net.minecraft.registry.Registry;',
        'import net.minecraft.util.Identifier;'
      ],
      item: [
        'import net.minecraft.item.Item;',
        'import net.minecraft.item.ItemGroup;',
        'import net.minecraft.item.ItemStack;',
        'import net.minecraft.client.item.TooltipContext;',
        'import net.minecraft.text.Text;',
        'import net.minecraft.world.World;',
        'import net.minecraft.registry.Registries;',
        'import net.minecraft.registry.Registry;',
        'import net.minecraft.util.Identifier;'
      ],
      command: [
        'import com.mojang.brigadier.CommandDispatcher;',
        'import com.mojang.brigadier.arguments.IntegerArgumentType;',
        'import com.mojang.brigadier.context.CommandContext;',
        'import net.fabricmc.fabric.api.command.v2.CommandRegistrationCallback;',
        'import net.minecraft.server.command.CommandManager;',
        'import net.minecraft.server.command.ServerCommandSource;',
        'import net.minecraft.server.network.ServerPlayerEntity;',
        'import net.minecraft.text.Text;'
      ],
      renderer: [
        'import net.fabricmc.api.EnvType;',
        'import net.fabricmc.api.Environment;',
        'import net.minecraft.client.render.VertexConsumerProvider;',
        'import net.minecraft.client.render.entity.EntityRendererFactory;',
        'import net.minecraft.client.render.entity.LivingEntityRenderer;',
        'import net.minecraft.client.util.math.MatrixStack;',
        'import net.minecraft.util.Identifier;'
      ],
      screen: [
        'import net.minecraft.client.gui.screen.ingame.HandledScreens;',
        'import net.minecraft.client.gui.screen.ingame.HandledScreen;',
        'import net.minecraft.entity.player.PlayerInventory;',
        'import net.minecraft.text.Text;',
        'import net.minecraft.screen.ScreenHandler;',
        'import net.minecraft.screen.slot.Slot;',
        'import net.minecraft.util.Identifier;',
        'import net.fabricmc.api.EnvType;',
        'import net.fabricmc.api.Environment;'
      ],
      overlay: [
        'import net.fabricmc.fabric.api.client.rendering.v1.HudRenderCallback;',
        'import net.minecraft.client.MinecraftClient;',
        'import net.minecraft.client.gui.DrawContext;',
        'import net.minecraft.client.util.math.MatrixStack;',
        'import net.minecraft.text.Text;',
        'import net.minecraft.util.math.MathHelper;',
        'import net.fabricmc.api.EnvType;',
        'import net.fabricmc.api.Environment;'
      ],
      config: [
        'import me.shedaniel.autoconfig.ConfigData;',
        'import me.shedaniel.autoconfig.annotation.ConfigEntry.Gui.RequiresRestart;',
        'import me.shedaniel.autoconfig.annotation.ConfigName;',
        'import me.shedaniel.autoconfig.annotation.ConfigEntry.Gui.TransitiveObject;',
        'import me.shedaniel.cloth.clothconfig.shadowed.blue.endless.jankson.Comment;'
      ],
      mixin: [
        'import org.slf4j.Logger;',
        'import org.slf4j.LoggerFactory;',
        'import org.spongepowered.asm.mixin.Mixin;',
        'import org.spongepowered.asm.mixin.injection.At;',
        'import org.spongepowered.asm.mixin.injection.Inject;',
        'import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;',
        'import net.minecraft.entity.player.PlayerEntity;',
        'import net.minecraft.text.Text;',
      ]
    };

    return [...commonImports, ...(typeImports[type] || [])];
  }

  /**
   * Generate Java class header
   */
  protected javaClassHeader(
    pkg: string,
    className: string,
    type: GeneratorType,
    extraImports: string[] = []
  ): string {
    const imports = [...this.getFabricImports(type), ...extraImports];

    return `package ${pkg};

${imports.map(i => `  ${i}`).join('\n')}

public class ${className} {
  private static final Logger LOGGER = LoggerFactory.getLogger(${this.config.modId.toUpperCase()});

  // Registry field
  public static final ${this.getRegistryType(type).toUpperCase()} ${className.toUpperCase()} =
    Registry.register(
      Registries.${this.getRegistryType(type)},
      ${this.modId(className)},
      new ${className}()
    );
`;
  }

  private getValidationForType(type: GeneratorType): (name: string) => ValidationResult {
    return type === 'command'
      ? Validators.validateModId
      : Validators.validateClassName;
  }

  private getRegistryType(type: GeneratorType): string {
    const registryMap: Record<GeneratorType, string> = {
      entity: 'entity_type',
      block: 'block',
      item: 'item',
      command: 'command',
      renderer: 'entity_renderer',
      screen: 'screen_handler',
      overlay: 'hud_overlay',
      config: 'config',
      mixin: 'mixin'
    };

    return registryMap[type] || type;
  }

  /**
   * Generate complete GenerationResult
   */
  protected createResult(code: string, name: string): GenerationResult {
    return {
      success: true,
      content: code,
      filePath: `src/main/java/${this.config.packageName.replace(/\./g, '/')}/${name}.java`
    };
  }

  /**
   * Log generation stats
   */
  protected logGeneration(type: GeneratorType, name: string, lines: number): void {
    console.log(`✅ Generated ${type}: ${name} (${lines} lines)`);
  }
}
