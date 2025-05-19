export const RoleType = { Admin: 0, Manager: 1, Member: 2 } as const;
export type RoleTypeEnum = (typeof RoleType)[keyof typeof RoleType];

const RoleTypeReverse = Object.fromEntries(
  Object.entries(RoleType).map(([key, value]) => [value, key])
) as { [key: number]: keyof typeof RoleType };

export function getRoleName(value: number): keyof typeof RoleType | undefined {
  return RoleTypeReverse[value];
}
