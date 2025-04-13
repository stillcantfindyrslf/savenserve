import React from 'react';
import { Card, CardBody, CardFooter, Image, useDisclosure } from '@nextui-org/react';
import { Item } from '@/store/useItemStore/types';
import useAuthStore from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';
import ItemDetailModal from "@/components/ModalDetailItem";

interface ItemCardProps {
	item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
	const { user } = useAuthStore();
	const { cartItems, addToCart, updateCartItem } = useCartStore();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const cartItem = cartItems.find((cartItem) => cartItem.item.id === item.id);
	const quantity = cartItem ? cartItem.quantity : 0;

	const handleAddToCart = () => {
		if (user) {
			addToCart(user.id, item.id, 1);
		} else {
			toast.warning('Войдите, чтобы добавить товар в корзину.');
		}
	};

	const handleUpdateQuantity = (e: React.MouseEvent, newQuantity: number) => {
		e.stopPropagation();
		if (cartItem) {
			updateCartItem(cartItem.id, newQuantity);
		} else if (newQuantity > 0 && user) {
			addToCart(user.id, item.id, newQuantity);
		}
	};

	return (
		<>
			<Card
				isPressable
				disableRipple
				className="max-w-xs p-3 hover:shadow-lg transition-shadow duration-300 ease-in-out"
				shadow="none"
				key={item.id}
				onClick={onOpen}
			>
				<CardBody>
					<Image
						src={item.images && item.images.length > 0 ? item.images[0] : '/placeholder-image.jpg'}
						alt={item.name}
						width="100%"
						height={200}
						objectFit="cover"
					/>
					<div className="flex flex-col items-center mt-4 text-center">
						<h3 className="font-semibold text-lg text-color-text leading-4 line-clamp-2">{item.name}</h3>
						<p className="text-sm text-gray-700 leading-4 line-clamp-2 mt-2">{item.description}</p>
						<p className="text-3xl font-bold text-color-text mt-2">{item.price} р.</p>
					</div>
				</CardBody>
				<CardFooter>
					{quantity === 0 ? (
						<button
							className="w-full py-3 bg-light-secondary-color text-color-text font-semibold rounded-xl hover:bg-secondary-color transition-all"
							onClick={(e) => {
								e.stopPropagation();
								handleAddToCart();
							}}
						>
							Добавить в корзину
						</button>
					) : (
						<div className="mx-auto flex items-center text-3xl text-color-text gap-5">
							<button
								className="w-12 h-12 flex items-center justify-center bg-light-secondary-color text-3xl text-color-text rounded-full hover:bg-secondary-color transition-all"
								onClick={(e) => handleUpdateQuantity(e, quantity - 1)}
							>
								&#8722;
							</button>
							<span>{quantity}</span>
							<button
								className="w-12 h-12 flex items-center justify-center bg-light-secondary-color text-3xl text-color-text rounded-full hover:bg-secondary-color transition-all"
								onClick={(e) => handleUpdateQuantity(e, quantity + 1)}
							>
								+
							</button>
						</div>
					)}
				</CardFooter>
			</Card>

			<ItemDetailModal isOpen={isOpen} onOpenChange={onClose} item={item} user={user} />
		</>
	);
};

export default ItemCard;
