'use client';

import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem, Avatar } from '@nextui-org/react';
import { IoCloseOutline } from 'react-icons/io5';
import { FiUser } from 'react-icons/fi';
import { MdOutlineSecurity } from 'react-icons/md';
import useUserStore from '@/store/useUserStore';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { UserProfile } from '@/store/useAuthStore/types';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user }) => {
  const { updateUserRole, isLoading } = useUserStore();
  const [role, setRole] = useState('USER');

  useEffect(() => {
    if (isOpen && user) {
      setRole(user.role || 'USER');
    } else {
      resetForm();
    }
  }, [isOpen, user]);

  const resetForm = () => {
    setRole('USER');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "d MMMM yyyy 'в' HH:mm", { locale: ru });
  };

  const handleSubmit = async () => {
    if (!user) return;
    await updateUserRole(user.id, role);
    handleClose();
  };

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      hideCloseButton
      size="lg"
      radius="lg"
      classNames={{
        base: "max-h-[95vh]",
        body: "p-0",
        header: "border-b-0 pt-4 pb-0 px-6",
        footer: "px-6 py-3"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FiUser className="text-primary-color text-xl" />
            <span className="text-xl font-semibold text-color-text">
              Управление ролью
            </span>
          </div>
          <Button
            isIconOnly
            variant="light"
            onPress={handleClose}
            className="text-gray-600"
            size="sm"
          >
            <IoCloseOutline size={24} />
          </Button>
        </ModalHeader>

        <ModalBody>
          <div className="bg-gradient-to-r from-primary-color/10 to-blue-50 px-6 py-5 flex flex-col sm:flex-row items-center gap-4">
            <Avatar
              showFallback
              name={user.email.charAt(0).toUpperCase()}
              size="lg"
              className="w-16 h-16 text-large text-white"
              color="success"
            />
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-medium text-gray-800">
                {user.email}
              </h3>
              <p className="text-gray-600 mt-1">
                Зарегистрирован: {formatDate(user.created_at)}
              </p>
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="flex items-center gap-2 mb-3">
              <MdOutlineSecurity className="text-primary-color text-lg" />
              <h3 className="font-medium text-color-text">Роль пользователя</h3>
            </div>

            <Select
              label="Выберите уровень доступа"
              selectedKeys={[role]}
              onChange={(e) => setRole(e.target.value)}
              className="w-full"
              radius='lg'
            >
              <SelectItem
                key="ADMIN"
                value="ADMIN"
                textValue="Администратор"
                className="text-green-600"
              >
                <div className="flex items-center gap-2">
                  <span className="text-primary-color font-medium">Администратор</span>
                </div>
              </SelectItem>
              <SelectItem
                key="USER"
                value="USER"
                textValue="Пользователь"
                className="text-primary-color"
              >
                <div className="flex items-center gap-2">
                  <span className="text-primary-color font-medium">Пользователь</span>
                </div>
              </SelectItem>
            </Select>

            <div className="mt-3 p-3 bg-primary-color/5 rounded-md text-sm text-primary-color">
              {role === 'ADMIN'
                ? 'Администратор получит доступ к панели управления и всем функциям редактирования системы'
                : 'Пользователь имеет доступ только к основным функциям сайта без возможности администрирования'
              }
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="justify-between border-t border-gray-100">
          <Button
            variant="light"
            onPress={handleClose}
            className="font-medium text-gray-600"
            size="md"
          >
            Отмена
          </Button>

          <Button
            className="bg-secondary-color text-color-text font-medium text-base hover:bg-secondary-color/90"
            onPress={handleSubmit}
            isLoading={isLoading}
            size="md"
          >
            Сохранить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditUserModal;