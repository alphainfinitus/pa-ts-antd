// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import { Wallet } from 'src/types';

interface Props {
	chosenWallet: Wallet
	setDisplayWeb2: () => void
	setWalletError: React.Dispatch<React.SetStateAction<string | undefined>>
}
const Web3Login:FC<Props> = () => {
	return (
		<div>Web3Login</div>
	);
};

export default Web3Login;