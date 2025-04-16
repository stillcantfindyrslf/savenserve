'use client';

import React, { useEffect, useMemo, useState } from 'react';
import useCartStore from '@/store/useCartStore';
import useAuthStore from '@/store/useAuthStore';
import { Button, RadioGroup, Radio, Divider, Image, Spinner } from '@nextui-org/react';
import { toast } from 'sonner';
import FloatingNavbar from "@/components/FloatingNavbar";
import { FaRegTrashCan } from "react-icons/fa6";

const Cart = () => {
    const { user } = useAuthStore();
    const { cartItems, fetchCartItems, updateCartItem, removeFromCart } = useCartStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
          setLoading(true);
          fetchCartItems().finally(() => setLoading(false));
        }
      }, [user]);

      const handleQuantityChange = (cartItemId: number, newQuantity: number, availableQuantity: number) => {
        if (newQuantity > 0) {
          if (newQuantity <= availableQuantity) {
            updateCartItem(cartItemId, newQuantity);
          } else {
            toast.warning('Недостаточно товара на складе.');
          }
        } else {
          removeFromCart(cartItemId);
        }
      };

    const totalPrice = useMemo(() => {
        return cartItems.reduce((sum, { item, quantity }) => sum + item.price * quantity, 0);
    }, [cartItems]);

    return (
        <>
            <FloatingNavbar showSearch={false} showCart={false} showUserMenu={false} subtitle={false} subtitleCart={true} />
            <div className="container mt-32 mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 bg-white p-8 rounded-2xl text-color-text">
                    <h1 className="text-xl font-bold mb-6">Корзина</h1>
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <Spinner color="success" aria-label="Loading..." size="lg" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cartItems.map(({ id, item, quantity }) => (
                                <div
                                    key={id}
                                    className="flex items-center justify-between p-4 rounded-2xl bg-background-color"
                                >
                                    <Image
                                        src={item.image || '/placeholder-image.jpg'}
                                        alt={item.name}
                                        width="100%"
                                        height={100}
                                        objectFit="cover"
                                    />
                                    <div className="flex flex-col mr-auto px-8 text-lg">
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-gray-600">{item.price} р.</p>
                                    </div>
                                    <div className="ml-auto flex items-center text-2xl text-color-text gap-4">
                                        <Button
                                            className="bg-light-secondary-color border-2 border-primary-color text-3xl text-color-text"
                                            onPress={() => handleQuantityChange(id, quantity - 1, item.quantity)}
                                            disabled={quantity <= 1}
                                        >
                                            &#8722;
                                        </Button>
                                        <span>{quantity}</span>
                                        <Button
                                            className="bg-light-secondary-color border-2 border-primary-color text-3xl text-color-text"
                                            onPress={() => handleQuantityChange(id, quantity + 1, item.quantity)}
                                            disabled={quantity >= item.quantity}
                                        >
                                            +
                                        </Button>
                                        <button
                                            className="text-primary-color mr-2 hover:text-red-500"
                                            onClick={() => removeFromCart(id)}
                                            aria-label="Удалить товар"
                                        >
                                            <FaRegTrashCan size={28} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-8 bg-white rounded-2xl text-color-text sticky h-fit">
                    <h2 className="text-xl font-bold mb-4">Итоговая сумма</h2>
                    <div className="flex flex-col py-5">
                        <RadioGroup color="warning">
                            <Radio value="Оплата онлайн" isDisabled>Оплата онлайн</Radio>
                            <Radio value="Получение в магазине" isDisabled>Получение в пункте</Radio>
                            <Radio value="Оплата при получении">Оплата наличкой при получении</Radio>
                        </RadioGroup>
                    </div>
                    <Divider className="my-4" />
                    <div className="flex justify-between mx-3 text-lg font-semibold mb-6">
                        <p className="">Итого </p>
                        <p className="">{totalPrice.toFixed(2)} р.</p>
                    </div>
                    <Button
                        className="w-full bg-secondary-color text-white"
                        radius="full"
                    >
                        Оформить заказ
                    </Button>
                </div>
            </div>
        </>
    );
};

export default Cart;