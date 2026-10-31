import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { AcademicStore } from '../services/academic-store';
import { ResearchLabItem } from '../models/academic.models';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-labs-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6 text-right pb-12">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2">
            <mat-icon class="text-emerald-400">science</mat-icon>
            <span>مراکز تحقیقاتی و آزمایشگاه‌های پیشرو هوش مصنوعی</span>
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            آزمایشگاه‌های برتر دانشگاهی ایران و غول‌های پژوهشی هوش مصنوعی جهان به همراه فرصت‌های کارآموزی و دوره‌های رزیدنسی
          </p>
        </div>

        <!-- Filter Iran vs World -->
        <div class="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start sm:self-auto">
          <button
            (click)="selectedLabType.set('all')"
            class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
            [class.bg-emerald-600]="selectedLabType() === 'all'"
            [class.text-white]="selectedLabType() === 'all'"
            [class.text-slate-400]="selectedLabType() !== 'all'"
          >
            همه مراکز ({{ store.labs().length }})
          </button>
          <button
            (click)="selectedLabType.set('iran')"
            class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
            [class.bg-emerald-600]="selectedLabType() === 'iran'"
            [class.text-white]="selectedLabType() === 'iran'"
            [class.text-slate-400]="selectedLabType() !== 'iran'"
          >
            مراکز مهم ایران
          </button>
          <button
            (click)="selectedLabType.set('world')"
            class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
            [class.bg-emerald-600]="selectedLabType() === 'world'"
            [class.text-white]="selectedLabType() === 'world'"
            [class.text-slate-400]="selectedLabType() !== 'world'"
          >
            مراکز جهانی (OpenAI, DeepMind, ...)
          </button>
        </div>
      </div>

      <!-- Search Input -->
      <div>
        <input
          [formControl]="searchControl"
          type="text"
          aria-label="جستجوی آزمایشگاه یا مرکز تحقیقاتی"
          placeholder="جستجو بر اساس نام آزمایشگاه، سازمان یا حوزه‌های پژوهشی (LLM, Vision, Robotics)..."
          class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <!-- Labs Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        @for (lab of filteredLabs(); track lab.id) {
          <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
            <div class="space-y-3">
              <!-- Top Row: Name, Organization, Actions -->
              <div class="flex items-start justify-between gap-3">
                <div class="space-y-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <h3 class="text-sm sm:text-base font-bold text-slate-100">
                      {{ lab.nameFa }}
                    </h3>
                  </div>
                  <div class="text-xs text-slate-400 font-mono" dir="ltr">
                    {{ lab.nameEn }}
                  </div>
                  <div class="text-[11px] text-emerald-400 font-medium">
                    {{ lab.organization }} · {{ lab.location }}
                  </div>
                </div>

                <div class="flex items-center gap-1 shrink-0">
                  <button
                    (click)="store.openNoteModal(lab.id, lab.nameFa)"
                    class="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                    [class.text-emerald-400]="store.getItemNote(lab.id)"
                    title="یادداشت شخصی"
                  >
                    <mat-icon class="text-base">
                      {{ store.getItemNote(lab.id) ? 'sticky_note_2' : 'edit_note' }}
                    </mat-icon>
                  </button>
                  <button
                    (click)="store.toggleBookmark(lab.id)"
                    class="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                    [class.text-amber-400]="store.isItemBookmarked(lab.id)"
                    title="نشان‌گذاری"
                  >
                    <mat-icon class="text-base">
                      {{ store.isItemBookmarked(lab.id) ? 'bookmark' : 'bookmark_border' }}
                    </mat-icon>
                  </button>
                </div>
              </div>

              <!-- Note if exists -->
              @if (store.getItemNote(lab.id)) {
                <div class="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300">
                  <span class="font-semibold text-emerald-400">یادداشت: </span>
                  <span>{{ store.getItemNote(lab.id) }}</span>
                </div>
              }

              <!-- Focus Areas -->
              <div class="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                <span class="text-slate-500">تمرکز پژوهشی:</span>
                @for (area of lab.focusAreas; track area) {
                  <span class="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300">
                    {{ area }}
                  </span>
                }
              </div>

              <!-- Description -->
              <p class="text-xs text-slate-400 leading-relaxed">
                {{ lab.descriptionFa }}
              </p>
            </div>

            <!-- Action Buttons: Main Site & Opportunities/Fellowships -->
            <div class="flex items-center gap-2 pt-3 border-t border-slate-800">
              <a
                [href]="lab.opportunitiesUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-sm"
              >
                <span>فرصت‌های پژوهشی / Fellowships</span>
                <mat-icon class="text-sm">work_outline</mat-icon>
              </a>

              <a
                [href]="lab.websiteUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
                title="وب‌سایت اصلی آزمایشگاه"
              >
                <mat-icon class="text-sm">open_in_new</mat-icon>
              </a>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class AppLabsView {
  readonly store = inject(AcademicStore);
  readonly selectedLabType = signal<'all' | 'iran' | 'world'>('all');
  readonly searchControl = new FormControl('');

  readonly filteredLabs = computed<ResearchLabItem[]>(() => {
    const list = this.store.labs();
    const typeFilter = this.selectedLabType();
    const query = (this.searchControl.value || '').trim().toLowerCase();

    return list.filter((lab) => {
      const matchesType =
        typeFilter === 'all' || lab.type === typeFilter;

      const matchesSearch =
        !query ||
        lab.nameFa.toLowerCase().includes(query) ||
        lab.nameEn.toLowerCase().includes(query) ||
        lab.organization.toLowerCase().includes(query) ||
        lab.focusAreas.some((fa) => fa.toLowerCase().includes(query)) ||
        lab.descriptionFa.toLowerCase().includes(query);

      return matchesType && matchesSearch;
    });
  });
}
