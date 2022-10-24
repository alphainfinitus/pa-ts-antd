// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// TODO: REVAMP THIS FILE
import styled from '@xstyled/styled-components';
import { Card, Progress } from 'antd';
import React, { useCallback, useContext, useState } from 'react';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import { useAddOptionPollVoteMutation, useDeleteOptionPollVoteMutation,useOptionPollVotesQuery } from 'src/generated/graphql';
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

	if (error?.message) return <Card>{error.message}</Card>;

	try {
		parsedOptions = JSON.parse(options);
	} catch (error) {
		console.error(error);
	}

	return (
		<Card className={className}>
			<div>
				{err?.message && <p>{err.message}</p>}
				{error?.message && <p>{error.message}</p>}
			</div>
			<h3>Poll: {question}? <HelperTooltip text='Click on option to vote' /></h3>
			<div>
				{parsedOptions.map(option => (
					<Progress
						className='progress'
						key={option}
						percent={totalVotes && Math.round((optionMap[option] || 0)*100/totalVotes)}
						// color='blue'
						// progress
						// onClick={() => castVote(option)}
					>
						{option}
					</Progress>
				))}
			</div>
			<div>
				<span>{totalVotes} votes.</span>
				<span>{endAt && Math.round(Date.now()/1000) > endAt ? 'Poll Ended': ''}</span>
			</div>
		</Card>
	);
};

export default styled(OptionPoll)`
	.progress {
		cursor: pointer;
	}

	.errorText {
		color: red_secondary;
	}
`;
