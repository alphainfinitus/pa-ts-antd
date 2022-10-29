// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { useOptionPollQuery } from 'src/generated/graphql';
import ErrorAlert from 'src/ui-components/ErrorAlert';

import OptionPoll from './OptionPoll';

interface Props {
	className?: string;
	postId: number;
	canEdit: boolean;
}

// eslint-disable-next-line react/display-name
export default ({ className, postId, canEdit }: Props) => {
	const { data, error } = useOptionPollQuery({ variables: { postId } });

	if (error?.message) return <ErrorAlert errorMsg={error.message} />;

	if (!data?.option_poll?.length) {
		return null;
	}

	return <div className={className}>
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
	</div>;
};
