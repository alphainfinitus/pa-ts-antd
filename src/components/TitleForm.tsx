// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import { Form } from 'antd';
import React from 'react';

import messages from '../util/messages';

interface Props {
	className?: string
	errorTitle?: any
	onChange?: any
	value?: string
}

const TitleForm = ({ className, errorTitle, onChange, value = '' }:Props): JSX.Element => {

	return (
		<div className={className}>
			<Form>
				<Form.Item >
					<label>Title</label>
					<input
						className={errorTitle ? ' border-red_secondary text-[1.4rem]' : 'text-[1.4rem]'}
						name={'title'}
						onChange={onChange}
						placeholder='Your title...'
						type='text'
						value={value}
					/>
					{errorTitle && <span className={' text-red_secondary'}>{messages.VALIDATION_TITLE_ERROR}</span>}
				</Form.Item>
			</Form>
		</div>
	);
};

export default styled(TitleForm)`
	.fields {
		padding: 0;
	}
`;
