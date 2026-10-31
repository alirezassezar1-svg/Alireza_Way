import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AcademicStore } from '../services/academic-store';
import { TabType } from '../models/academic.models';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-bottom-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <nav class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/90 px-2 py-1.5 flex items-center justify-around safe-area-bottom">
      @for (item of mobileItems; track item.tab) {
        <button
          (click)="store.setActiveTab(item.tab)"
          class="flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors"
          [class.text-emerald-400]="store.activeTab() === item.tab"
          [class.text-slate-400]="store.activeTab() !== item.tab"
        >
          <mat-icon class="text-xl mb-0.5">
            {{ item.icon }}
          </mat-icon>
          <span class="whitespace-nowrap">{{ item.label }}</span>
        </button>
      }
    </nav>
  `,
})
export class AppBottomNav {
  readonly store = inject(AcademicStore);

  readonly mobileItems: { tab: TabType; label: string; icon: string }[] = [
    { tab: 'dashboard', label: 'داشبورد', icon: 'space_dashboard' },
    { tab: 'universities', label: 'دانشگاه‌ها', icon: 'account_balance' },
    { tab: 'libraries', label: 'منابع علمی', icon: 'auto_stories' },
    { tab: 'tools', label: 'مهارت‌ها', icon: 'psychology' },
    { tab: 'calendar', label: 'تقویم', icon: 'calendar_month' },
    { tab: 'bookmarks', label: 'نشان‌ها', icon: 'bookmark' },
  ];
}
