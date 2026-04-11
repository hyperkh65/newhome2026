'use client';
import { useEffect, useRef, useState } from 'react';
import CloudinaryUpload from '@/components/CloudinaryUpload';

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export default function RichEditor({ value, onChange, placeholder = '내용을 입력하세요...', minHeight = 380 }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isSource, setIsSource] = useState(false);
  const [srcVal, setSrcVal] = useState('');

  // Mount: 초기값 한 번만 설정
  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = value;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sync = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val ?? undefined);
    editorRef.current?.focus();
    sync();
  };

  const toggleSource = () => {
    if (!isSource) {
      setSrcVal(editorRef.current?.innerHTML ?? value);
      setIsSource(true);
    } else {
      if (editorRef.current) {
        editorRef.current.innerHTML = srcVal;
        onChange(srcVal);
      }
      setIsSource(false);
      setTimeout(() => editorRef.current?.focus(), 50);
    }
  };

  const insertImage = (url: string) => {
    editorRef.current?.focus();
    exec('insertHTML', `<br/><img src="${url}" style="max-width:100%;border-radius:10px;display:block;margin:10px 0;" alt=""/><br/>`);
  };

  const insertVideo = () => {
    const url = prompt('YouTube URL 또는 MP4 직접 URL을 입력하세요:');
    if (!url) return;
    editorRef.current?.focus();
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (yt) {
      exec('insertHTML', `<div style="position:relative;padding-bottom:56.25%;height:0;border-radius:12px;overflow:hidden;margin:16px 0;"><iframe src="https://www.youtube.com/embed/${yt[1]}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen></iframe></div><br/>`);
    } else {
      exec('insertHTML', `<video controls style="max-width:100%;border-radius:10px;margin:10px 0;display:block;"><source src="${url}"/></video><br/>`);
    }
  };

  const insertLink = () => {
    const url = prompt('링크 URL:');
    if (url) exec('createLink', url);
  };

  const insertQuote = () => {
    exec('formatBlock', 'blockquote');
  };

  type Sep = { sep: true };
  type Btn = { label: string; title: string; fn: () => void; mono?: boolean };
  const tools: (Sep | Btn)[] = [
    { label: 'B', title: '굵게', fn: () => exec('bold') },
    { label: 'I', title: '기울임', fn: () => exec('italic') },
    { label: 'U̲', title: '밑줄', fn: () => exec('underline') },
    { label: 'S', title: '취소선', fn: () => exec('strikeThrough') },
    { sep: true },
    { label: 'H2', title: '큰 제목', fn: () => exec('formatBlock', 'h2') },
    { label: 'H3', title: '중간 제목', fn: () => exec('formatBlock', 'h3') },
    { label: 'H4', title: '소제목', fn: () => exec('formatBlock', 'h4') },
    { label: 'P', title: '본문', fn: () => exec('formatBlock', 'p') },
    { sep: true },
    { label: '•', title: '순서없는 목록', fn: () => exec('insertUnorderedList') },
    { label: '1.', title: '순서있는 목록', fn: () => exec('insertOrderedList') },
    { label: '❝', title: '인용', fn: insertQuote },
    { label: '—', title: '구분선', fn: () => exec('insertHorizontalRule') },
    { label: '🔗', title: '링크 삽입', fn: insertLink },
    { sep: true },
    { label: '🎬', title: 'YouTube / 동영상 삽입', fn: insertVideo },
  ];

  const btnStyle: React.CSSProperties = {
    padding: '4px 9px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)',
    cursor: 'pointer', borderRadius: 5, fontSize: 13, fontFamily: 'inherit', lineHeight: 1.4,
  };

  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, overflow: 'hidden', background: '#0b0f1a' }}>
      {/* ── 툴바 ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 1, padding: '7px 10px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.025)', flexWrap: 'wrap' }}>
        {tools.map((t, i) =>
          'sep' in t ? (
            <span key={i} style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.15)', margin: '0 4px', display: 'inline-block', flexShrink: 0 }} />
          ) : (
            <button key={i} title={t.title} onMouseDown={e => { e.preventDefault(); t.fn(); }}
              style={btnStyle}>{t.label}</button>
          )
        )}

        {/* 이미지 업로드 */}
        <span onMouseDown={e => e.stopPropagation()} style={{ display: 'inline-flex' }}>
          <CloudinaryUpload label="📸 이미지" folder="led-blog" onSuccess={insertImage} />
        </span>

        {/* HTML 소스 토글 */}
        <button onMouseDown={e => { e.preventDefault(); toggleSource(); }} title="HTML 소스 보기/편집"
          style={{ ...btnStyle, marginLeft: 'auto', border: `1px solid ${isSource ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`, color: isSource ? '#60a5fa' : 'rgba(255,255,255,0.45)', fontFamily: 'monospace', fontSize: 11, padding: '3px 9px' }}>
          {'</>'}
        </button>
      </div>

      {/* ── 편집 영역 ── */}
      {isSource ? (
        <textarea value={srcVal} onChange={e => { setSrcVal(e.target.value); onChange(e.target.value); }}
          style={{ width: '100%', minHeight, background: '#0d1117', border: 'none', color: '#7dd3fc', fontSize: 12, fontFamily: '"Fira Code", "Courier New", monospace', padding: '16px', resize: 'vertical', boxSizing: 'border-box', outline: 'none', display: 'block' }}
          spellCheck={false} />
      ) : (
        <div ref={editorRef} contentEditable suppressContentEditableWarning
          onInput={sync}
          onPaste={e => {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');
            const html = text
              .split('\n')
              .map(line => line === ''
                ? '<br>'
                : `<span>${line.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</span>`)
              .join('<br>');
            document.execCommand('insertHTML', false, html);
          }}
          data-placeholder={placeholder}
          style={{ minHeight, padding: '20px 24px', color: '#e2e8f0', outline: 'none', lineHeight: 1.85, fontSize: 15, wordBreak: 'break-word' }} />
      )}

      <style jsx>{`
        [contenteditable]:empty::before { content: attr(data-placeholder); color: rgba(255,255,255,0.2); pointer-events: none; display: block; }
        [contenteditable] h2 { font-size:22px; font-weight:800; margin:20px 0 8px; color:#f1f5f9; }
        [contenteditable] h3 { font-size:18px; font-weight:700; margin:16px 0 6px; color:#e2e8f0; }
        [contenteditable] h4 { font-size:14px; font-weight:700; margin:12px 0 4px; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px; }
        [contenteditable] ul, [contenteditable] ol { padding-left:22px; margin:8px 0; }
        [contenteditable] li { margin:4px 0; }
        [contenteditable] blockquote { border-left:3px solid #3b82f6; margin:12px 0; padding:10px 16px; background:rgba(59,130,246,0.07); border-radius:0 8px 8px 0; color:#93c5fd; }
        [contenteditable] hr { border:none; border-top:1px solid rgba(255,255,255,0.1); margin:20px 0; }
        [contenteditable] img { max-width:100%; border-radius:10px; margin:8px 0; }
        [contenteditable] a { color:#60a5fa; text-decoration:underline; }
        [contenteditable] video { max-width:100%; border-radius:10px; }
        [contenteditable] s { opacity:0.6; }
      `}</style>
    </div>
  );
}
