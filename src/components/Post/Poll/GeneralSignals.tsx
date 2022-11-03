// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueryLazyOptions } from '@apollo/client';
import styled from '@xstyled/styled-components';
import { Button } from 'antd';
import React, { useCallback, useContext, useState } from 'react';
import BlockCountdown from 'src/components/BlockCountdown';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import useCurrentBlock from 'src/hooks/useCurrentBlock';
import usePollEndBlock from 'src/hooks/usePollEndBlock';
import { Vote } from 'src/types';
import AyeNayButtons from 'src/ui-components/AyeNayButtons';
import ErrorAlert from 'src/ui-components/ErrorAlert';
import GovSidebarCard from 'src/ui-components/GovSidebarCard';
import HelperTooltip from 'src/ui-components/HelperTooltip';

import { Exact, useAddPollVoteMutation, useDeleteVoteMutation, useEditPollMutation } from '../../../generated/graphql';

interface Props {
	ayes: number
	className?: string
	endBlock: number
	nays: number
	ownVote?: Vote | null
	pollId: number
	canEdit: boolean
	pollRefetch: (options?: QueryLazyOptions<Exact<{
		postId: number;
	}>> | undefined) => void
	votesRefetch: (options?: QueryLazyOptions<Exact<{
		pollId: number;
	}>> | undefined) => void
}

const GeneralSignals = ({ ayes, className, endBlock, nays, ownVote, pollId, canEdit, pollRefetch, votesRefetch }: Props) => {
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

			<div className="my-6 flex">
				<div className='flex flex-col items-center text-white text-base'>
					<div id="bigCircle" className={`${ayes >= nays ? 'bg-aye_green' : 'bg-nay_red'} rounded-full h-[110px] w-[110px] flex items-center justify-center z-10`}>
						{
							(ayes == 0 && nays == 0) ? '0' : ayes >= nays ? ((ayes/(ayes + nays)) * 100).toFixed(1) : ((nays/(ayes + nays)) * 100).toFixed(1)
						}%
					</div>
					<div id="smallCircle" className={`${ayes < nays ? 'bg-aye_green' : 'bg-nay_red'} -mt-8 border-2 border-white rounded-full h-[75px] w-[75px] flex items-center justify-center z-20`}>
						{
							(ayes == 0 && nays == 0) ? '0' : ayes < nays ? ((ayes/(ayes + nays)) * 100).toFixed(1) : ((nays/(ayes + nays)) * 100).toFixed(1)
						}%
					</div>
				</div>

				<div className='flex-1 flex flex-col justify-between ml-12 py-9'>
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

			<div>
				{error?.message && <ErrorAlert errorMsg={error.message} />}
			</div>
			<div>
				<AyeNayButtons
					className='mt-9 mb-6 mx-auto'
					size='large'
					disabled={!id || !!ownVote || !canVote}
					onClickAye={() => castVote(Vote.AYE)}
					onClickNay={() => castVote(Vote.NAY)}
				/>
				<div className='flex items-center justify-between mt-6'>
					<div>
						{ownVote && canVote &&
							<Button size='middle' className='info text-muted cancelVoteLink' onClick={cancelVote}>
								Cancel <span className='capitalize'>&nbsp;{ownVote.toLowerCase()}&nbsp;</span> vote
							</Button>
						}
					</div>
					{canVote
						? <span>Poll ends in <BlockCountdown endBlock={endBlock}/></span>
						: <span>Poll ended. {canEdit
							? <Button className='info' onClick={extendsPoll}>Extend Poll</Button>
							: ''}
						</span>
					}
				</div>
			</div>
		</GovSidebarCard>
	);
};

export default styled(GeneralSignals)`
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
