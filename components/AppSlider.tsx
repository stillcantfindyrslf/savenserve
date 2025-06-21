"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Link from "next/link";
import "swiper/css";
import { Banner } from "@/store/useBannerStore/types";
import { Image } from "@nextui-org/react";

interface AppSliderProps {
	banners: Banner[];
}

const AppSlider: React.FC<AppSliderProps> = ({ banners }) => {
	if (banners.length === 0) {
		return null;
	}

	return (
		<section className="mt-[7.65rem]">
			<div className="relative group">
				<Swiper
					modules={[Navigation, Autoplay]}
					navigation={{
						nextEl: ".swiper-button-next",
						prevEl: ".swiper-button-prev",
					}}
					autoplay={{
						delay: 8000,
						disableOnInteraction: false,
					}}
					spaceBetween={30}
					slidesPerView={1}
					loop
					className="rounded-2xl overflow-hidden shadow-sm"
				>
					{banners.map((banner) => (
						<SwiperSlide key={banner.id}>
							<div className="h-auto md:h-72 relative overflow-hidden bg-gradient-to-r from-green-200 to-lime-200">
								<div className="w-full h-full px-6 lg:px-8 relative">
									<div className="flex flex-col md:flex-row h-full">
										<div className="order-1 md:order-2 md:absolute md:right-0 md:bottom-0 h-48 md:h-full w-full md:w-3/5 lg:w-1/2 z-0">
											<div className="h-full w-full flex items-center md:items-end justify-center md:justify-end overflow-visible">
												<Image
													src={banner.image_url}
													alt={banner.title}
													width={1000}
													height={800}
													className="object-contain object-center md:object-bottom max-h-[100%] md:max-h-[120%] md:-mb-2 md:scale-110"
													removeWrapper
												/>
											</div>
										</div>

										<div className="order-2 md:order-1 w-full md:w-3/5 lg:w-1/2 z-10 py-4 md:py-0">
											<div className="flex h-full items-center justify-center md:justify-start">
												<div className="max-w-lg py-2 md:py-6 text-center md:text-left">
													<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-color mb-2 md:mb-3 leading-tight">
														{banner.title}
													</h2>

													{banner.description && (
														<p className="text-sm sm:text-base md:text-lg text-gray-600 mb-3 md:mb-6 leading-relaxed">
															{banner.description}
														</p>
													)}

													{banner.button_text && banner.button_link && (
														<div className="flex justify-center md:justify-start">
															<Link
																href={banner.button_link}
																className="bg-primary-color hover:bg-primary-color/90 text-white font-medium py-2 md:py-3 px-6 md:px-8 rounded-md inline-flex items-center transition-colors shadow-md"
															>
																<span>{banner.button_text}</span>
																<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
																	<path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
																</svg>
															</Link>
														</div>
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</SwiperSlide>
					))}
				</Swiper>

				<div className="swiper-button-prev absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-1.5 rounded-full cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
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

				<div className="swiper-button-next absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-1.5 rounded-full cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
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