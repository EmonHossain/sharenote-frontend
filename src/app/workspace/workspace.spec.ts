import { TestBed } from '@angular/core/testing';
import { Workspace } from './workspace';

describe('Workspace', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Workspace],
    }).compileComponents();
  });

  function createWorkspace() {
    const fixture = TestBed.createComponent(Workspace);
    fixture.componentRef.setInput('username', 'alex');
    fixture.componentRef.setInput('displayName', 'Alex Morgan');
    fixture.detectChanges();
    return fixture;
  }

  it('renders the mock profile and initial folder path', async () => {
    const fixture = createWorkspace();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Alex Morgan');
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
    const fixture = createWorkspace();
    const workspace = fixture.componentInstance;

    const designSystem = workspace['findNode']('design-system');
    expect(designSystem).toBeTruthy();
    workspace['selectNode'](2, designSystem!);
    fixture.detectChanges();
    await fixture.whenStable();

    let compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.browser-column')).toHaveLength(3);
    expect(compiled.textContent).toContain(
      'There are no child items, so no additional column is created.',
    );

    const planning = workspace['findNode']('planning');
    expect(planning).toBeTruthy();
    workspace['selectNode'](2, planning!);
    fixture.detectChanges();
    await fixture.whenStable();

    compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.browser-column')).toHaveLength(4);
    expect(compiled.textContent).toContain('Roadmap');
  });

  it('emits logout without owning authentication state', () => {
    const fixture = createWorkspace();
    let emitted = false;
    fixture.componentInstance.logout.subscribe(() => (emitted = true));

    fixture.componentInstance['signOut']();

    expect(emitted).toBe(true);
  });
});
