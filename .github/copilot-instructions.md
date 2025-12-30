# Copilot Instructions for Perplexity AI Fabric Modding VSCode Extension

## Project Overview

This is a VS Code extension designed to assist with modding for Fabric (Minecraft) using AI-powered coding agents. The codebase is TypeScript and organized for modularity and extensibility.

## Architecture & Key Components

- **src/extension.ts**: Main entry point for the extension. Handles activation, registration, and command wiring.
- **src/fabricAgent.ts**: Core logic for the Fabric AI agent, including communication and orchestration.
- **src/generators/**: Contains code generators for Fabric mod elements (e.g., blocks, items, entities, mixins, overlays, screens, renderers, configs, commands). Each generator follows a similar pattern: input parsing, template usage, and code insertion.
- **src/providers/**: VSCode providers for chat, completion, hover, and webview. These connect the extension UI and AI logic.
- **src/services/http-client.ts**: Handles HTTP requests, typically for external AI or modding APIs.
- **src/utils/**: Utility functions for code insertion, error handling, config management, template management, and validation.
- **src/types/**: Type definitions for Fabric and improved types.
- **media/**: Static assets for the extension's webview and UI.
- **test/**: Unit and integration tests, organized by feature and type.

## Developer Workflows

- **Build**: Use `npm run watch` for background TypeScript compilation during development.
- **Test**: Run `npm test` to execute all tests. Tests are located in `test/unit/` and `test/integration/`.
- **Debug**: Use VSCode's extension debugging features. Set breakpoints in `src/` files.

## Project-Specific Patterns

- **Generators**: All generators in `src/generators/` use a template-driven approach. See `templateManager.ts` for template loading and usage.
- **Providers**: Providers are registered in `extension.ts` and communicate with the agent via events and messages.
- **Error Handling**: Centralized in `utils/error-handler.ts` and tested in `test/unit/error-handler.test.ts`.
- **Validation**: Use `utils/validators.ts` for input validation, with corresponding tests.
- **Configuration**: Extension config is managed via `utils/fabricConfig.ts` and exposed to users through VSCode settings.

## Integration Points

- **External APIs**: HTTP requests are abstracted in `services/http-client.ts`.
- **VSCode API**: Extension uses VSCode's API for commands, providers, and webviews. See `extension.ts` and `providers/`.

## Conventions

- **TypeScript**: Strict typing enforced via `tsconfig.json`.
- **Tests**: All new features require unit/integration tests in the appropriate `test/` subfolder.
- **Templates**: All code generation uses templates from `templateManager.ts`.
- **Error Handling**: Use centralized error handler for all async operations.

## Examples

- To add a new generator, create a file in `src/generators/`, implement template usage, and register it in `extension.ts`.
- To add a new provider, implement in `src/providers/` and register in `extension.ts`.

## Key Files

- `src/extension.ts`: Extension entry and registration
- `src/fabricAgent.ts`: AI agent logic
- `src/generators/`: Code generators
- `src/providers/`: VSCode providers
- `src/utils/`: Utilities and helpers
- `test/`: Tests

---

For more details, see the [README.md](../README.md) and source files referenced above.
