import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type BrowserNode = {
  id: string;
  name: string;
  kind: 'folder' | 'note';
  detail?: string;
  modified?: string;
  size?: string;
  accent?: string;
  children?: BrowserNode[];
};

type BrowserPanel = {
  id: string;
  title: string;
  items: BrowserNode[];
  selectedId?: string;
};

@Component({
  selector: 'app-workspace',
  imports: [FormsModule],
  templateUrl: './workspace.html',
})
export class Workspace {
  readonly username = input.required<string>();
  readonly displayName = input.required<string>();
  readonly futureOrganizationIdRequired = input(false);
  readonly logout = output<void>();
  protected readonly searchTerm = signal('');

  protected readonly rootItems: BrowserNode[] = [
    {
      id: 'all-notes',
      name: 'All Notes',
      kind: 'folder',
      detail: '128 notes',
      accent: '#6f7df6',
    },
    {
      id: 'workspaces',
      name: 'Workspaces',
      kind: 'folder',
      detail: '6 spaces',
      accent: '#ffb45e',
      children: [
        {
          id: 'brand-studio',
          name: 'Brand Studio',
          kind: 'folder',
          detail: '14 notes',
          accent: '#fd8d7b',
          children: [
            {
              id: 'brand-guidelines',
              name: 'Brand guidelines',
              kind: 'folder',
              detail: '6 notes',
            },
            {
              id: 'campaign-library',
              name: 'Campaign library',
              kind: 'folder',
              detail: '8 notes',
            },
          ],
        },
        {
          id: 'product-design',
          name: 'Product Design',
          kind: 'folder',
          detail: '26 notes',
          accent: '#8378ee',
          children: [
            {
              id: 'research',
              name: 'Research',
              kind: 'folder',
              detail: '8 items',
              children: [
                {
                  id: 'interview-program',
                  name: 'Interview program',
                  kind: 'folder',
                  detail: '3 notes',
                  children: [
                    {
                      id: 'interview-insights',
                      name: 'User interview insights',
                      kind: 'note',
                      detail: 'Customer research',
                      modified: 'Today, 10:42',
                      size: '18 KB',
                    },
                    {
                      id: 'interview-script',
                      name: 'Interview script',
                      kind: 'note',
                      detail: 'Research guide',
                      modified: 'Jun 9, 2026',
                      size: '11 KB',
                    },
                    {
                      id: 'recruitment-criteria',
                      name: 'Recruitment criteria',
                      kind: 'note',
                      detail: 'Participant profile',
                      modified: 'Jun 7, 2026',
                      size: '8 KB',
                    },
                  ],
                },
                {
                  id: 'competitive-landscape',
                  name: 'Competitive landscape',
                  kind: 'note',
                  detail: 'Market analysis',
                  modified: 'Yesterday, 16:20',
                  size: '24 KB',
                },
                {
                  id: 'personas-needs',
                  name: 'Personas and needs',
                  kind: 'note',
                  detail: 'Research synthesis',
                  modified: 'Jun 8, 2026',
                  size: '12 KB',
                },
                {
                  id: 'feature-opportunities',
                  name: 'Feature opportunities',
                  kind: 'note',
                  detail: 'Workshop notes',
                  modified: 'Jun 6, 2026',
                  size: '9 KB',
                },
                {
                  id: 'usability-test-plan',
                  name: 'Usability test plan',
                  kind: 'note',
                  detail: 'Study plan',
                  modified: 'Jun 2, 2026',
                  size: '15 KB',
                },
              ],
            },
            {
              id: 'planning',
              name: 'Planning',
              kind: 'folder',
              detail: '5 items',
              children: [
                {
                  id: 'roadmap',
                  name: 'Roadmap',
                  kind: 'folder',
                  detail: '3 notes',
                  children: [
                    {
                      id: 'q3-roadmap',
                      name: 'Q3 product roadmap',
                      kind: 'note',
                      detail: 'Quarterly planning',
                      modified: 'Jun 10, 2026',
                      size: '22 KB',
                    },
                  ],
                },
                {
                  id: 'weekly-priorities',
                  name: 'Weekly priorities',
                  kind: 'note',
                  detail: 'Team planning',
                  modified: 'Today, 09:15',
                  size: '7 KB',
                },
              ],
            },
            {
              id: 'design-system',
              name: 'Design system',
              kind: 'folder',
              detail: 'Empty folder',
            },
            {
              id: 'sprint-reviews',
              name: 'Sprint reviews',
              kind: 'folder',
              detail: '2 notes',
              children: [
                {
                  id: 'sprint-23',
                  name: 'Sprint 23 review',
                  kind: 'note',
                  detail: 'Review notes',
                  modified: 'Jun 5, 2026',
                  size: '10 KB',
                },
                {
                  id: 'sprint-22',
                  name: 'Sprint 22 review',
                  kind: 'note',
                  detail: 'Review notes',
                  modified: 'May 23, 2026',
                  size: '13 KB',
                },
              ],
            },
          ],
        },
        {
          id: 'engineering',
          name: 'Engineering',
          kind: 'folder',
          detail: '19 notes',
          accent: '#52a7e8',
          children: [
            { id: 'architecture', name: 'Architecture', kind: 'folder', detail: '7 notes' },
            { id: 'release-notes', name: 'Release notes', kind: 'folder', detail: '12 notes' },
          ],
        },
        {
          id: 'marketing',
          name: 'Marketing',
          kind: 'folder',
          detail: '11 notes',
          accent: '#efb448',
        },
        {
          id: 'company-wiki',
          name: 'Company Wiki',
          kind: 'folder',
          detail: '38 notes',
          accent: '#57b991',
        },
        {
          id: 'personal',
          name: 'Personal',
          kind: 'folder',
          detail: '20 notes',
          accent: '#b17de8',
        },
      ],
    },
    {
      id: 'shared',
      name: 'Shared with me',
      kind: 'folder',
      detail: '18 items',
      accent: '#52b69a',
    },
    {
      id: 'favorites',
      name: 'Favorites',
      kind: 'folder',
      detail: '12 notes',
      accent: '#f1748f',
    },
    {
      id: 'archive',
      name: 'Archive',
      kind: 'folder',
      detail: '32 items',
      accent: '#9aa3b2',
    },
  ];

