import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { GeneratedResume } from "@/services/resume/generator";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, color: "#111827", flexDirection: "row" },
  sidebar: {
    width: "32%",
    backgroundColor: "#1e2a4a",
    padding: 24,
    color: "#f1f5f9",
  },
  sidebarName: { fontSize: 14, fontWeight: "bold", color: "#ffffff", marginBottom: 4 },
  sidebarSection: { marginTop: 16 },
  sidebarTitle: {
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: "#94a3b8",
    marginBottom: 6,
    borderBottom: "0.5pt solid #334155",
    paddingBottom: 3,
  },
  sidebarText: { fontSize: 8.5, color: "#cbd5e1", marginBottom: 3, lineHeight: 1.4 },
  skill: {
    fontSize: 7.5,
    color: "#e2e8f0",
    backgroundColor: "#334155",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    marginBottom: 3,
  },
  main: { flex: 1, padding: 28 },
  mainHeader: { marginBottom: 16 },
  mainTitle: { fontSize: 9, color: "#64748b", letterSpacing: 0.5, marginBottom: 6 },
  section: { marginBottom: 14 },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#1e2a4a",
    borderBottom: "1.5pt solid #1e2a4a",
    paddingBottom: 3,
    marginBottom: 7,
  },
  expHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  jobTitle: { fontSize: 10, fontWeight: "bold", color: "#1e293b" },
  company: { fontSize: 9, color: "#475569", fontStyle: "italic" },
  date: { fontSize: 8.5, color: "#64748b" },
  bullet: { fontSize: 8.5, marginLeft: 8, marginBottom: 2, color: "#374151" },
  summary: { fontSize: 9, color: "#374151", lineHeight: 1.5 },
});

export function CorporateResumePDF({ resume }: { resume: GeneratedResume }) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <Text style={styles.sidebarName}>{resume.name}</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
            {resume.email && <Text style={styles.sidebarText}>{resume.email}</Text>}
            {resume.phone && <Text style={styles.sidebarText}>{resume.phone}</Text>}
            {resume.location && <Text style={styles.sidebarText}>{resume.location}</Text>}
          </View>

          {resume.skills.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Skills</Text>
              {resume.skills.map((s, i) => (
                <Text key={i} style={styles.skill}>{s}</Text>
              ))}
            </View>
          )}

          {resume.education.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Education</Text>
              {resume.education.map((edu, i) => (
                <View key={i} style={{ marginBottom: 6 }}>
                  <Text style={{ ...styles.sidebarText, fontWeight: "bold", color: "#e2e8f0" }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                  </Text>
                  <Text style={styles.sidebarText}>{edu.institution}</Text>
                  {edu.graduationDate && (
                    <Text style={{ ...styles.sidebarText, color: "#94a3b8" }}>
                      {edu.graduationDate}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {resume.certifications && resume.certifications.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Certifications</Text>
              {resume.certifications.map((cert, i) => (
                <Text key={i} style={styles.sidebarText}>• {cert.name}</Text>
              ))}
            </View>
          )}
        </View>

        {/* Main content */}
        <View style={styles.main}>
          {resume.summary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Summary</Text>
              <Text style={styles.summary}>{resume.summary}</Text>
            </View>
          )}

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
                    <Text key={j} style={styles.bullet}>• {b}</Text>
                  ))}
                </View>
              ))}
            </View>
          )}

          {resume.projects && resume.projects.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Projects</Text>
              {resume.projects.map((proj, i) => (
                <View key={i} style={{ marginBottom: 8 }}>
                  <Text style={styles.jobTitle}>{proj.name}</Text>
                  <Text style={{ ...styles.bullet, marginLeft: 0 }}>{proj.description}</Text>
                  {proj.technologies.length > 0 && (
                    <Text style={{ fontSize: 8, color: "#94a3b8", marginTop: 2 }}>
                      {proj.technologies.join(" · ")}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
