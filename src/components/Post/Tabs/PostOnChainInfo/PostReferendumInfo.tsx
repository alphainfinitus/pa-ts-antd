// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Col, Row } from 'antd';
import * as moment from 'moment';
import * as React from 'react';
import BlockCountdown from 'src/components/BlockCountdown';
import BlocksToTime from 'src/components/BlocksToTime';
import ExternalLinks from 'src/components/ExternalLinks';
import { OnchainLinkReferendumFragment } from 'src/generated/graphql';
import Address from 'src/ui-components/Address';

import ArgumentsTableJSONView from './ArgumentsTableJSONView';
import OnchainInfoWrapper from './OnchainInfoWrapper';

interface Props{
	onchainLink: OnchainLinkReferendumFragment
	setOtherProposalsSidebarAddr: (address: string) => void
}

const PostReferendumInfo = ({ onchainLink, setOtherProposalsSidebarAddr }: Props) => {
	if (!onchainLink) return null;

	const {
		onchain_referendum: onchainReferendum,
		proposer_address: proposerAddress
	} = onchainLink;

	if ( !onchainReferendum?.[0] ){
		return null;
	}

	const { delay, end, referendumStatus, preimage, voteThreshold } = onchainReferendum[0];
	const { metaDescription, method, preimageArguments } = preimage || {};
	const { blockNumber, status } = referendumStatus?.[0] || {};

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
					{(delay || delay === 0) &&
						<Col xs={24} md={12}>
							<h6>Delay</h6>
							<BlocksToTime blocks={delay} />
						</Col>}
					{end &&
						<Col xs={24} md={12}>
							{status === 'Started'
								?
								<>
									<h6>End</h6>
									<BlockCountdown endBlock={end}/>
								</>
								:
								<>
									<h6>Ended</h6>
									<div>{moment.utc(blockNumber?.startDateTime).format('DD MMM YYYY, HH:mm:ss')}</div>
								</>
							}
						</Col>}
					{voteThreshold &&
						<Col xs={24} md={12}>
							<h6>Vote threshold</h6>
							{voteThreshold}
						</Col>}
					{method &&
					<>
						<Row>
							<Col span={24}>
								<h6>Method</h6>
								{method}
							</Col>
						</Row>
						<div className='arguments max-w-full'>
							{preimageArguments && preimageArguments.length
								? <ArgumentsTableJSONView postArguments={preimageArguments} showAccountArguments={true}  />
								: null}
						</div>
					</>}
					{metaDescription &&
					<Col span={24}>
						<h6>Description</h6>
						<p className='text-navBlue leading-6'>{metaDescription}</p>
					</Col>}
					<Col span={24}>
						<ExternalLinks isReferendum={true} onchainId={onchainLink.onchain_referendum_id} />
					</Col>
				</Row>
			</OnchainInfoWrapper>
		</>
	);
};

export default PostReferendumInfo;