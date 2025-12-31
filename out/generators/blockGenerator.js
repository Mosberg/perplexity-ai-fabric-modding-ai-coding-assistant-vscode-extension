"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockGenerator = void 0;
const baseGenerator_1 = require("./baseGenerator");
class BlockGenerator extends baseGenerator_1.BaseGenerator {
    async generate(name) {
        this.validateName(name, 'block');
        const pkg = this.getPackage('block');
        const blockId = name.toLowerCase();
        const code = `package ${pkg};

import net.minecraft.block.Block;
import net.minecraft.block.BlockState;
import net.minecraft.block.Material;
import net.minecraft.block.ShapeContext;
import net.minecraft.item.BlockItem;
import net.minecraft.item.Item;
import net.minecraft.item.ItemGroup;
import net.minecraft.sound.BlockSoundGroup;
import net.minecraft.util.math.BlockPos;
import net.minecraft.util.shape.VoxelShape;
import net.minecraft.util.shape.VoxelShapes;
import net.minecraft.world.BlockView;
import net.minecraft.registry.Registries;
import net.minecraft.registry.Registry;
import net.minecraft.util.Identifier;

public class ${name}Block extends Block {
  public static final ${name}Block INSTANCE =
    Registry.register(
      Registries.BLOCK,
      ${this.modId(blockId)},
      new ${name}Block(FabricBlockSettings.create())
    );

  public static final Item ITEM = Registry.register(
    Registries.ITEM,
    ${this.modId(blockId)},
    new BlockItem(INSTANCE, new Item.Settings().groups(ItemGroup.BUILDING_BLOCKS))
  );

  public ${name}Block(Settings settings) {
    super(settings
      .material(Material.STONE)
      .strength(3.0f, 9.0f)
      .sounds(BlockSoundGroup.STONE));
  }

  @Override
  public VoxelShape getOutlineShape(BlockState state, BlockView world, BlockPos pos, ShapeContext context) {
    return VoxelShapes.cuboid(0.0, 0.0, 0.0, 1.0, 1.0, 1.0);
  }
}
`;
        this.logGeneration('block', name, code.split('\n').length);
        return code;
    }
}
exports.BlockGenerator = BlockGenerator;
//# sourceMappingURL=blockGenerator.js.map