'use client';
import React, { useEffect, useMemo } from 'react';
import { useCartStore } from '@/store/useCartStore';
import useAuthStore from '@/store/useAuthStore';
import {Button, RadioGroup, Radio, Divider, Image} from '@nextui-org/react';

const Cart = () => {
	const { user } = useAuthStore();
	const { cartItems, fetchCartItems, updateCartItem, removeFromCart } = useCartStore();

	useEffect(() => {
		if (user) {
			fetchCartItems(user.id);
		}
	}, [user]);

	const handleQuantityChange = (cartItemId, newQuantity) => {
		if (newQuantity > 0) {
			updateCartItem(cartItemId, newQuantity);
		} else {
			removeFromCart(cartItemId);
		}
	};

	const totalPrice = useMemo(() => {
		return cartItems.reduce((sum, { item, quantity }) => sum + item.price * quantity, 0);
	}, [cartItems]);

	if (!user) {
		return <p>Пожалуйста, войдите, чтобы просмотреть корзину.</p>;
	}

	if (cartItems.length === 0) {
		return <p>Ваша корзина пуста.</p>;
	}

	return (
		<div className="container mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
			<div className="md:col-span-2 bg-white p-8 rounded-2xl text-color-text">
				<h1 className="text-xl font-bold mb-6">Корзина</h1>
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
							<div className="flex items-center gap-2">
								<Button
									className="w-10 h-10 rounded-full border border-light-secondary-color"
									onPress={() => handleQuantityChange(id, quantity - 1)}
									disabled={quantity <= 1}
								>
									-
								</Button>
								<span className="text-lg font-semibold">{quantity}</span>
								<Button
									className="w-10 h-10 rounded-full border border-light-secondary-color"
									onPress={() => handleQuantityChange(id, quantity + 1)}
								>
									+
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="p-8 bg-white rounded-2xl text-color-text sticky h-fit">
				<h2 className="text-xl font-bold mb-4">Итоговая сумма</h2>
				<div className="flex flex-col py-5">
					<RadioGroup color="warning">
						<Radio value="Оплата онлайн" isDisabled>Оплата онлайн</Radio>
						<Radio value="Оплата при получении" disabled>Оплата наличкой при получении</Radio>
						<Radio value="Получение в магазине">Получение в пункте</Radio>
					</RadioGroup>
				</div>
				<Divider className="my-4" />
				<div className="flex flex-col text-lg text-gray-800">
					<div className="flex justify-between mx-3">
						<p className="">Доставка</p>
						<p className="">0 p.</p>
					</div>
					<div className="flex justify-between mx-3">
						<p className="">Купон</p>
						<p className="">0 p.</p>
					</div>
					<div className="flex justify-between mx-3">
						<p className="">Налоги </p>
						<p className="">0 p.</p>
					</div>
				</div>
				<Divider className="my-4" />
				<div className="flex justify-between mx-3 text-lg font-semibold mb-6">
					<p className="">Итого </p>
					<p className="">{totalPrice.toFixed(2)} р.</p>
				</div>
				<Button
					className="w-full bg-secondary-color text-white"
					radius="full"
					onPress={() => alert('Оформление заказа')}
				>
					Оформить заказ
				</Button>
			</div>
		</div>
	);
};

export default Cart;