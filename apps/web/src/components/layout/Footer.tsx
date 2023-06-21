/* eslint-disable @next/next/no-html-link-for-pages */
import React from 'react'
import Image from 'next/image'
import { Text, Link } from '@shared/components'
import { BsGithub, BsApple } from 'react-icons/bs'
import { DiAndroid } from 'react-icons/di'
import { RiScissors2Fill } from 'react-icons/ri'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import Vercel from '../../../public/assets/img/vercel-sponsorship.svg'
import { useRouter } from 'next/router'

const Footer = () => {
	const router = useRouter();

	return (
		<footer className="z-20 border-t border-gray-400 bg-luka-200/90 backdrop-blur-3xl text-white relative">
			<span className="bg-grid bg-fixed absolute inset-0 -z-10" />
			<div className="max-w-5xl mx-auto px-6 py-12">
				<div className="xl:grid xl:grid-cols-3 xl:gap-8">
					<div className="space-y-6 xl:col-span-1 relative">
						<Text size="4xl" weight="semibold" className="opacity-80">
							Debate Land
						</Text>
						<Text weight="semibold" className="opacity-50">
							Data for all things debate.
						</Text>
						<Image
							src={Vercel}
							alt="Vercel Logo"
							className="cursor-pointer"
							onClick={() => router.push('https://vercel.com?utm_source=debate-land&utm_campaign=oss')}
						/>
						<div className="space-x-2 text-xs text-blue-300">
							<a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
							<a href="/terms-of-service" className="hover:underline">Terms of Service</a>
						</div>
					</div>
					<div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
						<div className="md:grid md:grid-cols-2 md:gap-8 ">
							<div>
								<Text capitalize weight="bold" size="xl" className="mt-2 md:mt-0">
									Resources
								</Text>
								<ul className="mt-2 space-y-2">
									<li>
										<Link href="/about" text="About" />
									</li>
									<li>
										<Link external href="/methodology" text="Methodology" />
									</li>
									<li>
										<Link href="/contact" text="Contact" />
									</li>
        <li>
										<Link href="/ods" text="Open Data Set" />
									</li>
									<li className="relative">
										<div className="absolute w-24 h-full bg-gray-200/30 backdrop-blur-sm rounded" />
										<Link
											external
											href="#"
											text="Android"
											className="!text-emerald-300 hover:text-emerald-100"
											icon={<DiAndroid />}
										/>
									</li>
									<li className="relative">
										<div className="absolute w-16 h-full bg-gray-200/30 backdrop-blur-sm rounded" />
										<Link
											external
											href="#"
											text="iOS"
											className="!text-gray-300"
											icon={<BsApple />}
										/>
									</li>
								</ul>
							</div>
							<div>
								<Text capitalize weight="bold" size="xl">
									API & OSS
								</Text>
								<ul className="mt-2 space-y-2">
									<li>
										<Link
											external
											href="https://github.com/Debate-Land"
											text="GitHub"
											icon={<BsGithub />}
											className="!text-white bg-black/70 rounded max-w-fit px-1"
										/>
									</li>
									<li className="relative">
										<div className="absolute w-24 h-full bg-gray-200/30 backdrop-blur-sm rounded" />
										<Link external href="https://dashboard.debate.land" text="Dashboard" />
									</li>
									<li>
										<Link external href="https://docs.debate.land" text="Docs" />
									</li>
									<li>
										<Link external href="https://status.debate.land" text="Status" />
									</li>
								</ul>
							</div>
						</div>
						<div className="md:grid md:grid-cols-2 md:gap-20">
							<div>
								<Text capitalize weight="bold" size="xl">
									Development
								</Text>
								<ul className="mt-2 space-y-2">
									<li>
										<Link href="/known-issues" text="Known Issues" />
									</li>
									<li>
										<Link
											href="/feedback"
											text="Feedback"
											icon={<AiOutlineInfoCircle />}
											className="text-rose-300 bg-gray-50/10 rounded-2xl max-w-fit px-2"
										/>
									</li>
									<li>
										<Link href="/roadmap" text="Roadmap" />
									</li>
									<li>
										<Link href="/blog" text="Blog" />
									</li>
								</ul>
							</div>
							<div>
								<Text capitalize weight="bold" size="xl" className="mt-2 md:mt-0">
									Misc.
								</Text>
								<ul className="mt-2 space-y-2">
									<li>
										<Link external href="https://staging.debate.land" text="Staging" />
									</li>
									<li>
										<Link external href="https://history.debate.land" text="Legacy" />
									</li>
									<li>
										<Link
											href="https://cutit.cards"
											text="Cut-It"
											icon={<RiScissors2Fill />}
											className="text-yellow-400"
										/>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-12 border-t pt-16 w-full">
					<Text className="!text-center opacity-30 mt-2">
						© {new Date().getFullYear()} Debate Land. All rights reserved.
					</Text>
				</div>
			</div>
		</footer>
	)
}

export default Footer
