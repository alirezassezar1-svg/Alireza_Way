export type TabType =
  | 'dashboard'
  | 'universities'
  | 'libraries'
  | 'labs'
  | 'conferences'
  | 'tools'
  | 'calendar'
  | 'bookmarks';

export interface UniversityItem {
  id: string;
  nameFa: string;
  nameEn: string;
  type: 'iran' | 'world';
  rank: string;
  city: string;
  country: string;
  admissionUrl: string;
  websiteUrl: string;
  fields: string[];
  capacityOrFund: string;
  admissionRequirements: string[];
  facultyOrLabs: string[];
  acceptanceTipsFa?: string;
  isBookmarked?: boolean;
  userNote?: string;
  isCustom?: boolean;
}

export interface LibraryResourceItem {
  id: string;
  titleFa: string;
  titleEn: string;
  category: 'repo' | 'book' | 'course' | 'iranian';
  subject: string;
  url: string;
  descriptionFa: string;
  authorOrProvider: string;
  accessType: 'free' | 'open_access' | 'institutional';
  isBookmarked?: boolean;
  userNote?: string;
  isCustom?: boolean;
}

export interface ResearchLabItem {
  id: string;
  nameFa: string;
  nameEn: string;
  type: 'iran' | 'world';
  organization: string;
  location: string;
  websiteUrl: string;
  opportunitiesUrl: string;
  focusAreas: string[];
  descriptionFa: string;
  isBookmarked?: boolean;
  userNote?: string;
  isCustom?: boolean;
}

export interface ConferenceItem {
  id: string;
  name: string;
  fullTitle: string;
  type: 'international' | 'iranian';
  rank: 'A*' | 'A' | 'B' | 'National';
  deadlineDate: string;
  eventDate: string;
  location: string;
  websiteUrl: string;
  tracks: string[];
  descriptionFa: string;
  isBookmarked?: boolean;
  userNote?: string;
  isCustom?: boolean;
}

export interface WorkshopItem {
  id: string;
  titleFa: string;
  titleEn: string;
  organizer: string;
  url: string;
  timing: string;
  format: 'online' | 'in_person' | 'hybrid';
  descriptionFa: string;
  isBookmarked?: boolean;
  userNote?: string;
}

export interface ToolItem {
  id: string;
  name: string;
  category: 'code' | 'writing' | 'data' | 'tracking' | 'citation';
  url: string;
  descriptionFa: string;
  features: string[];
  isBookmarked?: boolean;
  userNote?: string;
  isCustom?: boolean;
}

export interface SkillMilestone {
  id: string;
  phaseId: number;
  phaseName: string;
  phaseTimeframe: string;
  title: string;
  description: string;
  keyActions: string[];
  completed: boolean;
}

export interface AcademicEventItem {
  id: string;
  title: string;
  date: string;
  jalaliDate?: string;
  category: 'phd_apply' | 'conference' | 'exam' | 'term' | 'personal';
  link?: string;
  details?: string;
  completed?: boolean;
  isCustom?: boolean;
}

export interface WeeklyPriorityItem {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  deadline?: string;
}

export interface GlobalSearchResult {
  id: string;
  title: string;
  subtitle: string;
  tab: TabType;
  category: string;
  url: string;
}

export interface BookmarkedItemView {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  url: string;
  tab: TabType;
  userNote?: string;
}

export interface CustomItemPayload {
  titleFa: string;
  titleEn?: string;
  url: string;
  city?: string;
  country?: string;
  subType?: string;
  rank?: string;
  fields?: string;
  capacityOrFund?: string;
  requirements?: string;
  faculty?: string;
  tips?: string;
  subject?: string;
  descriptionFa?: string;
  provider?: string;
  accessType?: 'free' | 'open_access' | 'institutional';
  deadline?: string;
  eventDate?: string;
}
