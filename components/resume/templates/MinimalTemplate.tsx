import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { GeneratedResume } from "@/services/resume/generator";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, padding: 48, color: "#1a1a1a" },
  name: { fontSize: 20, fontWeight: "bold", marginBottom: 4 },
  contact: { fontSize: 9, color: "#555", flexDirection: "row", gap: 14 },
  divider: { borderBottom: "0.5pt solid #ccc", marginTop: 12, marginBottom: 12 },
  section: { marginBottom: 14 },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: "#555",
    marginBottom: 6,
  },
  expHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
  jobTitle: { fontSize: 10, fontWeight: "bold" },
  company: { fontSize: 9, color: "#444", marginBottom: 4 },
  date: { fontSize: 9, color: "#888" },
  bullet: { fontSize: 9, marginLeft: 10, marginBottom: 2, color: "#333" },
  skills: { fontSize: 9, color: "#333", lineHeight: 1.6 },
  summary: { fontSize: 9.5, color: "#333", lineHeight: 1.6 },
  tag: { fontSize: 8, color: "#555", borderRadius: 2 },
});

export function MinimalResumePDF({ resume }: { resume: GeneratedResume }) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <Text style={styles.name}>{resume.name}</Text>
        <View style={styles.contact}>
          <Text>{resume.email}</Text>
          {resume.phone && <Text>{resume.phone}</Text>}
          {resume.location && <Text>{resume.location}</Text>}
        </View>
        <View style={styles.divider} />

        {/* Summary */}
        {resume.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.summary}>{resume.summary}</Text>
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
                    – {b}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {resume.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.skills}>{resume.skills.join("   ·   ")}</Text>
          </View>
        )}

        {/* Education */}
        {resume.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {resume.education.map((edu, i) => (
              <View key={i} style={{ marginBottom: 4 }}>
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
              <Text key={i} style={{ fontSize: 9, marginBottom: 3 }}>
                {cert.name}
                {cert.issuer ? ` — ${cert.issuer}` : ""}
              </Text>
            ))}
          </View>
        )}

        {/* Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {resume.projects.map((proj, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <Text style={styles.jobTitle}>{proj.name}</Text>
                <Text style={{ fontSize: 9, color: "#333", marginTop: 2 }}>
                  {proj.description}
                </Text>
                {proj.technologies.length > 0 && (
                  <Text style={{ fontSize: 8, color: "#888", marginTop: 2 }}>
                    {proj.technologies.join(", ")}
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
