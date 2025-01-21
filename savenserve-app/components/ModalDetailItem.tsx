'use client';

import React from 'react';
import {Modal, Image, Button, ModalBody, ModalFooter, ModalHeader} from '@nextui-org/react';
import {Item} from '@/store/useItemStore/useItemStore';
import {ModalContent} from "@nextui-org/modal";
import {IoCloseOutline} from "react-icons/io5";

interface ItemModalProps {
	isOpen: boolean;
	onOpenChange: () => void;
	item: Item;
}

const ItemModal: React.FC<ItemModalProps> = ({isOpen, onOpenChange, item}) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onOpenChange}
			aria-labelledby="modal-title"
			className="max-w-3xl"
			closeButton={<div><IoCloseOutline className="h-8 w-8" onClick={() => close()} /></div>}
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
							<p className="text-2xl font-semibold text-gray-700 mb-4">{item.name}</p>
							<p className="text-md text-gray-700 mb-4">{item.description}</p>
							<p className="text-3xl font-bold text-color-text">{item.price} р.</p>
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

export default ItemModal;