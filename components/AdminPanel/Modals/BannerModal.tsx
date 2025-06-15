'use client';

import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Switch, Textarea, Image } from '@nextui-org/react';
import { IoCloseOutline } from 'react-icons/io5';
import { AiOutlineUpload } from 'react-icons/ai';
import useBannerStore from "@/store/useBannerStore";
import { toast } from 'sonner';
import { Banner } from "@/store/useBannerStore/types";
import { ErrorType, getErrorMessage } from '@/store/ApiError';

const BannerModal = () => {
  const {
    isModalOpen,
    closeModal,
    currentBanner,
    createBanner,
    updateBanner,
    uploadBannerImage
  } = useBannerStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonLink, setButtonLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (currentBanner) {
      setTitle(currentBanner.title || '');
      setDescription(currentBanner.description || '');
      setButtonText(currentBanner.button_text || '');
      setButtonLink(currentBanner.button_link || '');
      setImageUrl(currentBanner.image_url || '');
      setIsActive(currentBanner.is_active);
      setPreviewImage(currentBanner.image_url || null);
    } else {
      setTitle('');
      setDescription('');
      setButtonText('');
      setButtonLink('');
      setImageUrl('');
      setIsActive(true);
      setImageFile(null);
      setPreviewImage(null);
    }
  }, [currentBanner, isModalOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast.error('Заголовок баннера обязателен');
      return false;
    }

    if (!imageUrl && !imageFile) {
      toast.error('Изображение баннера обязательно');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        finalImageUrl = await uploadBannerImage(imageFile);
      }

      const bannerData: Partial<Banner> = {
        title: title.trim(),
        description: description.trim() || null,
        button_text: buttonText.trim() || null,
        button_link: buttonLink.trim() || null,
        image_url: finalImageUrl,
        is_active: isActive,
      };

      if (currentBanner?.id) {
        await updateBanner(currentBanner.id, bannerData);
        toast.success('Баннер успешно обновлен');
      } else {
        await createBanner(bannerData);
        toast.success('Баннер успешно создан');
      }

      closeModal();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error as ErrorType) || 'Произошла ошибка при сохранении баннера');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      size="4xl"
      radius="lg"
      isOpen={isModalOpen}
      onClose={closeModal}
      hideCloseButton={true}
    >
      <ModalContent>
        <ModalHeader className="flex justify-between items-center border-b border-gray-100 pb-3">
          <span className="text-xl font-bold text-gray-800">
            {currentBanner?.id ? 'Редактирование баннера' : 'Новый баннер'}
          </span>
          <Button
            isIconOnly
            variant="light"
            onPress={closeModal}
            className="ml-auto text-gray-600"
          >
            <IoCloseOutline className="h-6 w-6" />
          </Button>
        </ModalHeader>

        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <div className="mb-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Изображение баннера</span>
                  {previewImage && (
                    <Button
                      size="sm"
                      color="danger"
                      variant="light"
                      onClick={() => {
                        setImageFile(null);
                        setPreviewImage(null);
                        setImageUrl('');
                      }}
                      className="min-w-0 h-auto py-1"
                    >
                      Удалить
                    </Button>
                  )}
                </div>
              </div>

              {previewImage ? (
                <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                  <Image
                    src={previewImage}
                    alt="Предварительный просмотр"
                    className="w-full h-full object-cover"
                    radius="lg"
                  />
                </div>
              ) : (
                <div
                  className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => document.getElementById('banner-image-input')?.click()}
                >
                  <AiOutlineUpload className="text-gray-400 text-3xl mb-2" />
                  <p className="text-sm text-gray-600 font-medium">Нажмите, чтобы выбрать изображение</p>
                  <p className="text-xs text-gray-400 mt-1">Рекомендуемый размер: 1920x600px</p>
                </div>
              )}

              <input
                type="file"
                id="banner-image-input"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

              <p className="mt-3 text-xs text-gray-500">
                Изображение баннера будет отображаться на главной странице сайта.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div>
                <Input
                  label="Заголовок"
                  placeholder="Введите заголовок баннера"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  isInvalid={!title}
                  errorMessage={!title ? "Заголовок обязателен" : ""}
                />
              </div>

              <div>
                <Textarea
                  label="Описание"
                  placeholder="Введите описание баннера"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  minRows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Текст кнопки"
                  placeholder="Например: Подробнее"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                />

                <Input
                  label="Ссылка кнопки"
                  placeholder="Например: /products"
                  value={buttonLink}
                  onChange={(e) => setButtonLink(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-700 font-medium mb-1">Статус</span>
                  <div className="flex items-center gap-2 h-[40px]">
                    <Switch
                      isSelected={isActive}
                      onValueChange={setIsActive}
                      color="success"
                      size="md"
                    />
                    <span className={`text-sm ${isActive ? "text-green-600" : "text-gray-500"}`}>
                      {isActive ? "Активный" : "Неактивный"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                <p>• Неактивные баннеры не будут отображаться на сайте</p>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="justify-between border-t border-gray-100 pt-4">
          <Button
            color="default"
            variant="flat"
            onPress={closeModal}
            className="font-medium"
          >
            Отмена
          </Button>

          <Button
            className="bg-secondary-color text-color-text font-medium text-base hover:bg-secondary-color/90"
            onPress={handleSubmit}
            isLoading={isLoading}
          >
            {currentBanner?.id ? 'Сохранить изменения' : 'Создать баннер'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BannerModal;