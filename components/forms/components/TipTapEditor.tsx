'use client';

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
	onChange?: (value: any) => void;
	[key: string]: any;
};

export function TipTapEditor(props: TipTapEditorProps) {
	const { value, label, withAsterisk, transform } = props;

	const editor = useEditor({
		shouldRerenderOnTransaction: true,
		extensions: [StarterKit.configure({}), Link, Highlight],
		immediatelyRender: false,
		content: transform === 'markdown' || !value ? value : structuredTextToHtml(value as any),
		onUpdate: ({ editor }) => {
			const html = editor.getHTML();
			if (transform === 'markdown') {
				props?.onChange?.(html);
				return;
			} else if (transform === 'structured') {
				htmlToStructuredText(editor.getHTML()).then((content) => {
					props?.onChange?.(content);
				});
			}
		},
	});

	return (
		<InputWrapper label={label} withAsterisk={withAsterisk}>
			<RichTextEditor editor={editor}>
				<RichTextEditor.Toolbar sticky stickyOffset='var(--docs-header-height)'>
					<RichTextEditor.ControlsGroup>
						<RichTextEditor.H2 />
						<RichTextEditor.Bold />
						<RichTextEditor.Italic />
						<RichTextEditor.Underline />
						<RichTextEditor.Strikethrough />
						<RichTextEditor.ClearFormatting />
						<RichTextEditor.Highlight />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.BulletList />
						<RichTextEditor.OrderedList />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.Link />
						<RichTextEditor.Unlink />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.Undo />
						<RichTextEditor.Redo />
					</RichTextEditor.ControlsGroup>
				</RichTextEditor.Toolbar>

				<RichTextEditor.Content />
			</RichTextEditor>
		</InputWrapper>
	);
}
