'use client';

import React, { useEffect, useState, useMemo, useRef, ReactNode, useCallback } from 'react';
import { Card, CardBody, CardHeader, CardFooter, Divider, Spinner, Button, Progress, Input, Chip } from '@nextui-org/react';
import { MdInventory, MdOutlineCategory, MdArrowForward, MdTrendingUp, MdPerson, MdSearch } from 'react-icons/md';
import { FaUsers, FaExclamationTriangle, FaTags, FaBoxOpen } from 'react-icons/fa';
import { IoMdRefresh } from 'react-icons/io';
import { FiAlertCircle } from 'react-icons/fi';
import useItemsStore from '@/store/useItemStore';
import useCategoriesStore from '@/store/useCategoriesStore';
import useAuthStore from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/store/useAuthStore/types';

interface StatCard {
  title: string;
  value: number;
  icon: ReactNode;
  info: string;
  color: string;
  actionText?: string;
  action?: () => void;
  secondaryInfo: string | null;
  trend: ReactNode | null;
}

const AdminDashboard = () => {
  const router = useRouter();

  const { items, fetchItems } = useItemsStore();
  const { categories, fetchCategories } = useCategoriesStore();
  const { users, fetchUsers } = useAuthStore();

  const [statsLoaded, setStatsLoaded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const itemsRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const usersRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items.slice(0, 5);

    return items
      .filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5);
  }, [items, searchQuery]);

  const lowStockItems = items.filter(item => item.quantity < 5);
  const outOfStockItems = items.filter(item => item.quantity === 0);
  const lowStockPercentage = items.length > 0 ? Math.round((lowStockItems.length / items.length) * 100) : 0;

  const subcategoriesCount = categories.reduce(
    (count, category) => count + category.subcategories.length,
    0
  );

  const discountedItems = items.filter(item => item.discount_price && item.discount_price < item.price);
  const discountedPercentage = items.length > 0 ? Math.round((discountedItems.length / items.length) * 100) : 0;

  const totalInventoryValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const loadData = useCallback(async () => {
    setStatsLoaded(false);
    try {
      const promises = [];

      promises.push(fetchItems());
      promises.push(fetchCategories());

      if (typeof fetchUsers === 'function') {
        promises.push(fetchUsers());
      }

      await Promise.all(promises);
    } catch (error) {
      console.error("Ошибка при загрузке данных для дашборда:", error);
    } finally {
      setStatsLoaded(true);
    }
  }, [fetchItems, fetchCategories, fetchUsers])

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const stats: StatCard[] = [
    {
      title: 'Всего товаров',
      value: items.length,
      icon: <MdInventory size={28} className="text-primary-color" />,
      info: `${lowStockItems.length} товаров заканчивается`,
      color: 'bg-light-secondary-color',
      actionText: 'Подробнее о товарах',
      action: () => scrollToSection(itemsRef),
      secondaryInfo: outOfStockItems.length > 0 ? `${outOfStockItems.length} отсутствует на складе` : null,
      trend: items.length > 0 ? <MdTrendingUp className="text-green-500" size={16} /> : null
    },
    {
      title: 'Категорий',
      value: categories.length,
      icon: <MdOutlineCategory size={28} className="text-primary-color" />,
      info: `${subcategoriesCount} подкатегорий`,
      color: 'bg-blue-50',
      actionText: 'Информация о категориях',
      action: () => scrollToSection(categoriesRef),
      secondaryInfo: null,
      trend: categories.length > 0 ? <MdTrendingUp className="text-green-500" size={16} /> : null
    },
    {
      title: 'Пользователи',
      value: users?.length || 0,
      icon: <FaUsers size={28} className="text-primary-color" />,
      info: `Зарегистрированных пользователей`,
      color: 'bg-orange-50',
      actionText: 'О пользователях',
      action: () => scrollToSection(usersRef),
      secondaryInfo: null,
      trend: users?.length > 0 ? <MdTrendingUp className="text-green-500" size={16} /> : null
    },
  ];

  if (!statsLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Spinner size="lg" color="success" className="mb-4" />
        <p className="text-color-text">Загрузка данных для дашборда...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 mb-16">
      <div>
        <div className="flex justify-between items-center mb-4 lg:px-5">
          <h1 className="text-2xl font-bold text-color-text">Обзор системы</h1>
          <Button
            variant="flat"
            className="bg-light-secondary-color text-primary-color border border-primary-color/20"
            startContent={<IoMdRefresh size={18} />}
            isLoading={isRefreshing}
            onClick={handleRefresh}
          >
            Обновить данные
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <CardBody className={`${stat.color} rounded-t-xl p-4 flex-grow`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      {stat.trend && <span>{stat.trend}</span>}
                    </div>
                    <h3 className="text-3xl font-bold text-color-text mt-1">{stat.value}</h3>
                    <p className="text-xs text-gray-500 mt-2">{stat.info}</p>
                    {stat.secondaryInfo && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <FaExclamationTriangle size={12} />
                        {stat.secondaryInfo}
                      </p>
                    )}
                  </div>
                  <div className="p-3 rounded-lg bg-white shadow-sm">
                    {stat.icon}
                  </div>
                </div>
              </CardBody>
              {stat.action && (
                <CardFooter className={`${stat.color} rounded-b-xl p-0 mt-auto`}>
                  <Button
                    className="w-full bg-white text-primary-color border-t border-primary-color/10 rounded-none rounded-b-xl h-10"
                    variant="flat"
                    endContent={<MdArrowForward />}
                    onClick={stat.action}
                  >
                    {stat.actionText}
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </div>

      <div ref={itemsRef} className="pt-8">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-light-secondary-color">
              <MdInventory size={24} className="text-primary-color" />
            </div>
            <h2 className="text-xl font-bold">Товары и склад</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader className="flex gap-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">Состояние склада</p>
                  <p className="text-small text-default-500">Общая стоимость: {totalInventoryValue.toLocaleString()} р.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${lowStockPercentage > 20 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {lowStockPercentage}% товаров заканчивается
                  </span>
                </div>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Товары с низким остатком</span>
                  <span className="text-xs text-gray-500">{lowStockItems.length} из {items.length}</span>
                </div>
                <Progress
                  value={lowStockPercentage}
                  color={lowStockPercentage > 20 ? "danger" : "success"}
                  className="h-2"
                />
              </div>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Товары со скидкой</span>
                  <span className="text-xs text-gray-500">{discountedItems.length} из {items.length}</span>
                </div>
                <Progress
                  value={discountedPercentage}
                  color="warning"
                  className="h-2"
                />
              </div>
              <h3 className="text-md font-medium mb-3">Заканчивающиеся товары</h3>
              <ul className="divide-y">
                {lowStockItems.slice(0, 5).map(item => (
                  <li key={item.id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                        <span className="text-red-500 text-sm font-semibold">{item.quantity}</span>
                      </div>
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <div className="text-sm bg-red-50 py-1 px-2 rounded text-red-500">
                      {item.quantity === 0 ? "Нет в наличии" : "Мало на складе"}
                    </div>
                  </li>
                ))}
                {lowStockItems.length === 0 && (
                  <li className="py-6 text-center text-gray-500">
                    Нет товаров с низким остатком
                  </li>
                )}
              </ul>
            </CardBody>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex gap-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">Каталог товаров</p>
                  <p className="text-small text-default-500">Всего в ассортименте: {items.length} товаров</p>
                </div>
                <Input
                  classNames={{
                    base: "max-w-[180px]",
                    inputWrapper: "h-10",
                  }}
                  placeholder="Поиск"
                  startContent={<MdSearch className="text-gray-400" />}
                  size="sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="mb-4 p-3 bg-light-secondary-color/30 rounded-lg border border-light-secondary-color flex items-start gap-3">
                <div className="p-2 bg-white rounded-full">
                  <FaBoxOpen className="text-primary-color" size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-primary-color">Информация о товарах</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Chip size="sm" color="primary" variant="flat">{items.length} товаров</Chip>
                    <Chip size="sm" color="warning" variant="flat">{discountedItems.length} со скидкой</Chip>
                    <Chip size="sm" color="danger" variant="flat">{outOfStockItems.length} отсутствует</Chip>
                  </div>
                </div>
              </div>

              <h3 className="text-md font-medium mb-3">Популярные товары</h3>
              <ul className="divide-y">
                {filteredItems.map(item => (
                  <li key={item.id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-light-secondary-color/30 rounded-lg flex items-center justify-center overflow-hidden">
                        <FaTags className="text-primary-color" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-xs text-gray-500">
                          {item.discount_price ? (
                            <span>
                              <span className="line-through">{item.price} р.</span>
                              <span className="text-red-500 ml-2">{item.discount_price} р.</span>
                            </span>
                          ) : (
                            <span>{item.price} р.</span>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${item.quantity === 0
                        ? "bg-red-100 text-red-700"
                        : item.quantity < 5
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                        }`}>
                        {item.quantity}
                      </div>
                    </div>
                  </li>
                ))}
                {items.length === 0 && (
                  <li className="py-6 text-center text-gray-500 flex flex-col items-center gap-2">
                    <FiAlertCircle size={24} className="text-gray-400" />
                    Нет товаров в каталоге
                  </li>
                )}
              </ul>
            </CardBody>
            <CardFooter>
              <Button
                className="w-full bg-light-secondary-color text-primary-color"
                onClick={() => router.push('/admin/items')}
              >
                Управление товарами
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div ref={usersRef} className="pt-8">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-50">
              <FaUsers size={24} className="text-primary-color" />
            </div>
            <h2 className="text-xl font-bold">Пользователи системы</h2>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardBody>
            <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-100 flex items-start gap-3">
              <div className="p-2 bg-white rounded-full">
                <MdPerson className="text-primary-color" size={20} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-orange-800">Статистика пользователей</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {users?.length || 0} зарегистрировано
                  </div>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    {getNewUserCount(users)} новых за неделю
                  </div>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    {getSubscribedUserCount(users)} с подпиской
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-md font-medium mb-3">Последние зарегистрированные</h3>
            <ul className="divide-y">
              {users && users.length > 0 ? (
                users
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .slice(0, 5)
                  .map(user => (
                    <li key={user.id} className="py-3 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center overflow-hidden">
                          <FaUsers className="text-primary-color" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm truncate max-w-[180px]">
                            {user.email}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.is_subscribed && (
                          <div className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            Подписка
                          </div>
                        )}
                      </div>
                    </li>
                  ))
              ) : (
                <li className="py-6 text-center text-gray-500 flex flex-col items-center gap-2">
                  <FiAlertCircle size={24} className="text-gray-400" />
                  Нет пользователей в системе
                </li>
              )}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

function getNewUserCount(users: UserProfile[] | undefined) {
  if (!users) return 0;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return users.filter((user) =>
    user.created_at && new Date(user.created_at) > oneWeekAgo
  ).length;
}

function getSubscribedUserCount(users: UserProfile[] | undefined) {
  if (!users) return 0;

  return users.filter((user) => user.is_subscribed === true).length;
}
export default AdminDashboard;