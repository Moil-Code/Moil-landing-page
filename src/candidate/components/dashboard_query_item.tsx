import React, {useEffect} from "react";
import Link from "next/link";
import {
  JobLocationSvg,
  PositionSvg,
  RecruitmentDurationSvg,
  JobTypeSvg,
} from "../../common/components/svgs";
import useOnScreen from "../../common/hooks/impress";
import { baseURL } from "../../common/constants/baseUrl";

export default function DashboardQueryItem(props: any) {
  const { recruitingUntilLabel = "Recruiting until", viewDetailsLabel = "View Job Details" } = props;

  const [ref, isVisible]: any = useOnScreen({ threshold: 0.5 });

  useEffect(() => {
    if (isVisible) {
      fetch(`${baseURL}/api/job/impressions/${props.jobUrl.split('/')[2]}`, {
        method: "PATCH",
      })
        .then(response => {
          // Convert the response to JSON
          return response.json();
        })
        .then(data => {
          // Now you can use the parsed JSON data
          console.log('Data:', data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, [isVisible]);

  return (
    <div ref={ref} className={props.indeed === false ? "moil_class w-full ipad:w-[305px] px-4 py-2 rounded-lg shadow border border-indigo-400 border-opacity-30 flex-col justify-between gap-4 items-start inline-flex" : "job-background w-full ipad:w-[305px] px-4 py-2 rounded-lg shadow border border-indigo-400 border-opacity-30 flex-col justify-between gap-4 items-start inline-flex"}>
      <div className="self-stretch flex-col justify-start items-start gap-2 flex w-full">
        <div className="self-stretch justify-start items-start gap-2 inline-flex w-full">
          <img
            className="w-12 h-12 relative rounded-lg border-2 border-white"
            src={props.profilePics}
            alt={`${props.employer} is looking for ${props.jobPosition}`}
          />
          <div className="flex-col justify-start items-start flex resp-width">
            <p className="text-indigo-700 text-base leading-tight font-semibold font-['Poppins'] truncate w-full">
              {props.experienceLevel + " " + props.jobPosition}
            </p>
            <p className="leading-tight">
              <span className="text-gray-600 text-[10px] font-medium font-['Poppins']">
              </span>
              <span className="text-indigo-700 text-[10px] font-medium font-['Poppins'] notranslate">
                {` ${props.employer}`}
              </span>
            </p>
          </div>
        </div>
        <div className="self-stretch h-16 flex-col justify-start items-start gap-2 flex">
          <div className="self-stretch justify-start items-center gap-2 inline-flex">
            <PositionSvg />
            <p className="text-slate-800 text-opacity-80 text-[10px] font-medium font-['Poppins']">
              {props.jobPosition}
            </p>
          </div>
          <div className="self-stretch justify-start items-center gap-2 inline-flex">
            <JobTypeSvg />
            <p className="text-slate-800 text-opacity-80 text-[10px] font-medium font-['Poppins']">
              {props.jobType}
            </p>
          </div>
          <div className="self-stretch justify-start items-center gap-2 inline-flex">
            <JobLocationSvg />
            <p className="grow shrink basis-0 text-slate-800 text-opacity-80 text-[10px] font-medium font-['Poppins']">
              {props.JobLocation}
            </p>
          </div>
        </div>
        <div className="justify-start items-center gap-2 inline-flex">
          <RecruitmentDurationSvg />
          <div>
            <span className="text-slate-800 text-opacity-80 text-[10px] font-medium font-['Poppins']">
              {recruitingUntilLabel}{" "}
            </span>
            <span className="text-indigo-700 text-[10px] font-semibold font-['Poppins']">
              {props.recruitmentDuration}
            </span>
          </div>
        </div>
      </div>
      <div className="self-stretch justify-between items-start inline-flex">
        <Link href={props.jobUrl}
          className="grow shrink basis-0 h-[45px] px-5 py-3 bg-neutral-50 rounded-lg shadow border border-indigo-700 justify-center items-center gap-2.5 flex"

        >
          <span className="text-center text-indigo-700 text-sm font-semibold font-['Poppins']">
            {viewDetailsLabel}
          </span>
        </Link>
      </div>
    </div>
  );
}
