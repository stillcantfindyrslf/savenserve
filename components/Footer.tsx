import React from 'react';
import Link from 'next/link';
import { Divider } from '@nextui-org/react';
import { MdOutlineMail, MdOutlineLocalPhone } from 'react-icons/md';
import { RiMapPin2Line } from 'react-icons/ri';
import { PiPlantFill } from 'react-icons/pi';
import { IoCheckmarkSharp } from 'react-icons/io5';

const Footer = () => {
  return (
    <footer className="bg-emerald-600 text-white mt-6 md:mt-12">
      <div className="container mx-auto px-3 sm:px-4 md:px-5 py-6 md:py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
          <div className="flex items-center mb-6 md:mb-8">
            <div className="relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] min-w-[80px] sm:min-w-[100px] mr-3 sm:mr-4">
              <div className="absolute inset-0 bg-primary-color rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <PiPlantFill className="text-white" size={40} />
              </div>
              <div className="absolute -top-2 sm:-top-3 left-0 bg-white rounded-full py-0.5 sm:py-1 px-2 sm:px-3">
                <span className="text-primary-color font-bold text-base sm:text-lg">SAVE IT</span>
              </div>
            </div>
            <h2 className="text-white font-bold text-xl sm:text-2xl md:text-4xl uppercase">
              Каждый заказ<br className="hidden sm:block" /> имеет значение!
            </h2>
          </div>
          <div className="flex flex-col gap-2 sm:gap-3 items-center md:items-end">
            <div className="flex items-center gap-2 sm:gap-3">
              <IoCheckmarkSharp className="text-white" size={20} />
              <span className="text-white font-semibold text-base sm:text-lg">СОКРАТИ CO₂</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <IoCheckmarkSharp className="text-white" size={20} />
              <span className="text-white font-semibold text-base sm:text-lg">СПАСИ ПРОДУКТЫ</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <IoCheckmarkSharp className="text-white" size={20} />
              <span className="text-white font-semibold text-base sm:text-lg">ЭКОНОМЬ ДЕНЬГИ</span>
            </div>
          </div>
        </div>
      </div>
      <Divider className="bg-white/30 h-[2px] sm:h-[3px]" />

      <div className="container mx-auto px-3 sm:px-4 md:px-5 py-6 md:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="text-start">
            <h3 className="font-semibold text-white text-base sm:text-lg mb-3 sm:mb-4 uppercase">SaveNServe</h3>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <Link href="/" className="text-gray-300 hover:text-lime-300 transition-colors text-sm sm:text-base">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-lime-300 transition-colors text-sm sm:text-base">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-300 hover:text-lime-300 transition-colors text-sm sm:text-base">
                  Личный кабинет
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-gray-300 hover:text-lime-300 transition-colors text-sm sm:text-base">
                  Избранное
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-300 hover:text-lime-300 transition-colors text-sm sm:text-base">
                  Корзина
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-start">
            <h3 className="font-semibold text-white text-base sm:text-lg mb-3 sm:mb-4 uppercase">Категории</h3>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <Link href="/category/cereals" className="text-gray-300 hover:text-lime-300 transition-colors text-sm sm:text-base">
                  Крупы, каши, хлопья
                </Link>
              </li>
              <li>
                <Link href="/category/dairy-products" className="text-gray-300 hover:text-lime-300 transition-colors text-sm sm:text-base">
                  Молочные продукты
                </Link>
              </li>
              <li>
                <Link href="/category/salami" className="text-gray-300 hover:text-lime-300 transition-colors text-sm sm:text-base">
                  Колбасные изделия
                </Link>
              </li>
              <li>
                <Link href="/category/pasta" className="text-gray-300 hover:text-lime-300 transition-colors text-sm sm:text-base">
                  Макароны
                </Link>
              </li>
              <li>
                <Link href="/category/snacks" className="text-gray-300 hover:text-lime-300 transition-colors text-sm sm:text-base">
                  Снеки
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-start">
            <h3 className="font-semibold text-white text-base sm:text-lg mb-3 sm:mb-4 uppercase">Контакты</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start gap-2 sm:gap-3 justify-start">
                <RiMapPin2Line className="text-gray-300 mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-300 text-sm sm:text-base">г. Брест, ул. Экологическая, 42</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3 justify-start">
                <MdOutlineLocalPhone className="text-gray-300 flex-shrink-0" size={18} />
                <span className="text-gray-300 text-sm sm:text-base">+7 (800) 123-45-67</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3 justify-start">
                <MdOutlineMail className="text-gray-300 flex-shrink-0" size={18} />
                <span className="text-gray-300 text-sm sm:text-base">info@savenserve.by</span>
              </li>
            </ul>
          </div>


          <div className="text-start md:col-span-3 lg:col-span-1">
            <h3 className="font-semibold text-white text-base sm:text-lg mb-3 sm:mb-4 uppercase">О нас</h3>
            <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
              SaveNServe - ваш надежный маркетплейс для покупки экологически чистых продуктов.
              Мы помогаем сохранять планету, предлагая товары с минимальным углеродным следом.
            </p>
          </div>
        </div>

        <Divider className="my-4 sm:my-6 md:my-8 bg-white/30 h-[1px] sm:h-[2px]" />

        <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6">
          <h2 className="text-white font-bold text-lg sm:text-xl">SaveNServe</h2>

          <div className="text-xs sm:text-sm text-gray-300 flex items-center gap-1 sm:gap-2 text-center">
            <span>Сервис экологичных продуктов с заботой о планете</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;