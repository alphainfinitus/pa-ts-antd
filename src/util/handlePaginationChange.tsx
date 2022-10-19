// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

interface Args {
	LIMIT: number;
	page:number;
	setOffset: (value: React.SetStateAction<number>) => void;
}
export const handlePaginationChange = ({ LIMIT, page, setOffset }: Args) => {
	window.scrollTo(0, 300);
	setOffset(Math.ceil(LIMIT * (page - 1)));
};