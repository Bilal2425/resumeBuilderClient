import { Component, OnInit, signal, ChangeDetectionStrategy, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

const ATS_TEMPLATE = `# Your Name

**Email:** your@email.com | **Phone:** (555) 000-0000 | **Location:** City, ST
**LinkedIn:** linkedin.com/in/yourprofile | **GitHub:** github.com/yourusername

---

## Professional Summary

Results-driven software engineer with X+ years of experience in full-stack development. Skilled in building scalable web applications using modern frameworks and cloud technologies.

## Work Experience

### Senior Software Engineer — Company Name
*Jan 2023 – Present | City, ST*

- Led development of a customer-facing web application serving 50K+ users
- Designed and implemented RESTful APIs using .NET Core and Entity Framework
- Reduced page load time by 40% through code optimization and lazy loading
- Mentored junior developers and conducted code reviews

### Software Developer — Previous Company
*Jun 2020 – Dec 2022 | City, ST*

- Built responsive UI components using Angular and TypeScript
- Integrated third-party payment APIs handling $2M+ in transactions
- Wrote unit and integration tests achieving 85% code coverage

## Education

### Master of Science in Computer Science — University Name
*2018 – 2020 | City, ST*

### Bachelor of Technology in Information Technology — University Name
*2014 – 2018 | City, ST*

## Technical Skills

C#, .NET Core, Angular, TypeScript, JavaScript, Python, SQL Server, PostgreSQL, MongoDB, Docker, Kubernetes, AWS, Azure, Git, REST APIs, Microservices, Agile/Scrum

## Certifications

- AWS Certified Developer Associate — Amazon Web Services
- Microsoft Certified: Azure Developer Associate — Microsoft
`;

@Component({
  selector: 'app-markdown-editor',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './markdown-editor.component.html',
  styleUrl: './markdown-editor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarkdownEditorComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);

  markdownContent  = signal<string>('');
  renderedHtml     = signal<SafeHtml>('');
  isExporting      = signal<boolean>(false);
  currentTemplate  = signal<'blank' | 'ats'>('ats');
  showHelp         = signal<boolean>(false);
  showTypography   = signal<boolean>(false);

  // Individual font size controls (all in pt)
  bodySize = signal<number>(9);    // body text / paragraphs / lists  (7–12)
  h1Size   = signal<number>(20);   // Your Name                        (14–30)
  h2Size   = signal<number>(12);   // Section titles (WORK EXPERIENCE) (9–18)
  h3Size   = signal<number>(10);   // Job titles                       (8–14)

  @ViewChild('mdPreview') mdPreview!: ElementRef<HTMLElement>;

  ngOnInit() {
    this.loadTemplate('ats');
  }

  // ── Panel toggles (mutually exclusive) ──────────────────────────────
  toggleHelp() {
    this.showHelp.update(v => !v);
    if (this.showHelp()) this.showTypography.set(false);
  }

  toggleTypography() {
    this.showTypography.update(v => !v);
    if (this.showTypography()) this.showHelp.set(false);
  }

  // ── Font size adjusters ──────────────────────────────────────────────
  adjustBody(d: number) { this.bodySize.update(v => Math.min(Math.max(+(v + d).toFixed(1), 7),  12)); this.rerender(); }
  adjustH1(d: number)   { this.h1Size.update(v   => Math.min(Math.max(v + d, 14), 30)); this.rerender(); }
  adjustH2(d: number)   { this.h2Size.update(v   => Math.min(Math.max(+(v + d).toFixed(1), 9),  18)); this.rerender(); }
  adjustH3(d: number)   { this.h3Size.update(v   => Math.min(Math.max(+(v + d).toFixed(1), 8),  14)); this.rerender(); }

  private rerender() {
    const rawHtml = this.parseMarkdown(this.markdownContent());
    this.renderedHtml.set(this.sanitizer.bypassSecurityTrustHtml(rawHtml));
  }

  // ── Content ──────────────────────────────────────────────────────────
  onMarkdownChange(text: string) {
    this.markdownContent.set(text);
    try {
      const rawHtml = this.parseMarkdown(text);
      this.renderedHtml.set(this.sanitizer.bypassSecurityTrustHtml(rawHtml));
    } catch (e) {
      console.error('Markdown parse error:', e);
    }
  }

  loadTemplate(type: 'blank' | 'ats') {
    this.currentTemplate.set(type);
    this.onMarkdownChange(type === 'ats' ? ATS_TEMPLATE : '');
  }

  // ── PDF export: open clean new window — avoids Angular print CSS conflicts ──
  downloadPdf() {
    const content = this.parseMarkdown(this.markdownContent());
    if (!content) return;

    const win = window.open('', '_blank');
    if (!win) {
      alert('Please allow pop-ups in your browser to download the PDF.');
      return;
    }

    win.document.write(this.buildPrintHtml(content));
    win.document.close();
    win.focus();

    // Small delay so fonts/styles load before print dialog opens
    setTimeout(() => {
      win.print();
      setTimeout(() => win.close(), 1000);
    }, 600);
  }

  private buildPrintHtml(content: string): string {
    const b  = this.bodySize();
    const h1 = this.h1Size();
    const h2 = this.h2Size();
    const h3 = this.h3Size();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Resume - Print View</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    /* Global Styles */
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      background-color: #f1f5f9;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #111111;
      -webkit-font-smoothing: antialiased;
    }

    /* Top Instruction Header (Hidden on Print) */
    .print-header {
      background-color: #1e293b;
      color: #ffffff;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .print-header h4 { margin: 0; font-size: 14px; font-weight: 600; }
    .print-header p { margin: 2px 0 0; font-size: 11px; color: #94a3b8; }
    .print-btn {
      background-color: #4f46e5;
      color: white;
      border: none;
      padding: 8px 16px;
      font-size: 12px;
      font-weight: 700;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .print-btn:hover { background-color: #4338ca; }

    /* Paper Container (Simulated A4 Sheet) */
    .paper-container {
      background: #ffffff;
      width: 210mm;
      min-height: 297mm;
      margin: 30px auto;
      padding: 20mm;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      border-radius: 4px;
      position: relative;
    }

    /* Resume Content Styling */
    h1 {
      font-size: ${h1}pt;
      font-weight: 700;
      text-align: center;
      margin: 0 0 6px;
      color: #000000;
      letter-spacing: -0.5px;
    }
    h2 {
      font-size: ${h2}pt;
      font-weight: 800;
      text-transform: uppercase;
      border-bottom: 2px solid #000000;
      padding-bottom: 3px;
      margin: 20px 0 10px;
      color: #000000;
      letter-spacing: 1.2px;
    }
    h3 {
      font-size: ${h3}pt;
      font-weight: 700;
      margin: 14px 0 2px;
      color: #111111;
    }
    h4 {
      font-size: ${b}pt;
      font-weight: 600;
      margin: 4px 0;
      color: #333333;
    }
    p {
      font-size: ${b}pt;
      line-height: 1.45;
      margin: 0 0 8px;
      color: #111111;
    }
    /* Center all header paragraphs before first section title */
    h1 ~ p {
      text-align: center;
      color: #333333;
      margin-bottom: 4px;
      font-size: 0.95em;
    }
    /* Left-align standard body paragraphs after section titles start */
    h2 ~ p {
      text-align: left;
      color: #111111;
      margin-bottom: 8px;
      font-size: 1em;
    }
    /* Style dates immediately following job titles */
    h3 + p {
      margin-top: 0 !important;
      margin-bottom: 6px !important;
      color: #4b5563 !important;
      font-size: 0.95em;
    }
    ul {
      padding-left: 20px;
      margin: 4px 0 8px;
      list-style-type: disc;
    }
    li {
      font-size: ${b}pt;
      line-height: 1.45;
      margin-bottom: 4px;
      color: #111111;
    }
    hr {
      border: none;
      border-top: 1px solid #cbd5e1;
      margin: 14px 0;
    }
    strong { font-weight: 700; }
    em { font-style: italic; }
    a { color: #111111; text-decoration: none; }

    /* Print Specific Overrides */
    @media print {
      @page {
        size: A4 portrait;
        margin: 15mm;
      }
      html, body {
        background-color: #ffffff !important;
      }
      .print-header {
        display: none !important;
      }
      .paper-container {
        width: 100% !important;
        min-height: auto !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }
    }
  </style>
</head>
<body>
  <!-- Print Prompt Banner (disappears on paper) -->
  <div class="print-header">
    <div>
      <h4>Resume Ready to Save</h4>
      <p>A print dialog has been opened. If you closed it, click "Print / Save PDF" to open it again.</p>
    </div>
    <button class="print-btn" onclick="window.print()">Print / Save PDF</button>
  </div>

  <!-- The physical sheet -->
  <div class="paper-container">
    ${content}
  </div>
</body>
</html>`;
  }

  // ── Markdown parser ────────────────────────────────────────────────────
  private parseMarkdown(md: string): string {
    if (!md) return '';

    const lines = md.replace(/\r\n/g, '\n').split('\n');
    const parts: string[] = [];
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        parts.push(`<ul>${listItems.join('')}</ul>`);
        listItems = [];
      }
    };

    for (const line of lines) {
      const trimmed = line.trim();

      if (/^(-{3,}|_{3,}|\*{3,})$/.test(trimmed)) {
        flushList();
        parts.push('<hr>');
        continue;
      }

      const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        flushList();
        const level   = headingMatch[1].length;
        const content = this.inlineFormat(this.escapeHtml(headingMatch[2]));
        // Embed font-size inline so Angular style sanitizer issues don't affect it
        const size = level === 1 ? this.h1Size()
                   : level === 2 ? this.h2Size()
                   : level === 3 ? this.h3Size()
                   : this.bodySize();
        parts.push(`<h${level} style="font-size:${size}pt">${content}</h${level}>`);
        continue;
      }

      const listMatch = trimmed.match(/^[-*+]\s+(.+)$/);
      if (listMatch) {
        const content = this.inlineFormat(this.escapeHtml(listMatch[1]));
        listItems.push(`<li>${content}</li>`);
        continue;
      }

      if (!trimmed) { flushList(); continue; }

      flushList();
      parts.push(`<p>${this.inlineFormat(this.escapeHtml(trimmed))}</p>`);
    }

    flushList();
    return parts.join('\n');
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  private inlineFormat(text: string): string {
    let r = text;
    r = r.replace(/\*{3}(.+?)\*{3}/g, '<strong><em>$1</em></strong>');
    r = r.replace(/_{3}(.+?)_{3}/g,   '<strong><em>$1</em></strong>');
    r = r.replace(/\*{2}(.+?)\*{2}/g, '<strong>$1</strong>');
    r = r.replace(/_{2}(.+?)_{2}/g,   '<strong>$1</strong>');
    r = r.replace(/\*([^*\n]+?)\*/g,  '<em>$1</em>');
    r = r.replace(/_([^_\n]+?)_/g,    '<em>$1</em>');
    r = r.replace(/`([^`]+)`/g,       '<code>$1</code>');
    r = r.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    return r;
  }
}
