// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import ErrorAlert from 'src/ui-components/ErrorAlert';

import { usePollLazyQuery } from '../../../generated/graphql';
import Poll from './Poll';

interface Props {
	className?: string;
	postId: number;
	canEdit: boolean;
}

const PollComponent = ({ className, postId, canEdit }: Props) => {
	const [refetch, { data, error }] = usePollLazyQuery({ variables: { postId } });

	if (error?.message) return <div className={className}><ErrorAlert errorMsg={error.message} /></div>;

	if (!data?.poll?.[0]?.id || !data?.poll?.[0]?.block_end) {
		return null;
	}

	return (
		<Poll pollId={data?.poll?.[0]?.id} endBlock={data?.poll?.[0]?.block_end} canEdit={canEdit} pollRefetch={refetch} />
	);
};

export default PollComponent;