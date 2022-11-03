// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DownOutlined } from '@ant-design/icons';
import styled from '@xstyled/styled-components';
import type { MenuProps } from 'antd';
import type { DatePickerProps } from 'antd';
import { Button, Card, DatePicker, Dropdown,Form, Space } from 'antd';
import moment from 'moment';
import React, { useEffect,useState } from 'react';
import { useCreateProposalTrackerMutation, useGetProposalStatusLazyQuery, useUpdateProposalTrackerMutation } from 'src/generated/graphql';
import { NotificationStatus } from 'src/types';
import ErrorAlert from 'src/ui-components/ErrorAlert';
import HelperTooltip from 'src/ui-components/HelperTooltip';
import queueNotification from 'src/ui-components/QueueNotification';
import getNetwork from 'src/util/getNetwork';

interface Props {
	canEdit?: boolean | '' | undefined
	className?: string
	proposalId?: number | null | undefined
	startTime: string
}

const statusOptions : MenuProps['items'] = [
	{ key: 'overdue', label: 'Overdue' },
	{ key: 'completed', label: 'Completed' },
	{ key: 'in_progress', label: 'In Progress' }
];

const EditProposalStatus = ({ canEdit, className, proposalId, startTime } : Props) => {
	const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);
	const [status, setStatus] = useState<string>('in_progress');
	const [loading, setLoading] = useState<boolean>(false);
	const [errorsFound, setErrorsFound] = useState<string[]>([]);
	const [isUpdate, setIsUpdate] = useState<boolean>(false);

	const NETWORK = getNetwork();

	const [refetch, { data }] = useGetProposalStatusLazyQuery({ variables: {
		onchain_proposal_id: Number(proposalId)
	} });

	useEffect(() => {
		refetch();
	}, [refetch]);

	useEffect(() => {
		if(data?.proposal_tracker[0]?.status) {
			setStatus(data.proposal_tracker[0].status);
		}else{
			setStatus('Not Set');
		}

		if(data?.proposal_tracker[0]?.deadline) {
			setIsUpdate(true);
			setDeadlineDate(moment(data.proposal_tracker[0].deadline).toDate());
		}else{
			setDeadlineDate(null);
		}

	}, [canEdit, data]);

	const onStatusChange : MenuProps['onClick'] = ({ key }) => {
		const status = key as string;
		setStatus(status);
	};

	const [createProposalTrackerMutation] = useCreateProposalTrackerMutation({
		variables: {
			deadline: moment(deadlineDate).format('YYYY-MM-DD'),
			network: NETWORK,
			onchain_proposal_id: Number(proposalId),
			start_time: startTime,
			status: status
		}
	});

	const [updateProposalTrackerMutation] = useUpdateProposalTrackerMutation({
		variables: {
			id: Number(data?.proposal_tracker[0]?.id),
			status: status
		}
	});

	const handleSave = async () => {
		if(!canEdit) return;

		setLoading(true);

		const errorsFound: string[] = [];

		if(Object.prototype.toString.call(deadlineDate) !== '[object Date]') {
			errorsFound.push('deadlineDate');
		}

		if(!status){
			errorsFound.push('status');
		}

		setErrorsFound(errorsFound);

		if(errorsFound.length > 0) {
			setLoading(false);
			return;
		}

		if(!isUpdate) {
			createProposalTrackerMutation({ variables: {
				deadline: moment(deadlineDate).format('YYYY-MM-DD'),
				network: NETWORK,
				onchain_proposal_id: Number(proposalId),
				start_time: startTime,
				status: status
			} }).then(({ data }) => {
				if (data && data.createProposalTracker?.message){
					queueNotification({
						header: 'Success!',
						message: 'Proposal status was saved',
						status: NotificationStatus.SUCCESS
					});
					refetch();
				}
			}).catch((e:any) => console.error('Error saving status : ', e));
		} else {
			updateProposalTrackerMutation({ variables: {
				id: Number(data?.proposal_tracker[0]?.id),
				status: status
			} }).then(({ data }) => {
				if (data && data.updateProposalTracker?.message){
					queueNotification({
						header: 'Success!',
						message: 'Proposal status was updated',
						status: NotificationStatus.SUCCESS
					});
					refetch();
				}
			}).catch((e:any) => console.error('Error updating status : ', e));
		}

		setLoading(false);
	};

	const onChange : DatePickerProps['onChange'] = (date) => {
		setDeadlineDate(moment(date).toDate());
	};

	return (
		<Card
			className={className}
		>
			<Card>
				<div className='card-description'>
					{errorsFound.includes('proposalTracker') && <ErrorAlert errorMsg='Error in updating proposal status, please try again.' />}

					<Form>
						<Form.Item className='date-input-form-field'>
							<label className='input-label text-sidebarBlue'>
								Deadline Date
								<HelperTooltip text='This timeline will be used by the community to track the progress of the proposal. The team will be responsible for delivering the proposed items before the deadline.' />
							</label>

							{(canEdit && !isUpdate) ?
								<DatePicker
									className={`date-input ${errorsFound.includes('deadlineDate') ? 'deadline-date-error' : ''}`}
									disabled={loading}
									onChange={onChange}
									format='DD-MM-YYYY'
								/>
								:
								(canEdit && isUpdate) ? <><div className='mb-3 text-sidebarBlue'>Deadline: {moment(deadlineDate).format('MMMM Do YYYY')}</div>
									<DatePicker
										className={`date-input ${errorsFound.includes('deadlineDate') ? 'deadline-date-error' : ''}`}
										disabled={loading}
										onChange={onChange}
										format='DD-MM-YYYY'
										value={moment(deadlineDate, 'DD-MM-YYYY')}
									/></> : <span className='deadline-date text-sidebarBlue'>{deadlineDate==null ? 'Not Set' : moment(deadlineDate).format('MMMM Do YYYY')}</span>
							}
						</Form.Item>

						<Form.Item className='status-input-form-field'>
							<label className='input-label text-sidebarBlue'>
								Status
							</label>

							{canEdit ?
								// eslint-disable-next-line sort-keys
								<><Dropdown className='status-dropdown' disabled={loading} menu={{ items: statusOptions, onClick: onStatusChange }} ><Space className='cursor-pointer'>{status} <DownOutlined className='align-middle'/></Space></Dropdown></>
								:
								<span className='text-sidebarBlue'>{status=='Not Set' ? status :statusOptions.find(o => o?.key === status)?.key?.toString().split('_').map((s:string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}</span>
							}
						</Form.Item>
					</Form>
				</div>

				{ canEdit && <div className='card-actions'>
					<Button onClick={handleSave} loading={loading} disabled={loading}>
						Save
					</Button>
				</div>
				}
			</Card>
		</Card>

	);

};

export default styled(EditProposalStatus)`
	width: 100% !important;
	padding: 2% 3% !important;

	.header{
		border-bottom: 1px solid #eee;
		padding-bottom: 5px;
		margin-bottom: 16px;
	}

	.card-description {
		display: flex;
		flex-direction: column;

		.fields {
			display: block;
		}
	}

	.card-actions {
		margin-top: 10px;
		display: flex;
		justify-content: end;
		
		.button {
			background: #E5007A !important;
			color: #fff;
		}
	}

	.input-label {
		display: flex !important;
		align-items: center !important;
		font-size: 12px;

		span {
			margin-top: -5px;
		}
	}

	.deadline-date {
		font-size: 14px;
	}

	.date-input {
		width: 100%;
		margin-top: 2px;
		font-family: 'Roboto' !important;

		&.deadline-date-error {
			.react-date-picker__wrapper {
				border: #E06B5E 1px solid;
				color: #E06B5E !important;
			}

			.react-date-picker__inputGroup__input {
				color: #E06B5E !important;
				font-family: 'Roboto' !important;
			}
		}

		.react-date-picker__wrapper {
			padding: 0 10px;
			border: 1px solid rgba(34,36,38,.15);
			border-radius: .29rem;

			.react-date-picker__inputGroup {
				display: flex;

				.react-date-picker__inputGroup__divider {
					height: 100%;
					display: flex;
					align-items: center;
				}
			}

		}

		.react-date-picker__clear-button {
			svg {
				stroke: #aaa !important;
				height: 14px;
			}
		}

		.react-date-picker__inputGroup__input {
			border: none !important;
			font-family: 'Roboto' !important;
			color: #333;
			height: min-content;
			margin-bottom: 0 !important;
		}

		.react-date-picker__inputGroup__divider,.react-date-picker__inputGroup__day, .react-date-picker__inputGroup__month, .react-date-picker__inputGroup__year {
			font-size: 14px;
			padding-left: 1px !important;
			padding-right: 1px !important;
		}
	}

	.status-input-form-field {
		margin-top: 16px !important;

		.input-label {
			margin-bottom: 4px;
		}

		.status-dropdown {
			font-size: 14px;
			width: 100%;
		}
	}

	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none !important;
		margin: 0 !important;
	}

	/* Firefox */
	input[type=number] {
		-moz-appearance: textfield !important;
	}
`;
