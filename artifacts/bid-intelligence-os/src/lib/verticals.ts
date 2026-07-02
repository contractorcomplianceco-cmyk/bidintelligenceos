export type VerticalId =
  | "gc"
  | "hvac"
  | "roofing"
  | "electrical"
  | "plumbing"
  | "restoration"
  | "facility"
  | "concrete"
  | "landscaping"
  | "specialty"
  | "insurance"
  | "engineering"
  | "custom";

export interface VerticalConfig {
  id: VerticalId;
  name: string;
  short: string;
  tagline: string;
  /** Ordered job lifecycle phases used by Job Deployment + Scheduling */
  jobPhases: string[];
  /** Cost buckets surfaced in Cost & ROI */
  costCategories: string[];
  /** Labor / crew role categories */
  laborCategories: string[];
  /** Subcontractor trade categories */
  subCategories: string[];
  /** Typical permit / document needs */
  permitNeeds: string[];
  /** Whether outdoor/weather-sensitive work is common */
  weatherSensitive: boolean;
  /** Short description of the weather exposure */
  weatherNote: string;
  /** ROI / performance metric labels emphasized for this vertical */
  roiMetrics: string[];
  /** Vendor-facing proposal sections */
  proposalSections: string[];
  /** Common critical alert themes */
  alertTypes: string[];
  /** Bid intake fields emphasized for this vertical */
  bidFields: string[];
}

