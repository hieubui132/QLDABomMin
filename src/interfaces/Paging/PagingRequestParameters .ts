export interface PagingRequestParameters {
  orderBy?: string;
  pageNumber?: number; // default: 1
  pageSize?: number; // default: 10, max: 50
}
