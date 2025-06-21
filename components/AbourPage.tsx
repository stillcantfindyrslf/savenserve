"use client";

import React, { useState } from 'react';
import { NextPage } from 'next';
import { Card } from '@nextui-org/react';
import FloatingNavbar from './FloatingNavbar';
import { MdStorefront, MdShoppingCart, MdOutlineMonitorHeart, MdOutlinePublic } from 'react-icons/md';
import { IoLeafOutline, IoCheckmarkCircleOutline, IoRocketOutline } from 'react-icons/io5';
import { PiPlantFill } from 'react-icons/pi';
import { RiEarthLine } from 'react-icons/ri';
import { BiShoppingBag } from 'react-icons/bi';
import Link from 'next/link';

const AboutPage: NextPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <FloatingNavbar showSearch={false} searchQuery={searchQuery} setSearchQuery={setSearchQuery} showCart={false} showUserMenu={false} />

      <section className="mt-32 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-color/10 z-[-1]"></div>
        <div className="container mx-auto px-4 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary-color rounded-full relative flex items-center justify-center">
                <PiPlantFill className="text-white w-10 h-10 sm:w-12 sm:h-12" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-color-text mb-6">
              О проекте <span className="text-primary-color">SaveNServe</span>
            </h1>
            <p className="text-lg sm:text-xl text-color-text leading-relaxed mb-8">
              Современная платформа, направленная на сокращение пищевых отходов и оптимизацию продаж
              продуктов с истекающим сроком годности
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <div className="bg-light-secondary-color py-2 px-4 rounded-full flex items-center gap-2">
                <IoLeafOutline className="text-primary-color" size={20} />
                <span className="font-medium">Экологично</span>
              </div>
              <div className="bg-light-secondary-color py-2 px-4 rounded-full flex items-center gap-2">
                <MdOutlineMonitorHeart className="text-primary-color" size={20} />
                <span className="font-medium">Устойчиво</span>
              </div>
              <div className="bg-light-secondary-color py-2 px-4 rounded-full flex items-center gap-2">
                <IoRocketOutline className="text-primary-color" size={20} />
                <span className="font-medium">Инновационно</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-16 container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
          Что мы <span className="text-primary-color">делаем</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow border-none">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-light-secondary-color flex items-center justify-center mb-4">
                <MdStorefront className="text-primary-color" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-3">Помогаем магазинам</h3>
              <p className="text-gray-600 text-sm">
                Быстро и выгодно реализовывать товары с приближающимся сроком годности, минимизируя убытки и предотвращая излишние отходы
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow border-none">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-light-secondary-color flex items-center justify-center mb-4">
                <MdShoppingCart className="text-primary-color" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-3">Предлагаем пользователям</h3>
              <p className="text-gray-600 text-sm">
                Возможность приобретать качественные продукты по сниженным ценам, способствуя разумному потреблению
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow border-none">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-light-secondary-color flex items-center justify-center mb-4">
                <BiShoppingBag className="text-primary-color" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-3">Управляем товарами</h3>
              <p className="text-gray-600 text-sm">
                Удобная система добавления товаров со сроком годности, установки скидок для магазинов и кафе
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow border-none">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-light-secondary-color flex items-center justify-center mb-4">
                <MdOutlinePublic className="text-primary-color" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-3">Строим отношения</h3>
              <p className="text-gray-600 text-sm">
                Прозрачные, доверительные отношения между магазинами-партнёрами и покупателями, предоставляя удобные инструменты
              </p>
            </div>
          </Card>
        </div>
      </section>

      <section className="py-10 sm:py-16 bg-light-secondary-color/40">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            Как это <span className="text-primary-color">работает</span>
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-9 top-0 bottom-0 w-1 bg-primary-color/20 hidden sm:block"></div>

              <div className="flex flex-col sm:flex-row items-start gap-4 mb-12 relative">
                <div className="w-20 h-20 rounded-full bg-primary-color flex items-center justify-center flex-shrink-0 z-10 sm:mt-0">
                  <span className="text-white text-xl font-bold">1</span>
                </div>
                <Card className="p-6 bg-white shadow-sm w-full sm:w-auto ml-0 sm:ml-6">
                  <h3 className="text-xl font-semibold mb-2">Размещение товаров</h3>
                  <p className="text-gray-600">
                    Магазины и поставщики размещают на платформе информацию о товарах,
                    срок годности которых подходит к концу.
                  </p>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-4 mb-12 relative">
                <div className="w-20 h-20 rounded-full bg-primary-color flex items-center justify-center flex-shrink-0 z-10 sm:mt-0">
                  <span className="text-white text-xl font-bold">2</span>
                </div>
                <Card className="p-6 bg-white shadow-sm w-full sm:w-auto ml-0 sm:ml-6">
                  <h3 className="text-xl font-semibold mb-2">Выбор и заказ</h3>
                  <p className="text-gray-600">
                    Покупатели просматривают ассортимент, выбирают нужные продукты, оформляют заказы
                    и получают их напрямую.
                  </p>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-4 relative">
                <div className="w-20 h-20 rounded-full bg-primary-color flex items-center justify-center flex-shrink-0 z-10 sm:mt-0">
                  <span className="text-white text-xl font-bold">3</span>
                </div>
                <Card className="p-6 bg-white shadow-sm w-full sm:w-auto ml-0 sm:ml-6">
                  <h3 className="text-xl font-semibold mb-2">Умный контроль</h3>
                  <p className="text-gray-600">
                    Система автоматически отслеживает сроки годности, формирует скидки
                    и уведомляет пользователей о самых выгодных предложениях.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            Наша <span className="text-primary-color">миссия</span>
          </h2>

          <div className="relative">
            <div className="absolute -inset-1 bg-primary-color/10 rounded-xl blur-lg"></div>
            <Card className="p-8 bg-white shadow-sm border-none relative z-10">
              <div className="flex flex-col items-center text-center">
                <RiEarthLine className="text-primary-color mb-4" size={64} />
                <p className="text-lg sm:text-xl text-color-text leading-relaxed">
                  Сократить количество пищевых отходов, повысить осознанность потребления и внести вклад
                  в защиту окружающей среды. Мы верим, что современные технологии способны сделать мир
                  чище, а экономику — более устойчивой.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-light-white-color">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            Почему выбирают <span className="text-primary-color">нас</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-light-secondary-color flex items-center justify-center flex-shrink-0">
                <IoCheckmarkCircleOutline className="text-primary-color" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Честные и прозрачные условия</h3>
                <p className="text-gray-600">
                  Мы обеспечиваем равные и понятные условия для всех участников нашей платформы.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-light-secondary-color flex items-center justify-center flex-shrink-0">
                <IoCheckmarkCircleOutline className="text-primary-color" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Современные стандарты</h3>
                <p className="text-gray-600">
                  Поддержка современных стандартов безопасности данных и удобства пользования.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-light-secondary-color flex items-center justify-center flex-shrink-0">
                <IoCheckmarkCircleOutline className="text-primary-color" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Постоянное развитие</h3>
                <p className="text-gray-600">
                  Непрерывное совершенствование функционала, основанное на потребностях пользователей и партнеров.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-light-secondary-color flex items-center justify-center flex-shrink-0">
                <IoCheckmarkCircleOutline className="text-primary-color" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Экологическая ответственность</h3>
                <p className="text-gray-600">
                  Экологическая и социальная ответственность — в основе каждого нашего решения.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-primary-color">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Присоединяйтесь к SaveNServe
          </h2>
          <p className="text-lg text-white mb-8 max-w-2xl mx-auto">
            Сделайте свой вклад в устойчивое будущее вместе с нами!
            Каждая покупка — шаг к заботе о планете и экономии ресурсов.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/" className="bg-white text-primary-color py-3 px-8 rounded-full font-medium hover:bg-secondary-color hover:text-color-text transition-colors">
              Начать покупки
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;