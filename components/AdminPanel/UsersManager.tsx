'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, Input, Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Chip, Pagination } from '@nextui-org/react';
import { FiSearch, FiTrash2, FiFilter } from 'react-icons/fi';
import { MdPerson, MdOutlineSort } from 'react-icons/md';
import { IoMdRefresh } from 'react-icons/io';
import { BiUserCheck } from 'react-icons/bi';
import { toast } from 'sonner';
import useUserStore from '@/store/useUserStore';
import EditUserModal from './Modals/EditUserModal';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { UserProfile } from '@/store/useAuthStore/types';
import { AiOutlineEdit } from 'react-icons/ai';

const UserManager: React.FC = () => {
  const {
    users,
    fetchUsers,
    deleteUser,
  } = useUserStore();

  const [isInitialized, setIsInitialized] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const rowsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchUsers();
      } catch (error) {
        console.error("Ошибка загрузки пользователей:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadData();
  }, [fetchUsers]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchUsers();
      toast.success('Данные обновлены');
    } catch {
      toast.error('Ошибка при обновлении данных');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleEditUser = (user: UserProfile) => {
    setCurrentUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        await deleteUser(id);
        toast.success('Пользователь успешно удален');
      } catch {
        toast.error('Не удалось удалить пользователя');
      }
    }
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "d MMMM yyyy 'в' HH:mm", { locale: ru });
  };

  const filteredUsers = users
    ? users
      .filter(user =>
        (user.email?.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (!roleFilter || user.role === roleFilter)
      )
      .sort((a, b) => {
        if (sortField === 'created_at') {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        } else if (sortField === 'email') {
          return sortDirection === 'asc'
            ? a.email.localeCompare(b.email)
            : b.email.localeCompare(a.email);
        }
        return 0;
      })
    : [];

  const pages = Math.ceil(filteredUsers.length / rowsPerPage);
  const displayUsers = filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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
            <h1 className="text-2xl font-bold text-color-text">Управление пользователями</h1>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
          <div className="flex-1 w-full">
            <Input
              placeholder="Поиск по email или имени"
              startContent={<FiSearch className="text-gray-400" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              classNames={{
                inputWrapper: "bg-white border-1"
              }}
              size="md"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="flat"
              startContent={<FiFilter className="text-primary-color" size={16} />}
              className="bg-light-secondary-color text-primary-color border border-primary-color/20 flex-1 md:flex-none"
              size="md"
              onPress={() => {
                setRoleFilter(roleFilter === null ? 'ADMIN' :
                  roleFilter === 'ADMIN' ? 'USER' : null);
              }}
            >
              {roleFilter === 'ADMIN' ? 'Администраторы' :
                roleFilter === 'USER' ? 'Пользователи' : 'Все роли'}
            </Button>
            <Button
              startContent={<IoMdRefresh className={isRefreshing ? "animate-spin text-primary-color" : "text-primary-color"} size={16} />}
              className="bg-light-secondary-color text-primary-color border border-primary-color/20 flex-1 md:flex-none"
              size="md"
              onPress={handleRefresh}
              disabled={isRefreshing}
            >
              Обновить
            </Button>
          </div>
        </div>

        <Card className="border-none overflow-hidden rounded-xl shadow-sm mb-6">
          {users && users.length > 0 ? (
            <div className="overflow-x-auto">
              <Table
                aria-label="Таблица пользователей"
                removeWrapper
                classNames={{
                  th: "text-base text-gray-600 py-5 px-6",
                  td: "py-5 px-6 text-base",
                  table: "min-w-full"
                }}
              >
                <TableHeader>
                  <TableColumn>
                    <div className="flex items-center gap-1 text-base">
                      Пользователь
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onClick={() => toggleSort('email')}
                        className="min-w-0 w-8 h-8 p-0"
                      >
                        <MdOutlineSort className={`${sortField === 'email' ? 'text-primary-color' : 'text-gray-600'}`} size={20} />
                      </Button>
                    </div>
                  </TableColumn>
                  <TableColumn className="hidden sm:table-cell">Роль</TableColumn>
                  <TableColumn className="hidden md:table-cell">Статус</TableColumn>
                  <TableColumn>
                    <div className="flex items-center gap-1 text-base">
                      <span className="hidden sm:inline">Дата регистрации</span>
                      <span className="sm:hidden">Дата</span>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onClick={() => toggleSort('created_at')}
                        className="min-w-0 w-8 h-8 p-0"
                      >
                        <MdOutlineSort className={`${sortField === 'created_at' ? 'text-primary-color' : 'text-gray-600'}`} size={20} />
                      </Button>
                    </div>
                  </TableColumn>
                  <TableColumn align="center">Действия</TableColumn>
                </TableHeader>
                <TableBody>
                  {displayUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-light-secondary-color rounded-full flex items-center justify-center overflow-hidden">
                            <MdPerson className="text-primary-color" size={22} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Chip
                          color={user.role === 'ADMIN' ? 'success' : 'primary'}
                          variant="flat"
                          className="text-sm md:text-base"
                          size="sm"
                        >
                          {user.role === 'ADMIN' ? 'Администратор' : 'Пользователь'}
                        </Chip>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Chip
                          color={user.is_subscribed ? "success" : "default"}
                          variant="flat"
                          size="sm"
                          className="text-sm"
                        >
                          {user.is_subscribed ? "Подписан" : "Не подписан"}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm md:text-base text-gray-700">
                            {formatDate(user.created_at)}
                          </span>
                          <div className="sm:hidden mt-1 flex flex-wrap gap-1">
                            <Chip
                              color={user.role === 'ADMIN' ? 'success' : 'primary'}
                              variant="flat"
                              className="text-xs"
                              size="sm"
                            >
                              {user.role === 'ADMIN' ? 'Админ' : 'Пользователь'}
                            </Chip>
                            <Chip
                              color={user.is_subscribed ? "success" : "default"}
                              variant="flat"
                              size="sm"
                              className="text-xs"
                            >
                              {user.is_subscribed ? "Подписан" : "Не подписан"}
                            </Chip>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-3">
                          <Tooltip content="Редактировать роль">
                            <Button
                              isIconOnly
                              variant="light"
                              onPress={() => handleEditUser(user)}
                              className="text-primary-color"
                            >
                              <AiOutlineEdit size={20} />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Удалить" color="danger">
                            <Button
                              isIconOnly
                              variant="light"
                              className="text-danger hover:bg-red-100"
                              onPress={() => handleDeleteUser(user.id)}
                            >
                              <FiTrash2 size={20} />
                            </Button>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {pages > 1 && (
                <div className="flex justify-center py-4">
                  <Pagination
                    total={pages}
                    page={page}
                    onChange={setPage}
                    showControls
                    classNames={{
                      cursor: "bg-primary-color"
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="flex justify-center mb-6">
                <BiUserCheck className="text-primary-color text-6xl opacity-50" />
              </div>
              <p className="text-gray-600 text-xl font-medium mb-4">Пользователи не найдены</p>
              <p className="text-gray-500 mb-6">В системе пока нет зарегистрированных пользователей</p>
            </div>
          )}
        </Card>
      </div>

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={currentUser}
      />
    </>
  );
};

export default UserManager;