import type { GeneratedResume } from "@/services/resume/generator";

export function MinimalTemplatePreview({ resume }: { resume: GeneratedResume }) {
  return (
    <div className="bg-white text-gray-900 font-sans text-[10px] leading-relaxed p-10 min-h-full">
      {/* Header */}
      <h1 className="text-[20px] font-bold mb-1">{resume.name}</h1>
      <div className="flex flex-wrap gap-4 text-[9px] text-gray-500 mb-3">
        <span>{resume.email}</span>
        {resume.phone && <span>{resume.phone}</span>}
        {resume.location && <span>{resume.location}</span>}
      </div>
      <hr className="border-gray-300 mb-4" />

      {/* Summary */}
      {resume.summary && (
        <div className="mb-4">
          <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">
            Summary
          </div>
          <p className="text-[9.5px] text-gray-700 leading-relaxed">{resume.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resume.experience.length > 0 && (
        <div className="mb-4">
          <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">
            Experience
          </div>
          {resume.experience.map((exp, i) => (
            <div key={i} className="mb-4">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold">{exp.title}</span>
                <span className="text-[9px] text-gray-400 flex-shrink-0 ml-2">
                  {exp.startDate} – {exp.current ? "Present" : (exp.endDate ?? "")}
                </span>
              </div>
              <div className="text-[9px] text-gray-500 mb-1.5">{exp.company}</div>
              <ul>
                {exp.bullets.map((b, j) => (
                  <li key={j} className="text-[9px] text-gray-700 ml-3 mb-0.5">
                    – {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <div className="mb-4">
          <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">
            Skills
          </div>
          <p className="text-[9px] text-gray-700">{resume.skills.join("   ·   ")}</p>
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-4">
          <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">
            Education
          </div>
          {resume.education.map((edu, i) => (
            <div key={i} className="mb-2">
              <div className="text-[10px] font-bold">
                {edu.degree}
                {edu.field ? ` in ${edu.field}` : ""}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-gray-500">{edu.institution}</span>
                {edu.graduationDate && (
                  <span className="text-[9px] text-gray-400">{edu.graduationDate}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <div className="mb-4">
          <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">
            Certifications
          </div>
          {resume.certifications.map((cert, i) => (
            <div key={i} className="text-[9px] mb-1">
              {cert.name}
              {cert.issuer ? ` — ${cert.issuer}` : ""}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <div className="mb-4">
          <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">
            Projects
          </div>
          {resume.projects.map((proj, i) => (
            <div key={i} className="mb-3">
              <div className="text-[10px] font-bold">{proj.name}</div>
              <div className="text-[9px] text-gray-700 mt-0.5">{proj.description}</div>
              {proj.technologies.length > 0 && (
                <div className="text-[8px] text-gray-400 mt-1">
                  {proj.technologies.join(", ")}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
