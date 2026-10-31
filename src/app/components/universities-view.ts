import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { AcademicStore } from '../services/academic-store';
import { UniversityItem } from '../models/academic.models';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-universities-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6 text-right pb-12">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2">
            <mat-icon class="text-emerald-400">account_balance</mat-icon>
            <span>دانشگاه‌های برتر دکتری هوش مصنوعی و کامپیوتر</span>
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            لینک‌های مستقیم صفحات پذیرش دکتری (PhD Admission)، شرایط و شروط آزمون، ظرفیت‌ها و اساتید شاخص
          </p>
        </div>

        <!-- Segmented Tab: Iran vs World -->
        <div class="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start sm:self-auto">
          <button
            (click)="selectedType.set('iran')"
            class="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all"
            [class.bg-emerald-600]="selectedType() === 'iran'"
            [class.text-white]="selectedType() === 'iran'"
            [class.text-slate-400]="selectedType() !== 'iran'"
          >
            دانشگاه‌های ایران ({{ store.iranUniversities().length }})
          </button>
          <button
            (click)="selectedType.set('world')"
            class="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all"
            [class.bg-emerald-600]="selectedType() === 'world'"
            [class.text-white]="selectedType() === 'world'"
            [class.text-slate-400]="selectedType() !== 'world'"
          >
            دانشگاه‌های جهان ({{ store.worldUniversities().length }})
          </button>
        </div>
      </div>

      <!-- Filters & Search Bar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div class="relative flex-1">
          <input
            [formControl]="searchControl"
            type="text"
            aria-label="جستجوی دانشگاه، شهر یا حوزه تخصصی"
            placeholder="جستجوی نام دانشگاه، شهر، نام استاد یا حوزه تخصصی..."
            class="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <mat-icon class="absolute right-3 top-3 text-slate-500 text-sm">search</mat-icon>
        </div>

        <div class="flex items-center gap-1.5 overflow-x-auto text-xs text-slate-400">
          <button
            (click)="fieldFilter.set('all')"
            class="px-3 py-2 rounded-xl transition-colors whitespace-nowrap"
            [class.bg-slate-800]="fieldFilter() === 'all'"
            [class.text-emerald-400]="fieldFilter() === 'all'"
            [class.bg-slate-900]="fieldFilter() !== 'all'"
          >
            همه حوزه‌ها
          </button>
          <button
            (click)="fieldFilter.set('ML')"
            class="px-3 py-2 rounded-xl transition-colors whitespace-nowrap"
            [class.bg-slate-800]="fieldFilter() === 'ML'"
            [class.text-emerald-400]="fieldFilter() === 'ML'"
            [class.bg-slate-900]="fieldFilter() !== 'ML'"
          >
            Machine Learning
          </button>
          <button
            (click)="fieldFilter.set('Vision')"
            class="px-3 py-2 rounded-xl transition-colors whitespace-nowrap"
            [class.bg-slate-800]="fieldFilter() === 'Vision'"
            [class.text-emerald-400]="fieldFilter() === 'Vision'"
            [class.bg-slate-900]="fieldFilter() !== 'Vision'"
          >
            Computer Vision
          </button>
          <button
            (click)="fieldFilter.set('NLP')"
            class="px-3 py-2 rounded-xl transition-colors whitespace-nowrap"
            [class.bg-slate-800]="fieldFilter() === 'NLP'"
            [class.text-emerald-400]="fieldFilter() === 'NLP'"
            [class.bg-slate-900]="fieldFilter() !== 'NLP'"
          >
            NLP / زبان طبیعی
          </button>
          <button
            (click)="fieldFilter.set('Robotics')"
            class="px-3 py-2 rounded-xl transition-colors whitespace-nowrap"
            [class.bg-slate-800]="fieldFilter() === 'Robotics'"
            [class.text-emerald-400]="fieldFilter() === 'Robotics'"
            [class.bg-slate-900]="fieldFilter() !== 'Robotics'"
          >
            Robotics / رباتیک
          </button>
        </div>
      </div>

      <!-- Universities Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        @for (uni of filteredUniversities(); track uni.id) {
          <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
            <div class="space-y-3">
              <!-- Top Row: Name, Rank, Bookmark, Note -->
              <div class="flex items-start justify-between gap-3">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <h3 class="text-sm sm:text-base font-bold text-slate-100">
                      {{ uni.nameFa }}
                    </h3>
                  </div>
                  <div class="text-xs text-slate-400 font-mono" dir="ltr">
                    {{ uni.nameEn }}
                  </div>
                  <div class="text-[11px] text-emerald-400 font-medium">
                    {{ uni.rank }} · {{ uni.city }}، {{ uni.country }}
                  </div>
                </div>

                <div class="flex items-center gap-1 shrink-0">
                  <button
                    (click)="store.openNoteModal(uni.id, uni.nameFa)"
                    class="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                    [class.text-emerald-400]="store.getItemNote(uni.id)"
                    title="یادداشت شخصی"
                  >
                    <mat-icon class="text-base">
                      {{ store.getItemNote(uni.id) ? 'sticky_note_2' : 'edit_note' }}
                    </mat-icon>
                  </button>
                  <button
                    (click)="store.toggleBookmark(uni.id)"
                    class="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                    [class.text-amber-400]="store.isItemBookmarked(uni.id)"
                    title="نشان‌گذاری"
                  >
                    <mat-icon class="text-base">
                      {{ store.isItemBookmarked(uni.id) ? 'bookmark' : 'bookmark_border' }}
                    </mat-icon>
                  </button>
                </div>
              </div>

              <!-- Note Preview if exists -->
              @if (store.getItemNote(uni.id)) {
                <div class="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300 space-y-0.5">
                  <div class="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <mat-icon class="text-xs">notes</mat-icon>
                    <span>یادداشت علیرضا:</span>
                  </div>
                  <p class="leading-relaxed">{{ store.getItemNote(uni.id) }}</p>
                </div>
              }

              <!-- Fields Badges (Clean Text) -->
              <div class="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                <span class="text-slate-500">حوزه‌ها:</span>
                @for (field of uni.fields; track field) {
                  <span class="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300">
                    {{ field }}
                  </span>
                }
              </div>

              <!-- Capacity & Fund -->
              <div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                <div class="text-[10px] text-slate-400 font-semibold">ظرفیت و وضعیت فاند:</div>
                <div class="text-[11px] text-teal-400 font-mono">{{ uni.capacityOrFund }}</div>
              </div>

              <!-- Admission Requirements -->
              <div class="space-y-1.5">
                <div class="text-xs font-semibold text-slate-300">شرایط و الزامات پذیرش دکتری:</div>
                <ul class="space-y-1 text-xs text-slate-400">
                  @for (req of uni.admissionRequirements; track req) {
                    <li class="flex items-start gap-1.5">
                      <mat-icon class="text-emerald-500 text-xs mt-1 shrink-0">check_circle</mat-icon>
                      <span class="leading-relaxed">{{ req }}</span>
                    </li>
                  }
                </ul>
              </div>

              <!-- Faculty & Labs -->
              <div class="space-y-1">
                <div class="text-xs font-semibold text-slate-300">اساتید شاخص و آزمایشگاه‌ها:</div>
                <div class="text-[11px] text-slate-400 leading-relaxed">
                  {{ uni.facultyOrLabs.join(' · ') }}
                </div>
              </div>

              <!-- Tips for Alireza -->
              @if (uni.acceptanceTipsFa) {
                <div class="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200/90 space-y-1">
                  <div class="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                    <mat-icon class="text-xs">stars</mat-icon>
                    <span>نکته کلیدی قبولی:</span>
                  </div>
                  <p class="leading-relaxed text-[11px]">{{ uni.acceptanceTipsFa }}</p>
                </div>
              }
            </div>

            <!-- Action Buttons: Direct PhD Admission Link & Faculty Website -->
            <div class="flex items-center gap-2 pt-3 border-t border-slate-800/80">
              <a
                [href]="uni.admissionUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-500/10"
              >
                <span>صفحه پذیرش دکتری (Admission)</span>
                <mat-icon class="text-sm">open_in_new</mat-icon>
              </a>

              <a
                [href]="uni.websiteUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
                title="وب‌سایت دانشکده"
              >
                <mat-icon class="text-sm">language</mat-icon>
              </a>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class AppUniversitiesView {
  readonly store = inject(AcademicStore);
  readonly selectedType = signal<'iran' | 'world'>('iran');
  readonly fieldFilter = signal<string>('all');
  readonly searchControl = new FormControl('');

  readonly filteredUniversities = computed<UniversityItem[]>(() => {
    const list =
      this.selectedType() === 'iran'
        ? this.store.iranUniversities()
        : this.store.worldUniversities();

    const query = (this.searchControl.value || '').trim().toLowerCase();
    const filter = this.fieldFilter();

    return list.filter((u) => {
      const matchesSearch =
        !query ||
        u.nameFa.toLowerCase().includes(query) ||
        u.nameEn.toLowerCase().includes(query) ||
        u.city.toLowerCase().includes(query) ||
        u.fields.some((f) => f.toLowerCase().includes(query)) ||
        u.facultyOrLabs.some((fac) => fac.toLowerCase().includes(query));

      const matchesField =
        filter === 'all' ||
        u.fields.some((f) => f.toLowerCase().includes(filter.toLowerCase()));

      return matchesSearch && matchesField;
    });
  });
}
