// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import React, { FC } from 'react';
import chainLogo from 'src/assets/parachain-logos/chain-logo.jpg';
import { chainProperties, network } from 'src/global/networkConstants';
import getNetwork from 'src/util/getNetwork';

const dropdownMenuItems = [];
const currentNetwork = getNetwork();

for (const key of Object.keys(network)) {
	const keyVal = network[key as keyof typeof network];
	const link = ['MOONBASE', 'MOONRIVER', 'MOONBEAM', 'KILT'].includes(key) ? `https://${key}.polkassembly.network` : `https://${key}.polkassembly.io`;
	const optionObj = {
		key,
		label: <a href={link} className='flex items-center my-2'>
			<img
				className='w-10 h-10 mr-3 rounded-full'
				src={chainProperties[keyVal]?.logo ? chainProperties[keyVal].logo : chainLogo}
				alt='Logo'
			/>
			<span className='capitalize'> {keyVal == 'hydradx' ? 'HydraDX' : keyVal} </span>
		</a>
	};

	dropdownMenuItems.push(optionObj);
}

const menu = <Menu className='max-h-96 overflow-y-auto' items={dropdownMenuItems} />;

const NetworkDropdown: FC<{setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>}> = ({ setSidebarCollapsed }) => {
	return (
		<Dropdown overlay={menu} trigger={['click']}>
			<a className='flex items-center justify-between text-navBlue hover:text-pink_primary' onClick={e => {
				e.preventDefault();
				setSidebarCollapsed(true);
			}}
			>
				<img
					className='w-[20px] h-[20px] mr-2 rounded-full'
					src={chainProperties[currentNetwork]?.logo ? chainProperties[currentNetwork].logo : chainLogo}
					alt='Logo'
				/>
				<span className='mr-2 capitalize font-medium hidden md:inline-block'>{currentNetwork == 'hydradx' ? 'HydraDX' : currentNetwork}</span>
				<DownOutlined />
			</a>
		</Dropdown>
	);
};

export default NetworkDropdown;