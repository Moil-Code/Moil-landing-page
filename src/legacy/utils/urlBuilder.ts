/**
 * Utility function to build business app URLs with referral parameters
 */

import { businessBaseUrl } from "../../common/constants/baseUrl";

interface UrlParams {
  ref?: string;
  lg?: string;
  flowId?: string;
}

export const buildBusinessUrl = (params: UrlParams = {}): string => {
  const baseUrl = `${businessBaseUrl}/`;
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
 * Build business register URL with referral parameters
 */
export const buildBusinessRegisterUrl = (params: UrlParams = {}): string => {
  const baseUrl = `${businessBaseUrl}/register`;
  const urlParams = new URLSearchParams();
  
  if (params.ref) {
    urlParams.append('ref', params.ref);
  }
  
  if (params.lg) {
    urlParams.append('lg', params.lg);
  }
  
  if (params.flowId) {
    urlParams.append('flowId', params.flowId);
  }
  
  const queryString = urlParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

/**
 * Opens business app URL in a new tab with referral parameters
 */
export const openBusinessApp = (params: UrlParams = {}): void => {
  const url = buildBusinessUrl(params);
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Opens business register URL in a new tab with referral parameters
 */
export const openBusinessRegister = (params: UrlParams = {}): void => {
  const url = buildBusinessRegisterUrl(params);
  window.open(url, '_blank', 'noopener,noreferrer');
};
