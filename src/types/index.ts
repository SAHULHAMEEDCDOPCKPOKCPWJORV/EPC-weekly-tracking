export type ActivityStatus = 'Completed' | 'In Progress' | 'Delayed' | 'Not Started' | 'At Risk';

export type DependencyType = 'FS' | 'SS' | 'FF' | 'SF';

export interface Activity {
  id: string;
  projectId: string;
  wbsCode: string;
  activityId: string;
  name: string;
  workstream: string;
  description: string;
  responsiblePerson: string;
  plannedStartDate: string;
  plannedFinishDate: string;
  actualStartDate: string;
  actualFinishDate: string;
  weightage: number; // Percentage contribution (e.g., 5.0)
  prevWeekProgress: number; // %
  currentWeekProgress: number; // %
  weeklyAchieved: number; // calculated currentWeek - prevWeek
  plannedProgress: number; // expected % at current date
  actualProgress: number; // %
  status: ActivityStatus;
  delayDays: number;
  isCriticalPath: boolean;
  dependencies: string[]; // Activity IDs
  dependencyType?: DependencyType;
  lagDays?: number;
  isMilestone: boolean;
  milestoneNumber?: number;
  remarks: string;
  order: number;
}

export interface SitePhoto {
  id: string;
  reportId: string;
  projectId: string;
  url: string;
  caption: string;
  location: string;
  date: string;
  displayOrder: number;
  workstream?: string;
  isCover?: boolean;
}

export interface NextTwoWeeksItem {
  id: string;
  reportId: string;
  activityName: string;
  dueDate: string;
  isCriticalPath: boolean;
  responsiblePerson: string;
  expectedProgress: number;
  status: string;
  remarks: string;
}

export interface ProjectRisk {
  id: string;
  reportId: string;
  projectId: string;
  title: string;
  description: string;
  category: 'Approvals & Permits' | 'Procurement' | 'Land & Civil' | 'Transmission & Bay' | 'Commercial & Billing' | 'Quality & Safety';
  identifiedDate: string;
  probability: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High' | 'Critical';
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  responsiblePerson: string;
  mitigationPlan: string;
  currentStatus: 'Open' | 'Under Review' | 'In Progress' | 'Mitigated' | 'Closed';
  clientActionRequired: string;
  targetResolutionDate: string;
}

export interface WeeklyAchievementsSummary {
  completedThisWeek: string[];
  ongoingActivities: string[];
  delayedActivities: string[];
  majorAchievements: string[];
  issuesEncountered: string[];
  correctiveActions: string[];
  nextWeekTargets: string[];
  managementComments: string;
}

export interface WeeklyReport {
  id: string;
  projectId: string;
  weekNumber: number;
  reportingStartDate: string;
  reportingEndDate: string;
  reportingDate: string;
  preparedBy: string;
  overallPlannedProgress: number;
  overallActualProgress: number;
  weeklyPlannedProgress: number;
  weeklyActualProgress: number;
  daysToCod: number;
  forecastCod: string;
  forecastDaysToCod: number;
  statusNotes: string;
  version: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  // Specific snapshot data for this week
  activities: Activity[];
  sitePhotos: SitePhoto[];
  nextTwoWeeks: NextTwoWeeksItem[];
  risks: ProjectRisk[];
  summary: WeeklyAchievementsSummary;
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  contractorName: string;
  location: string;
  capacity: string;
  type: string;
  projectManager: string;
  startDate: string;
  baselineCod: string;
  contractualCod: string;
  forecastCod: string;
  reportingFrequency: 'Weekly' | 'Bi-Weekly' | 'Monthly';
  description: string;
  logoUrl?: string;
  clientLogoUrl?: string;
  coverPhotoUrl?: string;
  createdAt: string;
  updatedAt: string;
  status: 'Active' | 'Delayed' | 'Completed' | 'On Hold';
}

export type UserRole = 'Admin' | 'Project Manager' | 'Team Member' | 'Viewer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  organization: string;
}

export type ViewMode = 
  | 'dashboard'
  | 'projects'
  | 'weekly-input'
  | 'activities'
  | 'gantt'
  | 'timeline'
  | 'site-progress'
  | 'risks'
  | 'comparison'
  | 'report-builder'
  | 'ppt-export'
  | 'report-history'
  | 'settings';
