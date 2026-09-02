/**
 * Utility function to build candidate app URLs with referral parameters
 */

import { workerBaseUrl } from "../../common/constants/baseUrl";

interface UrlParams {
  ref?: string;
  lg?: string;
}

export const buildCandidateUrl = (params: UrlParams = {}): string => {
  const baseUrl = `${workerBaseUrl}/`;
  const urlParams = new URLSearchParams();
  
  if (params.ref) {
    urlParams.append('ref', params.ref);
  }
  
  if (params.lg) {
    urlParams.append('lg', params.lg);
  }
  
  const queryString = urlParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

/**
 * Build candidate register URL with referral parameters
 */
export const buildCandidateRegisterUrl = (params: UrlParams = {}): string => {
  const baseUrl = `${workerBaseUrl}/register`;
  const urlParams = new URLSearchParams();
  
  if (params.ref) {
    urlParams.append('ref', params.ref);
  }
  
  if (params.lg) {
    urlParams.append('lg', params.lg);
  }
  
  const queryString = urlParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

/**
 * Opens candidate app URL in a new tab with referral parameters
 */
export const openCandidateApp = (params: UrlParams = {}): void => {
  const url = buildCandidateUrl(params);
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Build candidate job URL with referral parameters
 */
export const buildCandidateJobUrl = (jobCustomName: string, params: UrlParams = {}): string => {
  // `custom_name` is employer-authored data from the jobs API. Encoded so a
  // value carrying `/`, `?` or `#` cannot break out of the /jobs/ path segment.
  const baseUrl = `${workerBaseUrl}/jobs/${encodeURIComponent(String(jobCustomName ?? ''))}`;
  const urlParams = new URLSearchParams();
  
  if (params.ref) {
    urlParams.append('ref', params.ref);
  }
  
  if (params.lg) {
    urlParams.append('lg', params.lg);
  }
  
  const queryString = urlParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

/**
 * Opens candidate register URL in a new tab with referral parameters
 */
export const openCandidateRegister = (params: UrlParams = {}): void => {
  const url = buildCandidateRegisterUrl(params);
  window.open(url, '_blank', 'noopener,noreferrer');
};
