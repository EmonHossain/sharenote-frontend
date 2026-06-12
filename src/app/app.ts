import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthApiService } from './auth/auth-api.service';
import { RegistrationRequest } from './auth/auth.models';
import { Login, LoginCredentials } from './login/login';
import { Registration } from './registration/registration';
import { Verification } from './verification/verification';
import { Workspace } from './workspace/workspace';

@Component({
  selector: 'app-root',
  imports: [Login, Registration, Verification, Workspace],
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly auth = inject(AuthApiService);
  protected readonly authView = signal<'login' | 'registration'>('login');
  protected readonly restoringSession = signal(true);
  protected readonly notice = signal('');

  async ngOnInit(): Promise<void> {
    await this.auth.restoreSession();
    this.restoringSession.set(false);
  }

  protected async handleLogin(credentials: LoginCredentials): Promise<void> {
    this.notice.set('');
    try {
      await this.auth.login(credentials);
    } catch {
      // The service exposes a user-facing error signal.
    }
  }

  protected async handleRegistration(request: RegistrationRequest): Promise<void> {
    this.notice.set('');
    try {
      await this.auth.register(request);
    } catch {
      // The service exposes a user-facing error signal.
    }
  }

  protected async handleEmailVerification(code: string): Promise<void> {
    this.notice.set('');
    try {
      await this.auth.verifyEmail(code);
    } catch {
      // The service exposes a user-facing error signal.
    }
  }

  protected async handleResendEmail(): Promise<void> {
    try {
      const response = await this.auth.resendEmailVerification();
      this.notice.set(response.message);
    } catch {
      this.notice.set('');
    }
  }

  protected async handleOrganizationId(file: File): Promise<void> {
    this.notice.set('');
    try {
      await this.auth.uploadOrganizationId(file);
      this.notice.set('Organization ID uploaded. Review status will update from the backend.');
    } catch {
      // The service exposes a user-facing error signal.
    }
  }

  protected async handlePersonalFile(file: File): Promise<void> {
    try {
      const response = await this.auth.uploadPersonalFile(file);
      this.notice.set(response.message);
    } catch {
      this.notice.set('');
    }
  }

  protected async handleLogout(): Promise<void> {
    await this.auth.logout();
    this.notice.set('');
    this.authView.set('login');
  }
}
