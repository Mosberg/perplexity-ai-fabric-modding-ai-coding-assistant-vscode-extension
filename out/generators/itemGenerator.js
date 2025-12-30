"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemGenerator = void 0;
const baseGenerator_1 = require("./baseGenerator");
class ItemGenerator extends baseGenerator_1.BaseGenerator {
    async generate(name) {
        this.validateName(name, "item");
        const config = this.getFabricConfig();
        const itemName = name;
        const itemId = itemName.toLowerCase();
        return `package ${config.packageName}.item;

import net.fabricmc.fabric.api.itemgroup.v1.FabricItemGroup;
import net.fabricmc.fabric.api.itemgroup.v1.ItemGroupEvents;
import net.minecraft.item.Item;
import net.minecraft.item.ItemGroups;
import net.minecraft.registry.Registries;
import net.minecraft.registry.Registry;
import net.minecraft.util.Identifier;

public class ${itemName}Item extends Item {
  public static final Item ITEM = Registry.register(
    Registries.ITEM,
    new Identifier("${config.modId}", "${itemId}"),
    new ${itemName}Item(new Item.Settings()
      .maxCount(64)
      .fireproof())
  );

  public ${itemName}Item(Settings settings) {
    super(settings);
  }

  public static void register() {
    ItemGroupEvents.modifyEntriesEvent(ItemGroups.INGREDIENTS)
      .register(content -> content.addAfter(Items.IRON_INGOT, ITEM));
  }
}`;
    }
}
exports.ItemGenerator = ItemGenerator;
//# sourceMappingURL=itemGenerator.js.map