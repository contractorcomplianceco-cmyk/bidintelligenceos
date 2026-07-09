import { VerticalId } from "./verticals";

/* ------------------------------------------------------------------ */
/*  Bid lifecycle                                                      */
/* ------------------------------------------------------------------ */

export const BID_LIFECYCLE = [
  "Bid Created",
  "Bid Analyzed",
  "Package Built",
  "Bid Submitted",
  "Follow-Up Active",
  "Bid Won",
  "Job Deployment Created",
  "Schedule Built",
  "Labor/Subs Assigned",
  "Permits Attached",
  "Weather Watch Active",
  "Work In Progress",
  "Cost/ROI Tracking",
  "Completion Review",
  "Learning Loop",
] as const;

export type LifecycleStage = (typeof BID_LIFECYCLE)[number];

/* ------------------------------------------------------------------ */
/*  Job Deployment                                                     */
/* ------------------------------------------------------------------ */

export type JobStatus =
  | "Mobilizing"
  | "In Progress"
  | "On Hold"
  | "Delayed"
  | "Completed";

export type RiskLevel = "Low" | "Medium" | "High";

export interface JobDeployment {
  id: string;
  bidId?: string;
  name: string;
  client: string;
  location: string;
  vertical: VerticalId;
  contractValue: number;
  startDate: string;
  targetCompletion: string;
  projectManager: string;
  crewLead: string;
  currentPhase: string;
  phaseIndex: number;
  totalPhases: number;
  status: JobStatus;
  stage: LifecycleStage;
  completion: number;
  budget: number;
  costToDate: number;
  projectedRoi: number;
  weatherSensitive: boolean;
  crew: string[];
  subs: string[];
  riskLevel: RiskLevel;
  nextMilestone: string;
  nextMilestoneDate: string;
}

