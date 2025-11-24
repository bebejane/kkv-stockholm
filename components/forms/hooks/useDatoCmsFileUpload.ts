import { useEffect, useState, useCallback, RefObject, RefCallback, useRef, useMemo } from 'react';
import { buildClient } from '@datocms/cma-client-browser';
import { SimpleSchemaTypes } from '@datocms/cma-client';
import { OnUploadProgressInfo } from '@datocms/cma-client-browser/dist/types/resources/Upload';

export type ImageData = {
	width: number;
	height: number;
	src: string;
};

export type UseDatoCmsFileUploadProps = {
	file: File | null;
	locale: SiteLocale;
	customData?: any;
	tags?: string[];
	meta?: {
		title: string;
		alt: string;
	};
};

export type Upload = SimpleSchemaTypes.Upload;

export function useDatoCmsFileUpload({ file, locale, meta, customData, tags }: UseDatoCmsFileUploadProps) {
	if (!process.env.NEXT_PUBLIC_UPLOADS_API_TOKEN) throw new Error('Missing NEXT_PUBLIC_UPLOADS_API_TOKEN');
	if (!process.env.NEXT_PUBLIC_DATOCMS_ENVIRONMENT) throw new Error('Missing NEXT_PUBLIC_DATOCMS_ENVIRONMENT');

	const [error, setError] = useState<Error | unknown | undefined>();
	const [upload, setUpload] = useState<Upload | null>(null);
	const [uploading, setUploading] = useState<boolean>(false);
	const [progress, setProgress] = useState<number | null>(null);
	const [image, setImage] = useState<ImageData | null>(null);
	const [state, setState] = useState<OnUploadProgressInfo['type'] | null>(null);
	const uplodaPromiseRef = useRef<Promise<Upload> | null>(null);

	const client = useMemo(
		() =>
			buildClient({
				apiToken: process.env.NEXT_PUBLIC_UPLOADS_API_TOKEN!,
				environment: process.env.NEXT_PUBLIC_DATOCMS_ENVIRONMENT!,
			}),
		[]
	);

	const reset = () => {
		setProgress(null);
		setState(null);
		setUpload(null);
		setUploading(false);
		setError(null);
		setImage(null);
	};

	const createUpload = async (file: File): Promise<Upload> => {
		if (!file) return Promise.reject(new Error('Ingen fil vald'));

		reset();

		if (file.type.includes('image')) parseImageFile(file).then(setImage).catch(setError);

		setUploading(true);

		return new Promise((resolve, reject) => {
			client.uploads
				.createFromFileOrBlob({
					fileOrBlob: file,
					filename: file.name,
					tags: tags ?? [],
					default_field_metadata: {
						[locale]: {
							title: meta?.title ?? '',
							alt: meta?.alt ?? '',
							custom_data: customData ?? {},
						},
					},
					onProgress: (info: OnUploadProgressInfo) => {
						if (info.type === 'UPLOADING_FILE' && info.payload && 'progress' in info.payload)
							setProgress(info.payload.progress);
						setState(info.type);
					},
				})
				.then((upload) => {
					if (upload.width && upload.height && upload.url)
						setImage({
							width: upload.width,
							height: upload.height,
							src: upload.url,
						});
					resolve(upload);
				})
				.catch(reject)
				.finally(() => {
					setUploading(false);
					setProgress(null);
					setState(null);
					setState(null);
				});
		});
	};

	useEffect(() => {
		if (!file) return reset();
		//if(uplodaPromiseRef.current)
		//uplodaPromiseRef.current.then(reset);
		createUpload(file).then(setUpload).catch(setError);
	}, [file]);

	return { upload, uploading, error, progress, state, image, reset };
}

const parseImageFile = async (file: File): Promise<ImageData> => {
	if (!file) return Promise.reject('Invalid file');

	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = (err) => reject(err);
		reader.onload = (e: ProgressEvent<FileReader>) => {
			const image = new Image();
			const target = e.target;
			if (!target) return reject('Invalid image progress target');
			if (target.result === 'data:') return reject('Invalid image data');
			image.src = target.result as string;
			image.onload = function () {
				resolve({ width: image.width, height: image.height, src: image.src });
			};
		};
		reader.readAsDataURL(file);
	});
};
