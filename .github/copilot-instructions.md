# 🎮 Perplexity AI Fabric Modding VSCode Extension - Copilot Instructions

**Version 2.0** | **Fabric 1.21.10** | **Java 21** | **TypeScript Strict**

---

## 🎯 **PROJECT MISSION**

AI-powered VSCode extension for **Minecraft Fabric modding** with **10 code generators**, **streaming chat**, **intellisense**, **project scaffolding**, and **Perplexity API** integration.

**Core Value**: One-click Fabric mod creation + AI assistance for professional modders.

---

## 🏗️ **ARCHITECTURE OVERVIEW**

```
src/
├── extension.ts              # VSCode activation + ALL provider registration
├── fabricAgent.ts           # Master orchestrator (generators + chat + API)
├── generators/              # 10 Fabric code generators (Entity, Block, Item...)
├── providers/               # VSCode LSP: chat, completion, hover, webview
├── services/                # HTTP client (Perplexity/DeepSeek API)
├── utils/                   # Code inserter, validators, config, templates
├── types/                   # FabricConfig, GenerationResult, WebviewMessage
└── media/                   # Webview UI (HTML/CSS/JS - 30k+ lines)
```

---

## 🔧 **CRITICAL TECHNICAL SPECS**

### **Fabric Stack (HARD REQUIREMENTS)**

```
Minecraft: 1.21.10
Java: 21
Fabric Loader: 0.18.4
Fabric API: 0.138.4+1.21.10
Loom: 1.14.10
Yarn: 1.21.10+build.3
ModID: "mana"
Package: "dk.mosberg"
```

### **VSCode Extension Stack**

```
TypeScript: Strict mode (tsconfig.json)
API: Perplexity (pplx-...), DeepSeek
Providers: CompletionItemProvider, HoverProvider, WebviewViewProvider
Webview: HTML/CSS/JS (responsive, VSCode theming)
```

---

## 📁 **FILE STRUCTURE & RESPONSIBILITIES**

| File/Path                         | Purpose           | Key Methods                                | Dependencies                    |
| --------------------------------- | ----------------- | ------------------------------------------ | ------------------------------- |
| `extension.ts`                    | **Entry point**   | `activate()`, provider registration        | FabricAgent                     |
| `fabricAgent.ts`                  | **Core brain**    | `generateEntity()`, `getWebviewProvider()` | All generators, providers       |
| `generators/*.ts`                 | **Code gen**      | `generate(name: string)`                   | BaseGenerator, CodeInserter     |
| `providers/webviewProvider.ts`    | **Sidebar UI**    | `resolveWebviewView()`                     | ChatProvider, fabric-agent.html |
| `providers/completionProvider.ts` | **Intellisense**  | `provideCompletionItems()`                 | Fabric snippets                 |
| `providers/hoverProvider.ts`      | **Documentation** | `provideHover()`                           | Fabric API docs                 |
| `utils/codeInserter.ts`           | **Smart insert**  | `insertCode()`, `createFile()`             | VSCode TextDocument             |
| `utils/fabricConfig.ts`           | **Settings**      | `getConfig()`                              | VSCode workspace config         |
| `media/fabric-agent.html`         | **Web UI**        | Quick actions + chat                       | VSCode CSS vars                 |

---

## ⚙️ **DEVELOPER WORKFLOWS**

```
# Development
npm install --legacy-peer-deps
npm run watch                    # Live TypeScript compilation
F5                              # Debug extension

# Production
npm run compile                 # Full build
npm run package                 # .vsix for Marketplace
vsce publish                    # Publish to VSCode Marketplace

# Testing
npm test                        # Jest + VSCode test runner
```

---

## 🎨 **CODE GENERATION PATTERNS** (MANDATORY)

### **1. Java Package Structure**

```
// ALWAYS use dk.mosberg
package dk.mosberg.entity;           // Common code
package dk.mosberg.client.render;    // Client-only
```

### **2. Fabric Registry (1.21.10)**

```
// WRONG (deprecated)
new Identifier("mana", "my_item")

// CORRECT
Identifier.of("mana", "my_item")
Registry.register(Registries.ITEM, id, new Item(new Item.Settings()))
```

