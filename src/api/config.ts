import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
} from "axios";

const axiosConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  //   timeout: 15000, // 15 giây
  // withCredentials: true, // Nếu bạn dùng cookie/token
};

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL?: string) {
    const config: AxiosRequestConfig = {
      ...axiosConfig,
      baseURL: baseURL || axiosConfig.baseURL, // Sử dụng baseURL từ tham số hoặc mặc định
    };
    this.client = axios.create(config);
    this.setupInterceptors();
  }

  private setupInterceptors() {
    //Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Do something before request is sent
        const localStorageData = localStorage.getItem("authUser");
        if (localStorageData) {
          const token = JSON.parse(localStorageData)?.token;
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response?.data ?? response,
      (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
          // Xử lý lỗi 401 - Unauthorized (ví dụ: hết hạn token)
          // Có thể điều hướng người dùng đến trang đăng nhập hoặc thực hiện đăng xuất
          console.log("Token đã hết hạn hoặc không hợp lệ.");
          // Hoặc xóa token khỏi localStorage
          localStorage.clear();
          // Ví dụ: Điều hướng về trang đăng nhập hoặc thực hiện logout
          window.location.href = "/login"; // Thay đổi điều hướng theo yêu cầu của bạn
        }
        return Promise.reject(error);
      }
    );
  }

  //Các phương thức HTTP
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get(url, config);
  }

  post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.client.post(url, data, config);
  }

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put(url, data, config);
  }

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete(url, config);
  }
}

export { ApiClient };
