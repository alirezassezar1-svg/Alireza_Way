import {
  ChangeDetectionStrategy,
  Component,
  inject,
  HostListener,
} from '@angular/core';
import { AcademicStore } from './services/academic-store';
import { AppHeader } from './components/header';
import { AppSidebar } from './components/sidebar';
import { AppBottomNav } from './components/bottom-nav';
import { AppDashboardView } from './components/dashboard-view';
import { AppUniversitiesView } from './components/universities-view';
import { AppLibrariesView } from './components/libraries-view';
import { AppLabsView } from './components/labs-view';
import { AppConferencesView } from './components/conferences-view';
import { AppToolsView } from './components/tools-view';
import { AppCalendarView } from './components/calendar-view';
import { AppBookmarksView } from './components/bookmarks-view';
import { AppSearchModal } from './components/search-modal';
import { AppNoteModal } from './components/note-modal';
import { AppAddItemModal } from './components/add-item-modal';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppHeader,
    AppSidebar,
    AppBottomNav,
    AppDashboardView,
    AppUniversitiesView,
    AppLibrariesView,
    AppLabsView,
    AppConferencesView,
    AppToolsView,
    AppCalendarView,
    AppBookmarksView,
    AppSearchModal,
    AppNoteModal,
    AppAddItemModal,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly store = inject(AcademicStore);

  @HostListener('window:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (this.store.isSearchModalOpen()) {
        this.store.closeSearchModal();
      } else {
        this.store.openSearchModal();
      }
    } else if (event.key === 'Escape') {
      if (this.store.isSearchModalOpen()) {
        this.store.closeSearchModal();
      }
      if (this.store.isNoteModalOpen()) {
        this.store.closeNoteModal();
      }
      if (this.store.isAddItemModalOpen()) {
        this.store.closeAddItemModal();
      }
    }
  }
}
