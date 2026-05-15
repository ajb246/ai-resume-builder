import type { RawJob } from "@/types/job";

const BASE = "https://api.adzuna.com/v1/api/jobs";

interface AdzunaJob {
  id: string;
  title: string;
  company: { display_name: string };
  location: { display_name: string };
  salary_min?: number;
  salary_max?: number;
  description: string;
  redirect_url: string;
}

interface AdzunaResponse {
  results: AdzunaJob[];
}

export async function searchAdzuna(
  query: string,
  country = "us",
  resultsPerPage = 20,
  where?: string
): Promise<RawJob[]> {
  const params = new URLSearchParams({
    app_id: process.env.ADZUNA_APP_ID ?? "",
    app_key: process.env.ADZUNA_API_KEY ?? "",
    results_per_page: String(resultsPerPage),
    what: query,
  });
  if (where) params.set("where", where);

  const res = await fetch(`${BASE}/${country}/search/1?${params}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 1800 },
  });

  if (!res.ok) throw new Error(`Adzuna error: ${res.status}`);

  const data = (await res.json()) as AdzunaResponse;
  return data.results.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company.display_name,
    location: job.location.display_name,
    ...(job.salary_min && job.salary_max
      ? { salary: `$${Math.round(job.salary_min / 1000)}k–$${Math.round(job.salary_max / 1000)}k` }
      : {}),
    description: job.description,
    applyUrl: job.redirect_url,
    source: "adzuna" as const,
  }));
}
