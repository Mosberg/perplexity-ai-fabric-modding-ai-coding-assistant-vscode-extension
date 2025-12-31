"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoverProvider = void 0;
const vscode_1 = require("vscode");
class HoverProvider {
    constructor(agent) {
        this.agent = agent;
        this.fabricDocs = {
            // Registry API (1.21.10)
            'Registry.register': `**Registry.register** \\n\\nRegisters objects in Minecraft's registry system.\\n\\n**Usage:**\\n\\\`\\\`\\\`java\\nRegistry.register(\\n  Registries.ITEM,\\n  Identifier.of("mana", "my_item"),\\n  new Item(new Item.Settings())\\n);\\n\\\`\\\`\\\`\\n\\n**Parameters:**\\n- \\\`RegistryKey<T>\`: BLOCK, ITEM, ENTITY_TYPE, etc.\\n- \\\`Identifier\\\`: modid:path format\\n- \\\`T\\\`: Your class instance`,
            'Identifier.of': `**Identifier.of** \\n\\n**NEW in 1.21.10** - Replaces deprecated constructor.\\n\\n**Usage:**\\n\\\`\\\`\\\`java\\nIdentifier.of("mana", "my_item")\\n\\\`\\\`\\\`\\n\\n**Arguments:**\\n- modid: lowercase letters/numbers/underscores\\n- path: same format`,
            'EntityType.Builder': `**EntityType.Builder.create** \\n\\nCreates entity types with spawn rules and dimensions.\\n\\n**Usage:**\\n\\\`\\\`\\\`java\\nEntityType.Builder.create(\\n  MyEntity::new,\\n  SpawnGroup.CREATURE\\n).dimensions(0.6f, 1.8f)\\n.build("my_entity")\\n\\\`\\\`\\\``,
            // Block API
            'FabricBlockSettings': `**FabricBlockSettings.create** \\n\\nModern block settings builder.\\n\\n**Usage:**\\n\\\`\\\`\\\`java\\nFabricBlockSettings.create()\\n  .material(Material.STONE)\\n  .strength(3.0f, 9.0f)\\n  .sounds(BlockSoundGroup.STONE)\\n\\\`\\\`\\\``,
            // Common imports
            'Registries': '**Registries** \\n\\nGlobal registry keys:\\n- Registries.BLOCK\\n- Registries.ITEM\\n- Registries.ENTITY_TYPE\\n- Registries.COMMAND',
            'SpawnGroup': '**SpawnGroup** \\n\\nEntity spawn categories:\\n**CREATURE** (animals)\\n**MONSTER** (hostile)\\n**WATER_CREATURE** (fish)\\n**AMBIENT** (bats)'
        };
    }
    async provideHover(document, position) {
        const wordRange = document.getWordRangeAtPosition(position, /[a-zA-Z_][a-zA-Z0-9_]*/i);
        if (!wordRange) {
            return undefined;
        }
        const word = document.getText(wordRange);
        // Check built-in docs first
        if (this.fabricDocs[word]) {
            return new vscode_1.Hover(new vscode_1.MarkdownString(this.fabricDocs[word]));
        }
        // AI-powered hover for unknown symbols
        try {
            const lineContent = document.lineAt(position).text;
            const explanation = await this.agent.chat(`Explain this Fabric code symbol: "${word}"\\nContext: ${lineContent}\\nFile type: ${document.languageId}`);
            return new vscode_1.Hover(new vscode_1.MarkdownString(explanation));
        }
        catch {
            // Fallback to empty hover
            return undefined;
        }
    }
}
exports.HoverProvider = HoverProvider;
//# sourceMappingURL=hoverProvider.js.map