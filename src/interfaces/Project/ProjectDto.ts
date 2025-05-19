export interface ProjectDto {
  id: number;
  projectName: string; // varchar(100), bắt buộc
  long?: number | null; // DOUBLE, có thể null
  lat?: number | null; // DOUBLE, có thể null
  startDate: Date;
  endDate: Date;
  status: number;
  managerId?: number | null;
}
