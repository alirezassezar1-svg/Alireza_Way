import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { AcademicStore } from '../services/academic-store';
import { LibraryResourceItem } from '../models/academic.models';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-libraries-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, ReactiveFormsModule],
  template: `
    <div class="space-y-8 text-right pb-12">
      <!-- Section Header -->
      <div class="border-b border-slate-800 pb-4">
        <h1 class="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2">
          <mat-icon class="text-emerald-400">auto_stories</mat-icon>
          <span>کتابخانه‌ها، مخازن علمی و منابع ضروری پژوهش</span>
        </h1>
        <p class="text-xs text-slate-400 mt-1">
          لینک مستقیم به مخازن مقالات علمی جهان، پایگاه پایان‌نامه‌های ایران، و کتب مرجع دوره ارشد و دکتری
        </p>
      </div>

      <!-- Live Scholar / arXiv Search Box -->
      <div class="p-5 rounded-2xl bg-gradient-to-l from-slate-900 to-slate-950 border border-slate-800 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs font-bold text-slate-200">
            <mat-icon class="text-blue-400 text-base">search</mat-icon>
            <span>جستجوی مستقیم عنوان مقاله یا کلیدواژه در پایگاه‌های علمی</span>
          </div>
          <span class="text-[11px] text-slate-400">هدایت فوری به نتایج زنده</span>
        </div>

        <div class="flex flex-col sm:flex-row gap-2">
          <input
            [formControl]="paperSearchControl"
            (keydown.enter)="searchScholar()"
            type="text"
            aria-label="جستجوی عنوان مقاله یا کلیدواژه در گوگل اسکالر و آرکایو"
            placeholder="مثال: Attention is All You Need یا Vision Transformers Object Detection..."
            class="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-left"
            dir="ltr"
          />
          <div class="flex items-center gap-2">
            <button
              (click)="searchScholar()"
              class="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-sm"
            >
              <mat-icon class="text-sm">school</mat-icon>
              <span>جستجو در Google Scholar</span>
            </button>
            <button
              (click)="searchArxiv()"
              class="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-semibold transition-all shadow-sm"
            >
              <mat-icon class="text-sm">article</mat-icon>
              <span>جستجو در arXiv</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Category Filter Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-2 text-xs">
        <button
          (click)="activeCategory.set('all')"
          class="px-3.5 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap"
          [class.bg-emerald-600]="activeCategory() === 'all'"
          [class.text-white]="activeCategory() === 'all'"
          [class.text-slate-400]="activeCategory() !== 'all'"
          [class.bg-slate-900]="activeCategory() !== 'all'"
        >
          همه منابع ({{ store.libraries().length }})
        </button>
        <button
          (click)="activeCategory.set('repo')"
          class="px-3.5 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap"
          [class.bg-emerald-600]="activeCategory() === 'repo'"
          [class.text-white]="activeCategory() === 'repo'"
          [class.text-slate-400]="activeCategory() !== 'repo'"
          [class.bg-slate-900]="activeCategory() !== 'repo'"
        >
          مخازن مقالات جهانی (Google Scholar, IEEE, arXiv, ...)
        </button>
        <button
          (click)="activeCategory.set('iranian')"
          class="px-3.5 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap"
          [class.bg-emerald-600]="activeCategory() === 'iranian'"
          [class.text-white]="activeCategory() === 'iranian'"
          [class.text-slate-400]="activeCategory() !== 'iranian'"
          [class.bg-slate-900]="activeCategory() !== 'iranian'"
        >
          کتابخانه‌ها و پایان‌نامه‌های ایران (ایران‌داک، کتابخانه ملی، شریف)
        </button>
        <button
          (click)="activeCategory.set('book')"
          class="px-3.5 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap"
          [class.bg-emerald-600]="activeCategory() === 'book'"
          [class.text-white]="activeCategory() === 'book'"
          [class.text-slate-400]="activeCategory() !== 'book'"
          [class.bg-slate-900]="activeCategory() !== 'book'"
        >
          کتب مرجع ضروری (MML, Goodfellow, Murphy, Jurafsky, ...)
        </button>
        <button
          (click)="activeCategory.set('course')"
          class="px-3.5 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap"
          [class.bg-emerald-600]="activeCategory() === 'course'"
          [class.text-white]="activeCategory() === 'course'"
          [class.text-slate-400]="activeCategory() !== 'course'"
          [class.bg-slate-900]="activeCategory() !== 'course'"
        >
          دوره‌های شاخص بین‌المللی (Stanford CS224N, CS231N)
        </button>
      </div>

      <!-- Grid of Resources -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (item of filteredResources(); track item.id) {
          <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3">
            <div class="space-y-2.5">
              <!-- Top Row: Title, Bookmark, Note -->
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                  <h3 class="text-xs sm:text-sm font-bold text-slate-100 leading-snug">
                    {{ item.titleFa }}
                  </h3>
                  <div class="text-[11px] text-slate-400 font-mono mt-0.5 truncate" dir="ltr">
                    {{ item.titleEn }}
                  </div>
                </div>

                <div class="flex items-center gap-1 shrink-0">
                  <button
                    (click)="store.openNoteModal(item.id, item.titleFa)"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                    [class.text-emerald-400]="store.getItemNote(item.id)"
                    title="یادداشت شخصی"
                  >
                    <mat-icon class="text-sm">
                      {{ store.getItemNote(item.id) ? 'sticky_note_2' : 'edit_note' }}
                    </mat-icon>
                  </button>
                  <button
                    (click)="store.toggleBookmark(item.id)"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                    [class.text-amber-400]="store.isItemBookmarked(item.id)"
                    title="نشان‌گذاری"
                  >
                    <mat-icon class="text-sm">
                      {{ store.isItemBookmarked(item.id) ? 'bookmark' : 'bookmark_border' }}
                    </mat-icon>
                  </button>
                </div>
              </div>

              <!-- Note if exists -->
              @if (store.getItemNote(item.id)) {
                <div class="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-emerald-300">
                  <span class="font-semibold">یادداشت: </span>
                  <span>{{ store.getItemNote(item.id) }}</span>
                </div>
              }

              <!-- Subject & Access -->
              <div class="flex items-center justify-between text-[11px]">
                <span class="text-slate-400">{{ item.subject }}</span>
                @if (item.accessType === 'open_access' || item.accessType === 'free') {
                  <span class="text-emerald-400 font-medium">دسترسی آزاد و رایگان</span>
                } @else {
                  <span class="text-amber-400 font-medium">دسترسی دانشگاهی</span>
                }
              </div>

              <!-- Description -->
              <p class="text-xs text-slate-400 leading-relaxed line-clamp-3">
                {{ item.descriptionFa }}
              </p>

              <!-- Author / Provider -->
              <div class="text-[10px] text-slate-500">
                ارائه‌دهنده: {{ item.authorOrProvider }}
              </div>
            </div>

            <!-- Action Button -->
            <div class="pt-2 border-t border-slate-800">
              <a
                [href]="item.url"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-semibold transition-all group"
              >
                <span>ورود به پایگاه / مطالعه منبع</span>
                <mat-icon class="text-xs group-hover:translate-x-0.5 transition-transform">open_in_new</mat-icon>
              </a>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class AppLibrariesView {
  readonly store = inject(AcademicStore);
  readonly activeCategory = signal<'all' | 'repo' | 'iranian' | 'book' | 'course'>('all');
  readonly paperSearchControl = new FormControl('');

  readonly filteredResources = computed<LibraryResourceItem[]>(() => {
    const cat = this.activeCategory();
    if (cat === 'all') return this.store.libraries();
    return this.store.libraries().filter((item) => item.category === cat);
  });

  searchScholar(): void {
    const q = (this.paperSearchControl.value || '').trim();
    const url = q
      ? `https://scholar.google.com/scholar?q=${encodeURIComponent(q)}`
      : 'https://scholar.google.com';
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  searchArxiv(): void {
    const q = (this.paperSearchControl.value || '').trim();
    const url = q
      ? `https://arxiv.org/search/?query=${encodeURIComponent(q)}&searchtype=all`
      : 'https://arxiv.org/corr';
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
