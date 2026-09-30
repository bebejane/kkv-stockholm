import { useEffect, useState, useRef, useMemo } from 'react';
import { buildClient, CancelablePromise, CanceledPromiseError } from '@datocms/cma-client-browser';
import { ApiTypes, RawApiTypes, SimpleSchemaTypes } from '@datocms/cma-client';

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

/** State that belongs to one specific file, so it is never mixed between files. */
type FileKeyed<T> = { file: File } & T;

export function useDatoCmsFileUpload({
	file,
	locale,
	meta,
	customData,
	tags,
	collectionId,
}: UseDatoCmsFileUploadProps) {
	if (!process.env.NEXT_PUBLIC_UPLOADS_API_TOKEN)
		throw new Error('Missing NEXT_PUBLIC_UPLOADS_API_TOKEN');
	if (!process.env.NEXT_PUBLIC_DATOCMS_ENVIRONMENT)
		throw new Error('Missing NEXT_PUBLIC_DATOCMS_ENVIRONMENT');

	const [result, setResult] = useState<FileKeyed<{ upload: Upload }> | null>(null);
	const [failure, setFailure] = useState<FileKeyed<{ message: string }> | null>(null);
	const [progressInfo, setProgressInfo] = useState<
		FileKeyed<{ state: string; progress: number | null }> | null
	>(null);
	const [preview, setPreview] = useState<FileKeyed<{ image: Partial<Upload> }> | null>(null);
	const uplodaPromiseRef = useRef<CancelablePromise<ApiTypes.Upload> | null>(null);

	const client = useMemo(
		() =>
			buildClient({
				apiToken: process.env.NEXT_PUBLIC_UPLOADS_API_TOKEN!,
				environment: process.env.NEXT_PUBLIC_DATOCMS_ENVIRONMENT!,
			}),
		[]
	);

	// Only expose state that belongs to the currently selected file.
	const forFile = <T,>(value: FileKeyed<T> | null): T | null =>
		file && value?.file === file ? value : null;

	const upload = forFile(result)?.upload ?? null;
	const error = forFile(failure)?.message ?? null;
	const progress = forFile(progressInfo)?.progress ?? null;
	const state = forFile(progressInfo)?.state ?? null;
	const image = forFile(preview)?.image ?? null;
	// An upload is in flight as long as the client keeps reporting progress.
	const uploading = state !== null;

	const cancel = () => {
		uplodaPromiseRef.current?.cancel();
		uplodaPromiseRef.current = null;
		setResult(null);
		setFailure(null);
		setProgressInfo(null);
		setPreview(null);
	};

	useEffect(() => {
		if (!file) return;

		// Supersede any in-flight upload (external side effect, no state update).
		uplodaPromiseRef.current?.cancel();
		uplodaPromiseRef.current = null;

		if (file.type.includes('image')) {
			parseImageFile(file)
				.then((image) => setPreview({ file, image }))
				.catch((e) =>
					setFailure({ file, message: typeof e === 'string' ? e : (e?.message ?? String(e)) }),
				);
		}

		const promise = client.uploads.createFromFileOrBlob({
			fileOrBlob: file,
			filename: file.name,
			tags: tags ?? [],
			upload_collection: collectionId
				? ({
						type: 'upload_collection',
						id: collectionId,
					} as RawApiTypes.UploadCollection)
				: undefined,
			// Legacy locale-keyed metadata; runtime is unchanged.
			default_field_metadata: {
				[locale]: {
					title: meta?.title ?? '',
					alt: meta?.alt ?? '',
					custom_data: customData ?? {},
				},
			} as unknown as ApiTypes.UploadCreateSchema['default_field_metadata'],
			onProgress: (info) => {
				const next =
					info.type === 'UPLOADING_FILE' && info.payload && 'progress' in info.payload
						? info.payload.progress
						: null;
				setProgressInfo((prev) => ({
					file,
					state: info.type,
					progress: next ?? (prev?.file === file ? prev.progress : null),
				}));
			},
		});

		uplodaPromiseRef.current = promise;

		promise
			.then((upload) => {
				setResult({ file, upload });
				if (upload.width && upload.height && upload.url)
					setPreview({
						file,
						image: { width: upload.width, height: upload.height, url: upload.url },
					});
			})
			.catch((e) => {
				// A superseded/cancelled upload is not an error to show the user.
				if (e instanceof CanceledPromiseError) return;
				setFailure({ file, message: typeof e === 'string' ? e : (e?.message ?? String(e)) });
			})
			.finally(() => {
				// Leave a newer file's progress untouched.
				setProgressInfo((prev) => (prev?.file === file ? null : prev));
			});
		// The upload is keyed to `file`; re-run only when the selected file changes.
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
