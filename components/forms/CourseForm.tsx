'use client';

import s from './CourseForm.module.scss';
import { TextInput, Select } from '@mantine/core';
import { courseCreateFormSchema, courseUpdateFormSchema } from '@/lib/schemas/course';
import { Form } from '@/components/forms/Form';
import { DateTimePicker } from '@mantine/dates';
import { CourseTypeWithImage } from '@/lib/controllers/course';
import { useEffect, useRef, useState } from 'react';
import { TipTapEditor } from './components/TipTapEditor';
import { createInitialFormValues, formatDateInput } from '@/lib/utils';
import { ImageUpload } from '@/components/forms/components/ImageUpload';
import { Upload } from '@datocms/cma-client/dist/types/generated/ApiTypes';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { useRouter } from 'next/navigation';

export type MemberNewCourseFormProps = {
	course?: CourseTypeWithImage;
	allWorkshops: AllWorkshopsQuery['allWorkshops'];
};

export function CourseForm({ course, allWorkshops }: MemberNewCourseFormProps) {
	const schema = course ? courseUpdateFormSchema : courseCreateFormSchema;
	const today = new Date();
	const initialValues = createInitialFormValues(schema, {
		...course,
		image: course?.image?.id,
		start: new Date(course?.start ?? today),
		end: new Date(course?.end ?? today),
	});
	const router = useRouter();
	const [upload, setUpload] = useState<Upload | null>(null);
	const formRef = useRef<any | null>(null);

	useEffect(() => {
		upload && formRef.current?.setFieldValue('image', { upload_id: upload.id });
	}, [upload]);

	return (
		<Form
			ref={formRef}
			endpoint={course ? `/api/member/course/${course.id}` : '/api/member/course'}
			method={course ? 'PATCH' : 'POST'}
			schema={schema}
			initialValues={initialValues}
			onSubmitted={(data) => !course?.id && router.replace(`/medlem/kurser/${data.id}`)}
			fields={({ form, submitting, submitted }) => (
				<>
					<TextInput withAsterisk label='Titel' {...form.getInputProps('title')} />
					<div className='one'>
						<TipTapEditor
							label='Introduktion'
							transform='structured'
							withAsterisk={true}
							{...form.getInputProps('intro')}
						/>
					</div>
					<DateTimePicker label='Startdatum' name='start' className={s.date} {...form.getInputProps('start')} />
					<DateTimePicker label='Slutdatum' name='end' className={s.date} {...form.getInputProps('end')} />
					<div className='one'>
						<TipTapEditor
							label='Om kursen'
							transform='structured'
							withAsterisk={true}
							{...form.getInputProps('about')}
						/>
					</div>
					<div className='one'>
						<TipTapEditor
							label='Målgrupp'
							transform='structured'
							withAsterisk={true}
							{...form.getInputProps('target_group')}
						/>
					</div>
					<div className='one'>
						<TipTapEditor
							label='Kursens mål'
							transform='structured'
							withAsterisk={true}
							{...form.getInputProps('goal')}
						/>
					</div>
					<div className='one'>
						<TextInput label='Inkluderat' {...form.getInputProps('included')} />
					</div>
					<div className='one'>
						<TipTapEditor
							label='Om arrangören'
							transform='structured'
							withAsterisk={true}
							{...form.getInputProps('about_organizer')}
						/>
					</div>
					<TextInput label='Arrangör Url' {...form.getInputProps('organizer_link')} />
					<TextInput label='Belopp' type='number' {...form.getInputProps('amount')} />
					<TextInput withAsterisk label='Pris' type='number' {...form.getInputProps('price')} />
					<TextInput label='Språk' {...form.getInputProps('language')} />
					<Select
						label='Verkstad'
						placeholder='Välj verkstad'
						data={allWorkshops.map(({ id: value, title: label }) => ({ value, label: label ?? '' }))}
						{...form.getInputProps('workshop')}
					/>
					<div className='one'>
						<ImageUpload id='image' image={course?.image} onUpload={setUpload} {...form.getInputProps('image')} />
					</div>
					<SubmitButton loading={submitting} submitted={submitted}>
						{submitted ? 'Sparad' : 'Spara'}
					</SubmitButton>
				</>
			)}
		/>
	);
}
