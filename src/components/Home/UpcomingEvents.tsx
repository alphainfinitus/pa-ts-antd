// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CalendarFilled } from '@ant-design/icons';
import { Badge, Calendar, Checkbox, Col, List, Row, Tooltip } from 'antd';
import type { CheckboxValueType  } from 'antd/es/checkbox/Group';
import moment, { Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import { useGetCalenderEventsLazyQuery } from 'src/generated/graphql';
import { approvalStatus } from 'src/global/statuses';
import getNetwork from 'src/util/getNetwork';
import styled from 'styled-components';

const currentNetwork = getNetwork();

interface Props{
	className?: string
}

const UpcomingEvents = ({ className }:Props) => {
	const [showCalendar, setShowCalendar] = useState<boolean>(false);
	const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
	const [eventDates, setEventDates] = useState<string[]>([]);

	const [refetch, { data }] = useGetCalenderEventsLazyQuery({ variables: {
		approval_status: approvalStatus.APPROVED,
		network: currentNetwork
	} });

	useEffect(() => {
		refetch();
	}, [refetch]);

	useEffect(() =>  {
		const eventsArr:any[] = [];
		const eventDatesArr:string[] = [];

		data?.calender_events.forEach(eventObj => {
			const eventDate = new Date(eventObj.end_time);
			const currDate = new Date();
			if(eventDate.getTime() >= currDate.getTime()) {
				eventsArr.push({
					content: eventObj.content,
					end_time: moment(eventObj.end_time).toDate(),
					id: eventObj.id,
					location: eventObj.location,
					start_time: moment(eventObj.end_time).toDate(),
					status: eventObj.status,
					title: eventObj.title,
					url: eventObj.url
				});
				const eventDateStr = moment(eventObj.end_time).format('L');
				eventDatesArr.push(eventDateStr);
			}
		});
		setCalendarEvents(eventsArr);
		setEventDates(eventDatesArr);
	}, [data]);

	const onFilterChange = (checkedValues: CheckboxValueType[] ) => {
		console.log(`checked = ${checkedValues}`);
	};

	const getDateHasEvent = (value: Moment): boolean => {
		const valueDateStr = value.format('L');
		return eventDates.includes(valueDateStr);
	};

	const getEventData = (value: Moment): any[] => {
		const eventList: any[] = [];
		calendarEvents.forEach(eventObj => {
			if(moment(eventObj.end_time).format('L') === value.format('L')){
				eventList.push(eventObj);
			}
		});

		return eventList;
	};

	const dateCellRender = (value: Moment) => {
		const hasEvent = getDateHasEvent(value);
		if(hasEvent) {
			const eventData = getEventData(value);
			const eventList = <ul>
				{
					eventData.map(eventObj => (
						<li key={eventObj.id}>
							<a className='text-white hover:text-white hover:underline' href={eventObj.url} target='_blank' rel='noreferrer'>{eventObj.title}</a>
							<span className="flex h-[1px] bg-[rgba(255,255,255,0.3)] w-full my-2 rounded-full"></span>
						</li>
					))
				}
			</ul>;

			return (
				<Tooltip color='#E5007A' title={eventList}>
					<Badge color='#E5007A' className='absolute ml-[-2px] mt-[-6px]' />
				</Tooltip>
			);
		}
	};

	const CalendarElement = () => (
		<>
			<Calendar
				className='border border-gray-200 rounded-md mb-4'
				fullscreen={false}
				dateCellRender={dateCellRender}
			/>
		</>
	);

	console.log('evnets', calendarEvents);

	const EventsListElement = () => (
		<>
			<List
				className='h-[100%] overflow-y-auto'
				itemLayout="horizontal"
				dataSource={calendarEvents}
				renderItem={item => {
					return (<List.Item className='cursor-pointer text-sidebarBlue'>
						<a href={item.url} target='_blank' rel='noreferrer'>
							<div className='text-xs mb-1 flex items-center text-navBlue'>
								{moment(item.end_time).format('MMM D, YYYY')}
								<span className="h-[4px] w-[4px] bg-navBlue mx-2 rounded-full inline-block"></span>
								{moment(item.end_time).format('h:mm a')}
							</div>

							<div>{item.title}</div>
							<div className="text-sm">
								{item.content}
							</div>
						</a>
					</List.Item>);
				}}
			/>
		</>
	);

	return (
		<div className={`${className} bg-white drop-shadow-md p-2 md:p-6 rounded-md`}>
			<div className="flex items-center justify-between mb-5">
				<h2 className='dashboard-heading'>Upcoming Events</h2>
				<CalendarFilled className='cursor-pointer inline-block lg:hidden' onClick={() => setShowCalendar(!showCalendar)} />
			</div>

			{/* Desktop */}
			<div className="hidden lg:flex lg:flex-row">
				<div className="w-full lg:w-[55%] p-3">
					<CalendarElement />
					<div className='mt-4'>
						<div className='text-navBlue text-[14px] mb-4'>Filter by:</div>
						<Checkbox.Group onChange={onFilterChange} >
							<Row gutter={[0, 4]}>
								<Col span={24}>
									<Checkbox value='onchain' className='mb-5' >On chain events</Checkbox>
								</Col>
								<Col span={24}>
									<Checkbox value='proposals' className='mb-5' >Proposals</Checkbox>
								</Col>
								<Col span={24}>
									<Checkbox value='offchain'>Off chain events</Checkbox>
								</Col>
							</Row>
						</Checkbox.Group>
					</div>
				</div>

				<div className="w-[45%] ml-4 p-2">
					<EventsListElement />
				</div>
			</div>

			{/* Tablet and below */}
			<div className="flex lg:hidden">
				{
					showCalendar ?
						<div className="w-full lg:w-[55%] p-3">
							<CalendarElement />
							<span>*DateTime in UTC</span>
						</div>
						:
						<div className="w-full h-[430px] ml-4 p-2">
							<EventsListElement />
						</div>
				}
			</div>
		</div>
	);
};

export default styled(UpcomingEvents)`
	.ant-picker-content th{
		color: #90A0B7;
		font-weight: 500;
	}

	.ant-picker-cell-in-view{
		color: #334D6E !important;
		font-weight: 400;
	}

	.ant-picker-cell-in-view.ant-picker-cell-today .ant-picker-cell-inner::before, .ant-picker-cell .ant-picker-cell-inner{
		border-radius: 50% !important;
	}

	.ant-checkbox-wrapper{
		color: #334D6E;
	}

	
`;