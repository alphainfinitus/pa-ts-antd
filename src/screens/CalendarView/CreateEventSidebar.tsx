// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import 'react-big-calendar/lib/css/react-big-calendar.css';

import { QueryLazyOptions } from '@apollo/client';
import {  RadioChangeEvent } from 'antd';
import { Button, Form, Input, Radio } from 'antd';
import React, { useState } from 'react';
import DatePicker from 'react-date-picker';
import SidebarRight from 'src/components/SidebarRight';
import { Exact, useAddCalenderEventMutation } from 'src/generated/graphql';
import { NotificationStatus } from 'src/types';
import queueNotification from 'src/ui-components/QueueNotification';
import styled from 'styled-components';

import { ReactComponent as CalendarIcon } from '../../assets/sidebar/calendar.svg';

interface Props {
  className?: string
	open: boolean
	setSidebarCreateEvent: React.Dispatch<React.SetStateAction<boolean>>
	selectedNetwork: string
	refetch: (options?: QueryLazyOptions<Exact<{
		network: string;
		approval_status: string;
	}>> | undefined) => void
	id:  number | null | undefined
}

const CreateEventSidebar = ({ className, refetch, selectedNetwork, setSidebarCreateEvent, id, open }: Props) => {
	const [eventTitle, setEventTitle] = useState<string>('');
	const [eventDescription, setEventDescription] = useState<string>('');
	const [eventType, setEventType] = useState<string>('online');
	const [eventStartDateTime, setEventStartDate] = useState<Date | undefined>();
	const [eventEndDateTime, setEventEndDate] = useState<Date | undefined>();
	const [eventJoiningLink, setEventJoiningLink] = useState<string>('');
	const [eventLocation, setEventLocation] = useState<string>('');
	const [errorsFound, setErrorsFound] = useState<string[]>([]);

	const [addCalenderEventMutation, { loading }] = useAddCalenderEventMutation({
		variables: {
			content: eventDescription,
			end_time: eventEndDateTime,
			event_type: eventType,
			location: eventLocation,
			module: '',
			network: selectedNetwork,
			start_time: eventStartDateTime,
			title: eventTitle,
			url: eventJoiningLink,
			user_id: id
		}
	});

	const onEventTypeRadioToggle = (event: RadioChangeEvent) => {
		setEventType(event.target.value?.toString() || 'online');
	};

	const closeCreateEventSidebar = () => {
		setSidebarCreateEvent(false);
		setEventTitle('');
		setEventDescription('');
		setEventType('online');
		setEventStartDate(undefined);
		setEventEndDate(undefined);
		setEventJoiningLink('');
	};

	function isFormValid(){
		const errorsFoundTemp: string[] = [];

		if(!eventTitle) {
			errorsFoundTemp.push('eventTitle');
		}

		if(!eventDescription) {
			errorsFoundTemp.push('eventDescription');
		}

		if(!eventStartDateTime) {
			errorsFoundTemp.push('eventStartDateTime');
		}

		if(!eventEndDateTime) {
			errorsFoundTemp.push('eventEndDateTime');
		}

		if(eventType == 'online' && !eventJoiningLink) {
			errorsFoundTemp.push('eventJoiningLink');
		} else if(eventType == 'offline' && !eventLocation) {
			errorsFoundTemp.push('eventLocation');
		}

		setErrorsFound(errorsFoundTemp);

		if(errorsFoundTemp.length > 0 ){
			return false;
		}

		return true;
	}

	const handleCreateEvent = () => {
		if(!isFormValid() || !id) return;

		addCalenderEventMutation({
			variables: {
				content: eventDescription,
				end_time: eventEndDateTime,
				event_type: eventType,
				location: eventLocation,
				module: '',
				network: selectedNetwork,
				start_time: eventStartDateTime,
				title: eventTitle,
				url: eventJoiningLink,
				user_id: id
			}
		})
			.then(({ data }) => {
				if (data && data.insert_calender_events && data.insert_calender_events.affected_rows > 0){
					closeCreateEventSidebar();
					queueNotification({
						header: 'Success!',
						message: 'Event has been sent for approval and should be live in 48 hours. Please contact hello@polkassembly.io in case of any queries',
						status: NotificationStatus.SUCCESS
					});
					refetch();
				}
			})
			.catch((e) => {
				queueNotification({
					header: 'Error!',
					message: 'Error saving event',
					status: NotificationStatus.ERROR
				});
				console.error('Error saving event :', e);
			});
	};

	return (
		<SidebarRight className={className} open={open} closeSidebar={() => setSidebarCreateEvent(false)}>
			<div className='dashboard-heading'>
				<h1>Create Event</h1>
			</div>

			<div className="create-event-form">
				<Form>
					<div>
						<label className='input-label'>Event Title</label>
						<Form.Item validateStatus={errorsFound.includes('eventTitle') ? 'error' : ''}>
							<Input
								type='text'
								className='text-input'
								value={eventTitle}
								onChange={(e) => setEventTitle(e.target.value)}
								disabled={loading}
							/>

						</Form.Item>
					</div>

					<div>
						<label className='input-label'>Description</label>
						<Form.Item validateStatus={errorsFound.includes('eventDescription') ? 'error' : ''}>
							<Input
								type='text'
								className='text-input'
								value={eventDescription}
								onChange={(e) => setEventDescription(e.target.value)}
								disabled={loading}
							/>

						</Form.Item>
					</div>

					<label className='input-label mr-3'>Event Type</label>
					<Radio.Group onChange={onEventTypeRadioToggle} value={eventType} className='radio-input-group'>
						<Radio
							value='online'
							checked={eventType === 'online'}
							disabled={loading}
						>Online</Radio>
						<Radio
							value='offline'
							checked={eventType === 'offline'}
							disabled={loading}
						>Offline</Radio>
					</Radio.Group>

					<div className="d-flex date-input-row">
						<div className='start-date-div'>
							<label className='input-label'>Start Date</label>
							<DatePicker
								className={`date-input ${errorsFound.includes('eventStartDateTime') ? 'error' : ''}`}
								onChange={setEventStartDate}
								value={eventStartDateTime}
								minDate={new Date()}
								calendarIcon={<CalendarIcon />}
								format='d-M-yyyy'
								disabled={loading}
							/>
						</div>

						<div>
							<label className='input-label'>End Date</label>
							<DatePicker
								className={`date-input ${errorsFound.includes('eventEndDateTime') ? 'error' : ''}`}
								onChange={setEventEndDate}
								value={eventEndDateTime}
								minDate={eventStartDateTime}
								calendarIcon={<CalendarIcon />}
								format='d-M-yyyy'
								disabled={loading}
							/>
						</div>
					</div>

					{eventType == 'online' ? <div>
						<label className='input-label'>Joining Link</label>
						<Form.Item validateStatus={errorsFound.includes('eventJoiningLink') ? 'error' : ''}>
							<Input
								type='text'
								className='text-input'
								value={eventJoiningLink}
								onChange={(e) => setEventJoiningLink(e.target.value)}
								disabled={loading}
							/>
						</Form.Item>
					</div>
						:
						<div>
							<label className='input-label'>Location</label>
							<Form.Item validateStatus={errorsFound.includes('eventLocation') ? 'error' : ''}>
								<Input
									type='text'
									className='text-input'
									value={eventLocation}
									onChange={(e) => setEventLocation(e.target.value)}
									disabled={loading}
								/>
							</Form.Item>
						</div>
					}

					<div className="form-actions">
						<Button onClick={closeCreateEventSidebar} disabled={loading} >Cancel</Button>
						<Button className='submit-btn ml-1' onClick={handleCreateEvent} loading={loading} >Create Event</Button>
					</div>
				</Form>
			</div>
		</SidebarRight>
	);
};

