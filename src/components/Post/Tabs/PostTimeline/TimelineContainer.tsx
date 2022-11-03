// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ClockCircleOutlined } from '@ant-design/icons';
import { Timeline } from 'antd';
import BN from 'bn.js';
import * as React from 'react';
import { useBlockTime, useCurrentBlock } from 'src/hooks';
import StatusTag from 'src/ui-components/StatusTag';
import blockToTime from 'src/util/blockToTime';
import getNetwork from 'src/util/getNetwork';

const NETWORK = getNetwork();

interface BlockStatus {
	blockNumber: number
	status: string
}

interface Props {
	className?: string
	statuses: BlockStatus[]
}

function sortfunc(a: BlockStatus, b: BlockStatus) {
	return a.blockNumber - b.blockNumber;
}

const TimelineContainer = ({ className, statuses }: Props) => {
	const { blocktime } = useBlockTime();
	const ZERO = new BN(0);
	const currentBlock = useCurrentBlock() || ZERO;

	const StatusDiv = ({ status, position } : { status: string, position: string }) => {
		return (
			<div className={`${position === 'left' ? 'flex-row-reverse ml-4 -mr-[70px] lg:-mr-[94px]' : 'mr-4 -ml-[70px] lg:-ml-[94px]'} flex items-center`}>
				<div className="h-[2px] bg-gray-200 w-[20px] lg:w-[40px]" />
				<StatusTag colorInverted={true} status={status}/>
			</div>
		);
	};

	const TimelineItems = (isMobile:boolean) =>
		statuses.sort(sortfunc).map(({ blockNumber, status }, index) => (
			<Timeline.Item key={status}>
				<div className={`${(index+1) % 2 == 0 && !isMobile ? 'mr-6 lg:mr-14 ml-auto' : 'ml-6 lg:ml-12'} bg-white rounded-md border border-gray-200 p-6 max-w-[450px]`}>
					<div className="flex items-start justify-between max-w-[400px]">
						{
							((index+1) % 2 != 0 || isMobile) && <StatusDiv status={status} position={'right'} />
						}

						<div className='text-sm'>
							<div className='flex items-center mb-4'>
								Block:
								<a className='text-pink_primary ml-2' href={`https://${NETWORK}.subscan.io/block/${blockNumber}`} target='_blank' rel="noreferrer">
									#{`${blockNumber} `}
								</a>
							</div>
							<div>
								{currentBlock.toNumber() &&
									<div className='flex items-center'><ClockCircleOutlined className='mr-2' /> {blockToTime(currentBlock.toNumber() - blockNumber, blocktime)} ago</div>
								}
							</div>
						</div>

						{
							((index+1) % 2 == 0 && !isMobile) && <StatusDiv status={status} position={'left'} />
						}
					</div>
				</div>
			</Timeline.Item>
		));

	return (
		<div className={className}>
			<div className="hidden xl:block">
				<Timeline mode="alternate">
					{TimelineItems(false)}
					<Timeline.Item></Timeline.Item>
				</Timeline>
			</div>

			<div className="block xl:hidden mx-auto">
				<Timeline mode="left">
					{TimelineItems(true)}
					<Timeline.Item></Timeline.Item>
				</Timeline>
			</div>
		</div>
	);
};

export default TimelineContainer;
