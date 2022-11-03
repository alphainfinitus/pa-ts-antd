// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import { Col, Row } from 'antd';
import * as React from 'react';
import ExternalLinks from 'src/components/ExternalLinks';
import { OnchainLinkMotionFragment, OnchainLinkMotionPreimageFragment, OnchainLinkMotionTreasuryFragment } from 'src/generated/graphql';
import { chainProperties } from 'src/global/networkConstants';
import Address from 'src/ui-components/Address';
import getNetwork from 'src/util/getNetwork';

import ArgumentsTableJSONView from './ArgumentsTableJSONView';
import OnchainInfoWrapper from './OnchainInfoWrapper';

interface Props {
	className?: string;
	onchainLink: OnchainLinkMotionFragment
	setOtherProposalsSidebarAddr: (address: string) => void
}

const PostMotionInfo = ({ className, onchainLink, setOtherProposalsSidebarAddr }: Props) => {
	if (!onchainLink) return null;

	const {
		onchain_motion: onchainMotion,
		proposer_address: proposerAddress
	} = onchainLink;

	if (! onchainMotion?.[0]) {
		return null;
	}

	const { memberCount, method, motionProposalArguments, motionProposalHash, preimage, treasurySpendProposal } = onchainMotion[0];

	return (
		<>
			<OnchainInfoWrapper className={className}>
				<Row gutter={40}>
					<Col xs={24} md={12}>
						<h6>Proposer
							<span className='text-pink_primary cursor-pointer ml-3' onClick={() => setOtherProposalsSidebarAddr(proposerAddress)}>
								View Other Proposals
							</span>
						</h6>
						<Address address={proposerAddress}/>
					</Col>
					<Col xs={24} md={12}>
						<h6>Member count</h6>
						{memberCount}
					</Col>
					<Col xs={24} md={12}>
						<h6>Motion hash</h6>
						{motionProposalHash}
					</Col>
					<Col xs={24} md={12}>
						<h6>Motion&apos;s method</h6>
						<span className={method === 'rejectProposal' ? 'bold-red-text' : ''}>{method}</span>
					</Col>
					<div className='overflow-x-auto px-5'>
						<div className='arguments'>
							{motionProposalArguments && motionProposalArguments.length
								? <ArgumentsTableJSONView postArguments={motionProposalArguments} showAccountArguments={false}  />
								: null}
						</div>
					</div>
					<ProposalInfo preimage={preimage}/>
					<TreasuryInfo treasurySpendProposal={treasurySpendProposal}/>
					<Col span={24}>
						<ExternalLinks isMotion={true} onchainId={onchainLink.onchain_motion_id} />
					</Col>
				</Row>
			</OnchainInfoWrapper>
		</>
	);
};

const ProposalInfo = ({ preimage } : {preimage?: OnchainLinkMotionPreimageFragment | null}) => {
	if (!preimage) {
		return null;
	}

	const { metaDescription, method: preimageMethod, preimageArguments } = preimage;

	return (
		<Row className='motion-sub-info with-table mx-0 w-full' gutter={40}>
			{preimageMethod &&
				<>
					<Col span={24}>
						<h6>Method</h6>
						{preimageMethod}
					</Col>
					<Col className='arguments-col' span={24}>
						{preimageArguments && preimageArguments.length
							? <ArgumentsTableJSONView postArguments={preimageArguments} showAccountArguments={true}  />
							: null}
					</Col>
				</>
			}
			<Col span={24}>
				{ metaDescription &&
					<>
						<h6>Description</h6>
						<p className='text-navBlue leading-6'>{metaDescription}</p>
					</>
				}
			</Col>
		</Row>
	);
};

const TreasuryInfo = ({ treasurySpendProposal }: {treasurySpendProposal?: OnchainLinkMotionTreasuryFragment | null}) => {

	if (!treasurySpendProposal){
		return null;
	}

	const currentNetwork = getNetwork();
	const { beneficiary, bond, value } = treasurySpendProposal;

	return (
		<Row className='motion-sub-info treasury-info mx-0 w-full' gutter={40}>
			{beneficiary &&
				<Col xs={24} md={12}>
					<h6>Beneficiary</h6>
					<Address address={beneficiary} />
				</Col>}
			{value && currentNetwork &&
					<Col xs={24} md={12}>
						<h6>Value</h6>
						{parseInt(value) / Math.pow(10, chainProperties[currentNetwork].tokenDecimals) + ' ' + chainProperties[currentNetwork].tokenSymbol}
					</Col>}
			{bond && currentNetwork &&
				<>
					<Col xs={24} md={12}/>
					<Col xs={24} md={12}>
						<h6>Bond</h6>
						{parseInt(bond) / Math.pow(10, chainProperties[currentNetwork].tokenDecimals) + ' ' + chainProperties[currentNetwork].tokenSymbol}
					</Col>
				</>}
		</Row>
	);
};

export default styled(PostMotionInfo)`
	.bold-red-text {
		color: red_primary;
		font-weight: bold;
	}
`;