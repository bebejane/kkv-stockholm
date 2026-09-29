import s from './ImageUpload.module.scss';
import cn from 'classnames';
import { Button, InputWrapper, InputWrapperProps } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { useDatoCmsFileUpload } from '@/lib/hooks/useDatoCmsFileUpload';
import DotLoader from '@/components/common/DotLoader';
import { useEffect, useState } from 'react';
import type { ApiTypes } from '@datocms/cma-client';

export type ImageUploadProps = InputWrapperProps & {
	image?: ApiTypes.Upload | null;
	onUpload: (upload: ApiTypes.Upload | null) => void;
	onUploading: (uploading: boolean) => void;
};

export function ImageUpload(props: ImageUploadProps) {
	const [file, setFile] = useState<File | null>(null);

	const { upload, error, progress, state, image, cancel, uploading } = useDatoCmsFileUpload({
		file,
		locale: 'sv' as SiteLocale,
		tags: ['upload', 'course'],
		collectionId: process.env.NEXT_PUBLIC_UPLOADS_COLLECTION_ID,
	});
	const currentImage = image ?? props.image;

	// Destructured so the effects can depend on the specific callbacks.
	const { onUpload, onUploading } = props;
	useEffect(() => {
		onUpload(upload);
	}, [upload, onUpload]);
	useEffect(() => {
		onUploading(uploading);
	}, [uploading, onUploading]);

	return (
		<InputWrapper {...{ ...props, onUpload: undefined, onUploading: undefined }}>
			<Dropzone
				className={s.drop}
				onDrop={(files) => setFile(files[0] ?? null)}
				accept={['image/png', 'image/jpeg', 'image/jpg']}
			>
				{currentImage && (
					<img
						className={cn(s.image, state && s.loading)}
						src={currentImage.url}
						alt='Förhandsvisning av uppladdad bild'
					/>
				)}
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
		</InputWrapper>
	);
}
