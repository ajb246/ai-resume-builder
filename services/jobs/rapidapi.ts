import type { RawJob } from "@/types/job";

interface RapidAPIJob {
  job_id: string;
  job_title: string;
  employer_name: string;
  job_city?: string;
  job_country?: string;
  job_min_salary?: number;
  job_max_salary?: number;
  job_description: string;
  job_apply_link: string;
}

interface RapidAPIResponse {
  data?: RapidAPIJob[];
}

export async function searchRapidAPI(query: string): Promise<RawJob[]> {
  const res = await fetch(
    `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&num_pages=2`,
    {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY ?? "",
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
      next: { revalidate: 1800 },
    }
  );

  if (!res.ok) throw new Error(`RapidAPI error: ${res.status}`);
  const data = (await res.json()) as RapidAPIResponse;

  return (data.data ?? []).map((job) => {
    const locationParts = [job.job_city, job.job_country].filter(Boolean);
    return {
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      location: locationParts.join(", "),
      ...(job.job_min_salary && job.job_max_salary
        ? {
            salary: `$${Math.round(job.job_min_salary / 1000)}k–$${Math.round(job.job_max_salary / 1000)}k`,
          }
        : {}),
      description: job.job_description,
      applyUrl: job.job_apply_link,
      source: "rapidapi" as const,
    };
  });
}
