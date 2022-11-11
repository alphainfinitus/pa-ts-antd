// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { LoadingOutlined } from '@ant-design/icons';
import { Divider, Progress, Spin } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import { useAddOptionPollVoteMutation, useDeleteOptionPollVoteMutation,useOptionPollVotesLazyQuery } from 'src/generated/graphql';
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
	const [loading, setLoading] = useState<boolean>(false);
	const { id } = useContext(UserDetailsContext);
	const [refetch, { data, error }] = useOptionPollVotesLazyQuery({ variables: { optionPollId } });
	const [addOptionPollVoteMutation] = useAddOptionPollVoteMutation();
	const [deleteOptionPollVoteMutation] = useDeleteOptionPollVoteMutation();
	useEffect(() => {
		refetch();
	}, [refetch]);
	let totalVotes = 0;
	const optionMap: any = {};
	let parsedOptions: string[] = [];

	data?.option_poll_votes?.forEach(({ option }) => {
		optionMap[option] = (optionMap[option] || 0) + 1;
		totalVotes++;
	});

	const castVote = useCallback(async (option: string) => {
		if (!id) {
			return;
		}

		setLoading(true);

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

		setLoading(false);
	}, [id, addOptionPollVoteMutation, deleteOptionPollVoteMutation, optionPollId, refetch]);

	if (error?.message) return <ErrorAlert className={className} errorMsg={error.message} />;

	try {
		parsedOptions = JSON.parse(options);
	} catch (error) {
		console.error(error);
	}

	return (
		<div className={className}>
			<div className="flex items-center mb-6">
				<h3 className='dashboard-heading'><span className='text-navBlue mr-1'>Poll:</span>{question}?</h3>
				<HelperTooltip className='ml-2 -mt-0.5' text={id ? 'Click on option to vote' : 'Please login to vote'} />
			</div>

			<div className='mt-2 mb-4'>
				{err?.message && <ErrorAlert errorMsg={err.message} />}
				{error?.message && <ErrorAlert errorMsg={error.message} />}
			</div>

			<Spin spinning={loading} indicator={<LoadingOutlined />}>
				{parsedOptions.map(option => (
					<div key={option} className={`${id && 'cursor-pointer'} mb-4`} onClick={() => castVote(option)}>
						<div>{option}</div>
						<Progress
							type='line'
							strokeWidth={11}
							percent={totalVotes && Math.round((optionMap[option] || 0) * 100/totalVotes)}
							format={(percent) => (<div> {percent} % </div>)}
						/>
					</div>
				))}
			</Spin>

			<div className='mt-6 text-right text-sidebarBlue font-medium'>
				<span>{totalVotes} {totalVotes > 1 ? 'votes' : 'vote'}</span>

				{ endAt && Math.round(Date.now()/1000) > endAt && <>
					<Divider className='mx-2' type="vertical" style={{ borderLeft: '1px solid #90A0B7' }} />
					<span>Poll Ended</span>
				</>}
			</div>
		</div>
	);
};

export default OptionPoll;
