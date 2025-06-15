import React, { useEffect, useState, useCallback } from 'react';
import { Button, Input, Textarea, Select, SelectItem, Checkbox, Image, Tabs, Tab, Card } from '@nextui-org/react';
import { toast } from 'sonner';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '@nextui-org/react';
import { ModalContent } from '@nextui-org/modal';
import { IoCloseOutline } from 'react-icons/io5';
import { AiOutlinePlus } from 'react-icons/ai';
import useItemsStore from '@/store/useItemStore';
import useAdminStore from '@/store/useAdminStore';
import { Item, ItemWithImages, ItemImage } from '@/store/useItemStore/types';

type DiscountDay = "5" | "2" | "1";
type CustomDiscounts = Record<DiscountDay, number>;

interface AdminItemModalProps {
	onClose: () => void;
}

const AdminItemModal: React.FC<AdminItemModalProps> = () => {
	const {
		isModalOpen,
		closeModal,
		currentItem,
		setCurrentItem,
		categories,
		fetchCategories,
	} = useAdminStore();
	const { fetchItems, createItem, updateItem, uploadImages, deleteImage, fetchItemImages } = useItemsStore();
	const [activeTab, setActiveTab] = useState("details");
	const [savedItemId, setSavedItemId] = useState<number | null>(null);
	const [itemImages, setItemImages] = useState<ItemImage[]>([]);
	const [imageFiles, setImageFiles] = useState<File[]>([]);
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);
	const [autoDiscount, setAutoDiscount] = useState(true);
	const [customDiscounts, setCustomDiscounts] = useState<CustomDiscounts>({
		"5": 0,
		"2": 0,
		"1": 0,
	});
	const [noDiscount, setNoDiscount] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isImageLoading, setIsImageLoading] = useState(false);

	const loadItemImages = useCallback(async (itemId: number) => {
		try {
			setIsImageLoading(true);
			const images = await fetchItemImages(itemId);
			setItemImages(images);
		} catch (error) {
			console.error('Ошибка при загрузке изображений:', error);
		} finally {
			setIsImageLoading(false);
		}
	}, [fetchItemImages]);

	useEffect(() => {
		if (isModalOpen && currentItem?.id) {
			setSavedItemId(currentItem.id);
			loadItemImages(currentItem.id);
		} else if (isModalOpen && !currentItem) {
			setSavedItemId(null);
			setActiveTab("details");
			setItemImages([]);
		}
	}, [isModalOpen, currentItem, loadItemImages]);

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	useEffect(() => {
		if (imageFiles.length > 0) {
			const previews = imageFiles.map((file) => URL.createObjectURL(file));
			setImagePreviews(previews);

			return () => previews.forEach((url) => URL.revokeObjectURL(url));
		}
	}, [imageFiles]);

	useEffect(() => {
		if (isModalOpen && !currentItem) {
			setImageFiles([]);
			setImagePreviews([]);
		}
	}, [isModalOpen, currentItem]);

	useEffect(() => {
		if (isModalOpen && currentItem) {
			setAutoDiscount(currentItem.auto_discount || false);
			const defaultDiscounts: CustomDiscounts = { "5": 0, "2": 0, "1": 0 };
			const itemDiscounts = currentItem.custom_discounts || defaultDiscounts;

			setCustomDiscounts({
				"5": Number(itemDiscounts["5"] || 0),
				"2": Number(itemDiscounts["2"] || 0),
				"1": Number(itemDiscounts["1"] || 0),
			});
			setNoDiscount(!currentItem.auto_discount && !currentItem.custom_discounts);
		}
	}, [isModalOpen, currentItem]);

	const initialItem: Item = {
		id: 0,
		name: '',
		description: '',
		price: 0,
		category_id: 0,
		subcategory_id: null,
		address: '',
		best_before: '',
		brand: '',
		country_of_origin: '',
		information: '',
		normal_price: null,
		price_per_kg: null,
		weight: '',
		quantity: 0,
		auto_discount: false,
		custom_discounts: undefined,
		discount_price: 0
	};

	const validateForm = () => {
		if (!currentItem?.name) {
			toast.error('Название товара обязательно');
			return false;
		}

		if (!currentItem?.price || currentItem.price <= 0) {
			toast.error('Цена должна быть больше нуля');
			return false;
		}

		if (!currentItem?.category_id) {
			toast.error('Выберите категорию');
			return false;
		}

		return true;
	};

	const handleSaveItem = async () => {
		if (!validateForm()) {
			return;
		}

		try {
			setIsLoading(true);

			const newItem = {
				...currentItem,
				name: currentItem?.name || '',
				description: currentItem?.description || '',
				price: currentItem?.price || 0,
				category_id: currentItem?.category_id || 0,
				subcategory_id: currentItem?.subcategory_id || 0,
				address: currentItem?.address || '',
				best_before: currentItem?.best_before || '',
				brand: currentItem?.brand || '',
				country_of_origin: currentItem?.country_of_origin || '',
				information: currentItem?.information || '',
				normal_price: currentItem?.normal_price || 0,
				price_per_kg: currentItem?.price_per_kg || 0,
				weight: currentItem?.weight || '',
				quantity: currentItem?.quantity || 0,
				auto_discount: !noDiscount && autoDiscount,
				custom_discounts: !noDiscount && !autoDiscount ? customDiscounts : undefined,
				discount_price: 0
			};

			let resultItemId: number;

			if (currentItem?.id) {
				await updateItem(currentItem.id, newItem);
				resultItemId = currentItem.id;
				toast.success('Товар успешно обновлен');
			} else {
				const createdItem = await createItem(newItem);
				if (!createdItem) {
					throw new Error('Не удалось создать товар');
				}
				resultItemId = createdItem.id;
				toast.success('Товар успешно создан');

				setCurrentItem({
					...newItem,
					id: resultItemId,
					item_images: []
				} as ItemWithImages);
			}
			await fetchItems();

			setSavedItemId(resultItemId);
			setActiveTab("images");
		} catch (error) {
			console.error('Ошибка при сохранении товара:', error);
			toast.error('Произошла ошибка при сохранении товара');
		} finally {
			setIsLoading(false);
		}
	};

	const handleUploadImages = async () => {
		if (!savedItemId || imageFiles.length === 0) {
			return;
		}

		try {
			setIsLoading(true);
			const uploadedImages = await uploadImages(imageFiles, savedItemId);

			if (uploadedImages.length > 0) {
				await loadItemImages(savedItemId);

				setImageFiles([]);
				setImagePreviews([]);

				toast.success(`Загружено ${uploadedImages.length} изображений`);

				await fetchItems();
			} else {
				toast.error('Не удалось загрузить изображения');
			}
		} catch (error) {
			console.error('Ошибка при загрузке изображений:', error);
			toast.error('Произошла ошибка при загрузке изображений');
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			const selectedFiles = Array.from(files);
			if (itemImages.length + imageFiles.length + selectedFiles.length > 5) {
				toast.warning('Можно загрузить не более 5 фотографий.');
				return;
			}
			setImageFiles([...imageFiles, ...selectedFiles]);
		}
	};

	const handleDeleteImage = async (imageData: ItemImage) => {
		try {
			setIsImageLoading(true);
			await deleteImage(imageData.image_url);

			setItemImages(prev => prev.filter(img => img.id !== imageData.id));

			toast.success('Изображение удалено');

			await fetchItems();
		} catch (error) {
			console.error('Ошибка при удалении изображения:', error);
			toast.error('Ошибка удаления изображения');
		} finally {
			setIsImageLoading(false);
		}
	};

	const handleCloseModal = () => {
		fetchItems();
		setImageFiles([]);
		setImagePreviews([]);
		setItemImages([]);
		closeModal();
	};

	const tabStyles = {
		tab: "data-[selected=true]:text-primary-color data-[selected=true]:font-semibold",
		tabList: "gap-6 w-full relative rounded-none px-8 bg-white",
		cursor: "w-full bg-primary-color",
		panel: "py-4"
	};

	return (
		<Modal
			size="5xl"
			radius="lg"
			isOpen={isModalOpen}
			onClose={handleCloseModal}
			hideCloseButton={true}
		>
			<ModalContent>
				<ModalHeader className="flex justify-between items-center">
					<span className="text-xl font-bold text-color-text">
						{currentItem?.id ? 'Редактирование товара' : 'Новый товар'}
					</span>
					<Button
						isIconOnly
						variant="light"
						onPress={handleCloseModal}
						className="ml-auto text-primary-color hover:bg-secondary-color/30"
					>
						<IoCloseOutline className="h-6 w-6" />
					</Button>
				</ModalHeader>

				<Tabs
					selectedKey={activeTab}
					onSelectionChange={(key) => setActiveTab(key as string)}
					classNames={tabStyles}
					aria-label="Вкладки товара"
					color="primary"
				>
					<Tab
						key="details"
						title={
							<div className="flex items-center gap-2 px-1 py-2">
								<span>Данные товара</span>
							</div>
						}
					>
						<ModalBody className="max-h-[64vh] overflow-y-auto px-6">
							<div className="space-y-4 py-2">
								<Input
									label="Название"
									placeholder="Введите название товара"
									value={currentItem?.name || ''}
									onChange={(e) =>
										setCurrentItem({
											...(currentItem || initialItem),
											name: e.target.value
										})
									}
									required
									isInvalid={!currentItem?.name}
									errorMessage={!currentItem?.name ? "Название обязательно" : ""}
								/>

								<Textarea
									label="Описание"
									placeholder="Введите описание товара"
									value={currentItem?.description || ''}
									onChange={(e) =>
										setCurrentItem({
											...(currentItem || initialItem),
											description: e.target.value
										})
									}
								/>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<Input
										label="Цена"
										type="number"
										placeholder="Введите цену"
										value={currentItem?.price?.toString() || ''}
										onChange={(e) =>
											setCurrentItem({
												...(currentItem || initialItem),
												price: parseFloat(e.target.value) || 0,
											})
										}
										required
										isInvalid={!currentItem?.price || currentItem.price <= 0}
										errorMessage={!currentItem?.price || currentItem.price <= 0 ? "Цена должна быть больше нуля" : ""}
									/>

									<Input
										label="Обычная цена"
										type="number"
										placeholder="Введите обычную цену"
										value={currentItem?.normal_price?.toString() || ''}
										onChange={(e) =>
											setCurrentItem({
												...(currentItem || initialItem),
												normal_price: parseFloat(e.target.value) || null,
											})
										}
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<Input
										label="Количество"
										type="number"
										placeholder="Введите количество"
										value={currentItem?.quantity?.toString() || ''}
										onChange={(e) =>
											setCurrentItem({
												...(currentItem || initialItem),
												quantity: parseInt(e.target.value, 10) || 0,
											})
										}
									/>

									<Input
										label="Срок годности"
										type="date"
										value={currentItem?.best_before || ''}
										onChange={(e) =>
											setCurrentItem({
												...(currentItem || initialItem),
												best_before: e.target.value
											})
										}
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<Select
										label="Категория"
										placeholder="Выберите категорию"
										selectedKeys={currentItem?.category_id ? [currentItem.category_id.toString()] : []}
										onSelectionChange={(keys) => {
											const selectedKey = Array.from(keys)[0];
											setCurrentItem({
												...(currentItem || initialItem),
												category_id: parseInt(selectedKey as string, 10),
												subcategory_id: null,
											});
										}}
										isInvalid={!currentItem?.category_id}
										errorMessage={!currentItem?.category_id ? "Выберите категорию" : ""}
									>
										{categories.map((category) => (
											<SelectItem key={category.id.toString()} textValue={category.name}>
												<div className="text-color-text">{category.name}</div>
											</SelectItem>
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
											{categories
												.find((category) => category.id === currentItem.category_id)
												?.subcategories?.map((subcategory) => (
													<SelectItem key={subcategory.id.toString()} textValue={subcategory.name}>
														<div className="text-color-text">{subcategory.name}</div>
													</SelectItem>
												)) || <SelectItem key="no-subcategories">Нет подкатегорий</SelectItem>}
										</Select>
									)}
								</div>

								<Input
									label="Адрес"
									placeholder="Введите адрес"
									value={currentItem?.address || ''}
									onChange={(e) =>
										setCurrentItem({
											...(currentItem || initialItem),
											address: e.target.value
										})
									}
								/>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<Input
										label="Бренд"
										placeholder="Введите бренд"
										value={currentItem?.brand || ''}
										onChange={(e) =>
											setCurrentItem({
												...(currentItem || initialItem),
												brand: e.target.value
											})
										}
									/>

									<Input
										label="Страна производства"
										placeholder="Введите страну"
										value={currentItem?.country_of_origin || ''}
										onChange={(e) =>
											setCurrentItem({
												...(currentItem || initialItem),
												country_of_origin: e.target.value,
											})
										}
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<Input
										label="Вес"
										placeholder="Введите вес"
										value={currentItem?.weight || ''}
										onChange={(e) =>
											setCurrentItem({
												...(currentItem || initialItem),
												weight: e.target.value
											})
										}
									/>

									<Input
										label="Цена за кг"
										type="number"
										placeholder="Введите цену за кг"
										value={currentItem?.price_per_kg?.toString() || ''}
										onChange={(e) =>
											setCurrentItem({
												...(currentItem || initialItem),
												price_per_kg: parseFloat(e.target.value) || null,
											})
										}
									/>
								</div>

								<Textarea
									label="Информация"
									placeholder="Введите дополнительную информацию"
									value={currentItem?.information || ''}
									onChange={(e) =>
										setCurrentItem({
											...(currentItem || initialItem),
											information: e.target.value
										})
									}
								/>

								<Card shadow="none" className="p-4 mt-4 bg-light-secondary-color border border-gray-200">
									<h3 className="text-lg font-medium text-color-text mb-3">Настройки скидок</h3>

									<div className="flex flex-col gap-4">
										<Checkbox
											isSelected={noDiscount}
											onChange={(checked) => {
												setNoDiscount(() => Boolean(checked));
												if (checked) {
													setAutoDiscount(false);
													setCustomDiscounts({ "5": 0, "2": 0, "1": 0 });
												}
											}}
											color="success"
											classNames={{
												label: "text-color-text"
											}}
										>
											<span className="text-color-text">Не применять скидки</span>
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
											classNames={{
												label: "text-color-text"
											}}
										>
											<span className="text-color-text">Применить автоматические скидки</span>
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
											color="success"
											classNames={{
												label: "text-color-text"
											}}
										>
											<span className="text-color-text">Составить кастомные скидки</span>
										</Checkbox>
									</div>

									{!autoDiscount && !noDiscount && (
										<div className="mt-4">
											<h4 className="text-md font-medium text-color-text mb-3">Настройка скидок по дням</h4>
											<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
												{[5, 2, 1].map((day) => (
													<div key={day} className="flex flex-col">
														<Input
															label={`Скидка за ${day} ${day === 1 ? 'день' : 'дня'}`}
															type="number"
															min="0"
															max="100"
															placeholder="0"
															labelPlacement="outside"
															value={customDiscounts[day.toString() as DiscountDay].toString()}
															onChange={(e) => {
																const inputValue = e.target.value;

																if (inputValue === "") {
																	setCustomDiscounts(prev => ({
																		...prev,
																		[day.toString() as DiscountDay]: 0
																	}));
																} else {
																	const numValue = parseInt(inputValue, 10) || 0;
																	const value = Math.min(100, Math.max(0, numValue));

																	setCustomDiscounts(prev => ({
																		...prev,
																		[day.toString() as DiscountDay]: value
																	}));
																}
															}}
															onBlur={(e) => {
																if (e.target.value === "") {
																	setCustomDiscounts(prev => ({
																		...prev,
																		[day.toString() as DiscountDay]: 0
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
																label: "text-color-text font-medium",
																inputWrapper: "bg-white border-gray-200"
															}}
														/>
														<span className="text-xs text-primary-color mt-1 text-center">
															{day === 5 ? "За 5 дней до истечения срока" :
																day === 2 ? "За 2 дня до истечения срока" :
																	"В последний день срока годности"}
														</span>
													</div>
												))}
											</div>
											<p className="text-xs text-primary-color mt-3">
												Укажите процент скидки для каждого периода. Если значение равно 0%, скидка не применяется.
											</p>
										</div>
									)}
								</Card>

								<div className="flex justify-end mt-6">
									<Button
										className="bg-secondary-color text-color-text font-medium text-base hover:bg-secondary-color/90"
										onPress={handleSaveItem}
										isLoading={isLoading}
									>
										{currentItem?.id ? 'Обновить товар' : 'Сохранить товар'}
									</Button>
								</div>
							</div>
						</ModalBody>
					</Tab>

					<Tab
						key="images"
						title={
							<div className="flex items-center gap-2 px-1 py-2">
								<span>Изображения</span>
								{itemImages.length > 0 &&
									<span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary-color text-text-color text-xs">
										{itemImages.length}
									</span>
								}
							</div>
						}
						isDisabled={!savedItemId}
					>
						<ModalBody className="max-h-[64vh] overflow-y-auto px-6">
							{!savedItemId ? (
								<div className="p-8 border-2 border-dashed border-secondary-color rounded-lg text-center bg-light-secondary-color">
									<p className="text-color-text mb-3">Сначала сохраните данные товара на первой вкладке</p>
									<Button
										className="bg-primary-color text-white"
										onPress={() => setActiveTab("details")}
									>
										Перейти к заполнению данных
									</Button>
								</div>
							) : (
								<div className="space-y-6 py-2">
									<div className="flex justify-between items-center">
										<h3 className="text-lg font-medium text-color-text">Изображения товара</h3>
										<p className="text-sm text-primary-color">
											{itemImages.length + imageFiles.length}/5 изображений
										</p>
									</div>

									{isImageLoading ? (
										<div className="h-40 flex items-center justify-center">
											<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-color"></div>
										</div>
									) : (
										<>
											{itemImages.length > 0 && (
												<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
													{itemImages.map((image) => (
														<div key={image.id} className="relative group">
															<Card className="overflow-hidden h-48 w-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
																<Image
																	src={image.image_url}
																	alt="Изображение товара"
																	className="w-full h-full object-cover"
																	onError={() => {
																		console.error('Ошибка загрузки изображения:', image.image_url);
																		const imgElement = document.querySelector(`img[src="${image.image_url}"]`);
																		if (imgElement) {
																			imgElement.setAttribute('src', '/placeholder-image.jpg');
																		}
																	}}
																/>
																<div className="absolute top-0 right-0 p-1 z-10">
																	<Button
																		isIconOnly
																		size="sm"
																		color="danger"
																		variant="solid"
																		className="shadow-md"
																		onClick={() => handleDeleteImage(image)}
																	>
																		<IoCloseOutline className="h-5 w-5" />
																	</Button>
																</div>
															</Card>
														</div>
													))}
												</div>
											)}

											{imagePreviews.length > 0 && (
												<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
													{imagePreviews.map((preview, index) => (
														<div key={index} className="relative group">
															<Card className="overflow-hidden h-48 w-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
																<Image
																	src={preview}
																	alt={`Превью ${index + 1}`}
																	className="w-full h-full object-cover"
																/>
																<div className="absolute top-0 right-0 p-1 z-10">
																	<Button
																		isIconOnly
																		size="sm"
																		color="danger"
																		variant="solid"
																		className="shadow-md"
																		onPress={() => {
																			const updatedFiles = [...imageFiles];
																			updatedFiles.splice(index, 1);
																			setImageFiles(updatedFiles);

																			const updatedPreviews = [...imagePreviews];
																			updatedPreviews.splice(index, 1);
																			setImagePreviews(updatedPreviews);
																		}}
																	>
																		<IoCloseOutline className="h-5 w-5" />
																	</Button>
																</div>
															</Card>
														</div>
													))}
												</div>
											)}

											{itemImages.length + imageFiles.length < 5 && (
												<div
													className="w-full h-48 aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
													onClick={() => document.getElementById('photo-input')?.click()}
												>
													<div className="flex flex-col items-center gap-2">
														<AiOutlinePlus className="text-primary-color text-4xl" />
														<p className="text-primary-color font-medium">Добавить изображение</p>
													</div>
												</div>
											)}

											<input
												id="photo-input"
												type="file"
												multiple
												accept="image/*"
												className="hidden"
												onChange={handleAddPhotos}
											/>

											{imageFiles.length > 0 && (
												<div className="flex justify-center mt-6">
													<Button
														className="bg-secondary-color text-color-text font-medium text-base hover:bg-secondary-color/90"
														onPress={handleUploadImages}
														isLoading={isLoading}
														size="lg"
													>
														Загрузить {imageFiles.length} {imageFiles.length === 1 ? 'изображение' : 'изображений'}
													</Button>
												</div>
											)}

											{itemImages.length === 0 && imageFiles.length === 0 && (
												<div className="text-center text-primary-color py-8 bg-light-secondary-color rounded-lg border border-gray-200">
													<p className="font-medium">У товара пока нет изображений</p>
													<p className="text-sm mt-2">Добавьте изображения, чтобы товар выглядел привлекательнее</p>
												</div>
											)}
										</>
									)}
								</div>
							)}
						</ModalBody>
					</Tab>
				</Tabs>

				<ModalFooter className="justify-between">
					<Button
						color="default"
						variant="light"
						onPress={handleCloseModal}
						className="text-primary-color hover:bg-secondary-color/30"
					>
						Закрыть
					</Button>

					{activeTab === "details" && (
						<Button
							className="bg-secondary-color text-color-text font-medium text-base hover:bg-secondary-color/90"
							onPress={handleSaveItem}
							isLoading={isLoading}
						>
							{currentItem?.id ? 'Сохранить и перейти к изображениям' : 'Создать товар'}
						</Button>
					)}
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AdminItemModal;