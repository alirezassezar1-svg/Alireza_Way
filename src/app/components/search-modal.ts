import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ElementRef,
  viewChild,
  effect,
} from '@angular/core';
import { AcademicStore } from '../services/academic-store';
import { TabType } from '../models/academic.models';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-search-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, ReactiveFormsModule],
  template: `
    @if (store.isSearchModalOpen()) {
      <div class="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
        <!-- Backdrop Button -->
        <button
          type="button"
          class="fixed inset-0 w-full h-full bg-black/75 backdrop-blur-sm transition-opacity"
          (click)="onBackdropClick()"
          aria-label="بستن جستجو"
        ></button>

        <div
          class="relative z-10 w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] text-right"
          role="dialog"
          aria-modal="true"
        >
          <!-- Search Input Header -->
          <div class="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950/60">
            <mat-icon class="text-emerald-400">search</mat-icon>
            <input
              #searchInput
              [formControl]="queryControl"
              type="text"
              aria-label="جستجوی سریع دانشگاه، مقاله، کتاب و کنفرانس"
              placeholder="جستجوی سریع دانشگاه، استاد، مقاله، کتاب، کنفرانس، ابزار پژوهش..."
              class="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            @if (queryControl.value) {
              <button
                (click)="queryControl.setValue('')"
                class="text-slate-400 hover:text-slate-200 p-1"
                aria-label="پاک کردن"
              >
                <mat-icon class="text-sm">clear</mat-icon>
              </button>
            }
            <kbd class="hidden sm:inline-block px-2 py-0.5 text-[10px] bg-slate-800 text-slate-400 rounded border border-slate-700 font-mono">
              ESC
            </kbd>
          </div>

          <!-- Quick Filters Bar -->
          <div class="flex items-center gap-1.5 px-4 py-2 bg-slate-950/30 border-b border-slate-800/60 overflow-x-auto text-[11px] text-slate-400">
            <span class="whitespace-nowrap">پیشنهادهای جستجو:</span>
            <button
              (click)="queryControl.setValue('شریف')"
              class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors whitespace-nowrap"
            >
              شریف
            </button>
            <button
              (click)="queryControl.setValue('MIT')"
              class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors whitespace-nowrap"
            >
              MIT
            </button>
            <button
              (click)="queryControl.setValue('NeurIPS')"
              class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors whitespace-nowrap"
            >
              NeurIPS
            </button>
            <button
              (click)="queryControl.setValue('یادگیری عمیق')"
              class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors whitespace-nowrap"
            >
              یادگیری عمیق
            </button>
            <button
              (click)="queryControl.setValue('Overleaf')"
              class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors whitespace-nowrap"
            >
              Overleaf
            </button>
            <button
              (click)="queryControl.setValue('OpenAI')"
              class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors whitespace-nowrap"
            >
              OpenAI
            </button>
          </div>

          <!-- Results List -->
          <div class="overflow-y-auto p-3 space-y-1.5 flex-1">
            @if (store.globalSearchQuery().trim() === '') {
              <div class="py-12 text-center text-slate-500 text-xs">
                کلمه‌ای را برای جستجو در کل پایگاه داده وارد نمایید
              </div>
            } @else if (store.searchResults().length === 0) {
              <div class="py-12 text-center text-slate-500 text-xs">
                موردی مطابق با «{{ store.globalSearchQuery() }}» یافت نشد.
              </div>
            } @else {
              @for (item of store.searchResults(); track item.id) {
                <div
                  class="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 transition-all text-right group"
                >
                  <button
                    type="button"
                    (click)="navigateAndClose(item.tab)"
                    class="flex-1 text-right min-w-0 pr-1 focus:outline-none"
                  >
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                        {{ item.title }}
                      </span>
                      <span class="text-[10px] text-slate-400">·</span>
                      <span class="text-[10px] text-slate-400">
                        {{ item.category }}
                      </span>
                    </div>
                    <div class="text-[11px] text-slate-400 truncate">
                      {{ item.subtitle }}
                    </div>
                  </button>

                  <div class="flex items-center gap-1.5 shrink-0 pl-1">
                    <button
                      (click)="store.openNoteModal(item.id, item.title)"
                      class="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                      title="یادداشت"
                    >
                      <mat-icon class="text-sm">edit_note</mat-icon>
                    </button>
                    <a
                      [href]="item.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white text-[11px] font-medium transition-all"
                    >
                      <span>باز کردن لینک</span>
                      <mat-icon class="text-xs">open_in_new</mat-icon>
                    </a>
                  </div>
                </div>
              }
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class AppSearchModal {
  readonly store = inject(AcademicStore);
  readonly queryControl = new FormControl('');
  readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  constructor() {
    this.queryControl.valueChanges.subscribe((val) => {
      this.store.setSearchQuery(val || '');
    });

    effect(() => {
      if (this.store.isSearchModalOpen()) {
        setTimeout(() => {
          this.inputEl()?.nativeElement.focus();
        }, 50);
      }
    });
  }

  onBackdropClick(): void {
    this.store.closeSearchModal();
  }

  navigateAndClose(tab: TabType): void {
    this.store.setActiveTab(tab);
    this.store.closeSearchModal();
  }
}