export const VERTICALS: VerticalConfig[] = [
  {
    id: "gc",
    name: "General Contractor",
    short: "GC",
    tagline: "Ground-up and tenant buildouts across trades.",
    jobPhases: [
      "Preconstruction",
      "Mobilization",
      "Framing",
      "MEP Rough-In",
      "Inspection",
      "Finishes",
      "Punch List",
      "Closeout",
    ],
    costCategories: ["Labor", "Subcontractors", "Materials", "Equipment", "Change Orders", "General Conditions"],
    laborCategories: ["Superintendent", "Foreman", "Carpenter", "Laborer", "Project Engineer"],
    subCategories: ["Concrete", "Electrical", "Mechanical", "Plumbing", "Drywall", "Roofing"],
    permitNeeds: ["Building Permit", "Certificate of Insurance", "Site Plan Approval", "Inspection Approvals"],
    weatherSensitive: true,
    weatherNote: "Exterior framing, concrete pours, and crane picks are weather-sensitive.",
    roiMetrics: ["Gross Margin", "Projected ROI", "Schedule Variance", "Change Order Recovery"],
    proposalSections: ["Executive Summary", "Scope of Work", "Schedule", "Assumptions & Exclusions", "Pricing", "Terms"],
    alertTypes: ["Permit blockers", "Weather delays", "Sub delays", "Labor conflicts", "Cost overruns"],
    bidFields: ["Project Type", "Square Footage", "Delivery Method", "Bid Due Date", "Bond Required"],
  },
  {
    id: "hvac",
    name: "HVAC",
    short: "HVAC",
    tagline: "Mechanical retrofits, installs, and service contracts.",
    jobPhases: ["Equipment Order", "Ductwork", "Install", "Startup", "Inspection", "Commissioning"],
    costCategories: ["Labor", "Equipment", "Materials", "Subcontractors", "Permits", "Change Orders"],
    laborCategories: ["Lead Installer", "Service Tech", "Sheet Metal", "Controls Tech", "Helper"],
    subCategories: ["Electrical", "Crane / Rigging", "Insulation", "Controls", "Balancing"],
    permitNeeds: ["Mechanical Permit", "Equipment Specs", "Warranty Registration", "Inspection Approvals"],
    weatherSensitive: true,
    weatherNote: "Rooftop unit sets and exterior crane work depend on wind and rain windows.",
    roiMetrics: ["Gross Margin", "Projected ROI", "Labor Burn Rate", "Equipment Variance"],
    proposalSections: ["Executive Summary", "Equipment & Scope", "Schedule", "Warranty", "Pricing", "Terms"],
    alertTypes: ["Equipment lead times", "Rooftop weather risk", "Inspection holds", "Labor conflicts"],
    bidFields: ["System Type", "Tonnage", "Building Type", "Bid Due Date", "Prevailing Wage"],
  },
  {
    id: "roofing",
    name: "Roofing",
    short: "Roof",
    tagline: "Tear-off, dry-in, and re-roof across commercial systems.",
    jobPhases: ["Tear-Off", "Dry-In", "Install", "Detailing", "Inspection", "Cleanup"],
    costCategories: ["Labor", "Materials", "Equipment", "Disposal", "Subcontractors", "Change Orders"],
    laborCategories: ["Roofing Foreman", "Mechanic", "Laborer", "Safety Lead"],
    subCategories: ["Sheet Metal", "Crane / Hoist", "Waterproofing", "Disposal"],
    permitNeeds: ["Roofing Permit", "Material Order Confirmation", "Manufacturer Warranty", "Inspection Approvals"],
    weatherSensitive: true,
    weatherNote: "Rain, wind, and heat directly gate tear-off and dry-in windows.",
    roiMetrics: ["Gross Margin", "Projected ROI", "Squares/Day", "Rework Rate"],
    proposalSections: ["Executive Summary", "Roof System & Scope", "Schedule", "Warranty", "Pricing", "Terms"],
    alertTypes: ["Rain-out risk", "Wind holds", "Material delivery", "Inspection holds"],
    bidFields: ["Roof System", "Squares", "Deck Type", "Bid Due Date", "Warranty Term"],
  },
  {
    id: "electrical",
    name: "Electrical",
    short: "Elec",
    tagline: "Tenant improvement, service, and power distribution.",
    jobPhases: ["Design Review", "Rough-In", "Wire Pull", "Trim-Out", "Inspection", "Energization"],
    costCategories: ["Labor", "Materials", "Gear & Fixtures", "Subcontractors", "Permits", "Change Orders"],
    laborCategories: ["Foreman", "Journeyman", "Apprentice", "Low-Voltage Tech"],
    subCategories: ["Fire Alarm", "Low Voltage", "Utility Coordination", "Testing"],
    permitNeeds: ["Electrical Permit", "Single-Line Diagram", "Utility Approval", "Inspection Approvals"],
    weatherSensitive: false,
    weatherNote: "Mostly interior; exterior gear sets and trenching are weather-sensitive.",
    roiMetrics: ["Gross Margin", "Projected ROI", "Labor Burn Rate", "Material Variance"],
    proposalSections: ["Executive Summary", "Scope of Work", "Schedule", "Assumptions & Exclusions", "Pricing", "Terms"],
    alertTypes: ["Gear lead times", "Inspection holds", "Utility coordination", "Labor conflicts"],
    bidFields: ["Service Size", "Square Footage", "Building Type", "Bid Due Date", "Prevailing Wage"],
  },
  {
    id: "plumbing",
    name: "Plumbing",
    short: "Plumb",
    tagline: "Underground, rough-in, and fixture trim for commercial.",
    jobPhases: ["Underground", "Rough-In", "Top-Out", "Trim-Out", "Inspection", "Startup"],
    costCategories: ["Labor", "Materials", "Fixtures", "Subcontractors", "Permits", "Change Orders"],
    laborCategories: ["Foreman", "Journeyman", "Apprentice", "Service Tech"],
    subCategories: ["Excavation", "Concrete Cutting", "Backflow Testing", "Utility Tie-In"],
    permitNeeds: ["Plumbing Permit", "Isometric Drawings", "Backflow Certification", "Inspection Approvals"],
    weatherSensitive: false,
    weatherNote: "Underground and site utility work is weather- and soil-sensitive.",
    roiMetrics: ["Gross Margin", "Projected ROI", "Labor Burn Rate", "Fixture Variance"],
    proposalSections: ["Executive Summary", "Scope of Work", "Schedule", "Assumptions & Exclusions", "Pricing", "Terms"],
    alertTypes: ["Fixture lead times", "Inspection holds", "Utility tie-in", "Labor conflicts"],
    bidFields: ["System Type", "Fixture Count", "Building Type", "Bid Due Date", "Prevailing Wage"],
  },
  {
    id: "restoration",
    name: "Insurance / Restoration",
    short: "Resto",
    tagline: "Claims-driven mitigation, rebuild, and supplements.",
    jobPhases: ["Claim Review", "Estimate", "Mitigation", "Rebuild", "Supplement", "Closeout"],
    costCategories: ["Labor", "Materials", "Subcontractors", "Supplements", "Equipment", "Change Orders"],
    laborCategories: ["Project Manager", "Mitigation Tech", "Carpenter", "Content Specialist"],
    subCategories: ["Abatement", "Electrical", "Plumbing", "HVAC", "Flooring"],
    permitNeeds: ["Claim Documentation", "Scope Approval", "Adjuster Notes", "Building Permit"],
    weatherSensitive: true,
    weatherNote: "Emergency mitigation windows are driven by ongoing weather events.",
    roiMetrics: ["Gross Margin", "Projected ROI", "Supplement Recovery", "Cycle Time"],
    proposalSections: ["Executive Summary", "Scope of Loss", "Mitigation Plan", "Rebuild Scope", "Pricing", "Terms"],
    alertTypes: ["Supplement pending", "Adjuster approval", "Mitigation window", "Documentation gaps"],
    bidFields: ["Loss Type", "Claim Number", "Carrier", "Date of Loss", "Deductible"],
  },
  {
    id: "facility",
    name: "Facility Maintenance",
    short: "Facility",
    tagline: "Recurring maintenance and multi-site service contracts.",
    jobPhases: ["Intake", "Dispatch", "Service", "Verification", "Invoice", "Review"],
    costCategories: ["Labor", "Materials", "Subcontractors", "Travel", "Equipment", "Change Orders"],
    laborCategories: ["Route Tech", "Lead Tech", "Dispatcher", "Regional Manager"],
    subCategories: ["Electrical", "Plumbing", "HVAC", "Janitorial", "Landscaping"],
    permitNeeds: ["Master Service Agreement", "Certificate of Insurance", "Site Access", "Compliance Logs"],
    weatherSensitive: false,
    weatherNote: "Exterior and rooftop service tickets are weather-sensitive.",
    roiMetrics: ["Gross Margin", "Projected ROI", "First-Time Fix Rate", "SLA Compliance"],
    proposalSections: ["Executive Summary", "Service Scope", "SLA & Response", "Coverage", "Pricing", "Terms"],
    alertTypes: ["SLA breaches", "Missed tickets", "Multi-site conflicts", "Cost overruns"],
    bidFields: ["Contract Type", "Site Count", "Coverage Hours", "Bid Due Date", "SLA Tier"],
  },
  {
    id: "concrete",
    name: "Concrete",
    short: "Concrete",
    tagline: "Flatwork, structural, and tilt-up placement.",
    jobPhases: ["Layout", "Formwork", "Rebar", "Pour", "Finish", "Inspection"],
    costCategories: ["Labor", "Materials", "Pumping", "Equipment", "Subcontractors", "Change Orders"],
    laborCategories: ["Foreman", "Finisher", "Form Setter", "Laborer"],
    subCategories: ["Pumping", "Rebar", "Sawcutting", "Testing"],
    permitNeeds: ["Building Permit", "Mix Design Approval", "Rebar Inspection", "Inspection Approvals"],
    weatherSensitive: true,
    weatherNote: "Pours are highly sensitive to rain, heat, and freeze windows.",
    roiMetrics: ["Gross Margin", "Projected ROI", "Yards/Day", "Rework Rate"],
    proposalSections: ["Executive Summary", "Scope of Work", "Schedule", "Assumptions & Exclusions", "Pricing", "Terms"],
    alertTypes: ["Pour weather risk", "Mix delivery", "Inspection holds", "Labor conflicts"],
    bidFields: ["Placement Type", "Cubic Yards", "PSI", "Bid Due Date", "Bond Required"],
  },
  {
    id: "landscaping",
    name: "Landscaping",
    short: "Land",
    tagline: "Site, hardscape, and grounds installation.",
    jobPhases: ["Site Prep", "Grading", "Hardscape", "Planting", "Irrigation", "Walkthrough"],
    costCategories: ["Labor", "Materials", "Plants", "Equipment", "Subcontractors", "Change Orders"],
    laborCategories: ["Crew Lead", "Operator", "Laborer", "Irrigation Tech"],
    subCategories: ["Grading", "Irrigation", "Masonry", "Electrical / Lighting"],
    permitNeeds: ["Grading Permit", "Irrigation Plan", "Certificate of Insurance", "Inspection Approvals"],
    weatherSensitive: true,
    weatherNote: "Planting, grading, and hardscape are highly weather-dependent.",
    roiMetrics: ["Gross Margin", "Projected ROI", "Crew Productivity", "Material Variance"],
    proposalSections: ["Executive Summary", "Scope of Work", "Schedule", "Maintenance Plan", "Pricing", "Terms"],
    alertTypes: ["Weather delays", "Plant delivery", "Irrigation inspection", "Labor conflicts"],
    bidFields: ["Project Type", "Site Acreage", "Irrigation Zones", "Bid Due Date", "Maintenance Term"],
  },
  {
    id: "specialty",
    name: "Specialty Trade",
    short: "Specialty",
    tagline: "Focused scopes with specialized crews and equipment.",
    jobPhases: ["Assessment", "Mobilization", "Execution", "Quality Check", "Inspection", "Closeout"],
    costCategories: ["Labor", "Materials", "Equipment", "Subcontractors", "Permits", "Change Orders"],
    laborCategories: ["Foreman", "Specialist", "Technician", "Laborer"],
    subCategories: ["Engineering", "Testing", "Rigging", "Coatings"],
    permitNeeds: ["Trade Permit", "Certificate of Insurance", "Compliance Docs", "Inspection Approvals"],
    weatherSensitive: false,
    weatherNote: "Exterior and elevated scopes may be weather-sensitive.",
    roiMetrics: ["Gross Margin", "Projected ROI", "Labor Burn Rate", "Rework Rate"],
    proposalSections: ["Executive Summary", "Scope of Work", "Schedule", "Assumptions & Exclusions", "Pricing", "Terms"],
    alertTypes: ["Material lead times", "Inspection holds", "Access constraints", "Labor conflicts"],
    bidFields: ["Scope Type", "Quantity", "Building Type", "Bid Due Date", "Bond Required"],
  },
  {
    id: "insurance",
    name: "Insurance Restoration & Claims",
    short: "Insurance",
    tagline: "Claim-driven restoration with supplement and adjuster workflows.",
    jobPhases: [
      "First Notice of Loss",
      "Inspection & Scope",
      "Estimate & Claim",
      "Mitigation",
      "Rebuild",
      "Supplement",
      "Adjuster Approval",
      "Closeout",
    ],
    costCategories: ["Labor", "Materials", "Subcontractors", "Supplements", "Equipment", "Content Handling", "Change Orders"],
    laborCategories: ["Project Manager", "Estimator", "Mitigation Tech", "Carpenter", "Content Specialist"],
    subCategories: ["Abatement", "Electrical", "Plumbing", "HVAC", "Flooring", "Contents / Pack-Out"],
    permitNeeds: ["Claim Documentation", "Scope of Loss Approval", "Adjuster Notes", "Building Permit", "Certificate of Insurance"],
    weatherSensitive: true,
    weatherNote: "Emergency mitigation and exterior repairs are driven by ongoing weather events.",
    roiMetrics: ["Gross Margin", "Projected ROI", "Supplement Recovery", "Cycle Time", "Claim Approval Rate"],
    proposalSections: ["Executive Summary", "Scope of Loss", "Mitigation Plan", "Rebuild Scope", "Supplement Detail", "Pricing", "Terms"],
    alertTypes: ["Supplement pending", "Adjuster approval", "Mitigation window", "Documentation gaps", "Deadline risk"],
    bidFields: ["Loss Type", "Claim Number", "Carrier", "Date of Loss", "Deductible", "Adjuster"],
  },
  {
    id: "engineering",
    name: "Engineering & Design-Build",
    short: "Engineering",
    tagline: "Design-build delivery with civil scope and permit sequencing.",
    jobPhases: [
      "Concept & Feasibility",
      "Design Development",
      "Permitting",
      "Mobilization",
      "Sitework & Earthwork",
      "Construction",
      "Commissioning",
      "Closeout",
    ],
    costCategories: ["Design & Engineering", "Labor", "Subcontractors", "Materials", "Equipment", "Permits & Fees", "Change Orders"],
    laborCategories: ["Project Engineer", "Design Lead", "Superintendent", "Field Engineer", "Surveyor", "Operator"],
    subCategories: ["Civil / Earthwork", "Structural", "MEP", "Geotechnical", "Testing & Inspection", "Utilities"],
    permitNeeds: ["Building Permit", "Grading & Site Permit", "Environmental Approval", "Engineered Drawings", "Inspection Approvals"],
    weatherSensitive: true,
    weatherNote: "Earthwork, foundations, and site utilities are highly weather- and soil-sensitive.",
    roiMetrics: ["Gross Margin", "Projected ROI", "Design Fee Recovery", "Schedule Variance", "Change Order Recovery"],
    proposalSections: ["Executive Summary", "Design Approach", "Scope of Work", "Schedule", "Assumptions & Exclusions", "Pricing", "Terms"],
    alertTypes: ["Permit sequencing", "Design revisions", "Weather delays", "Geotech surprises", "Cost overruns"],
    bidFields: ["Project Type", "Delivery Method", "Site Acreage", "Bid Due Date", "Bond Required", "Design Basis"],
  },
  {
    id: "custom",
    name: "Custom Business Type",
    short: "Custom",
    tagline: "Configure a workflow tailored to your operation.",
    jobPhases: ["Intake", "Planning", "Execution", "Verification", "Inspection", "Closeout"],
    costCategories: ["Labor", "Materials", "Subcontractors", "Equipment", "Permits", "Change Orders"],
    laborCategories: ["Lead", "Technician", "Specialist", "Support"],
    subCategories: ["Trade Partner A", "Trade Partner B", "Testing", "Logistics"],
    permitNeeds: ["Primary Permit", "Certificate of Insurance", "Compliance Docs", "Inspection Approvals"],
    weatherSensitive: false,
    weatherNote: "Set weather sensitivity based on your typical scopes.",
    roiMetrics: ["Gross Margin", "Projected ROI", "Labor Burn Rate", "Cost Variance"],
    proposalSections: ["Executive Summary", "Scope of Work", "Schedule", "Assumptions & Exclusions", "Pricing", "Terms"],
    alertTypes: ["Schedule risk", "Cost overruns", "Documentation gaps", "Labor conflicts"],
    bidFields: ["Project Type", "Quantity", "Location", "Bid Due Date", "Contract Type"],
  },
];

export const DEFAULT_VERTICAL: VerticalId = "gc";

export function getVertical(id: VerticalId): VerticalConfig {
  return VERTICALS.find((v) => v.id === id) ?? VERTICALS[0];
}
