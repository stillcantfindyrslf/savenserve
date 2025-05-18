"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Link from "next/link";
import "swiper/css";
import useBannerStore from "@/store/useBannerStore";
import { Banner } from "@/store/useBannerStore/types";
import { Spinner } from "@nextui-org/react";
import { Image } from "@nextui-org/react";

const AppSlider = () => {
	const { fetchBanners } = useBannerStore();
	const [banners, setBanners] = useState<Banner[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadBanners = async () => {
			try {
				const allBanners = await fetchBanners();
				const activeBanners = allBanners.filter(banner => banner.is_active);
				setBanners(activeBanners);
			} catch (error) {
				console.error("Ошибка загрузки баннеров:", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadBanners();
	}, [fetchBanners]);

	if (isLoading) {
		return (
			<section className="mt-32 h-96 flex justify-center items-center">
				<Spinner size="lg" color="primary" />
			</section>
		);
	}

	if (banners.length === 0) {
		return null;
	}

	return (
		<section className="mt-32">
			<div className="relative group">
				<Swiper
					modules={[Navigation, Autoplay]}
					navigation={{
						nextEl: ".swiper-button-next",
						prevEl: ".swiper-button-prev",
					}}
					autoplay={{
						delay: 5000,
						disableOnInteraction: false,
					}}
					spaceBetween={30}
					slidesPerView={1}
					loop
					className="rounded-xl overflow-hidden shadow-sm"
				>
					{banners.map((banner) => (
						<SwiperSlide key={banner.id}>
							<div className="h-80 relative overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100">
								<div className="container mx-auto h-full px-6 lg:px-8">
									<div className="flex h-full items-center">
										<div className="w-full lg:w-1/2 pr-0 lg:pr-12 z-20 relative">
											<div className="max-w-lg">
												<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 leading-tight">
													{banner.title}
												</h2>

												{banner.description && (
													<p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
														{banner.description}
													</p>
												)}

												{banner.button_text && banner.button_link && (
													<Link
														href={banner.button_link}
														className="bg-primary-color hover:bg-primary-color/90 text-white font-medium py-3 px-8 rounded-md inline-flex items-center transition-colors shadow-md"
													>
														<span>{banner.button_text}</span>
														<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
															<path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
														</svg>
													</Link>
												)}
											</div>
										</div>

										<div className="hidden lg:block lg:w-1/2 relative h-full">
											<div className="absolute -right-12 top-1/2 transform -translate-y-1/2 h-[120%] w-[120%] overflow-hidden">
												<div className="relative h-full w-full">
													<Image
														src={banner.image_url}
														alt={banner.title}
														width={800}
														height="100%"
														className="object-cover"
													/>
												</div>
											</div>
										</div>

										{/* Фоновое изображение для мобильных устройств */}
										<div className="absolute inset-0 lg:hidden">
											<div className="absolute inset-0 bg-gradient-to-r from-white to-transparent z-10"></div>
											<Image
												src={banner.image_url}
												alt={banner.title}
												className="object-cover object-right opacity-30"
											/>
										</div>
									</div>
								</div>
							</div>
						</SwiperSlide>
					))}
				</Swiper>

				<div className="swiper-button-prev absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-1.5 rounded-full cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-400 shadow-md">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="text-color-text"
						width="30"
						height="30"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
					</svg>
				</div>

				<div className="swiper-button-next absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-1.5 rounded-full cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-400 shadow-md">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="text-color-text"
						width="30"
						height="30"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
					</svg>
				</div>
			</div>
		</section>
	);
};

export default AppSlider;