import { BaseGenerator } from "./baseGenerator";

// src/generators/mixinGenerator.ts
export class MixinGenerator extends BaseGenerator {
  async generate(name: string): Promise<string> {
    return `@Mixin(LivingEntity.class)
public class ${name}Mixin {
  @Inject(method = "damage", at = @At("HEAD"), cancellable = true)
  private void onDamage(DamageSource source, float amount, CallbackInfoReturnable<Boolean> cir) {
    // Custom damage logic
  }
}`;
  }
}