export const jobDeployments: JobDeployment[] = [
  {
    id: "job-northline",
    bidId: "bid-1",
    name: "Northline HVAC Retrofit",
    client: "Northline Medical Center",
    location: "Northline, TX",
    vertical: "hvac",
    contractValue: 842000,
    startDate: "May 5, 2025",
    targetCompletion: "Aug 22, 2025",
    projectManager: "Dana Whitfield",
    crewLead: "Marcus Ruiz",
    currentPhase: "Install",
    phaseIndex: 2,
    totalPhases: 6,
    status: "In Progress",
    stage: "Work In Progress",
    completion: 46,
    budget: 611000,
    costToDate: 289400,
    projectedRoi: 21.4,
    weatherSensitive: true,
    crew: ["Marcus Ruiz", "Ana Delgado", "Tyler Boone"],
    subs: ["Apex Electrical", "Summit Rigging"],
    riskLevel: "Medium",
    nextMilestone: "Rooftop unit set",
    nextMilestoneDate: "Jul 3, 2025",
  },
  {
    id: "job-cedar",
    bidId: "bid-2",
    name: "Cedar Ridge Roof Replacement",
    client: "Cedar Ridge Apartments",
    location: "Cedar Park, TX",
    vertical: "roofing",
    contractValue: 496000,
    startDate: "Jun 2, 2025",
    targetCompletion: "Jul 18, 2025",
    projectManager: "Priya Nair",
    crewLead: "Sam Okafor",
    currentPhase: "Tear-Off",
    phaseIndex: 0,
    totalPhases: 6,
    status: "Delayed",
    stage: "Weather Watch Active",
    completion: 18,
    budget: 372000,
    costToDate: 71200,
    projectedRoi: 18.9,
    weatherSensitive: true,
    crew: ["Sam Okafor", "Luis Marin"],
    subs: ["Titan Sheet Metal", "ClearHaul Disposal"],
    riskLevel: "High",
    nextMilestone: "Dry-in south building",
    nextMilestoneDate: "Jul 2, 2025",
  },
  {
    id: "job-harbor",
    bidId: "bid-3",
    name: "Harbor Point TI Electrical",
    client: "Harbor Point Developers",
    location: "Galveston, TX",
    vertical: "electrical",
    contractValue: 318000,
    startDate: "Apr 14, 2025",
    targetCompletion: "Jul 30, 2025",
    projectManager: "Dana Whitfield",
    crewLead: "Grace Lin",
    currentPhase: "Trim-Out",
    phaseIndex: 3,
    totalPhases: 6,
    status: "In Progress",
    stage: "Cost/ROI Tracking",
    completion: 68,
    budget: 233000,
    costToDate: 178900,
    projectedRoi: 14.2,
    weatherSensitive: false,
    crew: ["Grace Lin", "Omar Haddad", "Nina Petrov"],
    subs: ["Beacon Fire & Alarm"],
    riskLevel: "Medium",
    nextMilestone: "Final inspection",
    nextMilestoneDate: "Jul 9, 2025",
  },
  {
    id: "job-summit",
    bidId: "bid-4",
    name: "Summit Plaza Restoration",
    client: "Meridian Insurance (Claim #RS-40912)",
    location: "Austin, TX",
    vertical: "restoration",
    contractValue: 265000,
    startDate: "Jun 18, 2025",
    targetCompletion: "Sep 5, 2025",
    projectManager: "Priya Nair",
    crewLead: "Devon Clarke",
    currentPhase: "Mitigation",
    phaseIndex: 2,
    totalPhases: 6,
    status: "In Progress",
    stage: "Work In Progress",
    completion: 34,
    budget: 198000,
    costToDate: 88600,
    projectedRoi: 23.7,
    weatherSensitive: false,
    crew: ["Devon Clarke", "Rosa Iglesias"],
    subs: ["PureAir Abatement", "Apex Electrical"],
    riskLevel: "Medium",
    nextMilestone: "Supplement approval",
    nextMilestoneDate: "Jul 7, 2025",
  },
  {
    id: "job-metro",
    name: "Metro Retail Facilities Contract",
    client: "Metro Retail Group",
    location: "Multi-site (14 stores)",
    vertical: "facility",
    contractValue: 540000,
    startDate: "Jan 6, 2025",
    targetCompletion: "Dec 31, 2025",
    projectManager: "Dana Whitfield",
    crewLead: "Route Team A",
    currentPhase: "Service",
    phaseIndex: 2,
    totalPhases: 6,
    status: "In Progress",
    stage: "Cost/ROI Tracking",
    completion: 52,
    budget: 405000,
    costToDate: 214300,
    projectedRoi: 27.1,
    weatherSensitive: false,
    crew: ["Route Team A", "Route Team B"],
    subs: ["Bright Janitorial", "GreenScape Grounds"],
    riskLevel: "Low",
    nextMilestone: "Q3 SLA review",
    nextMilestoneDate: "Jul 15, 2025",
  },
  {
    id: "job-gateway",
    name: "Gateway Ventures Buildout",
    client: "Gateway Ventures",
    location: "Round Rock, TX",
    vertical: "gc",
    contractValue: 1240000,
    startDate: "Mar 3, 2025",
    targetCompletion: "Oct 10, 2025",
    projectManager: "Marcus Ruiz",
    crewLead: "Hal Jennings",
    currentPhase: "MEP Rough-In",
    phaseIndex: 3,
    totalPhases: 8,
    status: "In Progress",
    stage: "Work In Progress",
    completion: 41,
    budget: 968000,
    costToDate: 402700,
    projectedRoi: 16.8,
    weatherSensitive: true,
    crew: ["Hal Jennings", "Carla Mendez", "Pete Nowak"],
    subs: ["Apex Electrical", "TrueLine Plumbing", "Titan Sheet Metal"],
    riskLevel: "Medium",
    nextMilestone: "Rough-in inspection",
    nextMilestoneDate: "Jul 8, 2025",
  },
];

/* ------------------------------------------------------------------ */
/*  Labor & Subcontractors                                            */
/* ------------------------------------------------------------------ */

export type CrewStatus = "Available" | "Assigned" | "Overallocated" | "PTO";

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  assignedJob: string | null;
  utilization: number;
  status: CrewStatus;
  certifications: string[];
}

export const crewMembers: CrewMember[] = [
  { id: "c1", name: "Marcus Ruiz", role: "Lead Installer", assignedJob: "Northline HVAC Retrofit", utilization: 92, status: "Assigned", certifications: ["EPA 608", "OSHA 30"] },
  { id: "c2", name: "Ana Delgado", role: "Sheet Metal", assignedJob: "Northline HVAC Retrofit", utilization: 88, status: "Assigned", certifications: ["OSHA 10"] },
  { id: "c3", name: "Tyler Boone", role: "Helper", assignedJob: "Northline HVAC Retrofit", utilization: 74, status: "Assigned", certifications: ["OSHA 10"] },
  { id: "c4", name: "Sam Okafor", role: "Roofing Foreman", assignedJob: "Cedar Ridge Roof Replacement", utilization: 61, status: "Assigned", certifications: ["OSHA 30", "Fall Protection"] },
  { id: "c5", name: "Luis Marin", role: "Roofing Mechanic", assignedJob: "Cedar Ridge Roof Replacement", utilization: 58, status: "Assigned", certifications: ["OSHA 10"] },
  { id: "c6", name: "Grace Lin", role: "Journeyman Electrician", assignedJob: "Harbor Point TI Electrical", utilization: 104, status: "Overallocated", certifications: ["Journeyman License", "OSHA 30"] },
  { id: "c7", name: "Omar Haddad", role: "Apprentice", assignedJob: "Harbor Point TI Electrical", utilization: 96, status: "Assigned", certifications: ["OSHA 10"] },
  { id: "c8", name: "Nina Petrov", role: "Low-Voltage Tech", assignedJob: "Harbor Point TI Electrical", utilization: 82, status: "Assigned", certifications: ["BICSI", "OSHA 10"] },
  { id: "c9", name: "Devon Clarke", role: "Project Manager", assignedJob: "Summit Plaza Restoration", utilization: 79, status: "Assigned", certifications: ["IICRC", "OSHA 30"] },
  { id: "c10", name: "Hal Jennings", role: "Superintendent", assignedJob: "Gateway Ventures Buildout", utilization: 90, status: "Assigned", certifications: ["OSHA 30", "First Aid"] },
  { id: "c11", name: "Carla Mendez", role: "Carpenter", assignedJob: "Gateway Ventures Buildout", utilization: 85, status: "Assigned", certifications: ["OSHA 10"] },
  { id: "c12", name: "Jesse Park", role: "Service Tech", assignedJob: null, utilization: 0, status: "Available", certifications: ["EPA 608", "OSHA 10"] },
];

