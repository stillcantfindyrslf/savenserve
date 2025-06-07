import { UserProfile } from "../useAuthStore/types";

export interface UserStoreState {
  users: UserProfile[];
  isLoading: boolean;
  error: string | null;

  fetchUsers: () => Promise<void>;
  deleteUser: (id: string) => Promise<boolean>;
  updateUserRole: (id: string, role: string) => Promise<UserProfile>;
}