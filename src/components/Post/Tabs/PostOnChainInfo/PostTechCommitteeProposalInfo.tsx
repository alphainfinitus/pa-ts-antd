// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Col, Row } from 'antd';
import * as React from 'react';
import ExternalLinks from 'src/components/ExternalLinks';
import { OnchainLinkMotionPreimageFragment, OnchainLinkTechCommitteeProposalFragment } from 'src/generated/graphql';
import Address from 'src/ui-components/Address';

import ArgumentsTableJSONView from './ArgumentsTableJSONView';
import OnchainInfoWrapper from './OnchainInfoWrapper';

interface Props {
	className?: string;
	onchainLink: OnchainLinkTechCommitteeProposalFragment
	setOtherProposalsSidebarAddr: (address: string) => void
}

const PostTechCommitteeProposalInfo = ({ className, onchainLink, setOtherProposalsSidebarAddr }: Props) => {
	if (!onchainLink) return null;

	const {
		onchain_tech_committee_proposal: onchainTechCommitteeProposal,
		proposer_address: proposerAddress
	} = onchainLink;

	if (!onchainTechCommitteeProposal?.[0]) {
		return null;
	}

	const { metaDescription, memberCount, method, proposalArguments, proposalHash, preimage } = onchainTechCommitteeProposal[0];

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
				</Row>

				<Row gutter={40}>
					<Col xs={24} md={12}>
						<h6>Proposal hash</h6>
						{proposalHash}
					</Col>
					<Col xs={24} md={12}>
						<h6>Motion&apos;s method</h6>
						<span className={method === 'rejectProposal' ? 'bold-red-text' : ''}>{method}</span>
					</Col>
				</Row>

				<div>
					<div className='arguments overflow-x-auto'>
						{proposalArguments && proposalArguments.length
							? <ArgumentsTableJSONView postArguments={proposalArguments} showAccountArguments={false} />
							: null}
					</div>
					<Row gutter={40}>
						<Col span={24}>
							{ metaDescription &&
								<>
									<h6>Description</h6>
									<p className='text-navBlue leading-6'>{metaDescription}</p>
								</>
							}
						</Col>
					</Row>
					<ProposalInfo preimage={preimage}/>
					<Col span={24}>
						<ExternalLinks isTechCommitteeProposal={true} onchainId={onchainLink.onchain_tech_committee_proposal_id} />
					</Col>
				</div>
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
		<Row className='motion-sub-info with-table'>
			{preimageMethod &&
				<>
					<Col span={12}>
						<h6>Method</h6>
						{preimageMethod}
					</Col>
					<Col className='arguments-col' span={12}>
						{preimageArguments && preimageArguments.length
							? <ArgumentsTableJSONView postArguments={preimageArguments} showAccountArguments={true} />
							: null}
					</Col>
				</>
			}
			<Col span={12}>
				{ metaDescription &&
					<>
						<h6>Description</h6>
						{metaDescription}
					</>
				}
			</Col>
		</Row>
	);
};

export default PostTechCommitteeProposalInfo;