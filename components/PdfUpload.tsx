'use client';
import { useState, useRef } from 'react';

interface Props {
  onSuccess: (url: string) => void;
  adminToken: string;
}

export default function PdfUpload({ onSuccess, adminToken }: Props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(`업로드 중... (${(file.size / 1024 / 1024).toFixed(1)}MB)`);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload/pdf', {
        method: 'POST',
        headers: { 'x-admin-token': adminToken },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        onSuccess(data.url);
        setProgress('✅ 업로드 완료');
        setTimeout(() => setProgress(''), 3000);
      } else {
        alert('업로드 실패: ' + (data.error || res.status));
        setProgress('');
      }
    } catch (err) {
      alert('네트워크 오류: ' + String(err));
      setProgress('');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <label style={{
        cursor: uploading ? 'not-allowed' : 'pointer',
        padding: '10px 16px',
        backgroundColor: 'rgba(168,85,247,0.15)',
        border: '1px solid rgba(168,85,247,0.4)',
        borderRadius: 8, color: '#c084fc', fontSize: 13,
        display: 'inline-flex', alignItems: 'center', gap: 8,
        opacity: uploading ? 0.6 : 1,
      }}>
        {uploading ? '⏳' : '📄'} {uploading ? '업로드 중...' : 'PDF 업로드 (NAS 직접저장)'}
        <input ref={ref} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={handle} disabled={uploading} />
      </label>
      {progress && <span style={{ fontSize: 12, color: progress.startsWith('✅') ? '#34d399' : '#94a3b8' }}>{progress}</span>}
    </div>
  );
}
