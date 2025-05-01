'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input, Card, Spinner } from '@nextui-org/react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import FloatingNavbar from '@/components/FloatingNavbar';
import { LockFilledIcon, EyeFilledIcon, EyeSlashFilledIcon } from '@nextui-org/shared-icons';
import { IoKey, IoDocumentLock } from "react-icons/io5";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [sessionValid, setSessionValid] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          toast.error('Недействительная или истекшая ссылка для сброса пароля');
          setSessionValid(false);
        }
      } catch (err) {
        console.error('Error checking session:', err);
        setSessionValid(false);
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
  const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      toast.error('Пароль должен содержать не менее 6 символов');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        if (error.message.includes('different from the old password')) {
          toast.warning('Новый пароль должен отличаться от текущего пароля');
        } else {
          throw error;
        }
      } else {
        toast.success('Пароль успешно обновлен! Теперь вы можете войти с новым паролем');
        router.push('/');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Ошибка при обновлении пароля');
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <>
        <FloatingNavbar showSearch={false} searchQuery="" setSearchQuery={() => { }} />
        <div className="min-h-screen bg-background-color flex items-center justify-center">
          <div className="text-center">
            <Spinner size="lg" color="success" className="text-primary-color" />
            <p className="mt-4 text-color-text">Проверка сессии...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <FloatingNavbar showSearch={false} searchQuery="" setSearchQuery={() => { }} />
      <div className="mt-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="p-6 px-8 bg-white shadow-sm rounded-2xl h-full">
              <div className="mb-6 flex items-center gap-3 border-b pb-5 border-gray-100">
                <div className="bg-primary-color rounded-full p-2.5">
                  <IoDocumentLock className="text-white" size={24} />
                </div>
                <h1 className="text-xl font-bold text-color-text">Установка нового пароля</h1>
              </div>

              {!sessionValid ? (
                <div className="py-8 text-center space-y-4">
                  <div className="bg-red-50 p-4 rounded-xl inline-flex items-center justify-center mb-4">
                    <IoKey className="text-red-500 text-3xl" />
                  </div>
                  <h2 className="text-xl font-medium text-red-600">
                    Недействительная или истекшая ссылка
                  </h2>
                  <p className="text-gray-600">
                    Ссылка для сброса пароля недействительна или истекла. Пожалуйста, запросите новую ссылку.
                  </p>
                  <Button
                    className="bg-primary-color text-white mt-4"
                    onPress={() => router.push('/')}
                    radius="md"
                    size="lg"
                  >
                    Вернуться на главную
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <p className="text-gray-600 mb-6 w-[40rem]">
                    Придумайте новый пароль для вашего аккаунта. Пароль должен содержать минимум 6 символов.
                  </p>

                  <Input
                    type={isPasswordVisible ? "text" : "password"}
                    label="Новый пароль"
                    placeholder="Введите новый пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    variant="bordered"
                    radius="md"
                    className="max-w-md"
                    errorMessage={password.length > 0 && password.length < 6 ? "Пароль должен содержать не менее 6 символов" : ""}
                    isInvalid={password.length > 0 && password.length < 6}
                    endContent={
                      password.length > 0 ? (
                        <button
                          className="focus:outline-none"
                          type="button"
                          onClick={togglePasswordVisibility}
                        >
                          {isPasswordVisible ? (
                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                          ) : (
                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                          )}
                        </button>
                      ) : (
                        <LockFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )
                    }
                  />

                  <Input
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    label="Подтвердите пароль"
                    placeholder="Введите пароль повторно"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    variant="bordered"
                    radius="md"
                    className="max-w-md"
                    errorMessage={password.length > 0 && password.length < 6 ? "Пароль должен содержать не менее 6 символов" : ""}
                    isInvalid={password.length > 0 && password.length < 6}
                    endContent={
                      confirmPassword.length > 0 ? (
                        <button
                          className="focus:outline-none"
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                        >
                          {isConfirmPasswordVisible ? (
                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                          ) : (
                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                          )}
                        </button>
                      ) : (
                        <LockFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )
                    }
                  />

                  <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-4 border-t border-gray-100">
                    <Button
                      className="bg-primary-color text-white"
                      type="submit"
                      radius="md"
                      isLoading={loading}
                    >
                      {loading ? "Сохраняем..." : "Сохранить новый пароль"}
                    </Button>

                    <Button
                      className="bg-light-secondary-color text-color-text"
                      variant="flat"
                      radius="md"
                      onPress={() => router.push('/')}
                    >
                      Вернуться на главную
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className="p-6 bg-white shadow-sm rounded-2xl h-full">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-light-secondary-color flex items-center justify-center">
                  <LockFilledIcon className="text-primary-color text-3xl" />
                </div>

                <h3 className="font-medium text-color-text">Безопасность аккаунта</h3>

                <p className="text-sm text-gray-600">
                  Ваш пароль должен быть надежным и уникальным. Не используйте его для других сервисов.
                </p>

                <div className="w-full pt-4 space-y-3 border-t border-gray-100 mt-2">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary-color/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary-color text-xs">1</span>
                    </div>
                    <p className="text-sm text-gray-600 text-left">
                      Придумайте пароль длиной не менее 6 символов
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary-color/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary-color text-xs">2</span>
                    </div>
                    <p className="text-sm text-gray-600 text-left">
                      Комбинируйте буквы, цифры и специальные символы
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary-color/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary-color text-xs">3</span>
                    </div>
                    <p className="text-sm text-gray-600 text-left">
                      После смены пароля вам нужно будет заново войти в систему
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}