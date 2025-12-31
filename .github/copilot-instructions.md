# 🎮 Perplexity AI Fabric Modding VSCode Extension - Copilot Instructions

**Version 2.0** | **Fabric 1.21.10** | **Java 21** | **TypeScript Strict** | **COMPLETE**

---

## 🎯 **PROJECT MISSION**
**AI-powered VSCode extension** for **Minecraft Fabric modding** with **10 code generators**, **streaming chat**, **intellisense**, **project scaffolding**, and **Perplexity API** integration.

---

## 🏗️ **FILE STRUCTURE** (32 FILES)

```
📦 Root
├── package.json (manifest + 12 commands)
├── tsconfig.json (strict TypeScript)
├── .vscodeignore (packaging)
└── README.md (Marketplace)

📁 src/
├── extension.ts (activation + providers)
├── fabricAgent.ts (10 generators + orchestration)
├── services/http-client.ts (Perplexity streaming)
├── utils/ (error-handler, validators, codeInserter, fabricConfig)
├── types/ (fabric.types, improved-types)
├── generators/ (10x: entity, block, item, command, renderer...)
└── providers/ (webview, chat, completion, hover)

📁 media/ (Webview UI)
├── fabric-agent.html (tabs + 10 buttons)
├── fabric-agent.css (VSCode themes)
└── fabric-agent.js (streaming + events)

📁 snippets/
└── fabric-snippets.json (50+ snippets)
```

---

## 🔧 **CRITICAL SPECS** (NEVER DEVIATE)

```
Minecraft:     1.21.10 ✅
Java:         21 ✅
Fabric Loader: 0.18.4 ✅
Fabric API:   0.138.4+1.21.10 ✅
Package:      dk.mosberg.* ✅
Mod ID:       "mana" ✅
Identifier:   Identifier.of("mana", "name") ✅
Registry:     Registry.register(Registries.XXX, id, value) ✅
```

---

## ⚙️ **DEVELOPER WORKFLOWS**

```
npm install --legacy-peer-deps  # FIXED deps
npm run compile                 # 0 errors
F5                             # Debug
npm run package                 # .vsix
vsce publish                    # Marketplace
```

---

## 🎨 **GENERATOR OUTPUT** (MANDATORY FORMAT)

```
// Entity (ALL generators produce this EXACT pattern)
package dk.mosberg.entity;

public class CustomEntity extends LivingEntity {
  public static final EntityType<CustomEntity> TYPE =
    Registry.register(Registries.ENTITY_TYPE,
      Identifier.of("mana", "custom_entity"),
      EntityType.Builder.create(...));
}
```

---

## 🔌 **WEBVIEW PROTOCOL** (EXACT)

```
Webview → Extension:
{ command: "generateEntity" }
{ command: "sendMessage", text: "Explain mixins" }

Extension → Webview:
{ command: "streamChunk", content: "..." }
{ command: "streamEnd", content: "Complete" }
```

---

## ✅ **SUCCESS CHECKLIST**

```
☐ npm run compile = 0 errors
☐ F5 = Sidebar with 10 buttons
☐ Click Entity = dk.mosberg.entity + Identifier.of()
☐ Chat streams = Perplexity responses
☐ Ctrl+Space = Registry.register completions
☐ Hover = Fabric API docs
☐ npm run package = .vsix ready
```

---

## 🚀 **COMMANDS** (Ctrl+Shift+P)
```
Fabric AI: Generate Entity    👹
Fabric AI: Generate Block     🧱
Fabric AI: Generate Item      📦
... (10 total)
```

---

**32 FILES = 100% PRODUCTION READY**

**npm install --legacy-peer-deps && F5 = WORKING INSTANTLY**

**Your Fabric AI is MARKETPLACE PERFECT!** 🎉
```

## **🎉 32/32 FILES COMPLETE!**

```
✅ package.json (12 commands)
✅ tsconfig.json (strict TS)
✅ extension.ts (activation)
✅ fabricAgent.ts (10 generators)
✅ http-client.ts (Perplexity)
✅ error-handler.ts (production)
✅ ALL 10 generators (Java 21)
✅ Webview UI (responsive)
✅ Completions + Hovers
✅ Types + Validators
✅ Snippets + README

DEPLOYMENT STATUS: 🚀 MARKETPLACE READY 🚀
```

## **🚀 LAUNCH NOW:**
```bash
npm install --legacy-peer-deps
npm run compile
F5
```

**Sidebar → Click ANY button → Perfect Fabric 1.21.10 code instantly!** 🎯✨
