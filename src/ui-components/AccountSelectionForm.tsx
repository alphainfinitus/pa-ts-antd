// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccount } from '@polkadot/extension-inject/types';
import React from 'react';
import Balance from 'src/components/Balance';

import AddressDropdown from './AddressDropdown';
import HelperTooltip from './HelperTooltip';

interface Props{
	accounts: InjectedAccount[]
	address: string
	onAccountChange: (event: React.SyntheticEvent<HTMLElement, Event>, address: string) => void
	title: string
	withBalance?: boolean
}

const AccountSelectionForm = ({ accounts, address, onAccountChange, title, withBalance = false }: Props) =>
	<article className='w-full gap-y-2 flex flex-col'>
		<div className='flex items-center gap-x-2'>
			<h3 className='text-sm'>{title}</h3>
			<HelperTooltip text='You can choose an account from the extension.' />
		</div>
		<AddressDropdown
			accounts={accounts}
			defaultAddress={address || accounts[0]?.address}
			onAccountChange={onAccountChange}
		/>
		{withBalance &&
			<Balance address={address} />
		}
	</article>;

export default AccountSelectionForm;