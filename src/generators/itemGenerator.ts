import { BaseGenerator } from './baseGenerator';

export class ItemGenerator extends BaseGenerator {
  async generate(name: string): Promise<string> {
    this.validateName(name, 'item');

    const pkg = this.getPackage('item');
    const itemId = name.toLowerCase();

    const code = `package ${pkg};

import net.minecraft.item.Item;
import net.minecraft.item.ItemGroup;
import net.minecraft.item.ItemStack;
import net.minecraft.client.item.TooltipContext;
import net.minecraft.text.Text;
import net.minecraft.world.World;
import net.minecraft.registry.Registries;
import net.minecraft.registry.Registry;
import net.minecraft.util.Identifier;

public class ${name} extends Item {
  public static final ${name} INSTANCE =
    Registry.register(
      Registries.ITEM,
      ${this.modId(itemId)},
      new ${name}(new Item.Settings()
        .group(ItemGroup.MISC)
        .maxCount(64)
      )
    );

  public ${name}(Settings settings) {
    super(settings);
  }

  @Override
  public void appendTooltip(ItemStack stack, World world, List<Text> tooltip, TooltipContext context) {
    tooltip.add(Text.literal("§6Custom ${name.toLowerCase()}"));
    tooltip.add(Text.literal("§7Right-click for special effect"));
    super.appendTooltip(stack, world, tooltip, context);
  }

  // Uncomment for custom use behavior
  /*
  @Override
  public ActionResult useOnBlock(ItemUsageContext context) {
    // Custom block interaction
    return ActionResult.SUCCESS;
  }
  */
}
`;

    this.logGeneration('item', name, code.split('\n').length);
    return code;
  }
}
