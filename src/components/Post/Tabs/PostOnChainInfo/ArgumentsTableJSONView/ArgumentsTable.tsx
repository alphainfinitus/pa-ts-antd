// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

interface Props {
	className?: string,
	argumentsJSON: any,
}

const ArgumentsTable = ({ argumentsJSON, className } : Props) => {
	return (
		<>
			{Object.keys(argumentsJSON).map((k) => (
				<tr key={k}>
					{!Array.isArray(argumentsJSON) && k != '__typename' && <td className='direct-data data-0'>{k}</td>}
					{(() => {
						if (argumentsJSON[k] && typeof argumentsJSON[k] === 'object') {
							return (
								<td className='indirect-data data-1'>
									<ArgumentsTable argumentsJSON={argumentsJSON[k]} className={className} />
								</td>
							);
						}

						return (
							<td className='direct-data data-2'>
								<span>{argumentsJSON[k]}</span>
							</td>
						);
					})()}
				</tr>
			))}
		</>
	);
};

export default ArgumentsTable;