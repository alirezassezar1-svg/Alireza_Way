import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AcademicStore } from '../services/academic-store';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <header class="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 lg:px-8 py-3.5 bg-slate-950/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <!-- Zone 1: Wordmark & Brand -->
      <div class="flex items-center gap-3 shrink-0">
        <button
          (click)="store.setActiveTab('dashboard')"
          class="flex items-center gap-2.5 text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
        >
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/10">
            <mat-icon class="text-slate-950 text-xl font-bold">school</mat-icon>
          </div>
          <div>
            <div class="text-base font-bold text-slate-100 whitespace-nowrap tracking-tight">
              راه علیرضا
            </div>
            <div class="text-[11px] text-slate-400 whitespace-nowrap hidden sm:block">
              مسیر ارشد تا دکتری هوش مصنوعی
            </div>
          </div>
        </button>
      </div>

      <!-- Zone 2: Quick Search Bar trigger -->
      <div class="flex-1 max-w-md mx-2 hidden sm:block">
        <button
          (click)="store.openSearchModal()"
          class="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all text-right"
        >
          <span class="flex items-center gap-2">
            <mat-icon class="text-slate-400 text-base">search</mat-icon>
            <span>جستجو در دانشگاه‌ها، منابع علمی، کنفرانس‌ها...</span>
          </span>
          <kbd class="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-400 rounded border border-slate-700 font-mono">
            Ctrl+K
          </kbd>
        </button>
      </div>

      <!-- Zone 3: Actions -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- Search icon for mobile -->
        <button
          (click)="store.openSearchModal()"
          class="sm:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors"
          title="جستجو"
          aria-label="جستجو"
        >
          <mat-icon>search</mat-icon>
        </button>

        <!-- Add Custom Link/Admin -->
        <button
          (click)="store.openAddItemModal()"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-all shadow-sm"
          title="افزودن لینک یا مرجع جدید"
        >
          <mat-icon class="text-sm">add_link</mat-icon>
          <span class="hidden md:inline whitespace-nowrap">افزودن منبع</span>
        </button>

        <!-- Theme Toggle -->
        <button
          (click)="store.toggleTheme()"
          class="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors"
          [title]="store.isDarkMode() ? 'حالت روشن' : 'حالت تاریک'"
          [attr.aria-label]="store.isDarkMode() ? 'حالت روشن' : 'حالت تاریک'"
        >
          <mat-icon>{{ store.isDarkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>

        <!-- Backup Data Menu -->
        <button
          (click)="store.exportDataJson()"
          class="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors"
          title="پشتیبان‌گیری (دانلود فایل JSON)"
          aria-label="دانلود پشتیبان"
        >
          <mat-icon>file_download</mat-icon>
        </button>
      </div>
    </header>
  `,
})
export class AppHeader {
  readonly store = inject(AcademicStore);
}
