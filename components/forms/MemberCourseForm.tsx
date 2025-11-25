'use client';

import s from './MemberCourseForm.module.scss';
import { Button, TextInput, Select } from '@mantine/core';
import { courseCreateSchema, courseUpdateSchema } from '@/lib/schemas';
import { Form } from '@/components/forms/Form';
import { DatePickerInput } from '@mantine/dates';
import { Dropzone } from '@mantine/dropzone';
import { format } from 'date-fns';
import { CourseType } from '@/lib/controller/course';
import { useState } from 'react';
import { useDatoCmsFileUpload } from './hooks/useDatoCmsFileUpload';
import { TipTapEditor } from './components/TipTapEditor';
import { formatDateInput } from '@/lib/utils';

export type MemberNewCourseFormProps = {
	course?: CourseType;
	allWorkshops: AllWorkshopsQuery['allWorkshops'];
};

export function MemberCourseForm({ course, allWorkshops }: MemberNewCourseFormProps) {
	const [file, setFile] = useState<File | null>(null);
	const { upload, uploading, error, progress, state, image, reset } = useDatoCmsFileUpload({
		file,
		locale: 'sv' as SiteLocale,
	});

	const today = new Date();
	const initialValues = courseCreateSchema.keyof().options.reduce(
		(acc, key) => {
			typeof acc[key] === 'undefined' && (acc[key] = '');
			return acc;
		},
		{
			...course,
			start: formatDateInput(course?.start ?? today),
			end: formatDateInput(course?.end ?? today),
		} as any
	);

	return (
		<Form
			endpoint={course ? `/api/member/course/${course.id}` : '/api/member/course'}
			method={course ? 'PATCH' : 'POST'}
			schema={course ? courseUpdateSchema : courseCreateSchema}
			initialValues={initialValues}
			fields={({ form, submitting }) => (
				<>
					<TextInput withAsterisk label='Titel' {...form.getInputProps('title')} />
					<TipTapEditor
						label='Introduction'
						transform='structured'
						withAsterisk={true}
						{...form.getInputProps('intro')}
					/>
					<DatePickerInput label='Startdatum' name='start' variant={'unstyled'} {...form.getInputProps('start')} />
					<DatePickerInput label='Slutdatum' name='end' variant={'unstyled'} {...form.getInputProps('end')} />
					<TextInput withAsterisk label='Pris' type='number' {...form.getInputProps('price')} />
					<Select
						label='Verkstad'
						placeholder='Välj verkstad'
						data={allWorkshops.map(({ id: value, title: label }) => ({ value, label: label ?? '' }))}
						{...form.getInputProps('workshop')}
					/>
					<Dropzone
						onDrop={(files) => setFile(files[0] ?? null)}
						onReject={(files) => console.log('rejected files', files)}
						accept={['image/png', 'image/jpeg', 'image/jpg']}
						maxSize={5 * 1024 ** 2}
					>
						<div>Dra och släpp bilder här eller klicka för att välja bild</div>
						<div>
							{uploading && progress && state !== 'CREATING_UPLOAD_OBJECT' && <div>Laddar upp {progress}%</div>}
						</div>
						<div>{uploading && progress && state === 'CREATING_UPLOAD_OBJECT' && <div>Bearbetar bilden...</div>}</div>
						{image && <img className={s.image} src={image.src} />}
					</Dropzone>
					<TextInput type='hidden' {...form.getInputProps('image')} value={upload?.id} style={{ display: 'none' }} />
					<Button type='submit' disabled={submitting || !form.isDirty()} loading={submitting}>
						Skicka in
					</Button>
				</>
			)}
		/>
	);
}
