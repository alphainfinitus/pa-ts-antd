// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import cleanError from 'src/util/cleanError';

interface ErrorProps{
	text: string
}

const FilteredError = ({ text } : ErrorProps) => {
	return <div className='text-sm text-red_secondary'>
		{cleanError(text)}
	</div>;
};

export default FilteredError;
