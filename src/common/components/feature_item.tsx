import React from 'react';

interface FeatureItemProps {
  header: string;
  text: string;
  icon: React.ReactNode;
}

const FeatureItem = ({ header, text, icon }: FeatureItemProps) => {
  return (
    <div className="flex-col max-w-[240px] justify-start items-center gap-4 inline-flex">
      <div className="p-5 shadow feature_shadow rounded-full">
        {icon} {/* Render the icon component here */}
      </div>
      <div className="text-slate-900 text-base font-medium font-poppins">
        {header}
      </div>
      <div className="text-center text-neutral-500 text-sm font-normal font-poppins leading-[16.80px]">
        {text}
      </div>
    </div>
  );
};

export default FeatureItem;
