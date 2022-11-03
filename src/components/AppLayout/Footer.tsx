// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import styled from '@xstyled/styled-components';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNetworkSocialsLazyQuery } from 'src/generated/graphql';
import getNetwork from 'src/util/getNetwork';

import { ReactComponent as PALogoBlack } from '../../assets/pa-logo-black.svg';
import { socialLinks } from '../Home/AboutNetwork';

const network = getNetwork();

const Footer = ({ className } : { className?:string }) => {
	const [refetch, {
		data, error
	}] = useNetworkSocialsLazyQuery({ variables: {
		network
	} });

	useEffect(() => {
		refetch();
	}, [refetch]);

	return (
		<footer aria-label="Site Footer" className={`${className} bg-white`}>
			<div className="mx-auto max-w-screen-xl px-4 pt-12 pb-6 sm:px-6 lg:px-8">
				<div className="flex flex-col md:flex-row">
					{/* Logo and Network Link */}
					<div>
						<div className="flex justify-center sm:justify-start">
							<Link className='flex' to='/'><PALogoBlack className='h-auto w-[180px]' /></Link>
						</div>

						<p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-sidebarBlue sm:mx-0 sm:max-w-xs sm:text-left">
							Polkassembly is a unified platform to discuss and vote on governance proposals, motions and referandas.
						</p>

						<h2 className="mt-8 text-sidebarBlue text-sm capitalize text-center md:text-left">{network} Network Links: </h2>
						<div className='mt-3 flex justify-center md:inline-block'>{!error && data && socialLinks(data.blockchain_socials[0])}</div>
					</div>

					{/* Terms Links */}
					<div className="mt-10 md:mt-0 mx-auto md:mx-0 md:ml-auto flex flex-col md:flex-row justify-center md:justify-end">
						<div className="md:ml-10 lg:ml-14 text-center sm:text-left">
							<p className="text-lg font-medium text-sidebarBlue">Help Center</p>

							<nav aria-label="Footer About Nav" className="mt-4 md:mt-8">
								<ul className="space-y-4 text-sm">
									<li>
										<Link to='/terms-and-conditions'>
											Terms and Conditions
										</Link>
									</li>

									<li>
										<a href='https://github.com/premiurly/polkassembly/issues' target='_blank' rel='noreferrer'>
											Report an Issue
										</a>
									</li>
								</ul>
							</nav>
						</div>

						<div className="mt-10 md:mt-0 md:ml-10 lg:ml-14 text-center sm:text-left">
							<p className="text-lg font-medium text-sidebarBlue">Our Services</p>

							<nav aria-label="Footer Services Nav" className="mt-4 md:mt-8">
								<ul className="space-y-4 text-sm">
									<li>
										<Link to={'/terms-of-website'} >
											Terms of Website
										</Link>
									</li>

									<li>
										<Link to={'/privacy'}>
											Privacy Policy
										</Link>
									</li>
								</ul>
							</nav>
						</div>
					</div>
				</div>

				{/* Below divider */}
				<div className="mt-12 border-t border-gray-100 pt-6">
					<div className="text-center sm:flex sm:justify-between sm:text-left">
						<p className="text-sm text-gray-500">
							<span className="block sm:inline">All rights reserved.</span>
						</p>

						<p className="mt-4 text-sm text-gray-500 sm:order-first sm:mt-0">
          &copy; 2022 Premiurly
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default styled(Footer)`
	.anticon:hover {
		outline: pink_primary 2px solid;
		path {
			fill: pink_primary !important;
		}
	}
`;