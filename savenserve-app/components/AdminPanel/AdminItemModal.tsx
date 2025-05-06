import React, { useEffect, useState } from 'react';
import { Button, Input, Textarea, Select, SelectItem, Checkbox } from '@nextui-org/react';
import { toast } from 'sonner';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '@nextui-org/react';
import { ModalContent } from '@nextui-org/modal';
import { IoCloseOutline } from 'react-icons/io5';
import { AiOutlinePlus } from 'react-icons/ai';
import useItemsStore from '@/store/useItemStore';
import useAdminStore from '@/store/useAdminStore';
import { fetchItemImages } from '@/api/items';

const AdminItemModal = () => {
	const {
		isModalOpen,
		closeModal,
		currentItem,
		setCurrentItem,
		categories,
		fetchCategories,
	} = useAdminStore();
	const { createItem, updateItem, uploadImages, deleteImage } = useItemsStore();

	const [images, setImages] = useState<string[]>([]);
	const [imageFiles, setImageFiles] = useState<File[]>([]);
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);
	const [autoDiscount, setAutoDiscount] = useState(true);
	const [customDiscounts, setCustomDiscounts] = useState<{ "5": number; "2": number; "1": number }>({
		"5": 0,
		"2": 0,
		"1": 0,
	});
	const [noDiscount, setNoDiscount] = useState(false);

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	useEffect(() => {
		if (currentItem?.id) {
			fetchItemImages(currentItem.id).then(setImages);
		}
	}, [currentItem?.id]);

	useEffect(() => {
		if (imageFiles.length > 0) {
			const previews = imageFiles.map((file) => URL.createObjectURL(file));
			setImagePreviews(previews);

			return () => previews.forEach((url) => URL.revokeObjectURL(url));
		}
	}, [imageFiles]);

	useEffect(() => {
		if (isModalOpen && !currentItem) {
			setImages([]);
			setImageFiles([]);
			setImagePreviews([]);
		}
	}, [isModalOpen, currentItem]);

	useEffect(() => {
		if (isModalOpen && currentItem) {
			setAutoDiscount(currentItem.auto_discount || false);
			setCustomDiscounts(currentItem.custom_discounts || { "5": 0, "2": 0, "1": 0 });
			setNoDiscount(!currentItem.auto_discount && !currentItem.custom_discounts);
		}
	}, [isModalOpen, currentItem]);

	const handleSubmit = async () => {
		try {
			if (imageFiles.length > 0) {
				const imageUrls = await uploadImages(imageFiles, currentItem?.id || 0);
				if (!imageUrls.length) {
					alert('Ошибка загрузки изображений');
					return;
				}
				fetchItemImages(currentItem?.id || 0).then(setImages);
				setImageFiles([]);
				setImagePreviews([]);
			}

			const newItem = {
				name: currentItem?.name || '',
				description: currentItem?.description || '',
				price: currentItem?.price || 0,
				category_id: currentItem?.category_id || null,
				subcategory_id: currentItem?.subcategory_id || null,
				address: currentItem?.address || '',
				best_before: currentItem?.best_before || '',
				brand: currentItem?.brand || '',
				country_of_origin: currentItem?.country_of_origin || '',
				information: currentItem?.information || '',
				normal_price: currentItem?.normal_price || null,
				price_per_kg: currentItem?.price_per_kg || null,
				weight: currentItem?.weight || '',
				quantity: currentItem?.quantity || 0,
				auto_discount: !noDiscount && autoDiscount,
				custom_discounts: !noDiscount && !autoDiscount ? customDiscounts : null,
			};

			if (!newItem.category_id) {
				alert('Выберите категорию.');
				return;
			}

			if (currentItem?.id) {
				await updateItem(currentItem.id, newItem);
			} else {
				await createItem(newItem);
			}

			closeModal();
			setCurrentItem(null);
			setImageFiles([]);
			setImagePreviews([]);
		} catch (error) {
			console.error('Ошибка при сохранении товара:', error);
			alert('Произошла ошибка при сохранении товара.');
		}
	};

	const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			const selectedFiles = Array.from(files);
			if (images.length + selectedFiles.length > 5) {
				toast.warning('Можно загрузить не более 5 фотографий.');
				return;
			}
			setImageFiles([...imageFiles, ...selectedFiles]);
		}
	};

	return (
		<Modal size="5xl" isOpen={isModalOpen} onClose={closeModal} closeButton={<div><IoCloseOutline className="h-8 w-8" onClick={closeModal} /></div>}>
			<ModalContent>
				<ModalHeader>
					{currentItem?.id ? 'Редактировать товар' : 'Создать новый товар'}
				</ModalHeader>
				<ModalBody className="max-h-[64vh] overflow-y-auto">
					<div className="flex flex-col">
						{images.length > 0 && (
							<div className="grid grid-cols-2 gap-2">
								{images.slice(0, 5).map((image, index) => (
									<div key={index} className="relative">
										<img
											src={image}
											alt={`Изображение ${index + 1}`}
											className="w-full h-auto rounded-lg"
										/>
										<IoCloseOutline
											className="h-8 w-8 absolute top-2 right-2 bg-white rounded-full p-1 cursor-pointer"
											onClick={async () => {
												try {
													await deleteImage(image);
													setImages(images.filter((img) => img !== image));
												} catch (error) {
													toast.error('Ошибка удаления изображения');
												}
											}}
										/>
									</div>
								))}
							</div>
						)}

						{imagePreviews.length > 0 && (
							<div className="grid grid-cols-2 gap-2 mt-4">
								{imagePreviews.map((preview, index) => (
									<div key={index} className="relative">
										<img
											src={preview}
											alt={`Превью ${index + 1}`}
											className="w-full h-auto rounded-lg"
										/>
										<IoCloseOutline
											className="h-8 w-8 absolute top-2 right-2 bg-white rounded-full p-1 cursor-pointer"
											onClick={() => {
												const updatedFiles = [...imageFiles];
												updatedFiles.splice(index, 1);
												setImageFiles(updatedFiles);

												const updatedPreviews = [...imagePreviews];
												updatedPreviews.splice(index, 1);
												setImagePreviews(updatedPreviews);
											}}
										/>
									</div>
								))}
							</div>
						)}
						<div
							className="w-full h-32 bg-gray-200 flex items-center justify-center rounded-lg mt-4 cursor-pointer"
							onClick={() => document.getElementById('photo-input')?.click()}
						>
							<AiOutlinePlus className="text-gray-500 text-4xl" />
						</div>
						<input
							id="photo-input"
							type="file"
							multiple
							className="hidden"
							onChange={handleAddPhotos}
						/>
					</div>
					<Input
						label="Название"
						placeholder="Введите название товара"
						value={currentItem?.name || ''}
						onChange={(e) =>
							setCurrentItem({ ...currentItem, name: e.target.value })
						}
						required
					/>
					<Textarea
						label="Описание"
						placeholder="Введите описание товара"
						value={currentItem?.description || ''}
						onChange={(e) =>
							setCurrentItem({ ...currentItem, description: e.target.value })
						}
					/>
					<Input
						label="Цена"
						type="number"
						placeholder="Введите цену"
						value={currentItem?.price || ''}
						onChange={(e) =>
							setCurrentItem({
								...currentItem,
								price: parseFloat(e.target.value) || 0,
							})
						}
						required
					/>
					<Input
						label="Адрес"
						placeholder="Введите адрес"
						value={currentItem?.address || ''}
						onChange={(e) =>
							setCurrentItem({ ...currentItem, address: e.target.value })
						}
					/>
					<Input
						label="Срок годности"
						type="date"
						value={currentItem?.best_before || ''}
						onChange={(e) =>
							setCurrentItem({ ...currentItem, best_before: e.target.value })
						}
					/>
					<Input
						label="Бренд"
						placeholder="Введите бренд"
						value={currentItem?.brand || ''}
						onChange={(e) =>
							setCurrentItem({ ...currentItem, brand: e.target.value })
						}
					/>
					<Input
						label="Страна производства"
						placeholder="Введите страну"
						value={currentItem?.country_of_origin || ''}
						onChange={(e) =>
							setCurrentItem({
								...currentItem,
								country_of_origin: e.target.value,
							})
						}
					/>
					<Textarea
						label="Информация"
						placeholder="Введите информацию"
						value={currentItem?.information || ''}
						onChange={(e) =>
							setCurrentItem({ ...currentItem, information: e.target.value })
						}
					/>
					<Input
						label="Обычная цена"
						type="number"
						placeholder="Введите обычную цену"
						value={currentItem?.normal_price || ''}
						onChange={(e) =>
							setCurrentItem({
								...currentItem,
								normal_price: parseFloat(e.target.value) || null,
							})
						}
					/>
					<Input
						label="Цена за кг"
						type="number"
						placeholder="Введите цену за кг"
						value={currentItem?.price_per_kg || ''}
						onChange={(e) =>
							setCurrentItem({
								...currentItem,
								price_per_kg: parseFloat(e.target.value) || null,
							})
						}
					/>
					<Input
						label="Вес"
						placeholder="Введите вес"
						value={currentItem?.weight || ''}
						onChange={(e) =>
							setCurrentItem({ ...currentItem, weight: e.target.value })
						}
					/>
					<Input
						label="Количество"
						type="number"
						placeholder="Введите количество"
						value={currentItem?.quantity || ''}
						onChange={(e) =>
							setCurrentItem({
								...currentItem,
								quantity: parseInt(e.target.value, 10) || 0,
							})
						}
					/>
					<Select
						label="Категория"
						placeholder="Выберите категорию"
						selectedKeys={currentItem?.category_id ? [currentItem.category_id.toString()] : []}
						onSelectionChange={(keys) => {
							const selectedKey = Array.from(keys)[0];
							setCurrentItem({
								...currentItem,
								category_id: parseInt(selectedKey as string, 10),
								subcategory_id: null,
							});
						}}
					>
						{categories.map((category) => (
							<SelectItem key={category.id.toString()}>{category.name}</SelectItem>
						))}
					</Select>

					{currentItem?.category_id && (
						<Select
							label="Подкатегория"
							placeholder="Выберите подкатегорию"
							selectedKeys={currentItem?.subcategory_id ? [currentItem.subcategory_id.toString()] : []}
							onSelectionChange={(keys) => {
								const selectedKey = Array.from(keys)[0];
								setCurrentItem({
									...currentItem,
									subcategory_id: parseInt(selectedKey as string, 10),
								});
							}}
						>
							{categories.length > 0 &&
								categories
									.find((category) => category.id === currentItem.category_id)
									?.subcategories?.map((subcategory) => (
										<SelectItem key={subcategory.id.toString()}>{subcategory.name}</SelectItem>
									))}
						</Select>
					)}

					<div className="flex flex-col gap-2 mt-6 border-t pt-4 border-gray-200">
						<h3 className="text-lg font-medium text-gray-700 mb-2">Настройки скидок</h3>

						<Checkbox
							isSelected={noDiscount}
							onChange={(checked) => {
								setNoDiscount(() => Boolean(checked));
								if (checked) {
									setAutoDiscount(false);
									setCustomDiscounts({ "5": 0, "2": 0, "1": 0 });
								}
							}}
							color="default"
							className="mb-2"
						>
							<span className="text-gray-700">Не применять скидки</span>
						</Checkbox>

						<Checkbox
							isSelected={autoDiscount && !noDiscount}
							onChange={(checked) => {
								setAutoDiscount(() => Boolean(checked));
								if (checked) {
									setNoDiscount(false);
									setCustomDiscounts({ "5": 0, "2": 0, "1": 0 });
								}
							}}
							color="success"
							className="mb-2"
						>
							<span className="text-gray-700">Применить автоматические скидки</span>
						</Checkbox>

						<Checkbox
							isSelected={!autoDiscount && !noDiscount}
							onChange={(checked) => {
								setAutoDiscount(() => Boolean(!checked));
								if (checked) {
									setNoDiscount(() => false);
									setCustomDiscounts({ "5": 0, "2": 0, "1": 0 });
								}
							}}
							color="warning"
							className="mb-2"
						>
							<span className="text-gray-700">Составить кастомные скидки</span>
						</Checkbox>
					</div>

					{!autoDiscount && !noDiscount && (
						<div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
							<h4 className="text-md font-medium text-gray-700 mb-3">Настройка скидок по дням</h4>
							<div className=" sm:mt-8 grid grid-cols-3 gap-6">
								{[5, 2, 1].map((day) => (
									<div key={day} className="flex flex-col">
										<Input
											label={`Скидка за ${day} ${day === 1 ? 'день' : 'дня'}`}
											type="number"
											min="0"
											max="100"
											placeholder="0"
											labelPlacement="outside"
											value={customDiscounts[day.toString()] || ""}
											onChange={(e) => {
												const inputValue = e.target.value;

												let value;
												if (inputValue === "") {
													value = "";
												} else {
													const numValue = parseInt(inputValue, 10) || 0;
													value = Math.min(100, Math.max(0, numValue));
												}

												setCustomDiscounts(prev => ({
													...prev,
													[day]: value
												}));
											}}
											onBlur={(e) => {
												if (e.target.value === "") {
													setCustomDiscounts(prev => ({
														...prev,
														[day]: 0
													}));
												}
											}}
											onKeyDown={(e) => {
												if (e.key === '-' || e.key === 'e') {
													e.preventDefault();
												}
											}}
											endContent={
												<div className="pointer-events-none flex items-center">
													<span className="text-default-400 text-small">%</span>
												</div>
											}
											classNames={{
												input: "text-center",
												label: "text-gray-600"
											}}
										/>
										<span className="text-xs text-gray-500 mt-1 text-center">
											{day === 5 ? "За 5 дней до истечения срока" :
												day === 2 ? "За 2 дня до истечения срока" :
													"В последний день срока годности"}
										</span>
									</div>
								))}
							</div>
							<p className="text-xs text-gray-500 mt-4">
								Укажите процент скидки для каждого периода. Если значение равно 0%, скидка не применяется.
							</p>
						</div>
					)}
				</ModalBody>
				<ModalFooter>
					<Button className='text-white' color="success" onPress={handleSubmit}>
						{currentItem?.id ? 'Обновить' : 'Сохранить'}
					</Button>
					<Button color="danger" onPress={closeModal}>
						Отмена
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AdminItemModal;