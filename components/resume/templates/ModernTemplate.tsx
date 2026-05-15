import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { GeneratedResume } from "@/services/resume/generator";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, padding: 40, color: "#111827" },
  header: { marginBottom: 20 },
  name: { fontSize: 22, fontWeight: "bold", color: "#1e40af" },
  contact: { fontSize: 9, color: "#6b7280", marginTop: 4, flexDirection: "row", gap: 12 },
  section: { marginTop: 14 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#1e40af",
    borderBottom: "1pt solid #dbeafe",
    paddingBottom: 3,
    marginBottom: 8,
  },
  expHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  jobTitle: { fontSize: 10, fontWeight: "bold" },
  company: { fontSize: 9, color: "#374151" },
  date: { fontSize: 9, color: "#6b7280" },
  bullet: { fontSize: 9, marginLeft: 10, marginBottom: 2, color: "#374151" },
  skills: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  skill: {
    fontSize: 8,
    backgroundColor: "#eff6ff",
    color: "#1e40af",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  summary: { fontSize: 9.5, color: "#374151", lineHeight: 1.5 },
});

export function ModernResumePDF({ resume }: { resume: GeneratedResume }) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{resume.name}</Text>
          <View style={styles.contact}>
            <Text>{resume.email}</Text>
            {resume.phone && <Text>{resume.phone}</Text>}
            {resume.location && <Text>{resume.location}</Text>}
          </View>
        </View>

        {/* Summary */}
        {resume.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summary}>{resume.summary}</Text>
          </View>
        )}

        {/* Skills */}
        {resume.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skills}>
              {resume.skills.map((s, i) => (
                <Text key={i} style={styles.skill}>
                  {s}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Experience */}
        {resume.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {resume.experience.map((exp, i) => (
              <View key={i} style={{ marginBottom: 10 }}>
                <View style={styles.expHeader}>
                  <Text style={styles.jobTitle}>{exp.title}</Text>
                  <Text style={styles.date}>
                    {exp.startDate} – {exp.current ? "Present" : (exp.endDate ?? "")}
                  </Text>
                </View>
                <Text style={styles.company}>{exp.company}</Text>
                {exp.bullets.map((b, j) => (
                  <Text key={j} style={styles.bullet}>
                    • {b}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {resume.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {resume.education.map((edu, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <Text style={styles.jobTitle}>
                  {edu.degree}
                  {edu.field ? ` in ${edu.field}` : ""}
                </Text>
                <View style={styles.expHeader}>
                  <Text style={styles.company}>{edu.institution}</Text>
                  {edu.graduationDate && (
                    <Text style={styles.date}>{edu.graduationDate}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {resume.certifications && resume.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {resume.certifications.map((cert, i) => (
              <View key={i} style={styles.expHeader}>
                <Text style={{ fontSize: 9, fontWeight: "bold" }}>{cert.name}</Text>
                {cert.issuer && (
                  <Text style={{ fontSize: 9, color: "#6b7280" }}>{cert.issuer}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {resume.projects.map((proj, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <Text style={styles.jobTitle}>{proj.name}</Text>
                <Text style={{ fontSize: 9, color: "#374151", marginTop: 2 }}>
                  {proj.description}
                </Text>
                {proj.technologies.length > 0 && (
                  <Text style={{ fontSize: 8, color: "#6b7280", marginTop: 2 }}>
                    {proj.technologies.join(" · ")}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