export default styled(CreateEventSidebar)`

	.create-event-form {
		margin-top: 48px;

		@media only screen and (max-width: 768px) {
			margin-top: 18px;
		}

		.input.error {
			border: 1px solid #FF0000;
		}

		.input-label {
			font-weight: 500;
			font-size: 16px;
			color: #7D7D7D;
			margin-bottom: 12px;

			@media only screen and (max-width: 768px) {
				font-size: 14px;
			}
		}
		
		.text-input {
			height: 35px;
			border-radius: 5px;
			margin-bottom: 18px;
			font-size: 16px;

			@media only screen and (max-width: 768px) {
				font-size: 14px;
				height: 38px;
				margin-bottom: 12px;
			}
		}

		.radio-input-group {
			margin-top: 12px;
			
			.checkbox{
				margin-right: 20px !important;

				&.checked {
					label {
						color: #E5007A;

						&::after {
							background-color: #E5007A !important;
						}
					}
				}

				label {
					font-size: 16px !important;
					padding-left: 20px !important;

					@media only screen and (max-width: 768px) {
						font-size: 14px;
					}
				}

			}
		}

		.date-input-row {
			margin-top: 28px;
			margin-bottom: 28px;
			display: flex;

			@media only screen and (max-width: 768px) {
				margin-top: 22px;
				margin-bottom: 22px;
				flex-direction: column;
			}

			.start-date-div {
				margin-right: 20px;

				@media only screen and (max-width: 768px) {
					margin-right: 0;
					margin-bottom: 14px;
				}
			}

			.input-label {
				margin-bottom: 212px !important;
			}

			.react-calendar__tile--now {
				background-color: rgba(229, 0, 122, 0.1);
			}
		}

		.date-input {
			width: 100%;
			margin-top: 2px;
			font-family: 'Roboto' !important;
			height: 38px !important;
	
			&.error {
				.react-date-picker__wrapper {
					border: #FF0000 1px solid;
					color: #FF0000 !important;
				}
	
				.react-date-picker__inputGroup__input {
					color: #FF0000 !important;
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

		.form-actions{
			display: flex;
			justify-content: flex-end;
			margin-top: 16px;

			.button {
				font-weight: 600;
				font-size: 16px;

				&:first-of-type {
					background: transparent;
				}
			}

			.submit-btn {
				background: #E5007A;
				color: #fff;
			}
			
		}
	}

`;
