// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Editor } from '@tinymce/tinymce-react';
import React from 'react';
import showdown from 'showdown';

const converter = new showdown.Converter();

export interface Props {
	className?: string
	height?: number
	onChange:  ((value: string) => void) | undefined
	value: string
	name?:string
}

function MarkdownEditor({ className, value, onChange, height }: Props): React.ReactElement {

	return (
		<div className={className}>
			<Editor
				apiKey={process.env.REACT_APP_EDITOR_API_KEY}
				value={converter.makeHtml(value)}
				onEditorChange={onChange}
				onBlur={() => {
					if (onChange) {
						onChange(value);
					}
				}}
				init={{
					branding: false,
					content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
					directionality: 'ltr',
					height: height,
					menubar: false,
					plugins: [
						'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
						'searchreplace', 'visualblocks', 'code', 'fullscreen',
						'insertdatetime', 'media', 'table'
					],
					toolbar: 'undo redo | ' + 'link preview | ' + 'code image | ' +
							'bold italic backcolor | alignleft aligncenter ' +
							'alignright alignjustify | bullist numlist outdent indent | ' +
							'removeformat | table help '
				}}
			/>
		</div>
	);
}

export default MarkdownEditor;