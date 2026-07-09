import type { LocationEntry } from "@/lib/org-profile";

export type LocationRegionGroup = {
  region: string;
  locations: LocationEntry[];
};

/** Group locations by parentRegion (preferred) or region. */
export function groupLocationsByRegion(locations: LocationEntry[]): LocationRegionGroup[] {
  const map = new Map<string, LocationEntry[]>();
  for (const loc of locations) {
    const key = (loc.parentRegion?.trim() || loc.region?.trim() || "Unassigned").trim();
    const bucket = map.get(key) ?? [];
    bucket.push(loc);
    map.set(key, bucket);
  }
  return [...map.entries()]
    .map(([region, locs]) => ({
      region,
      locations: locs.sort((a, b) => {
        if (a.isPrimary && !b.isPrimary) return -1;
        if (!a.isPrimary && b.isPrimary) return 1;
        return a.name.localeCompare(b.name);
      }),
    }))
    .sort((a, b) => a.region.localeCompare(b.region));
}

export function uniqueLocationRegions(locations: LocationEntry[]): string[] {
  const set = new Set<string>();
  for (const loc of locations) {
    const key = loc.parentRegion?.trim() || loc.region?.trim();
    if (key) set.add(key);
  }
  return [...set].sort();
}

export function filterLocationsByRegion(
  locations: LocationEntry[],
  regionFilter: string | null,
): LocationEntry[] {
  if (!regionFilter || regionFilter === "all") return locations;
  return locations.filter((loc) => {
    const key = loc.parentRegion?.trim() || loc.region?.trim() || "Unassigned";
    return key === regionFilter;
  });
}
