import React, {useEffect} from 'react';
import {Button, Input, Textarea} from '@nextui-org/react';
import {Modal, ModalBody, ModalFooter, ModalHeader} from '@nextui-org/react';
import {ModalContent} from "@nextui-org/modal";
import {useItemsStore} from '@/store/useItemStore/useItemStore';
import {useAdminStore} from "@/store/useAdminStore";
import {createClient} from "@/utils/supabase/client";

const supabase = createClient();

const CreateItemModal = () => {
	const {isModalOpen, closeModal, currentItem, setCurrentItem, categories, fetchCategories} = useAdminStore();
	const {createItem, updateItem} = useItemsStore();

	useEffect(() => {
		fetchCategories(); // Загружаем категории при монтировании
	}, []);

	const handleSubmit = async () => {
		let imageUrl = currentItem.image || null;

		// Загружаем файл, если он есть
		if (currentItem.imageFile) {
			const filePath = `items/${Date.now()}_${currentItem.imageFile.name}`;
			const {data, error} = await supabase.storage.from('item_images').upload(filePath, currentItem.imageFile);

			if (error) {
				console.error("Ошибка загрузки изображения:", error);
				return;
			}

			imageUrl = data?.path ? supabase.storage.from('item_images').getPublicUrl(data.path).data?.publicUrl : null;
		}

		const newItem = {
			name: currentItem.name,
			description: currentItem.description,
			price: currentItem.price,
			category_id: currentItem.category_id,
			image: imageUrl,
		};

		if (!newItem.category_id) {
			alert("Выберите категорию.");
			return;
		}

		if (currentItem.id) {
			await updateItem(currentItem.id, newItem);
		} else {
			await createItem(newItem);
		}

		closeModal();
		setCurrentItem(null); // Сброс текущего товара
	};

	return (
		<Modal isOpen={isModalOpen} onClose={closeModal}>
			<ModalContent>
				<ModalHeader>{currentItem?.id ? "Редактировать товар" : "Создать новый товар"}</ModalHeader>
				<ModalBody>
					<Input
						label="Название"
						placeholder="Введите название товара"
						value={currentItem?.name || ''}
						onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
					/>
					<Textarea
						label="Описание"
						placeholder="Введите описание товара"
						value={currentItem?.description || ''}
						onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})}
					/>
					<Input
						label="Цена"
						type="number"
						placeholder="Введите цену"
						value={currentItem?.price || ''}
						onChange={(e) => setCurrentItem({...currentItem, price: Number(e.target.value)})}
					/>
					<select
						value={currentItem?.category_id || ''}
						onChange={(e) => setCurrentItem({...currentItem, category_id: Number(e.target.value)})}
						className="w-full rounded-xl p-2 px-2 bg-foreground-100 focus:outline-none"
					>
						<option value="" disabled>
							Выберите категорию
						</option>
						{categories.map((category) => (
							<option key={category.id} value={category.id}>
								{category.name}
							</option>
						))}
					</select>
					<Input
						label="Фото"
						type="file"
						onChange={(e) => setCurrentItem({...currentItem, imageFile: e.target.files?.[0] || null})}
					/>
					{currentItem?.image && (
						<div className="mt-4">
							<label className="block mb-2 font-medium">Текущее изображение</label>
							<img src={currentItem.image} alt="Текущее изображение" className="w-24 h-auto rounded"/>
						</div>
					)}
				</ModalBody>
				<ModalFooter>
					<Button onPress={handleSubmit}>{currentItem?.id ? "Обновить" : "Сохранить"}</Button>
					<Button color="error" onPress={closeModal}>
						Отмена
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default CreateItemModal;