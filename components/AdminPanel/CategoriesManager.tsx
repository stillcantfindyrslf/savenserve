'use client';

import React, { useEffect, useState } from 'react';
import { Button, Card, Accordion, AccordionItem, Divider, Spinner, Input } from '@nextui-org/react';
import useCategoriesStore from '@/store/useCategoriesStore';
import CategoryModal from './CategoryModal';
import SubcategoryModal from './SubcategoryModal';
import { toast } from 'sonner';
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { Category, Subcategory } from '@/store/useCategoriesStore/types';
import { getIconByName } from '@/utils/categoryIcons';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { FiPlus, FiSearch } from 'react-icons/fi';

const CategoriesManager = () => {
  const {
    categories,
    fetchCategories,
    openCategoryModal,
    openSubcategoryModal,
    setCurrentCategory,
    setCurrentSubcategory,
    deleteCategory,
    deleteSubcategory,
    isLoading,
  } = useCategoriesStore();
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (categories.length > 0 && !isInitialized) {
      setExpandedKeys(new Set([categories[0].id.toString()]));
      setIsInitialized(true);
    }
  }, [categories, isInitialized]);

  useEffect(() => {
    if (categories && categories.length > 0) {
      if (!searchQuery) {
        setFilteredCategories(categories);
      } else {
        const query = searchQuery.toLowerCase();
        const filtered = categories.filter(category =>
          category.name.toLowerCase().includes(query) ||
          category.description?.toLowerCase().includes(query) ||
          category.subcategories.some(sub => sub.name.toLowerCase().includes(query))
        );
        setFilteredCategories(filtered);
      }
    }
  }, [categories, searchQuery]);

  const handleEditCategory = (category: Category) => {
    setCurrentCategory(category);
    openCategoryModal();
  };

  const handleDeleteCategory = async (category: Category) => {
    if (window.confirm(`Вы уверены, что хотите удалить категорию "${category.name}"?`)) {
      try {
        await deleteCategory(category.id);
        toast.success('Категория успешно удалена');
      } catch (error: any) {
        toast.error(error.message || 'Не удалось удалить категорию');
      }
    }
  };

  const handleAddCategory = () => {
    setCurrentCategory(null);
    openCategoryModal();
  };

  const handleEditSubcategory = (subcategory: Subcategory) => {
    setCurrentSubcategory(subcategory);
    openSubcategoryModal();
  };

  const handleDeleteSubcategory = async (subcategory: Subcategory) => {
    if (window.confirm(`Вы уверены, что хотите удалить подкатегорию "${subcategory.name}"?`)) {
      try {
        await deleteSubcategory(subcategory.id);
        toast.success('Подкатегория успешно удалена');
      } catch (error: any) {
        toast.error(error.message || 'Не удалось удалить подкатегорию');
      }
    }
  };

  const handleAddSubcategory = (categoryId: number) => {
    setCurrentSubcategory(null);
    openSubcategoryModal(categoryId);
  };

  const isExpanded = (key: string) => expandedKeys.has(key);

  const toggleAccordion = (key: string) => {
    setExpandedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  if (isLoading && categories.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className='w-full'>
      <div className="flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 lg:px-5 mb-6">
          <h1 className="text-2xl font-bold text-color-text">Управление категориями</h1>

          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
            <Input
              variant="bordered"
              placeholder="Поиск категорий..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              classNames={{
                base: "min-w-80 sm:max-w-xs",
                inputWrapper: "border-gray-200 bg-white rounded-xl"
              }}
              startContent={<FiSearch className="text-primary-color" />}
            />

            <Button
              className="bg-primary-color text-white"
              onPress={handleAddCategory}
              startContent={<FiPlus />}
            >
              Добавить категорию
            </Button>
          </div>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <p className="text-gray-500">Категории не найдены</p>
          <Button
            className="bg-primary-color text-white mt-4"
            onPress={handleAddCategory}
            startContent={<AiOutlinePlus />}
          >
            Создать первую категорию
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {filteredCategories.map((category) => (
            <Accordion
              key={category.id}
                    selectedKeys={isExpanded(category.id.toString()) ? new Set([category.id.toString()]) : new Set([])}

              onSelectionChange={() => toggleAccordion(category.id.toString())}
              className="p-0"
              hideIndicator
              selectionMode="single"
            >
              <AccordionItem
                key={category.id.toString()}
                textValue={category.name}
                classNames={{
                  base: "p-0 shadow-sm border border-gray-100 rounded-lg overflow-hidden",
                  content: "p-0",
                  title: "p-0",
                  trigger: "p-0",
                }}
                title={
                  <Card className="shadow-none border-none p-5 w-full">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl text-primary-color">
                          {getIconByName(category.icon_name) || <span className="w-6 h-6 inline-block"></span>}
                        </span>
                        <h3 className="text-xl font-semibold">{category.name}</h3>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Button
                          isIconOnly
                          variant="light"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            handleEditCategory(category);
                          }}
                          className="text-primary-color"
                        >
                          <AiOutlineEdit size={20} />
                        </Button>
                        <Button
                          isIconOnly
                          variant="light"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            handleDeleteCategory(category);
                          }}
                          className="text-danger"
                        >
                          <AiOutlineDelete size={20} />
                        </Button>
                        <div className={`text-gray-400 transition-transform ${isExpanded(category.id.toString()) ? "rotate-180" : ""} ml-2`}>
                          <MdKeyboardArrowDown size={24} />
                        </div>
                      </div>
                    </div>
                  </Card>
                }
              >
                <Card className="shadow-none border-none p-5 pt-0 rounded-t-none">
                  {category.description && (
                    <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mb-4">URL: <code className="bg-gray-100 px-1 py-0.5 rounded">{category.url_name}</code></p>

                  <Divider className="my-4" />

                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-md font-medium">Подкатегории</h4>
                      <Button
                        size="sm"
                        variant="flat"
                        className="bg-light-secondary-color text-primary-color border border-primary-color/20"
                        onPress={() => handleAddSubcategory(category.id)}
                        startContent={<AiOutlinePlus size={16} />}
                      >
                        Добавить подкатегорию
                      </Button>
                    </div>

                    {category.subcategories && category.subcategories.length > 0 ? (
                      <div className="space-y-3">
                        {category.subcategories.map((subcategory) => (
                          <div key={subcategory.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-100">
                            <div>
                              <p className="font-medium">{subcategory.name}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                URL: <code className="bg-gray-100 px-1 py-0.5 rounded">{subcategory.url_name}</code>
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onPress={() => handleEditSubcategory(subcategory)}
                                className="text-primary-color"
                              >
                                <AiOutlineEdit size={18} />
                              </Button>
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onPress={() => handleDeleteSubcategory(subcategory)}
                                className="text-danger"
                              >
                                <AiOutlineDelete size={18} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-gray-50 rounded-md">
                        <p className="text-gray-500 text-sm">В этой категории пока нет подкатегорий</p>
                        <Button
                          size="sm"
                          variant="flat"
                          color="primary"
                          className="mt-2"
                          onPress={() => handleAddSubcategory(category.id)}
                          startContent={<AiOutlinePlus size={16} />}
                        >
                          Добавить подкатегорию
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      )}

      <CategoryModal />
      <SubcategoryModal />
    </div>
  );
};

export default CategoriesManager;