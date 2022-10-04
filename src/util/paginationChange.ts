// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

interface Props {
	activePage: string | number | undefined
	setPage: React.Dispatch<React.SetStateAction<number>>
	setOffset: React.Dispatch<React.SetStateAction<number>>
	limit: number
}

const paginationChange = ({ activePage, limit, setPage, setOffset } : Props) => {
	window.scrollTo(0, 0);
	const nextPage = Math.ceil(Number(activePage));
	setPage(nextPage);
	setOffset(Math.ceil(limit * (nextPage - 1)));
};

export default paginationChange;