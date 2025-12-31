import { BaseGenerator } from './baseGenerator';

export class MixinGenerator extends BaseGenerator {
  async generate(name: string): Promise<string> {
    this.validateName(name, 'mixin');

    const pkg = this.getPackage('mixin');
    const targetClass = name.replace('Mixin', '');

    const code = `package ${pkg};

import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;
import net.minecraft.entity.player.PlayerEntity;
import net.minecraft.text.Text;

@Mixin(${targetClass}.class)
public class ${name} {

  @Inject(method = "tick", at = @At("HEAD"))
  private void onTick(CallbackInfo ci) {
    if (((PlayerEntity)(Object)this).getWorld().isClient) {
      return;
    }

    PlayerEntity player = (PlayerEntity)(Object)this;

    // Example: Custom tick behavior
    if (player.isSneaking()) {
      player.sendMessage(Text.literal("§6[MIXIN] §rSneaking detected!"), true);
    }
  }

  @Inject(method = "damage", at = @At("HEAD"), cancellable = true)
  private void modifyDamage(DamageSource source, float amount, CallbackInfo ci) {
    PlayerEntity player = (PlayerEntity)(Object)this;

    // Example: Damage modification
    if (source.isOutOfWorld() && player.getHealth() < 5.0f) {
      // Prevent death from void damage when low health
      ci.cancel();
      player.sendMessage(Text.literal("§cVoid protection activated!"), true);
    }
  }

  // Shadow fields for access
  @Shadow public abstract boolean isSneaking();

  @Shadow public abstract float getHealth();
}
`;

// Mixin config (mixins/mana.mixins.json)
// Example config:
// {
//   "required": true,
//   "minVersion": "0.8",
//   "package": "${pkg.replace('dk.mosberg.', '')}",
//   "compatibilityLevel": "JAVA_21",
//   "refmap": "mana.refmap.json",
//   "mixins": [],
//   "client": [
//     "${name}.json"
//   ],
//   "injectors": {
//     "defaultRequire": 1
//   }
// }

// Individual mixin JSON
// (No variable needed, config shown in comment above)

    this.logGeneration('mixin', name, code.split('\n').length);
    return code + '\n\n/*\nMixin config entries:\n1. mana.mixins.json → client[]\n2. Create ${name}.json\n*/';
  }
}
