// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { CameraOutlined, CloseOutlined, LinkOutlined, PlusOutlined } from '@ant-design/icons';
import { QueryLazyOptions } from '@apollo/client';
import { Alert, Button, Input, Modal, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { Exact, GetUserDetailsQuery, useAddProfileMutation } from 'src/generated/graphql';
import { NotificationStatus } from 'src/types';
import queueNotification from 'src/ui-components/QueueNotification';

import noUserImage from '../../assets/no-user-img.png';

interface Props {
    setEditProfile: React.Dispatch<React.SetStateAction<boolean>>
	refetch: (options?: QueryLazyOptions<Exact<{
		user_id: number;
	}>> | undefined) => void
    id?: number | null;
    data?: GetUserDetailsQuery
}

const EditProfileModal = ({ data, refetch, setEditProfile, id }: Props) => {
	const [title, setTitle] = useState<string>('aaa');
	const [badges, setBadges] = useState<string[]>([]);
	const [bio, setBio] = useState<string>('');
	const [newBadge, setNewBadge] = useState<string>('');
	const [userImage, setUserImage] = useState<string>('');
	const [, setErrorsFound] = useState<string[]>([]);

	const [openModal, setOpenModal] = useState<boolean>(false);
	const [imgUrl, setImgUrl] = useState<string>('');
	const [finalImgUrl, setFinalImgUrl] = useState<string>('');

	const [newBadgeError, setNewBadgeError] = useState<boolean>(false);
	const [imageUrlError, setImageUrlError] = useState<boolean>(false);

	useEffect(() => {
		if(data?.userDetails) {
			populateState(data);
		}else{
			setBio('');
			setUserImage('');
			setTitle('');
			setBadges([]);
		}
	}, [data]);

	function populateState(data: GetUserDetailsQuery) {
		if(data?.userDetails) {
			setBio(`${data.userDetails.bio}`);
			setUserImage(`${data.userDetails.image}`);
			setImgUrl(`${data.userDetails.image}`);
			setFinalImgUrl(`${data.userDetails.image}`);
			setTitle(`${data.userDetails.title}`);
			if (data.userDetails.badges) {
				setBadges(JSON.parse(data.userDetails.badges));
			}
		}
	}

	const [addProfileMutation, { error, loading }] = useAddProfileMutation({
		variables: {
			badges: JSON.stringify(badges),
			bio: bio,
			image: finalImgUrl,
			title: title,
			user_id: Number(id)
		}
	});

	const closeEditProfileSidebar = () => {
		setEditProfile(false);
		setTitle('');
		setBadges([]);
		setNewBadge('');
		setBio('');
		setUserImage('');
		setErrorsFound([]);
	};

	const confirmProfileImage = () => {
		// eslint-disable-next-line no-useless-escape
		const regex = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi);
		if(imgUrl.match(regex)) {
			setFinalImgUrl(imgUrl);
			setOpenModal(false);
		}else {
			setImageUrlError(true);
		}
	};

	const updateProfileData = () => {
		addProfileMutation({
			variables: {
				badges: JSON.stringify(badges),
				bio: bio,
				image: finalImgUrl,
				title: title,
				user_id: Number(id)
			}
		}).then(({ data }) => {
			if (data?.addProfile && data?.addProfile?.message){
				refetch();
				setEditProfile(false);
				queueNotification({
					header: 'Success!',
					message: 'Your profile was updated.',
					status: NotificationStatus.SUCCESS
				});
			}
		}).catch((e) => {
			console.error('Error updating profile: ',e);
			queueNotification({
				header: 'Error!',
				message: 'Your profile was not updated.',
				status: NotificationStatus.ERROR
			});
		});
	};

	const addNewBadge = () => {
		if(!newBadge || loading){
			return;
		}

		if(!(badges.includes(newBadge.toLowerCase()))) {
			setBadges([...badges, newBadge.toLowerCase()]);
			setNewBadge('');
			setNewBadgeError(false);
		}else {
			setNewBadgeError(true);
		}
	};

	function removeBadge(badge:string){
		const badgesArr = [...badges];
		const index = badgesArr.indexOf(badge);
		if (index !== -1) {
			badgesArr.splice(index, 1);
			setBadges(badgesArr);
		}
	}

	function handleNewBadgeKeyPress(e:any) {
		if(e.key === 'Enter'){
			e.preventDefault();
			addNewBadge();
		}
	}

	const updatePhotoButton = <Button className='flex items-center justify-center absolute bottom-2 right-2 border-none outline-none bg-white rounded-full shadow-md' disabled={loading} loading={loading} onClick={() => { setImageUrlError(false); setOpenModal(true);}} icon={<CameraOutlined />} />;

	return (
		<div className='flex flex-col gap-y-5 h-full justify-between'>
			<Modal
				closable={false}
				title={
					<span
						className='text-sidebarBlue font-semibold'
					>
                        Please input the URL for your photo
					</span>
				}
				open={openModal}
				footer={[
					<Button
						key='cancel'
						onClick={() => { setImgUrl(`${data?.userDetails?.image}`); setOpenModal(false);}}
						className='border-pink_primary text-pink_primary rounded-md font-semibold'
					>
						Cancel
					</Button>,
					<Button
						key='confirm'
						onClick={confirmProfileImage}
						icon={<CameraOutlined />}
						className='border-pink_primary text-white rounded-md font-semibold bg-pink_primary inline-flex items-center'
					>
                        Confirm
					</Button>
				]}
				className='md:min-w-[650px]'
			>
				<div className='flex flex-col gap-y-2'>
					<p>
						<b>Instructions : </b>
                        Please provide a url of your profile photo using a service such as
						<a href='https://postimages.org/' target='_blank' rel="noreferrer">
							{' '}postimages.org{' '}
						</a>
                    to upload and generate a direct link.
					</p>
					<p><i>Please remember to copy the direct link.</i></p>
					<Input
						className='profile-link-input'
						size='large'
						type='url'
						prefix={<LinkOutlined />}
						placeholder='Profile Picture URL'
						onChange={(e) => setImgUrl(e.target.value)}
						value={imgUrl}
						disabled={loading}
					/>
					{
						imageUrlError &&
                    <Alert message='Please ensure the input is a valid link.' type='error' />
					}
				</div>
			</Modal>
			{error && <Alert message={error.message} type='error' />}
			<article className='flex flex-col gap-y-2 items-start'>
				<h3 className='font-semibold text-2xl text-sidebarBlue'>
                    Edit Profile
				</h3>
				{userImage || finalImgUrl ?
					<div className='relative flex items-center justify-center'>
						<img className='flex h-w-32 w-32 rounded-full' src={finalImgUrl ? finalImgUrl : userImage} alt="user avatar" />
						{updatePhotoButton}
					</div>
					: <div className=''>
						<img className='flex h-w-32 w-32 rounded-full' src={noUserImage} alt="user avatar" />
						{updatePhotoButton}
					</div>
				}
			</article>
			<article>
				<label
					className='text-base text-grey_primary font-medium cursor-pointer'
					htmlFor='title'
				>
					Job Title
				</label>
				<Input
					id='title'
					value={title}
					placeholder='eg. Manager'
					onChange={(e) => setTitle(e.target.value)}
					className="rounded-md py-2 px-3 border-grey_border"
				/>
			</article>
			<article>
				<label
					className='text-base text-grey_primary font-medium cursor-pointer'
					htmlFor='bio'
				>
					Bio
				</label>
				<Input.TextArea
					id='bio'
					value={bio}
					placeholder='eg. I am a Web Developer'
					onChange={(e) => setBio(e.target.value)}
					className="rounded-md py-2 px-3 border-grey_border"
				/>
			</article>
			<article className='flex flex-col gap-y-4'>
				<label
					className='text-base text-grey_primary font-medium cursor-pointer'
					htmlFor='badges'
				>
                        Badges
				</label>
				<p className='text-grey_secondary text-sm'>
                        Badges are pointers that indicate individual successes, abilities, skills and/or interests.
				</p>
				<div className='flex gap-x-2 items-center'>
					<Input
						id='badges'
						value={newBadge}
						placeholder='eg. Movie'
						onChange={(e) => setNewBadge(e.target.value)}
						onKeyPress={(e: any) => handleNewBadgeKeyPress(e)}
						className="rounded-md py-1.5 px-3 border-grey_border"
					/>
					<Button
						className='border-pink_primary text-pink_primary flex items-center text-xs rounded-md font-semibold'
						icon={<PlusOutlined />}
						onClick={() => addNewBadge()}
					>
                        Add Badge
					</Button>
				</div>
				{ newBadgeError && <Alert message='This badge already exists.' type='warning' /> }
				{
					badges.length >= 0 &&
                        <div>{badges.map((badge) => (<Tag closeIcon={<CloseOutlined className='m-0 p-0 flex text-white' />} className='capitalize rounded-full inline-flex font-medium outline-none border-none shadow-none px-3 py-0.5 gap-x-1 items-center bg-pink_primary text-white' key={badge} closable onClose={(e) => {e.preventDefault();removeBadge(badge);
                        }} >{badge}</Tag>))}
                        </div>
				}
			</article>
			<article className='flex gap-x-2 justify-end'>
				<Button
					key='cancel'
					onClick={closeEditProfileSidebar}
					disabled={loading}
					size='large'
					className='border-pink_primary text-pink_primary rounded-md font-semibold'
				>
                    Cancel
				</Button>
				<Button
					key='update profile'
					disabled={loading}
					loading={loading}
					onClick={updateProfileData}
					size='large'
					className='border-pink_primary text-white rounded-md font-semibold bg-pink_primary'
				>
                    Update Profile
				</Button>
			</article>
		</div>
	);
};

export default EditProfileModal;
