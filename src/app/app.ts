import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type BrowserItem = {
  name: string;
  kind: 'folder' | 'note';
  detail?: string;
  modified?: string;
  size?: string;
  accent?: string;
};

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected username = '';
  protected password = '';
  protected readonly isAuthenticated = signal(false);
  protected readonly loginError = signal('');
  protected readonly searchTerm = signal('');
  protected readonly selectedLocation = signal('Workspaces');
  protected readonly selectedCollection = signal('Product Design');
  protected readonly selectedFolder = signal('Research');
  protected readonly selectedNote = signal('User interview insights');

  protected readonly locations: BrowserItem[] = [
    { name: 'All Notes', kind: 'folder', detail: '128 notes', accent: '#6f7df6' },
    { name: 'Workspaces', kind: 'folder', detail: '6 spaces', accent: '#ffb45e' },
    { name: 'Shared with me', kind: 'folder', detail: '18 items', accent: '#52b69a' },
    { name: 'Favorites', kind: 'folder', detail: '12 notes', accent: '#f1748f' },
    { name: 'Archive', kind: 'folder', detail: '32 items', accent: '#9aa3b2' },
  ];

  protected readonly collections: BrowserItem[] = [
    { name: 'Brand Studio', kind: 'folder', detail: '14 notes', accent: '#fd8d7b' },
    { name: 'Product Design', kind: 'folder', detail: '26 notes', accent: '#8378ee' },
    { name: 'Engineering', kind: 'folder', detail: '19 notes', accent: '#52a7e8' },
    { name: 'Marketing', kind: 'folder', detail: '11 notes', accent: '#efb448' },
    { name: 'Company Wiki', kind: 'folder', detail: '38 notes', accent: '#57b991' },
    { name: 'Personal', kind: 'folder', detail: '20 notes', accent: '#b17de8' },
  ];

  protected readonly folders: BrowserItem[] = [
    { name: 'Research', kind: 'folder', detail: '8 notes' },
    { name: 'Planning', kind: 'folder', detail: '5 notes' },
    { name: 'Design system', kind: 'folder', detail: '7 notes' },
    { name: 'Sprint reviews', kind: 'folder', detail: '6 notes' },
  ];

  protected readonly notes: BrowserItem[] = [
    {
      name: 'User interview insights',
      kind: 'note',
      detail: 'Customer research',
      modified: 'Today, 10:42',
      size: '18 KB',
    },
    {
      name: 'Competitive landscape',
      kind: 'note',
      detail: 'Market analysis',
      modified: 'Yesterday, 16:20',
      size: '24 KB',
    },
    {
      name: 'Personas and needs',
      kind: 'note',
      detail: 'Research synthesis',
      modified: 'Jun 8, 2026',
      size: '12 KB',
    },
    {
      name: 'Feature opportunities',
      kind: 'note',
      detail: 'Workshop notes',
      modified: 'Jun 6, 2026',
      size: '9 KB',
    },
    {
      name: 'Usability test plan',
      kind: 'note',
      detail: 'Study plan',
      modified: 'Jun 2, 2026',
      size: '15 KB',
    },
  ];

  protected readonly visibleNotes = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    return query
      ? this.notes.filter((note) => `${note.name} ${note.detail}`.toLowerCase().includes(query))
      : this.notes;
  });

  protected readonly activeNote = computed(
    () =>
      this.notes.find((note) => note.name === this.selectedNote()) ??
      this.visibleNotes()[0] ??
      this.notes[0],
  );

  protected signIn(): void {
    if (!this.username.trim() || !this.password) {
      this.loginError.set('Enter both your username and password.');
      return;
    }

    this.loginError.set('');
    this.isAuthenticated.set(true);
  }

  protected signOut(): void {
    this.password = '';
    this.searchTerm.set('');
    this.isAuthenticated.set(false);
  }

  protected selectLocation(name: string): void {
    this.selectedLocation.set(name);
  }

  protected selectCollection(name: string): void {
    this.selectedCollection.set(name);
  }

  protected selectFolder(name: string): void {
    this.selectedFolder.set(name);
  }

  protected selectNote(name: string): void {
    this.selectedNote.set(name);
  }
}
