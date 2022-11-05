// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import 'react-big-calendar/lib/css/react-big-calendar.css';

import { DownOutlined } from '@ant-design/icons';
import { MenuProps, Space } from 'antd';
import { Dropdown } from 'antd';
import React, { useState } from 'react';
import chainLogo from 'src/assets/parachain-logos/chain-logo.jpg';
import { chainProperties, network } from 'src/global/networkConstants';
import styled from 'styled-components';

function NetworkSelect({ selectedNetwork, setSelectedNetwork }: {selectedNetwork:string, setSelectedNetwork: React.Dispatch<React.SetStateAction<string>>}) {
	const StyledDiv = styled.div`
    display: flex;
    align-items: center;
    text-transform: capitalize;

    img {
			width: 22px;
			border-radius: 50%;
			margin-right: 0.5rem;
    }
`;

	const StyledNetworkItem = ({ className, showNetwork }: {className?: string,showNetwork: string}) => {
		return <StyledDiv className={className}>
			<img
				src={chainProperties[showNetwork]?.logo ? chainProperties[showNetwork].logo : chainLogo}
				alt={showNetwork}
			/>
			{showNetwork}
		</StyledDiv>;
	};

	const networkOptions: MenuProps['items'] = [];
	for (const key of Object.keys(network)) {
		const optionObj = {
			key: network[key as keyof typeof network],
			label: <StyledNetworkItem showNetwork={network[key as keyof typeof network]} />
		};

		networkOptions.push(optionObj);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [selectedNetworkToolbar, setSelectedNetworkToolbar] = useState<any>(selectedNetwork);

	const handleSetSelectedNetwork : MenuProps['onClick'] = ({ key }) => {
		setSelectedNetworkToolbar(key);
		setSelectedNetwork(`${key}`);
	};

	return (
		<div className='select-div filter-by-chain-div'>
			<label>Filter by</label>
			<Dropdown trigger={['click']} dropdownRender={menus => (<div className='max-h-[20rem] rounded-md drop-shadow-xl overflow-auto'>{menus}</div>)} menu={{ items:networkOptions, onClick:handleSetSelectedNetwork }} ><Space className='cursor-pointer'><StyledNetworkItem className='text-pink_primary' showNetwork={selectedNetwork}/><DownOutlined className='text-pink_primary align-middle' /></Space></Dropdown>
		</div>
	);
}

export default NetworkSelect;