export type SubStatus = "On Track" | "Delayed" | "At Risk" | "Not Started" | "Complete";

export interface Subcontractor {
  id: string;
  name: string;
  trade: string;
  assignedJob: string;
  status: SubStatus;
  coiExpires: string;
  contact: string;
  quoteAmount: number;
}

export const subcontractors: Subcontractor[] = [
  { id: "s1", name: "Apex Electrical", trade: "Electrical", assignedJob: "Northline HVAC Retrofit", status: "On Track", coiExpires: "Nov 2025", contact: "(512) 555-0142", quoteAmount: 84500 },
  { id: "s2", name: "Summit Rigging", trade: "Crane / Rigging", assignedJob: "Northline HVAC Retrofit", status: "At Risk", coiExpires: "Jul 2025", contact: "(512) 555-0187", quoteAmount: 39000 },
  { id: "s3", name: "Titan Sheet Metal", trade: "Sheet Metal", assignedJob: "Cedar Ridge Roof Replacement", status: "Delayed", coiExpires: "Sep 2025", contact: "(512) 555-0211", quoteAmount: 52200 },
  { id: "s4", name: "ClearHaul Disposal", trade: "Disposal", assignedJob: "Cedar Ridge Roof Replacement", status: "On Track", coiExpires: "Dec 2025", contact: "(512) 555-0233", quoteAmount: 14800 },
  { id: "s5", name: "Beacon Fire & Alarm", trade: "Fire Alarm", assignedJob: "Harbor Point TI Electrical", status: "On Track", coiExpires: "Oct 2025", contact: "(409) 555-0155", quoteAmount: 27600 },
  { id: "s6", name: "PureAir Abatement", trade: "Abatement", assignedJob: "Summit Plaza Restoration", status: "Not Started", coiExpires: "Aug 2025", contact: "(512) 555-0299", quoteAmount: 31500 },
  { id: "s7", name: "TrueLine Plumbing", trade: "Plumbing", assignedJob: "Gateway Ventures Buildout", status: "On Track", coiExpires: "Jan 2026", contact: "(512) 555-0311", quoteAmount: 96400 },
  { id: "s8", name: "Bright Janitorial", trade: "Janitorial", assignedJob: "Metro Retail Facilities Contract", status: "On Track", coiExpires: "Mar 2026", contact: "(512) 555-0344", quoteAmount: 42000 },
];

/* ------------------------------------------------------------------ */
/*  Scheduling                                                         */
/* ------------------------------------------------------------------ */

export type ScheduleType =
  | "Crew"
  | "Sub"
  | "Inspection"
  | "Permit"
  | "Delivery"
  | "Weather-Sensitive";

export type ScheduleStatus = "Scheduled" | "At Risk" | "Rescheduled" | "Complete";

export interface ScheduleEvent {
  id: string;
  jobId: string;
  jobName: string;
  title: string;
  type: ScheduleType;
  dayIndex: number; // 0 = Mon ... 6 = Sun
  startTime: string;
  endTime: string;
  assignee: string;
  status: ScheduleStatus;
  weatherSensitive: boolean;
  permitDependent: boolean;
  inspectionDependent: boolean;
  critical: boolean;
}

export const scheduleDays = ["Mon Jun 30", "Tue Jul 1", "Wed Jul 2", "Thu Jul 3", "Fri Jul 4", "Sat Jul 5", "Sun Jul 6"];

