export const RoleType = { Admin: 0, Manager: 1, Member: 2 } as const;
export type RoleTypeEnum = (typeof RoleType)[keyof typeof RoleType];

export interface User {
  id: number;
  fullName: string;
  email: string;
  passWord: string;
  role: RoleTypeEnum;
}
