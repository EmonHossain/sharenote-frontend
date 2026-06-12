import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthSession } from '../auth/auth.models';

@Component({
  selector: 'app-verification',
  imports: [FormsModule],
  templateUrl: './verification.html',
})
export class Verification {
  readonly session = input.required<AuthSession>();
  readonly busy = input(false);
  readonly apiError = input('');
  readonly notice = input('');

  readonly verifyEmail = output<string>();
  readonly resendEmail = output<void>();
  readonly organizationIdSelected = output<File>();
  readonly personalFileSelected = output<File>();
  readonly logout = output<void>();

  protected verificationCode = '';
  protected organizationIdName = signal('');
  protected personalFileName = signal('');

  protected submitCode(): void {
    this.verifyEmail.emit(this.verificationCode.trim());
  }

  protected chooseOrganizationId(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.organizationIdName.set(file.name);
      this.organizationIdSelected.emit(file);
    }
  }

  protected choosePersonalFile(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.personalFileName.set(file.name);
      this.personalFileSelected.emit(file);
    }
  }
}
