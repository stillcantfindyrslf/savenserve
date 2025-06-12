'use client';

import React, { useEffect, useMemo, useState } from 'react';
import useCartStore from '@/store/useCartStore';
import useAuthStore from '@/store/useAuthStore';
import { Button, RadioGroup, Radio, Divider, Spinner, Image, Card, Tooltip, Checkbox } from '@nextui-org/react';
import { toast } from 'sonner';
import FloatingNavbar from "@/components/FloatingNavbar";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaInfoCircle, FaCheck, FaShoppingBasket } from "react-icons/fa";
import Link from 'next/link';

const Cart = () => {
    const { user } = useAuthStore();
    const { cartItems, fetchCartItems, updateCartItem, removeFromCart, removeItemWithoutRestoring } = useCartStore();
    const [loading, setLoading] = useState(true);
    const [loadingItems, setLoadingItems] = useState<Record<number, boolean>>({});
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [showPickupMode, setShowPickupMode] = useState(false);
    const [orderedItems, setOrderedItems] = useState<number[]>([]);

    useEffect(() => {
        if (user) {
            setLoading(true);
            fetchCartItems().finally(() => setLoading(false));
        }
    }, [user, fetchCartItems]);

    useEffect(() => {
        if (cartItems.length > 0 && orderedItems.length === 0) {
            setOrderedItems(cartItems.map(item => item.id));
        }
    }, [cartItems, orderedItems.length]);

    const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
        setLoadingItems(prev => ({ ...prev, [cartItemId]: true }));
        try {
            if (newQuantity === 0) {
                await removeFromCart(cartItemId);
            } else {
                await updateCartItem(cartItemId, newQuantity);
            }
        } finally {
            setLoadingItems(prev => ({ ...prev, [cartItemId]: false }));
        }
    };

    const togglePickupMode = () => {
        setShowPickupMode(!showPickupMode);
        setSelectedItems([]);
    };

    const handleItemSelect = (id: number) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
        );
    };

    const handlePickupComplete = async () => {
        if (selectedItems.length === 0) {
            toast.warning("Выберите полученные товары");
            return;
        }

        try {
            for (const itemId of selectedItems) {
                setLoadingItems(prev => ({ ...prev, [itemId]: true }));
                await removeItemWithoutRestoring(itemId);
            }

            toast.success(`${selectedItems.length} ${selectedItems.length === 1 ? 'товар отмечен' : 'товара отмечены'} как полученные`);
            setSelectedItems([]);
            setShowPickupMode(false);
            await fetchCartItems();
        } catch (error) {
            console.error("Ошибка при обработке полученных товаров:", error);
            toast.error("Не удалось обработать полученные товары");
        } finally {
            const updatedLoadingItems = { ...loadingItems };
            selectedItems.forEach(id => {
                updatedLoadingItems[id] = false;
            });
            setLoadingItems(updatedLoadingItems);
        }
    };

    const totalPrice = useMemo(() => {
        return cartItems.reduce((sum, { item, quantity }) => sum + item.price * quantity, 0);
    }, [cartItems]);

    const orderedCartItems = useMemo(() => {
        if (orderedItems.length === 0 || cartItems.length === 0) {
            return cartItems;
        }

        const cartItemsMap = new Map(cartItems.map(item => [item.id, item]));

        return orderedItems
            .filter(id => cartItemsMap.has(id))
            .map(id => cartItemsMap.get(id)!);
    }, [cartItems, orderedItems]);

    return (
        <>
            <FloatingNavbar searchQuery="" setSearchQuery={() => { }} subtitleCart showCart={false} />
            <div className="container px-4 sm:px-6 mx-auto mt-32 mb-16">
                <h1 className="text-2xl sm:text-3xl font-bold text-color-text mb-6">Корзина</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card className="bg-light-secondary-color mb-6 p-4 sm:p-5 border-none shadow-none">
                            <div className="flex items-start gap-3">
                                <FaInfoCircle className="text-primary-color mt-1.5 flex-shrink-0" size={18} />
                                <div>
                                    <p className="text-sm sm:text-base text-color-text">
                                        <strong>Важно:</strong> <br /> Добавляя товар в корзину, вы автоматически резервируете его.
                                        Если вы передумали, пожалуйста, удалите его из корзины.
                                    </p>
                                    <p className="text-sm text-color-text mt-2">
                                        После добавления вам необходимо забрать товар из магазина.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {showPickupMode && cartItems.length > 0 && (
                            <Card className="bg-green-50 mb-6 p-4 sm:p-5 border-none shadow-none">
                                <div className="flex items-start gap-3">
                                    <FaCheck className="text-green-600 mt-1.5 flex-shrink-0" size={18} />
                                    <div>
                                        <p className="text-sm sm:text-base text-color-text">
                                            <strong>Отметьте полученные товары</strong> и нажмите кнопку <strong>Подтвердить получение</strong> если получили товары.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {loading ? (
                            <div className="flex justify-center items-center py-16">
                                <Spinner color="success" size="lg" />
                            </div>
                        ) : cartItems.length === 0 ? (
                            <Card className="p-8 sm:p-12 text-center border-none shadow-none">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-light-secondary-color rounded-full flex items-center justify-center">
                                        <FaShoppingBasket size={32} className="text-primary-color" />
                                    </div>
                                    <h2 className="text-lg sm:text-xl font-semibold text-color-text">Ваша корзина пуста</h2>
                                    <p className="text-sm text-gray-600 mb-4">Добавьте товары для дальнейшей работы с корзиной</p>
                                    <Link href="/">
                                        <Button
                                            className="bg-secondary-color text-color-text font-medium"
                                            radius="full"
                                        >
                                            Перейти к каталогу
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {orderedCartItems.map(({ id, item, quantity }) => (
                                    <Card key={id} className="overflow-hidden border-none shadow-none bg-white p-4">
                                        <div className="flex flex-col sm:flex-row items-center gap-4">
                                            {showPickupMode && (
                                                <Checkbox
                                                    size="lg"
                                                    color="success"
                                                    className="sm:ml-1"
                                                    isSelected={selectedItems.includes(id)}
                                                    onValueChange={() => handleItemSelect(id)}
                                                    isDisabled={loadingItems[id]}
                                                />
                                            )}
                                            <div className="relative w-full sm:w-28 h-28 flex-shrink-0 bg-light-secondary-color rounded-xl overflow-hidden">
                                                <Image
                                                    src={item.item_images && item.item_images.length > 0 ? item.item_images[0].image_url : '/placeholder-image.jpg'}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col flex-grow w-full sm:w-auto">
                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                                                    <h3 className="font-semibold text-lg text-color-text">{item.name}</h3>
                                                    {!showPickupMode && (
                                                        <div className="mt-2 sm:mt-0">
                                                            <Tooltip content="Удалить товар">
                                                                <button
                                                                    className="text-primary-color hover:text-red-500 transition-colors"
                                                                    onClick={() => removeFromCart(id)}
                                                                    aria-label="Удалить товар"
                                                                >
                                                                    <FaRegTrashCan size={22} />
                                                                </button>
                                                            </Tooltip>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-primary-color font-medium mt-1">{item.price} р.</p>

                                                <div className="flex items-center mt-3 w-full sm:w-auto justify-between sm:justify-start">
                                                    {!showPickupMode ? (
                                                        <div className="py-1.5 px-2 bg-secondary-color rounded-full flex items-center justify-between w-full max-w-[200px]">
                                                            <button
                                                                className="w-9 h-9 flex items-center justify-center text-4xl text-color-text rounded-full border-2 border-color-text active:scale-80 transition-transform duration-150 disabled:opacity-70"
                                                                onClick={() => handleUpdateQuantity(id, quantity - 1)}
                                                                disabled={loadingItems[id]}
                                                            >
                                                                &#8722;
                                                            </button>
                                                            <div className="min-w-10 w-10 text-center text-color-text">
                                                                {loadingItems[id] ? (
                                                                    <Spinner size="sm" color="current" className="mt-2" />
                                                                ) : (
                                                                    <span className="font-semibold">{quantity}</span>
                                                                )}
                                                            </div>
                                                            <button
                                                                className="w-9 h-9 flex items-center justify-center text-4xl text-color-text rounded-full border-2 border-color-text active:scale-80 transition-transform duration-150 disabled:opacity-70"
                                                                onClick={() => handleUpdateQuantity(id, quantity + 1)}
                                                                disabled={loadingItems[id]}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm font-medium bg-green-50 text-green-700 px-3 py-1.5 rounded-full">
                                                            {loadingItems[id] ? (
                                                                <Spinner size="sm" color="success" />
                                                            ) : (
                                                                `${quantity} шт.`
                                                            )}
                                                        </span>
                                                    )}
                                                    <p className="font-medium text-color-text sm:hidden ml-auto">
                                                        {(item.price * quantity).toFixed(2)} р.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="lg:sticky lg:top-32 h-fit">
                        <Card className="p-6 border-none shadow-none bg-white">
                            <h2 className="text-xl font-bold mb-4 text-color-text">Итоговая сумма</h2>

                            {!showPickupMode && cartItems.length > 0 && (
                                <div className="py-4">
                                    <RadioGroup color="warning" defaultValue="Оплата при получении">
                                        <Radio value="Оплата при получении">
                                            <span className="text-color-text">Оплата при получении</span>
                                        </Radio>
                                    </RadioGroup>
                                </div>
                            )}

                            <Divider className="my-4" />

                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-sm text-gray-600">Всего:</p>
                                    <p className="text-xl font-semibold text-color-text">{totalPrice.toFixed(2)} р.</p>
                                </div>
                                {cartItems.length > 0 && (
                                    <div className="bg-light-secondary-color text-primary-color px-3 py-1.5 rounded-full text-sm">
                                        {cartItems.length} {cartItems.length === 1 ? 'товар' :
                                            cartItems.length > 1 && cartItems.length < 5 ? 'товара' : 'товаров'}
                                    </div>
                                )}
                            </div>

                            {!showPickupMode ? (
                                <Button
                                    className="w-full bg-secondary-color text-color-text font-medium"
                                    radius="full"
                                    size="lg"
                                    onClick={togglePickupMode}
                                    isDisabled={cartItems.length === 0}
                                >
                                    Отметить полученные товары
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        className="w-full bg-secondary-color text-color-text font-medium mb-3"
                                        radius="full"
                                        size="lg"
                                        onPress={handlePickupComplete}
                                        isDisabled={selectedItems.length === 0}
                                    >
                                        Подтвердить получение{selectedItems.length > 0 ? ` (${selectedItems.length})` : ''}
                                    </Button>
                                    <Button
                                        className="w-full bg-light-secondary-color text-primary-color"
                                        radius="full"
                                        onClick={togglePickupMode}
                                        isDisabled={Object.values(loadingItems).some(Boolean)}
                                    >
                                        Отмена
                                    </Button>
                                </>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;