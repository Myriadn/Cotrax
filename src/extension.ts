/*
 * Author: Cotrax
 * DELETE THIS AFTER PRODUCTION
 * DONT FORGET DELETE FILES vsc-extension-*
 * ADJUST CHANGELOG.md
 * ADJUST README.md
 */

import * as vscode from "vscode";

/*
 * Entry point
 * Don't Delete this code
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "cotrax" is now active!');

  const disposable = vscode.commands.registerCommand(
    "cotrax.helloWorld",
    () => {
      vscode.window.showInformationMessage("Hello World from Cotrax!");
    }
  );

  context.subscriptions.push(disposable);
}

/*
 * Typically will nothing happen if extension is deactivated
 */
export function deactivate() {}
