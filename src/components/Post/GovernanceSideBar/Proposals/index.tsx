// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { formatBalance } from '@polkadot/util';
import React, { useCallback, useEffect, useState } from 'react';
import { chainProperties } from 'src/global/networkConstants';
import { LoadingStatusType } from 'src/types';
import GovSidebarCard from 'src/ui-components/GovSidebarCard';
import getNetwork from 'src/util/getNetwork';

import ProposalVoteInfo from './ProposalVoteInfo';
import SecondProposal, { SecondProposalProps } from './SecondProposal';

type Props = SecondProposalProps & {
	canVote: boolean;
	status?: string;
}

const network = getNetwork();
const tokenDecimals = chainProperties[network].tokenDecimals;
const tokenSymbol = chainProperties[network].tokenSymbol;

const ProposalDisplay = ({ proposalId, accounts, address, canVote, getAccounts, onAccountChange, status }: Props) => {
	const [seconds, setSeconds] = useState(0);
	const [deposit, setDeposit] = useState('');
	const [loadingStatus, setLoadingStatus] = useState<LoadingStatusType>({ isLoading: true, message:'Loading proposal info' });

	const fetchProposal = useCallback(() => {
		fetch(`https://${getNetwork()}.api.subscan.io/api/scan/democracy/proposal`, { body: JSON.stringify({
			democracy_id: proposalId
		}), method: 'POST' }).then(async (res) => {
			const response = await res.json();
			const info = response?.data?.info;
			setLoadingStatus({ isLoading: false, message: '' });
			setSeconds(info?.seconded_count);
			setDeposit(
				`${formatBalance(
					info?.value,
					{ decimals: tokenDecimals, forceUnit: tokenSymbol, withUnit: false }
				)} ${tokenSymbol}`
			);
		}).catch((err) => {
			console.log('Fetch Proposal Err:', err);
		});
	}, [proposalId]);

	useEffect(() => {
		fetchProposal();
	}, [fetchProposal, proposalId, status]);

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
