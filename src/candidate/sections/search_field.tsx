"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Autocomplete from "react-google-autocomplete";
import SearchBarsOnTop from "../components/search";
import HorizontalNFilterIcon from "../components/horizontal_btn";
import DashboardQueryItem from "../components/dashboard_query_item";
import { baseURL, workerBaseUrl } from "../../common/constants/baseUrl";
import { buildCandidateJobUrl } from "../utils/urlBuilder";
import PaginationBtn from "../components/paginate_btn";
import { translations, Language } from "../utils/translations";


interface JobPost {
  _id: string;
  jobTitle: string;
  logo: string;
  companyName: string;
  jobType: string;
  applicationDeadline: string;
  location: {
    city: string;
    state: string;
  };
  custom_name: string;
  indeed?: boolean;
}

interface SearchJobFieldProps {
  accType?: string;
}

function SearchJobField({ accType = "client" }: SearchJobFieldProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const title = searchParams?.get("title") || "";
  const location = searchParams?.get("location") || "";
  const getPage = searchParams?.get("page") || "1";
  const rawLang = searchParams?.get("lg") || "en";
  const pageLang = (["en", "es"].includes(rawLang) ? rawLang : "en") as Language;
  const t = translations[pageLang];
  const refQuery = searchParams?.get("ref") || "";

  const [ourSearchLoading, setOurSearchLoading] = useState(false);
  const [jobListData, setJobListData] = useState<JobPost[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [initialSearchDone, setInitialSearchDone] = useState(false);
  const [ourError, setOurError] = useState("");
  const [totalJobs, setTotalJobs] = useState(0);
  const [searchJob, setSearchJob] = useState(title);
  const [searchLocation, setSearchLocation] = useState(location);

  const handleCancelJobSearch = () => {
    setSearchJob("");
  };

  const handleCancelLocationSearch = () => {
    setSearchLocation("");
  };

  const handleOverAllSearch = async (page = currentPage) => {
    setOurSearchLoading(true);
    setOurError("");

    const params = new URLSearchParams();
    if (searchJob) params.set("title", searchJob.toLowerCase().trim());
    if (searchLocation) params.set("location", searchLocation.toLowerCase().trim());
    params.set("page", page.toString());
    params.set("lg", pageLang);

    // Update URL without reloading the page
    router.push(`/candidate/searchjob?${params.toString()}`, { scroll: false });

    try {
      const queryParams = new URLSearchParams();
      if (searchJob) queryParams.set("title", searchJob.toLowerCase().trim());
      if (searchLocation) queryParams.set("location", searchLocation.toLowerCase().trim());
      queryParams.set("page", page.toString());
      queryParams.set("limit", "15");
      queryParams.set("flag", "Client");

      const response = await fetch(`${baseURL}/api/job/search_job_posts?${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("token") : ''}`,
        },
      });

      const data = await response.json();

      if (data.statusCode === 200 && data.success) {
        setJobListData(data.data["Job posts"] || []);
        setTotalPages(data.data?.number_of_pages || 1);
        setTotalJobs(data.data?.number_of_matches || 0);
      } else {
        setJobListData([]);
        setTotalJobs(0);
        setOurError(data.message || t.noRecordsMatch);
      }
    } catch (error) {
      console.error("Search error:", error);
      setOurError(t.errorOccurred);
      setJobListData([]);
      setTotalJobs(0);
    } finally {
      setOurSearchLoading(false);
    }
  };

  // Set initial state from URL params
  useEffect(() => {
    setSearchJob(title);
    setSearchLocation(location);
    setCurrentPage(parseInt(getPage, 10) || 1);
    setInitialSearchDone(true); // Mark that we are ready for the first search
  }, [title, location, getPage]);
  // Trigger search when state is ready or when dependencies change
  useEffect(() => {
    if (initialSearchDone) {
      handleOverAllSearch(currentPage);
    }
  }, [currentPage, initialSearchDone]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-[#FF6633]/20">
      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,102,51,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,102,51,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          animation: 'grid-float 20s ease-in-out infinite'
        }}
      />

      {/* Header Section */}
      <div className="relative z-10 bg-gradient-to-r from-[#5843BE]/95 via-purple-600/95 to-[#FF6633]/95 backdrop-blur-xl border-b border-white/20 shadow-2xl">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-start md:items-center flex-col md:flex-row gap-y-4 gap-x-6 w-full lg:w-auto">
              <button
                onClick={() => window.open("/candidate", "_self")}
                className="flex items-center gap-3 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-2xl border border-white/30 hover:border-white/50 transition-all duration-300 group backdrop-blur-sm shadow-lg hover:shadow-xl"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white group-hover:scale-110 transition-transform">
                  <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-white font-semibold">{t.backToHome}</span>
              </button>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="3.27,6.96 12,12.01 20.73,6.96" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="text-left">
                  <h1 className="text-2xl lg:text-4xl font-bold text-white leading-tight">
                    {t.findDreamJob}
                  </h1>
                  <p className="text-white/80 text-sm lg:text-base mt-1">
                    {t.discoverOpportunities}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden lg:flex items-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-white/70 text-xs">{t.activeJobs}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-white/70 text-xs">{t.companies}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">95%</div>
                <div className="text-white/70 text-xs">{t.successRate}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-20 h-20 bg-[#FF6633]/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Enhanced Search Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/50 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF6633] to-[#ea580c] rounded-2xl flex items-center justify-center shadow-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t.searchFilterJobs}</h2>
              <p className="text-gray-600">{t.useAdvancedFilters}</p>
            </div>
          </div>

          {/* Search Bars */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                  <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder={t.jobTitlePlaceholder}
                value={searchJob}
                onChange={(e) => setSearchJob(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border border-gray-200 focus:border-[#FF6633] focus:ring-2 focus:ring-[#FF6633]/20 outline-none transition-all duration-300 text-gray-900 placeholder-gray-500"
              />
              {searchJob && (
                <button
                  onClick={handleCancelJobSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400 hover:text-gray-600">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                  <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <Autocomplete
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY_1}
                placeholder={t.locationPlaceholder}
                value={searchLocation}
                onPlaceSelected={(place) => {
                  setSearchLocation(place.formatted_address || "");
                }}
                onChange={(e) => setSearchLocation((e.target as HTMLInputElement).value)}
                className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border border-gray-200 focus:border-[#FF6633] focus:ring-2 focus:ring-[#FF6633]/20 outline-none transition-all duration-300 text-gray-900 placeholder-gray-500"
                options={{
                  types: ["(regions)"],
                  componentRestrictions: { country: "us" },
                }}
              />
              {searchLocation && (
                <button
                  onClick={handleCancelLocationSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400 hover:text-gray-600">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <button
              onClick={() => handleOverAllSearch(1)}
              disabled={ourSearchLoading}
              className="px-8 py-4 bg-gradient-to-r from-[#FF6633] to-[#ea580c] text-white font-semibold rounded-2xl hover:from-[#ea580c] hover:to-[#FF6633] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {ourSearchLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{t.searching}</span>
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{t.searchJobs}</span>
                </>
              )}
            </button>

            {/* Filter Toggle */}
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/70 hover:bg-white/90 rounded-xl border border-gray-200 hover:border-[#FF6633]/30 transition-all duration-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-600">
                  <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-gray-700 font-medium">{t.filters}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <div>
            {!ourSearchLoading && (
              <div className="flex items-center gap-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {jobListData.length} {totalJobs !== 0 ? `${t.of} ${totalJobs.toLocaleString()}` : ''} {t.jobsFound}
                </h3>
                {totalJobs > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-700 text-sm font-medium">{t.liveResults}</span>
                  </div>
                )}
              </div>
            )}
            
            {ourError && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl mt-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-500">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-red-700">{ourError}</span>
              </div>
            )}
          </div>

          {/* One Click Apply Badge */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-lg rounded-xl border border-white/50 shadow-lg">
            <img 
              src='https://res.cloudinary.com/drlcisipo/image/upload/v1705704152/Website%20images/small_logo_mqnwoo.png' 
              alt="moil logo" 
              className="w-6 h-4" 
            />
            <span className="text-gray-700 font-medium text-sm">{t.oneClickApply}</span>
            <div className="w-2 h-2 bg-[#FF6633] rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Job Results Grid */}
        {ourSearchLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-lg animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobListData.map((item, index) => (
              <DashboardQueryItem
                key={item._id || index}
                experienceLevel=""
                jobPosition={item.jobTitle}
                profilePics={item.logo}
                employer={item.companyName}
                jobType={item.jobType}
                recruitmentDuration={item.applicationDeadline}
                JobLocation={`${item.location.city}, ${item.location.state}`}
                indeed={item.indeed}
                recruitingUntilLabel={t.recruitingUntil}
                viewDetailsLabel={t.viewJobDetails}
                jobUrl={buildCandidateJobUrl(item.custom_name, { 
                  lg: pageLang,
                  ...(refQuery && { ref: refQuery })
                })}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!ourSearchLoading && jobListData.length === 0 && !ourError && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.noJobsFound}</h3>
            <p className="text-gray-600 mb-6">{t.adjustCriteria}</p>
            <button
              onClick={() => {
                setSearchJob("");
                setSearchLocation("");
                handleOverAllSearch(1);
              }}
              className="px-6 py-3 bg-[#FF6633] text-white font-medium rounded-xl hover:bg-[#ea580c] transition-colors"
            >
              {t.clearFilters}
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !ourSearchLoading && (
          <div className="mt-12 flex justify-center">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-2 border border-white/50 shadow-lg">
              <PaginationBtn
                totalPages={totalPages}
                currentPage={currentPage}
                onNextPage={() => currentPage < totalPages && setCurrentPage(prev => prev + 1)}
                onPrevPage={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
                onSelectPage={(selectedPage: number) => setCurrentPage(selectedPage)}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default SearchJobField;