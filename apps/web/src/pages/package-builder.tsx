import { useState, useMemo } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { useLiveData } from "@/lib/data-mode";
import { useOpsPackageBuilder, type LivePackage } from "@/hooks/use-ops";
import { DemoDataBadge } from "@/components/demo-data-badge";
import { OpsModuleEmpty } from "@/components/ops-module-empty";
import { FileText, Download, Check, AlertTriangle, FileCheck, CheckSquare, Settings2, ShieldCheck, ShieldAlert, ChevronRight, DownloadCloud, Eye } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { samplePackages, BidPackageData, SectionType } from "@core/bid-packages";
import { Checkbox } from "@/components/ui/checkbox";

function LivePackageView({ packages }: { packages: LivePackage[] }) {
  const [selectedId, setSelectedId] = useState(packages[0]?.id ?? "");
  const pkg = packages.find((p) => p.id === selectedId) ?? packages[0]!;

  const formatSize = (bytes: number) =>
    bytes >= 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)} MB` : `${Math.round(bytes / 1000)} KB`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Bid Package Builder</h2>
          <p className="text-slate-500 mt-1">
            Live packages from active bids — documents and jurisdiction compliance checklist.
          </p>
        </div>
        {packages.length > 1 && (
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger className="w-full sm:w-72 bg-white border-[#E2E8F0]">
              <SelectValue placeholder="Select package" />
            </SelectTrigger>
            <SelectContent>
              {packages.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.project}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 space-y-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{pkg.name}</h3>
            <p className="text-sm text-slate-500">
              {pkg.project} · {pkg.location || "Location TBD"} · {pkg.documentCount} documents
            </p>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#0284C7] bg-sky-50 px-2 py-1 rounded">
            {pkg.verdict} · {pkg.humanReviewed ? "Reviewed" : "Pending review"}
          </span>
        </div>

        {pkg.documents.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-2">Uploaded Bid Documents</h4>
            <ul className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-lg overflow-hidden">
              {pkg.documents.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm bg-white">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-[#0284C7] shrink-0" />
                    <span className="truncate text-slate-900">{doc.fileName}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-[11px] text-slate-500">
                    <span>{formatSize(doc.sizeBytes)}</span>
                    <span className={doc.extractionStatus === "done" ? "text-[#22C55E]" : "text-[#F59E0B]"}>
                      {doc.extractionStatus}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {pkg.complianceItems.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-2">Compliance Checklist</h4>
            <ul className="space-y-2">
              {pkg.complianceItems.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between text-sm border border-[#E2E8F0] rounded-lg px-3 py-2"
                >
                  <span>{item.label}</span>
                  <span className={item.status === "pass" ? "text-[#22C55E]" : "text-[#F59E0B]"}>
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-[11px] text-slate-500 italic">
          Full section preview remains in demo mode. Live export uses uploaded bid documents and scored
          compliance from jurisdiction research and Go/No-Go gates.
        </p>
      </div>
    </div>
  );
}

export default function PackageBuilder() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const live = useLiveData(isAuthenticated);
  const { data: livePackages = [] } = useOpsPackageBuilder();
  const [reviewed, setReviewed] = useState(false);
  const [selectedPkgId, setSelectedPkgId] = useState<string>(samplePackages[0].id);
  const [activeTab, setActiveTab] = useState<string>(samplePackages[0].sections[0]?.id ?? "");
  const [enabledSections, setEnabledSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    samplePackages.forEach((pkg) => {
      pkg.sections.forEach((s) => {
        initial[`${pkg.id}-${s.id}`] = true;
      });
    });
    return initial;
  });

  const selectedPkg = useMemo(
    () => samplePackages.find((p) => p.id === selectedPkgId) || samplePackages[0],
    [selectedPkgId],
  );

  if (live && livePackages.length === 0) {
    return (
      <Layout>
        <div className="space-y-6 max-w-[1600px] mx-auto p-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Bid Package Builder</h2>
            <p className="text-slate-500 mt-1">Aggregate bid documents and compliance checklists from your pipeline.</p>
          </div>
          <OpsModuleEmpty
            module="No active bids to package"
            description="Intake bids and upload documents to build client-facing packages from live data."
          />
        </div>
      </Layout>
    );
  }

  if (live && livePackages.length > 0) {
    return (
      <Layout>
        <div className="max-w-[1600px] mx-auto p-6">
          <LivePackageView packages={livePackages} />
        </div>
      </Layout>
    );
  }

  const handleToggleSection = (sectionId: string, enabled: boolean) => {
    setEnabledSections(prev => ({
      ...prev,
      [`${selectedPkg.id}-${sectionId}`]: enabled
    }));
    if (!enabled && sectionId === activeTab) {
      const fallback = selectedPkg.sections.find(
        s => s.id !== sectionId && enabledSections[`${selectedPkg.id}-${s.id}`] !== false,
      );
      if (fallback) setActiveTab(fallback.id);
    }
  };

  const handleExport = (format: string) => {
    toast({
      title: `Exporting ${format}`,
      description: "Compiling final vendor-facing document...",
    });
  };

  const activeSections = selectedPkg.sections.filter(s => enabledSections[`${selectedPkg.id}-${s.id}`] !== false);

  const missingRequired = selectedPkg.sections.some(s => s.required && enabledSections[`${selectedPkg.id}-${s.id}`] === false);

  const activeSection = activeSections.find(s => s.id === activeTab) ?? activeSections[0];

  const handleSelectPackage = (id: string) => {
    setSelectedPkgId(id);
    const next = samplePackages.find(p => p.id === id) ?? samplePackages[0];
    setActiveTab(next.sections[0]?.id ?? "");
  };

  const renderSectionContent = (section: any) => {
    if (!section) return null;
    if (section.type === "Cover") {
      return (
        <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-8 bg-slate-900 text-white rounded-lg p-12 border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-teal-500"></div>
          <div className="space-y-4 z-10">
            <h1 className="text-4xl font-bold tracking-tight text-white">{section.content.title}</h1>
            <p className="text-xl text-slate-300">{section.content.subtitle}</p>
          </div>
          <div className="z-10 mt-16 pt-16 border-t border-slate-800 w-full max-w-md">
            <p className="text-slate-400 font-medium">Prepared by</p>
            <p className="text-2xl font-semibold mt-2">{selectedPkg.contractor}</p>
            <p className="text-slate-400 mt-2">Date: {selectedPkg.date}</p>
          </div>
        </div>
      );
    }

    if (Array.isArray(section.content)) {
      return (
        <ul className="space-y-3">
          {section.content.map((item: any, i: number) => (
            <li key={i} className="flex gap-3 text-slate-700">
              <span className="text-teal-600 font-bold mt-0.5">•</span>
              {typeof item === 'string' ? item : (
                <div className="flex justify-between w-full border-b border-slate-100 pb-2">
                  <span className="font-medium">{item.phase || item.description}</span>
                  <span className="text-slate-500">{item.duration || item.amount}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      );
    }

    if (section.type === "Pricing Summary" || section.type === "Optional Alternates" || section.type === "Response Time Options" || section.type === "Monthly Service Structure") {
      return (
        <div className="border border-slate-200 rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-200">
              {(section.content.items ?? []).map((item: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-700">{item.description}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">{item.amount}</td>
                </tr>
              ))}
            </tbody>
            {section.content.total && (
              <tfoot className="bg-slate-50">
                <tr>
                  <td className="px-4 py-4 font-bold text-slate-900">Total Estimated Cost</td>
                  <td className="px-4 py-4 text-right font-bold text-teal-700 text-lg">{section.content.total}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      );
    }

    if (section.type === "Service Matrix") {
      return (
        <div className="border border-slate-200 rounded-md overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {(section.content.headers ?? []).map((h: string, i: number) => (
                  <th key={i} className={`px-4 py-3 text-slate-700 font-medium ${i > 0 ? 'text-center' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(section.content.rows ?? []).map((row: any[], i: number) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-900 font-medium">{row[0]}</td>
                  <td className="px-4 py-3 text-center">{row[1] ? <Check className="w-5 h-5 mx-auto text-teal-600" /> : <span className="text-slate-300">-</span>}</td>
                  <td className="px-4 py-3 text-center">{row[2] ? <Check className="w-5 h-5 mx-auto text-teal-600" /> : <span className="text-slate-300">-</span>}</td>
                  <td className="px-4 py-3 text-center">{row[3] ? <Check className="w-5 h-5 mx-auto text-teal-600" /> : <span className="text-slate-300">-</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="prose prose-slate max-w-none text-slate-700">
        <p className="leading-relaxed">{section.content}</p>
      </div>
    );
  };

  return (
    <Layout>
      <div className="h-full flex flex-col -m-4 lg:-m-6 bg-[#F8FAFC]">
        
        {/* Top Header */}
        <div className="bg-white border-b border-[#E2E8F0] p-4 lg:px-6 flex justify-between items-center shrink-0 shadow-sm z-10 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-teal-50 flex items-center justify-center border border-teal-200">
              <FileText className="w-5 h-5 text-[#0A8A8F]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 tracking-tight leading-tight">Bid Package Builder</h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0A8A8F]" />
                <span>Client-Facing Document Environment</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 mr-4 bg-slate-100 rounded-full px-3 py-1.5 border border-slate-200">
               <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
               <span className="text-xs font-medium text-slate-600">Draft Saved</span>
            </div>
            <Button 
              variant="outline" 
              className="border-[#E2E8F0] hover:bg-slate-50 text-slate-700 bg-white h-9"
              onClick={() => handleExport("DOCX")}
            >
              <DownloadCloud className="w-4 h-4 mr-2" />
              DOCX
            </Button>
            <Button 
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white h-9"
              onClick={() => handleExport("PDF")}
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <div className="w-px h-6 bg-[#E2E8F0] mx-1"></div>
            <Button 
              variant={reviewed ? "secondary" : "default"} 
              className={reviewed ? "bg-teal-50 text-[#0A8A8F] hover:bg-teal-100 border border-teal-200 h-9" : "bg-white text-slate-700 hover:bg-slate-50 border border-[#E2E8F0] h-9"}
              onClick={() => setReviewed(!reviewed)}
            >
              {reviewed ? <CheckSquare className="w-4 h-4 mr-2" /> : <Check className="w-4 h-4 mr-2" />}
              {reviewed ? "Reviewed" : "Mark Reviewed"}
            </Button>
          </div>
        </div>

        {/* Main Content Split */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT RAIL - BUILDER CONTROLS */}
          <div className="w-[400px] shrink-0 border-r border-[#E2E8F0] bg-white flex flex-col overflow-y-auto">
            
            <div className="p-5 border-b border-[#E2E8F0] space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Select Package Template</Label>
                <Select value={selectedPkgId} onValueChange={handleSelectPackage}>
                  <SelectTrigger className="w-full bg-white border-[#E2E8F0] text-slate-900">
                    <SelectValue placeholder="Select a package..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#E2E8F0]">
                    {samplePackages.map(pkg => (
                      <SelectItem key={pkg.id} value={pkg.id} className="text-slate-700 focus:bg-slate-100 focus:text-slate-900">
                        {pkg.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-5 border-b border-[#E2E8F0] space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-slate-500" />
                Package Metadata
              </h3>
              
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Contractor</Label>
                  <Input readOnly value={selectedPkg.contractor} className="h-8 bg-slate-50 border-[#E2E8F0] text-slate-700" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Recipient</Label>
                  <Input readOnly value={selectedPkg.recipient} className="h-8 bg-slate-50 border-[#E2E8F0] text-slate-700" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Project</Label>
                  <Input readOnly value={selectedPkg.project} className="h-8 bg-slate-50 border-[#E2E8F0] text-slate-700" />
                </div>
              </div>
            </div>

            <div className="p-5 border-b border-[#E2E8F0] flex-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-slate-500" />
                  Included Sections
                </h3>
              </div>
              
              <div className="space-y-1">
                {selectedPkg.sections.map(section => (
                  <div key={section.id} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <Switch 
                        checked={enabledSections[`${selectedPkg.id}-${section.id}`] ?? true}
                        onCheckedChange={(c) => handleToggleSection(section.id, c)}
                        disabled={section.required}
                        className="data-[state=checked]:bg-teal-600"
                      />
                      <Label className={`text-sm cursor-pointer ${enabledSections[`${selectedPkg.id}-${section.id}`] !== false ? 'text-slate-700' : 'text-slate-400 line-through'}`}>
                        {section.title}
                        {section.required && <span className="ml-2 text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Required</span>}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>

              {missingRequired && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700">Required sections are missing. Package may be incomplete.</p>
                </div>
              )}
            </div>

            <div className="p-5 bg-[#F8FAFC]">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0A8A8F]" />
                Compliance Guardrails
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Checkbox checked={true} disabled className="mt-0.5 border-slate-300 bg-white data-[state=checked]:bg-[#2563EB] data-[state=checked]:border-[#2563EB]" />
                  <div className="space-y-0.5">
                    <Label className="text-xs font-medium text-slate-700">Internal Notes Hidden</Label>
                    <p className="text-[10px] text-slate-500 leading-tight">Client-facing package only. Internal strategy, margin logic, bid confidence, and competitor intelligence are excluded.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Checkbox checked={reviewed} onCheckedChange={(c) => setReviewed(c === true)} className="mt-0.5 border-slate-300 bg-white data-[state=checked]:bg-[#2563EB] data-[state=checked]:border-[#2563EB]" />
                  <div className="space-y-0.5">
                    <Label className="text-xs font-medium text-slate-700 cursor-pointer">Pricing summary reviewed</Label>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Checkbox checked={reviewed} onCheckedChange={(c) => setReviewed(c === true)} className="mt-0.5 border-slate-300 bg-white data-[state=checked]:bg-[#2563EB] data-[state=checked]:border-[#2563EB]" />
                  <div className="space-y-0.5">
                    <Label className="text-xs font-medium text-slate-700 cursor-pointer">Ready for contractor approval</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT RAIL - PREVIEW */}
          <div className="flex-1 bg-[#F1F5F9] flex flex-col relative overflow-hidden p-6 md:p-8">
            
            {/* Background grid effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-60 pointer-events-none"></div>

            <div className="w-full max-w-4xl mx-auto flex flex-col h-full relative z-10">
              
              {/* Custom Tabs to look like binders/dividers */}
              <div className="flex overflow-x-auto no-scrollbar mb-4 gap-1 shrink-0 pb-1">
                {activeSections.map((section, idx) => {
                  const isActive = activeTab === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveTab(section.id)}
                      className={`
                        px-4 py-2 text-sm font-medium rounded-t-md border-b-0 transition-all whitespace-nowrap
                        flex items-center gap-2
                        ${isActive 
                          ? 'bg-white text-slate-900 border-[#E2E8F0] shadow-sm' 
                          : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200 hover:text-slate-700'}
                      `}
                    >
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${isActive ? 'bg-slate-100 text-slate-500' : 'bg-slate-200 text-slate-500'}`}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      {section.title}
                    </button>
                  );
                })}
              </div>

              {/* Document Page */}
              <div className="bg-white rounded-b-lg rounded-tr-lg shadow-2xl flex-1 overflow-y-auto border border-slate-300 flex flex-col">
                <div className="h-2 w-full bg-slate-900 shrink-0"></div>
                
                <div className="flex-1 p-10 md:p-14 bg-white text-slate-900">
                  {/* Header band for non-cover pages */}
                  {activeSection?.type !== "Cover" && (
                    <div className="border-b-2 border-slate-200 pb-6 mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{selectedPkg.contractor}</h2>
                        <p className="text-sm text-slate-500 mt-1 font-medium">{selectedPkg.projectType} Proposal</p>
                      </div>
                      <div className="md:text-right">
                        <p className="font-semibold text-slate-400 uppercase text-xs tracking-wider mb-1">Prepared For</p>
                        <p className="text-sm font-medium text-slate-700">{selectedPkg.recipient}</p>
                      </div>
                    </div>
                  )}

                  {/* Section Content */}
                  <div key={activeSection?.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {activeSection?.type !== "Cover" && (
                      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                        <span className="w-1 h-6 bg-teal-500 rounded-full inline-block"></span>
                        {activeSection?.title}
                      </h3>
                    )}
                    
                    {renderSectionContent(activeSection)}
                  </div>
                </div>

                {/* Footer seal */}
                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                   <div className="text-xs text-slate-400 font-medium">Page {Math.max(0, activeSections.findIndex(s => s.id === activeSection?.id)) + 1} of {activeSections.length}</div>
                   <div className="flex items-center gap-2 opacity-50">
                     <span className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">Generated with CCA BidIntelligenceOS</span>
                   </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
