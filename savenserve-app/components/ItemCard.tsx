import React from 'react';
import { Card, CardBody, CardFooter, Image, useDisclosure } from '@nextui-org/react';
import { Item } from '@/store/useItemStore/types';
import useAuthStore from '@/store/useAuthStore';
import useCartStore from '@/store/useCartStore';
import { toast } from 'sonner';
import ItemDetailModal from "@/components/ModalDetailItem";

interface ItemCardProps {
	item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
	const { user } = useAuthStore();
	const { cartItems, addToCart, updateCartItem, removeFromCart } = useCartStore();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const cartItem = cartItems.find((cartItem) => cartItem.item.id === item.id);
	const quantityInCart = cartItem ? cartItem.quantity : 0;

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

	return (
		<>
			<Card
				disableRipple
				className="rounded-xl p-0 duration-300 ease-in-out"
				shadow="none"
				key={item.id}
				onClick={onOpen}
			>
				<CardBody className="p-2">
					<Image
						src={item.images && item.images.length > 0 ? item.images[0] : '/placeholder-image.jpg'}
						alt={item.name}
						width="100%"
						height={200}
						style={{ objectFit: 'contain', display: 'block', margin: '0 auto' }}
					/>
					<div className="flex flex-col items-center mt-4 text-center">
						<h3 className="font-semibold text-md text-black leading-4 line-clamp-2">{item.name}</h3>
						<p className="text-sm text-gray-800 leading-4 line-clamp-2 mt-2">{item.brand} | {item.weight}</p>
						<p className="font-bold text-color-text mt-2">
							<span className="text-3xl">{Math.floor(item.price)}.</span>
							<span className="text-xl align-top">{(item.price % 1).toFixed(2).split('.')[1]}р.</span>
						</p>
					</div>
				</CardBody>
				<CardFooter className="p-2 pt-0">
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
						<div className="mx-auto py-1.5 px-2 bg-secondary-color rounded-full flex items-center text-3xl text-color-text gap-8">
							<button
								className="w-9 h-9 flex items-center justify-center text-4xl text-color-text rounded-full border-2 border-color-text active:scale-80 transition-transform duration-150"
								onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateQuantity(quantityInCart - 1);
                }}
							>
								&#8722;
							</button>
							<span className="font-semibold">{quantityInCart}</span>
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
				</CardFooter>
			</Card>

			<ItemDetailModal isOpen={isOpen} onOpenChange={onClose} item={item} user={user} />
		</>
	);
};

export default ItemCard;
