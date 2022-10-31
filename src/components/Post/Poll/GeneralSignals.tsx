// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from '@xstyled/styled-components';
import { Button, Card, Form } from 'antd';
import { ApolloQueryResult } from 'apollo-client';
import React, { useCallback, useContext, useState } from 'react';
import BlockCountdown from 'src/components/BlockCountdown';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import useCurrentBlock from 'src/hooks/useCurrentBlock';
import usePollEndBlock from 'src/hooks/usePollEndBlock';
import { Vote } from 'src/types';
import ErrorAlert from 'src/ui-components/ErrorAlert';
import GovSidebarCard from 'src/ui-components/GovSidebarCard';
import HelperTooltip from 'src/ui-components/HelperTooltip';

import { PollQuery, PollQueryVariables, PollVotesQuery, PollVotesQueryVariables, useAddPollVoteMutation, useDeleteVoteMutation, useEditPollMutation } from '../../../generated/graphql';
// import AyeNayButtons from '../../../ui-components/AyeNayButtons';
// import GeneralChainSignalBar from '../../../ui-components/GeneralChainSignalBar';

interface Props {
	ayes: number
	className?: string
	endBlock: number
	nays: number
	ownVote?: Vote | null
	pollId: number
	canEdit: boolean
	pollRefetch: (variables?: PollQueryVariables | undefined) => Promise<ApolloQueryResult<PollQuery>>
	votesRefetch: (variables?: PollVotesQueryVariables | undefined) => Promise<ApolloQueryResult<PollVotesQuery>>
}

const CouncilSignals = ({ ayes, className, endBlock, nays, ownVote, pollId, canEdit, pollRefetch, votesRefetch }: Props) => {
	const { id } = useContext(UserDetailsContext);
	const [error, setErr] = useState<Error | null>(null);
	const [addPollVoteMutation] = useAddPollVoteMutation();
	const [editPollMutation] = useEditPollMutation();
	const [deleteVoteMutation] = useDeleteVoteMutation();

	const currentBlockNumber = useCurrentBlock()?.toNumber() || 0;
	const pollEndBlock = usePollEndBlock();
	const canVote =  endBlock > currentBlockNumber;

	const cancelVote = useCallback(async () => {
		if (!id) {
			return;
		}

		try {
			await deleteVoteMutation({
				variables: {
					pollId,
					userId: id
				}
			});

			votesRefetch();
		} catch (error) {
			setErr(error);
		}
	}, [id, deleteVoteMutation, pollId, votesRefetch]);

	const castVote = useCallback(async (vote: Vote) => {
		if (!id) {
			return;
		}

		try {
			await addPollVoteMutation({
				variables: {
					pollId,
					userId: id,
					vote
				}
			}).catch(console.error);

			votesRefetch();
		} catch (error) {
			setErr(error);
		}
	}, [id, addPollVoteMutation, pollId, votesRefetch]);

	const extendsPoll = useCallback(async () => {
		if (!id) {
			return;
		}

		try {
			await editPollMutation({
				variables: {
					blockEnd: pollEndBlock,
					id: pollId
				}
			});

			pollRefetch();
		} catch (error) {
			setErr(error);
		}
	}, [id, editPollMutation, pollEndBlock, pollId, pollRefetch]);

	return (
		<GovSidebarCard className={className}>
			<h3 className='flex items-center'><span className='mr-2 dashboard-heading'>Poll Signals</span> <HelperTooltip text='This represents the off-chain votes of Polkassembly users including council members'/></h3>
			{/* <GeneralChainSignalBar
				ayeSignals={ayes}
				naySignals={nays}
			/> */}
			<div>
				{error?.message && <ErrorAlert errorMsg={error.message} />}
			</div>
			<Form>
				{/* <AyeNayButtons
					className={`signal-btns ${ownVote}`}
					disabled={!id || !!ownVote || !canVote}
					onClickAye={() => castVote(Vote.AYE)}
					onClickNay={() => castVote(Vote.NAY)}
				/> */}
				<div>
					{ownVote && canVote &&
						<>
							<Button className='info text-muted cancelVoteLink' onClick={cancelVote}>
								Cancel {ownVote.toLowerCase()} vote
							</Button>
							<span className='separator'>•</span>
						</>
					}
					{canVote
						? <span>Poll ends in <BlockCountdown endBlock={endBlock}/></span>
						: <span>Poll ended. {canEdit
							? <Button className='info' onClick={extendsPoll}>Extend Poll</Button>
							: ''}
						</span>
					}
				</div>
			</Form>
		</GovSidebarCard>
	);
};

export default styled(CouncilSignals)`
	.separator {
		margin-left: 1rem;
		margin-right: 1rem;
	}

	.blockCountdown {
		display: inline;
		font-weight: 500;
	}

	.info {
		margin: 1em 0;
	}

	.errorText {
		color: red_secondary;
	}

	.signal-btns {
		margin-top: 2rem !important;
	}

	.AYE {
		.ui.button.ui.primary.positive.button {
			background-color: green_secondary !important;
			opacity: 1 !important;
		}
	}

	.NAY {
		.ui.button.ui.primary.negative.button{
			background-color: red_secondary !important;
			opacity: 1 !important;
		}
	}
`;
