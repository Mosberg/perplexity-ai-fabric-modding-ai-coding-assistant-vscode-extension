# Fabric Minecraft Mod Template

Complete, production-ready template for Minecraft **1.21.10** using Fabric Loader **0.18.4**, Loom **1.14.10**, Gradle **9.2.1**, and Java **21**.[1][2]

## Features

- ✅ **Split environment source sets** (client/main separation)
- ✅ **ModMenu + Cloth Config** integration
- ✅ **Maven publishing** ready
- ✅ **GitHub Actions** CI/CD
- ✅ **JUnit 6** testing suite
- ✅ **Configuration cache** optimized
- ✅ **Latest verified versions** (Dec 2025)

## 📁 Project Structure

```
└── ${mod_name}/
    ├── .github/workflows/build.yml
    ├── gradle/wrapper/
    │   ├── gradle-wrapper.jar
    │   └── gradle-wrapper.properties
    ├── src/
    │   ├── client/java/com/${mod_id}/
    │   │   ├── ${mod_name}Client.java
    │   │   └── config/${mod_name}ModMenu.java
    │   ├── client/resources/${mod_name}.client.mixins.json
    │   ├── main/java/com/${mod_id}/${mod_name}.java
    │   └── main/resources/
    │       ├── assets/${mod_id}/icon.png
    │       ├── fabric.mod.json
    │       └── ${mod_name}.mixins.json
    ├── .gitattributes          .gitignore
    ├── build.gradle           gradle.properties
    ├── gradlew                gradlew.bat
    ├── LICENSE                settings.gradle
```

## 🚀 Quick Start

```bash
# Clone & enter project
git clone <your-repo> ${mod_name}
cd ${mod_name}

# Generate Minecraft sources (IDE setup)
./gradlew genSources

# Build mod JAR
./gradlew build

# Run client (F5 in IDE after import)
./gradlew runClient

# Run server
./gradlew runServer
```

**Output JAR**: `build/libs/${mod_id}-${mod_version}.jar`

## ⚙️ IDE Setup

### IntelliJ IDEA / Android Studio

1. `File > Open` → Select `build.gradle`
2. `Gradle → Reload Gradle Projects`
3. `Run → Edit Configurations` → Use generated `Minecraft Client/Server`

### VS Code

1. Install **Java Extension Pack**
2. Install **Fabric for Minecraft** extension
3. `Ctrl+Shift+P` → `Gradle: Refresh`

## 🔧 Build Commands

| Command                         | Purpose                |
| ------------------------------- | ---------------------- |
| `./gradlew build`               | Build production JAR   |
| `./gradlew publishToMavenLocal` | Install to local Maven |
| `./gradlew projectInfo`         | Show version info      |
| `./gradlew test`                | Run unit tests         |
| `./gradlew clean`               | Clean build artifacts  |
| `./gradlew javadoc`             | Generate documentation |

## 📦 Dependencies

**Core** (bundled):

- Fabric API `0.138.4+1.21.10`
- Fabric Loader `0.18.4`
- Yarn `1.21.10+build.3`

**Optional** (dev enhancements):

- ModMenu `16.0.0-rc.1`
- Cloth Config `19.0.147`

## 🛠 Customization

### Update Versions

Edit `gradle.properties` and run `./gradlew projectInfo` to verify:

```
minecraft_version=1.21.10
fabric_version=0.138.4+1.21.10
```

### Mod Metadata

Replace placeholders in `gradle.properties`:

```
mod_id=yourmodid
mod_name="Your Mod Name"
mod_version=1.0.0
mod_author=YourName
```

### Publishing

Uncomment repositories in `build.gradle`:

```gradle
repositories {
    maven {
        name = "Modrinth"
        url = "https://api.modrinth.com/maven"
        // Add credentials
    }
}
```

## ✅ Verified Compatibility

| Tool      | Version | Status |
| --------- | ------- | ------ |
| Gradle    | 9.2.1   | ✅ [3] |
| Java      | 21      | ✅     |
| Loom      | 1.14.10 | ✅     |
| Minecraft | 1.21.10 | ✅ [1] |

## 🔍 Troubleshooting

**"Task not found"**: `./gradlew --refresh-dependencies`

**"Sources not found"**: `./gradlew genSources`

**"Gradle version mismatch"**: Use `./gradlew wrapper --gradle-version 9.2.1`

**Mod not loading**: Check `latest.log` in `.minecraft/logs`

## 📚 Development Workflow

```
1. Code → ./gradlew build
2. Test → ./gradlew runClient
3. Commit → git push
4. CI builds → GitHub Actions
5. Publish → ./gradlew publish
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/mod-feature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push & PR

## 📄 License

[Your License] - See `LICENSE` file.

## 🔗 Links

- [Fabric Template Generator](https://fabricmc.net/develop/template/)[4]
- [Fabric Wiki](https://fabricmc.net/wiki/)[5]
- [Modrinth](https://modrinth.com/)
- [CurseForge](https://www.curseforge.com/minecraft/mc-mods)

---

**Built with ❤️ by Mosberg for Minecraft 1.21.10** | _Last verified: Dec 31, 2025_ [2][6]
