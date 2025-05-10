import React from 'react';
import { Card, CardBody, CardFooter, Image, useDisclosure, Button } from '@nextui-org/react';
import { Item, ItemWithImages } from '@/store/useItemStore/types';
import useAuthStore from '@/store/useAuthStore';
import useCartStore from '@/store/useCartStore';
import { toast } from 'sonner';
import ItemDetailModal from "@/components/ModalDetailItem";
import { FaRegTrashCan } from "react-icons/fa6";
import { HiOutlinePencilAlt } from "react-icons/hi";

interface ItemCardProps {
	item: ItemWithImages;
	isAdmin?: boolean;
	onEdit?: (item: Item) => void;
	onDelete?: (id: number) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
	item,
	isAdmin = false,
	onEdit,
	onDelete
}) => {
	const { user } = useAuthStore();
	const { cartItems, addToCart, updateCartItem, removeFromCart } = useCartStore();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const cartItem = cartItems.find((cartItem) => cartItem.item.id === item.id);
	const quantityInCart = cartItem ? cartItem.quantity : 0;
	const imageUrl = item.item_images && item.item_images.length > 0
		? item.item_images[0].image_url
		: '/placeholder-image.jpg';

	const handleAddToCart = () => {
		if (!user) {
			toast.warning('Войдите, чтобы добавить товар в корзину.');
			return;
		}

		if (quantityInCart < item.quantity) {
			addToCart(item.id, 1);
		} else {
			toast.warning('Недостаточно товара на складе.');
		}
	};

	const handleUpdateQuantity = (newQuantity: number) => {
		if (!cartItem) return;

		if (newQuantity > 0 && newQuantity <= item.quantity) {
			updateCartItem(cartItem.id, newQuantity);
		} else if (newQuantity === 0) {
			removeFromCart(cartItem.id);
		} else {
			toast.warning('Недостаточно товара на складе.');
		}
	};

	const handleEdit = () => {
		if (onEdit) {
			onEdit(item);
		}
	};

	const handleDelete = () => {
		if (onDelete) {
			onDelete(item.id);
		}
	};

	return (
		<>
			<Card
				disableRipple
				isPressable={!isAdmin}
				className="rounded-xl p-0 duration-300 ease-in-out"
				shadow="none"
				key={item.id}
				onClick={onOpen}
			>
				<CardBody className="p-2">
					<Image
						isBlurred
						width="100%"
						height="100%"
						alt={item.name}
						src={imageUrl}
						className="h-full object-cover object-center rounded-xl"
					/>
					<div className="flex flex-col items-center mt-4 text-center">
						<h3 className="font-semibold text-md text-black leading-4 line-clamp-2">{item.name}</h3>
						<p className="text-sm text-gray-800 leading-4 line-clamp-2 mt-2">{item.brand} | {item.weight}</p>
						<p className="font-bold text-color-text mt-2">
							{item.discount_price < item.price ? (
								<>
									<div className="flex items-center gap-2">
										<span className="line-through text-gray-500 text-lg">{item.price} р.</span>
										<span className="bg-orange-400 text-white text-xs font-semibold px-2 py-0.5 rounded-full animate-swing">
											Скидка {Math.round(100 - (item.discount_price / item.price) * 100)}%
										</span>
									</div>
									<div className="text-red-600">
										<span className="text-3xl">{Math.floor(item.discount_price)}.</span>
										<span className="text-xl align-top">{(item.discount_price % 1).toFixed(2).split('.')[1]}р.</span>
									</div>
								</>
							) : (
								<>
									<span className="text-3xl">{Math.floor(item.price)}.</span>
									<span className="text-xl align-top">{(item.price % 1).toFixed(2).split('.')[1]}р.</span>
								</>
							)}
						</p>
					</div>
				</CardBody>
				<CardFooter className="p-2 pt-0">
					{isAdmin ? (
						<div className="flex w-full gap-2">
							<Button
								className="bg-light-secondary-color text-gray-700 flex-1 items-center gap-1"
								onPress={handleEdit}
								startContent={<HiOutlinePencilAlt size={17} />}
							>
								Изменить
							</Button>
							<Button
								className="bg-red-100 text-red-600 flex-1 hover:bg-red-200 items-center gap-1"
								onPress={handleDelete}
								startContent={<FaRegTrashCan size={16} />}
							>
								Удалить
							</Button>
						</div>
					) : (
						<>
							{quantityInCart === 0 ? (
								<button
									className="w-full py-3 bg-light-secondary-color text-color-text font-semibold rounded-md hover:bg-secondary-color transition-all"
									onClick={(e) => {
										e.stopPropagation();
										handleAddToCart();
									}}
								>
									Добавить в корзину
								</button>
							) : (
								<div className="mx-auto py-1.5 px-2 bg-secondary-color rounded-full flex items-center text-3xl text-color-text gap-7">
									<button
										className="w-9 h-9 flex items-center justify-center text-4xl text-color-text rounded-full border-2 border-color-text active:scale-80 transition-transform duration-150"
										onClick={(e) => {
											e.stopPropagation();
											handleUpdateQuantity(quantityInCart - 1);
										}}
									>
										&#8722;
									</button>
									<div className="min-w-10 w-10 text-center">
										<span className="font-semibold">{quantityInCart}</span>
									</div>
									<button
										className="w-9 h-9 flex items-center justify-center text-4xl text-color-text rounded-full border-2 border-color-text active:scale-80 transition-transform duration-150"
										onClick={(e) => {
											e.stopPropagation();
											handleUpdateQuantity(quantityInCart + 1);
										}}
									>
										+
									</button>
								</div>
							)}
						</>
					)}
				</CardFooter>
			</Card>

			<ItemDetailModal isOpen={isOpen} onOpenChange={onClose} item={item} user={user} />
		</>
	);
};

export default ItemCard;
