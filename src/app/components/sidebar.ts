import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AcademicStore } from '../services/academic-store';
import { TabType } from '../models/academic.models';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <aside class="w-64 shrink-0 hidden lg:flex flex-col justify-between h-[calc(100vh-61px)] sticky top-[61px] border-l border-slate-800 bg-slate-950/60 p-4 overflow-y-auto">
      <div class="space-y-6">
        <!-- Alireza's Profile & Progress Card -->
        <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-right">
          <div class="flex items-center gap-3 mb-2.5">
            <div class="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
              ع
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-xs font-bold text-slate-100 truncate">علیرضا</div>
              <div class="text-[11px] text-slate-400 truncate">۳۰ ساله · ارشد هوش مصنوعی</div>
              <div class="text-[10px] text-emerald-400 font-medium">دانشگاه آزاد اسلامی واحد دزفول</div>
            </div>
          </div>

          <!-- Progress Mini Bar -->
          <div class="pt-2 border-t border-slate-800/80">
            <div class="flex items-center justify-between text-[11px] mb-1">
              <span class="text-slate-400">پیشرفت مسیر علمی</span>
              <span class="text-emerald-400 font-semibold font-mono tabular-nums">
                {{ store.skillProgressPercentage() }}%
              </span>
            </div>
            <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
                [style.width.%]="store.skillProgressPercentage()"
              ></div>
            </div>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="space-y-1">
          @for (item of navItems; track item.tab) {
            <button
              (click)="store.setActiveTab(item.tab)"
              class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-right group"
              [class.bg-emerald-600]="store.activeTab() === item.tab"
              [class.text-white]="store.activeTab() === item.tab"
              [class.shadow-sm]="store.activeTab() === item.tab"
              [class.text-slate-400]="store.activeTab() !== item.tab"
              [class.hover:text-slate-100]="store.activeTab() !== item.tab"
              [class.hover:bg-slate-900]="store.activeTab() !== item.tab"
            >
              <div class="flex items-center gap-2.5">
                <mat-icon
                  class="text-lg transition-transform group-hover:scale-110"
                  [class.text-white]="store.activeTab() === item.tab"
                  [class.text-slate-400]="store.activeTab() !== item.tab"
                >
                  {{ item.icon }}
                </mat-icon>
                <span>{{ item.label }}</span>
              </div>

              @if (item.badge) {
                <span
                  class="text-[10px] px-1.5 py-0.5 rounded-full font-mono tabular-nums"
                  [class.bg-emerald-700]="store.activeTab() === item.tab"
                  [class.text-white]="store.activeTab() === item.tab"
                  [class.bg-slate-800]="store.activeTab() !== item.tab"
                  [class.text-slate-400]="store.activeTab() !== item.tab"
                >
                  {{ item.badge }}
                </span>
              }
            </button>
          }
        </nav>
      </div>

      <!-- Footer Info -->
      <div class="pt-4 border-t border-slate-800/80 space-y-2 text-right">
        <div class="text-[11px] text-slate-500 leading-relaxed">
          هدف: پذیرش دکتری هوش مصنوعی با فاند کامل و دانشگاه‌های برتر ایران
        </div>
        <div class="flex items-center justify-between text-[10px] text-slate-600">
          <span>نگارش ۱.۰ · اختصاصی علیرضا</span>
          <button
            (click)="store.resetToDefaultData()"
            class="hover:text-rose-400 transition-colors"
            title="بازنشانی داده‌ها به حالت اولیه"
          >
            بازنشانی
          </button>
        </div>
      </div>
    </aside>
  `,
})
export class AppSidebar {
  readonly store = inject(AcademicStore);

  get navItems(): { tab: TabType; label: string; icon: string; badge?: number | string }[] {
    const bookmarkedCount = this.store.allBookmarkedItems().length;
    return [
      { tab: 'dashboard', label: 'داشبورد شخصی', icon: 'space_dashboard' },
      { tab: 'universities', label: 'دانشگاه‌ها (ایران و جهان)', icon: 'account_balance' },
      { tab: 'libraries', label: 'کتابخانه‌ها و منابع علمی', icon: 'auto_stories' },
      { tab: 'labs', label: 'مراکز تحقیقاتی و آزمایشگاه‌ها', icon: 'science' },
      { tab: 'conferences', label: 'کنفرانس‌ها و دوره‌ها', icon: 'event_available' },
      { tab: 'tools', label: 'ابزارها و مسیر مهارت', icon: 'psychology' },
      { tab: 'calendar', label: 'تقویم علمی و ددلاین‌ها', icon: 'calendar_month' },
      {
        tab: 'bookmarks',
        label: 'نشان‌شده‌ها',
        icon: 'bookmark',
        badge: bookmarkedCount > 0 ? bookmarkedCount : undefined,
      },
    ];
  }
}
