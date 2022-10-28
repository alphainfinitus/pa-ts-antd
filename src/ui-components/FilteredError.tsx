// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Alert } from 'antd';
import React from 'react';
import cleanError from 'src/util/cleanError';

interface ErrorProps{
	text: string
}

const FilteredError = ({ text } : ErrorProps) => {
	return (
		<div className='flex place-content-center'>
			<Alert className='text-center  max-w-sm' message={cleanError(text)} type='error' />
		</div>
	);
};

export default FilteredError;
