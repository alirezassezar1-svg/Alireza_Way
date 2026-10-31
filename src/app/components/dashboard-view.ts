import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AcademicStore } from '../services/academic-store';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6 text-right pb-12">
      <!-- Hero Welcome Card -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-l from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-6 lg:p-8">
        <div class="relative z-10 max-w-3xl space-y-3">
          <div class="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <mat-icon class="text-sm">verified</mat-icon>
            <span>سامانه پایش اختصاصی مسیر علمی علیرضا</span>
          </div>
          <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-100 leading-tight">
            از کارشناسی ارشد هوش مصنوعی دزفول تا دکتری در بهترین دانشگاه‌های ایران و جهان
          </h1>
          <p class="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
            علیرضا جان، این داشبورد تمامی دانشگاه‌های تراز اول، مقالات مرجع، آزمایشگاه‌های پیشرو، کنفرانس‌های رده A* و ابزارهای لازم را یکجا برایت گردآوری کرده است تا هیچ فرصتی از دست نرود.
          </p>

          <div class="pt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <button
              (click)="store.setActiveTab('tools')"
              class="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-md shadow-emerald-500/20"
            >
              <mat-icon class="text-sm">checklist</mat-icon>
              <span>چک‌لیست ۱۰ گام تا دکتری</span>
            </button>
            <button
              (click)="store.setActiveTab('universities')"
              class="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-all"
            >
              <mat-icon class="text-sm">account_balance</mat-icon>
              <span>بررسی دانشگاه‌های هدف</span>
            </button>
            <button
              (click)="store.setActiveTab('calendar')"
              class="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium transition-all"
            >
              <mat-icon class="text-sm">timer</mat-icon>
              <span>تقویم ددلاین‌ها</span>
            </button>
          </div>
        </div>

        <!-- Subtle geometric decoration -->
        <div class="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none"></div>
      </div>

      <!-- Roadmap Phases Progress Strip -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Phase 1 -->
        <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-slate-200">فاز ۱: ارشد و تسلط نظری</span>
            <span class="text-emerald-400 font-mono text-[11px]">تکمیل شده</span>
          </div>
          <p class="text-[11px] text-slate-400 leading-relaxed">
            معدل الف، تسلط بر PyTorch و ریاضیات هوش مصنوعی در دانشگاه آزاد دزفول.
          </p>
          <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div class="h-full bg-emerald-500 w-full"></div>
          </div>
        </div>

        <!-- Phase 2 -->
        <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-slate-200">فاز ۲: پژوهش و مقاله اول</span>
            <span class="text-amber-400 font-mono text-[11px]">در حال اجرا</span>
          </div>
          <p class="text-[11px] text-slate-400 leading-relaxed">
            نگارش پایان‌نامه، آزمایش‌های عمیق در Colab و استخراج مقاله بین‌المللی IEEE/Q1.
          </p>
          <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div class="h-full bg-amber-500 w-2/3"></div>
          </div>
        </div>

        <!-- Phase 3 -->
        <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-slate-200">فاز ۳: دکتری داخل و خارج</span>
            <span class="text-slate-400 font-mono text-[11px]">هدف نهایی</span>
          </div>
          <p class="text-[11px] text-slate-400 leading-relaxed">
            کنکور دکتری شریف/تهران و اپلای پوزیشن‌های فول‌فاند دانشگاه‌های جهان.
          </p>
          <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div class="h-full bg-slate-700 w-1/4"></div>
          </div>
        </div>
      </div>

      <!-- Quick Launchpad of Researcher Tools -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold text-slate-200 flex items-center gap-2">
            <mat-icon class="text-emerald-400 text-base">rocket_launch</mat-icon>
            <span>دسترسی مستقیم و فوری به سکوهای پژوهش</span>
          </h2>
          <span class="text-xs text-slate-400">کلیک برای باز شدن سریع در تب جدید</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <a
            href="https://scholar.google.com"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 transition-all text-xs text-slate-200 group"
          >
            <mat-icon class="text-blue-400 text-lg group-hover:scale-110 transition-transform">school</mat-icon>
            <span class="truncate">گوگل اسکالر</span>
          </a>
          <a
            href="https://arxiv.org/corr"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 transition-all text-xs text-slate-200 group"
          >
            <mat-icon class="text-rose-400 text-lg group-hover:scale-110 transition-transform">article</mat-icon>
            <span class="truncate">arXiv (cs.AI)</span>
          </a>
          <a
            href="https://www.overleaf.com"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 transition-all text-xs text-slate-200 group"
          >
            <mat-icon class="text-emerald-400 text-lg group-hover:scale-110 transition-transform">history_edu</mat-icon>
            <span class="truncate">Overleaf LaTeX</span>
          </a>
          <a
            href="https://paperswithcode.com"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 transition-all text-xs text-slate-200 group"
          >
            <mat-icon class="text-teal-400 text-lg group-hover:scale-110 transition-transform">code</mat-icon>
            <span class="truncate">PapersWithCode</span>
          </a>
          <a
            href="https://huggingface.co"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 transition-all text-xs text-slate-200 group"
          >
            <mat-icon class="text-amber-400 text-lg group-hover:scale-110 transition-transform">smart_toy</mat-icon>
            <span class="truncate">Hugging Face</span>
          </a>
          <a
            href="https://colab.research.google.com"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 transition-all text-xs text-slate-200 group"
          >
            <mat-icon class="text-yellow-400 text-lg group-hover:scale-110 transition-transform">data_object</mat-icon>
            <span class="truncate">Google Colab</span>
          </a>
        </div>
      </div>

      <!-- Main Two-Column Section: Priorities & Urgent Deadlines -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <!-- Column 1: Weekly Priorities (اولویت‌های این هفته) -->
        <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div class="flex items-center gap-2">
              <mat-icon class="text-emerald-400 text-lg">task_alt</mat-icon>
              <h2 class="text-sm font-bold text-slate-200">اولویت‌های این هفته</h2>
            </div>
            <div class="text-[11px] text-slate-400">
              <span class="text-emerald-400 font-mono tabular-nums font-semibold">{{ store.completedPrioritiesCount() }}</span>
              از
              <span class="font-mono tabular-nums">{{ store.priorities().length }}</span>
              انجام شد
            </div>
          </div>

          <!-- Add Priority Input -->
          <div class="flex gap-2">
            <input
              [formControl]="newPriorityControl"
              (keydown.enter)="onAddPriority()"
              type="text"
              aria-label="افزودن اولویت جدید برای این هفته"
              placeholder="افزودن تسک یا اولویت جدید برای این هفته..."
              class="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              (click)="onAddPriority()"
              class="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <mat-icon class="text-sm">add</mat-icon>
              <span>افزودن</span>
            </button>
          </div>

          <!-- Priorities List -->
          <div class="space-y-2 max-h-72 overflow-y-auto pr-1">
            @for (item of store.priorities(); track item.id) {
              <div
                class="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 transition-all hover:border-slate-700"
                [class.opacity-60]="item.completed"
              >
                <div class="flex items-start gap-2.5 min-w-0 flex-1">
                  <button
                    (click)="store.togglePriority(item.id)"
                    class="mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0"
                    [class.bg-emerald-500]="item.completed"
                    [class.border-emerald-500]="item.completed"
                    [class.border-slate-600]="!item.completed"
                  >
                    @if (item.completed) {
                      <mat-icon class="text-slate-950 text-xs font-black">check</mat-icon>
                    }
                  </button>
                  <div class="min-w-0">
                    <div
                      class="text-xs text-slate-200 leading-relaxed"
                      [class.line-through]="item.completed"
                      [class.text-slate-500]="item.completed"
                    >
                      {{ item.text }}
                    </div>
                    @if (item.deadline) {
                      <div class="text-[10px] text-amber-400 mt-0.5">
                        مهلت: {{ item.deadline }}
                      </div>
                    }
                  </div>
                </div>

                <button
                  (click)="store.removePriority(item.id)"
                  class="text-slate-600 hover:text-rose-400 p-1 transition-colors"
                  title="حذف"
                >
                  <mat-icon class="text-xs">delete</mat-icon>
                </button>
              </div>
            }
          </div>
        </div>

        <!-- Column 2: Urgent Reminders & Deadlines (یادآوری‌های مهم) -->
        <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div class="flex items-center gap-2">
              <mat-icon class="text-amber-400 text-lg">notification_important</mat-icon>
              <h2 class="text-sm font-bold text-slate-200">یادآوری‌های مهم و ددلاین‌ها</h2>
            </div>
            <button
              (click)="store.setActiveTab('calendar')"
              class="text-xs text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>مشاهده تقویم</span>
              <mat-icon class="text-xs">arrow_back</mat-icon>
            </button>
          </div>

          <div class="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            @for (ev of store.events().slice(0, 5); track ev.id) {
              <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5 text-right">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-slate-200">
                    {{ ev.title }}
                  </span>
                  @if (ev.category === 'exam') {
                    <span class="text-[10px] text-rose-400 font-medium">آزمون سراسری</span>
                  } @else if (ev.category === 'phd_apply') {
                    <span class="text-[10px] text-emerald-400 font-medium">پذیرش دکتری</span>
                  } @else {
                    <span class="text-[10px] text-teal-400 font-medium">کنفرانس</span>
                  }
                </div>

                <div class="flex items-center gap-2 text-[11px] text-slate-400">
                  <span class="font-mono tabular-nums">{{ ev.jalaliDate || ev.date }}</span>
                  @if (ev.details) {
                    <span>·</span>
                    <span class="truncate">{{ ev.details }}</span>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Strategy Guide for Alireza: Acceptance in Top PhD Programs -->
      <div class="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/20 space-y-3">
        <div class="flex items-center gap-2 text-emerald-400">
          <mat-icon class="text-base">lightbulb</mat-icon>
          <h2 class="text-xs sm:text-sm font-bold text-slate-100">
            راهنمای استراتژیک علیرضا: ۴ اهرم طلایی برای قبولی در دکتری شریف، تهران یا خارج
          </h2>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">
          به عنوان دانشجوی ارشد دانشگاه آزاد اسلامی واحد دزفول، برای قبولی در مصاحبه دکتری دانشگاه‌های دولتی سطح اول (شریف، تهران، امیرکبیر) یا پذیرش با فاند کامل از دانشگاه‌های تراز اول دنیا (MIT, Stanford, Toronto)، این ۴ اهرم تمام معادلات را به نفع شما تغییر می‌دهد:
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
          <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div class="font-bold text-emerald-400 flex items-center gap-1">
              <span>۱. مقاله Q1 یا کنفرانس معتبر بین‌المللی</span>
            </div>
            <p class="text-[11px] text-slate-400 leading-relaxed">
              داشتن حداقل یک مقاله در ژورنال‌های معتبر IEEE یا کنفرانس‌های شاخص (حتی کنفرانس‌های ایرانی نمایه IEEE)، امتیاز پژوهشی مصاحبه را به حداکثر (۴۰ امتیاز کامل) می‌رساند و نام دانشگاه مبدا را کاملاً بی‌اثر می‌کند.
            </p>
          </div>

          <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div class="font-bold text-emerald-400 flex items-center gap-1">
              <span>۲. گیت‌هاب قوی و کدهای تمیز PyTorch</span>
            </div>
            <p class="text-[11px] text-slate-400 leading-relaxed">
              اساتید امروز به کدهای زنده و بازپیاده‌سازی‌شده نگاه می‌کنند. اگر پایان‌نامه شما یک ریپازیتوری مرتب با README انگلیسی و نوت‌بوک اجرای یک‌کلیکه در کولب داشته باشد، اعتماد استاد را جلب خواهد کرد.
            </p>
          </div>

          <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div class="font-bold text-emerald-400 flex items-center gap-1">
              <span>۳. نمره زبان رسمی بالا (IELTS 7.5+ / TOEFL 100+)</span>
            </div>
            <p class="text-[11px] text-slate-400 leading-relaxed">
              مدرک زبان شرط لازم مصاحبه دکتری است و در صورت تصمیم برای اپلای، بدون نیاز به اتلاف وقت در پروسه پذیرش، فوراً پرونده شما را در اولویت فاند دانشگاه‌های اروپا و کانادا قرار می‌دهد.
            </p>
          </div>

          <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div class="font-bold text-emerald-400 flex items-center gap-1">
              <span>۴. پروپوزال متناسب با گرنت‌های فعال استاد</span>
            </div>
            <p class="text-[11px] text-slate-400 leading-relaxed">
              پیش از مصاحبه دکتری یا مکاتبه با اساتید بین‌المللی، مقالات ۲ سال اخیر استاد را بخوانید و پیش‌پروپوزال دکتری خود را به عنوان ادامه کار تحقیقاتی همان آزمایشگاه تنظیم کنید.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AppDashboardView {
  readonly store = inject(AcademicStore);
  readonly newPriorityControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  onAddPriority(): void {
    if (this.newPriorityControl.invalid) return;
    this.store.addPriority(this.newPriorityControl.value, 'medium');
    this.newPriorityControl.reset();
  }
}
