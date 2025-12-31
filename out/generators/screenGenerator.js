"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenGenerator = void 0;
const baseGenerator_1 = require("./baseGenerator");
class ScreenGenerator extends baseGenerator_1.BaseGenerator {
    async generate(name) {
        this.validateName(name, 'screen');
        const pkg = this.getPackage('screen');
        const screenHandlerName = name.replace('Screen', 'ScreenHandler');
        const code = `package ${pkg};

import net.minecraft.client.gui.screen.ingame.HandledScreens;
import net.minecraft.client.gui.screen.ingame.HandledScreen;
import net.minecraft.entity.player.PlayerInventory;
import net.minecraft.text.Text;
import net.minecraft.screen.ScreenHandler;
import net.minecraft.screen.slot.Slot;
import net.minecraft.util.Identifier;
import net.fabricmc.api.EnvType;
import net.fabricmc.api.Environment;

@Environment(EnvType.CLIENT)
public class ${name} extends HandledScreen<${screenHandlerName}> {
  private static final Identifier TEXTURE =
    Identifier.of("${this.config.modId}", "textures/gui/${name.toLowerCase()}.png");

  public ${name}(${screenHandlerName} handler, PlayerInventory inventory, Text title) {
    super(handler, inventory, title);
    this.backgroundWidth = 176;
    this.backgroundHeight = 166;
    this.titleX = (this.backgroundWidth - this.textRenderer.getWidth(title)) / 2;
  }

  @Override
  public void render(MatrixStack matrices, int mouseX, int mouseY, float delta) {
    this.renderBackground(matrices, mouseX, mouseY, delta);
    super.render(matrices, mouseX, mouseY, delta);
    this.drawMouseoverTooltip(matrices, mouseX, mouseY);
  }

  @Override
  protected void drawBackground(MatrixStack matrices, float delta, int mouseX, int mouseY) {
    RenderSystem.setShaderTexture(0, TEXTURE);
    this.drawTexture(matrices, this.x, this.y, 0, 0, this.backgroundWidth, this.backgroundHeight);
  }

  @Override
  protected void init() {
    super.init();
    // Custom button initialization
    // this.addDrawableChild(ButtonWidget.builder(...));
  }

  @Override
  public boolean mouseClicked(double mouseX, double mouseY, int button) {
    // Custom click handling
    return super.mouseClicked(mouseX, mouseY, button);
  }
}

// Registration (add to client initializer):
// HandledScreens.register(${screenHandlerName}.TYPE, ${name}::new);
`;
        this.logGeneration('screen', name, code.split('\n').length);
        return code;
    }
}
exports.ScreenGenerator = ScreenGenerator;
//# sourceMappingURL=screenGenerator.js.map