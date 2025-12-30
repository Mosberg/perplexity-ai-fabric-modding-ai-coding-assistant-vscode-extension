"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockGenerator = void 0;
const baseGenerator_1 = require("./baseGenerator");
class BlockGenerator extends baseGenerator_1.BaseGenerator {
    async generate(name) {
        this.validateName(name, "block");
        const config = this.getFabricConfig();
        const blockName = name;
        const blockId = blockName.toLowerCase();
        return `package ${config.packageName}.block;

import net.fabricmc.fabric.api.itemgroup.v1.ItemGroupEvents;
import net.fabricmc.fabric.api.object.builder.v1.block.FabricBlockSettings;
import net.minecraft.block.Block;
import net.minecraft.block.Material;
import net.minecraft.item.BlockItem;
import net.minecraft.item.Item;
import net.minecraft.item.ItemGroups;
import net.minecraft.registry.Registries;
import net.minecraft.registry.Registry;
import net.minecraft.sound.BlockSoundGroup;
import net.minecraft.util.Identifier;

public class ${blockName}Block extends Block {
  public static final Block BLOCK = Registry.register(
    Registries.BLOCK,
    new Identifier("${config.modId}", "${blockId}"),
    new ${blockName}Block(FabricBlockSettings.create()
      .strength(3.0f, 9.0f)
      .sounds(BlockSoundGroup.STONE)
      .material(Material.STONE))
  );

  public static final Item BLOCK_ITEM = Registry.register(
    Registries.ITEM,
    new Identifier("${config.modId}", "${blockId}"),
    new BlockItem(BLOCK, new Item.Settings())
  );

  public ${blockName}Block(Settings settings) {
    super(settings);
  }

  public static void register() {
    ItemGroupEvents.modifyEntriesEvent(ItemGroups.BUILDING_BLOCKS)
      .register(content -> content.add(BLOCK_ITEM));
  }
}`;
    }
}
exports.BlockGenerator = BlockGenerator;
//# sourceMappingURL=blockGenerator.js.map