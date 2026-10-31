import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AcademicStore } from '../services/academic-store';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-bookmarks-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div class="space-y-6 text-right pb-12">
      <!-- Section Header -->
      <div class="border-b border-slate-800 pb-4">
        <h1 class="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2">
          <mat-icon class="text-amber-400">bookmark</mat-icon>
          <span>نشان‌شده‌های اختصاصی علیرضا</span>
        </h1>
        <p class="text-xs text-slate-400 mt-1">
          مجموعه دانشگاه‌ها، منابع علمی، آزمایشگاه‌ها و ابزارهای برگزیده به همراه یادداشت‌های شخصی شما
        </p>
      </div>

      @if (store.allBookmarkedItems().length === 0) {
        <div class="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <mat-icon class="text-slate-600 text-4xl">bookmark_border</mat-icon>
          <h2 class="text-sm font-bold text-slate-300">هنوز موردی نشان نشده است</h2>
          <p class="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            در هر یک از بخش‌های دانشگاه‌ها، کتابخانه‌ها، کنفرانس‌ها یا ابزارها روی آیکون نشان‌گذاری کلیک کنید تا در این صفحه ذخیره شود.
          </p>
          <button
            (click)="store.setActiveTab('universities')"
            class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all inline-flex items-center gap-1.5"
          >
            <span>مرور دانشگاه‌های برتر</span>
            <mat-icon class="text-sm">arrow_forward</mat-icon>
          </button>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          @for (item of store.allBookmarkedItems(); track item.id) {
            <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3">
              <div class="space-y-2">
                <div class="flex items-start justify-between gap-3">
                  <div class="space-y-0.5 min-w-0">
                    <span class="text-[10px] text-emerald-400 font-medium">
                      {{ item.category }}
                    </span>
                    <h3 class="text-sm font-bold text-slate-100 truncate">
                      {{ item.title }}
                    </h3>
                    <div class="text-[11px] text-slate-400 font-mono truncate" dir="ltr">
                      {{ item.subtitle }}
                    </div>
                  </div>

                  <div class="flex items-center gap-1 shrink-0">
                    <button
                      (click)="store.openNoteModal(item.id, item.title)"
                      class="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                      [class.text-emerald-400]="item.userNote"
                      title="یادداشت شخصی"
                    >
                      <mat-icon class="text-sm">
                        {{ item.userNote ? 'sticky_note_2' : 'edit_note' }}
                      </mat-icon>
                    </button>
                    <button
                      (click)="store.toggleBookmark(item.id)"
                      class="p-1.5 rounded-lg text-amber-400 hover:text-slate-400 hover:bg-slate-800 transition-colors"
                      title="حذف از نشان‌شده‌ها"
                    >
                      <mat-icon class="text-sm">bookmark</mat-icon>
                    </button>
                  </div>
                </div>

                @if (item.userNote) {
                  <div class="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300">
                    <span class="font-semibold text-emerald-400">یادداشت: </span>
                    <span class="leading-relaxed">{{ item.userNote }}</span>
                  </div>
                }
              </div>

              <div class="flex items-center gap-2 pt-2 border-t border-slate-800">
                <a
                  [href]="item.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all"
                >
                  <span>ورود مستقیم به سایت</span>
                  <mat-icon class="text-xs">open_in_new</mat-icon>
                </a>
                <button
                  (click)="store.setActiveTab(item.tab)"
                  class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
                >
                  مشاهده در بخش مربوطه
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class AppBookmarksView {
  readonly store = inject(AcademicStore);
}
