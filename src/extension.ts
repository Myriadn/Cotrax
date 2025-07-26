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
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
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
        const db = await open({
            filename: path.join(context.extensionPath, 'src', 'db', 'database.sqlite'),
            driver: sqlite3.Database,
        });

        const htmlPath = path.join(context.extensionPath, 'src', 'page', 'index.html');
        const projects = await db.all('SELECT * FROM projects');
        const files = await db.all('SELECT * FROM files');
        const timelogs = await db.all('SELECT * FROM time_logs');

        const htmlProjects = projects.map(p => `<li>${p.project_name}</li>`).join('');
        const htmlFiles = files.map(f => `<li>${f.file_name} (${f.file_path})</li>`).join('');
        const htmlTimeLogs = timelogs.map(t => `<li>${t.duration_seconds}s (${t.start_time})</li>`).join('');

        
        if (!fs.existsSync(htmlPath)) {
            vscode.window.showErrorMessage('html file not found');
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
