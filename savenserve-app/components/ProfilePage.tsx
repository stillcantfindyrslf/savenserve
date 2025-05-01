'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input, Avatar, Spinner, Card, Tooltip } from '@nextui-org/react';
import useAuthStore from '@/store/useAuthStore';
import { toast } from 'sonner';
import FloatingNavbar from '@/components/FloatingNavbar';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { RiLockPasswordLine, RiGoogleFill } from 'react-icons/ri';
import { MdOutlineSecurity, MdOutlineLocalShipping, MdOutlineFoodBank, MdOutlineDiscount } from 'react-icons/md';
import { IoMailOpenOutline } from "react-icons/io5";
import Link from 'next/link';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const ProfilePage = () => {
  const { user, updateProfile, uploadAvatar, resetPassword, loading: authLoading } = useAuthStore();
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [isPageReady, setIsPageReady] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        setName(user.user_metadata?.full_name || '');
        setAvatarUrl(user.user_metadata?.avatar_url || null);
      }
      setIsPageReady(true);
    }
  }, [user, authLoading]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Размер файла не должен превышать 5MB');
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) {
      toast.error('Email пользователя не найден');
      return;
    }

    setResetLoading(true);
    try {
      const { success, error } = await resetPassword(user.email);

      if (!success) throw new Error(error);

      toast.success('На ваш email отправлена инструкция по сбросу пароля');
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error('Произошла ошибка при запросе сброса пароля');
    } finally {
      setResetLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    if (!name.trim()) {
      toast.error('Имя не может быть пустым');
      return;
    }

    setProfileLoading(true);
    try {
      let finalAvatarUrl = avatarUrl;

      if (avatarFile) {
        const { success, avatarUrl: newAvatarUrl, error } = await uploadAvatar(avatarFile);

        if (!success) throw new Error(error);

        finalAvatarUrl = newAvatarUrl || null;
      }

      const { success, error } = await updateProfile(name, finalAvatarUrl);

      if (!success) throw new Error(error);

      setAvatarUrl(finalAvatarUrl);
      setAvatarFile(null);
      setAvatarPreview(null);
      toast.success('Профиль успешно обновлен');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Ошибка при обновлении профиля: ' + (error.message || 'Что-то пошло не так'));
    } finally {
      setProfileLoading(false);
    }
  };

  const isExternalProvider = user?.app_metadata?.provider && user.app_metadata.provider !== 'email';
  const providerName = user?.app_metadata?.provider ? user.app_metadata.provider.charAt(0).toUpperCase() + user.app_metadata.provider.slice(1) : 'Email/Password';

  const formattedCreatedAt = user?.created_at
    ? format(new Date(user.created_at), "d MMMM yyyy 'в' HH:mm", { locale: ru })
    : '';

  if (!isPageReady || authLoading) {
    return (
      <>
        <FloatingNavbar showSearch={false} searchQuery="" setSearchQuery={() => { }} />
        <div className="mx-auto mt-32 p-4 flex justify-center">
          <Card className="p-12 bg-white rounded-2xl flex flex-col items-center">
            <Spinner size="lg" color="success" className="text-primary-color" />
            <p className="mt-4 text-gray-600">Загрузка данных...</p>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <FloatingNavbar showSearch={false} searchQuery="" setSearchQuery={() => { }} />
      <div className="mx-auto mt-32">
        {!user ? (
          <div className="flex justify-center">
            <Card className="p-12 bg-white rounded-2xl flex flex-col items-center">
              <Spinner size="lg" color="success" className="text-primary-color" />
              <p className="mt-4 text-gray-600">Проверка авторизации...</p>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <Card className="p-6 bg-white shadow-sm rounded-2xl">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <Avatar
                      src={avatarPreview || avatarUrl || undefined}
                      showFallback
                      size="lg"
                      className="w-32 h-32 text-large"
                      fallback={
                        <IoPersonCircleOutline className="w-16 h-16 text-primary-color" />
                      }
                      isBordered
                      color="success"
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-lg">{name || 'Пользователь'}</p>
                    <p className="text-sm text-gray-500">
                      {avatarFile ? `Выбрано: ${avatarFile.name}` : 'Нажмите для выбора фото'}
                    </p>
                  </div>
                  <Button
                    className="bg-light-secondary-color text-color-text"
                    onPress={() => document.getElementById('avatar-input')?.click()}
                    size="sm"
                  >
                    Изменить фото
                  </Button>
                  <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <div className="w-full pt-4 border-t space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Email:</p>
                      <p className="font-medium text-sm">
                        {user.email}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Вход через:</p>
                      <p className="font-medium text-sm flex items-center gap-1">
                        {isExternalProvider && <RiGoogleFill className="text-primary-color" />}
                        {!isExternalProvider && <IoMailOpenOutline className="text-primary-color" />}
                        {providerName}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Дата регистрации:</p>
                      <p className="font-medium text-sm">{formattedCreatedAt}</p>
                    </div>
                  </div>

                  <div className="w-full mt-4">
                    <Link href="/cart">
                      <Button
                        className="bg-light-secondary-color text-color-text w-full hover:bg-gray-100"
                        variant="flat"
                        startContent={<MdOutlineLocalShipping size={18} />}
                      >
                        Моя корзина
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card className="p-6 bg-white shadow-sm rounded-2xl">
                {profileLoading ? (
                  <div className="flex justify-center py-10">
                    <Spinner color="success" className="text-primary-color" size="lg" />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-color-text">
                      <IoPersonCircleOutline className="text-primary-color" size={24} />
                      Мои данные
                    </h2>

                    <div className="space-y-4">
                      <Input
                        label="Ваше имя"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="bordered"
                        className="max-w-md"
                        description="Это имя будет отображаться в вашем профиле и заказах"
                      />

                      <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-color-text">
                          <MdOutlineSecurity className="text-primary-color" size={24} />
                          Безопасность
                        </h2>

                        <div className="p-4 bg-light-white-color rounded-xl">
                          <div className="flex items-center gap-3">
                            <RiLockPasswordLine size={20} className="text-primary-color" />
                            <div className="flex-1">
                              <h3 className="font-medium">Пароль</h3>
                              <p className="text-sm text-gray-600">Обновите пароль для защиты аккаунта</p>
                            </div>

                            {isExternalProvider ? (
                              <Tooltip content="Смена пароля недоступна для аккаунтов с входом через Google">
                                <Button
                                  className="bg-gray-100 text-gray-400 cursor-not-allowed"
                                  variant="flat"
                                  size="sm"
                                  isDisabled
                                >
                                  Недоступно для Google
                                </Button>
                              </Tooltip>
                            ) : (
                              <Button
                                className="bg-warning-100 text-warning-700"
                                variant="flat"
                                size="sm"
                                onPress={handleResetPassword}
                                isLoading={resetLoading}
                              >
                                Сбросить пароль
                              </Button>
                            )}
                          </div>
                        </div>

                        {isExternalProvider && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-sm text-blue-700 flex items-center gap-1">
                              <RiGoogleFill />
                              Вы вошли через аккаунт Google. Управление паролем недоступно.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end mt-8">
                        <Button
                          className="bg-primary-color text-white"
                          onPress={handleUpdateProfile}
                          isLoading={profileLoading}
                        >
                          Сохранить изменения
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </Card>
              <Card className="p-6 bg-white shadow-sm rounded-2xl mt-4 overflow-hidden">
                <div className="relative">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-color-text">
                    <MdOutlineDiscount className="text-primary-color" size={24} />
                    Специальные предложения
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-light-white-color p-4 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary-color rounded-full p-2 mt-1">
                          <MdOutlineFoodBank size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-color-text">Начните покупки прямо сейчас</h3>
                          <p className="text-sm text-gray-600 mt-1">Выберите из тысяч товаров со скидкой.</p>
                          <Link href="/">
                            <Button className="bg-primary-color text-white mt-3" size="sm">
                              Выбрать товары
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="bg-light-white-color p-4 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="bg-secondary-color rounded-full p-2 mt-1">
                          <MdOutlineLocalShipping size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-color-text">Самовывоз</h3>
                          <p className="text-sm text-gray-600 mt-1">Приходи и забирай в удобных пунктах.</p>
                          <Link href="/cart">
                            <Button className="bg-secondary-color text-white mt-3" size="sm">
                              Проверить корзину
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;