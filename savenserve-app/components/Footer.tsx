'use client';

import React from 'react';
import Link from 'next/link';
import { Divider } from '@nextui-org/react';
import { FaFacebook, FaTwitter, FaInstagram, FaTelegram } from 'react-icons/fa';
import { MdOutlineMail, MdOutlineLocalPhone } from 'react-icons/md';
import { RiMapPin2Line } from 'react-icons/ri';
import { PiPlantFill } from 'react-icons/pi';

const Footer = () => {
  return (
    <footer className="bg-white mt-12 shadow-[0_-4px_5px_rgba(0,0,0,0.01)]">
      <div className=" mx-auto px-5 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary-color rounded-full p-2">
                <PiPlantFill className="text-white" size={24} />
              </div>
              <span className="font-bold text-2xl text-primary-color">SaveNServe</span>
            </div>
            <p className="text-gray-600 text-sm">
              SaveNServe - ваш надежный маркетплейс для покупки экологически чистых продуктов.
              Мы помогаем сохранять планету, предлагая товары с минимальным углеродным следом.
            </p>
            <div className="flex space-x-3 pt-2">
              <a
                href="#"
                className="bg-light-secondary-color hover:bg-secondary-color transition-colors p-2.5 rounded-full"
                aria-label="Facebook"
              >
                <FaFacebook className="text-primary-color" size={20} />
              </a>
              <a
                href="#"
                className="bg-light-secondary-color hover:bg-secondary-color transition-colors p-2.5 rounded-full"
                aria-label="Twitter"
              >
                <FaTwitter className="text-primary-color" size={20} />
              </a>
              <a
                href="#"
                className="bg-light-secondary-color hover:bg-secondary-color transition-colors p-2.5 rounded-full"
                aria-label="Instagram"
              >
                <FaInstagram className="text-primary-color" size={20} />
              </a>
              <a
                href="#"
                className="bg-light-secondary-color hover:bg-secondary-color transition-colors p-2.5 rounded-full"
                aria-label="Telegram"
              >
                <FaTelegram className="text-primary-color" size={20} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-color-text text-lg mb-4">Полезные ссылки</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary-color transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-primary-color transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-600 hover:text-primary-color transition-colors">
                  Личный кабинет
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-gray-600 hover:text-primary-color transition-colors">
                  Избранное
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-600 hover:text-primary-color transition-colors">
                  Корзина
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-color-text text-lg mb-4">Категории</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/category/fruits" className="text-gray-600 hover:text-primary-color transition-colors">
                  Фрукты и овощи
                </Link>
              </li>
              <li>
                <Link href="/category/dairy" className="text-gray-600 hover:text-primary-color transition-colors">
                  Молочные продукты
                </Link>
              </li>
              <li>
                <Link href="/category/meat" className="text-gray-600 hover:text-primary-color transition-colors">
                  Мясо и птица
                </Link>
              </li>
              <li>
                <Link href="/category/baking" className="text-gray-600 hover:text-primary-color transition-colors">
                  Выпечка
                </Link>
              </li>
              <li>
                <Link href="/category/drinks" className="text-gray-600 hover:text-primary-color transition-colors">
                  Напитки
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-color-text text-lg mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <RiMapPin2Line className="text-primary-color mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-600">г. Брест, ул. Экологическая, 42</span>
              </li>
              <li className="flex items-center gap-3">
                <MdOutlineLocalPhone className="text-primary-color flex-shrink-0" size={20} />
                <span className="text-gray-600">+7 (800) 123-45-67</span>
              </li>
              <li className="flex items-center gap-3">
                <MdOutlineMail className="text-primary-color flex-shrink-0" size={20} />
                <span className="text-gray-600">info@savenserve.ru</span>
              </li>
            </ul>
          </div>
        </div>

        <Divider className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} SaveNServe. Все права защищены.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;