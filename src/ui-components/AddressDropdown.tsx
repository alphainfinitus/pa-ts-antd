// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { DownOutlined } from '@ant-design/icons';
import { InjectedAccount } from '@polkadot/extension-inject/types';
import { Dropdown, Menu } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import React, { useState } from 'react';
import Address from 'src/ui-components/Address';

interface Props {
  accounts: InjectedAccount[];
  className?: string;
  defaultAddress: string
  filterAccounts?: string[]
  onAccountChange: (
    event: React.SyntheticEvent<HTMLElement, Event>,
    address: string
  ) => void;
}

const AddressDropdown = ({
	className = 'px-4 py-2 border-2 rounded-md',
	accounts, defaultAddress, filterAccounts, onAccountChange
}: Props) => {
	const [selectedAddress, setSelectedAddress] = useState(() => defaultAddress);
	const filteredAccounts = !filterAccounts
		? accounts
		: accounts.filter( elem =>
			filterAccounts.includes(elem.address)
		);

	const dropdownList: {[index: string]: string} = {};
	const addressItems: ItemType[] = [];

	filteredAccounts.forEach(account => {
		addressItems.push({
			key: account.address,
			label: (
				<Address extensionName={account.name} address={account.address} />
			)
		});

		if (account.address && account.name){
			dropdownList[account.address] = account.name;
		}
	}
	);
	return (
		<Dropdown
			trigger={['click']}
			className={className}
			overlay={
				<Menu
					onClick={(e) => {
						setSelectedAddress(e.key);
						onAccountChange(e.domEvent, e.key);
					}}
					items={addressItems}
				/>
			}
		>
			<div className="flex justify-between items-center">
				<Address
					extensionName={dropdownList[selectedAddress]}
					address={selectedAddress}
				/>
				<span>
					<DownOutlined />
				</span>
			</div>
		</Dropdown>
	);
};

export default AddressDropdown;
