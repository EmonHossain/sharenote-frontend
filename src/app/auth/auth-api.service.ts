import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AUTH_API_CONFIG } from './auth-api.config';
import {
  ApiMessage,
  AuthSession,
  LoginRequest,
  RegistrationRequest,
  UserProfile,
} from './auth.models';

const MOCK_SESSION_KEY = 'sharenote.mock-session';
const PUBLIC_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'yahoo.com',
  'icloud.com',
  'aol.com',
  'proton.me',
  'protonmail.com',
]);

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly config = inject(AUTH_API_CONFIG);

  readonly session = signal<AuthSession | null>(null);
  readonly busy = signal(false);
  readonly error = signal('');

  async restoreSession(): Promise<void> {
    this.busy.set(true);
    this.error.set('');

    try {
      const session = this.config.useMockApi
        ? this.readMockSession()
        : await firstValueFrom(
            this.http.get<AuthSession>(`${this.config.baseUrl}/auth/session`, {
              withCredentials: true,
            }),
          );
      this.session.set(session);
    } catch {
      this.session.set(null);
    } finally {
      this.busy.set(false);
    }
  }

  async login(request: LoginRequest): Promise<void> {
    await this.run(async () => {
      const session = this.config.useMockApi
        ? await this.mockLogin(request)
        : await firstValueFrom(
            this.http.post<AuthSession>(`${this.config.baseUrl}/auth/login`, request, {
              withCredentials: true,
            }),
          );
      this.setSession(session);
    });
  }

  async register(request: RegistrationRequest): Promise<void> {
    await this.run(async () => {
      const session = this.config.useMockApi
        ? await this.mockRegistration(request)
        : await firstValueFrom(
            this.http.post<AuthSession>(`${this.config.baseUrl}/auth/register`, request, {
              withCredentials: true,
            }),
          );
      this.setSession(session);
    });
  }

  async verifyEmail(code: string): Promise<void> {
    await this.run(async () => {
      const session = this.config.useMockApi
        ? await this.mockEmailVerification(code)
        : await firstValueFrom(
            this.http.post<AuthSession>(
              `${this.config.baseUrl}/auth/verification/email`,
              { code },
              { withCredentials: true },
            ),
          );
      this.setSession(session);
    });
  }

  async resendEmailVerification(): Promise<ApiMessage> {
    return this.run(async () =>
      this.config.useMockApi
        ? this.mockMessage('A new verification code has been sent.')
        : firstValueFrom(
            this.http.post<ApiMessage>(
              `${this.config.baseUrl}/auth/verification/email/resend`,
              {},
              { withCredentials: true },
            ),
          ),
    );
  }

  async uploadOrganizationId(file: File): Promise<void> {
    await this.run(async () => {
      let session: AuthSession;

      if (this.config.useMockApi) {
        session = await this.mockOrganizationIdUpload(file);
      } else {
        const body = new FormData();
        body.append('organizationId', file);
        session = await firstValueFrom(
          this.http.post<AuthSession>(
            `${this.config.baseUrl}/auth/verification/organization-id`,
            body,
            { withCredentials: true },
          ),
        );
      }

      this.setSession(session);
    });
  }

  async uploadPersonalFile(file: File): Promise<ApiMessage> {
    return this.run(async () => {
      if (this.config.useMockApi) {
        return this.mockMessage(`${file.name} was uploaded to your private files.`);
      }

      const body = new FormData();
      body.append('file', file);
      return firstValueFrom(
        this.http.post<ApiMessage>(`${this.config.baseUrl}/files/personal`, body, {
          withCredentials: true,
        }),
      );
    });
  }

  async logout(): Promise<void> {
    this.busy.set(true);
    this.error.set('');

    try {
      if (!this.config.useMockApi) {
        await firstValueFrom(
          this.http.post(`${this.config.baseUrl}/auth/logout`, {}, { withCredentials: true }),
        );
      }
    } finally {
      this.clearMockSession();
      this.session.set(null);
      this.busy.set(false);
    }
  }

  private async run<T>(operation: () => Promise<T>): Promise<T> {
    this.busy.set(true);
    this.error.set('');

    try {
      return await operation();
    } catch (error) {
      this.error.set(this.getErrorMessage(error));
      throw error;
    } finally {
      this.busy.set(false);
    }
  }

  private setSession(session: AuthSession): void {
    this.session.set(session);
    if (this.config.useMockApi && isPlatformBrowser(this.platformId)) {
      localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session));
    }
  }

  private readMockSession(): AuthSession | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const value = localStorage.getItem(MOCK_SESSION_KEY);
    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as AuthSession;
    } catch {
      localStorage.removeItem(MOCK_SESSION_KEY);
      return null;
    }
  }

  private clearMockSession(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(MOCK_SESSION_KEY);
    }
  }

  private async mockLogin(request: LoginRequest): Promise<AuthSession> {
    await this.mockDelay();
    const identifier = request.username.trim();
    const email = identifier.includes('@') ? identifier : `${identifier}@acme.org`;
    const profile = this.mockProfile(email);

    return {
      accessLevel: 'full',
      token: 'mock-access-token',
      user: profile,
      verificationMethod: 'organization_email',
      verificationStatus: 'fully_verified',
      futureOrganizationIdRequired: true,
    };
  }

  private async mockRegistration(request: RegistrationRequest): Promise<AuthSession> {
    await this.mockDelay();
    const domain = request.email.split('@')[1]?.toLowerCase() ?? '';
    const publicEmail = PUBLIC_EMAIL_DOMAINS.has(domain);

    return {
      accessLevel: 'limited',
      token: 'mock-registration-token',
      user: {
        id: crypto.randomUUID(),
        username: request.email.split('@')[0],
        firstName: request.firstName,
        lastName: request.lastName,
        email: request.email,
        gender: request.gender,
        phoneNumber: request.phoneNumber,
        organizationName: publicEmail ? undefined : this.organizationFromDomain(domain),
      },
      verificationMethod: publicEmail ? 'public_email' : 'organization_email',
      verificationStatus: 'email_pending',
      futureOrganizationIdRequired: !publicEmail,
    };
  }

  private async mockEmailVerification(code: string): Promise<AuthSession> {
    await this.mockDelay();
    if (!/^\d{6}$/.test(code)) {
      throw new Error('Enter the six-digit code sent to your email.');
    }

    const session = this.requireSession();
    const organizationEmail = session.verificationMethod === 'organization_email';
    return {
      ...session,
      accessLevel: organizationEmail ? 'full' : 'limited',
      verificationStatus: organizationEmail ? 'fully_verified' : 'organization_id_required',
    };
  }

  private async mockOrganizationIdUpload(file: File): Promise<AuthSession> {
    await this.mockDelay();
    if (!file.size) {
      throw new Error('Choose a valid organization photo ID file.');
    }

    return {
      ...this.requireSession(),
      accessLevel: 'limited',
      verificationStatus: 'organization_id_review',
    };
  }

  private mockProfile(email: string): UserProfile {
    const username = email.split('@')[0];
    return {
      id: 'mock-user-1',
      username,
      firstName: 'Alex',
      lastName: 'Morgan',
      email,
      gender: 'prefer_not_to_say',
      phoneNumber: '+49 30 12345678',
      organizationName: 'Acme',
    };
  }

  private organizationFromDomain(domain: string): string {
    const name = domain.split('.')[0] || 'Organization';
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  private requireSession(): AuthSession {
    const session = this.session();
    if (!session) {
      throw new Error('Your session has expired. Please sign in again.');
    }
    return session;
  }

  private async mockMessage(message: string): Promise<ApiMessage> {
    await this.mockDelay(180);
    return { message };
  }

  private mockDelay(milliseconds = 350): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return 'The request could not be completed. Please try again.';
  }
}
