// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
import { Tabs } from 'antd';
import * as React from 'react';
import ReactJson from 'react-json-view';
import Address from 'src/ui-components/Address';
import formatPostInfoArguments from 'src/util/formatPostInfoArguments';

import ArgumentsTable from './ArgumentsTable';

interface Props {
	className?: string
	postArguments: any
	showAccountArguments: boolean
}
const ArgumentsTableJSONView = ({ className, postArguments, showAccountArguments }: Props) => {
	const argumentsArr = formatPostInfoArguments(postArguments);

	if(argumentsArr.length > 0) {
		const tabItems = [
			{
				label: 'Table',
				key: 'table',
				children: <div className="table-view">
					<table cellSpacing={0} cellPadding={0}>
						<tbody>
							<ArgumentsTable argumentsJSON={argumentsArr} />
						</tbody>
					</table>
				</div>
			},
			{
				label: 'JSON',
				key: 'json',
				children: <div className="json-view">
					<ReactJson
						src={argumentsArr}
						iconStyle='circle'
						enableClipboard={false}
						displayDataTypes={false}
					/>
				</div>
			}
		];

		return (
			<div className={className}>
				<Tabs
					defaultActiveKey="table"
					items={tabItems}
				/>

				{
					showAccountArguments && postArguments.map((element:any, index:any) => {
						return element.name === 'account' && <div key={index}>
							<Address address={element.value} key={index}/>
						</div>;
					})
				}
			</div>
		);
	} else {
		return (<div></div>);
	}

};

export default ArgumentsTableJSONView;