// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Divider } from 'antd';
import React from 'react';
import { Wallet } from 'src/types';

import { ReactComponent as NovaWalletIcon } from '../../assets/wallet/nova-wallet-star.svg';
import { ReactComponent as PolkadotJSIcon } from '../../assets/wallet/polkadotjs-icon.svg';
import { ReactComponent as SubWalletIcon } from '../../assets/wallet/subwallet-icon.svg';
import { ReactComponent as TalismanIcon } from '../../assets/wallet/talisman-icon.svg';
import WalletButton from '../WalletButton';

interface Props {
	disabled: boolean
	onWalletSelect: (wallet: Wallet) => void
}

const WalletButtons = ({ onWalletSelect, disabled } : Props) => {
	function handleWalletClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, wallet: Wallet) {
		event.preventDefault();
		onWalletSelect(wallet);
	}

	return (
		<div className='w-full'>
			<div className='flex items-center gap-x-2'>
				<Divider className='text-grey_primary'>Or Login with</Divider>
			</div>
			<div className="flex mt-3 max-w-xs gap-4 flex-col m-auto justify-center sm:flex-row sm:mx-2 sm:max-w-none">
				<WalletButton disabled={disabled} onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleWalletClick(event, Wallet.POLKADOT)} name="Polkadot.js" icon={<PolkadotJSIcon />} />
				<WalletButton disabled={disabled} onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleWalletClick(event, Wallet.TALISMAN)} name="Talisman" icon={<TalismanIcon />} />
				<WalletButton disabled={disabled} onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleWalletClick(event, Wallet.SUBWALLET)} name="SubWallet" icon={<SubWalletIcon />} />
				{
					(window as any).walletExtension?.isNovaWallet &&
					<WalletButton disabled={disabled} onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleWalletClick(event, Wallet.NOVAWALLET)} name="Nova Wallet" icon={<NovaWalletIcon />} />
				}
			</div>
		</div>
	);
};

export default WalletButtons;