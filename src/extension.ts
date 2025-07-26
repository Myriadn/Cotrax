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
import { supabase } from './lib/supabaseClient';
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

    // dashboard
    const disposableShowDashboard = vscode.commands.registerCommand('extension.showDashboard', async () => {
        const htmlPath = path.join(context.extensionPath, 'src', 'page', 'index.html');
        
        if (!fs.existsSync(htmlPath)) {
            vscode.window.showErrorMessage('html file not found');
            return;
        }

        // supabase 
        const { data, error } = await supabase.from('projects').select('*');
        if (error) {
            console.error(error);
            vscode.window.showErrorMessage('failed to connect supabase');
        } else {
            console.log('Data project:', data);
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
