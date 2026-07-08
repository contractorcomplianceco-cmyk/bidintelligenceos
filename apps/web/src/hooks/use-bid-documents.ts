import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiUrl } from "@/lib/api-config";
import { getApiAuthHeaders } from "@/lib/api-auth";

export type BidDocument = {
  id: string;
  bidId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  extractionStatus: string;
  hasText: boolean;
  aiGenerated: boolean;
  humanReviewed: boolean;
  createdAt: string;
};

export function useBidDocuments(bidId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["bid-documents", bidId],
    enabled: enabled && !!bidId,
    queryFn: async () => {
      const authHeaders = await getApiAuthHeaders();
      const res = await fetch(apiUrl(`/api/v1/bids/${bidId}/documents`), {
        credentials: "include",
        headers: authHeaders,
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Failed to load documents");
      return body as { documents: BidDocument[] };
    },
  });
}

export function useUploadBidDocuments() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ bidId, files }: { bidId: string; files: FileList | File[] }) => {
      const form = new FormData();
      const list = Array.from(files);
      list.forEach((f) => form.append("files", f));
      const authHeaders = await getApiAuthHeaders();
      const res = await fetch(apiUrl(`/api/v1/bids/${bidId}/documents`), {
        method: "POST",
        credentials: "include",
        headers: authHeaders,
        body: form,
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Upload failed");
      return body as { documents: { id: string; fileName: string; extractionStatus: string; note: string }[] };
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["bid-documents", vars.bidId] });
    },
  });
}
