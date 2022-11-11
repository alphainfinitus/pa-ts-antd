// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DislikeFilled, LikeFilled } from '@ant-design/icons';
import { Divider, Progress } from 'antd';
import React, { useEffect, useState } from 'react';
import useCurrentBlock from 'src/hooks/useCurrentBlock';
import GovSidebarCard from 'src/ui-components/GovSidebarCard';
import HelperTooltip from 'src/ui-components/HelperTooltip';

import { PollVotesQuery, useCouncilAtBlockNumberQuery } from '../../../generated/graphql';
import { CouncilVote, Vote } from '../../../types';
import Address from '../../../ui-components/Address';
import getDefaultAddressField from '../../../util/getDefaultAddressField';
import getEncodedAddress from '../../../util/getEncodedAddress';

interface Props {
	className?: string
	data?: PollVotesQuery | undefined
	endBlock: number
}

const CouncilSignals = ({ className, endBlock, data }: Props) => {
	const [ayes, setAyes] = useState(0);
	const [nays, setNays] = useState(0);
	const [memberSet, setMemberSet] = useState<Set<string>>(new Set<string>());
	const [councilVotes, setCouncilVotes] = useState<CouncilVote[]>([]);
	const currentBlockNumber = useCurrentBlock()?.toNumber() || endBlock;

	const councilAtPollEndBlockNumber = useCouncilAtBlockNumberQuery({ variables: { blockNumber: endBlock } });
	const councilAtCurrentBlockNumber = useCouncilAtBlockNumberQuery({ variables: { blockNumber: currentBlockNumber } });

	const getCouncilMembers = (councilAtBlockNumber: any): Set<string> => {
		const memberSet = new Set<string>();
		councilAtBlockNumber?.data?.councils?.[0]?.members?.forEach((member: any) => {
			const address = getEncodedAddress(member.address);
			if (address) {
				memberSet.add(address);
			}
		});
		return memberSet;
	};

	useEffect(() => {
		const pollClosingBlockNumber = endBlock;
		let memberSet = new Set<string>();

		if (pollClosingBlockNumber > currentBlockNumber) {
			memberSet = getCouncilMembers(councilAtCurrentBlockNumber);
		} else {
			memberSet = getCouncilMembers(councilAtPollEndBlockNumber);
		}

		setMemberSet(memberSet);
	}, [endBlock, currentBlockNumber, councilAtPollEndBlockNumber, councilAtCurrentBlockNumber]);

	useEffect(() => {
		let ayes = 0;
		let nays = 0;
		const defaultAddressField = getDefaultAddressField();
		const councilVotes: CouncilVote[]  = [];

		data?.poll_votes?.forEach(({ vote, voter }) => {
			const defaultAddress = voter?.[defaultAddressField];

			if (defaultAddress && memberSet.has(defaultAddress)) {
				const address = getEncodedAddress(defaultAddress);
				if (address) {
					councilVotes.push({
						address,
						vote
					});
				}

				if (vote === Vote.AYE) {
					ayes++;
				}

				if (vote === Vote.NAY) {
					nays++;
				}
			}
		});

		setAyes(ayes);
		setNays(nays);
		setCouncilVotes(councilVotes);
	}, [data, memberSet]);

	return (
		<GovSidebarCard className={className}>
			<h3 className='flex items-center'><span className='mr-2 dashboard-heading'>Council Signals</span> <HelperTooltip text='This represents the off-chain votes of council members'/></h3>

			<div className="mt-6 flex">
				<div>
					<Progress
						percent={100}
						success={{ percent: (ayes/(ayes + nays)) * 100, strokeColor: '#2ED47A' }}
						type="circle"
						strokeWidth={12}
						strokeColor='#FF3C5F'
						format={() => (
							ayes && nays ? <div className='text-sm'>
								<div className='text-green-400 border-b border-b-gray-400 mx-10'>{((ayes/(ayes + nays)) * 100).toFixed(1)}%</div>
								<div className='text-pink_primary'>{((nays/(ayes + nays)) * 100).toFixed(1)}%</div>
							</div> : <div className='text-sm'>No Votes</div>
						)}
					/>
				</div>

				<div className='flex-1 flex flex-col justify-between ml-12 py-5'>
					<div className='mb-auto flex items-center'>
						<div className='mr-auto text-sidebarBlue font-medium'>Aye</div>
						<div className='text-navBlue'>{ayes}</div>
					</div>

					<div className='flex items-center'>
						<div className='mr-auto text-sidebarBlue font-medium'>Nay</div>
						<div className='text-navBlue'>{nays}</div>
					</div>
				</div>
			</div>

			{councilVotes.length > 0 && <div>
				<Divider />
				{councilVotes.map(councilVote =>
					<div className='flex items-center px-12 mt-3' key={councilVote.address}>
						<div className='mr-auto'>
							<Address address={councilVote.address} />
						</div>
						<div>
							{councilVote.vote === Vote.AYE ? <>
								<div className='flex items-center'>
									<LikeFilled className='mr-4 text-pink_primary' />
									Aye
								</div>
							</> : <>
								<div className='flex items-center'>
									<DislikeFilled className='mr-4 text-green-400' />
									Nay
								</div>
							</>}
						</div>
					</div>
				)}
			</div>}
		</GovSidebarCard>
	);
};

export default CouncilSignals;
