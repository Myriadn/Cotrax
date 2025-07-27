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
import { Database, open } from 'sqlite';
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
            filename: path.join(context.extensionPath, 'src', 'lib', 'cotrax.db'),
            driver: sqlite3.Database,
        });

        const projects = await db.all('SELECT * FROM projects');
        const files = await db.all('SELECT * FROM files');
        const timeLogs = await db.all('SELECT * FROM time_logs');

        async function getProjectDurations(db: Database<sqlite3.Database, sqlite3.Statement>) {
        return await db.all(`
            SELECT p.project_name, SUM(t.duration_seconds) as total_duration
            FROM projects p
            LEFT JOIN files f ON f.project_id = p.id
            LEFT JOIN time_logs t ON t.file_id = f.id
            GROUP BY p.project_name
        `);
    }

        const htmlPath = path.join(context.extensionPath, 'src', 'page', 'index.html');
        if (!fs.existsSync(htmlPath)) {
            vscode.window.showErrorMessage('html file not found');
            return;
        }

        const projectDurations = await getProjectDurations(db);
        const chartScript = renderChartScript(projectDurations);
        
        let rawHtml = fs.readFileSync(htmlPath, 'utf8');
        const injectedHTML = renderProjectList(projects, files, timeLogs);
        
        const finalHtml = rawHtml
        .replace('{{projectList}}', injectedHTML)
        .replace('{{chartScript}}', chartScript);

        const tempPath = path.join(context.extensionPath, 'src', 'page', 'temp.html');
        fs.writeFileSync(tempPath, finalHtml, 'utf8');
        
        const tempUri = vscode.Uri.file(tempPath);
        await vscode.env.openExternal(tempUri);
    });

    const disposableHello = vscode.commands.registerCommand('cotrax.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World from Cotrax!');
    });


    context.subscriptions.push(disposableShowDashboard , disposableHello);
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const hStr = hours > 0 ? `${hours}h` : '';
  const mStr = remainingMinutes > 0 ? `${remainingMinutes}m` : '';

  return (hStr + ' ' + mStr).trim() || '0m';
}


function renderProjectList(projects: any[], files: any[], timeLogs: any[]) {
    return projects.map(project => {
        const relatedFiles = files.filter(file => file.project_id === project.id);

        const fileItems = relatedFiles.map(file => {
            const log = timeLogs.find(log => log.file_id === file.id);
            const time = log ? formatDuration(log.duration_seconds) : '0m';
            return `
                <div class="file-item">
                    <span class="file-icon"></span>
                    <span>${file.file_name}</span>
                    <span class="time">${time}</span>
                </div>
            `;
        }).join('');

        return `
            <div class="project">
                <p class="project-title">${project.project_name}</p>
                ${fileItems}
            </div>
        `;
    }).join('');
}

function renderChartScript(durations: any[]) {
  const labels = durations.map(p => `'${p.project_name}'`).join(', ');
  
  const data = durations.map(p => Math.floor((p.total_duration || 0) / 60)).join(', ');

  return `
    const ctx = document.getElementById('pieChart').getContext('2d');
    const data = {
      labels: [${labels}],
      datasets: [{
        label: 'code-playtime',
        data: [${data}],
        backgroundColor: ['#00FF00', '#00AA00', '#007700'],
        hoverOffset: 20
      }]
    };
    const config = {
      type: 'pie',
      data: data,
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw;
                const hours = Math.floor(value / 60);
                const minutes = value % 60;

                const hourStr = hours > 0 ? \`\${hours}h\` : '';
                const minStr = minutes > 0 ? \`\${minutes}m\` : '';
                const timeStr = [hourStr, minStr].filter(Boolean).join(' ');

                return \`\${label}: \${timeStr || '0m'}\`;
              }
            }
          }
        }
      }
    };
    new Chart(ctx, config);
  `;
}




/*
 * Typically will nothing happen if extension is deactivated
 */
export function deactivate() {}
