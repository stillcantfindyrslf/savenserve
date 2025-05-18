'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { MdInventory, MdOutlineCategory, MdShoppingCart } from 'react-icons/md';
import { FaUsers } from 'react-icons/fa';
import useItemsStore from '@/store/useItemStore';
import useCategoriesStore from '@/store/useCategoriesStore/useCategoriesStore';

const AdminDashboard = () => {
  const { items, fetchItems } = useItemsStore();
  const { categories, fetchCategories } = useCategoriesStore();
  const [statsLoaded, setStatsLoaded] = useState(false);

  // Количество товаров, заканчивающихся на складе (менее 5 шт)
  const lowStockItems = items.filter(item => item.quantity < 5).length;
  
  // Общее количество категорий и подкатегорий
  const subcategoriesCount = categories.reduce(
    (count, category) => count + category.subcategories.length, 
    0
  );

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchItems(),
        fetchCategories()
      ]);
      setStatsLoaded(true);
    };
    
    loadData();
  }, [fetchItems, fetchCategories]);

  const stats = [
    {
      title: 'Всего товаров',
      value: items.length,
      icon: <MdInventory size={28} className="text-primary-color" />,
      info: `${lowStockItems} товаров заканчивается`,
      color: 'bg-light-secondary-color'
    },
    {
      title: 'Категорий',
      value: categories.length,
      icon: <MdOutlineCategory size={28} className="text-primary-color" />,
      info: `${subcategoriesCount} подкатегорий`,
      color: 'bg-blue-50'
    },
    {
      title: 'Заказов',
      value: '14',
      icon: <MdShoppingCart size={28} className="text-primary-color" />,
      info: '2 новых сегодня',
      color: 'bg-purple-50'
    },
    {
      title: 'Пользователей',
      value: '28',
      icon: <FaUsers size={28} className="text-primary-color" />,
      info: '5 новых за неделю',
      color: 'bg-orange-50'
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-color-text mb-6">Обзор системы</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-sm">
              <CardBody className={`${stat.color} rounded-xl p-4`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-color-text mt-1">{stat.value}</h3>
                    <p className="text-xs text-gray-500 mt-2">{stat.info}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white shadow-sm">
                    {stat.icon}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Последние товары</p>
              <p className="text-small text-default-500">Недавно добавленные товары</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <ul className="divide-y">
              {items.slice(0, 5).map(item => (
                <li key={item.id} className="py-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <MdInventory className="text-primary-color" />
                    </div>
                    <span>{item.name}</span>
                  </div>
                  <div className="text-sm text-gray-500">{item.price} р.</div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Заканчивающиеся товары</p>
              <p className="text-small text-default-500">Товары с низким остатком</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <ul className="divide-y">
              {items
                .filter(item => item.quantity < 5)
                .slice(0, 5)
                .map(item => (
                  <li key={item.id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                        <span className="text-red-500 text-sm font-semibold">{item.quantity}</span>
                      </div>
                      <span>{item.name}</span>
                    </div>
                    <div className="text-sm bg-red-50 py-1 px-2 rounded text-red-500">
                      Мало на складе
                    </div>
                  </li>
                ))}
              {items.filter(item => item.quantity < 5).length === 0 && (
                <li className="py-6 text-center text-gray-500">
                  Нет товаров с низким остатком
                </li>
              )}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;