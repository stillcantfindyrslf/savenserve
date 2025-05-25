import React from 'react';
import Link from 'next/link';
import { Divider } from '@nextui-org/react';
import { MdOutlineMail, MdOutlineLocalPhone } from 'react-icons/md';
import { RiMapPin2Line } from 'react-icons/ri';
import { PiPlantFill } from 'react-icons/pi';
import { IoCheckmarkSharp } from 'react-icons/io5';

const Footer = () => {
  return (
    <footer className="bg-emerald-600 text-white mt-12">
      <div className="container mx-auto px-5 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
          <div className="flex items-center mb-8">
            <div className="relative w-[100px] h-[100px] min-w-[100px] mr-4">
              <div className="absolute inset-0 bg-primary-color rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <PiPlantFill className="text-white" size={50} />
              </div>
              <div className="absolute -top-3 left-0 bg-white rounded-full py-1 px-3">
                <span className="text-primary-color font-bold text-lg">SAVE IT</span>
              </div>
            </div>
            <h2 className="text-white font-bold text-2xl md:text-4xl uppercase">
              Каждый заказ<br className="hidden sm:block" /> имеет значение!
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <IoCheckmarkSharp className="text-white" size={24} />
              <span className="text-white font-semibold text-lg">СОКРАТИ CO₂</span>
            </div>
            <div className="flex items-center gap-3">
              <IoCheckmarkSharp className="text-white" size={24} />
              <span className="text-white font-semibold text-lg">СПАСИ ПРОДУКТЫ</span>
            </div>
            <div className="flex items-center gap-3">
              <IoCheckmarkSharp className="text-white" size={24} />
              <span className="text-white font-semibold text-lg">ЭКОНОМЬ ДЕНЬГИ</span>
            </div>
          </div>
        </div>
      </div>
      <Divider className="bg-white/30 h-[3px]" />

      <div className="container mx-auto px-5 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-white text-lg mb-4 uppercase">SaveNServe</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-gray-300 hover:text-lime-300 transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-lime-300 transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-300 hover:text-lime-300 transition-colors">
                  Личный кабинет
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-gray-300 hover:text-lime-300 transition-colors">
                  Избранное
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-300 hover:text-lime-300 transition-colors">
                  Корзина
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white text-lg mb-4 uppercase">Категории</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/category/cereals" className="text-gray-300 hover:text-lime-300 transition-colors">
                  Крупы, каши хлопья
                </Link>
              </li>
              <li>
                <Link href="/category/dairy-products" className="text-gray-300 hover:text-lime-300 transition-colors">
                  Молочные продукты
                </Link>
              </li>
              <li>
                <Link href="/category/salami" className="text-gray-300 hover:text-lime-300 transition-colors">
                  Колбасные изделия
                </Link>
              </li>
              <li>
                <Link href="/category/pasta" className="text-gray-300 hover:text-lime-300 transition-colors">
                  Макароны
                </Link>
              </li>
              <li>
                <Link href="/category/snacks" className="text-gray-300 hover:text-lime-300 transition-colors">
                  Снеки
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white text-lg mb-4 uppercase">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <RiMapPin2Line className="text-gray-300 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-300">г. Брест, ул. Экологическая, 42</span>
              </li>
              <li className="flex items-center gap-3">
                <MdOutlineLocalPhone className="text-gray-300 flex-shrink-0" size={20} />
                <span className="text-gray-300">+7 (800) 123-45-67</span>
              </li>
              <li className="flex items-center gap-3">
                <MdOutlineMail className="text-gray-300 flex-shrink-0" size={20} />
                <span className="text-gray-300">info@savenserve.by</span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 lg:col-span-1">
            <h3 className="font-semibold text-white text-lg mb-4 uppercase">О нас</h3>
            <p className="text-gray-300 text-sm mb-4">
              SaveNServe - ваш надежный маркетплейс для покупки экологически чистых продуктов.
              Мы помогаем сохранять планету, предлагая товары с минимальным углеродным следом.
            </p>
          </div>
        </div>

        <Divider className="my-8 bg-white/30 h-[2px]" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <h2 className="text-white font-bold text-xl">SaveNServe</h2>

          <div className="text-sm text-gray-300 flex items-center gap-2">
            <span>Сервис экологичных продуктов с заботой о планете</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;