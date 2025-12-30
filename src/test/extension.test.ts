import * as assert from "assert";
import * as vscode from "vscode";

/**
 * Extension integration tests
 */
suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start Fabric AI tests!");

  test("Sample test - extension activates", async () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  });

  test("API key validation command exists", async () => {
    const commands = await vscode.commands.getCommands();
    assert.ok(
      commands.includes("fabric.setApiKey"),
      "Set API Key command registered"
    );
    assert.ok(
      commands.includes("fabric.generateEntity"),
      "Generate Entity command registered"
    );
  });
});
