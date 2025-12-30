"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityGenerator = void 0;
const baseGenerator_1 = require("./baseGenerator");
class EntityGenerator extends baseGenerator_1.BaseGenerator {
    async generate(name) {
        this.validateName(name, "entity");
        const config = this.getFabricConfig();
        const entityName = name;
        const entityId = entityName.toLowerCase();
        return `package ${config.packageName}.entity;

import net.fabricmc.api.EnvType;
import net.fabricmc.api.Environment;
import net.minecraft.entity.EntityType;
import net.minecraft.entity.LivingEntity;
import net.minecraft.entity.ai.goal.MeleeAttackGoal;
import net.minecraft.entity.ai.goal.WanderAroundFarGoal;
import net.minecraft.entity.attribute.DefaultAttributeContainer;
import net.minecraft.entity.attribute.EntityAttributes;
import net.minecraft.entity.damage.DamageSource;
import net.minecraft.entity.player.PlayerEntity;
import net.minecraft.item.Item;
import net.minecraft.item.Items;
import net.minecraft.recipe.Ingredient;
import net.minecraft.sound.SoundEvent;
import net.minecraft.util.Identifier;
import net.minecraft.world.World;

${this.getFabricImports().join("\n")}

public class ${entityName}Entity extends LivingEntity {
  public static final EntityType<${entityName}Entity> TYPE =
    Registry.register(Registries.ENTITY_TYPE,
      new Identifier("${config.modId}", "${entityId}"),
      EntityType.Builder.create(${entityName}Entity::new, SpawnGroup.CREATURE)
        .dimensions(0.6f, 1.8f)
        .build("${entityId}")
    );

  public ${entityName}Entity(EntityType<? extends ${entityName}Entity> entityType, World world) {
    super(entityType, world);
  }

  @Override
  protected void initGoals() {
    this.goalSelector.add(1, new MeleeAttackGoal(this, 1.0, true));
    this.goalSelector.add(7, new WanderAroundFarGoal(this, 1.0));
  }

  public static DefaultAttributeContainer.Builder createAttributes() {
    return LivingEntity.createLivingAttributes()
      .add(EntityAttributes.GENERIC_MAX_HEALTH, 20.0)
      .add(EntityAttributes.GENERIC_MOVEMENT_SPEED, 0.25)
      .add(EntityAttributes.GENERIC_ATTACK_DAMAGE, 3.0)
      .add(EntityAttributes.GENERIC_FOLLOW_RANGE, 32.0);
  }

  @Override
  protected SoundEvent getAmbientSound() {
    return SoundEvents.ENTITY_ZOMBIE_AMBIENT;
  }

  @Override
  protected SoundEvent getHurtSound(DamageSource source) {
    return SoundEvents.ENTITY_ZOMBIE_HURT;
  }

  @Override
  protected SoundEvent getDeathSound() {
    return SoundEvents.ENTITY_ZOMBIE_DEATH;
  }

  @Override
  public Ingredient getBreedItem() {
    return Ingredient.ofItems(Items.WHEAT);
  }

  // Client-side renderer registration
  @Environment(EnvType.CLIENT)
  public static void registerRenderer() {
    // EntityRendererRegistry.register(TYPE, ${entityName}EntityRenderer::new);
  }
}`;
    }
}
exports.EntityGenerator = EntityGenerator;
//# sourceMappingURL=entityGenerator.js.map