// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Button } from 'antd';
import React from 'react';

interface Props {
	onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
	icon?: JSX.Element
	name: string
	disabled: boolean
}

const WalletButton = ({ disabled, onClick, icon }: Props) => {
	return (
		<Button className='flex items-center py-5 px-8 justify-center rounded-md' onClick={onClick} disabled={disabled}>
			<span>{icon}</span>
		</Button>
	);
};

export default WalletButton;