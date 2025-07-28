/*
 * Author: Cotrax
 * this file for Managing API calls and responses
 */

import axios from "axios";
import { Projects, Files, Time_Logs } from "../models/models";

const apiClient = axios.create({
  baseURL: "http://localhost:7000/api/v1", // || "https://cotrax.onrender.com/api/v1"
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createProject = async (projectData: {
  project_name: string;
  project_path: string;
}): Promise<Projects> => {
  try {
    const response = await apiClient.post("/projects", projectData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const getAllProjects = async (): Promise<Projects[]> => {
  try {
    const response = await apiClient.get("/projects");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const createFile = async (fileData: {
  project_id: number;
  filename: string;
  filepath: string;
}): Promise<Files> => {
  try {
    const response = await apiClient.post("/files", fileData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating file:", error);
    throw error;
  }
};

export const getAllFiles = async (): Promise<Files[]> => {
  try {
    const response = await apiClient.get("/files");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
};

export const createTimeLog = async (logData: {
  file_id: number;
  start_time: string;
  end_time: string;
}): Promise<Time_Logs> => {
  try {
    const response = await apiClient.post("/time_logs", logData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating time log:", error);
    throw error;
  }
};

export const getAllTimeLogs = async (): Promise<Time_Logs[]> => {
  try {
    const response = await apiClient.get("/time_logs");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching time logs:", error);
    throw error;
  }
};
