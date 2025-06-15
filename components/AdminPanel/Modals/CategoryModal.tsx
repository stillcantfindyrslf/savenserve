'use client';

import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Textarea } from '@nextui-org/react';
import { IoCloseOutline } from 'react-icons/io5';
import useCategoriesStore from '@/store/useCategoriesStore';
import { toast } from 'sonner';
import { Category } from '@/store/useCategoriesStore/types';
import { categoryIcons, getIconByName } from '@/utils/CategoryIcons';
import { ErrorType, getErrorMessage } from '@/store/ApiError';

const CategoryModal = () => {
  const {
    isCategoryModalOpen,
    closeCategoryModal,
    currentCategory,
    createCategory,
    updateCategory,
    fetchCategories
  } = useCategoriesStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url_name, setUrlName] = useState('');
  const [iconName, setIconName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentCategory) {
      setName(currentCategory.name || '');
      setDescription(currentCategory.description || '');
      setUrlName(currentCategory.url_name || '');
      setIconName(currentCategory.icon_name || '');
    } else {
      setName('');
      setDescription('');
      setUrlName('');
      setIconName('');
    }
  }, [currentCategory, isCategoryModalOpen]);

  const handleUrlNameChange = (value: string) => {
    const urlFriendlyValue = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    setUrlName(urlFriendlyValue);
  };

  const validateForm = () => {
    if (!name.trim()) {
      toast.error('Название категории обязательно');
      return false;
    }

    if (!url_name.trim()) {
      toast.error('URL-имя категории обязательно');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const categoryData: Partial<Category> = {
        name: name.trim(),
        description: description.trim() || null,
        url_name: url_name.trim(),
        icon_name: iconName || null
      };

      if (currentCategory?.id) {
        await updateCategory(currentCategory.id, categoryData);
      } else {
        await createCategory(categoryData);
      }

      await fetchCategories();
      closeCategoryModal();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error as ErrorType) || 'Произошла ошибка при сохранении категории');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      size="md"
      radius="lg"
      isOpen={isCategoryModalOpen}
      onClose={closeCategoryModal}
      hideCloseButton={true}
    >
      <ModalContent>
        <ModalHeader className="flex justify-between items-center">
          <span className="text-xl font-bold text-color-text">
            {currentCategory?.id ? 'Редактирование категории' : 'Новая категория'}
          </span>
          <Button
            isIconOnly
            variant="light"
            onPress={closeCategoryModal}
            className="ml-auto text-primary-color hover:bg-secondary-color/30"
          >
            <IoCloseOutline className="h-6 w-6" />
          </Button>
        </ModalHeader>

        <ModalBody>
          <Input
            label="Название категории"
            placeholder="Введите название категории"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            isInvalid={!name}
            errorMessage={!name ? "Название обязательно" : ""}
          />

          <Input
            label="URL-имя"
            placeholder="url-имя-категории"
            value={url_name}
            onChange={(e) => handleUrlNameChange(e.target.value)}
            required
            isInvalid={!url_name}
            errorMessage={!url_name ? "URL-имя обязательно" : ""}
            description="Используется в адресе страницы. Только латинские буквы, цифры и дефисы."
          />

          <Textarea
            label="Описание"
            placeholder="Введите описание категории"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Select
            placeholder="Выберите иконку"
            labelPlacement="outside"
            selectedKeys={iconName ? [iconName] : ['']}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              setIconName(selected);
            }}
            renderValue={(items) => {
              const selectedIcon = categoryIcons.find(icon =>
                items.some(item => item.key === icon.name)
              );

              return selectedIcon ? (
                <div className="flex gap-2 items-center text-primary-color">
                  {selectedIcon.name ? (
                    <div className="text-xl">
                      {getIconByName(selectedIcon.name)}
                    </div>
                  ) : (
                    <div className="w-5 h-5 flex items-center justify-center border border-dashed rounded-full">
                      <span>-</span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-small">{selectedIcon.label}</span>
                  </div>
                </div>
              ) : null;
            }}
          >
            {categoryIcons.map((icon) => (
              <SelectItem key={icon.name} textValue={icon.label}>
                <div className="flex gap-2 items-center text-primary-color">
                  {icon.name ? (
                    <div className="text-xl flex-shrink-0">{icon.component}</div>
                  ) : (
                    <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center border border-dashed rounded-full">
                      <span>-</span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-small">{icon.label}</span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </Select>
        </ModalBody>

        <ModalFooter className="justify-between">
          <Button
            color="default"
            variant="light"
            onPress={closeCategoryModal}
            className="text-primary-color hover:bg-secondary-color/30"
          >
            Отмена
          </Button>

          <Button
            className="bg-secondary-color text-color-text font-medium text-base hover:bg-secondary-color/90"
            onPress={handleSubmit}
            isLoading={isLoading}
          >
            {currentCategory?.id ? 'Сохранить' : 'Создать'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CategoryModal;