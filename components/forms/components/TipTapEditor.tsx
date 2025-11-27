import s from './TipTapEditor.module.scss';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import { InputWrapper } from '@mantine/core';
import { htmlToStructuredText } from 'datocms-html-to-structured-text';
import { render as structuredTextToHtml } from 'datocms-structured-text-to-html-string';

export type TipTapEditorProps = {
	value?: string;
	label?: string;
	withAsterisk?: boolean;
	transform: 'markdown' | 'structured';
	toolbar?: boolean;
	onChange?: (value: any) => void;
	[key: string]: any;
};

export function TipTapEditor(props: TipTapEditorProps) {
	const { value, label, withAsterisk, transform, toolbar, onChange, id } = props;
	const editor = useEditor({
		shouldRerenderOnTransaction: true,
		extensions: [StarterKit.configure({}), Highlight],
		immediatelyRender: false,
		content: transform === 'markdown' || !value ? value : structuredTextToHtml(value as any),
		onUpdate: ({ editor }) => {
			const html = editor.getHTML();
			if (transform === 'markdown') {
				onChange?.(html);
				return;
			} else if (transform === 'structured') {
				htmlToStructuredText(editor.getHTML()).then((content) => {
					onChange?.(content);
				});
			}
		},
	});

	return (
		<InputWrapper data-p label={label} withAsterisk={withAsterisk}>
			<RichTextEditor editor={editor} className={s.editor}>
				<RichTextEditor.Toolbar sticky stickyOffset='var(--docs-header-height)' className={s.toolbar}>
					<RichTextEditor.ControlsGroup>
						<RichTextEditor.H2 />
						<RichTextEditor.Bold />
						<RichTextEditor.Italic />
						<RichTextEditor.ClearFormatting />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.BulletList />
						<RichTextEditor.OrderedList />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.Link />
						<RichTextEditor.Unlink />
					</RichTextEditor.ControlsGroup>
				</RichTextEditor.Toolbar>
				<RichTextEditor.Content className={s.content} />
			</RichTextEditor>
		</InputWrapper>
	);
}
