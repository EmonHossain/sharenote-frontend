import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AuthApiService } from './auth-api.service';

describe('AuthApiService mock API', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
  });

  it('uses organization email verification for a private domain', async () => {
    const service = TestBed.inject(AuthApiService);
    await service.register({
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'alex@acme.org',
      gender: 'prefer_not_to_say',
      phoneNumber: '+49 30 12345678',
      password: 'password123',
    });

    expect(service.session()?.verificationMethod).toBe('organization_email');
    await service.verifyEmail('123456');
    expect(service.session()?.accessLevel).toBe('full');
  });

  it('requires organization ID for a public email domain', async () => {
    const service = TestBed.inject(AuthApiService);
    await service.register({
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'alex@gmail.com',
      gender: 'prefer_not_to_say',
      phoneNumber: '+49 30 12345678',
      password: 'password123',
    });

    expect(service.session()?.verificationMethod).toBe('public_email');
    await service.verifyEmail('123456');
    expect(service.session()?.verificationStatus).toBe('organization_id_required');
    expect(service.session()?.accessLevel).toBe('limited');
  });
});
