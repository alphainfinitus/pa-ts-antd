// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import { Form, Input } from 'antd';
import BN from 'bn.js';
import React, { useState } from 'react';

import { inputToBn } from '../util/inputToBn';
import HelperTooltip from './HelperTooltip';

interface Props{
	className?: string
	label?: string
	helpText?: string
	onChange: (balance: BN) => void
	placeholder?: string
}

const BalanceInput = ({ className, label = '', helpText = '', onChange, placeholder = '' }: Props) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [isValidInput, setIsValidInput] = useState(true);
	const onBalanceChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const [balance, isValid] = inputToBn(event.currentTarget.value, false);
		setIsValidInput(isValid);

		if(isValid){
			onChange(balance);
		}
	};

	return <Form.Item className={className} >
		<label>
			{label}
			{helpText && <HelperTooltip text={helpText}/> }
		</label>
		<Input
			className={'balanceInput'}
			// invalid={isValidInput}
			onChange={onBalanceChange}
			placeholder={placeholder}
			type='number'
		/>
	</Form.Item>;
};

export default styled(BalanceInput)`
	label {
		display: flex !important;
    align-items: center !important;
	}

	.ui.selection.dropdown {
		border-color: grey_light;
	}
`;
