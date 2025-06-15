'use client';

import React, { useEffect, useState } from 'react';
import { Button, Card, Spinner, Tooltip, Image } from '@nextui-org/react';
import useBannerStore from '@/store/useBannerStore';
import BannerModal from './Modals/BannerModal';
import { toast } from 'sonner';
import { FiPlus, FiEye, FiEyeOff, FiTrash2 } from 'react-icons/fi';
import { BsArrowUpCircle } from 'react-icons/bs';
import { Banner } from '@/store/useBannerStore/types';
import { ErrorType, getErrorMessage } from '@/store/ApiError';
import { AiOutlineEdit } from 'react-icons/ai';

const BannerManager = () => {
  const {
    banners,
    fetchBanners,
    setCurrentBanner,
    openModal,
    deleteBanner,
    updateBanner,
    isLoading
  } = useBannerStore();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchBanners();
      } catch (error) {
        console.error("Ошибка загрузки баннеров:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadData();
  }, [fetchBanners]);

  const handleAddBanner = () => {
    setCurrentBanner(null);
    openModal();
  };

  const handleEditBanner = (banner: Banner) => {
    setCurrentBanner(banner);
    openModal();
  };

  const handleDeleteBanner = async (id: number) => {
    if (window.confirm(`Вы уверены, что хотите удалить этот баннер?`)) {
      try {
        await deleteBanner(id);
        toast.success('Баннер успешно удален');
      } catch (error: unknown) {
        toast.error(getErrorMessage(error as ErrorType) || 'Не удалось удалить баннер');
      }
    }
  };

  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      await updateBanner(id, { is_active: isActive });
      toast.success(`Баннер ${isActive ? 'активирован' : 'деактивирован'}`);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error as ErrorType) || 'Не удалось изменить статус баннера');
    }
  };

  const bannersToRender = Array.isArray(banners) ? banners : [];

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" color="success" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-6 px-1">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-color-text">Управление баннерами</h1>
          </div>
          <Button
            className="bg-light-secondary-color text-primary-color border border-primary-color/20"
            onPress={handleAddBanner}
            startContent={<FiPlus />}
            size="md"
            radius="sm"
          >
            Добавить баннер
          </Button>
        </div>
      </div>

      {bannersToRender.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 p-8">
          <div className="flex justify-center mb-4">
            <BsArrowUpCircle className="text-primary-color text-5xl opacity-50" />
          </div>
          <p className="text-gray-600 text-lg font-medium mb-4">Баннеры не найдены</p>
          <p className="text-gray-500 mb-6">Создайте первый баннер, чтобы он отображался на главной странице</p>
          <Button
            className="bg-primary-color text-white mt-2"
            onPress={handleAddBanner}
            startContent={<FiPlus />}
            size="lg"
            radius="sm"
          >
            Создать первый баннер
          </Button>
        </div>
      ) : (
        <Card className="border-none overflow-hidden rounded-xl shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="text-left py-4 px-8 font-medium text-sm text-gray-600 uppercase tracking-wider">Баннер</th>
                  <th className="text-left py-4 px-6 font-medium text-sm text-gray-600 uppercase tracking-wider">Кнопка</th>
                  <th className="text-left py-4 px-6 font-medium text-sm text-gray-600 uppercase tracking-wider">Статус</th>
                  <th className="text-left py-4 px-6 font-medium text-sm text-gray-600 uppercase tracking-wider">Обновлен</th>
                  <th className="text-right py-4 px-8 font-medium text-sm text-gray-600 uppercase tracking-wider">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bannersToRender.map((banner) => (
                  <tr key={banner.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-14 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                          {banner.image_url ? (
                            <Image
                              src={banner.image_url}
                              alt={banner.title}
                              width={80}
                              height={56}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">Нет фото</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{banner.title}</p>
                          <p className="text-sm text-gray-500 truncate max-w-[280px] mt-1">
                            {banner.description || 'Без описания'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {banner.button_text ? (
                        <div>
                          <span className="font-medium text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                            {banner.button_text}
                          </span>
                          {banner.button_link && (
                            <span className="text-xs text-gray-500 block truncate max-w-[180px] mt-2">
                              Ссылка: {banner.button_link}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Нет кнопки</span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${banner.is_active
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-gray-50 text-gray-600 border border-gray-200"
                        }`}>
                        {banner.is_active ? <FiEye size={14} className="mr-1.5" /> : <FiEyeOff size={14} className="mr-1.5" />}
                        {banner.is_active ? "Активен" : "Неактивен"}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-700">
                          {new Date(banner.updated_at).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5">
                          {new Date(banner.updated_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Tooltip content={banner.is_active ? "Деактивировать" : "Активировать"}>
                          <button
                            onClick={() => handleToggleActive(banner.id, !banner.is_active)}
                            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            {banner.is_active ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                          </button>
                        </Tooltip>

                        <Tooltip content="Редактировать">
                          <Button
                            isIconOnly
                            variant="light"
                            onPress={() => handleEditBanner(banner)}
                            className="text-primary-color"
                          >
                            <AiOutlineEdit size={20} />
                          </Button>
                        </Tooltip>

                        <Tooltip content="Удалить" color="danger">
                          <button
                            onClick={() => handleDeleteBanner(banner.id)}
                            className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}

                {isLoading && (
                  <tr>
                    <td colSpan={5}>
                      <div className="flex justify-center py-8">
                        <Spinner color="success" />
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-white">
            <p className="text-sm text-gray-500">
              Всего баннеров: <span className="font-medium">{bannersToRender.length}</span>
            </p>
          </div>
        </Card>
      )}

      <BannerModal />
    </>
  );
};

export default BannerManager;