  protected readonly selectedPath = signal<BrowserNode[]>([
    this.findNode('workspaces')!,
    this.findNode('product-design')!,
    this.findNode('research')!,
    this.findNode('interview-program')!,
    this.findNode('interview-insights')!,
  ]);

  protected readonly panels = computed<BrowserPanel[]>(() => {
    const path = this.selectedPath();
    const panels: BrowserPanel[] = [
      {
        id: 'root',
        title: 'Browse',
        items: this.rootItems,
        selectedId: path[0]?.id,
      },
    ];

    path.forEach((node, index) => {
      if (node.kind === 'folder' && node.children?.length) {
        panels.push({
          id: node.id,
          title: node.name,
          items: node.children,
          selectedId: path[index + 1]?.id,
        });
      }
    });

    return panels;
  });

  protected readonly activeItem = computed(() => this.selectedPath().at(-1) ?? this.rootItems[0]);

  protected readonly breadcrumb = computed(() =>
    this.selectedPath()
      .map((node) => node.name)
      .join(' / '),
  );

  protected readonly activePanelItemCount = computed(() => {
    const panel = this.panels().at(-1);
    return panel ? this.visiblePanelItems(panel).length : 0;
  });

  protected readonly sidebarCollections = computed(
    () => this.findNode('workspaces')?.children ?? [],
  );

  protected signOut(): void {
    this.searchTerm.set('');
    this.logout.emit();
  }

  protected selectNode(panelIndex: number, node: BrowserNode): void {
    this.selectedPath.update((path) => [...path.slice(0, panelIndex), node]);
  }

  protected selectCollection(node: BrowserNode): void {
    const workspaces = this.findNode('workspaces');
    if (workspaces) {
      this.selectedPath.set([workspaces, node]);
    }
  }

  protected visiblePanelItems(panel: BrowserPanel): BrowserNode[] {
    const query = this.searchTerm().trim().toLowerCase();
    if (!query) {
      return panel.items;
    }

    return panel.items.filter((item) =>
      `${item.name} ${item.detail ?? ''}`.toLowerCase().includes(query),
    );
  }

  protected hasChildren(node: BrowserNode): boolean {
    return node.kind === 'folder' && Boolean(node.children?.length);
  }

  protected previewLabel(): string {
    return this.activeItem().kind === 'note' ? 'Document' : 'Folder';
  }

  protected previewSummary(): string {
    if (this.activeItem().kind === 'note') {
      return 'A concise synthesis of what we heard, the patterns behind it, and the product opportunities worth exploring next.';
    }

    return this.hasChildren(this.activeItem())
      ? 'This folder contains another level of organized material. Select an item in its panel to continue browsing.'
      : 'This folder has no child items, so the column chain ends here.';
  }

  protected findNode(id: string, nodes: BrowserNode[] = this.rootItems): BrowserNode | undefined {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }

      const match = node.children ? this.findNode(id, node.children) : undefined;
      if (match) {
        return match;
      }
    }

    return undefined;
  }
}
