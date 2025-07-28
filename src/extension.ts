/*
 * Author: Cotrax
 * DELETE THIS AFTER PRODUCTION
 * DONT FORGET DELETE FILES vsc-extension-*
 * ADJUST CHANGELOG.md
 * ADJUST README.md
 */

import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
// import sqlite3 from "sqlite3";
// import { Database, open } from "sqlite";

import * as api from "./api/apiService";
import { Projects, Files, Time_Logs } from "./models/models";

// Some variables
let activeFile: string | undefined = undefined;
let activeProject: string | undefined = undefined;
let startTime: number | undefined = undefined;
let activeProjectId: number | undefined;
let activeFileId: number | undefined;

/*
 * Entry point
 * Don't Delete this code
 */
export function activate(context: vscode.ExtensionContext) {
  console.log("Cotrax is active!"); // this is just for debugging

  const myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  myStatusBarItem.text = `$(rocket)$(clock) Cotrax`;
  myStatusBarItem.tooltip = "Show your Cotrax total playtime";
  myStatusBarItem.command = "extension.showDashboard";
  myStatusBarItem.show();

  context.subscriptions.push(myStatusBarItem);

  // dashboard
  const disposableShowDashboard = vscode.commands.registerCommand(
    "extension.showDashboard",
    async () => {
      try {
        // const db = await open({
        //   filename: path.join(context.extensionPath, "src", "lib", "cotrax.db"),
        //   driver: sqlite3.Database,
        // });

        // const projects = await db.all("SELECT * FROM projects");
        // const files = await db.all("SELECT * FROM files");
        // const timeLogs = await db.all("SELECT * FROM time_logs");

        const projects = await api.getAllProjects();
        const files = await api.getAllFiles();
        const timeLogs = await api.getAllTimeLogs();

        const projectDurations = projects.map((p) => {
          const projectFiles = files.filter((f) => f.project_id === p.id);
          const totalDuration = projectFiles.reduce((total, file) => {
            const logsForFile = timeLogs.filter(
              (log) => log.file_id === file.id
            );
            return (
              total +
              logsForFile.reduce((sum, log) => sum + log.duration_seconds, 0)
            );
          }, 0);
          return {
            project_name: p.project_name,
            total_duration: totalDuration,
          };
        });

        const htmlPath = path.join(
          context.extensionPath,
          "src",
          "page",
          "index.html"
        );
        if (!fs.existsSync(htmlPath)) {
          vscode.window.showErrorMessage("html file not found");
          return;
        }

        // const projectDurations = await getProjectDurations(db);
        const chartScript = renderChartScript(projectDurations);

        let rawHtml = fs.readFileSync(htmlPath, "utf8");
        const injectedHTML = renderProjectList(projects, files, timeLogs);

        const finalHtml = rawHtml
          .replace("{{projectList}}", injectedHTML)
          .replace("{{chartScript}}", chartScript);

        const tempPath = path.join(
          context.extensionPath,
          "src",
          "page",
          "temp.html"
        );
        fs.writeFileSync(tempPath, finalHtml, "utf8");

        const tempUri = vscode.Uri.file(tempPath);
        await vscode.env.openExternal(tempUri);
      } catch (error) {
        console.error("error to fetch dashboard data:", error);
        vscode.window.showErrorMessage("something went wrong with API");
      }
    }
  );

  const disposableHello = vscode.commands.registerCommand(
    "cotrax.helloWorld",
    () => {
      vscode.window.showInformationMessage("Hello World from Cotrax!");
    }
  );

  context.subscriptions.push(disposableShowDashboard, disposableHello);

  // All down here is event listeners
  // this one do start tracking when extension is activated
  if (vscode.window.activeTextEditor) {
    handleFileChange(vscode.window.activeTextEditor.document);
  }

  // like this one for file changes
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument((document) =>
      handleFileChange(document)
    )
  );
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        handleFileChange(editor.document);
      }
    })
  );

  // this for window focused
  context.subscriptions.push(
    vscode.window.onDidChangeWindowState((activeWindow) => {
      if (activeWindow.focused) {
        startTracking();
      } else {
        stopTracking();
      }
    })
  );
}

