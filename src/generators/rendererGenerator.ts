import { BaseGenerator } from './baseGenerator';

export class RendererGenerator extends BaseGenerator {
  async generate(name: string): Promise<string> {
    this.validateName(name, 'renderer');

    const entityName = name.replace('Renderer', '');
    const pkg = this.getPackage('renderer');

    const code = `package ${pkg};

import net.fabricmc.api.EnvType;
import net.fabricmc.api.Environment;
import net.minecraft.client.render.VertexConsumerProvider;
import net.minecraft.client.render.entity.EntityRendererFactory;
import net.minecraft.client.render.entity.LivingEntityRenderer;
import net.minecraft.client.util.math.MatrixStack;
import net.minecraft.util.Identifier;
import ${this.config.packageName}.entity.${entityName}Entity;

@Environment(EnvType.CLIENT)
public class ${name} extends LivingEntityRenderer<${entityName}Entity, ${entityName}Model> {
  private static final Identifier TEXTURE =
    Identifier.of("${this.config.modId}", "textures/entity/${entityName.toLowerCase()}.png");

  public ${name}(EntityRendererFactory.Context context) {
    super(context, new ${entityName}Model(context.getPart(EntityModelLayers.${entityName.toUpperCase()}_MAIN)), 0.5F);
  }

  @Override
  public Identifier getTexture(${entityName}Entity entity) {
    return TEXTURE;
  }

  @Override
  public void render(
    ${entityName}Entity entity,
    float yaw,
    float tickDelta,
    MatrixStack matrices,
    VertexConsumerProvider vertexConsumers,
    int light
  ) {
    super.render(entity, yaw, tickDelta, matrices, vertexConsumers, light);

    // Custom rendering effects
    if (entity.isGlowing()) {
      // Add glowing effect
      this.getTexture(entity);
    }
  }

  @Override
  protected float getLerpBobAmount(${entityName}Entity entity) {
    return 0.1F; // Custom bob animation
  }
}
`;

    // Client registration code
    const registrationCode = `
// Add to ManaClient.onInitializeClient():
EntityRendererRegistry.register(${entityName}Entity.TYPE, ${name}::new);`;

    this.logGeneration('renderer', name, code.split('\n').length);
    return code + '\n\n/* Registration: */\n' + registrationCode;
  }
}
