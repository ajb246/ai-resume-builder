import type { GeneratedResume } from "@/services/resume/generator";

export function ModernTemplatePreview({ resume }: { resume: GeneratedResume }) {
  return (
    <div className="bg-white text-gray-900 font-sans text-[10px] leading-relaxed p-8 min-h-full">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-[22px] font-bold text-blue-800">{resume.name}</h1>
        <div className="flex flex-wrap gap-3 mt-1 text-[9px] text-gray-500">
          <span>{resume.email}</span>
          {resume.phone && <span>{resume.phone}</span>}
          {resume.location && <span>{resume.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <div className="mb-4">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-800 border-b border-blue-100 pb-1 mb-2">
            Professional Summary
          </div>
          <p className="text-[9.5px] text-gray-700 leading-relaxed">{resume.summary}</p>
        </div>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <div className="mb-4">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-800 border-b border-blue-100 pb-1 mb-2">
            Skills
          </div>
          <div className="flex flex-wrap gap-1">
            {resume.skills.map((s) => (
              <span
                key={s}
                className="text-[8px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {resume.experience.length > 0 && (
        <div className="mb-4">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-800 border-b border-blue-100 pb-1 mb-2">
            Experience
          </div>
          {resume.experience.map((exp, i) => (
            <div key={i} className="mb-3">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold">{exp.title}</span>
                <span className="text-[9px] text-gray-500 ml-2 flex-shrink-0">
                  {exp.startDate} – {exp.current ? "Present" : (exp.endDate ?? "")}
                </span>
              </div>
              <div className="text-[9px] text-gray-600">{exp.company}</div>
              <ul className="mt-1">
                {exp.bullets.map((b, j) => (
                  <li key={j} className="text-[9px] text-gray-700 ml-3 mb-0.5">
                    • {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-4">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-800 border-b border-blue-100 pb-1 mb-2">
            Education
          </div>
          {resume.education.map((edu, i) => (
            <div key={i} className="mb-2">
              <div className="text-[10px] font-bold">
                {edu.degree}
                {edu.field ? ` in ${edu.field}` : ""}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-gray-600">{edu.institution}</span>
                {edu.graduationDate && (
                  <span className="text-[9px] text-gray-500">{edu.graduationDate}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <div className="mb-4">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-800 border-b border-blue-100 pb-1 mb-2">
            Certifications
          </div>
          {resume.certifications.map((cert, i) => (
            <div key={i} className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-semibold">{cert.name}</span>
              {cert.issuer && <span className="text-[9px] text-gray-500">{cert.issuer}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <div className="mb-4">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-800 border-b border-blue-100 pb-1 mb-2">
            Projects
          </div>
          {resume.projects.map((proj, i) => (
            <div key={i} className="mb-3">
              <div className="text-[10px] font-bold">{proj.name}</div>
              <div className="text-[9px] text-gray-700 mt-0.5">{proj.description}</div>
              {proj.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {proj.technologies.map((t) => (
                    <span key={t} className="text-[8px] border border-blue-200 text-blue-700 px-1 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
