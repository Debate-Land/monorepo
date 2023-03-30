import React from 'react'
import Image from 'next/image'
import { FaSun, FaMoon } from 'react-icons/fa'
import { useTheme } from 'next-themes'
import { withRouter } from 'next/router'
import { useScrollYPosition } from 'react-use-scroll-position'
import clsx from 'clsx'
import Logo32 from '../../../public/assets/img/logo_32.png'
import { Text, Button, Link } from '@shared/components'

const Header = ({ router }: any) => {
	const { theme, setTheme } = useTheme()
	const scrollY = useScrollYPosition()
	const headerWrapperStyle = 'px-2 rounded-xl bg-gray-200/40 hover:bg-gray-200/80'
	const headerTextStyle = 'hidden sm:inline-block !text-blue-300 hover:!text-blue-400'

	return (
		<header
			className={clsx('h-[3.35rem] fixed w-full z-40 p-2 flex justify-between', {
				'bg-white dark:bg-stone-900': router.pathname !== '/' && scrollY < 33,
				'backdrop-blur-xl': scrollY > 33,
			})}
		>
			<a
				className="flex items-center space-x-2 min-w-[200px] bg-gradient-to-r from-sky-500 via-purple-600 to-violet-500 px-2 py-1 rounded-lg"
				href="/"
			>
				<Image src={Logo32} draggable={false} alt="Debate Land" />
				<Text size="2xl" className="mt-[1px] !text-white">
					Debate Land
				</Text>
			</a>
			<div className="flex items-center space-x-2">
				<Link primary external href="https://cutit.cards" text="Cut It" className={headerTextStyle} wrapperClassName={headerWrapperStyle} />
				<Link primary href="/#about" text="About" className={headerTextStyle} wrapperClassName={headerWrapperStyle} />
				<Link primary href="/#mobile" text="Mobile" className={headerTextStyle} wrapperClassName={headerWrapperStyle} />
				<Link primary href="/#api" text="API" className={headerTextStyle} wrapperClassName={headerWrapperStyle} />
				<span className="w-2" />
				<Button
					icon={theme === 'dark' ? <FaSun /> : <FaMoon />}
					className="!bg-indigo-300"
					onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
				/>
			</div>
		</header>
	)
}

export default withRouter(Header)
