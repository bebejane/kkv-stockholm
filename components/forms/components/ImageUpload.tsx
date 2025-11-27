import s from './ImageUpload.module.scss';
import cn from 'classnames';
import { Button } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { useDatoCmsFileUpload } from '@/lib/hooks/useDatoCmsFileUpload';
import DotLoader from '@/components/common/DotLoader';
import { useEffect, useState } from 'react';
import { Upload } from '@datocms/cma-client/dist/types/generated/ApiTypes';

export type ImageUploadProps = {
	image?: Upload | null;
	onChange: (upload: Upload | null) => void;
};

export function ImageUpload({ image: _image, onChange }: ImageUploadProps) {
	const [file, setFile] = useState<File | null>(null);

	const { upload, error, progress, state, image, cancel } = useDatoCmsFileUpload({
		file,
		locale: 'sv' as SiteLocale,
		tags: ['upload', 'course'],
		collectionId: process.env.NEXT_PUBLIC_UPLOADS_COLLECTION_ID,
	});
	const currentImage = image ?? _image;

	useEffect(() => {
		onChange(upload);
	}, [upload]);

	return (
		<>
			<Dropzone
				className={s.drop}
				onDrop={(files) => setFile(files[0] ?? null)}
				onReject={(files) => console.log('rejected files', files)}
				accept={['image/png', 'image/jpeg', 'image/jpg']}
			>
				{currentImage && <img className={cn(s.image, state && s.loading)} src={currentImage.url} />}
			</Dropzone>
			<div className={s.message}>
				<div className={s.wrap}>
					{state === 'CREATING_UPLOAD_OBJECT' ? (
						<DotLoader message='Bearbetar bilden' />
					) : state === 'UPLOADING_FILE' ? (
						<DotLoader message={`Laddar upp: ${progress}%`} />
					) : error ? (
						<p className={s.error}>{error}</p>
					) : (
						<>Dra och släpp bild eller klicka för att välja bild</>
					)}
				</div>
				{state && (
					<Button
						className={s.cancel}
						type='button'
						variant='white'
						onClick={(e) => {
							e.stopPropagation();
							cancel();
						}}
					>
						Avbryt
					</Button>
				)}
			</div>
		</>
	);
}
