import { Injectable, computed, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  TabType,
  UniversityItem,
  LibraryResourceItem,
  ResearchLabItem,
  ConferenceItem,
  WorkshopItem,
  ToolItem,
  SkillMilestone,
  AcademicEventItem,
  WeeklyPriorityItem,
  GlobalSearchResult,
  BookmarkedItemView,
  CustomItemPayload,
} from '../models/academic.models';
import {
  INITIAL_UNIVERSITIES,
  INITIAL_LIBRARIES,
  INITIAL_LABS,
  INITIAL_CONFERENCES,
  INITIAL_WORKSHOPS,
  INITIAL_TOOLS,
  INITIAL_SKILLS,
  INITIAL_EVENTS,
  INITIAL_PRIORITIES,
} from '../data/academic.data';

const STORAGE_KEYS = {
  THEME: 'alireza_path_theme',
  UNIVERSITIES: 'alireza_path_universities',
  LIBRARIES: 'alireza_path_libraries',
  LABS: 'alireza_path_labs',
  CONFERENCES: 'alireza_path_conferences',
  TOOLS: 'alireza_path_tools',
  SKILLS: 'alireza_path_skills',
  EVENTS: 'alireza_path_events',
  PRIORITIES: 'alireza_path_priorities',
  NOTES: 'alireza_path_notes',
  BOOKMARKS: 'alireza_path_bookmarks',
};

@Injectable({
  providedIn: 'root',
})
export class AcademicStore {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Active navigation tab
  readonly activeTab = signal<TabType>('dashboard');

  // Theme: 'dark' | 'light'
  readonly theme = signal<'dark' | 'light'>('dark');

  // Modals & Active state
  readonly isSearchModalOpen = signal<boolean>(false);
  readonly isNoteModalOpen = signal<boolean>(false);
  readonly isAddItemModalOpen = signal<boolean>(false);
  readonly globalSearchQuery = signal<string>('');

  readonly activeNoteItem = signal<{ id: string; title: string; currentNote: string } | null>(null);

  // Main collections
  readonly universities = signal<UniversityItem[]>(INITIAL_UNIVERSITIES);
  readonly libraries = signal<LibraryResourceItem[]>(INITIAL_LIBRARIES);
  readonly labs = signal<ResearchLabItem[]>(INITIAL_LABS);
  readonly conferences = signal<ConferenceItem[]>(INITIAL_CONFERENCES);
  readonly workshops = signal<WorkshopItem[]>(INITIAL_WORKSHOPS);
  readonly tools = signal<ToolItem[]>(INITIAL_TOOLS);
  readonly skills = signal<SkillMilestone[]>(INITIAL_SKILLS);
  readonly events = signal<AcademicEventItem[]>(INITIAL_EVENTS);
  readonly priorities = signal<WeeklyPriorityItem[]>(INITIAL_PRIORITIES);

  // Notes map: itemId -> noteText
  readonly notesMap = signal<Record<string, string>>({});

  // Bookmarks set/map: itemId -> boolean
  readonly bookmarksMap = signal<Record<string, boolean>>({});

  // Computed: Theme classes & attributes
  readonly isDarkMode = computed(() => this.theme() === 'dark');

  // Filtered universities
  readonly iranUniversities = computed(() =>
    this.universities().filter((u) => u.type === 'iran')
  );

  readonly worldUniversities = computed(() =>
    this.universities().filter((u) => u.type === 'world')
  );

  // Skills progress
  readonly totalSkillsCount = computed(() => this.skills().length);
  readonly completedSkillsCount = computed(
    () => this.skills().filter((s) => s.completed).length
  );
  readonly skillProgressPercentage = computed(() => {
    const total = this.totalSkillsCount();
    if (total === 0) return 0;
    return Math.round((this.completedSkillsCount() / total) * 100);
  });

  // Priorities stats
  readonly completedPrioritiesCount = computed(
    () => this.priorities().filter((p) => p.completed).length
  );
  readonly pendingPrioritiesCount = computed(
    () => this.priorities().filter((p) => !p.completed).length
  );

