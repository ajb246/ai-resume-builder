import type { GeneratedResume } from "@/services/resume/generator";

export function TechnicalTemplatePreview({ resume }: { resume: GeneratedResume }) {
  const langKeywords = ["javascript", "typescript", "python", "go", "rust", "java", "c++", "c#", "ruby", "swift", "kotlin"];
  const frameworkKeywords = ["react", "next", "vue", "angular", "node", "express", "django", "rails", "spring", "fastapi"];
  const toolKeywords = ["git", "docker", "kubernetes", "webpack", "vite", "jest", "cypress", "github", "gitlab"];
  const cloudKeywords = ["aws", "gcp", "azure", "vercel", "netlify", "terraform", "linux"];

  const categorize = (keywords: string[]) =>
    resume.skills.filter((s) => keywords.some((k) => s.toLowerCase().includes(k)));
  const other = resume.skills.filter(
    (s) =>
      ![...langKeywords, ...frameworkKeywords, ...toolKeywords, ...cloudKeywords].some((k) =>
        s.toLowerCase().includes(k)
      )
  );

  const skillGroups = [
    { label: "Languages", skills: categorize(langKeywords) },
    { label: "Frameworks", skills: categorize(frameworkKeywords) },
    { label: "Tools", skills: categorize(toolKeywords) },
    { label: "Cloud/Infra", skills: categorize(cloudKeywords) },
    { label: "Other", skills: other },
  ].filter((g) => g.skills.length > 0);

  return (
    <div className="bg-white text-gray-900 font-mono text-[9px] p-8 min-h-full">
      {/* Header */}
      <div className="border-b-2 border-gray-900 pb-4 mb-5">
        <h1 className="text-[18px] font-bold font-sans">{resume.name}</h1>
        <div className="text-[8px] text-gray-400 mt-0.5">// Software Engineer</div>
        <div className="flex flex-wrap gap-4 mt-2 text-[8px] text-gray-500">
          <span>{resume.email}</span>
          {resume.phone && <span>{resume.phone}</span>}
          {resume.location && <span>{resume.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <div className="mb-4">
          <div className="text-[9px] font-bold bg-slate-100 border-l-2 border-blue-500 px-2 py-1 mb-2">
            $ whoami
          </div>
          <p className="text-[8.5px] text-gray-600 leading-relaxed">{resume.summary}</p>
        </div>
      )}

      {/* Skills */}
      {skillGroups.length > 0 && (
        <div className="mb-4">
          <div className="text-[9px] font-bold bg-slate-100 border-l-2 border-blue-500 px-2 py-1 mb-2">
            $ tech_stack --list
          </div>
          <div className="space-y-1.5">
            {skillGroups.map((group) => (
              <div key={group.label} className="flex items-start gap-2">
                <span className="text-[8px] text-gray-400 w-20 flex-shrink-0">{group.label}:</span>
                <div className="flex flex-wrap gap-1">
                  {group.skills.map((s) => (
                    <span
                      key={s}
                      className="text-[7.5px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {resume.experience.length > 0 && (
        <div className="mb-4">
          <div className="text-[9px] font-bold bg-slate-100 border-l-2 border-blue-500 px-2 py-1 mb-2">
            $ git log --work
          </div>
          {resume.experience.map((exp, i) => (
            <div key={i} className="mb-4">
              <div className="flex items-start justify-between">
                <span className="text-[9.5px] font-bold font-sans">{exp.title}</span>
                <span className="text-[8px] text-gray-400 flex-shrink-0 ml-2">
                  {exp.startDate} – {exp.current ? "Present" : (exp.endDate ?? "")}
                </span>
              </div>
              <div className="text-[8.5px] text-blue-600 mb-1">@ {exp.company}</div>
              <ul>
                {exp.bullets.map((b, j) => (
                  <li key={j} className="text-[8.5px] text-gray-700 ml-3 mb-0.5">▸ {b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <div className="mb-4">
          <div className="text-[9px] font-bold bg-slate-100 border-l-2 border-blue-500 px-2 py-1 mb-2">
            $ ls ~/projects
          </div>
          {resume.projects.map((proj, i) => (
            <div key={i} className="mb-3">
              <div className="text-[9px] font-bold font-sans">{proj.name}</div>
              <div className="text-[8.5px] text-gray-600 mt-0.5">{proj.description}</div>
              {proj.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {proj.technologies.map((t) => (
                    <span key={t} className="text-[7.5px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-4">
          <div className="text-[9px] font-bold bg-slate-100 border-l-2 border-blue-500 px-2 py-1 mb-2">
            $ cat education.md
          </div>
          {resume.education.map((edu, i) => (
            <div key={i} className="mb-2">
              <div className="flex items-start justify-between">
                <span className="text-[9px] font-bold font-sans">
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                </span>
                {edu.graduationDate && (
                  <span className="text-[8px] text-gray-400">{edu.graduationDate}</span>
                )}
              </div>
              <div className="text-[8.5px] text-blue-600">{edu.institution}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
