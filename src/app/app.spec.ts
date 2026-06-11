import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('shows the login portal by default', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Sign in to ShareNote');
    expect(compiled.querySelector('input[type="password"]')).toBeTruthy();
  });

  it('opens the Finder-style browser after valid form input', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.componentInstance['username'] = 'alex';
    fixture.componentInstance['password'] = 'secret';
    fixture.componentInstance['signIn']();
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.finder-window')).toBeTruthy();
    expect(compiled.textContent).toContain('Product Design');
    expect(compiled.textContent).toContain('User interview insights');
  });
});
