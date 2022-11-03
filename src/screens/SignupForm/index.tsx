// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Col, Row } from 'antd';
import React, { useState } from 'react';
import Web2Signup from 'src/components/Signup/Web2Signup';
import Web3Signup from 'src/components/Signup/Web3Signup';
import { Wallet } from 'src/types';

const Signup = () => {
	const [displayWeb, setDisplayWeb] = useState(2);
	const [chosenWallet, setChosenWallet] = useState<Wallet>();
	const [walletError, setWalletError] =  useState<string | undefined>();

	const setDisplayWeb2 = () => setDisplayWeb(2);

	const onWalletSelect = (wallet: Wallet) => {
		setChosenWallet(wallet);
		setDisplayWeb(3);
	};

	return (
		<>
			<Row justify='center' align='middle' className='h-full -mt-5'>
				<Col className='min-w-full sm:min-w-[500px]'>
					{ displayWeb === 2
						? <Web2Signup onWalletSelect={onWalletSelect} walletError={walletError} /> : null}

					{displayWeb === 3 && chosenWallet ? <Web3Signup chosenWallet={chosenWallet} setDisplayWeb2={setDisplayWeb2} setWalletError={setWalletError} /> : null}
				</Col>
			</Row>
		</>
	);
};

export default Signup;
