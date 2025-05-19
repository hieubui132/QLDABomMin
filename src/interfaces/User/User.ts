import type { RoleTypeEnum } from "../Enum/RoleType";

export interface User {
  id: number;
  fullName: string;
  email: string;
  passWord: string;
  role: RoleTypeEnum;
}