export const scheduleEvents: ScheduleEvent[] = [
  { id: "e1", jobId: "job-harbor", jobName: "Harbor Point TI", title: "Trim-out crew", type: "Crew", dayIndex: 0, startTime: "07:00", endTime: "15:30", assignee: "Grace Lin", status: "Scheduled", weatherSensitive: false, permitDependent: false, inspectionDependent: false, critical: false },
  { id: "e2", jobId: "job-cedar", jobName: "Cedar Ridge Roof", title: "Tear-off south building", type: "Weather-Sensitive", dayIndex: 1, startTime: "06:30", endTime: "16:00", assignee: "Sam Okafor", status: "At Risk", weatherSensitive: true, permitDependent: false, inspectionDependent: false, critical: true },
  { id: "e3", jobId: "job-cedar", jobName: "Cedar Ridge Roof", title: "Dry-in south building", type: "Weather-Sensitive", dayIndex: 2, startTime: "06:30", endTime: "16:00", assignee: "Sam Okafor", status: "At Risk", weatherSensitive: true, permitDependent: false, inspectionDependent: false, critical: true },
  { id: "e4", jobId: "job-northline", jobName: "Northline HVAC", title: "Rooftop unit set (crane)", type: "Weather-Sensitive", dayIndex: 3, startTime: "05:30", endTime: "12:00", assignee: "Summit Rigging", status: "At Risk", weatherSensitive: true, permitDependent: false, inspectionDependent: false, critical: true },
  { id: "e5", jobId: "job-gateway", jobName: "Gateway Buildout", title: "MEP rough-in inspection", type: "Inspection", dayIndex: 1, startTime: "09:00", endTime: "11:00", assignee: "City Inspector", status: "Scheduled", weatherSensitive: false, permitDependent: true, inspectionDependent: true, critical: true },
  { id: "e6", jobId: "job-northline", jobName: "Northline HVAC", title: "Ductwork crew", type: "Crew", dayIndex: 0, startTime: "07:00", endTime: "15:30", assignee: "Ana Delgado", status: "Scheduled", weatherSensitive: false, permitDependent: false, inspectionDependent: false, critical: false },
  { id: "e7", jobId: "job-gateway", jobName: "Gateway Buildout", title: "Plumbing top-out (TrueLine)", type: "Sub", dayIndex: 2, startTime: "07:00", endTime: "16:00", assignee: "TrueLine Plumbing", status: "Scheduled", weatherSensitive: false, permitDependent: false, inspectionDependent: false, critical: false },
  { id: "e8", jobId: "job-summit", jobName: "Summit Restoration", title: "Abatement mobilization", type: "Sub", dayIndex: 4, startTime: "08:00", endTime: "14:00", assignee: "PureAir Abatement", status: "Scheduled", weatherSensitive: false, permitDependent: true, inspectionDependent: false, critical: false },
  { id: "e9", jobId: "job-harbor", jobName: "Harbor Point TI", title: "Final electrical inspection", type: "Inspection", dayIndex: 3, startTime: "13:00", endTime: "15:00", assignee: "City Inspector", status: "Scheduled", weatherSensitive: false, permitDependent: true, inspectionDependent: true, critical: true },
  { id: "e10", jobId: "job-metro", jobName: "Metro Facilities", title: "Rooftop HVAC service ticket", type: "Weather-Sensitive", dayIndex: 2, startTime: "10:00", endTime: "13:00", assignee: "Route Team A", status: "Scheduled", weatherSensitive: true, permitDependent: false, inspectionDependent: false, critical: false },
  { id: "e11", jobId: "job-gateway", jobName: "Gateway Buildout", title: "Material delivery — drywall", type: "Delivery", dayIndex: 4, startTime: "07:30", endTime: "09:00", assignee: "Logistics", status: "Scheduled", weatherSensitive: false, permitDependent: false, inspectionDependent: false, critical: false },
  { id: "e12", jobId: "job-northline", jobName: "Northline HVAC", title: "Startup & commissioning prep", type: "Crew", dayIndex: 4, startTime: "07:00", endTime: "15:30", assignee: "Marcus Ruiz", status: "Scheduled", weatherSensitive: false, permitDependent: false, inspectionDependent: false, critical: false },
];

/* ------------------------------------------------------------------ */
/*  Weather Watch                                                      */
/* ------------------------------------------------------------------ */

export type WeatherCondition = "Clear" | "Partly Cloudy" | "Cloudy" | "Rain" | "Storms" | "Windy" | "Hot";
export type RiskBand = "Low" | "Moderate" | "High" | "Severe";

export interface WeatherDay {
  label: string;
  condition: WeatherCondition;
  high: number;
  low: number;
  rainRisk: number;
  windMph: number;
}

