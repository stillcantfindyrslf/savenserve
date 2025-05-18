'use client';

import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from '@nextui-org/react';
import { IoCloseOutline } from 'react-icons/io5';
import useCategoriesStore from '@/store/useCategoriesStore';
import { toast } from 'sonner';
import { Subcategory } from '@/store/useCategoriesStore/types';

const SubcategoryModal = () => {
  const {
    isSubcategoryModalOpen,
    closeSubcategoryModal,
    currentSubcategory,
    categories,
    createSubcategory,
    updateSubcategory,
    fetchCategories
  } = useCategoriesStore();

  const [name, setName] = useState('');
  const [url_name, setUrlName] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentSubcategory) {
      setName(currentSubcategory.name || '');
      setUrlName(currentSubcategory.url_name || '');
      setCategoryId(currentSubcategory.category_id);
    } else {
      setName('');
      setUrlName('');
      setCategoryId(null);
    }
  }, [currentSubcategory, isSubcategoryModalOpen]);

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
      toast.error('Название подкатегории обязательно');
      return false;
    }

    if (!url_name.trim()) {
      toast.error('URL-имя подкатегории обязательно');
      return false;
    }

    if (!categoryId) {
      toast.error('Выберите родительскую категорию');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const subcategoryData: Partial<Subcategory> = {
        name: name.trim(),
        url_name: url_name.trim(),
        category_id: categoryId
      };

      if (currentSubcategory?.id) {
        await updateSubcategory(currentSubcategory.id, subcategoryData);
      } else {
        await createSubcategory(subcategoryData);
      }

      await fetchCategories();
      closeSubcategoryModal();
    } catch (error: any) {
      toast.error(error.message || 'Произошла ошибка при сохранении подкатегории');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      size="md"
      radius="lg"
      isOpen={isSubcategoryModalOpen}
      onClose={closeSubcategoryModal}
      hideCloseButton={true}
    >
      <ModalContent>
        <ModalHeader className="flex justify-between items-center">
          <span className="text-xl font-bold text-color-text">
            {currentSubcategory?.id ? 'Редактирование подкатегории' : 'Новая подкатегория'}
          </span>
          <Button
            isIconOnly
            variant="light"
            onPress={closeSubcategoryModal}
            className="ml-auto text-primary-color hover:bg-secondary-color/30"
          >
            <IoCloseOutline className="h-6 w-6" />
          </Button>
        </ModalHeader>

        <ModalBody>
          <Input
            label="Название подкатегории"
            placeholder="Введите название подкатегории"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            isInvalid={!name}
            errorMessage={!name ? "Название обязательно" : ""}
          />

          <Input
            label="URL-имя"
            placeholder="url-имя-подкатегории"
            value={url_name}
            onChange={(e) => handleUrlNameChange(e.target.value)}
            required
            isInvalid={!url_name}
            errorMessage={!url_name ? "URL-имя обязательно" : ""}
            description="Используется в адресе страницы. Только латинские буквы, цифры и дефисы."
          />

          <Select
            label="Родительская категория"
            placeholder="Выберите категорию"
            selectedKeys={categoryId ? [categoryId.toString()] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0];
              setCategoryId(selectedKey ? parseInt(selectedKey.toString(), 10) : null);
            }}
            required
            isInvalid={!categoryId}
            errorMessage={!categoryId ? "Категория обязательна" : ""}
          >
            {categories.map((category) => (
              <SelectItem key={category.id.toString()} textValue={category.name}>
                <div className="text-color-text">{category.name}</div>
              </SelectItem>
            ))}
          </Select>
        </ModalBody>

        <ModalFooter className="justify-between">
          <Button
            color="default"
            variant="light"
            onPress={closeSubcategoryModal}
            className="text-primary-color hover:bg-secondary-color/30"
          >
            Отмена
          </Button>

          <Button
            className="bg-primary-color text-white hover:bg-primary-color/90"
            onPress={handleSubmit}
            isLoading={isLoading}
          >
            {currentSubcategory?.id ? 'Сохранить' : 'Создать'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SubcategoryModal;