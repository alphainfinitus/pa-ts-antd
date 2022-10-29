// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Web2Login from 'src/components/Login/Web2Login';
import Web3Login from 'src/components/Login/Web3Login';
import { useUserDetailsContext } from 'src/context';
import { Wallet } from 'src/types';

const Login = () => {
	const currentUser = useUserDetailsContext();
	const navigate = useNavigate();
	const [displayWeb, setDisplayWeb] = useState(2);
	const [chosenWallet, setChosenWallet] = useState<Wallet>();
	const [walletError, setWalletError] =  useState<string | undefined>();

	const setDisplayWeb2 = () => setDisplayWeb(2);

	const onWalletSelect = (wallet: Wallet) => {
		setChosenWallet(wallet);
		setDisplayWeb(3);
	};

	useEffect(() => {
		if (currentUser?.id) {
			navigate('/');
		}
	}, [currentUser?.id, navigate]);
	return (
		<Row justify='center' align='middle' className='h-full -mt-5'>
			<Col className='min-w-full sm:min-w-[500px]'>
				{displayWeb === 2 ? (
					<Web2Login onWalletSelect={onWalletSelect} walletError={walletError} />
				) : null}

				{displayWeb === 3 && chosenWallet ? (
					<Web3Login
						chosenWallet={chosenWallet}
						setDisplayWeb2={setDisplayWeb2}
						setWalletError={setWalletError}
					/>
				) : null}
			</Col>
		</Row>
	);
};

export default Login;