export interface JobsiteWeather {
  jobId: string;
  jobName: string;
  location: string;
  rainRisk: RiskBand;
  windRisk: RiskBand;
  heatRisk: RiskBand;
  forecast: WeatherDay[];
  recommendation: string;
  weatherSensitiveTasks: string[];
  /** True when forecast came from Open-Meteo or job payload, not placeholder. */
  liveData?: boolean;
}

export const jobsiteWeather: JobsiteWeather[] = [
  {
    jobId: "job-cedar",
    jobName: "Cedar Ridge Roof Replacement",
    location: "Cedar Park, TX",
    rainRisk: "High",
    windRisk: "Moderate",
    heatRisk: "Moderate",
    recommendation: "Move Wednesday dry-in to Friday. Rain probability peaks at 80% Wed afternoon.",
    weatherSensitiveTasks: ["Tear-off south building", "Dry-in south building"],
    forecast: [
      { label: "Mon", condition: "Partly Cloudy", high: 94, low: 74, rainRisk: 15, windMph: 8 },
      { label: "Tue", condition: "Cloudy", high: 90, low: 73, rainRisk: 40, windMph: 12 },
      { label: "Wed", condition: "Storms", high: 84, low: 72, rainRisk: 80, windMph: 18 },
      { label: "Thu", condition: "Rain", high: 86, low: 72, rainRisk: 60, windMph: 14 },
      { label: "Fri", condition: "Clear", high: 92, low: 74, rainRisk: 10, windMph: 7 },
    ],
  },
  {
    jobId: "job-northline",
    jobName: "Northline HVAC Retrofit",
    location: "Northline, TX",
    rainRisk: "Moderate",
    windRisk: "High",
    heatRisk: "High",
    recommendation: "Thursday crane pick at wind risk — gusts to 22 mph forecast. Confirm go/no-go by Wed 4 PM.",
    weatherSensitiveTasks: ["Rooftop unit set (crane)"],
    forecast: [
      { label: "Mon", condition: "Hot", high: 99, low: 78, rainRisk: 5, windMph: 10 },
      { label: "Tue", condition: "Clear", high: 100, low: 79, rainRisk: 5, windMph: 12 },
      { label: "Wed", condition: "Partly Cloudy", high: 97, low: 77, rainRisk: 20, windMph: 16 },
      { label: "Thu", condition: "Windy", high: 95, low: 76, rainRisk: 25, windMph: 22 },
      { label: "Fri", condition: "Clear", high: 98, low: 77, rainRisk: 10, windMph: 9 },
    ],
  },
  {
    jobId: "job-gateway",
    jobName: "Gateway Ventures Buildout",
    location: "Round Rock, TX",
    rainRisk: "Low",
    windRisk: "Low",
    heatRisk: "High",
    recommendation: "Heat index above 100 Tue–Wed. Shift exterior labor to early mornings and add hydration breaks.",
    weatherSensitiveTasks: ["Exterior framing", "Concrete flatwork"],
    forecast: [
      { label: "Mon", condition: "Hot", high: 98, low: 77, rainRisk: 5, windMph: 8 },
      { label: "Tue", condition: "Hot", high: 101, low: 79, rainRisk: 5, windMph: 7 },
      { label: "Wed", condition: "Hot", high: 102, low: 80, rainRisk: 5, windMph: 6 },
      { label: "Thu", condition: "Clear", high: 97, low: 77, rainRisk: 10, windMph: 9 },
      { label: "Fri", condition: "Partly Cloudy", high: 95, low: 76, rainRisk: 15, windMph: 10 },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Permits & Documents                                               */
/* ------------------------------------------------------------------ */

export type PermitStatus =
  | "Needed"
  | "Requested"
  | "Submitted"
  | "Approved"
  | "Expiring"
  | "Blocked"
  | "Not Required";

export type PermitKind = "Permit" | "Document" | "Inspection";

export interface PermitItem {
  id: string;
  jobId: string;
  jobName: string;
  name: string;
  kind: PermitKind;
  status: PermitStatus;
  submittedDate?: string;
  expirationDate?: string;
  inspectionDate?: string;
  dependency?: string;
  critical: boolean;
}

export const permitItems: PermitItem[] = [
  { id: "p1", jobId: "job-northline", jobName: "Northline HVAC", name: "Mechanical Permit", kind: "Permit", status: "Approved", submittedDate: "Apr 22, 2025", expirationDate: "Oct 22, 2025", critical: false },
  { id: "p2", jobId: "job-northline", jobName: "Northline HVAC", name: "Rooftop Structural Review", kind: "Document", status: "Submitted", submittedDate: "Jun 12, 2025", dependency: "Blocks crane pick", critical: true },
  { id: "p3", jobId: "job-cedar", jobName: "Cedar Ridge Roof", name: "Roofing Permit", kind: "Permit", status: "Approved", submittedDate: "May 20, 2025", expirationDate: "Jul 20, 2025", critical: false },
  { id: "p4", jobId: "job-cedar", jobName: "Cedar Ridge Roof", name: "Manufacturer Warranty Reg.", kind: "Document", status: "Needed", dependency: "Required before closeout", critical: false },
  { id: "p5", jobId: "job-harbor", jobName: "Harbor Point TI", name: "Electrical Permit", kind: "Permit", status: "Expiring", submittedDate: "Feb 10, 2025", expirationDate: "Jul 12, 2025", dependency: "Renew before final", critical: true },
  { id: "p6", jobId: "job-harbor", jobName: "Harbor Point TI", name: "Final Inspection", kind: "Inspection", status: "Requested", inspectionDate: "Jul 9, 2025", critical: true },
  { id: "p7", jobId: "job-summit", jobName: "Summit Restoration", name: "Adjuster Scope Approval", kind: "Document", status: "Blocked", dependency: "Awaiting carrier sign-off", critical: true },
  { id: "p8", jobId: "job-summit", jobName: "Summit Restoration", name: "Abatement Clearance", kind: "Document", status: "Requested", submittedDate: "Jun 24, 2025", critical: false },
  { id: "p9", jobId: "job-gateway", jobName: "Gateway Buildout", name: "Building Permit", kind: "Permit", status: "Approved", submittedDate: "Feb 28, 2025", expirationDate: "Feb 28, 2026", critical: false },
  { id: "p10", jobId: "job-gateway", jobName: "Gateway Buildout", name: "MEP Rough-In Inspection", kind: "Inspection", status: "Requested", inspectionDate: "Jul 8, 2025", critical: true },
  { id: "p11", jobId: "job-gateway", jobName: "Gateway Buildout", name: "Site Plan Approval", kind: "Document", status: "Approved", submittedDate: "Jan 30, 2025", critical: false },
  { id: "p12", jobId: "job-metro", jobName: "Metro Facilities", name: "Master Service Agreement", kind: "Document", status: "Approved", submittedDate: "Jan 2, 2025", expirationDate: "Dec 31, 2025", critical: false },
];

/* ------------------------------------------------------------------ */
/*  Cost & ROI                                                         */
/* ------------------------------------------------------------------ */

export interface CostRecord {
  jobId: string;
  jobName: string;
  bidAmount: number;
  estimatedCost: number;
  actualCost: number;
  laborCost: number;
  subCost: number;
  materialCost: number;
  permitCost: number;
  equipmentCost: number;
  changeOrders: number;
  costVariance: number;
  grossMargin: number;
  projectedRoi: number;
  actualRoi: number;
  profitFadeRisk: RiskLevel;
}

export const costRecords: CostRecord[] = [
  { jobId: "job-northline", jobName: "Northline HVAC Retrofit", bidAmount: 842000, estimatedCost: 611000, actualCost: 289400, laborCost: 118600, subCost: 96400, materialCost: 58200, permitCost: 4200, equipmentCost: 12000, changeOrders: 18400, costVariance: -6200, grossMargin: 27.4, projectedRoi: 21.4, actualRoi: 20.1, profitFadeRisk: "Medium" },
  { jobId: "job-cedar", jobName: "Cedar Ridge Roof Replacement", bidAmount: 496000, estimatedCost: 372000, actualCost: 71200, laborCost: 28800, subCost: 24200, materialCost: 14600, permitCost: 1600, equipmentCost: 2000, changeOrders: 0, costVariance: 8900, grossMargin: 25.0, projectedRoi: 18.9, actualRoi: 15.3, profitFadeRisk: "High" },
  { jobId: "job-harbor", jobName: "Harbor Point TI Electrical", bidAmount: 318000, estimatedCost: 233000, actualCost: 178900, laborCost: 92400, subCost: 27600, materialCost: 50300, permitCost: 3600, equipmentCost: 5000, changeOrders: 9200, costVariance: 4100, grossMargin: 26.7, projectedRoi: 14.2, actualRoi: 13.4, profitFadeRisk: "Medium" },
  { jobId: "job-summit", jobName: "Summit Plaza Restoration", bidAmount: 265000, estimatedCost: 198000, actualCost: 88600, laborCost: 41200, subCost: 31500, materialCost: 12400, permitCost: 1500, equipmentCost: 2000, changeOrders: 22600, costVariance: -3200, grossMargin: 25.3, projectedRoi: 23.7, actualRoi: 24.9, profitFadeRisk: "Low" },
  { jobId: "job-metro", jobName: "Metro Retail Facilities", bidAmount: 540000, estimatedCost: 405000, actualCost: 214300, laborCost: 121000, subCost: 62000, materialCost: 24300, permitCost: 1000, equipmentCost: 6000, changeOrders: 4800, costVariance: 2200, grossMargin: 25.0, projectedRoi: 27.1, actualRoi: 26.4, profitFadeRisk: "Low" },
  { jobId: "job-gateway", jobName: "Gateway Ventures Buildout", bidAmount: 1240000, estimatedCost: 968000, actualCost: 402700, laborCost: 168300, subCost: 156400, materialCost: 61000, permitCost: 7000, equipmentCost: 10000, changeOrders: 31200, costVariance: -14800, grossMargin: 21.9, projectedRoi: 16.8, actualRoi: 14.9, profitFadeRisk: "High" },
];

export const costToDateSeries = [
  { week: "Wk 1", budget: 60000, actual: 58200 },
  { week: "Wk 2", budget: 145000, actual: 151400 },
  { week: "Wk 3", budget: 232000, actual: 244900 },
  { week: "Wk 4", budget: 318000, actual: 339700 },
  { week: "Wk 5", budget: 402000, actual: 431200 },
  { week: "Wk 6", budget: 498000, actual: 528600 },
];

export const laborBurnSeries = [
  { week: "Wk 1", planned: 640, actual: 612 },
  { week: "Wk 2", planned: 640, actual: 668 },
  { week: "Wk 3", planned: 640, actual: 704 },
  { week: "Wk 4", planned: 640, actual: 690 },
  { week: "Wk 5", planned: 640, actual: 726 },
  { week: "Wk 6", planned: 640, actual: 742 },
];

/* ------------------------------------------------------------------ */
/*  Alerts                                                             */
/* ------------------------------------------------------------------ */

export type AlertSeverity = "Critical" | "High" | "Medium" | "Info";
export type AlertCategory =
  | "Weather"
  | "Permit"
  | "Cost"
  | "Labor"
  | "Subcontractor"
  | "Follow-Up"
  | "ROI"
  | "Schedule";

export interface AlertItem {
  id: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  detail: string;
  jobName?: string;
  time: string;
  action: string;
  resolved: boolean;
}

export const alertItems: AlertItem[] = [
  { id: "a1", severity: "Critical", category: "Permit", title: "Adjuster scope approval blocking deployment", detail: "Summit Plaza rebuild cannot proceed until Meridian Insurance signs off on the mitigation scope.", jobName: "Summit Plaza Restoration", time: "22 min ago", action: "Escalate to adjuster", resolved: false },
  { id: "a2", severity: "Critical", category: "Weather", title: "Rain risk 80% Wednesday — Cedar Ridge dry-in", detail: "Exterior dry-in exposed to storms. Recommend moving to Friday to protect deck.", jobName: "Cedar Ridge Roof Replacement", time: "1 hr ago", action: "Reschedule task", resolved: false },
  { id: "a3", severity: "High", category: "ROI", title: "Gateway trending 1.9% under projected ROI", detail: "Change orders and labor burn are compressing margin. Review scope recovery options.", jobName: "Gateway Ventures Buildout", time: "2 hr ago", action: "Open Cost & ROI", resolved: false },
  { id: "a4", severity: "High", category: "Labor", title: "Grace Lin overallocated at 104%", detail: "Assigned across trim-out and final inspection prep same week. Rebalance crew.", jobName: "Harbor Point TI Electrical", time: "3 hr ago", action: "Rebalance labor", resolved: false },
  { id: "a5", severity: "High", category: "Subcontractor", title: "Titan Sheet Metal reporting 3-day delay", detail: "Fabrication backlog impacts Cedar Ridge detailing. Confirm revised delivery.", jobName: "Cedar Ridge Roof Replacement", time: "4 hr ago", action: "Contact sub", resolved: false },
  { id: "a6", severity: "Medium", category: "Permit", title: "Electrical permit expiring Jul 12", detail: "Harbor Point permit must be renewed before final inspection can pass.", jobName: "Harbor Point TI Electrical", time: "5 hr ago", action: "Renew permit", resolved: false },
  { id: "a7", severity: "Medium", category: "Follow-Up", title: "3 bids overdue for follow-up", detail: "Riverside Medical, Oakwood Plaza, and Lakeline Retail follow-ups are past due.", time: "6 hr ago", action: "Open follow-ups", resolved: false },
  { id: "a8", severity: "Medium", category: "Cost", title: "Labor burn 16% over plan", detail: "Cumulative labor hours trending above baseline across active jobs.", time: "8 hr ago", action: "Review burn rate", resolved: false },
  { id: "a9", severity: "Info", category: "Schedule", title: "MEP rough-in inspection confirmed Jul 8", detail: "City inspector confirmed for Gateway Ventures buildout.", jobName: "Gateway Ventures Buildout", time: "Yesterday", action: "View schedule", resolved: true },
];

/* ------------------------------------------------------------------ */
/*  Daily Intelligent Briefing                                        */
/* ------------------------------------------------------------------ */

export interface BriefingItem {
  id: string;
  category: AlertCategory;
  headline: string;
  detail: string;
  priority: AlertSeverity;
  action: string;
}

export interface DailyBriefing {
  greeting: string;
  date: string;
  summary: string;
  stats: { label: string; value: string }[];
  items: BriefingItem[];
}

export const dailyBriefing: DailyBriefing = {
  greeting: "Good morning, Jordan.",
  date: "Tuesday, July 1, 2025",
  summary:
    "You have 3 bids needing follow-up, 2 jobs with weather risk, 1 permit blocking deployment, and 1 project trending under its labor budget. MarketWatchOS is flagging fresh public-signal opportunities on the Opportunity Radar for review.",
  stats: [
    { label: "Bids to follow up", value: "3" },
    { label: "Jobs at weather risk", value: "2" },
    { label: "Permit blockers", value: "1" },
    { label: "Jobs over budget", value: "1" },
  ],
  items: [
    { id: "b1", category: "Permit", headline: "Unblock Summit Plaza rebuild", detail: "Adjuster scope approval from Meridian Insurance is the only blocker for mitigation-to-rebuild handoff.", priority: "Critical", action: "Escalate to adjuster" },
    { id: "b2", category: "Weather", headline: "Protect Cedar Ridge dry-in", detail: "80% rain probability Wednesday. Move dry-in to Friday and confirm Titan detailing after.", priority: "Critical", action: "Reschedule task" },
    { id: "b3", category: "Labor", headline: "Rebalance Harbor Point crew", detail: "Grace Lin is overallocated at 104%. Shift trim-out support to Jesse Park (available).", priority: "High", action: "Rebalance labor" },
    { id: "b4", category: "ROI", headline: "Review Gateway margin", detail: "Change orders pushing Gateway 1.9% under projected ROI. Evaluate recovery on remaining scope.", priority: "High", action: "Open Cost & ROI" },
    { id: "b5", category: "Follow-Up", headline: "Clear overdue follow-ups", detail: "Riverside Medical, Oakwood Plaza, and Lakeline Retail are all past due for follow-up.", priority: "Medium", action: "Open follow-ups" },
  ],
};

/* ------------------------------------------------------------------ */
/*  VoiceConnect command center                                       */
/* ------------------------------------------------------------------ */

export interface VoiceCommand {
  command: string;
  category: string;
  response: string;
  actionLabel: string;
}

export const voiceCommands: VoiceCommand[] = [
  { command: "Show jobs at risk today", category: "Operations", response: "2 jobs are at weather risk (Cedar Ridge, Northline) and 1 is blocked by a permit (Summit Plaza). Cedar Ridge dry-in has the highest exposure at 80% rain probability.", actionLabel: "Open Alerts" },
  { command: "Reschedule rain-affected jobs", category: "Scheduling", response: "Cedar Ridge dry-in moved from Wednesday to Friday. Titan Sheet Metal detailing shifted to follow. Confirm with crew lead Sam Okafor before publishing.", actionLabel: "Review schedule" },
  { command: "Brief me on permits expiring this week", category: "Permits", response: "1 permit is expiring: Harbor Point electrical permit expires Jul 12 and must be renewed before final inspection. 1 document is blocked awaiting adjuster sign-off.", actionLabel: "Open Permits" },
  { command: "What jobs are over budget?", category: "Cost & ROI", response: "Gateway Ventures is trending 1.9% under projected ROI with change orders driving the variance. Cedar Ridge shows a high profit-fade risk from the weather delay.", actionLabel: "Open Cost & ROI" },
  { command: "Turn this won bid into a job", category: "Bid Intelligence", response: "I can create a Job Deployment record from a won bid, carrying over client, location, contract value, and scope. Which won bid should I deploy?", actionLabel: "Open Won Jobs" },
  { command: "Create a bid for an HVAC retrofit", category: "Bid Intelligence", response: "Starting a new HVAC retrofit bid. I've pre-filled system type and building type fields for your HVAC vertical. Add the opportunity details to continue.", actionLabel: "Open new bid" },
  { command: "Generate a client update", category: "Client Comms", response: "Drafted a client update summarizing progress, upcoming milestones, and schedule notes. Internal margin and strategy are excluded. Review before sending.", actionLabel: "Review draft" },
  { command: "Call the subcontractor", category: "Operations", response: "Titan Sheet Metal is reporting a 3-day delay on Cedar Ridge. I can log the call outcome and update the schedule once you confirm the revised date.", actionLabel: "Log update" },
];
