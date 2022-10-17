// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { ReactNode } from 'react';
import { bountyStatus, bountyStatusMap, childBountyStatus, childBountyStatusMap, motionStatus, proposalStatus, referendumStatus, tipStatus, tipStatusMap } from 'src/global/statuses';

interface Props{
	children?: ReactNode,
	className?: string,
	content?: string,
	status: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StatusTag = ({ children, className, content, status }: Props) => {

	if (content && tipStatusMap[content]) {
		content = tipStatusMap[content];
	}

	if (content && bountyStatusMap[content]) {
		content = bountyStatusMap[content];
	}

	if (content && childBountyStatusMap[content]) {
		content = childBountyStatusMap[content];
	}

	return (
		<div className={`${className} ${status} text-xs rounded-full border-2 px-3 py-1 whitespace-nowrap truncate`}>
			{content}
		</div>
	);
};

export default styled(StatusTag).attrs(( { status }: Props) => ({
	className: status,
	content: status
}))`
	color: #fff;
	max-width: min-content;
	
	&.${referendumStatus.STARTED},
	&.${proposalStatus.PROPOSED},
	&.${motionStatus.PROPOSED},
	&.${bountyStatus.PROPOSED} {
		border-color: #6495ED;
		background: #6495ED;
	}
	
	&.${tipStatus.OPENED},
	&.${tipStatus.CLOSING},
	&.${bountyStatus.AWARDED},
	&.${bountyStatus.BECAME_ACTIVE},
	&.${bountyStatus.EXTENDED},
	&.${childBountyStatus.ADDED} {
		border-color: #6495ED;
		background: #6495ED;
	}
	&.${proposalStatus.TABLED},
	&.${referendumStatus.PASSED},
	&.${referendumStatus.EXECUTED},
	&.${motionStatus.EXECUTED},
	&.${motionStatus.APPROVED},
	&.${motionStatus.CLOSED},
	&.${tipStatus.CLOSED},
	&.${bountyStatus.AWARDED},
	&.${bountyStatus.CLAIMED},
	&.${childBountyStatus.AWARDED} {
		border-color: #5BC044;
		background: #5BC044;
	}
	&.${childBountyStatus.CLAIMED},
	&.prime {
		border-color: green_primary;
		background: green_primary;
	}
	&.${proposalStatus.CLEARED},
	&.${referendumStatus.CANCELLED},
	&.${referendumStatus.NOTPASSED},
	&.${referendumStatus.VETOED},
	&.${motionStatus.DISAPPROVED},
	&.${tipStatus.RETRACTED},
	&.${bountyStatus.CANCELED},
	&.${bountyStatus.REJECTED},
	&.${childBountyStatus.CANCELED} {
		border-color: #FF0000;
		background: #FF0000;
	}
`;