  // Bookmarked collection
  readonly allBookmarkedItems = computed(() => {
    const bMap = this.bookmarksMap();
    const nMap = this.notesMap();
    const result: BookmarkedItemView[] = [];

    // Universities
    for (const u of this.universities()) {
      if (bMap[u.id] || u.isBookmarked) {
        result.push({
          id: u.id,
          title: u.nameFa,
          subtitle: `${u.nameEn} · ${u.city}`,
          category: u.type === 'iran' ? 'دانشگاه برتر ایران' : 'دانشگاه برتر جهان',
          url: u.admissionUrl,
          tab: 'universities',
          userNote: nMap[u.id] || u.userNote,
        });
      }
    }

    // Libraries
    for (const lib of this.libraries()) {
      if (bMap[lib.id] || lib.isBookmarked) {
        result.push({
          id: lib.id,
          title: lib.titleFa,
          subtitle: lib.titleEn,
          category: lib.category === 'iranian' ? 'منبع ملی ایران' : 'مخزن / کتاب مرجع',
          url: lib.url,
          tab: 'libraries',
          userNote: nMap[lib.id] || lib.userNote,
        });
      }
    }

    // Labs
    for (const lab of this.labs()) {
      if (bMap[lab.id] || lab.isBookmarked) {
        result.push({
          id: lab.id,
          title: lab.nameFa,
          subtitle: lab.organization,
          category: lab.type === 'iran' ? 'مرکز تحقیقاتی ایران' : 'مرکز جهانی AI',
          url: lab.websiteUrl,
          tab: 'labs',
          userNote: nMap[lab.id] || lab.userNote,
        });
      }
    }

    // Conferences
    for (const conf of this.conferences()) {
      if (bMap[conf.id] || conf.isBookmarked) {
        result.push({
          id: conf.id,
          title: `${conf.name} - ${conf.fullTitle}`,
          subtitle: `${conf.location} · ددلاین: ${conf.deadlineDate}`,
          category: conf.type === 'iranian' ? 'کنفرانس ملی' : `کنفرانس بین‌المللی (${conf.rank})`,
          url: conf.websiteUrl,
          tab: 'conferences',
          userNote: nMap[conf.id] || conf.userNote,
        });
      }
    }

    // Tools
    for (const t of this.tools()) {
      if (bMap[t.id] || t.isBookmarked) {
        result.push({
          id: t.id,
          title: t.name,
          subtitle: t.descriptionFa,
          category: 'ابزار ضروری پژوهش',
          url: t.url,
          tab: 'tools',
          userNote: nMap[t.id] || t.userNote,
        });
      }
    }

    return result;
  });

  // Global search results computed
  readonly searchResults = computed<GlobalSearchResult[]>(() => {
    const query = this.globalSearchQuery().trim().toLowerCase();
    if (!query) return [];

    const results: GlobalSearchResult[] = [];

    // Universities
    for (const u of this.universities()) {
      if (
        u.nameFa.toLowerCase().includes(query) ||
        u.nameEn.toLowerCase().includes(query) ||
        u.fields.some((f) => f.toLowerCase().includes(query)) ||
        u.facultyOrLabs.some((fac) => fac.toLowerCase().includes(query)) ||
        u.city.toLowerCase().includes(query)
      ) {
        results.push({
          id: u.id,
          title: u.nameFa,
          subtitle: `${u.nameEn} · ${u.city} (${u.rank})`,
          tab: 'universities',
          category: u.type === 'iran' ? 'دانشگاه ایران' : 'دانشگاه بین‌المللی',
          url: u.admissionUrl,
        });
      }
    }

    // Libraries & Books
    for (const lib of this.libraries()) {
      if (
        lib.titleFa.toLowerCase().includes(query) ||
        lib.titleEn.toLowerCase().includes(query) ||
        lib.descriptionFa.toLowerCase().includes(query) ||
        lib.subject.toLowerCase().includes(query)
      ) {
        results.push({
          id: lib.id,
          title: lib.titleFa,
          subtitle: `${lib.titleEn} · ${lib.authorOrProvider}`,
          tab: 'libraries',
          category: 'کتابخانه / منبع علمی',
          url: lib.url,
        });
      }
    }

    // Labs
    for (const lab of this.labs()) {
      if (
        lab.nameFa.toLowerCase().includes(query) ||
        lab.nameEn.toLowerCase().includes(query) ||
        lab.organization.toLowerCase().includes(query) ||
        lab.focusAreas.some((fa) => fa.toLowerCase().includes(query))
      ) {
        results.push({
          id: lab.id,
          title: lab.nameFa,
          subtitle: `${lab.nameEn} · ${lab.location}`,
          tab: 'labs',
          category: 'مرکز تحقیقاتی و آزمایشگاه',
          url: lab.websiteUrl,
        });
      }
    }

    // Conferences
    for (const c of this.conferences()) {
      if (
        c.name.toLowerCase().includes(query) ||
        c.fullTitle.toLowerCase().includes(query) ||
        c.descriptionFa.toLowerCase().includes(query) ||
        c.tracks.some((t) => t.toLowerCase().includes(query))
      ) {
        results.push({
          id: c.id,
          title: `${c.name} (${c.rank})`,
          subtitle: `${c.fullTitle} · ددلاین: ${c.deadlineDate}`,
          tab: 'conferences',
          category: 'کنفرانس علمی',
          url: c.websiteUrl,
        });
      }
    }

    // Tools
    for (const t of this.tools()) {
      if (
        t.name.toLowerCase().includes(query) ||
        t.descriptionFa.toLowerCase().includes(query) ||
        t.features.some((f) => f.toLowerCase().includes(query))
      ) {
        results.push({
          id: t.id,
          title: t.name,
          subtitle: t.descriptionFa,
          tab: 'tools',
          category: 'ابزار پژوهش',
          url: t.url,
        });
      }
    }

    return results.slice(0, 25);
  });

