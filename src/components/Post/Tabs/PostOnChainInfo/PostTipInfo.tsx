// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Col,Row } from 'antd';
import * as moment from 'moment';
import React from 'react';
import BlockCountdown from 'src/components/BlockCountdown';
import { OnchainLinkTipFragment } from 'src/generated/graphql';
import { tipStatus as tipStatuses } from 'src/global/statuses';
import Address from 'src/ui-components/Address';

import OnchainInfoWrapper from './OnchainInfoWrapper';

interface Props{
	onchainLink: OnchainLinkTipFragment
	setOtherProposalsSidebarAddr: (address: string) => void
}

const PostTipInfo = ({ onchainLink, setOtherProposalsSidebarAddr }: Props) => {
	if (!onchainLink) return null;

	const {
		onchain_tip: onchainTipProposal,
		proposer_address: proposerAddress
	} = onchainLink;

	const { closes, finder, hash, reason, who, tipStatus  } = onchainTipProposal?.[0] || { };
	const { blockNumber, status } = tipStatus?.[0] || {};

	return (
		<>
			<OnchainInfoWrapper>
				<Row>
					<Col xs={24} md={12}>
						<h6>Proposer
							<span className='text-pink_primary cursor-pointer ml-3' onClick={() => setOtherProposalsSidebarAddr(proposerAddress)}>
								View Other Proposals
							</span>
						</h6>
						<Address address={proposerAddress}/>
					</Col>
					{hash &&
					<Col xs={24} md={12}>
						<h6>Hash</h6>
						{hash}
					</Col>}
					{reason &&
					<Col xs={24} md={12}>
						<h6>Reason</h6>
						{reason}
					</Col>}
					{who &&
					<Col xs={24} md={12}>
						<h6>Receiver</h6>
						<Address address={who}/>
					</Col>}
					{finder &&
					<Col xs={24} md={12}>
						<h6>Finder</h6>
						<Address address={finder}/>
					</Col>}
					{closes &&
					<Col xs={24} md={12}>
						{status === tipStatuses.CLOSING
							?
							<>
								<h6>Closing</h6>
								<BlockCountdown endBlock={closes}/>
							</>
							:  status === tipStatuses.CLOSED
								?
								<>
									<h6>Closed</h6>
									<div>{moment.utc(blockNumber?.startDateTime).format('DD MMM YYYY, HH:mm:ss')}</div>
								</>
								: <span>#{closes}</span>
						}
					</Col>}
				</Row>
			</OnchainInfoWrapper>
		</>
	);
};

export default PostTipInfo;
