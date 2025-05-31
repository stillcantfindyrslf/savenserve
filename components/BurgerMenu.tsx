"use client";

import React, { useState } from "react";
import {
  Button,
  Avatar,
  Drawer,
  Input,
  DrawerContent
} from "@nextui-org/react";
import { IoIosList } from "react-icons/io";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import { FiSearch } from "react-icons/fi";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import Link from "next/link";

interface BurgerMenuProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  isAdmin?: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showSearch?: boolean;
  handleCartClick: () => void;
  openAuthModal: () => void;
  handleLogout: () => void;
  handleCatalogClick: () => void;
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({
  user,
  isAdmin,
  searchQuery,
  setSearchQuery,
  showSearch = true,
  handleCartClick,
  openAuthModal,
  handleLogout,
  handleCatalogClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const getUserInitials = () => {
    if (!user) return "";

    const name = user.user_metadata?.name || user.email || "";
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const userAvatarUrl = user?.user_metadata?.avatar_url || null;

  return (
    <>
      <div className="md:hidden">
        <Button
          isIconOnly
          variant="light"
          onPress={toggleMenu}
          className="text-light-white-color"
        >
          <RxHamburgerMenu size={24} />
        </Button>
      </div>

      <Drawer
        isOpen={isOpen}
        onClose={closeMenu}
        placement="right"
        hideCloseButton
        size="xs"
        classNames={{
          body: "p-0",
        }}
      >
        <DrawerContent>
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-bold text-lg text-color-text">Меню</span>
              <Button isIconOnly variant="light" onPress={closeMenu}>
                <RxCross2 size={24} className="text-color-text" />
              </Button>
            </div>

            <div className="p-4 space-y-5 overflow-y-auto flex-1">
              {showSearch && (
                <div className="mb-4">
                  <Input
                    isClearable
                    fullWidth
                    placeholder="Поиск..."
                    size="sm"
                    radius="full"
                    startContent={<FiSearch size={18} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClear={() => setSearchQuery("")}
                  />
                </div>
              )}

              <div className="border-b pb-4">
                {user ? (
                  <Link href="/profile" onClick={closeMenu}>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={userAvatarUrl || undefined}
                      name={getUserInitials()}
                      size="md"
                      radius="full"
                      color="success"
                      showFallback
                    />
                    <div>
                      <p className="font-medium text-color-text truncate max-w-[180px]">
                        {user.user_metadata?.name || user.email}
                      </p>
                    </div>
                  </div>
                  </Link>
                ) : (
                  <Button
                    className="w-full bg-green-500 text-white"
                    onPress={() => {
                      closeMenu();
                      openAuthModal();
                    }}
                  >
                    Войти в аккаунт
                  </Button>
                )}
              </div>

              <div className="flex flex-col gap-2 border-b pb-4">
                <Button
                  variant="flat"
                  className="w-full justify-start gap-2 py-3 px-4"
                  onPress={() => {
                    closeMenu();
                    handleCatalogClick();
                  }}
                >
                  <IoIosList size={20} className="text-color-text" />
                  <span>Каталог</span>
                </Button>

                <Button
                  variant="flat"
                  className="w-full justify-start gap-2 py-3 px-4"
                  onPress={() => {
                    closeMenu();
                    handleCartClick();
                  }}
                >
                  <div className="relative">
                    <PiShoppingCartSimpleBold size={20} className="text-color-text" />
                  </div>
                  <span>Корзина</span>
                </Button>

                {isAdmin && (
                  <Link href="/admin" onClick={closeMenu}>
                    <Button
                      variant="flat"
                      className="w-full justify-start gap-2 py-3 px-4"
                    >
                      <MdOutlineAdminPanelSettings size={20} className="text-color-text" />
                      <span>Админ-панель</span>
                    </Button>
                  </Link>
                )}
              </div>

              {user && (
                <div className="mt-4">
                  <Button
                    color="danger"
                    variant="flat"
                    className="w-full"
                    onPress={() => {
                      closeMenu();
                      handleLogout();
                    }}
                  >
                    Выйти из аккаунта
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default BurgerMenu;