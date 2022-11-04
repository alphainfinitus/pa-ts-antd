// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DislikeFilled, LikeFilled } from '@ant-design/icons';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ApiContext } from 'src/context/ApiContext';
import GovSidebarCard from 'src/ui-components/GovSidebarCard';
import HelperTooltip from 'src/ui-components/HelperTooltip';
import getNetwork from 'src/util/getNetwork';

import { CouncilVote, Vote } from '../../../../types';
import Address from '../../../../ui-components/Address';

interface Props {
	className?: string
	motionId: number
}

const MotionVoteInfo = ({ className, motionId }: Props) => {
	const canFetch = useRef(true);
	const [councilVotes, setCouncilVotes] = useState<CouncilVote[]>([]);
	const { api, apiReady } = useContext(ApiContext);

	useEffect(() => {
		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		let unsubscribe: () => void;

		const councilVotes: CouncilVote[] = [];

		if(motionId == 284){

			api.derive.council.proposals((motions: any) => {
				const motion = motions.filter((mo: any) => mo.votes?.index.toNumber() === motionId)[0];

				if (!motion) {
					return;
				}

				motion.votes?.ayes.forEach((vote: any) => {
					councilVotes.push({
						address: vote.toString(),
						vote: Vote.AYE
					});
				});

				motion.votes?.nays.forEach((vote: any) => {
					councilVotes.push({
						address: vote.toString(),
						vote: Vote.NAY
					});
				});

				setCouncilVotes(councilVotes);
			}).then( unsub => {unsubscribe = unsub;})
				.catch(console.error);

			return () => unsubscribe && unsubscribe();
		}
		else{

			if (canFetch.current){
				fetch(`https://${getNetwork()}.api.subscan.io/api/scan/council/proposal`, { body: JSON.stringify({ proposal_id: motionId }), method: 'POST' }).then(async (res) => {
					try {
						const response = await res.json();
						const info = response?.data?.info;
						if (info) {
							const councilVotes: CouncilVote[] = [];

							info.votes.forEach((vote: any) => {
								councilVotes.push({
									address: vote?.account?.address || '',
									vote: vote?.passed ? Vote.AYE : Vote.NAY
								});
							});

							setCouncilVotes(councilVotes);
						}
					} catch (error) {
						console.error(error);
					}
				}).catch((error) => {
					console.error(error);
				});
			}
			canFetch.current = false;
		}
	},[api, apiReady, motionId]);

	if (!councilVotes.length) {
		return null;
	}

	return (
		<GovSidebarCard className={`${className} px-1 md:px-9`}>
			<h3 className='dashboard-heading flex items-center'>Council Votes <HelperTooltip className='ml-2' text='This represents the onchain votes of council members'/></h3>
			<div className='mt-6'>
				{councilVotes.map(councilVote =>
					<div className='flex items-center justify-between mb-6' key={councilVote.address}>
						<div className='item'>
							<Address address={councilVote.address} />
						</div>

						{councilVote.vote === Vote.AYE ?
							<div className='flex items-center text-aye_green text-lg'>
								<LikeFilled className='mr-2' /> Aye
							</div>
							:
							<div className='flex items-center text-nay_red text-lg'>
								<DislikeFilled className='mr-2' /> Nay
							</div>
						}
					</div>
				)}
			</div>
		</GovSidebarCard>
	);
};

export default MotionVoteInfo;
