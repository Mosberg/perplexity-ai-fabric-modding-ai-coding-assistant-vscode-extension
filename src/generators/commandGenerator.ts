import { BaseGenerator } from "./baseGenerator";

export class CommandGenerator extends BaseGenerator {
  async generate(name: string): Promise<string> {
    this.validateName(name, "command");

    const config = this.getFabricConfig();
    const commandName = name.toLowerCase();

    return `package ${config.packageName}.command;

import com.mojang.brigadier.CommandDispatcher;
import com.mojang.brigadier.arguments.IntegerArgumentType;
import net.fabricmc.fabric.api.command.v2.CommandRegistrationCallback;
import net.minecraft.server.command.CommandManager;
import net.minecraft.server.command.ServerCommandSource;
import net.minecraft.server.network.ServerPlayerEntity;
import net.minecraft.text.Text;

public class ${commandName}Command {
  public static void register() {
    CommandRegistrationCallback.EVENT.register((dispatcher, registryAccess, environment) -> {
      dispatcher.register(CommandManager.literal("${commandName}")
        .then(CommandManager.argument("amount", IntegerArgumentType.integer(1))
          .executes(context -> execute(context.getSource(), IntegerArgumentType.getInteger(context, "amount"))))
        .executes(context -> execute(context.getSource(), 1)));
    });
  }

  private static int execute(ServerCommandSource source, int amount) {
    ServerPlayerEntity player = source.getPlayer();
    if (player != null) {
      player.sendMessage(Text.literal("Gave " + amount + " items!"), true);
      // Add item giving logic here
    }
    return 1;
  }
}`;
  }
}
