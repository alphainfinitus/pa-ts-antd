// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetChildBountiesOfParentBountyLazyQuery } from 'src/generated/graphql';
import FilteredError from 'src/ui-components/FilteredError';
import GovSidebarCard from 'src/ui-components/GovSidebarCard';
import StatusTag from 'src/ui-components/StatusTag';

interface Props {
	onchainId: number
}

const BountyChildBounties = ({ onchainId }: Props) => {
	const [refetch, { data, error }] = useGetChildBountiesOfParentBountyLazyQuery({ variables: { parent_bounty_id: onchainId } });

	useEffect(() => {
		refetch();
	}, [refetch]);

	if (error?.message) return <FilteredError text={error.message}/>;

	console.log('data : ', data);

	return (
		onchainId && data && data.childBounties.length > 0 ?
			<GovSidebarCard>
				<h4 className='dashboard-heading mb-6'>{data.childBounties.length} Child Bounties</h4>

				{data.childBounties.map(childBounty => (
					childBounty && <Link to={`/child_bounty/${childBounty.childBountyId}`} key={childBounty.childBountyId} className='mb-6'>
						<div className='my-4 border-2 border-grey_light hover:border-pink_primary hover:shadow-xl transition-all duration-200 rounded-md p-2 md:p-4'>
							<div className="flex justify-between gap-x-4">
								<div className='w-[70%] break-words'>
									<h5>{childBounty.description} || {`#${childBounty.childBountyId} Untitled`}</h5>
								</div>
								{childBounty.childBountyStatus && <StatusTag className='statusTag' status={childBounty.childBountyStatus?.[1].status} />}
							</div>
						</div>
					</Link>
				))}
			</GovSidebarCard>
			: <></>
	);
};

export default BountyChildBounties;
