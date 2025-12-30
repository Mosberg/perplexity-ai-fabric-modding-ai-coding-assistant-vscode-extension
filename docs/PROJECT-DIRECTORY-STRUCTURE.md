# Project Directory Structure

The project directory structure is organized to facilitate easy navigation and management of the codebase.

Generate all files and directories as described below.

Below is an overview of the main directories and files within the project that are essential for understanding the organization of the code:

```plaintext
📁perplexity-ai-fabric-modding-ai-coding-assistant-vscode-extension
│
├── 📁 .github/
│   └── copilot-instructions.md
│
├── 📁 .vscode/
│   ├── extensions.json
│   ├── launch.json
│   ├── settings.json
│   └── tasks.json
│
├── 📁 media/
│   ├── fabric-agent.css                 (GENERATE NEW - Base styles for media)
│   ├── fabric-agent.html                (GENERATE NEW - Base html for media)
│   ├── fabric-agent.js                  (GENERATE NEW - Base script for media)
│   └── icon.png
│
├── 📁 src/
│   │
│   ├── 📁 generators/
│   │   ├── baseGenerator.ts             (GENERATE NEW - Base class for generators)
│   │   ├── blockGenerator.ts            (GENERATE NEW - Base class for generators)
│   │   ├── commandGenerator.ts          (GENERATE NEW - Base class for generators)
│   │   ├── configGenerator.ts           (GENERATE NEW - Base class for generators)
│   │   ├── entityGenerator.ts           (GENERATE NEW - Base class for generators)
│   │   ├── itemGenerator.ts             (GENERATE NEW - Base class for generators)
│   │   ├── mixinGenerator.ts            (GENERATE NEW - Base class for generators)
│   │   ├── overlayGenerator.ts          (GENERATE NEW - Base class for generators)
│   │   ├── rendererGenerator.ts         (GENERATE NEW - Base class for generators)
│   │   └── screenGenerator.ts           (GENERATE NEW - Base class for generators)
│   │
│   ├── 📁 providers/
│   │   ├── chatProvider.ts              (GENERATE NEW - Base class for providers)
│   │   ├── completionProvider.ts        (GENERATE NEW - Base class for providers)
│   │   ├── hoverProvider.ts             (GENERATE NEW - Base class for providers)
│   │   └── webviewProvider.ts           (GENERATE NEW - Base class for providers)
│   │
│   ├── 📁 services/
│   │   └── http-client.ts               (GENERATE NEW - Base class for services)
│   │
│   ├── 📁 types/
│   │   ├── fabric.types.ts              (GENERATE NEW - Base class for types)
│   │   └── improved-types.ts            (GENERATE NEW - Base class for types)
│   │
│   ├── 📁 utils/
│   │   ├── codeInserter.ts              (GENERATE NEW - Base class for utils)
│   │   ├── fabricConfig.ts              (GENERATE NEW - Base class for utils)
│   │   ├── templateManager.ts           (GENERATE NEW - Base class for utils)
│   │   ├── validators.ts                (GENERATE NEW - Base class for utils)
│   │   └── error-handler.ts             (GENERATE NEW - Base class for utils)
│   │
│   ├── 📁 test/
│   │   ├── extension.test.ts            (GENERATE NEW - Base class for tests)
│   │   ├── 📁 unit/
│   │   │   ├── validators.test.ts       (GENERATE NEW - Base class for test unit)
│   │   │   ├── http-client.test.ts      (GENERATE NEW - Base class for test unit)
│   │   │   └── error-handler.test.ts    (GENERATE NEW - Base class for test unit)
│   │   └── 📁 integration/
│   │       ├── api-caller.test.ts       (GENERATE NEW - Base class for test integration)
│   │       └── chat-provider.test.ts    (GENERATE NEW - Base class for test integration)
│   │
│   ├── extension.ts                     (GENERATE NEW - Base class for extension)
│   └── fabricAgent.ts                   (GENERATE NEW - Base class for fabric agent)
│
├── 📁 docs/
│   ├── ARCHITECTURE.md                  (GENERATE NEW - Architecture overview)
│   ├── API.md                           (GENERATE NEW - API documentation)
│   ├── CONTRIBUTING.md                  (GENERATE NEW - Contributing guide)
│   ├── PROJECT-DIRECTORY-STRUCTURE.md   (GENERATE NEW - Project directory structure)
│   └── TROUBLESHOOTING.md               (GENERATE NEW - Troubleshooting guide)
│
├── .gitignore
├── .vscode-test.mjs
├── .vscodeignore
├── CHANGELOG.md
├── eslint.config.mjs
├── package-lock.json
├── package.json                         (GENERATE NEW - Package configuration)
├── README.md                            (GENERATE NEW - Project overview)
├── tsconfig.json                        (GENERATE NEW - TypeScript configuration)
│
├── 📋 START_HERE.md                     (GENERATE NEW - Read first!)
├── 📋 QUICK_START.md                    (GENERATE NEW - 4-hour implementation)
├── 📋 OPTIMIZATION_REPORT.md            (GENERATE NEW - Detailed analysis)
├── 📋 OPTIMIZATION_CHECKLIST.md         (GENERATE NEW - Step-by-step guide)
├── 📋 IMPLEMENTATION_GUIDE.md           (GENERATE NEW - Complete overview)
├── 📋 README_OPTIMIZATION.md            (GENERATE NEW - Package summary)
│
└── vsc-extension-quickstart.md
```
