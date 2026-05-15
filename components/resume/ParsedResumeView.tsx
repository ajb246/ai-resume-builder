import type { ParsedResume } from "@/types/resume";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ParsedResumeViewProps {
  parsed: ParsedResume;
}

export function ParsedResumeView({ parsed }: ParsedResumeViewProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">{parsed.name}</h2>
        <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
          <span>{parsed.email}</span>
          {parsed.phone && <span>·  {parsed.phone}</span>}
          {parsed.location && <span>· {parsed.location}</span>}
        </div>
        {parsed.summary && (
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{parsed.summary}</p>
        )}
      </div>

      <Separator />

      {/* Skills */}
      {parsed.skills.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {parsed.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {parsed.experience.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Experience
          </h3>
          <div className="space-y-6">
            {parsed.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{exp.title}</p>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                    {exp.startDate} – {exp.current ? "Present" : (exp.endDate ?? "")}
                  </p>
                </div>
                {exp.bullets.length > 0 && (
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    {exp.bullets.map((bullet, j) => (
                      <li key={j} className="text-sm text-muted-foreground">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {parsed.education.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Education
          </h3>
          <div className="space-y-4">
            {parsed.education.map((edu, i) => (
              <div key={i} className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  {edu.gpa && (
                    <p className="text-xs text-muted-foreground">GPA: {edu.gpa}</p>
                  )}
                </div>
                {edu.graduationDate && (
                  <p className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                    {edu.graduationDate}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {parsed.projects && parsed.projects.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Projects
          </h3>
          <div className="space-y-4">
            {parsed.projects.map((proj, i) => (
              <div key={i}>
                <p className="font-semibold">{proj.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{proj.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {proj.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {parsed.certifications && parsed.certifications.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Certifications
          </h3>
          <div className="space-y-2">
            {parsed.certifications.map((cert, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{cert.name}</p>
                  {cert.issuer && (
                    <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                  )}
                </div>
                {cert.date && (
                  <p className="text-xs text-muted-foreground">{cert.date}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
