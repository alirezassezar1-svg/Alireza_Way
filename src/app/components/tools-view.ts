import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AcademicStore } from '../services/academic-store';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tools-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div class="space-y-8 text-right pb-12">
      <!-- Section Header -->
      <div class="border-b border-slate-800 pb-4">
        <h1 class="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2">
          <mat-icon class="text-emerald-400">psychology</mat-icon>
          <span>ابزارهای تخصصی و نقشه راه مهارتی از ارشد تا دکتری</span>
        </h1>
        <p class="text-xs text-slate-400 mt-1">
          چک‌لیست ۱۰ گام استراتژیک علیرضا به همراه ابزارهای عملیاتی پژوهشگران هوش مصنوعی
        </p>
      </div>

      <!-- Part 1: Interactive 5-Phase Skill Checklist -->
      <div class="space-y-4">
        <!-- Progress Summary Card -->
        <div class="p-5 rounded-2xl bg-gradient-to-l from-slate-900 to-slate-950 border border-slate-800 space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                <mat-icon class="text-emerald-400 text-lg">fact_check</mat-icon>
                <span>چک‌لیست مهارت‌های ضروری از روز اول ارشد تا قبولی دکتری</span>
              </h2>
              <p class="text-xs text-slate-400 mt-0.5">
                با تیک زدن هر مرحله، پیشرفت شما ذخیره می‌شود.
              </p>
            </div>
            <div class="text-left font-mono tabular-nums">
              <span class="text-xl sm:text-2xl font-black text-emerald-400">
                {{ store.skillProgressPercentage() }}%
              </span>
              <div class="text-[10px] text-slate-500">
                {{ store.completedSkillsCount() }} از {{ store.totalSkillsCount() }} گام
              </div>
            </div>
          </div>

          <div class="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
              [style.width.%]="store.skillProgressPercentage()"
            ></div>
          </div>
        </div>

        <!-- 5 Phases Cards -->
        <div class="space-y-4">
          @for (phaseNum of [1, 2, 3, 4, 5]; track phaseNum) {
            <div class="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2">
                  <span class="w-6 h-6 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-bold font-mono">
                    {{ phaseNum }}
                  </span>
                  <h3 class="text-xs sm:text-sm font-bold text-slate-100">
                    {{ getPhaseTitle(phaseNum) }}
                  </h3>
                </div>
                <span class="text-[11px] text-slate-400 font-medium">
                  {{ getPhaseTimeframe(phaseNum) }}
                </span>
              </div>

              <!-- Milestones for this phase -->
              <div class="space-y-3">
                @for (item of getPhaseSkills(phaseNum); track item.id) {
                  <div
                    class="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2.5"
                    [class.border-emerald-500/30]="item.completed"
                  >
                    <div class="flex items-start justify-between gap-3">
                      <div class="flex items-start gap-3 flex-1 min-w-0">
                        <button
                          (click)="store.toggleSkill(item.id)"
                          class="mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 cursor-pointer"
                          [class.bg-emerald-500]="item.completed"
                          [class.border-emerald-500]="item.completed"
                          [class.border-slate-600]="!item.completed"
                        >
                          @if (item.completed) {
                            <mat-icon class="text-slate-950 text-sm font-black">check</mat-icon>
                          }
                        </button>

                        <div class="space-y-1 min-w-0">
                          <h4
                            class="text-xs sm:text-sm font-bold text-slate-200 leading-snug"
                            [class.text-slate-400]="item.completed"
                            [class.line-through]="item.completed"
                          >
                            {{ item.title }}
                          </h4>
                          <p class="text-xs text-slate-400 leading-relaxed">
                            {{ item.description }}
                          </p>
                        </div>
                      </div>

                      <span
                        class="text-[10px] px-2 py-0.5 rounded font-medium shrink-0 font-mono"
                        [class.bg-emerald-950]="item.completed"
                        [class.text-emerald-400]="item.completed"
                        [class.bg-slate-800]="!item.completed"
                        [class.text-slate-400]="!item.completed"
                      >
                        {{ item.completed ? 'انجام شد' : 'در انتظار' }}
                      </span>
                    </div>

                    <!-- Key Actions Sub-bullets -->
                    <div class="pr-8 pt-1">
                      <div class="text-[10px] text-slate-400 font-semibold mb-1">اقدامات کلیدی:</div>
                      <ul class="space-y-1 text-[11px] text-slate-400">
                        @for (act of item.keyActions; track act) {
                          <li class="flex items-start gap-1.5">
                            <span class="text-emerald-400 font-bold">·</span>
                            <span>{{ act }}</span>
                          </li>
                        }
                      </ul>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Part 2: Essential Researcher Tools -->
      <div class="space-y-4 pt-6 border-t border-slate-800">
        <div>
          <h2 class="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
            <mat-icon class="text-emerald-400">build</mat-icon>
            <span>ابزارهای حیاتی پژوهشگر هوش مصنوعی (Direct Links & Tools)</span>
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            ابزارهایی که روزانه برای کدنویسی، مقاله‌نویسی در LaTeX، ردیابی آزمایش‌ها و مصورسازی مراجع نیاز دارید
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          @for (tool of store.tools(); track tool.id) {
            <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-bold text-slate-200">
                    {{ tool.name }}
                  </h3>
                  <div class="flex items-center gap-1">
                    <button
                      (click)="store.openNoteModal(tool.id, tool.name)"
                      class="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                      [class.text-emerald-400]="store.getItemNote(tool.id)"
                      title="یادداشت"
                    >
                      <mat-icon class="text-sm">
                        {{ store.getItemNote(tool.id) ? 'sticky_note_2' : 'edit_note' }}
                      </mat-icon>
                    </button>
                    <button
                      (click)="store.toggleBookmark(tool.id)"
                      class="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                      [class.text-amber-400]="store.isItemBookmarked(tool.id)"
                      title="نشان‌گذاری"
                    >
                      <mat-icon class="text-sm">
                        {{ store.isItemBookmarked(tool.id) ? 'bookmark' : 'bookmark_border' }}
                      </mat-icon>
                    </button>
                  </div>
                </div>

                <!-- Note if exists -->
                @if (store.getItemNote(tool.id)) {
                  <div class="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-emerald-300">
                    <span class="font-semibold text-emerald-400">یادداشت: </span>
                    <span>{{ store.getItemNote(tool.id) }}</span>
                  </div>
                }

                <p class="text-xs text-slate-400 leading-relaxed">
                  {{ tool.descriptionFa }}
                </p>

                <!-- Features list -->
                <div class="space-y-1 pt-1 text-[11px] text-slate-400">
                  @for (feat of tool.features; track feat) {
                    <div class="flex items-center gap-1.5">
                      <mat-icon class="text-emerald-500 text-xs">done</mat-icon>
                      <span>{{ feat }}</span>
                    </div>
                  }
                </div>
              </div>

              <div class="pt-2 border-t border-slate-800">
                <a
                  [href]="tool.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-semibold transition-all group"
                >
                  <span>ورود مستقیم به {{ tool.name }}</span>
                  <mat-icon class="text-xs group-hover:translate-x-0.5 transition-transform">open_in_new</mat-icon>
                </a>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class AppToolsView {
  readonly store = inject(AcademicStore);

  getPhaseTitle(phase: number): string {
    switch (phase) {
      case 1:
        return 'فاز ۱: تسلط بنیادین و سال اول ارشد دزفول';
      case 2:
        return 'فاز ۲: پژوهش، تز ارشد و نگارش اولین مقاله';
      case 3:
        return 'فاز ۳: آزمون زبان، رزومه‌سازی و دفاع ارشد';
      case 4:
        return 'فاز ۴: پذیرش دکتری دانشگاه‌های برتر ایران (شریف/تهران/امیرکبیر)';
      case 5:
        return 'فاز ۵: اپلای و پذیرش دکتری با فاند کامل در برترین دانشگاه‌های جهان';
      default:
        return `فاز ${phase}`;
    }
  }

  getPhaseTimeframe(phase: number): string {
    switch (phase) {
      case 1:
        return 'ترم ۱ و ۲ ارشد';
      case 2:
        return 'ترم ۳ ارشد';
      case 3:
        return 'ترم ۴ و دفاع';
      case 4:
        return 'پاییز تا بهار';
      case 5:
        return 'شهریور تا دی‌ماه';
      default:
        return '';
    }
  }

  getPhaseSkills(phase: number) {
    return this.store.skills().filter((s) => s.phaseId === phase);
  }
}
