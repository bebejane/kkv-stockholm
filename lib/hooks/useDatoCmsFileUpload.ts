import { useEffect, useState, useCallback, RefObject, RefCallback, useRef, useMemo } from 'react';
import { buildClient, CancelablePromise, CanceledPromiseError } from '@datocms/cma-client-browser';
import { ApiTypes, SimpleSchemaTypes } from '@datocms/cma-client';
import { OnUploadProgressInfo } from '@datocms/cma-client-browser/dist/types/resources/Upload';
import { UploadCollection } from '@datocms/cma-client/dist/types/generated/RawApiTypes';

export type UseDatoCmsFileUploadProps = {
	file: File | null;
	locale: SiteLocale;
	customData?: any;
	tags?: string[];
	collectionId?: string;
	meta?: {
		title: string;
		alt: string;
	};
};

export type Upload = SimpleSchemaTypes.Upload;

export function useDatoCmsFileUpload({
	file,
	locale,
	meta,
	customData,
	tags,
	collectionId,
}: UseDatoCmsFileUploadProps) {
	if (!process.env.NEXT_PUBLIC_UPLOADS_API_TOKEN) throw new Error('Missing NEXT_PUBLIC_UPLOADS_API_TOKEN');
	if (!process.env.NEXT_PUBLIC_DATOCMS_ENVIRONMENT) throw new Error('Missing NEXT_PUBLIC_DATOCMS_ENVIRONMENT');

	const [error, setError] = useState<string | null>(null);
	const [upload, setUpload] = useState<Upload | null>(null);
	const [uploading, setUploading] = useState<boolean>(false);
	const [progress, setProgress] = useState<number | null>(null);
	const [image, setImage] = useState<Partial<Upload> | null>(null);
	const [state, setState] = useState<OnUploadProgressInfo['type'] | null>(null);
	const previousImageRef = useRef<Partial<Upload> | null>(null);
	const uplodaPromiseRef = useRef<CancelablePromise<ApiTypes.Upload> | null>(null);

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

	const cancel = () => {
		uplodaPromiseRef.current?.cancel();
		uplodaPromiseRef.current = null;
		if (previousImageRef.current) setImage(previousImageRef.current);

		reset();
	};

	const createUpload = async (file: File): Promise<Upload> => {
		cancel();

		if (!file) return Promise.reject(new Error('Ingen fil vald'));
		if (file.type.includes('image')) {
			previousImageRef.current = image;
			parseImageFile(file).then(setImage).catch(setError);
		}

		setUploading(true);

		return new Promise((resolve, reject) => {
			uplodaPromiseRef.current = client.uploads.createFromFileOrBlob({
				fileOrBlob: file,
				filename: file.name,
				tags: tags ?? [],
				upload_collection: collectionId
					? ({
							type: 'upload_collection',
							id: collectionId,
						} as UploadCollection)
					: undefined,
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
			});

			uplodaPromiseRef.current
				.then((upload) => {
					if (upload.width && upload.height && upload.url)
						setImage({
							width: upload.width,
							height: upload.height,
							url: upload.url,
						});
					resolve(upload);
				})
				.catch((e) => {
					if (e instanceof CanceledPromiseError) return;
					throw typeof e === 'string' ? e : (e.message ?? e.toString());
				})
				.finally(() => {
					setUploading(false);
					setProgress(null);
					setState(null);
				});
		});
	};

	useEffect(() => {
		if (!file) return reset();
		createUpload(file).then(setUpload).catch(setError);
	}, [file]);

	return { upload, uploading, error, progress, state, image, cancel };
}

const parseImageFile = async (file: File): Promise<Partial<Upload>> => {
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
				resolve({ width: image.width, height: image.height, url: image.src });
			};
		};
		reader.readAsDataURL(file);
	});
};
