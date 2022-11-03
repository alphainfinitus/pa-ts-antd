// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useContext, useEffect, useState } from 'react';
import { ApiContext } from 'src/context/ApiContext';
import { useGetLatestMotionsCountLazyQuery } from 'src/generated/graphql';
import { post_type } from 'src/global/post_types';
import { ErrorState } from 'src/ui-components/UIStates';
import { LoadingState } from 'src/ui-components/UIStates';

import MembersListing from './MembersListing';

const MembersContainer = ({ className } : { className?:string }) => {
	const { api, apiReady } = useContext(ApiContext);
	const [error, setErr] = useState<Error | null>(null);
	const [members, setMembers] = useState<string[]>([]);
	const [runnersUp, setRunnersup] = useState<string[]>([]);
	const [prime, setPrime] = useState<string>('');
	useEffect(() => {
		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		api.query.council.prime().then(primeId => {
			setPrime(primeId.unwrapOr('').toString());
		}).catch(error => setErr(error));

		api.query.council.members().then((members) => {
			setMembers(members.map(member => member.toString()));
		}).catch(error => setErr(error));

		api.derive.elections.info().then((electionInfo) => {
			setRunnersup(electionInfo.runnersUp.map(runner => runner.toString().split(',')[0]));
		}).catch(error => setErr(error));

	}, [api, apiReady]);

	const [refetch] = useGetLatestMotionsCountLazyQuery({ variables: {
		postType: post_type.ON_CHAIN
	} });
	useEffect(() => {
		refetch();
	}, [refetch]);

	if (error) {
		return <ErrorState errorMessage={error.message} />;
	}

	if(members.length || runnersUp.length){

		return (
			<>
				<div className={`${className} shadow-md bg-white p-3 md:p-8 rounded-md`}>
					<div className='flex items-center justify-between'>
						<h1 className='dashboard-heading'>Members</h1>
					</div>

					<MembersListing className='mt-6' data={members} prime={prime} />
				</div>

				<div className={`${className} shadow-md bg-white p-3 md:p-8 rounded-md`}>
					<div className='flex items-center justify-between'>
						<h1 className='dashboard-heading'>Runners up</h1>
					</div>

					<MembersListing className='mt-6' data={runnersUp} prime={prime} />
				</div>
			</>
		);
	}

	return (
		<div className={className}><LoadingState /></div>
	);

};

export default MembersContainer;