  constructor() {
    this.loadStateFromStorage();
  }

  // Set active tab
  setActiveTab(tab: TabType): void {
    this.activeTab.set(tab);
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Toggle Theme
  toggleTheme(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    if (this.isBrowser) {
      try {
        localStorage.setItem(STORAGE_KEYS.THEME, next);
        if (next === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {
        console.error('Storage error', e);
      }
    }
  }

  // Bookmarking
  isItemBookmarked(id: string): boolean {
    return !!this.bookmarksMap()[id];
  }

  toggleBookmark(id: string): void {
    this.bookmarksMap.update((map) => {
      const next = { ...map, [id]: !map[id] };
      this.persistBookmarks(next);
      return next;
    });
  }

  // Note management
  getItemNote(id: string): string {
    return this.notesMap()[id] || '';
  }

  openNoteModal(id: string, title: string): void {
    const currentNote = this.getItemNote(id);
    this.activeNoteItem.set({ id, title, currentNote });
    this.isNoteModalOpen.set(true);
  }

  closeNoteModal(): void {
    this.isNoteModalOpen.set(false);
    this.activeNoteItem.set(null);
  }

  saveActiveNote(noteText: string): void {
    const current = this.activeNoteItem();
    if (!current) return;
    this.notesMap.update((map) => {
      const next = { ...map, [current.id]: noteText.trim() };
      this.persistNotes(next);
      return next;
    });
    this.closeNoteModal();
  }

  // Search Modal
  openSearchModal(): void {
    this.isSearchModalOpen.set(true);
  }

  closeSearchModal(): void {
    this.isSearchModalOpen.set(false);
    this.globalSearchQuery.set('');
  }

  setSearchQuery(query: string): void {
    this.globalSearchQuery.set(query);
  }

  // Add Custom Item Modal
  openAddItemModal(): void {
    this.isAddItemModalOpen.set(true);
  }

  closeAddItemModal(): void {
    this.isAddItemModalOpen.set(false);
  }

  // Priority management
  togglePriority(id: string): void {
    this.priorities.update((list) => {
      const next = list.map((p) =>
        p.id === id ? { ...p, completed: !p.completed } : p
      );
      this.persistPriorities(next);
      return next;
    });
  }

  addPriority(text: string, priority: 'high' | 'medium' | 'low', deadline?: string): void {
    if (!text.trim()) return;
    const newItem: WeeklyPriorityItem = {
      id: `p-${Date.now()}`,
      text: text.trim(),
      priority,
      completed: false,
      deadline: deadline?.trim() || undefined,
    };
    this.priorities.update((list) => {
      const next = [newItem, ...list];
      this.persistPriorities(next);
      return next;
    });
  }

  removePriority(id: string): void {
    this.priorities.update((list) => {
      const next = list.filter((p) => p.id !== id);
      this.persistPriorities(next);
      return next;
    });
  }

  // Skills
  toggleSkill(id: string): void {
    this.skills.update((list) => {
      const next = list.map((s) =>
        s.id === id ? { ...s, completed: !s.completed } : s
      );
      this.persistSkills(next);
      return next;
    });
  }

  // Events
  toggleEvent(id: string): void {
    this.events.update((list) => {
      const next = list.map((e) =>
        e.id === id ? { ...e, completed: !e.completed } : e
      );
      this.persistEvents(next);
      return next;
    });
  }

  addEvent(
    title: string,
    date: string,
    jalaliDate: string,
    category: 'phd_apply' | 'conference' | 'exam' | 'term' | 'personal',
    link?: string,
    details?: string
  ): void {
    if (!title.trim() || !date) return;
    const newEvent: AcademicEventItem = {
      id: `ev-${Date.now()}`,
      title: title.trim(),
      date,
      jalaliDate: jalaliDate.trim() || undefined,
      category,
      link: link?.trim() || undefined,
      details: details?.trim() || undefined,
      completed: false,
      isCustom: true,
    };
    this.events.update((list) => {
      const next = [...list, newEvent].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      this.persistEvents(next);
      return next;
    });
  }

  removeEvent(id: string): void {
    this.events.update((list) => {
      const next = list.filter((e) => e.id !== id);
      this.persistEvents(next);
      return next;
    });
  }

  // Add generic custom link / university / library / lab / conf
  addCustomItem(
    type: 'university' | 'library' | 'lab' | 'conference' | 'tool',
    data: CustomItemPayload
  ): void {
    const id = `custom-${type}-${Date.now()}`;
    if (type === 'university') {
      const uniType: 'iran' | 'world' = data.subType === 'world' ? 'world' : 'iran';
      const uni: UniversityItem = {
        id,
        nameFa: data.titleFa,
        nameEn: data.titleEn || '',
        type: uniType,
        rank: data.rank || 'دانشگاه معتبر',
        city: data.city || 'ایران',
        country: data.country || 'ایران',
        admissionUrl: data.url,
        websiteUrl: data.url,
        fields: data.fields ? data.fields.split(',').map((f: string) => f.trim()) : ['هوش مصنوعی'],
        capacityOrFund: data.capacityOrFund || 'پذیرش رسمی',
        admissionRequirements: [data.requirements || 'طبق ضوابط دانشگاه'],
        facultyOrLabs: [data.faculty || 'اساتید گروه کامپیوتر و هوش مصنوعی'],
        acceptanceTipsFa: data.tips || '',
        isCustom: true,
      };
      this.universities.update((list) => {
        const next = [uni, ...list];
        this.persistUniversities(next);
        return next;
      });
    } else if (type === 'library') {
      const libCat: 'repo' | 'book' | 'course' | 'iranian' =
        data.subType === 'book' || data.subType === 'course' || data.subType === 'iranian'
          ? data.subType
          : 'repo';
      const lib: LibraryResourceItem = {
        id,
        titleFa: data.titleFa,
        titleEn: data.titleEn || '',
        category: libCat,
        subject: data.subject || 'هوش مصنوعی',
        url: data.url,
        descriptionFa: data.descriptionFa || '',
        authorOrProvider: data.provider || 'منبع معتبر',
        accessType: data.accessType || 'free',
        isCustom: true,
      };
      this.libraries.update((list) => {
        const next = [lib, ...list];
        this.persistLibraries(next);
        return next;
      });
    } else if (type === 'lab') {
      const labType: 'iran' | 'world' = data.subType === 'world' ? 'world' : 'iran';
      const lab: ResearchLabItem = {
        id,
        nameFa: data.titleFa,
        nameEn: data.titleEn || '',
        type: labType,
        organization: data.provider || '',
        location: data.city || '',
        websiteUrl: data.url,
        opportunitiesUrl: data.url,
        focusAreas: data.fields ? data.fields.split(',').map((f: string) => f.trim()) : ['هوش مصنوعی'],
        descriptionFa: data.descriptionFa || '',
        isCustom: true,
      };
      this.labs.update((list) => {
        const next = [lab, ...list];
        this.persistLabs(next);
        return next;
      });
    } else if (type === 'conference') {
      const confType: 'international' | 'iranian' =
        data.subType === 'iranian' ? 'iranian' : 'international';
      const confRank: 'A*' | 'A' | 'B' | 'National' =
        data.rank === 'A*' || data.rank === 'B' || data.rank === 'National'
          ? data.rank
          : 'A';
      const conf: ConferenceItem = {
        id,
        name: data.titleEn || data.titleFa,
        fullTitle: data.titleFa,
        type: confType,
        rank: confRank,
        deadlineDate: data.deadline || 'طبق تقویم کنفرانس',
        eventDate: data.eventDate || 'طبق تقویم کنفرانس',
        location: data.city || 'بین‌المللی',
        websiteUrl: data.url,
        tracks: data.fields ? data.fields.split(',').map((f: string) => f.trim()) : ['Machine Learning'],
        descriptionFa: data.descriptionFa || '',
        isCustom: true,
      };
      this.conferences.update((list) => {
        const next = [conf, ...list];
        this.persistConferences(next);
        return next;
      });
    } else if (type === 'tool') {
      const toolCat: 'code' | 'writing' | 'data' | 'tracking' | 'citation' =
        data.subType === 'writing' ||
        data.subType === 'data' ||
        data.subType === 'tracking' ||
        data.subType === 'citation'
          ? data.subType
          : 'code';
      const tool: ToolItem = {
        id,
        name: data.titleFa || data.titleEn || 'ابزار پژوهشی',
        category: toolCat,
        url: data.url,
        descriptionFa: data.descriptionFa || '',
        features: data.fields ? data.fields.split(',').map((f: string) => f.trim()) : ['ابزار کمکی'],
        isCustom: true,
      };
      this.tools.update((list) => {
        const next = [tool, ...list];
        this.persistTools(next);
        return next;
      });
    }
    this.closeAddItemModal();
  }

  // Backup & Restore
  exportDataJson(): void {
    if (!this.isBrowser) return;
    const backup = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      theme: this.theme(),
      bookmarks: this.bookmarksMap(),
      notes: this.notesMap(),
      priorities: this.priorities(),
      skills: this.skills(),
      events: this.events(),
      universities: this.universities().filter((u) => u.isCustom),
      libraries: this.libraries().filter((l) => l.isCustom),
      labs: this.labs().filter((l) => l.isCustom),
      conferences: this.conferences().filter((c) => c.isCustom),
      tools: this.tools().filter((t) => t.isCustom),
    };

    const json = JSON.stringify(backup, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rahe-alireza-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importDataJson(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.bookmarks) {
        this.bookmarksMap.set(parsed.bookmarks);
        this.persistBookmarks(parsed.bookmarks);
      }
      if (parsed.notes) {
        this.notesMap.set(parsed.notes);
        this.persistNotes(parsed.notes);
      }
      if (parsed.priorities) {
        this.priorities.set(parsed.priorities);
        this.persistPriorities(parsed.priorities);
      }
      if (parsed.skills) {
        this.skills.set(parsed.skills);
        this.persistSkills(parsed.skills);
      }
      if (parsed.events) {
        this.events.set(parsed.events);
        this.persistEvents(parsed.events);
      }
      if (parsed.theme) {
        this.theme.set(parsed.theme);
        if (this.isBrowser) {
          localStorage.setItem(STORAGE_KEYS.THEME, parsed.theme);
          if (parsed.theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      }
      return true;
    } catch (e) {
      console.error('Import error', e);
      return false;
    }
  }

  resetToDefaultData(): void {
    if (!this.isBrowser) return;
    try {
      localStorage.clear();
      this.bookmarksMap.set({});
      this.notesMap.set({});
      this.priorities.set(INITIAL_PRIORITIES);
      this.skills.set(INITIAL_SKILLS);
      this.events.set(INITIAL_EVENTS);
      this.universities.set(INITIAL_UNIVERSITIES);
      this.libraries.set(INITIAL_LIBRARIES);
      this.labs.set(INITIAL_LABS);
      this.conferences.set(INITIAL_CONFERENCES);
      this.tools.set(INITIAL_TOOLS);
      this.theme.set('dark');
      document.documentElement.classList.add('dark');
    } catch (e) {
      console.error('Reset error', e);
    }
  }

  // Persistence helpers
  private loadStateFromStorage(): void {
    if (!this.isBrowser) return;
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        this.theme.set(savedTheme);
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else {
        document.documentElement.classList.add('dark');
      }

      const savedBookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (savedBookmarks) {
        this.bookmarksMap.set(JSON.parse(savedBookmarks));
      }

      const savedNotes = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (savedNotes) {
        this.notesMap.set(JSON.parse(savedNotes));
      }

      const savedPriorities = localStorage.getItem(STORAGE_KEYS.PRIORITIES);
      if (savedPriorities) {
        this.priorities.set(JSON.parse(savedPriorities));
      }

      const savedSkills = localStorage.getItem(STORAGE_KEYS.SKILLS);
      if (savedSkills) {
        this.skills.set(JSON.parse(savedSkills));
      }

      const savedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (savedEvents) {
        this.events.set(JSON.parse(savedEvents));
      }

      const savedUnis = localStorage.getItem(STORAGE_KEYS.UNIVERSITIES);
      if (savedUnis) {
        const customUnis: UniversityItem[] = JSON.parse(savedUnis);
        this.universities.set([...customUnis, ...INITIAL_UNIVERSITIES]);
      }

      const savedLibs = localStorage.getItem(STORAGE_KEYS.LIBRARIES);
      if (savedLibs) {
        const customLibs: LibraryResourceItem[] = JSON.parse(savedLibs);
        this.libraries.set([...customLibs, ...INITIAL_LIBRARIES]);
      }

      const savedLabs = localStorage.getItem(STORAGE_KEYS.LABS);
      if (savedLabs) {
        const customLabs: ResearchLabItem[] = JSON.parse(savedLabs);
        this.labs.set([...customLabs, ...INITIAL_LABS]);
      }

      const savedConfs = localStorage.getItem(STORAGE_KEYS.CONFERENCES);
      if (savedConfs) {
        const customConfs: ConferenceItem[] = JSON.parse(savedConfs);
        this.conferences.set([...customConfs, ...INITIAL_CONFERENCES]);
      }

      const savedTools = localStorage.getItem(STORAGE_KEYS.TOOLS);
      if (savedTools) {
        const customTools: ToolItem[] = JSON.parse(savedTools);
        this.tools.set([...customTools, ...INITIAL_TOOLS]);
      }
    } catch (err) {
      console.warn('Could not read from localStorage', err);
    }
  }

  private persistBookmarks(map: Record<string, boolean>): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(map));
    } catch (e) {
      console.error(e);
    }
  }

