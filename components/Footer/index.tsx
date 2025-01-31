import {
	Box,
	chakra,
	Container,
	Stack,
	useColorMode,
	useColorModeValue,
	VisuallyHidden,
} from '@chakra-ui/react';
import { ReactElement, ReactNode } from 'react';
import { useTranslations } from 'use-intl';
import { trackEvent } from '../../libs/gtag';
import { EVENTS, EVENTS_CATEGORIES } from '../../utils/events';
import { ISocialIcon, socialLinks } from './social-links';
import Image from 'next/image';

const SocialButton = ({
	children,
	label,
	href,
}: {
	children: ReactNode;
	label: string;
	href: string;
}) => {
	return (
		<chakra.button
			rounded={'full'}
			w={8}
			h={8}
			cursor={'pointer'}
			as={'a'}
			href={href}
			display={'inline-flex'}
			alignItems={'center'}
			justifyContent={'center'}
			transition={'background 0.3s ease'}
			_hover={{
				bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
			}}
			target="_blank"
			onClick={() => {
				trackEvent({
					action: EVENTS.CLICK_ON_SOCIAL_ICON,
					label: `${label} ICON`,
					category: EVENTS_CATEGORIES.HIGH,
				});
			}}
		>
			<VisuallyHidden>{label}</VisuallyHidden>
			{children}
		</chakra.button>
	);
};

export default function Footer(): ReactElement {
	const t = useTranslations('Footer');
	const { colorMode } = useColorMode();
	const renderSocialLinks = () => {
		return socialLinks.map((socialLink: ISocialIcon) => {
			if (!socialLink.hidden) {
				return (
					<SocialButton
						href={socialLink.href}
						label={socialLink.label}
						key={socialLink.label}
					>
						{socialLink.icon}
					</SocialButton>
				);
			}

			return null;
		});
	};

	return (
		<Box color={useColorModeValue('gray.700', 'gray.200')}>
			<Container
				as={Stack}
				maxW={'xl'}
				my={8}
				direction={{ base: 'column', md: 'row' }}
				spacing={4}
				justify={{ base: 'center', md: 'space-between' }}
				align={{ base: 'center', md: 'center' }}
			>
				<div
					className="post-image-container"
					style={{
						width: '100px',
						...(colorMode === 'dark' ? { filter: 'invert(1)' } : {}),
					}}
					title={t('copyright')}
				>
					<Image
						src="/static/images/signature.png"
						layout="fill"
						className="image"
						alt="signature"
						priority
					/>
				</div>
				<Stack direction={'row'} spacing={1}>
					{renderSocialLinks()}
				</Stack>
			</Container>
		</Box>
	);
}
