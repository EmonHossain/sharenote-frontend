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
    expect(compiled.querySelectorAll('.browser-column')).toHaveLength(5);
    expect(
      compiled
        .querySelector('.columns-viewport')
        ?.nextElementSibling?.classList.contains('preview-column'),
    ).toBe(true);
    expect(compiled.querySelectorAll('.last-browser-column')).toHaveLength(1);
  });

  it('adds child panels for branches and removes them for leaf folders', async () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    app['username'] = 'alex';
    app['password'] = 'secret';
    app['signIn']();
    fixture.detectChanges();

    const designSystem = app['findNode']('design-system');
    expect(designSystem).toBeTruthy();
    app['selectNode'](2, designSystem!);
    fixture.detectChanges();
    await fixture.whenStable();

    let compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.browser-column')).toHaveLength(3);
    expect(compiled.textContent).toContain(
      'There are no child items, so no additional column is created.',
    );

    const planning = app['findNode']('planning');
    expect(planning).toBeTruthy();
    app['selectNode'](2, planning!);
    fixture.detectChanges();
    await fixture.whenStable();

    compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.browser-column')).toHaveLength(4);
    expect(compiled.textContent).toContain('Roadmap');
  });
});
