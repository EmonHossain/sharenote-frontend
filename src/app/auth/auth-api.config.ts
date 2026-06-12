import { InjectionToken } from '@angular/core';

export type AuthApiConfig = {
  baseUrl: string;
  useMockApi: boolean;
};

export const AUTH_API_CONFIG = new InjectionToken<AuthApiConfig>('AUTH_API_CONFIG', {
  providedIn: 'root',
  factory: () => ({
    baseUrl: '/api',
    // Set to false when the backend endpoints below are available.
    useMockApi: true,
  }),
});
