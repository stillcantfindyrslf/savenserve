import CategoriesManager from "@/components/AdminPanel/CategoriesManager";
import AdminLayout from "@/components/AdminPanel/Adminlayout";

export default function AdminCategoriesPage() {
  return (
    <AdminLayout>
      <CategoriesManager />
    </AdminLayout>
  );
}