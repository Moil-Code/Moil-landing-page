import MobilePricingItem from "../components/mobile_pricing_item";
import PricingHeaderForPringItem from "../components/pricing_header";
import { nanoid } from "nanoid";

export default function DetailedPricinSection({ refQuery, lgQuery, allShow }: any) {

  const pricingHeaders = [
    {
      plan: "BASIC",
      price: {
        monthly: 0,
        annually: 0
      },
      percentage_off: 0,
      cta: "Get Started Free",
      flowId: {
        monthly: nanoid() + nanoid() + '_basic_monthly',
        annually: nanoid() + nanoid() + '_basic_yearly'
      }
    },
    {
      plan: "PREMIUM",
      price: {
        monthly: 15,
        annually: 140
      },
      percentage_off: 22,
      cta: "Start Free Trial",
      tag: "Best Value",
      flowId: {
        monthly: nanoid() + nanoid() + '_premium_monthly',
        annually: nanoid() + nanoid() + '_premium_yearly'
      }
    }
  ];

  const pricingDetails = [
     {
      label: "Job Postings",
      values: ["1 per month", "3 per month"]
    },
      {
      label: "Bilingual Support",
      values: ["English only", "English & Spanish"]
    },
    {
      label: "Moil AI Toolbox",
      values: ["Basic tools", "Full access to all tools"]
    },
    {
      label: "Support",
      values: ["Community support", "Priority email support"]
    },
    {
      label: "AI Market Research Assistant",
      values: ["N/A", "Full access"]
    },
    {
      label: "AI Business Coach",
      values: ["N/A", "Full strategy, planning & execution support"]
    },
    {
      label: "AI-Generated Images",
      values: ["N/A", "50 per month"]
    },  
  ];

  const mobilePricingDetails = [
    {
      "pricing_header": {
        plan: "BASIC",
        price: {
          monthly: 0,
          annually: 0
        },
        percentage_off: 0,
        cta: "Get Started Free",
        flowId: {
          monthly: nanoid() + nanoid() + '_basic_monthly',
          annually: nanoid() + nanoid() + '_basic_yearly'
        }
      },
      label: ["ai_research", "ai_coach", "job_postings", "ai_images", "bilingual", "toolbox", "support"],
      values: [
         ["Job Postings", "1 per month"],
        ["AI Market Research Assistant", "Limited access"],
        ["AI Business Coach", "N/A"],
       
        ["AI-Generated Images", "50 per month"],
        ["Bilingual Support", "English & Spanish"],
        ["Moil AI Toolbox", "Full access to all tools"],
        ["Support", "Priority email support"]
      ]
    },
    {
      "pricing_header": {
        plan: "PREMIUM",
        price: {
          monthly: 15,
          annually: 140
        },
        percentage_off: 22,
        cta: "Start Free Trial",
        tag: "Best Value",
        flowId: {
          monthly: nanoid() + nanoid() + '_premium_monthly',
          annually: nanoid() + nanoid() + '_premium_yearly'
        }
      },
      label: ["ai_research", "ai_coach", "job_postings", "ai_images", "bilingual", "toolbox", "support"],
      values: [
         ["Job Postings", "3 per month"],
        ["AI Market Research Assistant", "Full access"],
        ["AI Business Coach", "Full strategy, planning & execution support"],
        ["AI-Generated Images", "50 per month"],
        ["Bilingual Support", "English & Spanish"],
        ["Moil AI Toolbox", "Full access to all tools"],
        ["Support", "Priority email support"]
      ]
    }
  ];



  return (
    <div className="xl:max-w-[1000px] xtraxl:max-w-[1200px]">
      <table className="hidden md:table table-fixed w-full border-collapse border border-[#E6E9F5]">
        <thead>
          <th className="w-[90%]">
            <p className="text-[30px] font-[700] leading-[1.2] text-[#252430]">Annual Plans</p>
          </th>

          {
            pricingHeaders.map((head, index) => {
              return (
                <th className={` ${head.plan === "PREMIUM" ? "w-[115%] bg-[#EEECF8]" : "w-full"} border border-[#E6E9F5]`}>
                  <PricingHeaderForPringItem refQuery={refQuery} lgQuery={lgQuery} flowId={head.flowId} allShow={allShow} plan={head.plan} percentage_off={head.percentage_off} price={head.price} cta={head.cta} key={index} />
                </th>
              )
            })
          }

        </thead>

        <tbody>
          {
            pricingDetails.map((det, index) => {
              return (
                <tr key={index}>
                  <td className="border border-[#E6E9F5]">
                    <div className="py-6 px-8">
                      <p className="text-[18px] font-mdeium font-medium leading-[1.3] text-[#252430]">{det.label}</p>
                    </div>
                  </td>
                  {
                    det.values.map((d, i) => {
                      return (
                        <td className="border border-[#E6E9F5]">
                          <div className="py-6 px-8">
                            <p className="text-[14px] font-mdeium font-medium leading-[1.3] text-[#252430]">{d}</p>
                          </div>
                        </td>
                      )
                    })
                  }
                </tr>
              )
            })
          }
        </tbody>
      </table>

      <div className="md:hidden flex flex-col">
        {
          mobilePricingDetails.map((head, index) => {
            return (
              <MobilePricingItem flowId={head.pricing_header.flowId} values={head.values} allShow={allShow} plan={head.pricing_header.plan} percentage_off={head.pricing_header.percentage_off} price={head.pricing_header.price} cta={head.pricing_header.cta} refQuery={refQuery} lgQuery={lgQuery} key={index} />
            )
          })
        }
      </div>

      {/* Partnership Programs Section */}
      <div className="mt-16 space-y-12">
        <div className="text-center">
          <h2 className="text-[36px] font-[700] leading-[1.2] text-[#252430] mb-4">Partnership Programs</h2>
          <p className="text-[18px] text-[#6B7280] max-w-3xl mx-auto">
            Empower your community with Moil's AI-powered business tools through our comprehensive partnership programs.
          </p>
        </div>

        {/* Community Partner Program */}
        <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] rounded-2xl p-8 border border-[#E2E8F0]">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#6366F1] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.121M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.121M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[24px] font-[600] text-[#252430]">Community Partner Program</h3>
                  <p className="text-[14px] text-[#6B7280]">For chambers, associations, and nonprofits supporting 10–49 businesses</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[16px] font-[600] text-[#252430] mb-3">What Your Organization Gets:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-[#10B981] rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[14px] text-[#374151]">Member portal (semi-white label)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-[#10B981] rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[14px] text-[#374151]">License management dashboard</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-[#10B981] rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[14px] text-[#374151]">Staff training and rollout support</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-[#10B981] rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[14px] text-[#374151]">Quarterly usage & impact summaries</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-6">
                <h4 className="text-[16px] font-[600] text-[#252430] mb-3">What Your Members Get:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#3B82F6] rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[14px] text-[#374151]">AI market research & business coaching</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#3B82F6] rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[14px] text-[#374151]">3 job postings per month</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#3B82F6] rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[14px] text-[#374151]">Up to 50 AI-generated images per month</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#3B82F6] rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[14px] text-[#374151]">Full AI toolbox access</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#3B82F6] rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[14px] text-[#374151]">Bilingual support (English & Spanish)</span>
                  </li>
                </ul>
              </div>

              <a href="https://calendly.com/andresmoil/moil-demo" target="_blank" rel="noopener noreferrer" className="block w-full">
                <button className="w-full bg-[#6366F1] hover:bg-[#5B5BD6] text-white font-[600] py-4 px-6 rounded-xl transition-colors duration-200">
                  Talk About a Community Program
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* Economic & Workforce Development Partnership */}
        <div className="bg-gradient-to-br from-[#FEF7FF] to-[#F3E8FF] rounded-2xl p-8 border border-[#E9D5FF]">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#8B5CF6] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[24px] font-[600] text-[#252430]">Economic & Workforce Development Partnership</h3>
                  <p className="text-[14px] text-[#6B7280]">For EDCs, workforce boards, and city or regional initiatives supporting 50+ businesses</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[16px] font-[600] text-[#252430] mb-3">Program Benefits:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-[#8B5CF6] rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[14px] text-[#374151]">Private, white-labeled portal for your community</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-[#8B5CF6] rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[14px] text-[#374151]">Admin dashboard to assign and track licenses</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-[#8B5CF6] rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[14px] text-[#374151]">Training and ongoing support for your team</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-[#8B5CF6] rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[14px] text-[#374151]">Reporting on usage, hiring activity, and engagement</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-[#8B5CF6] rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[14px] text-[#374151]">Integrated free hiring support for each participating business</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-[#8B5CF6] rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[14px] text-[#374151]">Priority partner status for pilots and new features</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-6">
                <h4 className="text-[16px] font-[600] text-[#252430] mb-3">What Businesses Get:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#F59E0B] rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[14px] text-[#374151]">AI market research & coaching</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#F59E0B] rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[14px] text-[#374151]">3 job postings per month</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#F59E0B] rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[14px] text-[#374151]">Up to 50 AI-generated images per month</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#F59E0B] rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[14px] text-[#374151]">Full Moil AI toolbox</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#F59E0B] rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[14px] text-[#374151]">Bilingual access</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <a href="https://calendly.com/andresmoil/moil-demo" target="_blank" rel="noopener noreferrer" className="block w-full">
                  <button className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-[600] py-4 px-6 rounded-xl transition-colors duration-200">
                    Schedule a Partnership Call
                  </button>
                </a>
                <p className="text-[12px] text-[#6B7280] text-center">
                  Custom pricing available based on community size and needs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        {/* <div className="bg-[#252430] rounded-2xl p-8 text-center">
          <h3 className="text-[28px] font-[700] text-white mb-4">Ready to Partner with Moil?</h3>
          <p className="text-[16px] text-[#9CA3AF] mb-6 max-w-2xl mx-auto">
            Join organizations across the country that are empowering their business communities with AI-powered tools. 
            Let's discuss how we can customize a partnership program for your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#6366F1] hover:bg-[#5B5BD6] text-white font-[600] py-3 px-8 rounded-xl transition-colors duration-200">
              Schedule a Partnership Call
            </button>
            <button className="border border-[#4B5563] hover:border-[#6B7280] text-white font-[600] py-3 px-8 rounded-xl transition-colors duration-200">
              Download Partnership Guide
            </button>
          </div>
        </div> */}
      </div>
    </div>
  )
}
