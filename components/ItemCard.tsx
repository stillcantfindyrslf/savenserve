import React, { useState } from 'react';
import { useDisclosure, Image, Spinner } from '@nextui-org/react';
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
	const [isLoading, setIsLoading] = useState(false);

	const cartItem = cartItems.find((cartItem) => cartItem.item.id === item.id);
	const quantityInCart = cartItem ? cartItem.quantity : 0;
	const imageUrl = item.item_images && item.item_images.length > 0
		? item.item_images[0].image_url
		: '/placeholder-image.jpg';

	const handleAddToCart = async () => {
		if (!user) {
			toast.warning('Войдите, чтобы добавить товар в корзину.');
			return;
		}

		if (item.quantity > 0) {
			setIsLoading(true);
			try {
				await addToCart(item.id, 1);
			} finally {
				setIsLoading(false);
			}
		} else {
			toast.warning('Товар временно отсутствует на складе.');
		}
	};

	const handleUpdateQuantity = async (newQuantity: number) => {
		if (!cartItem) return;

		setIsLoading(true);
		try {
			if (newQuantity === 0) {
				await removeFromCart(cartItem.id);
			} else {
				await updateCartItem(cartItem.id, newQuantity);
			}
		} finally {
			setIsLoading(false);
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

	const handleCardClick = () => {
		if (!isAdmin) {
			onOpen();
		}
	};

	return (
		<>
			<div
				className={`bg-white rounded-xl shadow-sm overflow-hidden transition duration-300 ease-in-out flex flex-col h-full ${!isAdmin ? 'cursor-pointer' : ''}`}
				onClick={handleCardClick}
			>
				<div className="p-2">
					<div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100 relative">
						<Image
							alt={item.name}
							src={imageUrl}
							className="h-full w-full object- object-center rounded-xl"
							loading="lazy"
						/>
					</div>

					<div className="flex flex-col flex-grow items-center mt-4 text-center flex-grow justify-between">
						<h3 className="font-semibold text-md text-black leading-4 line-clamp-2">{item.name}</h3>
						<p className="text-sm text-gray-800 leading-4 line-clamp-2 mt-2">{item.brand} | {item.weight}</p>
						<div className="font-bold text-color-text mt-2">
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
						</div>
					</div>
				</div>
				<div className="p-2 mt-auto">
					{isAdmin ? (
						<div className="flex w-full gap-2">
							<button
								className="bg-light-secondary-color text-gray-700 flex-1 h-10 rounded-md flex items-center justify-center gap-1 hover:bg-opacity-80"
								onClick={handleEdit}
							>
								<HiOutlinePencilAlt size={17} />
								<span>Изменить</span>
							</button>
							<button
								className="bg-red-100 text-red-600 flex-1 h-10 rounded-md flex items-center justify-center gap-1 hover:bg-red-200"
								onClick={handleDelete}
							>
								<FaRegTrashCan size={16} />
								<span>Удалить</span>
							</button>
						</div>
					) : (
						<>
							{quantityInCart === 0 ? (
								<button
									className="w-full py-3 bg-light-secondary-color text-color-text font-semibold rounded-md hover:bg-secondary-color transition-all disabled:opacity-70"
									onClick={(e) => {
										e.stopPropagation();
										handleAddToCart();
									}}
									disabled={isLoading}
								>
									{isLoading ? (
										<div className="flex items-center justify-center">
											<Spinner size="sm" color="current" className="mr-2" />
											<span>Добавление...</span>
										</div>
									) : (
										<>
											<span className="hidden sm:inline">Добавить в корзину</span>
											<span className="inline sm:hidden">В корзину</span>
										</>
									)}
								</button>
							) : (
								<div className="mx-auto py-1.5 px-2 bg-secondary-color rounded-full flex items-center justify-between text-3xl text-color-text w-full">
									<button
										className="w-9 h-9 flex items-center justify-center text-4xl text-color-text rounded-full border-2 border-color-text active:scale-80 transition-transform duration-150 disabled:opacity-70"
										onClick={(e) => {
											e.stopPropagation();
											handleUpdateQuantity(quantityInCart - 1);
										}}
										disabled={isLoading}
									>
										&#8722;
									</button>
									<div className="min-w-10 w-10 text-center flex items-center justify-center h-9">
										{isLoading ? (
											<Spinner size="md" color="current" />
										) : (
											<span className="font-semibold">{quantityInCart}</span>
										)}
									</div>
									<button
										className="w-9 h-9 flex items-center justify-center text-4xl text-color-text rounded-full border-2 border-color-text active:scale-80 transition-transform duration-150 disabled:opacity-70"
										onClick={(e) => {
											e.stopPropagation();
											handleUpdateQuantity(quantityInCart + 1);
										}}
										disabled={isLoading}
									>
										+
									</button>
								</div>
							)}
						</>
					)}
				</div>
			</div>

			<ItemDetailModal isOpen={isOpen} onOpenChange={onClose} item={item} user={user} />
		</>
	);
};

export default ItemCard;