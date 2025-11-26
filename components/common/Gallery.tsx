'use client';

import 'swiper/css';
import 'swiper/css/effect-fade';
import s from './Gallery.module.scss';
import cn from 'classnames';
import { Image } from 'react-datocms';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay } from 'swiper/modules';
import SwiperCore from 'swiper';
import { useState, useRef, useEffect } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import Content from '@/components/content/Content';

SwiperCore.use([EffectFade, Autoplay]);

export type GalleryProps = {
	images: FileField[];
};

export default function tGallery({ images }: GalleryProps) {
	const swiperRef = useRef<SwiperType | null>(null);
	const [index, setIndex] = useState(0);
	const [loaded, setLoaded] = useState<any>({});
	const isSingleSlide = images.length === 1;

	return (
		<Swiper
			id={`gallery`}
			loop={true}
			className={s.gallery}
			wrapperClass={s.wrapper}
			spaceBetween={0}
			autoplay={{ delay: 5000 }}
			effect={'fade'}
			fadeEffect={{ crossFade: true }}
			simulateTouch={!isSingleSlide}
			slidesPerView={1}
			initialSlide={index}
			onSlideChange={(s) => setIndex(s.realIndex)}
			onSwiper={(swiper) => (swiperRef.current = swiper)}
		>
			{images.map(({ id, responsiveImage, title }, idx) => (
				<SwiperSlide key={idx} className={s.slide} onClick={() => swiperRef.current?.slideNext()}>
					<figure>
						{responsiveImage && (
							<Image
								className={s.wrap}
								data={responsiveImage}
								onLoad={() => setLoaded((l: any) => ({ ...l, [id]: true }))}
								fadeInDuration={0}
							/>
						)}
						{title && <figcaption>{title}</figcaption>}
					</figure>
				</SwiperSlide>
			))}
			<button className={s.prev} onClick={() => swiperRef.current?.slidePrev()}>
				‹
			</button>
			<button className={s.next} onClick={() => swiperRef.current?.slideNext()}>
				›
			</button>
		</Swiper>
	);
}
