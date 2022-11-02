// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';
import { chainProperties } from 'src/global/networkConstants';
import { LoadingStatusType } from 'src/types';
import getNetwork from 'src/util/getNetwork';

interface Props {
	className?: string
	deposit: string
	loadingStatus: LoadingStatusType
	seconds: number
}

const ProposalVoteInfo = ({ className, deposit, loadingStatus, seconds }:  Props) => {
	const currentNetwork = getNetwork();

	return (
		<Spin spinning={loadingStatus.isLoading} indicator={<LoadingOutlined />}>
			<div className={className}>
				<div className='font-medium text-sidebarBlue'>
					<div className="flex justify-between mb-5">
						<h6>Deposit</h6>
						<div className='text-navBlue'>{deposit}</div>
					</div>

					<div className="flex justify-between mb-5">
						<h6>Endorsed by</h6>
						<div className='text-navBlue'>{seconds ? <div>{seconds} addresses</div> : null}</div>
					</div>

					<div className="flex justify-between mb-5">
						<h6>Locked {chainProperties[currentNetwork].tokenSymbol}</h6>
						<div className='text-navBlue'>{seconds * parseInt(deposit.split(' ')[0]) || 0}</div>
					</div>
				</div>
			</div>
		</Spin>
	);
};

export default ProposalVoteInfo;
