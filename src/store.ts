import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null, // giá trị khởi tạo
  setUser: (user) => set({ user }), // hàm cập nhật giá trị
  clearUser: () => set({ user: null }),
}));

//Cách dùng
// import { useUserStore } from '../stores/userStore';
//  const { user, setUser, clearUser } = useUserStore();
