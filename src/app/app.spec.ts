import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AuthSession } from './auth/auth.models';
import { App } from './app';

const restoredSession: AuthSession = {
  accessLevel: 'full',
  user: {
    id: 'restored-user',
    username: 'alex',
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex@acme.org',
    gender: 'prefer_not_to_say',
    phoneNumber: '+49 30 12345678',
    organizationName: 'Acme',
  },
  verificationMethod: 'organization_email',
  verificationStatus: 'fully_verified',
  futureOrganizationIdRequired: true,
};

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient()],
    }).compileComponents();
  });

  it('shows the login component when there is no saved session', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-login')).toBeTruthy();
    expect(compiled.querySelector('app-workspace')).toBeFalsy();
  });

  it('restores an authenticated session after a refresh', async () => {
    localStorage.setItem('sharenote.mock-session', JSON.stringify(restoredSession));

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-workspace')).toBeTruthy();
    expect(compiled.textContent).toContain('Alex Morgan');
    expect(compiled.textContent).toContain('Organization ID may be requested later');
  });

  it('opens registration from the login view', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.componentInstance['authView'].set('registration');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-registration')).toBeTruthy();
  });
});
