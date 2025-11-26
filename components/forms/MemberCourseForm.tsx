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

					<div className='one'>
						<TipTapEditor
							label='Introduktion'
							transform='structured'
							withAsterisk={true}
							toolbar={true}
							{...form.getInputProps('intro')}
						/>
					</div>
					<DatePickerInput label='Startdatum' name='start' className={s.date} {...form.getInputProps('start')} />
					<DatePickerInput label='Slutdatum' name='end' className={s.date} {...form.getInputProps('end')} />

					<div className='one'>
						<TipTapEditor
							label='Om kursen'
							transform='structured'
							withAsterisk={true}
							{...form.getInputProps('text_about')}
						/>
					</div>
					<div className='one'>
						<TipTapEditor
							label='Om kursens mål'
							transform='structured'
							withAsterisk={true}
							{...form.getInputProps('text_target_group')}
						/>
					</div>

					<div className='one'>
						<TipTapEditor
							label='Inkluderat'
							transform='structured'
							withAsterisk={true}
							{...form.getInputProps('included')}
						/>
					</div>
					<div className='one'>
						<TipTapEditor
							label='Om arrangören'
							transform='structured'
							withAsterisk={true}
							{...form.getInputProps('about_organizer')}
						/>
					</div>
					<TextInput withAsterisk label='Arrangör Url' {...form.getInputProps('organizer_url')} />
					<TextInput withAsterisk label='Amount?' type='number' {...form.getInputProps('amount')} />
					<TextInput withAsterisk label='Pris' type='number' {...form.getInputProps('price')} />
					<TextInput withAsterisk label='Språk' {...form.getInputProps('language')} />
					<Select
						label='Verkstad'
						placeholder='Välj verkstad'
						data={allWorkshops.map(({ id: value, title: label }) => ({ value, label: label ?? '' }))}
						{...form.getInputProps('workshop')}
					/>
					<div className='one'>
						<Dropzone
							className={s.drop}
							onDrop={(files) => setFile(files[0] ?? null)}
							onReject={(files) => console.log('rejected files', files)}
							accept={['image/png', 'image/jpeg', 'image/jpg']}
							maxSize={5 * 1024 ** 2}
						>
							<div className={s.message}>
								<div className={s.wrap}>
									{state === 'CREATING_UPLOAD_OBJECT' ? (
										<>Bearbetar bilden...</>
									) : state === 'UPLOADING_FILE' ? (
										<>Laddar upp: {progress}%</>
									) : (
										<>Dra och släpp bild eller klicka för att välja bild</>
									)}
								</div>
							</div>

							{image && <img className={s.image} src={image.src} />}
						</Dropzone>
					</div>
					<TextInput type='hidden' {...form.getInputProps('image')} value={upload?.id} style={{ display: 'none' }} />
					<Button type='submit' disabled={submitting || !form.isDirty()} loading={submitting}>
						Skicka in
					</Button>
				</>
			)}
		/>
	);
}
