'use client';

import React, {useEffect, useState} from 'react'
import { Card, CardFooter, Button, Image } from '@nextui-org/react'
import {CardBody} from "@nextui-org/card";
import {Item, useItemsStore} from "@/store/useItemStore/useItemStore";
import useAuthStore from "@/store/useAuthStore";
import {useCartStore} from "@/store/useCartStore";
import {toast} from "sonner";

interface ItemCardProps {
	item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
	const { user } = useAuthStore();
	const { cartItems, addToCart, updateCartItem, fetchCartItems } = useCartStore();
	const [quantity, setQuantity] = useState(0);

	useEffect(() => {
		const cartItem = cartItems.find((cartItem) => cartItem.item.id === item.id);
		setQuantity(cartItem ? cartItem.quantity : 0);
	}, [cartItems, item.id]);

	const handleAddToCart = () => {
		if (user) {
			addToCart(user.id, item.id, 1);
			setQuantity(1);
		} else {
			toast.warning('Войдите, чтобы добавить товар в корзину.');
		}
	};

	const handleUpdateQuantity = (newQuantity) => {
		const cartItem = cartItems.find((cartItem) => cartItem.item.id === item.id);
		if (cartItem) {
			updateCartItem(cartItem.id, newQuantity);
		}
		setQuantity(newQuantity);
	};

	return (
			<Card
				className="max-w-xs p-3"
				shadow="none"
				key={item.id}
			>
				<CardBody>
					<Image
						src={item.image || '/placeholder-image.jpg'}
						alt={item.name}
						width="100%"
						height={200}
						objectFit="cover"
					/>
					<div className="flex flex-col items-center mt-4 text-center">
						<h3 className="font-semibold text-lg text-color-text leading-4 line-clamp-2">{item.name}</h3>
						<p className="text-sm text-gray-700 leading-4 line-clamp-2 mt-2">{item.description}</p>
						<p className="text-3xl font-bold text-color-text mt-2">
							{item.price} р.
						</p>
					</div>
				</CardBody>
				<CardFooter>
					{quantity === 0 ? (
						<Button fullWidth className="bg-light-secondary-color text-color-text font-semibold" onPress={handleAddToCart}>Добавить в корзину</Button>
					) : (
						<div className="mx-auto flex items-center text-2xl text-color-text gap-4">
							<Button
								className="bg-light-secondary-color text-3xl text-color-text"
								onPress={() => handleUpdateQuantity(quantity - 1)}
								disabled={quantity <= 1}
							>
								-
							</Button>
							<span>{quantity}</span>
							<Button className="bg-light-secondary-color text-3xl text-color-text" onPress={() => handleUpdateQuantity(quantity + 1)}>+</Button>
						</div>
					)}
				</CardFooter>
			</Card>
	);
}

export default ItemCard