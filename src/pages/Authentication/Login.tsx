import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type Inputs = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const navigate = useNavigate(); // Hook để điều hướng
  const [showPassword, setShowPassword] = useState(false); // Trạng thái hiển thị mật khẩu
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true); // Bắt đầu loading
    try {
      console.log("Đăng nhập với dữ liệu:", data);
      navigate("/dashboard"); // Điều hướng đến trang chính sau khi đăng nhập thành công
    } catch (error) {
      console.error("Đăng nhập thất bại", error);
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  return (
    <>
      <div className="flex min-h-screen flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8 bg-gray-200">
        <div className="container mx-auto max-w-xl bg-white rounded-lg">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            {/* <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          /> */}
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
              Đăng nhập
            </h2>
          </div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Email
                </label>
                <div className="mt-2">
                  <input
                    type="email"
                    placeholder="Nhập email"
                    {...register("email", {
                      required: "Email là bắt buộc",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex kiểm tra định dạng email
                        message: "Email không hợp lệ",
                      },
                    })}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Mật khẩu
                  </label>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Quên mật khẩu?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      {...register("password", {
                        required: "Mật khẩu là bắt buộc",
                        minLength: {
                          value: 6,
                          message: "Mật khẩu phải có ít nhất 6 ký tự",
                        },
                      })}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-15">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading ? true : false}
                  variant={"default"}
                >
                  {isLoading && <Loader2 className="animate-spin" />}
                  Đăng nhập
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
