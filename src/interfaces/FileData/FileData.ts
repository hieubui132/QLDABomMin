import type { User } from "../User/User";

export interface FileData {
  id: string;
  fileSize: string;
}

export interface ShareFile {
  id: number;
  name: string;

  isFolder: boolean;

  pathDir: string;
  currentPathDir: string;

  createUserId?: number;

  createUser?: User;

  fileId?: string | null;

  file?: FileData | null;
}
