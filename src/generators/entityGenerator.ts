import { BaseGenerator } from './baseGenerator';

export class EntityGenerator extends BaseGenerator {
  async generate(name: string): Promise<string> {
    this.validateName(name, 'entity');

    const pkg = this.getPackage('entity');
    const entityId = name.toLowerCase();

    const code = `package ${pkg};

import net.minecraft.entity.EntityType;
import net.minecraft.entity.LivingEntity;
import net.minecraft.entity.ai.goal.MeleeAttackGoal;
import net.minecraft.entity.ai.goal.WanderAroundFarGoal;
import net.minecraft.entity.ai.goal.LookAroundGoal;
import net.minecraft.entity.attribute.DefaultAttributeContainer;
import net.minecraft.entity.attribute.EntityAttributes;
import net.minecraft.entity.damage.DamageSource;
import net.minecraft.entity.player.PlayerEntity;
import net.minecraft.world.World;
import net.minecraft.sound.SoundEvent;
import net.minecraft.util.Identifier;
import net.minecraft.registry.Registries;
import net.minecraft.registry.Registry;
import net.minecraft.entity.SpawnGroup;

public class ${name}Entity extends LivingEntity {
  public static final EntityType<${name}Entity> TYPE =
    Registry.register(
      Registries.ENTITY_TYPE,
      ${this.modId(entityId)},
      EntityType.Builder
        .create(${name}Entity::new, SpawnGroup.CREATURE)
        .dimensions(0.6f, 1.8f)
        .build("${entityId}")
    );

  public ${name}Entity(EntityType<${name}Entity> entityType, World world) {
    super(entityType, world);
  }

  @Override
  protected void initGoals() {
    this.goalSelector.add(1, new MeleeAttackGoal(this, 1.2D, false));
    this.goalSelector.add(2, new WanderAroundFarGoal(this, 1.0D));
    this.goalSelector.add(3, new LookAroundGoal(this));
  }

  @Override
  public DefaultAttributeContainer.Builder createAttributeMap() {
    return DefaultAttributeContainer.createBuilder()
        .add(EntityAttributes.GENERIC_MAX_HEALTH, 20.0D)
        .add(EntityAttributes.GENERIC_MOVEMENT_SPEED, 0.25D)
        .add(EntityAttributes.GENERIC_ATTACK_DAMAGE, 3.0D)
        .add(EntityAttributes.GENERIC_FOLLOW_RANGE, 32.0D);
  }

  @Override
  public boolean damage(DamageSource source, float amount) {
    if (this.isInvulnerableTo(source)) {
      return false;
    }
    return super.damage(source, amount);
  }

  @Override
  protected SoundEvent getHurtSound(DamageSource source) {
    return SoundEvents.ENTITY_GENERIC_HURT;
  }

  @Override
  protected SoundEvent getDeathSound() {
    return SoundEvents.ENTITY_GENERIC_DEATH;
  }

  @Override
  public boolean canBeControlledByRider() {
    return false;
  }
}
`;

    this.logGeneration('entity', name, code.split('\n').length);
    return code;
  }
}
