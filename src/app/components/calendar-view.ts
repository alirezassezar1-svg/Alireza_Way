import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { AcademicStore } from '../services/academic-store';
import { AcademicEventItem } from '../models/academic.models';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-calendar-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6 text-right pb-12">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2">
            <mat-icon class="text-emerald-400">calendar_month</mat-icon>
            <span>تقویم جامع ددلاین‌های علمی و رویدادهای دانشگاهی</span>
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            زمان‌بندی آزمون دکتری سراسری، مهلت ارسال مدارک دانشگاه‌های خارجی، ددلاین کنفرانس‌ها و رویدادهای شخصی
          </p>
        </div>

        <button
          (click)="showAddEventForm.set(!showAddEventForm())"
          class="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all self-start sm:self-auto shadow-sm"
        >
          <mat-icon class="text-sm">{{ showAddEventForm() ? 'remove' : 'add' }}</mat-icon>
          <span>{{ showAddEventForm() ? 'بستن فرم' : 'افزودن رویداد یا ددلاین شخصی' }}</span>
        </button>
      </div>

      <!-- Add Custom Event Form (Collapsible) -->
      @if (showAddEventForm()) {
        <div class="p-5 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-4 animate-fade-in">
          <div class="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <mat-icon class="text-sm">event</mat-icon>
            <span>ثبت رویداد جدید در تقویم علمی علیرضا</span>
          </div>

          <form [formGroup]="eventForm" (ngSubmit)="onAddCustomEvent()" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div class="sm:col-span-2">
              <label for="event-title-input" class="block font-semibold text-slate-300 mb-1">عنوان رویداد یا ددلاین:</label>
              <input
                id="event-title-input"
                type="text"
                formControlName="title"
                placeholder="مثال: آزمون شبیه‌ساز زبان، ددلاین ارسال مقاله به کنفرانس AISP"
                class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label for="event-date-input" class="block font-semibold text-slate-300 mb-1">تاریخ میلادی:</label>
              <input
                id="event-date-input"
                type="date"
                formControlName="date"
                class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-left"
                dir="ltr"
              />
            </div>

            <div>
              <label for="event-jalali-input" class="block font-semibold text-slate-300 mb-1">تاریخ شمسی (نمایشی):</label>
              <input
                id="event-jalali-input"
                type="text"
                formControlName="jalaliDate"
                placeholder="مثال: ۱۵ دی ۱۴۰۵"
                class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label for="event-category-select" class="block font-semibold text-slate-300 mb-1">دسته‌بندی:</label>
              <select
                id="event-category-select"
                formControlName="category"
                class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="phd_apply">پذیرش دکتری (PhD Admission)</option>
                <option value="exam">آزمون (کنکور / زبان / مصاحبه)</option>
                <option value="conference">کنفرانس و مقاله</option>
                <option value="personal">رویداد شخصی علیرضا</option>
              </select>
            </div>

            <div class="sm:col-span-3">
              <label for="event-details-input" class="block font-semibold text-slate-300 mb-1">توضیحات و اقدامات لازم:</label>
              <input
                id="event-details-input"
                type="text"
                formControlName="details"
                placeholder="توضیح کوتاه، چک‌لیست مدارک یا یادآوری..."
                class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div class="sm:col-span-4 flex justify-end gap-2 pt-2">
              <button
                type="button"
                (click)="showAddEventForm.set(false)"
                class="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 transition-colors"
              >
                انصراف
              </button>
              <button
                type="submit"
                [disabled]="eventForm.invalid"
                class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all disabled:opacity-50"
              >
                ثبت در تقویم
              </button>
            </div>
          </form>
        </div>
      }

      <!-- Category Filter Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto text-xs pb-1">
        <button
          (click)="categoryFilter.set('all')"
          class="px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          [class.bg-emerald-600]="categoryFilter() === 'all'"
          [class.text-white]="categoryFilter() === 'all'"
          [class.bg-slate-900]="categoryFilter() !== 'all'"
          [class.text-slate-400]="categoryFilter() !== 'all'"
        >
          همه ددلاین‌ها ({{ store.events().length }})
        </button>
        <button
          (click)="categoryFilter.set('exam')"
          class="px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          [class.bg-emerald-600]="categoryFilter() === 'exam'"
          [class.text-white]="categoryFilter() === 'exam'"
          [class.bg-slate-900]="categoryFilter() !== 'exam'"
          [class.text-slate-400]="categoryFilter() !== 'exam'"
        >
          کنکور دکتری و آزمون‌ها
        </button>
        <button
          (click)="categoryFilter.set('phd_apply')"
          class="px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          [class.bg-emerald-600]="categoryFilter() === 'phd_apply'"
          [class.text-white]="categoryFilter() === 'phd_apply'"
          [class.bg-slate-900]="categoryFilter() !== 'phd_apply'"
          [class.text-slate-400]="categoryFilter() !== 'phd_apply'"
        >
          پذیرش دکتری و فاند
        </button>
        <button
          (click)="categoryFilter.set('conference')"
          class="px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          [class.bg-emerald-600]="categoryFilter() === 'conference'"
          [class.text-white]="categoryFilter() === 'conference'"
          [class.bg-slate-900]="categoryFilter() !== 'conference'"
          [class.text-slate-400]="categoryFilter() !== 'conference'"
        >
          کنفرانس‌های علمی
        </button>
        <button
          (click)="categoryFilter.set('personal')"
          class="px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          [class.bg-emerald-600]="categoryFilter() === 'personal'"
          [class.text-white]="categoryFilter() === 'personal'"
          [class.bg-slate-900]="categoryFilter() !== 'personal'"
          [class.text-slate-400]="categoryFilter() !== 'personal'"
        >
          رویدادهای شخصی
        </button>
      </div>

      <!-- Events Timeline List -->
      <div class="space-y-3">
        @for (ev of filteredEvents(); track ev.id) {
          <div
            class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            [class.border-emerald-500/20]="ev.completed"
            [class.opacity-70]="ev.completed"
          >
            <div class="flex items-start gap-3 flex-1 min-w-0">
              <button
                (click)="store.toggleEvent(ev.id)"
                class="mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 cursor-pointer"
                [class.bg-emerald-500]="ev.completed"
                [class.border-emerald-500]="ev.completed"
                [class.border-slate-600]="!ev.completed"
                title="تیک زدن انجام رویداد"
              >
                @if (ev.completed) {
                  <mat-icon class="text-slate-950 text-sm font-black">check</mat-icon>
                }
              </button>

              <div class="space-y-1 min-w-0">
                <div class="flex items-center gap-2">
                  <h3
                    class="text-xs sm:text-sm font-bold text-slate-100"
                    [class.line-through]="ev.completed"
                    [class.text-slate-400]="ev.completed"
                  >
                    {{ ev.title }}
                  </h3>
                  @if (ev.isCustom) {
                    <span class="text-[9px] px-1.5 py-0.5 rounded bg-teal-950 text-teal-400 border border-teal-500/30">
                      شخصی
                    </span>
                  }
                </div>

                @if (ev.details) {
                  <p class="text-xs text-slate-400 leading-relaxed">
                    {{ ev.details }}
                  </p>
                }
              </div>
            </div>

            <!-- Date, Badges & Actions -->
            <div class="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
              <div class="text-right sm:text-left">
                <div class="text-xs font-bold text-emerald-400 font-mono tabular-nums">
                  {{ ev.jalaliDate || ev.date }}
                </div>
                <div class="text-[10px] text-slate-500 font-mono" dir="ltr">
                  {{ ev.date }}
                </div>
              </div>

              @if (ev.link) {
                <a
                  [href]="ev.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                  title="لینک رسمی رویداد"
                >
                  <mat-icon class="text-base">open_in_new</mat-icon>
                </a>
              }

              @if (ev.isCustom) {
                <button
                  (click)="store.removeEvent(ev.id)"
                  class="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="حذف رویداد"
                >
                  <mat-icon class="text-base">delete</mat-icon>
                </button>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class AppCalendarView {
  readonly store = inject(AcademicStore);
  readonly showAddEventForm = signal<boolean>(false);
  readonly categoryFilter = signal<string>('all');

  readonly eventForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    date: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    jalaliDate: new FormControl('', { nonNullable: true }),
    category: new FormControl<'phd_apply' | 'conference' | 'exam' | 'term' | 'personal'>('phd_apply', {
      nonNullable: true,
    }),
    details: new FormControl('', { nonNullable: true }),
  });

  readonly filteredEvents = computed<AcademicEventItem[]>(() => {
    const list = this.store.events();
    const filter = this.categoryFilter();
    if (filter === 'all') return list;
    return list.filter((e) => e.category === filter);
  });

  onAddCustomEvent(): void {
    if (this.eventForm.invalid) return;
    const vals = this.eventForm.getRawValue();
    this.store.addEvent(
      vals.title,
      vals.date,
      vals.jalaliDate || vals.date,
      vals.category,
      undefined,
      vals.details || undefined
    );
    this.eventForm.reset({ category: 'phd_apply' });
    this.showAddEventForm.set(false);
  }
}
