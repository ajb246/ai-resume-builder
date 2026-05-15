import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  type IParagraphOptions,
} from "docx";
import type { GeneratedResume } from "@/services/resume/generator";

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "1e40af" },
    },
    spacing: { before: 240, after: 80 },
  });
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: `• ${text}`, size: 20 })],
    spacing: { after: 40 },
    indent: { left: 360 },
  });
}

function twoColumnLine(left: string, right: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: left, bold: true, size: 22 }),
      new TextRun({ text: `\t${right}`, color: "6b7280", size: 20 }),
    ],
    tabStops: [{ type: "right" as const, position: 9360 }],
  });
}

export async function generateDocx(resume: GeneratedResume): Promise<Buffer> {
  const children: Paragraph[] = [];

  // Header
  children.push(
    new Paragraph({
      children: [new TextRun({ text: resume.name, bold: true, size: 36, color: "1e40af" })],
      alignment: AlignmentType.LEFT,
      spacing: { after: 60 },
    })
  );

  const contactParts = [resume.email, resume.phone, resume.location].filter(Boolean);
  children.push(
    new Paragraph({
      children: [new TextRun({ text: contactParts.join("  |  "), size: 18, color: "6b7280" })],
      spacing: { after: 200 },
    })
  );

  // Summary
  if (resume.summary) {
    children.push(sectionHeading("Professional Summary"));
    children.push(
      new Paragraph({
        children: [new TextRun({ text: resume.summary, size: 20 })],
        spacing: { after: 120 },
      })
    );
  }

  // Skills
  if (resume.skills.length > 0) {
    children.push(sectionHeading("Skills"));
    children.push(
      new Paragraph({
        children: [new TextRun({ text: resume.skills.join("  •  "), size: 20 })],
        spacing: { after: 120 },
      })
    );
  }

  // Experience
  if (resume.experience.length > 0) {
    children.push(sectionHeading("Experience"));
    for (const exp of resume.experience) {
      children.push(twoColumnLine(exp.title, `${exp.startDate} – ${exp.current ? "Present" : (exp.endDate ?? "")}`));
      children.push(
        new Paragraph({
          children: [new TextRun({ text: exp.company, italics: true, size: 20, color: "374151" })],
          spacing: { after: 60 },
        })
      );
      for (const b of exp.bullets) {
        children.push(bullet(b));
      }
      children.push(new Paragraph({ spacing: { after: 100 } }));
    }
  }

  // Education
  if (resume.education.length > 0) {
    children.push(sectionHeading("Education"));
    for (const edu of resume.education) {
      const degreeText = `${edu.degree}${edu.field ? ` in ${edu.field}` : ""}`;
      children.push(twoColumnLine(degreeText, edu.graduationDate ?? ""));
      children.push(
        new Paragraph({
          children: [new TextRun({ text: edu.institution, italics: true, size: 20, color: "374151" })],
          spacing: { after: 80 },
        })
      );
    }
  }

  // Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    children.push(sectionHeading("Certifications"));
    for (const cert of resume.certifications) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.name, bold: true, size: 20 }),
            ...(cert.issuer ? [new TextRun({ text: ` — ${cert.issuer}`, size: 20, color: "6b7280" })] : []),
          ],
          spacing: { after: 60 },
        })
      );
    }
  }

  // Projects
  if (resume.projects && resume.projects.length > 0) {
    children.push(sectionHeading("Projects"));
    for (const proj of resume.projects) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: proj.name, bold: true, size: 20 })],
          spacing: { after: 40 },
        })
      );
      children.push(
        new Paragraph({
          children: [new TextRun({ text: proj.description, size: 20 })],
          spacing: { after: 40 },
        })
      );
      if (proj.technologies.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: "Technologies: ", bold: true, size: 18 }),
              new TextRun({ text: proj.technologies.join(", "), size: 18, color: "6b7280" }),
            ],
            spacing: { after: 80 },
          })
        );
      }
    }
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 20 },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 900, right: 900 },
          },
        },
        children,
      },
    ],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}
