`use client`

import { useEffect, useState } from "react";
import { safeWindow } from "../../../utils/safe_window";
import { businessBaseUrl } from "../../common/constants/baseUrl";
import { buildBusinessRegisterUrl } from "../utils/urlBuilder";

export default function MobilePricingItem({ flowId, plan, originalPrice, limitedOffer, cta, price, allShow, values, refQuery, lgQuery }: { flowId: any, plan: string, originalPrice?: { monthly: number, annually: number }, limitedOffer?: string, cta: string, price: { monthly: number, annually: number }, allShow: string, values: string[][], refQuery?: string, lgQuery?: string }) {
  const [oneShow, setOneShow] = useState(allShow);

  useEffect(() => {
    setOneShow(allShow);
  }, [allShow]);

  const handleClick = () => {
    const url = buildBusinessRegisterUrl({
      ref: refQuery,
      lg: lgQuery,
      flowId: flowId[oneShow]
    });
    safeWindow?.open(url, '_blank');
  };

  return (
    <div className="border my-2 border-[#E6E9F5]">
      <div className={`flex relative flex-col ${plan === "STANDARD" ? "gap-y-6" : "gap-y-10"} p-6`}>
        {plan === "STANDARD" &&
          <div className="text-white absolute top-0 left-0 w-full py-2 text-center bg-[#FF6633] ">
            Recommended
          </div>
        }

        <p className={`text-[20px] lg:text-[24px] ${plan === "STANDARD" && "mt-[30px]"} text-center leading-[1.2] font-medium`}>{plan}</p>
        <div>
          {(oneShow === "annually") && originalPrice && (
            <p className="text-[#858BA0] text-center text-xs leading-normal line-through mb-1">
              ${originalPrice.annually}/Year
            </p>
          )}
          <p className="text-[#858BA0] text-center text-sm leading-normal"><span className="text-[#252430] text-[40px] font-[700]">{`$${allShow === "monthly" || oneShow === "monthly" ? price.monthly : price.annually} `}</span>/{oneShow === "monthly" ? "Month" : "Year"}</p>
          {(oneShow === "annually") && limitedOffer && <p className="text-[#FF6633] text-xs leading-normal font-medium text-center mt-1">Limited offer until {limitedOffer}</p>}
        </div>
        <button onClick={handleClick} className={`py-4 rounded-[4px] whitespace-nowrap px-6 text-center w-full ${plan === "STANDARD" ? "bg-[#5843BD] text-[#E6E9F5]" : "text-[#5843BD] bg-[#EEECF8]"} text-sm md:text-xs lg:text-sm leading-normal`}>{cta}</button>

        <div className="flex item-center justify-center gap-x-4">
          <button
            onClick={() => setOneShow("monthly")}
            className={`${oneShow === "monthly" && allShow === "monthly" ? "bg-[#FF6633] text-white text-[#252430]" : allShow === "annually" && oneShow === "monthly" ? "bg-[#FF6633] text-white text-[#252430]" : "border_05 border-[#858BA0]"} py-[10px] px-[20px] rounded-[22px] text-center leading-normal text-xs`}>Monthly Plans</button>
          <button
            onClick={() => setOneShow("annually")}
            className={`${oneShow === "annually" && allShow === "annually" ? "bg-[#FF6633] text-white text-[#252430]" : allShow === "monthly" && oneShow === "annually" ? "bg-[#FF6633] text-white text-[#252430]" : "border_05 border-[#858BA0]"} py-[10px] px-[20px] rounded-[24px] text-center leading-normal text-xs`}>See Annual Plans</button>
        </div>
      </div>

      <table className="w-full">
        <tbody>
          {values.map((items, i) => {
            return (
              <tr key={i}>
                <td className="border border-[#E6E9F5] max-w-[150px]">
                  <div className="p-4">
                    <p className="text-xs font-medium leading-[1.3] text-[#252430]">{items[0]}</p>
                  </div>
                </td>
                <td className={`border border-[#E6E9F5] ${plan === "STANDARD" && "bg-[#EEECF8]"}`}>
                  <div className="p-4">
                    <p className={`text-base font-medium leading-[1.3] text-[#252430]`}>{items[1]}</p>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
