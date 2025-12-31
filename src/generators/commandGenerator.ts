import { BaseGenerator } from './baseGenerator';

export class CommandGenerator extends BaseGenerator {
  async generate(name: string): Promise<string> {
    this.validateName(name, 'command');

    const pkg = this.getPackage('command');
    const commandId = name.toLowerCase();

    const code = `package ${pkg};

import com.mojang.brigadier.CommandDispatcher;
import com.mojang.brigadier.arguments.IntegerArgumentType;
import com.mojang.brigadier.context.CommandContext;
import net.fabricmc.fabric.api.command.v2.CommandRegistrationCallback;
import net.minecraft.server.command.CommandManager;
import net.minecraft.server.command.ServerCommandSource;
import net.minecraft.server.network.ServerPlayerEntity;
import net.minecraft.text.Text;

public class ${name}Command {
  public static void register() {
    CommandRegistrationCallback.EVENT.register((dispatcher, registryAccess, environment) -> {
      dispatcher.register(
        CommandManager.literal("${commandId}")
          .then(CommandManager.argument("amount", IntegerArgumentType.integer(1, 64))
            .executes(${name}Command::execute))
          .executes(${name}Command::executeNoArgs)
      );
    });
  }

  private static int executeNoArgs(CommandContext<ServerCommandSource> context) {
    return execute(context, 1);
  }

  private static int execute(CommandContext<ServerCommandSource> context, int amount) {
    ServerPlayerEntity player = context.getSource().getPlayer();

    if (player != null) {
      // Example: Give player items
      ItemStack stack = new ItemStack(Items.DIAMOND, amount);
      player.getInventory().insertStack(stack);

      context.getSource().sendFeedback(
        () -> Text.literal("§aGave " + amount + " diamonds!"),
        false
      );
    }

    return 1;
  }
}
`;

    // Register in main mod class
    const registrationCode = `
// Add to Mana.onInitialize():
${name}Command.register();`;

    this.logGeneration('command', name, code.split('\n').length);
    return code + '\n\n' + registrationCode;
  }
}
