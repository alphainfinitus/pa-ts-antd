// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CaretDownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Divider, Progress, Tooltip } from 'antd';
import React from 'react';

const TreasuryOverview = () => {
	return (
		<div className="grid grid-rows-2 grid-flow-col gap-4 lg:gap-0 lg:flex">
			{/* Available */}
			<div className="flex-1 lg:mr-10 bg-white drop-shadow-md p-3 lg:p-6 rounded-md">
				<div className="text-navBlue text-xs flex items-center">
					<span className="mr-2">
						Available
					</span>

					<Tooltip color='#000' title='Funds collected through a portion of block production rewards, transaction fees, slashing, staking inefficiencies, etc.'>
						<InfoCircleOutlined />
					</Tooltip>
				</div>
				<div className="mt-3 text-sidebarBlue font-medium">25.56 DOT</div>
				<Divider className='my-3' />
				<div>
					<span className='mr-2 text-sidebarBlue font-medium'>~ $1000</span>
				</div>
			</div>

			{/* CurrentPrice */}
			<div className="flex-1 lg:mr-10 bg-white drop-shadow-md p-3 lg:p-6 rounded-md">
				<div className="text-navBlue text-xs">Current Price of DOT</div>
				<div className="mt-3 text-sidebarBlue font-medium">$25.56</div>
				<Divider className='my-3' />
				<div className="flex items-center text-sidebarBlue font-medium">
					<span>Weekly <span className='hidden xl:inline-block'>Change</span></span><span className='ml-2'>12%</span>
					<CaretDownOutlined />
				</div>
			</div>

			{/* Spend Period */}
			<div className="flex-1 lg:mr-10 bg-white drop-shadow-md p-3 lg:p-6 rounded-md">
				<div className="text-navBlue text-xs flex items-center">
					<span className="mr-2">
						Spend Period Remaining
					</span>

					<Tooltip color='#000' title='Funds held in the treasury can be spent by making a spending proposal that, if approved by the Council, will enter a spend period before distribution, it is subject to governance, with the current default set to 24 days.'>
						<InfoCircleOutlined />
					</Tooltip>
				</div>

				<div className="mt-3 text-sidebarBlue font-medium">15 days</div>
				<Divider className='my-3' />
				<div>
					<Progress percent={30} strokeColor='#E5007A' size="small" />
				</div>
			</div>

			{/* Next Burn */}
			<div className="flex-1 bg-white drop-shadow-md p-3 lg:p-6 rounded-md">
				<div className="text-navBlue text-xs flex items-center">
					<span className="mr-2">
						Next Burn
					</span>

					<Tooltip color='#000' title='Funds held in the treasury can be spent by making a spending proposal that, if approved by the Council, will enter a spend period before distribution, it is subject to governance, with the current default set to 24 days.'>
						<InfoCircleOutlined />
					</Tooltip>
				</div>

				<div className="mt-3 text-sidebarBlue font-medium">375.67K DOT</div>
				<Divider className='my-3' />
				<div>
					<span className='mr-2 text-sidebarBlue font-medium'>~ $1000</span>
				</div>
			</div>
		</div>
	);
};

export default TreasuryOverview;