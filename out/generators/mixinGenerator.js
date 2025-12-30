"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MixinGenerator = void 0;
const baseGenerator_1 = require("./baseGenerator");
// src/generators/mixinGenerator.ts
class MixinGenerator extends baseGenerator_1.BaseGenerator {
    async generate(name) {
        return `@Mixin(LivingEntity.class)
public class ${name}Mixin {
  @Inject(method = "damage", at = @At("HEAD"), cancellable = true)
  private void onDamage(DamageSource source, float amount, CallbackInfoReturnable<Boolean> cir) {
    // Custom damage logic
  }
}`;
    }
}
exports.MixinGenerator = MixinGenerator;
//# sourceMappingURL=mixinGenerator.js.map