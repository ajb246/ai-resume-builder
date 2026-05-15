import type { GeneratedResume } from "@/services/resume/generator";

export function CorporateTemplatePreview({ resume }: { resume: GeneratedResume }) {
  return (
    <div className="bg-white text-gray-900 font-sans text-[10px] flex min-h-full">
      {/* Sidebar */}
      <div className="w-[32%] bg-[#1e2a4a] text-slate-200 p-6 flex-shrink-0">
        <h1 className="text-[14px] font-bold text-white mb-1">{resume.name}</h1>
        <div className="space-y-0.5 text-[8px] text-slate-400">
          {resume.email && <div>{resume.email}</div>}
          {resume.phone && <div>{resume.phone}</div>}
          {resume.location && <div>{resume.location}</div>}
        </div>

        {resume.skills.length > 0 && (
          <div className="mt-5">
            <div className="text-[7.5px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-600 pb-1 mb-3">
              Skills
            </div>
            <div className="space-y-1.5">
              {resume.skills.map((s) => (
                <div
                  key={s}
                  className="text-[7.5px] bg-slate-700 text-slate-200 px-2 py-1 rounded"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {resume.education.length > 0 && (
          <div className="mt-5">
            <div className="text-[7.5px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-600 pb-1 mb-3">
              Education
            </div>
            {resume.education.map((edu, i) => (
              <div key={i} className="mb-3">
                <div className="text-[8.5px] font-semibold text-slate-200">
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                </div>
                <div className="text-[8px] text-slate-400">{edu.institution}</div>
                {edu.graduationDate && (
                  <div className="text-[7px] text-slate-500">{edu.graduationDate}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {resume.certifications && resume.certifications.length > 0 && (
          <div className="mt-5">
            <div className="text-[7.5px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-600 pb-1 mb-3">
              Certifications
            </div>
            {resume.certifications.map((cert, i) => (
              <div key={i} className="text-[8px] text-slate-300 mb-1">• {cert.name}</div>
            ))}
          </div>
        )}
      </div>

      {/* Main */}
      <div className="flex-1 p-6">
        {resume.summary && (
          <div className="mb-5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#1e2a4a] border-b-2 border-[#1e2a4a] pb-1 mb-2">
              Professional Summary
            </div>
            <p className="text-[9px] text-gray-600 leading-relaxed">{resume.summary}</p>
          </div>
        )}

        {resume.experience.length > 0 && (
          <div className="mb-5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#1e2a4a] border-b-2 border-[#1e2a4a] pb-1 mb-3">
              Experience
            </div>
            {resume.experience.map((exp, i) => (
              <div key={i} className="mb-4">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold">{exp.title}</span>
                  <span className="text-[8px] text-gray-500 flex-shrink-0 ml-2">
                    {exp.startDate} – {exp.current ? "Present" : (exp.endDate ?? "")}
                  </span>
                </div>
                <div className="text-[9px] text-gray-500 italic mb-1">{exp.company}</div>
                <ul>
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="text-[8.5px] text-gray-700 ml-3 mb-0.5">• {b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {resume.projects && resume.projects.length > 0 && (
          <div className="mb-5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#1e2a4a] border-b-2 border-[#1e2a4a] pb-1 mb-2">
              Projects
            </div>
            {resume.projects.map((proj, i) => (
              <div key={i} className="mb-3">
                <div className="text-[10px] font-bold">{proj.name}</div>
                <div className="text-[8.5px] text-gray-600 mt-0.5">{proj.description}</div>
                {proj.technologies.length > 0 && (
                  <div className="text-[8px] text-gray-400 mt-1">
                    {proj.technologies.join(" · ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
