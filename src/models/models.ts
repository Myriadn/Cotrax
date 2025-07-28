export interface Projects {
  id: number;
  project_name: string;
  project_path: string;
  created_at: string;
}

export interface Files {
  id: number;
  project_id: number;
  filename: string;
  filepath: string;
  created_at: string;
}

export interface Time_Logs {
  id: number;
  file_id: number;
  start_time: string;
  end_time: string;
  duration_seconds: number;
  created_at: string;
}
