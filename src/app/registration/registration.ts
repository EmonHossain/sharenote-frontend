import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Gender, RegistrationRequest } from '../auth/auth.models';

@Component({
  selector: 'app-registration',
  imports: [FormsModule],
  templateUrl: './registration.html',
})
export class Registration {
  readonly busy = input(false);
  readonly apiError = input('');
  readonly register = output<RegistrationRequest>();
  readonly loginRequested = output<void>();

  protected firstName = '';
  protected lastName = '';
  protected email = '';
  protected gender: Gender | '' = '';
  protected phoneNumber = '';
  protected password = '';
  protected confirmPassword = '';
  protected readonly formError = signal('');

  protected submit(): void {
    const firstName = this.firstName.trim();
    const lastName = this.lastName.trim();
    const email = this.email.trim().toLowerCase();
    const phoneNumber = this.phoneNumber.trim();

    if (!firstName || !lastName || !email || !this.gender || !phoneNumber || !this.password) {
      this.formError.set('Complete all required fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.formError.set('Enter a valid email address.');
      return;
    }

    if (this.password.length < 8) {
      this.formError.set('Password must contain at least eight characters.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.formError.set('Passwords do not match.');
      return;
    }

    this.formError.set('');
    this.register.emit({
      firstName,
      lastName,
      email,
      gender: this.gender,
      phoneNumber,
      password: this.password,
    });
  }
}
