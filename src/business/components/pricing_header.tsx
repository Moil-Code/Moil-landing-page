`use client`

import { businessBaseUrl } from "../../common/constants/baseUrl";
import { safeWindow } from "../../../utils/safe_window";
import { buildBusinessRegisterUrl } from "../utils/urlBuilder";

export default function PricingHeaderForPringItem({ flowId, plan, originalPrice, limitedOffer, cta, price, allShow, refQuery, lgQuery }: { flowId: any, plan: string, originalPrice?: { monthly: number, annually: number }, limitedOffer?: string, cta: string, price: { monthly: number, annually: number }, allShow: string, refQuery: string, lgQuery?: string }) {

	const handleClick = () => {
		const url = buildBusinessRegisterUrl({
			ref: refQuery,
			lg: lgQuery,
			flowId: flowId[allShow]
		});
		safeWindow?.open(url, '_blank');
	};

	return (
		<div className={`flex relative  flex-col ${plan === "STANDARD" ? "gap-y-6" : "gap-y-10"} p-6`}>
			{plan === "STANDARD" &&
				<div className="text-white absolute top-0 left-0 w-full py-2 text-center bg-[#FF6633] ">
					Recommended
				</div>
			}

			<p className={`text-[20px] lg:text-[24px] ${plan === "STANDARD" && "mt-[30px]"} text-center leading-[1.2] font-medium`}>{plan}</p>
			<div>
				{allShow === "annually" && originalPrice && (
					<p className="text-[#858BA0] text-center text-xs leading-normal line-through mb-1">
						${originalPrice.annually}/Year
					</p>
				)}
				<p className="text-[#858BA0] text-center text-sm leading-normal"><span className="text-[#252430] text-[40px] font-[700]">{`$${allShow === "monthly" ? price.monthly : price.annually} `}</span>/{allShow === "monthly" ? "Month" : "Year"}</p>
				{allShow === "annually" && limitedOffer && <p className="text-[#FF6633] text-xs leading-normal font-medium text-center mt-1">Limited offer until {limitedOffer}</p>}
			</div>
			<button onClick={handleClick} className={`py-4 rounded-[4px] whitespace-nowrap px-6 text-center w-full ${plan === "STANDARD" ? "bg-[#5843BD] text-[#E6E9F5]" : "text-[#5843BD] bg-[#EEECF8]"} text-sm md:text-xs lg:text-sm leading-normal`}>{cta}</button>
		</div>
	)
}
