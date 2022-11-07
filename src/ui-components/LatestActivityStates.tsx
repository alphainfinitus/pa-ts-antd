// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Empty, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React, { ReactNode } from 'react';
import { PostCategory } from 'src/global/post_categories';

import Address from './Address';
import StatusTag from './StatusTag';
import { ErrorState, LoadingState } from './UIStates';

const LatestActivityWrapper = ({ children }: {children: ReactNode}) => (
	<div className="h-[500px] flex items-center justify-center overflow-y-auto">
		{children}
	</div>
);

export const LoadingLatestActivity = () => {
	return (
		<LatestActivityWrapper>
			<LoadingState />
		</LatestActivityWrapper>
	);
};

export const ErrorLatestActivity = ({ errorMessage } : { errorMessage: string}) => {
	return (
		<LatestActivityWrapper>
			<ErrorState errorMessage={errorMessage} />
		</LatestActivityWrapper>
	);
};

export const EmptyLatestActivity = () => {
	return (
		<LatestActivityWrapper>
			<Empty />
		</LatestActivityWrapper>
	);
};

export const PopulatedLatestActivity = ({ columns, tableData, onClick }: { columns:ColumnsType<any>, tableData: readonly any[] | undefined, onClick: (rowData:any) => any }) => {
	return (
		<Table
			columns={columns}
			dataSource={tableData}
			pagination={false}
			scroll={{ x: 1000, y: 650 }}

			onRow={(rowData) => {
				return {
					onClick: () => onClick(rowData)
				};
			}}
		/>
	);
};

export const PopulatedLatestActivityCard = ({ tableData, onClick }: { tableData: readonly any[], onClick: (rowData:any) => any }) => {
	return (
		<div>
			{
				tableData.map(rowData => (
					<div key={rowData.key} className="bg-white rounded shadow-md mb-6 p-3 border border-gray-200 cursor-pointer" onClick={() => onClick(rowData)}>
						{/* Meta Data Row */}
						<div className="flex items-center justify-between text-sidebarBlue">
							<div className="flex items-center">
								{rowData.icon}
								<span className='capitalize ml-2 flex items-center'>
									{rowData.postCategory.toString().split(' ')[0]}
									<span className="h-[4px] w-[4px] bg-sidebarBlue mx-1 rounded-full inline-block"></span>
									#{rowData.postCategory === PostCategory.DISCUSSION || rowData.postCategory === PostCategory.TIP ? rowData.postId : rowData.onChainId}
								</span>
							</div>
							<span>{rowData.status && <StatusTag status={rowData.status} />}</span>
						</div>

						{/* Title */}
						<div className="my-4">
							<h4>
								<div style={{
									height: '3em',
									lineHeight: '1.5em',
									overflow: 'hidden',
									textAlign: 'justify',
									textOverflow: 'ellipsis'
								}}>
									{rowData.title}
								</div>
							</h4>
							{rowData.subTitle && <div className='text-sm text-sidebarBlue'>{rowData.subTitle}</div>}
						</div>

						{/* Created by and on */}
						<div className='flex items-center justify-between'>
							<span>
								{
									!rowData.address ? <span className='username text-sidebarBlue'> { rowData.username } </span> :
										<Address
											address={rowData.address}
											className='text-sm'
											displayInline={true}
											disableIdenticon={true}
										/>
								}
							</span>
							<span>{rowData.createdAt ? moment(rowData.createdAt).isAfter(moment().subtract(1, 'w')) ? moment(rowData.createdAt).startOf('day').fromNow() : moment(rowData.createdAt).format('Do MMM \'YY') : null}</span>
						</div>
					</div>
				))
			}
		</div>
	);
};