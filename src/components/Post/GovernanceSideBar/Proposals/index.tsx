// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { formatBalance } from '@polkadot/util';
import React, { useContext, useEffect, useState } from 'react';
import { ApiContext } from 'src/context/ApiContext';
import { chainProperties } from 'src/global/networkConstants';
import { LoadingStatusType } from 'src/types';
import GovSidebarCard from 'src/ui-components/GovSidebarCard';
import getNetwork from 'src/util/getNetwork';

import ProposalVoteInfo from './ProposalVoteInfo';
import SecondProposal, { SecondProposalProps } from './SecondProposal';

type Props = SecondProposalProps & {
	canVote: boolean
}

const network = getNetwork();
const tokenDecimals = chainProperties[network].tokenDecimals;
const tokenSymbol = chainProperties[network].tokenSymbol;

const ProposalDisplay = ({ proposalId, accounts, address, canVote, getAccounts, onAccountChange }: Props) => {
	const { api, apiReady } = useContext(ApiContext);
	const [seconds, setSeconds] = useState(0);
	const [deposit, setDeposit] = useState('');
	const [loadingStatus, setLoadingStatus] = useState<LoadingStatusType>({ isLoading: true, message:'Loading proposal info' });

	useEffect(() => {
		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		let unsubscribe: () => void;

		api.derive.democracy.proposals( proposals => {
			proposals.forEach((proposal) => {
				if (proposal.index.toNumber() === proposalId && proposal.balance) {
					setLoadingStatus({ isLoading: false, message: '' });
					setSeconds(proposal.seconds.length);
					setDeposit(
						`${formatBalance(
							proposal.balance,
							{ decimals: tokenDecimals, forceUnit: tokenSymbol, withUnit: false }
						)} ${tokenSymbol}`
					);
				}
			});
		})
			.then(unsub => {unsubscribe = unsub;})
			.catch(e => console.error(e));

		return () => unsubscribe && unsubscribe();

	}, [api, apiReady, proposalId]);

	return (
		<GovSidebarCard>
			<h6 className="dashboard-heading mb-6">Second this Proposal!</h6>
			{canVote &&
				<SecondProposal
					accounts={accounts}
					address={address}
					getAccounts={getAccounts}
					onAccountChange={onAccountChange}
					proposalId={proposalId}
				/>
			}
			{(proposalId || proposalId === 0) &&
				<ProposalVoteInfo
					deposit={deposit}
					loadingStatus={loadingStatus}
					seconds={seconds}
				/>}
		</GovSidebarCard>
	);
};

export default ProposalDisplay;
