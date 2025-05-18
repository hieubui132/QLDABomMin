export interface ApiResult<T> {
  isSuccessded: boolean; // chú ý tên phải trùng JSON (“IsSuccessded” → “isSuccessded” sau khi camel‑case)
  message?: string | null;
  data?: T;
  errors?: string[]; // chỉ có khi là lỗi
}

// Kết quả thành công
export type ApiSuccessResult<T> = ApiResult<T> & {
  isSuccessded: true;
  data: T;
};

// Kết quả lỗi
export type ApiErrorResult<T = undefined> = ApiResult<T> & {
  isSuccessded: false;
  errors?: string[];
};
