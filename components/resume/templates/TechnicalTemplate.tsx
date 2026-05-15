import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { GeneratedResume } from "@/services/resume/generator";

const MONO = "Courier";

const styles = StyleSheet.create({
  page: { fontFamily: MONO, fontSize: 9, padding: 36, color: "#1a1a2e" },
  header: { borderBottom: "2pt solid #0f172a", paddingBottom: 10, marginBottom: 14 },
  name: { fontSize: 18, fontWeight: "bold", fontFamily: "Helvetica", color: "#0f172a" },
  tagline: { fontSize: 8, color: "#64748b", marginTop: 3, fontFamily: MONO },
  contact: { flexDirection: "row", gap: 16, marginTop: 5, fontSize: 8, color: "#475569" },
  section: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#0f172a",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 7,
    borderLeft: "3pt solid #3b82f6",
  },
  expHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  jobTitle: { fontSize: 9.5, fontWeight: "bold", fontFamily: "Helvetica" },
  company: { fontSize: 8.5, color: "#3b82f6" },
  date: { fontSize: 8, color: "#64748b" },
  bullet: { fontSize: 8.5, marginLeft: 10, marginBottom: 2 },
  skillGroup: { flexDirection: "row", marginBottom: 4, flexWrap: "wrap" },
  skillLabel: { fontSize: 8, color: "#64748b", width: 80 },
  skillBadge: {
    fontSize: 7.5,
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
    marginRight: 3,
    marginBottom: 2,
  },
  codeComment: { fontSize: 8, color: "#94a3b8" },
});

export function TechnicalResumePDF({ resume }: { resume: GeneratedResume }) {
  // Group skills loosely
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
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{resume.name}</Text>
          <Text style={styles.tagline}>// Software Engineer</Text>
          <View style={styles.contact}>
            <Text>{resume.email}</Text>
            {resume.phone && <Text>{resume.phone}</Text>}
            {resume.location && <Text>{resume.location}</Text>}
          </View>
        </View>

        {/* Summary */}
        {resume.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>$ whoami</Text>
            <Text style={{ fontSize: 9, color: "#374151", lineHeight: 1.5 }}>{resume.summary}</Text>
          </View>
        )}

        {/* Skills */}
        {skillGroups.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>$ tech_stack --list</Text>
            {skillGroups.map((group) => (
              <View key={group.label} style={styles.skillGroup}>
                <Text style={styles.skillLabel}>{group.label}:</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {group.skills.map((s, i) => (
                    <Text key={i} style={styles.skillBadge}>{s}</Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Experience */}
        {resume.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>$ git log --work</Text>
            {resume.experience.map((exp, i) => (
              <View key={i} style={{ marginBottom: 10 }}>
                <View style={styles.expHeader}>
                  <Text style={styles.jobTitle}>{exp.title}</Text>
                  <Text style={styles.date}>
                    {exp.startDate} – {exp.current ? "Present" : (exp.endDate ?? "")}
                  </Text>
                </View>
                <Text style={styles.company}>@ {exp.company}</Text>
                {exp.bullets.map((b, j) => (
                  <Text key={j} style={styles.bullet}>▸ {b}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>$ ls ~/projects</Text>
            {resume.projects.map((proj, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <Text style={{ ...styles.jobTitle, fontSize: 9 }}>{proj.name}</Text>
                <Text style={{ fontSize: 8.5, color: "#374151", marginTop: 2 }}>
                  {proj.description}
                </Text>
                {proj.technologies.length > 0 && (
                  <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 2 }}>
                    {proj.technologies.map((t, j) => (
                      <Text key={j} style={styles.skillBadge}>{t}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {resume.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>$ cat education.md</Text>
            {resume.education.map((edu, i) => (
              <View key={i} style={{ marginBottom: 4 }}>
                <View style={styles.expHeader}>
                  <Text style={{ fontSize: 9, fontWeight: "bold" }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                  </Text>
                  {edu.graduationDate && (
                    <Text style={styles.date}>{edu.graduationDate}</Text>
                  )}
                </View>
                <Text style={styles.company}>{edu.institution}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
