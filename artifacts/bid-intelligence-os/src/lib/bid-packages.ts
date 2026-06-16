export type SectionType = "Cover" | "Executive Summary" | "Project Overview" | "Locations Covered" | "Scope of Work" | "Included Scope" | "Service Matrix" | "Pricing Summary" | "Optional Alternates" | "Timeline" | "Response Time Options" | "Monthly Service Structure" | "Reporting Cadence" | "Assumptions" | "Exclusions" | "Assumptions & Exclusions" | "Qualifications" | "Warranty" | "Attachments" | "Next Steps";

export interface PackageSection {
  id: string;
  type: SectionType;
  title: string;
  content: string | any; // Any can be array of objects for tables
  required?: boolean;
}

export interface BidPackageData {
  id: string;
  name: string;
  contractor: string;
  recipient: string;
  project: string;
  projectType: string;
  date: string;
  sections: PackageSection[];
}

export const samplePackages: BidPackageData[] = [
  {
    id: "pkg-1",
    name: "Commercial HVAC Retrofit Proposal",
    contractor: "Apex Mechanical Services",
    recipient: "Regional Property Management Group",
    project: "Downtown Tower HVAC Retrofit",
    projectType: "HVAC Retrofit",
    date: "2023-11-01",
    sections: [
      {
        id: "s1-cover",
        type: "Cover",
        title: "Proposal Cover",
        required: true,
        content: {
          title: "Commercial HVAC Retrofit Proposal",
          subtitle: "Prepared for Regional Property Management Group",
        }
      },
      {
        id: "s1-exec",
        type: "Executive Summary",
        title: "Executive Summary",
        required: true,
        content: "Apex Mechanical Services is pleased to submit this proposal for the Downtown Tower HVAC Retrofit. Leveraging our extensive experience in secure facility environments and complex high-rise logistics, we are committed to minimizing operational disruption to current tenants while delivering premium mechanical upgrades. This proposal outlines our approach to replacing the aging rooftop units with high-efficiency systems."
      },
      {
        id: "s1-scope",
        type: "Scope of Work",
        title: "Scope of Work",
        required: true,
        content: [
          "Provide all labor, materials, and equipment to replace three (3) rooftop RTUs.",
          "Modify existing ductwork to accommodate new equipment footprints.",
          "Integrate new systems into the existing BACnet BMS as per specs section 23 09 00.",
          "Crane lift and rigging for equipment hoisting during weekend hours.",
          "Start-up, testing, and commissioning of all new equipment."
        ]
      },
      {
        id: "s1-pricing",
        type: "Pricing Summary",
        title: "Pricing Summary",
        required: true,
        content: {
          items: [
            { description: "Equipment (3x RTUs)", amount: "$145,000" },
            { description: "Labor & Rigging", amount: "$85,000" },
            { description: "BMS Integration", amount: "$22,000" },
            { description: "Permits & Fees", amount: "$8,500" }
          ],
          total: "$260,500"
        }
      },
      {
        id: "s1-timeline",
        type: "Timeline",
        title: "Timeline",
        required: true,
        content: [
          { phase: "Phase 1: Equipment Procurement", duration: "6 Weeks" },
          { phase: "Phase 2: Prep and Rigging", duration: "1 Week" },
          { phase: "Phase 3: Installation & Integration", duration: "3 Weeks" },
          { phase: "Phase 4: Commissioning", duration: "1 Week" }
        ]
      },
      {
        id: "s1-assumptions",
        type: "Assumptions",
        title: "Assumptions",
        content: [
          "Unrestricted access to staging area during night shifts (10PM - 5AM).",
          "Existing structural pads meet load requirements for new RTUs.",
          "Building management will provide necessary shut-down notices to tenants."
        ]
      },
      {
        id: "s1-exclusions",
        type: "Exclusions",
        title: "Exclusions",
        content: [
          "Hazardous material abatement or testing.",
          "Structural engineering or concrete pad replacement.",
          "Temporary cooling during changeover."
        ]
      },
      {
        id: "s1-qualifications",
        type: "Qualifications",
        title: "Qualifications",
        content: "Apex Mechanical Services is fully licensed, bonded, and insured. We carry $5M in general liability and hold certifications for all major HVAC manufacturers."
      },
      {
        id: "s1-attachments",
        type: "Attachments",
        title: "Attachments",
        content: ["Bid Form 00410", "Subcontractor List", "Non-Collusion Affidavit", "5% Bid Bond", "Equipment Cut Sheets"]
      }
    ]
  },
  {
    id: "pkg-2",
    name: "Roofing Replacement Bid Package",
    contractor: "Summit Roofing & Exterior",
    recipient: "Commercial Building Owner",
    project: "Corporate Park Roof Replacement",
    projectType: "Commercial Roofing",
    date: "2023-11-15",
    sections: [
      {
        id: "s2-cover",
        type: "Cover",
        title: "Bid Package Cover",
        required: true,
        content: {
          title: "Roofing Replacement Bid Package",
          subtitle: "Corporate Park Facilities",
        }
      },
      {
        id: "s2-overview",
        type: "Project Overview",
        title: "Project Overview",
        required: true,
        content: "Summit Roofing & Exterior provides this comprehensive bid for the full tear-off and replacement of the 45,000 sq ft TPO roof system at the Corporate Park facility. Our approach prioritizes building envelope integrity and long-term energy efficiency."
      },
      {
        id: "s2-scope",
        type: "Included Scope",
        title: "Included Scope",
        required: true,
        content: [
          "Complete tear-off of existing EPDM roofing down to the metal deck.",
          "Installation of two layers of 2.6\" polyisocyanurate insulation.",
          "Mechanically fasten new 60-mil TPO membrane system.",
          "Install new pre-finished edge metal and counter-flashing.",
          "Replace all existing roof drains and overflow scuppers."
        ]
      },
      {
        id: "s2-alternates",
        type: "Optional Alternates",
        title: "Optional Alternates",
        content: {
          items: [
            { description: "Upgrade to 80-mil TPO membrane", amount: "+ $18,500" },
            { description: "Walkway pads around all RTUs", amount: "+ $4,200" },
            { description: "20-Year NDL Warranty Extension", amount: "+ $9,000" }
          ]
        }
      },
      {
        id: "s2-pricing",
        type: "Pricing Summary",
        title: "Pricing Summary",
        required: true,
        content: {
          items: [
            { description: "Tear-off and Disposal", amount: "$45,000" },
            { description: "Insulation and Materials", amount: "$120,000" },
            { description: "Labor and Installation", amount: "$95,000" },
            { description: "Sheet Metal & Flashing", amount: "$15,000" }
          ],
          total: "$275,000"
        }
      },
      {
        id: "s2-timeline",
        type: "Timeline",
        title: "Timeline",
        required: true,
        content: [
          { phase: "Material Delivery", duration: "Week 1" },
          { phase: "Tear-off & Dry-in (Sections 1-3)", duration: "Weeks 2-3" },
          { phase: "Tear-off & Dry-in (Sections 4-6)", duration: "Weeks 4-5" },
          { phase: "Detailing and Metal Edging", duration: "Week 6" },
          { phase: "Final Inspection", duration: "Week 7" }
        ]
      },
      {
        id: "s2-assumptions",
        type: "Assumptions",
        title: "Assumptions",
        content: [
          "Roof deck is structurally sound and free of rust/rot.",
          "Dumpster placement allowed in the North parking lot."
        ]
      },
      {
        id: "s2-exclusions",
        type: "Exclusions",
        title: "Exclusions",
        content: [
          "Deck replacement (if needed, billed at $8.50/sq ft).",
          "Interior protection from dust/debris during tear-off.",
          "HVAC disconnect/reconnect."
        ]
      },
      {
        id: "s2-warranty",
        type: "Warranty",
        title: "Warranty / Qualifications",
        content: "Standard 15-Year Manufacturer NDL (No Dollar Limit) Warranty included. 2-Year Summit Workmanship Guarantee."
      },
      {
        id: "s2-attachments",
        type: "Attachments",
        title: "Attachments",
        content: ["Certificate of Insurance", "Safety Plan", "TPO Product Data Sheet", "Warranty Spec Sheet"]
      }
    ]
  },
  {
    id: "pkg-3",
    name: "Multi-Location Maintenance Services Proposal",
    contractor: "Northline Facility Services",
    recipient: "Franchise Operations Team",
    project: "Regional Portfolio Maintenance 2024",
    projectType: "Facility Maintenance",
    date: "2023-12-01",
    sections: [
      {
        id: "s3-cover",
        type: "Cover",
        title: "Proposal Cover",
        required: true,
        content: {
          title: "Multi-Location Maintenance Services Proposal",
          subtitle: "Prepared for Franchise Operations Team",
        }
      },
      {
        id: "s3-exec",
        type: "Executive Summary",
        title: "Executive Summary",
        required: true,
        content: "Northline Facility Services proposes a comprehensive, standardized maintenance program for the 14 regional franchise locations. Our model reduces emergency call-outs by 40% through proactive PMs and provides a single point of contact for all facility needs."
      },
      {
        id: "s3-locations",
        type: "Locations Covered",
        title: "Locations Covered",
        content: [
          "Store #101 - Seattle, WA", "Store #102 - Bellevue, WA", "Store #103 - Tacoma, WA",
          "Store #104 - Everett, WA", "Store #105 - Renton, WA", "Store #106 - Kent, WA",
          "Store #107 - Federal Way, WA", "Store #108 - Auburn, WA", "Store #109 - Puyallup, WA",
          "Store #110 - Olympia, WA", "Store #111 - Lakewood, WA", "Store #112 - Bremerton, WA",
          "Store #113 - Silverdale, WA", "Store #114 - Port Orchard, WA"
        ]
      },
      {
        id: "s3-matrix",
        type: "Service Matrix",
        title: "Service Matrix",
        required: true,
        content: {
          headers: ["Service Area", "Preventative (Qrtly)", "On-Call Repair", "Emergency 24/7"],
          rows: [
            ["HVAC / Refrigeration", true, true, true],
            ["Plumbing", true, true, true],
            ["Electrical & Lighting", true, true, false],
            ["General Handyman", false, true, false],
            ["Exterior / Signage", false, true, false]
          ]
        }
      },
      {
        id: "s3-response",
        type: "Response Time Options",
        title: "Response Time Options",
        content: {
          items: [
            { description: "Priority 1 (Emergency - Life/Safety)", amount: "4 Hours" },
            { description: "Priority 2 (Urgent - Operational Impact)", amount: "24 Hours" },
            { description: "Priority 3 (Routine - No Impact)", amount: "72 Hours" }
          ]
        }
      },
      {
        id: "s3-structure",
        type: "Monthly Service Structure",
        title: "Monthly Service Structure",
        required: true,
        content: {
          items: [
            { description: "Base PM Contract (14 Locations)", amount: "$12,600 / mo" },
            { description: "Dedicated Account Manager", amount: "Included" },
            { description: "Software Portal Access", amount: "Included" },
            { description: "On-Call Blended Hourly Rate", amount: "$95 / hr" }
          ],
          total: "$12,600 Base / month"
        }
      },
      {
        id: "s3-reporting",
        type: "Reporting Cadence",
        title: "Reporting Cadence",
        content: "Monthly consolidated invoicing. Quarterly SLA review meetings. Real-time work order status via Northline Client Portal."
      },
      {
        id: "s3-assumptions",
        type: "Assumptions & Exclusions",
        title: "Assumptions & Exclusions",
        content: [
          "Assumes standard business hours for PM work unless specified.",
          "Excludes capital replacements (quoted separately).",
          "Excludes acts of vandalism, natural disasters, or tenant negligence."
        ]
      },
      {
        id: "s3-next",
        type: "Next Steps",
        title: "Next Steps",
        content: "Upon approval, Northline requires a 30-day onboarding period to catalog assets across all 14 locations before assuming full maintenance responsibilities."
      }
    ]
  }
];
