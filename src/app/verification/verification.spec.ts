import { TestBed } from '@angular/core/testing';
import { AuthSession } from '../auth/auth.models';
import { Verification } from './verification';

function session(overrides: Partial<AuthSession> = {}): AuthSession {
  return {
    accessLevel: 'limited',
    user: {
      id: 'user-1',
      username: 'alex',
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'alex@gmail.com',
      gender: 'prefer_not_to_say',
      phoneNumber: '+49 30 12345678',
    },
    verificationMethod: 'public_email',
    verificationStatus: 'email_pending',
    futureOrganizationIdRequired: false,
    ...overrides,
  };
}

describe('Verification', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Verification],
    }).compileComponents();
  });

  it('explains the public-email verification path', async () => {
    const fixture = TestBed.createComponent(Verification);
    fixture.componentRef.setInput('session', session());
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Public email detected');
    expect(fixture.nativeElement.textContent).toContain('Your private files');
  });

  it('requests organization ID after public email verification', async () => {
    const fixture = TestBed.createComponent(Verification);
    fixture.componentRef.setInput(
      'session',
      session({ verificationStatus: 'organization_id_required' }),
    );
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Add your organization photo ID');
    expect(fixture.nativeElement.querySelector('input[type="file"]')).toBeTruthy();
  });
});
