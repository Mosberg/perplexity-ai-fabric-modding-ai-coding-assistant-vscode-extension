import { BaseGenerator } from './baseGenerator';

export class OverlayGenerator extends BaseGenerator {
  async generate(name: string): Promise<string> {
    this.validateName(name, 'overlay');

    const pkg = this.getPackage('overlay');

    const code = `package ${pkg};

import net.fabricmc.fabric.api.client.rendering.v1.HudRenderCallback;
import net.minecraft.client.MinecraftClient;
import net.minecraft.client.gui.DrawContext;
import net.minecraft.client.util.math.MatrixStack;
import net.minecraft.text.Text;
import net.minecraft.util.math.MathHelper;
import net.fabricmc.api.EnvType;
import net.fabricmc.api.Environment;

@Environment(EnvType.CLIENT)
public class ${name}Overlay implements HudRenderCallback {
  private static final int X = 10;
  private static final int Y = 10;
  private static boolean enabled = true;

  public static void register() {
    HudRenderCallback.EVENT.register(${name}Overlay::render);
  }

  public static void toggle() {
    enabled = !enabled;
  }

  private static void render(DrawContext drawContext, float tickDelta) {
    if (!enabled) return;

    MinecraftClient client = MinecraftClient.getInstance();
    if (client.player == null || client.options.debugEnabled) return;

    MatrixStack matrices = drawContext.getMatrices();

    // Example: Player health/mana bar
    float health = client.player.getHealth();
    float maxHealth = client.player.getMaxHealth();
    float healthPercent = MathHelper.clamp(health / maxHealth, 0.0f, 1.0f);

    // Background
    drawContext.fill(matrices, X, Y, X + 81, Y + 9, 0x80000000);

    // Health bar
    int barWidth = (int)(80 * healthPercent);
    int color = healthPercent > 0.6f ? 0xFF00FF00 : healthPercent > 0.3f ? 0xFFFFFF00 : 0xFFFF0000;
    drawContext.fill(matrices, X + 1, Y + 1, X + 1 + barWidth, Y + 8, color);

    // Text overlay
    String healthText = String.format("%.1f/%.1f HP", health, maxHealth);
    drawContext.drawText(
      client.textRenderer,
      healthText,
      X + 2,
      Y + 1,
      0xFFFFFFFF,
      true
    );
  }
}
`;

    // Registration code
    const registrationCode = `
// Add to ManaClient.onInitializeClient():
${name}Overlay.register();`;

    this.logGeneration('overlay', name, code.split('\n').length);
    return code + '\n\n/* Registration: */\n' + registrationCode;
  }
}
