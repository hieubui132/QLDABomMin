import type { User } from "./User";

export interface ProjectUserDto {
  id: number;
  projectId: number;
  userId: number;
  user?: User | undefined;
  role: number;
  joinDate: Date;
}
