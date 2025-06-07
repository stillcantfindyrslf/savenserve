import AdminLayout from "@/components/AdminPanel/Adminlayout";
import UserManager from "@/components/AdminPanel/UsersManager";

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <UserManager />
    </AdminLayout>
  );
}