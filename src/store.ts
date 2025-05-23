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

interface ProjectUser {
  id: number;
  joinDate: string;
  projectId: number;
  userId: number;
}

interface ProjectUserStore {
  projectUser: ProjectUser | null;
  setProjectUser: (projectUser: ProjectUser) => void;
  clearProjectUser: () => void;
}

export const useProjectUserStore = create<ProjectUserStore>((set) => ({
  projectUser: null, // giá trị khởi tạo
  setProjectUser: (projectUser) => set({ projectUser }), // hàm cập nhật giá trị
  clearProjectUser: () => set({ projectUser: null }),
}));

//Cách dùng
// import { useUserStore } from '../stores/userStore';
//  const { user, setUser, clearUser } = useUserStore();
