/*
 * Author: Cotrax
 * DELETE THIS AFTER PRODUCTION
 * DONT FORGET DELETE FILES vsc-extension-*
 * ADJUST CHANGELOG.md
 * ADJUST README.md
 */

import * as vscode from "vscode";
import * as path from 'path';
import * as fs from 'fs';
/*
 * Entry point
 * Don't Delete this code
 */
export function activate(context: vscode.ExtensionContext) {

    const myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    myStatusBarItem.text = `$(rocket)$(clock) Cotrax`; 
    myStatusBarItem.tooltip = 'Show your Cotrax total playtime';
    myStatusBarItem.command = 'extension.showDashboard'; 
    myStatusBarItem.show();

    context.subscriptions.push(myStatusBarItem);


    const disposableShowDashboard = vscode.commands.registerCommand('extension.showDashboard', async () => {
        const htmlPath = path.join(context.extensionPath, 'src', 'page', 'index.html');
        
        if (!fs.existsSync(htmlPath)) {
            vscode.window.showErrorMessage('index.html tidak ditemukan!');
            return;
        }

        const uri = vscode.Uri.file(htmlPath);
        await vscode.env.openExternal(uri); 
    });

    const disposableHello = vscode.commands.registerCommand('cotrax.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World from Cotrax!');
    });


    context.subscriptions.push(disposableShowDashboard , disposableHello);
}


/*
 * Typically will nothing happen if extension is deactivated
 */
export function deactivate() {}
