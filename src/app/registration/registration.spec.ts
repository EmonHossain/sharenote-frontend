import { TestBed } from '@angular/core/testing';
import { RegistrationRequest } from '../auth/auth.models';
import { Registration } from './registration';

describe('Registration', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Registration],
    }).compileComponents();
  });

  it('emits the complete registration payload', () => {
    const fixture = TestBed.createComponent(Registration);
    const registration = fixture.componentInstance;
    let emitted: RegistrationRequest | undefined;
    registration.register.subscribe((request) => (emitted = request));

    registration['firstName'] = 'Alex';
    registration['lastName'] = 'Morgan';
    registration['email'] = 'alex@acme.org';
    registration['gender'] = 'prefer_not_to_say';
    registration['phoneNumber'] = '+49 30 12345678';
    registration['password'] = 'password123';
    registration['confirmPassword'] = 'password123';
    registration['submit']();

    expect(emitted).toEqual({
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'alex@acme.org',
      gender: 'prefer_not_to_say',
      phoneNumber: '+49 30 12345678',
      password: 'password123',
    });
  });

  it('rejects mismatched passwords', async () => {
    const fixture = TestBed.createComponent(Registration);
    const registration = fixture.componentInstance;
    registration['firstName'] = 'Alex';
    registration['lastName'] = 'Morgan';
    registration['email'] = 'alex@acme.org';
    registration['gender'] = 'male';
    registration['phoneNumber'] = '+49 30 12345678';
    registration['password'] = 'password123';
    registration['confirmPassword'] = 'different123';

    registration['submit']();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Passwords do not match.');
  });
});
