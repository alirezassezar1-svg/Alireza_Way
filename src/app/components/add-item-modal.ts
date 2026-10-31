import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AcademicStore } from '../services/academic-store';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-item-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, ReactiveFormsModule],
  template: `
    @if (store.isAddItemModalOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop Button -->
        <button
          type="button"
          class="fixed inset-0 w-full h-full bg-black/75 backdrop-blur-sm transition-opacity"
          (click)="onBackdropClick()"
          aria-label="بستن فرم افزودن"
        ></button>

        <div
          class="relative z-10 w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-4 text-right max-h-[90vh] overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div class="flex items-center gap-2">
              <mat-icon class="text-emerald-400">add_circle_outline</mat-icon>
              <h3 class="text-sm font-bold text-slate-100">
                افزودن لینک یا مرجع جدید به سامانه
              </h3>
            </div>
            <button
              (click)="store.closeAddItemModal()"
              class="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              aria-label="بستن"
            >
              <mat-icon class="text-lg">close</mat-icon>
            </button>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-3.5">
            <!-- Category Selection -->
            <div>
              <label for="item-type-select" class="block text-xs font-semibold text-slate-300 mb-1">
                دسته‌بندی مرجع:
              </label>
              <select
                id="item-type-select"
                formControlName="itemType"
                class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="university">دانشگاه (ایران یا جهان)</option>
                <option value="library">کتابخانه یا منبع علمی / کتاب مرجع</option>
                <option value="lab">مرکز تحقیقاتی یا آزمایشگاه هوش مصنوعی</option>
                <option value="conference">کنفرانس یا همایش علمی</option>
                <option value="tool">ابزار کاربردی پژوهشگر</option>
              </select>
            </div>

            <!-- Title FA -->
            <div>
              <label for="title-fa-input" class="block text-xs font-semibold text-slate-300 mb-1">
                عنوان فارسی:
              </label>
              <input
                id="title-fa-input"
                type="text"
                formControlName="titleFa"
                placeholder="مثال: دانشگاه صنعتی نوشیروانی بابل یا کتاب بهینه‌سازی استیون بوید"
                class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <!-- Title EN -->
            <div>
              <label for="title-en-input" class="block text-xs font-semibold text-slate-300 mb-1">
                عنوان انگلیسی (اختیاری):
              </label>
              <input
                id="title-en-input"
                type="text"
                formControlName="titleEn"
                placeholder="Example: Oxford Robotics Institute"
                class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-left"
                dir="ltr"
              />
            </div>

            <!-- URL -->
            <div>
              <label for="item-url-input" class="block text-xs font-semibold text-slate-300 mb-1">
                لینک مستقیم و معتبر اینترنتی:
              </label>
              <input
                id="item-url-input"
                type="url"
                formControlName="url"
                placeholder="https://..."
                class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-left"
                dir="ltr"
              />
            </div>

            <!-- Contextual fields: Subtype / City / Provider -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label for="city-location-input" class="block text-xs font-semibold text-slate-300 mb-1">
                  موقعیت / کشور / نوع:
                </label>
                <input
                  id="city-location-input"
                  type="text"
                  formControlName="city"
                  placeholder="مثال: ایران، سوئیس، آنلاین"
                  class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label for="fields-topic-input" class="block text-xs font-semibold text-slate-300 mb-1">
                  حوزه تخصصی / برچسب:
                </label>
                <input
                  id="fields-topic-input"
                  type="text"
                  formControlName="fields"
                  placeholder="مثال: Deep Learning, NLP"
                  class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <!-- Description -->
            <div>
              <label for="description-textarea" class="block text-xs font-semibold text-slate-300 mb-1">
                توضیحات و نکات کلیدی:
              </label>
              <textarea
                id="description-textarea"
                formControlName="descriptionFa"
                rows="3"
                placeholder="توضیحات مختصر در مورد شرایط پذیرش، دسترسی رایگان یا کاربرد..."
                class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
              ></textarea>
            </div>

            <!-- Submit buttons -->
            <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                (click)="store.closeAddItemModal()"
                class="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                انصراف
              </button>
              <button
                type="submit"
                [disabled]="form.invalid"
                class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <mat-icon class="text-sm">check</mat-icon>
                <span>ثبت و ذخیره در سیستم</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
})
export class AppAddItemModal {
  readonly store = inject(AcademicStore);

  readonly form = new FormGroup({
    itemType: new FormControl<'university' | 'library' | 'lab' | 'conference' | 'tool'>('university', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    titleFa: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    titleEn: new FormControl('', { nonNullable: true }),
    url: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    city: new FormControl('', { nonNullable: true }),
    fields: new FormControl('', { nonNullable: true }),
    descriptionFa: new FormControl('', { nonNullable: true }),
  });

  onBackdropClick(): void {
    this.store.closeAddItemModal();
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const values = this.form.getRawValue();
    this.store.addCustomItem(values.itemType, {
      titleFa: values.titleFa,
      titleEn: values.titleEn,
      url: values.url,
      city: values.city,
      fields: values.fields,
      descriptionFa: values.descriptionFa,
      subType: values.itemType === 'university' && values.city?.includes('ایران') ? 'iran' : 'world',
    });
    this.form.reset({ itemType: 'university' });
  }
}
