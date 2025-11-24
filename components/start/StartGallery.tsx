'use client';

import 'swiper/css';
import 'swiper/css/effect-fade';
import s from './StartGallery.module.scss';
import cn from 'classnames';
import { Image } from 'react-datocms';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay } from 'swiper/modules';
import SwiperCore from 'swiper';
import { useState, useRef, useEffect } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import Content from '@/components/content/Content';

SwiperCore.use([EffectFade, Autoplay]);

export type StartGalleryProps = {
	gallery: NonNullable<StartQuery['start']>['gallery'];
};

export default function StartGallery({ gallery }: StartGalleryProps) {
	const swiperRef = useRef<SwiperType | null>(null);
	const [index, setIndex] = useState(0);
	const [loaded, setLoaded] = useState<any>({});
	const isSingleSlide = gallery.length === 1;

	return (
		<Swiper
			id={`start-gallery`}
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
			{gallery.map(({ image, caption }, idx) => (
				<SwiperSlide key={idx} className={s.slide} onClick={() => swiperRef.current?.slideNext()}>
					<figure>
						{image?.responsiveImage && (
							<Image
								className={s.wrap}
								data={image.responsiveImage}
								onLoad={() => setLoaded((l: any) => ({ ...l, [image.id]: true }))}
								fadeInDuration={0}
							/>
						)}
						<figcaption className={cn(loaded[image?.id] && s.show)}>
							{caption && <Content content={caption} />}
						</figcaption>
					</figure>
				</SwiperSlide>
			))}
		</Swiper>
	);
}
