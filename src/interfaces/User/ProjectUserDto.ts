import type { RoleTypeEnum } from "../Enum/RoleType";
import type { User } from "./User";

export interface ProjectUserDto {
  id: number;
  projectId: number;
  userId: number;
  user: User;
  role: RoleTypeEnum;
  joinDate: Date;
}
