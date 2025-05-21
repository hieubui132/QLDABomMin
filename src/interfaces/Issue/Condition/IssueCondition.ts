import type { EIssueStatus } from "@/interfaces/Enum/Enum";
import type { PagingRequestParameters } from "@/interfaces/Paging/PagingRequestParameters ";

export interface IssueCondition extends PagingRequestParameters {
  projectId: number; // Required
  status?: EIssueStatus;
  assigneeId?: number;
  searchTerm?: string;
}