function startTracking() {
  if (!startTime && activeFileId) {
    startTime = Date.now();
    console.log(`Now Tracking: ${activeFileId}`);
  }
}

async function stopTracking() {
  if (startTime && activeFileId) {
    const endTime = new Date();
    const startTimeISO = new Date(startTime).toISOString();
    const endTimeISO = endTime.toISOString();

    try {
      await api.createTimeLog({
        file_id: activeFileId,
        start_time: startTimeISO,
        end_time: endTimeISO,
      });
      console.log(`SUCCESS: Sent log for file ID: ${activeFileId}`);
    } catch (error) {
      console.error(
        `FAILED: Could not send log for file ID: ${activeFileId}`,
        error
      );
    } finally {
      // Reset state terlepas dari sukses atau gagal
      startTime = undefined;
    }
  }
}

async function handleFileChange(document: vscode.TextDocument) {
  if (document.uri.scheme !== "file") return;

  // stop tracking before changing file
  stopTracking();

  const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
  const newProjectName = workspaceFolder ? workspaceFolder.name : undefined;
  const newProjectpath = workspaceFolder
    ? workspaceFolder.uri.fsPath
    : undefined;
  const newFileName = document.fileName;

  if (newProjectName && newProjectpath) {
    try {
      // Cek apakah proyek berubah atau belum ada ID
      if (newProjectName !== activeProject || !activeProjectId) {
        console.log(`New/changed project detected: ${newProjectName}`);
        const projectData = await api.createProject({
          project_name: newProjectName,
          project_path: newProjectpath,
        });
        activeProjectId = projectData.id;
        activeProject = newProjectName;
      }

      // Cek apakah file berubah atau belum ada ID
      if (newFileName !== activeFile || !activeFileId) {
        console.log(`New/changed file detected: ${path.basename(newFileName)}`);
        const fileData = await api.createFile({
          project_id: activeProjectId!,
          filename: path.basename(newFileName),
          filepath: newFileName,
        });
        activeFileId = fileData.id;
        activeFile = newFileName;
      }
    } catch (error) {
      console.error("Error during project/file registration:", error);
      vscode.window.showErrorMessage(
        "Could not register project/file with Cotrax API."
      );
    }
  }

  // then start tracking
  startTracking();
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const hStr = hours > 0 ? `${hours}h` : "";
  const mStr = remainingMinutes > 0 ? `${remainingMinutes}m` : "";

  return (hStr + " " + mStr).trim() || "0m";
}

function renderProjectList(projects: any[], files: any[], timeLogs: any[]) {
  return projects
    .map((project) => {
      const relatedFiles = files.filter(
        (file) => file.project_id === project.id
      );

      const fileItems = relatedFiles
        .map((file) => {
          const logsForFile = timeLogs.filter((log) => log.file_id === file.id);
          const totalSecondsForFile = logsForFile.reduce(
            (sum, log) => sum + log.duration_seconds,
            0
          );
          const time = formatDuration(totalSecondsForFile);
          return `
                <div class="file-item">
                    <span class="file-icon"></span>
                    <span>${file.filename}</span>
                    <span class="time">${time}</span>
                </div>
            `;
        })
        .join("");

      return `
            <div class="project">
                <p class="project-title">${project.project_name}</p>
                ${fileItems}
            </div>
        `;
    })
    .join("");
}

function renderChartScript(durations: any[]) {
  const labels = durations.map((p) => `'${p.project_name}'`).join(", ");

  const data = durations
    .map((p) => Math.floor((p.total_duration || 0) / 60))
    .join(", ");

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
export function deactivate() {
  stopTracking(); // you're not getting tracked anymore
}
