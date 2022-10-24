// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Card } from 'antd';
import React from 'react';
import { useOptionPollQuery } from 'src/generated/graphql';

import OptionPoll from './OptionPoll';

interface Props {
	postId: number
	canEdit: boolean
}

// eslint-disable-next-line react/display-name
export default ({ postId, canEdit }: Props) => {
	const { data, error } = useOptionPollQuery({ variables: { postId } });

	if (error?.message) return <Card>{error.message}</Card>;

	if (!data?.option_poll?.length) {
		return null;
	}

	return <>
		{data?.option_poll.map(poll => (
			<OptionPoll
				key={poll.id}
				optionPollId={poll.id}
				question={poll.question}
				options={poll.options}
				endAt={poll.end_at}
				canEdit={canEdit}
			/>
		))}
	</>;
};
