// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CalendarFilled } from '@ant-design/icons';
import { Badge, Calendar, List, Tooltip } from 'antd';
import moment, { Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import { useGetCalenderEventsLazyQuery } from 'src/generated/graphql';
import { approvalStatus } from 'src/global/statuses';
import getNetwork from 'src/util/getNetwork';

const currentNetwork = getNetwork();

const UpcomingEvents = () => {
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

	const EventsListElement = () => (
		<>
			<List
				className='h-[100%] overflow-y-auto'
				itemLayout="horizontal"
				dataSource={calendarEvents}
				renderItem={item => {
					return (<List.Item className='cursor-pointer text-sidebarBlue'>
						<a href={item.url} target='_blank' rel='noreferrer'>
							<div className='text-xs mb-1 flex items-center'>
								{moment(item.end_time).format('MMM D, YYYY')}
								<span className="h-[4px] w-[4px] bg-sidebarBlue mx-2 rounded-full inline-block"></span>
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
		<div className='bg-white drop-shadow-md p-2 md:p-6 rounded-md h-[520px] lg:h-[550px]'>
			<div className="flex items-center justify-between mb-5">
				<h2 className='dashboard-heading'>Upcoming Events</h2>
				<CalendarFilled className='cursor-pointer inline-block lg:hidden' onClick={() => setShowCalendar(!showCalendar)} />
			</div>

			{/* Desktop */}
			<div className="hidden lg:flex lg:flex-row h-[520px] lg:h-[450px]">
				<div className="w-full lg:w-[55%] p-3">
					<CalendarElement />
					<span>*DateTime in UTC</span>
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

export default UpcomingEvents;