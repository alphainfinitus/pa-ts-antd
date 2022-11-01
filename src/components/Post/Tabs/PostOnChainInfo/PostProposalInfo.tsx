// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Col, Row } from 'antd';
import * as React from 'react';
import ExternalLinks from 'src/components/ExternalLinks';
import { OnchainLinkProposalFragment } from 'src/generated/graphql';
import { chainProperties } from 'src/global/networkConstants';
import Address from 'src/ui-components/Address';
import getNetwork from 'src/util/getNetwork';

import ArgumentsTableJSONView from './ArgumentsTableJSONView';
import OnchainInfoWrapper from './OnchainInfoWrapper';

interface Props{
	onchainLink: OnchainLinkProposalFragment
	setOtherProposalsSidebarAddr: (address: string) => void
}

const currentNetwork = getNetwork();

const PostProposalInfo = ({ onchainLink, setOtherProposalsSidebarAddr }: Props) => {
	if (!onchainLink) return null;

	const {
		onchain_proposal: onchainProposal,
		proposer_address: proposerAddress
	} = onchainLink;
	const preimage = onchainProposal?.[0]?.preimage;
	const depositAmount = onchainProposal?.[0]?.depositAmount;

	const { metaDescription, method, preimageArguments } = preimage || {};

	return (
		<>
			<OnchainInfoWrapper>
				<Row gutter={40}>
					<Col xs={24} md={12}>
						<h6>Proposer
							<span className='text-pink_primary cursor-pointer ml-3' onClick={() => setOtherProposalsSidebarAddr(proposerAddress)}>
								View Other Proposals
							</span>
						</h6>
						<Address address={proposerAddress}/>
					</Col>
					{depositAmount && currentNetwork &&
					<Col xs={24} md={12}>
						<h6>Deposit</h6>
						{parseInt(depositAmount) / Math.pow(10, chainProperties[currentNetwork].tokenDecimals) + ' ' + chainProperties[currentNetwork].tokenSymbol}
					</Col>}
					{method &&
					<>
						<Row gutter={40} className='px-5'>
							<Col span={24}>
								<h6>Method</h6>
								{method}
							</Col>
						</Row>
						<div className='overflow-x-auto px-5'>
							<div className='arguments'>
								{preimageArguments && preimageArguments.length
									? <ArgumentsTableJSONView postArguments={preimageArguments} showAccountArguments={true}  />
									: null}
							</div>
						</div>
					</>}
				</Row>
				<Row gutter={40} className='px-5'>
					<Col span={24}>
						{ metaDescription &&
							<>
								<h6>Description</h6>
								<p className='text-navBlue leading-6'>{metaDescription}</p>
							</>
						}
					</Col>
				</Row>
				<Row gutter={40} className='px-5'>
					<Col span={24}>
						<ExternalLinks isProposal={true} onchainId={onchainLink.onchain_proposal_id} />
					</Col>
				</Row>
			</OnchainInfoWrapper>
		</>
	);
};

export default PostProposalInfo;