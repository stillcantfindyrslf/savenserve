import React, { useState, useEffect, useRef } from 'react';
import { Modal, Image, Button, ModalBody, ModalHeader, Chip } from '@nextui-org/react';
import { ItemWithImages } from '@/store/useItemStore/types';
import { ModalContent } from "@nextui-org/modal";
import useLikeStore from "@/store/useLikesStote/useLikesStore";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { Swiper, SwiperSlide } from 'swiper/react';
import type SwiperType from 'swiper';
import { Pagination, Autoplay } from 'swiper/modules';
import { IoIosArrowBack, IoIosArrowForward, IoMdClose } from "react-icons/io";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { MdLocationOn, MdCalendarToday, MdOutlineInfo } from "react-icons/md";
import { TbWeight } from "react-icons/tb";
import { BsGlobe } from "react-icons/bs";
import { SiTarget } from "react-icons/si";
import { FaMoneyBillWave } from "react-icons/fa";
import { toast } from "sonner";

function daysBetweenDates(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.round((d2.getTime() - d1.getTime()) / oneDay);
}

interface ItemModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    item: ItemWithImages;
    user: { id: string } | null;
}

const ItemDetailModal: React.FC<ItemModalProps> = ({ isOpen, onOpenChange, item, user }) => {
    const { toggleLike, isLiked } = useLikeStore();
    const [daysLeft, setDaysLeft] = useState<number | null>(null);
    const [freshStatus, setFreshStatus] = useState<'fresh' | 'warning' | 'danger'>('fresh');
    const swiperRef = useRef<SwiperType | undefined>(undefined);

    const imageUrls = item.item_images && item.item_images.length > 0
        ? item.item_images.map(img => img.image_url)
        : ['/placeholder-image.jpg'];

    const liked = isLiked(item.id);

    useEffect(() => {
        if (item.best_before) {
            const days = daysBetweenDates(new Date(), new Date(item.best_before));
            setDaysLeft(days);

            if (days <= 1) {
                setFreshStatus('danger');
            } else if (days <= 3) {
                setFreshStatus('warning');
            } else {
                setFreshStatus('fresh');
            }
        } else {
            setDaysLeft(null);
        }
    }, [item.best_before]);

    const handleLikeToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (user) {
            toggleLike(user.id, item.id);
        } else {
            toast.warning('Войдите, чтобы добавить в избранное');
        }
    };

    const getFreshStatusColor = () => {
        switch (freshStatus) {
            case 'danger':
                return 'danger';
            case 'warning':
                return 'warning';
            case 'fresh':
            default:
                return 'success';
        }
    };

    const getFreshStatusText = () => {
        if (daysLeft === null) return 'Срок не указан';
        if (daysLeft < 0) return 'Срок истек!';
        if (daysLeft === 0) return 'Истекает сегодня!';
        if (daysLeft === 1) return 'Истекает завтра';
        return `${daysLeft} дн. до конца срока`;
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onOpenChange}
            aria-labelledby="modal-title"
            size="3xl"
            className="bg-white"
            classNames={{
                base: "max-w-5xl h-[90vh] sm:h-[80vh] fixed-height",
                body: "p-0 pb-0 overflow-hidden",
                backdrop: "bg-[#292f46]/50 backdrop-opacity-50",
                closeButton: "hidden"
            }}
            hideCloseButton
        >
            <ModalContent>
                <ModalHeader className="px-3 sm:px-4 pt-2 pb-1 sm:pt-3 sm:pb-2 flex flex-row items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-semibold text-color-text truncate pr-2 sm:pr-4">
                        {item.name}
                    </h3>

                    <button
                        onClick={onOpenChange}
                        className="p-1 sm:p-1.5 text-gray-700 hover:text-primary-color rounded-full transition-colors hover:bg-gray-100"
                        aria-label="Закрыть"
                    >
                        <IoMdClose size={24} className="sm:w-[28px] sm:h-[28px]" />
                    </button>
                </ModalHeader>

                <ModalBody className="p-0 overflow-hidden">
                    <div className="flex flex-col md:flex-row w-full h-full">
                        <div className="w-full md:w-[50%] md:h-full relative">
                            <div className="absolute top-3 right-3 z-10 sm:top-4 sm:right-4">
                                <button
                                    className={`h-17 w-17 sm:h-14 sm:w-14 rounded-full flex items-center justify-center bg-gray-50 transition-all duration-300 ${liked
                                        ? 'bg-red-50 text-red-500'
                                        : 'bg-white text-gray-400 hover:text-red-500 hover:bg-red-50'
                                        }`}
                                    onClick={handleLikeToggle}
                                    aria-label={liked ? "Убрать из избранного" : "Добавить в избранное"}
                                >
                                    {liked ? (
                                        <FaHeart className="text-red-500" size={30} />
                                    ) : (
                                        <FaRegHeart size={30} />
                                    )}
                                </button>
                            </div>

                            <div className="relative w-full h-full">
                                <Swiper
                                    modules={[Pagination, Autoplay]}
                                    pagination={{
                                        clickable: true,
                                        bulletActiveClass: 'bg-primary-color opacity-100',
                                        bulletClass: 'inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gray-300 opacity-70 mx-1.5',
                                    }}
                                    onSwiper={(swiper) => {
                                        swiperRef.current = swiper;
                                    }}
                                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                                    loop
                                    className="w-full h-full md:min-h-[500px]"
                                >
                                    {imageUrls.map((url, index) => (
                                        <SwiperSlide key={index} className="w-full h-full">
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Image
                                                    src={url}
                                                    alt={`${item.name} изображение ${index + 1}`}
                                                    className="w-full h-full object-contain"
                                                    classNames={{
                                                        wrapper: "w-full h-full",
                                                        img: "object-contain w-full h-full max-h-[220px] sm:max-h-[300px] md:max-h-[500px]"
                                                    }}
                                                    radius="none"
                                                    removeWrapper
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                {imageUrls.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => swiperRef.current?.slidePrev()}
                                            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-white shadow-md text-color-text hover:bg-gray-50 transition-transform hover:scale-105"
                                        >
                                            <IoIosArrowBack size={22} className="sm:w-7 sm:h-7" />
                                        </button>
                                        <button
                                            onClick={() => swiperRef.current?.slideNext()}
                                            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-white shadow-md text-color-text hover:bg-gray-50 transition-transform hover:scale-105"
                                        >
                                            <IoIosArrowForward size={22} className="sm:w-7 sm:h-7" />
                                        </button>
                                    </>
                                )}

                                {imageUrls.length > 1 && (
                                    <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex justify-center">
                                        <div className="swiper-pagination"></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="w-full md:w-[50%] p-3 sm:p-4 md:p-5 flex flex-col overflow-y-auto" style={{ maxHeight: "calc(90vh - 56px)" }}>

                            <div className="flex flex-col">
                                <div className="flex items-center justify-between mb-4 sm:mb-5">
                                    <div>
                                        {item.discount_price && item.discount_price < item.price ? (
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-3xl sm:text-4xl font-bold text-red-600">{item.discount_price} р.</span>
                                                    <Chip color="warning" variant="flat" size="lg" className="text-xs sm:text-sm">{Math.round(100 - (item.discount_price / item.price) * 100)}%</Chip>
                                                </div>
                                                <span className="text-lg sm:text-xl text-gray-500 line-through mt-1">{item.price} р.</span>
                                            </div>
                                        ) : (
                                            <span className="text-3xl sm:text-4xl font-bold text-color-text">{item.price} р.</span>
                                        )}
                                    </div>

                                    {item.best_before && (
                                        <Chip
                                            color={getFreshStatusColor()}
                                            variant="flat"
                                            size="md"
                                            startContent={<MdCalendarToday size={16} className="sm:w-[18px] sm:h-[18px]" />}
                                            className="px-2 sm:px-3 py-1.5 sm:py-2"
                                        >
                                            <span className="font-medium text-xs sm:text-sm">{getFreshStatusText()}</span>
                                        </Chip>
                                    )}
                                </div>

                                {item.description && (
                                    <div className="mb-4 sm:mb-5 bg-light-secondary-color/30 rounded-lg">
                                        <h4 className="font-semibold text-base sm:text-lg text-color-text mb-1.5 sm:mb-2 flex items-center">
                                            <MdOutlineInfo className="mr-1.5 sm:mr-2" size={18} />
                                            Описание
                                        </h4>
                                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{item.description}</p>
                                    </div>
                                )}

                                <div className="space-y-2 sm:space-y-3 mb-5 sm:mb-6">
                                    <h4 className="font-semibold text-base sm:text-lg text-color-text flex items-center">
                                        Информация о товаре
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-3 sm:gap-y-4">
                                        {item.brand && (
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <SiTarget className="text-primary-color flex-shrink-0" size={20} />
                                                <div>
                                                    <p className="text-xs sm:text-sm text-gray-500 font-medium">Бренд</p>
                                                    <p className="text-sm sm:text-base text-gray-800 font-medium">{item.brand}</p>
                                                </div>
                                            </div>
                                        )}

                                        {item.weight && (
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <TbWeight className="text-primary-color flex-shrink-0" size={20} />
                                                <div>
                                                    <p className="text-xs sm:text-sm text-gray-500 font-medium">Вес</p>
                                                    <p className="text-sm sm:text-base text-gray-800 font-medium">{item.weight}</p>
                                                </div>
                                            </div>
                                        )}

                                        {item.address && (
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <MdLocationOn className="text-primary-color flex-shrink-0" size={20} />
                                                <div>
                                                    <p className="text-xs sm:text-sm text-gray-500 font-medium">Адрес</p>
                                                    <p className="text-sm sm:text-base text-gray-800 font-medium">{item.address}</p>
                                                </div>
                                            </div>
                                        )}

                                        {item.country_of_origin && (
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <BsGlobe className="text-primary-color flex-shrink-0" size={20} />
                                                <div>
                                                    <p className="text-xs sm:text-sm text-gray-500 font-medium">Страна</p>
                                                    <p className="text-sm sm:text-base text-gray-800 font-medium">{item.country_of_origin}</p>
                                                </div>
                                            </div>
                                        )}

                                        {item.price_per_kg && (
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <FaMoneyBillWave className="text-primary-color flex-shrink-0" size={20} />
                                                <div>
                                                    <p className="text-xs sm:text-sm text-gray-500 font-medium">Цена за кг</p>
                                                    <p className="text-sm sm:text-base text-gray-800 font-medium">{item.price_per_kg} р./кг</p>
                                                </div>
                                            </div>
                                        )}

                                        {item.information && (
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <MdOutlineInfo className="text-primary-color flex-shrink-0" size={20} />
                                                <div>
                                                    <p className="text-xs sm:text-sm text-gray-500 font-medium">Дополнительно</p>
                                                    <p className="text-sm sm:text-base text-gray-800 font-medium">{item.information}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto pt-3 sm:pt-4">
                                <Button
                                    className="w-full h-12 sm:h-14 bg-secondary-color text-color-text font-medium text-base sm:text-lg hover:bg-secondary-color/90"
                                    onPress={onOpenChange}
                                    startContent={<IoIosArrowBack size={18} className="sm:w-5 sm:h-5" />}
                                >
                                    Вернуться к каталогу
                                </Button>
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ItemDetailModal;