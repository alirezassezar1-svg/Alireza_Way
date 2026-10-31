import {
  ChangeDetectionStrategy,
  Component,
  inject,
  effect,
} from '@angular/core';
import { AcademicStore } from '../services/academic-store';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-note-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, ReactiveFormsModule],
  template: `
    @if (store.isNoteModalOpen() && store.activeNoteItem()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop Button for accessibility -->
        <button
          type="button"
          class="fixed inset-0 w-full h-full bg-black/75 backdrop-blur-sm transition-opacity"
          (click)="onBackdropClick()"
          aria-label="بستن پنجره"
        ></button>

        <!-- Dialog Box -->
        <div
          class="relative z-10 w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-4 text-right"
          role="dialog"
          aria-modal="true"
        >
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div class="flex items-center gap-2">
              <mat-icon class="text-emerald-400">edit_note</mat-icon>
              <h3 class="text-sm font-bold text-slate-100">
                یادداشت شخصی علیرضا
              </h3>
            </div>
            <button
              (click)="store.closeNoteModal()"
              class="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              aria-label="بستن"
            >
              <mat-icon class="text-lg">close</mat-icon>
            </button>
          </div>

          <div>
            <div class="text-xs font-semibold text-emerald-400 mb-1">
              {{ store.activeNoteItem()?.title }}
            </div>
            <p class="text-[11px] text-slate-400">
              این یادداشت به صورت اختصاصی در مرورگر شما ذخیره می‌شود (مناسب برای ثبت نام استاد، ایمیل، ایده تحقیق، ددلاین یا شروط اختصاصی).
            </p>
          </div>

          <div>
            <label for="alireza-note-textarea" class="sr-only">متن یادداشت</label>
            <textarea
              id="alireza-note-textarea"
              [formControl]="noteControl"
              rows="5"
              placeholder="یادداشت یا نکته مهم خود را اینجا بنویسید (مثلاً: تماس با دکتر ربیعی برای موضوع ترنسفورمرها، یا نیاز به نمره آیلتس ۷.۵)..."
              class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all leading-relaxed"
            ></textarea>
          </div>

          <div class="flex items-center justify-between pt-2">
            <button
              (click)="onClearNote()"
              type="button"
              class="text-xs text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
            >
              <mat-icon class="text-sm">delete_outline</mat-icon>
              <span>حذف یادداشت</span>
            </button>

            <div class="flex items-center gap-2">
              <button
                (click)="store.closeNoteModal()"
                type="button"
                class="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                انصراف
              </button>
              <button
                (click)="onSaveNote()"
                type="button"
                class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/10"
              >
                <mat-icon class="text-sm">save</mat-icon>
                <span>ذخیره یادداشت</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class AppNoteModal {
  readonly store = inject(AcademicStore);
  readonly noteControl = new FormControl('');

  constructor() {
    effect(() => {
      const active = this.store.activeNoteItem();
      if (active) {
        this.noteControl.setValue(active.currentNote || '');
      }
    });
  }

  onBackdropClick(): void {
    this.store.closeNoteModal();
  }

  onSaveNote(): void {
    const val = this.noteControl.value || '';
    this.store.saveActiveNote(val);
  }

  onClearNote(): void {
    this.noteControl.setValue('');
    this.store.saveActiveNote('');
  }
}
