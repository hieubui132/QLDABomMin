export interface MetaData {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  hasPrevious: boolean;
  hasNext: boolean;
  firsRowOnPage: number; // Nếu đây là lỗi chính tả thì nên sửa thành 'firstRowOnPage'
}
