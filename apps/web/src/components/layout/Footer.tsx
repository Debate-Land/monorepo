import React from 'react'
import { Text, Link } from '@shared/components'
import { BsGithub, BsApple } from 'react-icons/bs'
import { DiAndroid } from 'react-icons/di'

const Footer = () => {
	return (
		<footer className="z-20 border-t border-gray-400 bg-luka-200 text-white">
			<div className="max-w-5xl mx-auto px-6 py-12">
				<div className="xl:grid xl:grid-cols-3 xl:gap-8">
					<div className="space-y-6 xl:col-span-1 relative">
						<Text size="4xl" weight="semibold" className="opacity-80">
							Debate Land
						</Text>
						<Text weight="semibold" className="opacity-50">
							Data for all things debate.
						</Text>
					</div>
					<div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
						<div className="md:grid md:grid-cols-2 md:gap-8 ">
							<div>
								<Text capitalize weight="bold" size="xl">
									API
								</Text>
								<ul className="mt-2 space-y-2">
									<li>
										<Link external href="https://dashboard.debate.land" text="Dashboard" />
									</li>
									<li>
										<Link external href="https://docs.debate.land" text="Docs" />
									</li>
									<li>
										<Link external href="https://api.debate.land" text="Status" />
									</li>
								</ul>
							</div>
							<div>
								<Text capitalize weight="bold" size="xl" className="mt-2 md:mt-0">
									Resources
								</Text>
								<ul className="mt-2 space-y-2">
									<li>
										<Link href="mailto:chitgopekarsamarth@gmail.com" text="Contact" />
									</li>
									<li>
										<Link external href="https://docs.debate.land" text="Methodology" />
									</li>
									<li>
										<Link
											external
											href="https://github.com"
											text="GitHub"
											icon={<BsGithub />}
											className="!text-white bg-black/70 rounded max-w-[80px] px-1"
										/>
									</li>
									<li>
										<Link href="https://cutit.cards" text="Cut-It" />
									</li>
								</ul>
							</div>
						</div>
						<div className="md:grid md:grid-cols-2 md:gap-8">
							<div>
								<Text capitalize weight="bold" size="xl">
									Mobile
								</Text>
								<ul className="mt-2 space-y-2">
									<li>
										<Link
											external
											href="#"
											text="Android"
											className="!text-emerald-300 hover:text-emerald-100"
											icon={<DiAndroid />}
										/>
									</li>
									<li>
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
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-12 border-t pt-16 w-full">
					<Text className="!text-center opacity-30">
						All coding and design by Samarth Chitgopekar. Ranking formula by Adithya Vaidyanathan.
					</Text>
					<Text className="!text-center opacity-30 mt-2">
						© {new Date().getFullYear()} Debate Land. All rights reserved.
					</Text>
				</div>
			</div>
		</footer>
	)
}

export default Footer
