import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rich-text-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rich-text-toolbar.component.html',
  styleUrl: './rich-text-toolbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RichTextToolbarComponent {
  /** The native textarea element this toolbar controls */
  textareaRef = input.required<HTMLTextAreaElement>();
  /** Emits the updated text after a toolbar action */
  textChange = output<string>();

  applyBold() {
    this.wrapSelection('**', '**');
  }

  applyItalic() {
    this.wrapSelection('*', '*');
  }

  applyBullet() {
    const el = this.textareaRef();
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const value = el.value;

    // Find full lines that contain the selection
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    let lineEnd = value.indexOf('\n', end);
    if (lineEnd === -1) lineEnd = value.length;

    const selectedLinesText = value.substring(lineStart, lineEnd);
    const lines = selectedLinesText.split('\n');

    const hasBullets = lines.every(l => l.trimStart().startsWith('• '));
    const newLines = hasBullets
      ? lines.map(l => l.replace(/^(\s*)•\s?/, '$1'))
      : lines.map(l => {
          const trimL = l.trimStart();
          if (trimL.startsWith('• ')) return l;
          const leadingSpaces = l.match(/^\s*/)?.[0] ?? '';
          return leadingSpaces + '• ' + l.substring(leadingSpaces.length);
        });

    const replacement = newLines.join('\n');
    const newValue = value.substring(0, lineStart) + replacement + value.substring(lineEnd);
    el.value = newValue;

    el.selectionStart = lineStart;
    el.selectionEnd = lineStart + replacement.length;
    el.focus();
    this.textChange.emit(newValue);
  }

  applyHeading() {
    const el = this.textareaRef();
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const value = el.value;

    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    let lineEnd = value.indexOf('\n', end);
    if (lineEnd === -1) lineEnd = value.length;

    const lineText = value.substring(lineStart, lineEnd);
    
    let replacement: string;
    if (lineText.startsWith('**') && lineText.endsWith('**')) {
      replacement = lineText.substring(2, lineText.length - 2);
    } else {
      replacement = `**${lineText}**`;
    }

    const newValue = value.substring(0, lineStart) + replacement + value.substring(lineEnd);
    el.value = newValue;

    el.selectionStart = lineStart;
    el.selectionEnd = lineStart + replacement.length;
    el.focus();
    this.textChange.emit(newValue);
  }

  clearFormatting() {
    const el = this.textareaRef();
    if (!el) return;
    const cleaned = el.value
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/^• /gm, '');
    el.value = cleaned;
    el.focus();
    this.textChange.emit(cleaned);
  }

  private wrapSelection(prefix: string, suffix: string) {
    const el = this.textareaRef();
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const value = el.value;
    const selected = value.substring(start, end);

    // Case 1: Selection itself is wrapped (e.g. "**text**")
    if (selected.startsWith(prefix) && selected.endsWith(suffix)) {
      const unwrapped = selected.substring(prefix.length, selected.length - suffix.length);
      const newValue = value.substring(0, start) + unwrapped + value.substring(end);
      el.value = newValue;
      el.selectionStart = start;
      el.selectionEnd = start + unwrapped.length;
      el.focus();
      this.textChange.emit(newValue);
      return;
    }

    // Case 2: Outer bounds of selection are wrapped (e.g. "**" + selection + "**")
    const hasOuterPrefix = value.substring(start - prefix.length, start) === prefix;
    const hasOuterSuffix = value.substring(end, end + suffix.length) === suffix;
    if (hasOuterPrefix && hasOuterSuffix) {
      const newValue = value.substring(0, start - prefix.length) + selected + value.substring(end + suffix.length);
      el.value = newValue;
      el.selectionStart = start - prefix.length;
      el.selectionEnd = start - prefix.length + selected.length;
      el.focus();
      this.textChange.emit(newValue);
      return;
    }

    // Case 3: Standard wrap
    const newValue = value.substring(0, start) + prefix + selected + suffix + value.substring(end);
    el.value = newValue;

    if (selected.length > 0) {
      el.selectionStart = start + prefix.length;
      el.selectionEnd = start + prefix.length + selected.length;
    } else {
      const newCursorPos = start + prefix.length;
      el.selectionStart = newCursorPos;
      el.selectionEnd = newCursorPos;
    }
    el.focus();
    this.textChange.emit(newValue);
  }
}
