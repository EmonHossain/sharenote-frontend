import { TestBed } from '@angular/core/testing';
import { Login, LoginCredentials } from './login';

describe('Login', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
    }).compileComponents();
  });

  it('requires both username and password', async () => {
    const fixture = TestBed.createComponent(Login);
    fixture.componentInstance['signIn']();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Enter both your username and password.');
  });

  it('emits credentials for the coordinator', () => {
    const fixture = TestBed.createComponent(Login);
    const login = fixture.componentInstance;
    let emitted: LoginCredentials | undefined;
    login.login.subscribe((credentials) => (emitted = credentials));
    login['username'] = ' alex ';
    login['password'] = 'secret';

    login['signIn']();

    expect(emitted).toEqual({ username: 'alex', password: 'secret' });
  });

  it('offers a registration action', async () => {
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Not registered yet?');
    expect(fixture.nativeElement.textContent).toContain('Create an account');
  });
});
