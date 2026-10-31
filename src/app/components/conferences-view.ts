import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { AcademicStore } from '../services/academic-store';
import { ConferenceItem } from '../models/academic.models';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-conferences-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, ReactiveFormsModule],
  template: `
    <div class="space-y-8 text-right pb-12">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2">
            <mat-icon class="text-emerald-400">event_available</mat-icon>
            <span>کنفرانس‌های بین‌المللی و ملی هوش مصنوعی</span>
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            ددلاین‌های سابمیشن مقالات، رتبه‌بندی Core A*، حوزه‌های تخصصی و کارگاه‌های آموزشی پیشرفته
          </p>
        </div>

        <!-- Filter Segmented Tabs -->
        <div class="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start sm:self-auto">
          <button
            (click)="selectedType.set('all')"
            class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
            [class.bg-emerald-600]="selectedType() === 'all'"
            [class.text-white]="selectedType() === 'all'"
            [class.text-slate-400]="selectedType() !== 'all'"
          >
            همه کنفرانس‌ها ({{ store.conferences().length }})
          </button>
          <button
            (click)="selectedType.set('international')"
            class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
            [class.bg-emerald-600]="selectedType() === 'international'"
            [class.text-white]="selectedType() === 'international'"
            [class.text-slate-400]="selectedType() !== 'international'"
          >
            جهانی (NeurIPS, ICML, CVPR, ...)
          </button>
          <button
            (click)="selectedType.set('iranian')"
            class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
            [class.bg-emerald-600]="selectedType() === 'iranian'"
            [class.text-white]="selectedType() === 'iranian'"
            [class.text-slate-400]="selectedType() !== 'iranian'"
          >
            کنفرانس‌های معتبر ایران
          </button>
        </div>
      </div>

      <!-- Search & Rank Filter -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div class="relative flex-1">
          <input
            [formControl]="searchControl"
            type="text"
            aria-label="جستجوی کنفرانس و همایش علمی"
            placeholder="جستجوی نام کنفرانس، محورها یا محل برگزاری..."
            class="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <mat-icon class="absolute right-3 top-3 text-slate-500 text-sm">search</mat-icon>
        </div>

        <div class="flex items-center gap-1.5 overflow-x-auto text-xs text-slate-400">
          <span class="text-slate-500 whitespace-nowrap">رتبه:</span>
          <button
            (click)="rankFilter.set('all')"
            class="px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap"
            [class.bg-slate-800]="rankFilter() === 'all'"
            [class.text-emerald-400]="rankFilter() === 'all'"
            [class.bg-slate-900]="rankFilter() !== 'all'"
          >
            همه
          </button>
          <button
            (click)="rankFilter.set('A*')"
            class="px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap font-mono"
            [class.bg-slate-800]="rankFilter() === 'A*'"
            [class.text-emerald-400]="rankFilter() === 'A*'"
            [class.bg-slate-900]="rankFilter() !== 'A*'"
          >
            Core A*
          </button>
          <button
            (click)="rankFilter.set('National')"
            class="px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap"
            [class.bg-slate-800]="rankFilter() === 'National'"
            [class.text-emerald-400]="rankFilter() === 'National'"
            [class.bg-slate-900]="rankFilter() !== 'National'"
          >
            ملی (IEEE/ISC)
          </button>
        </div>
      </div>

      <!-- Conferences Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        @for (conf of filteredConferences(); track conf.id) {
          <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
            <div class="space-y-3">
              <!-- Top Row: Name, Rank, Bookmark, Note -->
              <div class="flex items-start justify-between gap-3">
                <div class="space-y-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <h3 class="text-base font-bold text-slate-100">
                      {{ conf.name }}
                    </h3>
                    <span
                      class="px-2 py-0.5 rounded text-[10px] font-bold font-mono"
                      [class.bg-emerald-950]="conf.rank === 'A*'"
                      [class.text-emerald-400]="conf.rank === 'A*'"
                      [class.border]="conf.rank === 'A*'"
                      [class.border-emerald-500/30]="conf.rank === 'A*'"
                      [class.bg-blue-950]="conf.rank === 'National'"
                      [class.text-blue-400]="conf.rank === 'National'"
                    >
                      {{ conf.rank === 'A*' ? 'CORE A*' : 'نمایه معتبر' }}
                    </span>
                  </div>
                  <div class="text-xs text-slate-400 font-mono" dir="ltr">
                    {{ conf.fullTitle }}
                  </div>
                </div>

                <div class="flex items-center gap-1 shrink-0">
                  <button
                    (click)="store.openNoteModal(conf.id, conf.name)"
                    class="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                    [class.text-emerald-400]="store.getItemNote(conf.id)"
                    title="یادداشت شخصی"
                  >
                    <mat-icon class="text-base">
                      {{ store.getItemNote(conf.id) ? 'sticky_note_2' : 'edit_note' }}
                    </mat-icon>
                  </button>
                  <button
                    (click)="store.toggleBookmark(conf.id)"
                    class="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                    [class.text-amber-400]="store.isItemBookmarked(conf.id)"
                    title="نشان‌گذاری"
                  >
                    <mat-icon class="text-base">
                      {{ store.isItemBookmarked(conf.id) ? 'bookmark' : 'bookmark_border' }}
                    </mat-icon>
                  </button>
                </div>
              </div>

              <!-- Note if exists -->
              @if (store.getItemNote(conf.id)) {
                <div class="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300">
                  <span class="font-semibold text-emerald-400">یادداشت: </span>
                  <span>{{ store.getItemNote(conf.id) }}</span>
                </div>
              }

              <!-- Deadlines strip -->
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-0.5">
                  <div class="text-[10px] text-amber-400 font-medium">ددلاین سابمیشن:</div>
                  <div class="text-[11px] text-slate-200 font-semibold">{{ conf.deadlineDate }}</div>
                </div>
                <div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-0.5">
                  <div class="text-[10px] text-emerald-400 font-medium">تاریخ برگزاری:</div>
                  <div class="text-[11px] text-slate-200 font-semibold">{{ conf.eventDate }}</div>
                </div>
              </div>

              <!-- Tracks -->
              <div class="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                <span class="text-slate-500">محورها:</span>
                @for (tr of conf.tracks; track tr) {
                  <span class="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300">
                    {{ tr }}
                  </span>
                }
              </div>

              <!-- Location & Description -->
              <div class="text-[11px] text-slate-400">
                <span>محل برگزاری: </span>
                <span class="text-slate-300 font-medium">{{ conf.location }}</span>
              </div>
              <p class="text-xs text-slate-400 leading-relaxed">
                {{ conf.descriptionFa }}
              </p>
            </div>

            <!-- Action Button: Call for Papers / Register -->
            <div class="pt-3 border-t border-slate-800">
              <a
                [href]="conf.websiteUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-sm"
              >
                <span>ورود به سایت رسمی و Call for Papers</span>
                <mat-icon class="text-sm">open_in_new</mat-icon>
              </a>
            </div>
          </div>
        }
      </div>

      <!-- Workshops & Summer Schools Section -->
      <div class="space-y-4 pt-6 border-t border-slate-800">
        <div>
          <h2 class="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
            <mat-icon class="text-teal-400">groups</mat-icon>
            <span>کارگاه‌ها و مدارس تابستانه معتبر (Summer Schools & Workshops)</span>
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            شرکت در این دوره‌ها علاوه بر ارتقای چشمگیر دانش فنی، اعتبار بالایی به بخش افتخارات رزومه شما اضافه می‌کند.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          @for (ws of store.workshops(); track ws.id) {
            <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3">
              <div class="space-y-2">
                <h3 class="text-xs sm:text-sm font-bold text-slate-200">
                  {{ ws.titleFa }}
                </h3>
                <div class="text-[11px] text-slate-400 font-mono" dir="ltr">
                  {{ ws.titleEn }}
                </div>
                <div class="text-[11px] text-teal-400 font-medium">
                  برگزارکننده: {{ ws.organizer }}
                </div>
                <p class="text-xs text-slate-400 leading-relaxed">
                  {{ ws.descriptionFa }}
                </p>
              </div>

              <div class="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span class="text-[10px] text-slate-500 font-medium">{{ ws.timing }}</span>
                <a
                  [href]="ws.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-1 text-xs text-emerald-400 hover:underline font-semibold"
                >
                  <span>ثبت‌نام / مشاهده</span>
                  <mat-icon class="text-xs">arrow_forward</mat-icon>
                </a>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class AppConferencesView {
  readonly store = inject(AcademicStore);
  readonly selectedType = signal<'all' | 'international' | 'iranian'>('all');
  readonly rankFilter = signal<'all' | 'A*' | 'National'>('all');
  readonly searchControl = new FormControl('');

  readonly filteredConferences = computed<ConferenceItem[]>(() => {
    const list = this.store.conferences();
    const type = this.selectedType();
    const rank = this.rankFilter();
    const query = (this.searchControl.value || '').trim().toLowerCase();

    return list.filter((c) => {
      const matchesType = type === 'all' || c.type === type;
      const matchesRank = rank === 'all' || c.rank === rank;
      const matchesSearch =
        !query ||
        c.name.toLowerCase().includes(query) ||
        c.fullTitle.toLowerCase().includes(query) ||
        c.location.toLowerCase().includes(query) ||
        c.tracks.some((t) => t.toLowerCase().includes(query));

      return matchesType && matchesRank && matchesSearch;
    });
  });
}
