"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigGenerator = void 0;
const baseGenerator_1 = require("./baseGenerator");
class ConfigGenerator extends baseGenerator_1.BaseGenerator {
    async generate(name) {
        this.validateName(name, 'config');
        const pkg = this.getPackage('config');
        const configName = name.replace('Config', '');
        const code = `package ${pkg};

import me.shedaniel.autoconfig.ConfigData;
import me.shedaniel.autoconfig.annotation.ConfigEntry.Gui.RequiresRestart;
import me.shedaniel.autoconfig.annotation.ConfigName;
import me.shedaniel.autoconfig.annotation.ConfigEntry.Gui.TransitiveObject;
import me.shedaniel.cloth.clothconfig.shadowed.blue.endless.jankson.Comment;

@ConfigName("${configName}")
public class ${name} implements ConfigData {

  @Comment("General mod settings")
  public General general = new General();

  @Comment("Entity spawn rates")
  public Entities entities = new Entities();

  public static class General {
    @Comment("Enable custom features")
    public boolean enableCustomFeatures = true;

    @Comment("Debug logging")
    public boolean debugMode = false;
  }

  public static class Entities {
    @Comment("Custom entity spawn weight")
    public int ${configName.toLowerCase()}SpawnWeight = 10;

    @Comment("Minimum spawn group size")
    public int minGroupSize = 1;

    @Comment("Maximum spawn group size")
    public int maxGroupSize = 4;
  }
}
`;
        // Config registration code
        const registrationCode = `
// Add to Mana.onInitialize():
${configName}Config.init(${configName}Config.class);

// Client config screen (add to ManaClient):
// ConfigScreenRegistry.register(${configName}Config.class, ${configName}ConfigScreen::new);
`;
        this.logGeneration('config', name, code.split('\n').length);
        return code + '\n\n/* Registration: */\n' + registrationCode;
    }
}
exports.ConfigGenerator = ConfigGenerator;
//# sourceMappingURL=configGenerator.js.map