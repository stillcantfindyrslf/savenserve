"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";

const AppSlider = () => {
	return (
		<section className="mt-32">
			<div className="relative group">
				<Swiper
					modules={[Navigation]}
					navigation={{
						nextEl: ".swiper-button-next",
						prevEl: ".swiper-button-prev",
					}}
					spaceBetween={30}
					slidesPerView={1}
					loop
					className="rounded-xl overflow-hidden"
				>
					<SwiperSlide>
						<div className="bg-blue-500 h-96 flex items-center justify-center text-white text-2xl">
							Slide 1
						</div>
					</SwiperSlide>
					<SwiperSlide>
						<div className="bg-green-500 h-96 flex items-center justify-center text-white text-2xl">
							Slide 2
						</div>
					</SwiperSlide>
					<SwiperSlide>
						<div className="bg-red-500 h-96 flex items-center justify-center text-white text-2xl">
							Slide 3
						</div>
					</SwiperSlide>
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