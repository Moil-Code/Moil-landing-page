import { StarSvg } from "./svgs";

export default function TestimonialItem({ testimonialImage, testimonialName, testimonial }: { testimonialImage: string, testimonialName: string, testimonial: string }) {
	return (
		<div className="lg:max-w-[450px] xl:min-w-[450px] carousel-item w-full h-full p-10 bg-white rounded-lg">
			<div className="flex flex-col gap-y-4">
				<div className="flex gap-y-4 flex-col md:flex-row justify-between">
					<div className="flex items-center gap-x-2">
						<img className="w-[56px] h-[56px] rounded-lg" src={testimonialImage} />
						<p className="text-[20px] leading-[1.2] text-black font-semibold">
							{testimonialName}
						</p>
					</div>

					<div className="flex items-center gap-x-1">
						<StarSvg />
						<StarSvg />
						<StarSvg />
						<StarSvg />
						<StarSvg />
					</div>
				</div>

				<div>
					<p className="text-base leading-[1.25] text-black font-normal">
						{testimonial}
					</p>
				</div>
			</div>
		</div>
	)
}