// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Progress } from 'antd';
import React, { useCallback, useContext, useState } from 'react';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import { useAddOptionPollVoteMutation, useDeleteOptionPollVoteMutation,useOptionPollVotesQuery } from 'src/generated/graphql';
import ErrorAlert from 'src/ui-components/ErrorAlert';
import HelperTooltip from 'src/ui-components/HelperTooltip';

interface Props {
	className?: string
	optionPollId: number
	question: string
	options: string
	endAt?: number | null | undefined
	canEdit: boolean
}

const OptionPoll = ({ className, optionPollId, question, options, endAt }: Props) => {
	const [err, setErr] = useState<Error | null>(null);
	const { id } = useContext(UserDetailsContext);
	const { data, error, refetch } = useOptionPollVotesQuery({ variables: { optionPollId } });
	const [addOptionPollVoteMutation] = useAddOptionPollVoteMutation();
	const [deleteOptionPollVoteMutation] = useDeleteOptionPollVoteMutation();

	let totalVotes = 0;
	const optionMap: any = {};
	let parsedOptions: string[] = [];

	data?.option_poll_votes?.forEach(({ option }) => {
		optionMap[option] = (optionMap[option] || 0) + 1;
		totalVotes++;
	});

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const castVote = useCallback(async (option: string) => {
		if (!id) {
			return;
		}

		try {
			await deleteOptionPollVoteMutation({
				variables: {
					optionPollId,
					userId: id
				}
			});
		} catch (error) {
			setErr(error);
		}

		try {
			await addOptionPollVoteMutation({
				variables: {
					option,
					optionPollId,
					userId: id
				}
			});

			refetch();
		} catch (error) {
			setErr(error);
		}
	}, [id, addOptionPollVoteMutation, deleteOptionPollVoteMutation, optionPollId, refetch]);

	if (error?.message) return <ErrorAlert className={className} errorMsg={error.message} />;

	try {
		parsedOptions = JSON.parse(options);
	} catch (error) {
		console.error(error);
	}

	return (
		<div className={className}>
			<div className='mt-2 mb-4'>
				{err?.message && <ErrorAlert errorMsg={err.message} />}
				{error?.message && <ErrorAlert errorMsg={error.message} />}
			</div>

			<div className="flex items-center mb-4">
				<h3 className='dashboard-heading'><span className='text-navBlue mr-1'>Poll:</span>{question}?</h3>
				{id && <HelperTooltip className='ml-2 -mt-0.5' text='Click on option to vote' />}
			</div>

			<div>
				{parsedOptions.map(option => (
					<div key={option} className={`${id && 'cursor-pointer'} mb-2`} onClick={() => castVote(option)}>
						<Progress
							type='line'
							strokeWidth={11}
							percent={totalVotes && Math.round((optionMap[option] || 0) * 100/totalVotes)}
							format={(percent) => (<div> {percent} % </div>)}
						/>
						<div className='mt-1'>{option}</div>
					</div>
				))}
			</div>

			<div className='mt-4'>
				<span>{totalVotes} votes.</span>
				<span>{endAt && Math.round(Date.now()/1000) > endAt ? 'Poll Ended': ''}</span>
			</div>
		</div>
	);
};

export default OptionPoll;
