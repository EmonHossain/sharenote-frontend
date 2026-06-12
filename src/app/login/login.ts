import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type LoginCredentials = {
  username: string;
  password: string;
};

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
})
export class Login {
  readonly busy = input(false);
  readonly apiError = input('');
  protected username = '';
  protected password = '';
  protected readonly loginError = signal('');
  readonly login = output<LoginCredentials>();
  readonly registrationRequested = output<void>();

  protected signIn(): void {
    const username = this.username.trim();
    if (!username || !this.password) {
      this.loginError.set('Enter both your username and password.');
      return;
    }

    this.loginError.set('');
    this.login.emit({ username, password: this.password });
  }
}
