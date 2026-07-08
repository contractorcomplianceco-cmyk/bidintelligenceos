import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Loader2, FileText, Lock } from "lucide-react";
import { useBidDocuments, useUploadBidDocuments } from "@/hooks/use-bid-documents";
import { useToast } from "@/hooks/use-toast";

type Props = {
  bidId: string | null;
  live: boolean;
};

export function BidDocumentsPanel({ bidId, live }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { data, isLoading } = useBidDocuments(bidId ?? undefined, live && !!bidId);
  const upload = useUploadBidDocuments();
  const [dragging, setDragging] = useState(false);

  const onFiles = async (files: FileList | null) => {
    if (!files?.length || !bidId || !live) return;
    try {
      const result = await upload.mutateAsync({ bidId, files });
      toast({
        title: "Documents uploaded",
        description: `${result.documents.length} file(s) stored — AI extraction complete, human review required.`,
      });
    } catch (e) {
      toast({
        title: "Upload failed",
        description: e instanceof Error ? e.message : "Could not upload",
        variant: "destructive",
      });
    }
  };

  if (!live) {
    return (
      <Card className="border-dashed border-[#CBD5E1]">
        <CardContent className="py-6 text-sm text-slate-500 text-center">
          Sign in to upload specification documents to a saved bid.
        </CardContent>
      </Card>
    );
  }

  if (!bidId) {
    return (
      <Card className="border-dashed border-[#CBD5E1]">
        <CardContent className="py-6 text-sm text-slate-500 text-center">
          Save the bid draft first, then upload PDF / TXT / DOCX specifications.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#E2E8F0] shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="w-4 h-4 text-teal-600" />
          Specification Documents
        </CardTitle>
        <CardDescription>
          Powered by AI text extraction · Reviewed by humans before client use
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.txt,.md,.doc,.docx,application/pdf,text/plain"
          className="hidden"
          onChange={(e) => void onFiles(e.target.files)}
        />
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            void onFiles(e.dataTransfer.files);
          }}
          className={`p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
            dragging ? "border-teal-500 bg-teal-50" : "border-[#CBD5E1] bg-[#F8FAFC] hover:bg-slate-100"
          }`}
        >
          {upload.isPending ? (
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin mb-2" />
          ) : (
            <Upload className="w-8 h-8 text-slate-500 mb-2" />
          )}
          <p className="text-sm font-medium text-slate-700">Drop files or click to upload</p>
          <p className="text-xs text-slate-500 mt-1">PDF, TXT, DOCX — up to 15MB each</p>
        </div>

        {isLoading ? (
          <p className="text-sm text-slate-500 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading documents…
          </p>
        ) : (
          <ul className="space-y-2">
            {(data?.documents ?? []).map((doc) => (
              <li
                key={doc.id}
                className="flex items-center justify-between gap-2 p-3 rounded-lg border border-[#E2E8F0] text-sm"
              >
                <span className="font-medium text-slate-800 truncate">{doc.fileName}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="text-xs">
                    {doc.extractionStatus}
                  </Badge>
                  {!doc.humanReviewed && (
                    <Badge variant="outline" className="text-xs text-amber-800 border-amber-300 gap-1">
                      <Lock className="w-3 h-3" /> Review
                    </Badge>
                  )}
                </div>
              </li>
            ))}
            {(data?.documents?.length ?? 0) === 0 && (
              <p className="text-xs text-slate-500">No documents yet — upload specs before scope analysis for richer ROSEOS briefs.</p>
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
