// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import { Col,Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { ApiContext } from 'src/context/ApiContext';
import HelperTooltip from 'src/ui-components/HelperTooltip';
import getNetwork from 'src/util/getNetwork';

import { CouncilVote, Vote } from '../../../../types';
import Address from '../../../../ui-components/Address';
import Card from '../../../../ui-components/Card';

interface Props {
	className?: string
	motionId: number
}

const MotionVoteInfo = ({ className, motionId }: Props) => {
	const [councilVotes, setCouncilVotes] = useState<CouncilVote[]>([]);
	const { api, apiReady } = useContext(ApiContext);

	useEffect(() => {
		// eslint-disable-next-line quotes
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
	},[api, apiReady, motionId]);

	if (!councilVotes.length) {
		return null;
	}

	return (
		<Card className={className}>
			<h3>Council Votes <HelperTooltip text='This represents the onchain votes of council members'/></h3>
			<div className='council-votes'>
				{councilVotes.map(councilVote =>
					<Row key={councilVote.address}>
						<Col span={12}>
							<div className='item'>
								<Address address={councilVote.address} />
							</div>
						</Col>
						<Col span={4}>
							{councilVote.vote === Vote.AYE ? <>
								<div className='thumbs up'>
								THUMBS UP
								</div> Aye
							</> : <>
								<div className='thumbs down'>
									THUMBS DOWN
								</div> Nay
							</>}
						</Col>
					</Row>
				)}
			</div>
		</Card>
	);
};

export default styled(MotionVoteInfo)`
	.council-votes {
		margin-top: 2em;
	}
	.thumbs {
		display: inline-block;
		text-align: center;
		vertical-align: middle;
		color: white;
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		font-size: 1rem;
	}

	.thumbs.up {
		background-color: green_primary;
	}

	.thumbs.down {
		background-color: red_primary;
	}
`;
