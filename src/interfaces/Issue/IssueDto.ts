import type { EConseQuence, EIssueStatus, ELikeLiHood } from "../Enum/Enum";
import type { User } from "../User/User";

export interface ActionIssueDto {
  id: number;
  riskDecriptions: string;
  startDated?: Date;
  endDate?: Date;
  status: EIssueStatus;
  assigneeId: number;
  likeLiHood?: ELikeLiHood;
  conseQuence?: EConseQuence;
  score?: number;
}

export interface IssueDto extends ActionIssueDto {
  issueName: string;
  lat: number;
  long: number;
  assignee?: User;
}
