// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import moment from 'moment';

export default function getRelativeCreatedAt (created_at?:Date) {
	return created_at ?
		moment(created_at).isAfter(moment().subtract(1, 'w'))
			? moment(created_at).fromNow() : moment(created_at).format('Do MMM \'YY') : null;
}

