import s from './GalleryImage.module.scss';
import { Image } from 'react-datocms';
import Content from '@/components/content/Content';

type GalleryImageProps = {
	data: GalleryImageRecord;
};

export function GalleryImage({ data: { image, caption } }: GalleryImageProps) {
	return (
		<figure className={s.galleryImage}>
			{image?.responsiveImage && <Image data={image.responsiveImage} />}
			<figcaption>
				<Content content={caption} />
			</figcaption>
		</figure>
	);
}