  private persistNotes(map: Record<string, string>): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(map));
    } catch (e) {
      console.error(e);
    }
  }

  private persistPriorities(list: WeeklyPriorityItem[]): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PRIORITIES, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  }

  private persistSkills(list: SkillMilestone[]): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  }

  private persistEvents(list: AcademicEventItem[]): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  }

  private persistUniversities(list: UniversityItem[]): void {
    if (!this.isBrowser) return;
    try {
      const customs = list.filter((u) => u.isCustom);
      localStorage.setItem(STORAGE_KEYS.UNIVERSITIES, JSON.stringify(customs));
    } catch (e) {
      console.error(e);
    }
  }

  private persistLibraries(list: LibraryResourceItem[]): void {
    if (!this.isBrowser) return;
    try {
      const customs = list.filter((l) => l.isCustom);
      localStorage.setItem(STORAGE_KEYS.LIBRARIES, JSON.stringify(customs));
    } catch (e) {
      console.error(e);
    }
  }

  private persistLabs(list: ResearchLabItem[]): void {
    if (!this.isBrowser) return;
    try {
      const customs = list.filter((l) => l.isCustom);
      localStorage.setItem(STORAGE_KEYS.LABS, JSON.stringify(customs));
    } catch (e) {
      console.error(e);
    }
  }

  private persistConferences(list: ConferenceItem[]): void {
    if (!this.isBrowser) return;
    try {
      const customs = list.filter((c) => c.isCustom);
      localStorage.setItem(STORAGE_KEYS.CONFERENCES, JSON.stringify(customs));
    } catch (e) {
      console.error(e);
    }
  }

  private persistTools(list: ToolItem[]): void {
    if (!this.isBrowser) return;
    try {
      const customs = list.filter((t) => t.isCustom);
      localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(customs));
    } catch (e) {
      console.error(e);
    }
  }
}