### **3. Generator Template**

```
export class EntityGenerator extends BaseGenerator {
  async generate(name: string): Promise<string> {
    this.validateName(name, 'entity');
    return `package dk.mosberg.entity;

public class ${name}Entity extends LivingEntity {
  public static final EntityType<${name}Entity> TYPE =
    Registry.register(Registries.ENTITY_TYPE,
      Identifier.of("mana", "${name.toLowerCase()}"),
      EntityType.Builder.create(...));
}`;
  }
}
```

---

## 🔌 **CRITICAL INTEGRATION POINTS**

### **1. Webview Message Protocol**

```
// Webview → Extension
{ command: 'generateEntity', name: 'DragonEntity' }
{ command: 'sendMessage', text: 'Explain Fabric mixins' }

// Extension → Webview
{ command: 'streamChunk', content: '...' }
{ command: 'streamEnd', content: 'Full response' }
```

### **2. Perplexity API**

```
POST https://api.perplexity.ai/chat/completions
Authorization: Bearer pplx-...
model: llama-3.1-sonar-small-128k-online
stream: true
```

### **3. VSCode Provider Registration**

```
// extension.ts
vscode.languages.registerCompletionItemProvider('java', completionProvider);
vscode.window.registerWebviewViewProvider('fabric.agent', webviewProvider);
```

---

## ✅ **CONVENTIONS & STANDARDS**

| Category       | Rule                                  | Example                                         |
| -------------- | ------------------------------------- | ----------------------------------------------- |
| **Naming**     | PascalCase classes, camelCase methods | `CustomEntity`, `generateEntity()`              |
| **Packages**   | `dk.mosberg.*`                        | `dk.mosberg.entity.CustomEntity`                |
| **Imports**    | Fabric first, alphabetical            | `import net.minecraft.*`, `import dk.mosberg.*` |
| **Validation** | ALWAYS validate inputs                | `Validators.validateClassName(name)`            |
| **Errors**     | Centralized handling                  | `errorHandler.handleError(err)`                 |
| **Tests**      | 90%+ coverage required                | `test/unit/`, `test/integration/`               |

---

## 🚀 **QUICK FIXES** (Most Common Issues)

| Issue               | Solution                                     |
| ------------------- | -------------------------------------------- |
| `npm install` fails | `npm install --legacy-peer-deps`             |
| TypeScript errors   | `npm run compile`, check `tsconfig.json`     |
| Webview blank       | Verify `media/fabric-agent.html` exists      |
| Generators fail     | Check `dk.mosberg` package in generated code |
| API 401             | `Ctrl+Shift+P` → "Fabric AI: Set API Keys"   |

---

## 📊 **FEATURE MATRIX**

| Feature            | Status  | Files                   | Commands           |
| ------------------ | ------- | ----------------------- | ------------------ |
| **10 Generators**  | ✅ Live | `generators/*.ts`       | `fabric.generate*` |
| **Streaming Chat** | ✅ Live | `chatProvider.ts`       | Webview "Send"     |
| **Completions**    | ✅ Live | `completionProvider.ts` | `Ctrl+Space`       |
| **Hovers**         | ✅ Live | `hoverProvider.ts`      | Mouse hover        |
| **Project Setup**  | ✅ Live | `templateManager.ts`    | `fabric.newMod`    |
| **Snippets**       | ✅ Live | `fabric-snippets.json`  | `Ctrl+Space`       |

---

## 🧪 **TESTING CONTRACT**

```
// Every new feature MUST have:
1. Unit test → test/unit/{feature}.test.ts
2. Integration test → test/integration/{feature}.test.ts
3. 90%+ coverage
4. npm test passes
```

---

## 🎉 **SUCCESS METRICS**

```
✅ npm run compile = 0 errors
✅ npm test = 100% pass
✅ F5 = Sidebar loads
✅ API key set = Chat streams
✅ Generate Entity = Java 21 + dk.mosberg + Identifier.of()
✅ Marketplace ready = npm run package
```

---

**This document is the SINGLE SOURCE OF TRUTH for all Fabric AI development.**

Please follow these instructions meticulously to ensure consistency, quality, and maintainability across the entire codebase.

---
