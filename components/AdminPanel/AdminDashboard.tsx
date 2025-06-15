'use client';

import React, { useEffect, useState, useRef, ReactNode, useCallback } from 'react';
import { Card, CardBody, CardHeader, CardFooter, Divider, Spinner, Button, Chip } from '@nextui-org/react';
import { MdInventory, MdOutlineCategory, MdArrowForward, MdTrendingUp, MdPerson } from 'react-icons/md';
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

  const itemsRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const usersRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const lowStockItems = items.filter(item => item.quantity < 5);
  const outOfStockItems = items.filter(item => item.quantity === 0);
  const lowStockPercentage = items.length > 0 ? Math.round((lowStockItems.length / items.length) * 100) : 0;

  const subcategoriesCount = categories.reduce(
    (count, category) => count + category.subcategories.length,
    0
  );

  const discountedItems = items.filter(item => item.discount_price && item.discount_price < item.price);

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

      <div ref={itemsRef}>
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
                  <p className="text-small text-default-500 truncate">
                    Общая стоимость: <span className="font-medium">{totalInventoryValue.toLocaleString('ru-RU')} р.</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Chip
                    size="sm"
                    variant="flat"
                    color={lowStockPercentage > 20 ? "danger" : "success"}
                    className="text-xs"
                  >
                    {lowStockPercentage}% товаров заканчивается
                  </Chip>
                </div>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Всего товаров</span>
                    <span className="text-sm font-bold text-blue-700">{items.length}</span>
                  </div>
                  <div className="h-1 w-full bg-blue-200 rounded-full mb-2">
                    <div className="h-1 bg-blue-600 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500">Общее количество в системе</p>
                </div>

                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Товаров в наличии</span>
                    <span className="text-sm font-bold text-green-700">{items.length - outOfStockItems.length}</span>
                  </div>
                  <div className="h-1 w-full bg-green-200 rounded-full mb-2">
                    <div
                      className="h-1 bg-green-600 rounded-full"
                      style={{ width: `${items.length ? ((items.length - outOfStockItems.length) / items.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">Доступно для продажи</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Товары с низким остатком</span>
                  <span className="text-xs font-medium px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                    {lowStockItems.length} из {items.length}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Товары со скидкой</span>
                  <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {discountedItems.length} из {items.length}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-md font-medium">Заканчивающиеся товары</h3>
                <Chip
                  size="sm"
                  variant="flat"
                  color="danger"
                  className="text-xs"
                >
                  Требуют внимания
                </Chip>
              </div>              <ul className="divide-y">
                {lowStockItems
                  .sort((a, b) => a.quantity - b.quantity)
                  .slice(0, 5)
                  .map(item => (
                    <li key={item.id} className="py-3 flex justify-between items-center hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => router.push(`/admin/items?edit=${item.id}`)}>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                            {(item.item_images && item.item_images[0]) ? (
                              <div className="w-full h-full bg-white flex items-center justify-center">
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${item.item_images[0].image_url})` }}></div>
                              </div>
                            ) : (
                              <FaTags className="text-primary-color" size={20} />
                            )}
                          </div>
                          <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${item.quantity === 0
                            ? "bg-red-500"
                            : item.quantity <= 2
                              ? "bg-orange-500"
                              : "bg-yellow-500"
                            }`}>
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm truncate max-w-[180px] sm:max-w-none">{item.name}</span>
                          <span className="text-xs">
                            {item.discount_price && item.discount_price < item.price
                              ? (
                                <span className="flex items-center gap-1">
                                  <span className="text-red-600 font-medium">{item.discount_price} р.</span>
                                  <span className="line-through text-gray-500">{item.price} р.</span>
                                  <span className="bg-orange-100 text-orange-600 px-1 rounded-sm text-[10px]">
                                    -{Math.round(100 - (item.discount_price / item.price) * 100)}%
                                  </span>
                                </span>
                              )
                              : <span className="text-gray-500">{item.price} р.</span>
                            }
                          </span>
                        </div>
                      </div>
                      <div>
                        {item.quantity === 0 ? (
                          <Chip size="sm" color="danger" variant="flat" className="text-xs">Нет в наличии</Chip>
                        ) : item.quantity <= 2 ? (
                          <Chip size="sm" color="warning" variant="flat" className="text-xs">Критически мало</Chip>
                        ) : (
                          <Chip size="sm" color="warning" variant="flat" className="text-xs">Мало на складе</Chip>
                        )}
                      </div>
                    </li>
                  ))}
                {lowStockItems.length === 0 && (
                  <li className="py-6 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 rounded-full bg-green-100">
                        <IoMdRefresh className="text-green-600" size={24} />
                      </div>
                      <p>Все товары в достаточном количестве</p>
                    </div>
                  </li>
                )}
              </ul>
            </CardBody>
            {lowStockItems.length > 5 && (
              <CardFooter>
                <Button
                  className="w-full bg-light-secondary-color text-primary-color"
                  onClick={() => router.push('/admin/items')}
                  endContent={<MdArrowForward />}
                >
                  Показать все заканчивающиеся товары ({lowStockItems.length})
                </Button>
              </CardFooter>
            )}
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex gap-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">Аналитика ассортимента</p>
                  <p className="text-small text-default-500">Обзор товаров и состояния каталога</p>
                </div>
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
              </div>              <div className="mb-4 grid grid-cols-2 gap-3">
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex items-center gap-2 mb-2">
                    <MdTrendingUp className="text-primary-color" size={16} />
                    <span className="text-sm font-medium text-gray-700">Ценовая статистика</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Средняя цена</span>
                      <span className="text-xs font-medium text-purple-700">
                        {items.length ? Math.round(items.reduce((sum, item) => sum + item.price, 0) / items.length) : 0} р.
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-600">Средняя скидка</span>
                      <span className="text-xs font-medium text-purple-700">
                        {discountedItems.length ? Math.round(discountedItems.reduce((sum, item) =>
                          sum + (100 - (item.discount_price! / item.price) * 100), 0) / discountedItems.length) : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="flex items-center gap-2 mb-2">
                    <MdOutlineCategory className="text-primary-color" size={16} />
                    <span className="text-sm font-medium text-gray-700">Категории</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Основных</span>
                      <span className="text-xs font-medium text-orange-700">{categories.length}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-600">Подкатегорий</span>
                      <span className="text-xs font-medium text-orange-700">{subcategoriesCount}</span>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-md font-medium mb-3 flex items-center gap-2">
                Аналитика каталога
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                      <MdTrendingUp className="text-primary-color" size={24} />
                    </div>
                    <div className="text-2xl font-bold text-blue-700">
                      {items.length > 0
                        ? Math.round((discountedItems.length / items.length) * 100)
                        : 0}%
                    </div>
                    <div className="text-sm text-gray-600">товаров со скидкой</div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <FaBoxOpen className="text-primary-color" size={22} />
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                      {items.length > 0
                        ? Math.round(((items.length - outOfStockItems.length) / items.length) * 100)
                        : 0}%
                    </div>
                    <div className="text-sm text-gray-600">товаров в наличии</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700">Топ категорий по товарам</h4>
                  <span className="text-xs text-primary-color font-medium">Всего: {categories.length}</span>
                </div>

                <div className="space-y-3">
                  {categories.slice(0, 3).map((category, index) => (
                    <div key={category.id} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-color/10 flex items-center justify-center text-xs font-medium text-primary-color">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium">{category.name}</span>
                          <span className="text-xs text-gray-500">{category.subcategories.length} подкат.</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full mt-1">
                          <div
                            className="h-1.5 bg-primary-color rounded-full"
                            style={{ width: `${Math.min(100, (category.subcategories.length / subcategoriesCount) * 100 * 3)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


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
      <div ref={usersRef}>
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
                          <span className="text-sm truncate sm:max-w-none max-w-[170px]">
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