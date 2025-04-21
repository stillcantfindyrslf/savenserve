import React from 'react';
import {Modal, Image, Button, ModalBody, ModalFooter, ModalHeader} from '@nextui-org/react';
import { Item } from '@/store/useItemStore/types';
import {ModalContent} from "@nextui-org/modal";
import {IoCloseOutline} from "react-icons/io5";
import useLikeStore from "@/store/useLikesStote/useLikesStore";
import {FaHeart} from "react-icons/fa6";

interface ItemModalProps {
	isOpen: boolean;
	onOpenChange: () => void;
	item: Item;
	user: { id: string } | null;
}

const ItemDetailModal: React.FC<ItemModalProps> = ({isOpen, onOpenChange, item, user}) => {
	const { toggleLike, isLiked } = useLikeStore();
	const liked = isLiked(item.id);

	const handleLikeToggle = () => {
		if (user) {
			toggleLike(user.id, item.id);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onOpenChange}
			aria-labelledby="modal-title"
			className="max-w-3xl"
			closeButton={<div><IoCloseOutline className="h-8 w-8" onClick={onOpenChange} /></div>}
		>
			<ModalContent>
				<ModalHeader>
					<h3 id="modal-title" className="font-semibold text-lg text-color-text">
						Подробнее о товаре
					</h3>
				</ModalHeader>
				<ModalBody>
					<div className="flex gap-6">
						<Image
							src={item.image || '/placeholder-image.jpg'}
							alt={item.name}
							width={600}
							height={300}
							objectFit="cover"
						/>
						<div className="flex flex-col">
							<div className="flex items-start gap-4">
								<p className="text-2xl py-3 font-semibold text-gray-700">{item.name}</p>
								<button
									className="flex h-13 w-13 p-3 rounded-full hover:bg-gray-100"
									onClick={handleLikeToggle}
								>
									<FaHeart
										size={30}
										className={`${liked ? 'text-red-500' : 'text-gray-300'}`}
									/>
								</button>
							</div>
							<p className="text-md text-gray-700 mb-4">{item.description}</p>
							<p className="text-3xl font-bold text-color-text">{item.price} р.</p>
							<p className="text-md text-gray-700">Адрес: {item.address || 'Не указано'}</p>
							<p className="text-md text-gray-700">Срок годности: {item.best_before || 'Не указано'}</p>
							<p className="text-md text-gray-700">Бренд: {item.brand || 'Не указано'}</p>
							<p className="text-md text-gray-700">Страна производства: {item.country_of_origin || 'Не указано'}</p>
							<p className="text-md text-gray-700">Информация: {item.information || 'Не указано'}</p>
							<p className="text-md text-gray-700">Обычная цена: {item.normal_price || 'Не указано'}</p>
							<p className="text-md text-gray-700">Цена за кг: {item.price_per_kg || 'Не указано'}</p>
							<p className="text-md text-gray-700">Вес: {item.weight || 'Не указано'}</p>
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<Button className="bg-primary-color text-light-white-color" onPress={onOpenChange}>
						Вернутся к товарам
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default ItemDetailModal;