'use client';

import React, { ReactNode } from 'react';
import { MdOutlineInventory2, MdOutlineCategory, MdOutlineDashboard, MdOutlineViewCarousel, MdOutlinePeopleAlt } from 'react-icons/md';
import { usePathname, useRouter } from 'next/navigation';
import FloatingNavbar from '../FloatingNavbar';
import { Tab, Tabs } from '@nextui-org/react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { key: 'dashboard', path: '/admin', icon: <MdOutlineDashboard size={20} />, label: 'Дашборд' },
    { key: 'items', path: '/admin/items', icon: <MdOutlineInventory2 size={20} />, label: 'Товары' },
    { key: 'categories', path: '/admin/categories', icon: <MdOutlineCategory size={20} />, label: 'Категории' },
    { key: 'banners', path: '/admin/banner', icon: <MdOutlineViewCarousel size={20} />, label: 'Баннеры' },
    { key: 'users', path: '/admin/users', icon: <MdOutlinePeopleAlt size={20} />, label: 'Пользователи' },
  ];

  const getActiveKey = () => {
    if (pathname === '/admin') return 'dashboard';
    if (pathname === '/admin/items') return 'items';
    if (pathname === '/admin/categories') return 'categories';
    if (pathname === '/admin/banner') return 'banners';
    if (pathname === '/admin/users') return 'users';
    return 'dashboard';
  };

  const handleTabChange = (key: React.Key) => {
    const selectedTab = navItems.find(item => item.key === key);
    if (selectedTab) {
      router.push(selectedTab.path);
    }
  };

  return (
    <>
      <FloatingNavbar showSearch={false} searchQuery="" setSearchQuery={() => { }} title="Админ-панель" showCart={false} subtitle={false} />
      <div className="mt-32">
        <div className="mx-auto bg-white rounded-xl shadow-sm py-3 mb-6">
          <Tabs
            aria-label="Admin navigation"
            selectedKey={getActiveKey()}
            onSelectionChange={handleTabChange}
            color="success"
            variant="underlined"
            classNames={{
              base: "w-full",
              tabList: "gap-6 w-full px-6",
              tab: "h-12 data-[selected=true]:font-medium",
              tabContent: "group-data-[selected=true]:text-primary-color",
              cursor: "w-full h-1 bg-primary-color rounded-xl"
            }}
          >
            {navItems.map(item => (
              <Tab
                key={item.key}
                title={
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                }
              />
            ))}
          </Tabs>
        </div>
        <main>
          {children}
        </main>
      </div>
    </>
  );
};

export default AdminLayout;