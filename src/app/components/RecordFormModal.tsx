import { useState, useRef } from 'react';

export type LinkType = 'website' | 'youtube' | 'app' | 'image' | 'other';

export interface RecordLink {
  url: string;
  type: LinkType;
}

export interface RecordFormData {
  title: string;
  date: string;
  teamType: 'solo' | 'team';
  collaborators: string;
  links: RecordLink[];
  thumbnail: string;
  keywords: string[];
  workNote: string;
  subjects: string[];
}

interface RecordFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RecordFormData) => void;
  editingRecord?: { id: string } & RecordFormData | null;
}

const LINK_TYPE_ICONS: Record<LinkType, string> = {
  website: '🌐',
  youtube: '▶️',
  app: '📱',
  image: '🖼️',
  other: '📄',
};

const LINK_TYPE_LABELS: Record<LinkType, string> = {
  website: 'Website',
  youtube: 'YouTube',
  app: 'App',
  image: 'Image',
  other: 'Other',
};

const PREDEFINED_SUBJECTS = [
  '디자인드리븐', 'SQL', 'UX리서치', '프로덕트 전략',
  '데이터 분석', '서비스 기획', '브랜딩', '개발',
];

function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const maxW = 600;
      const maxH = 400;
      let { width, height } = img;
      if (width > maxW) { height = Math.round(height * maxW / width); width = maxW; }
      if (height > maxH) { width = Math.round(width * maxH / height); height = maxH; }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL('image/jpeg', 0.75));
    };
    img.src = objectUrl;
  });
}

function nowLocalISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function RecordFormModal({ isOpen, onClose, onSubmit, editingRecord }: RecordFormModalProps) {
  const emptyForm = (): RecordFormData => ({
    title: '',
    date: nowLocalISO(),
    teamType: 'solo',
    collaborators: '',
    links: [{ url: '', type: 'website' }],
    thumbnail: '',
    keywords: [],
    workNote: '',
    subjects: [],
  });

  const [form, setForm] = useState<RecordFormData>(() =>
    editingRecord
      ? {
          title: editingRecord.title ?? '',
          date: editingRecord.date,
          teamType: editingRecord.teamType,
          collaborators: editingRecord.collaborators,
          links: editingRecord.links.length ? editingRecord.links : [{ url: '', type: 'website' }],
          thumbnail: editingRecord.thumbnail,
          keywords: editingRecord.keywords,
          workNote: editingRecord.workNote,
          subjects: editingRecord.subjects,
        }
      : emptyForm()
  );

  const [kwInput, setKwInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setForm(emptyForm());
    setKwInput('');
    setSubjectInput('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned: RecordFormData = {
      ...form,
      date: form.date || nowLocalISO(),
      links: form.links.filter(l => l.url.trim()),
    };
    onSubmit(cleaned);
    handleClose();
  };

  // Links
  const addLink = () => setForm(f => ({ ...f, links: [...f.links, { url: '', type: 'website' }] }));
  const removeLink = (i: number) => setForm(f => ({ ...f, links: f.links.filter((_, idx) => idx !== i) }));
  const updateLink = (i: number, patch: Partial<RecordLink>) =>
    setForm(f => ({ ...f, links: f.links.map((l, idx) => (idx === i ? { ...l, ...patch } : l)) }));

  // Keywords
  const addKeyword = (raw: string) => {
    const kw = raw.trim().replace(/,$/, '');
    if (kw && !form.keywords.includes(kw))
      setForm(f => ({ ...f, keywords: [...f.keywords, kw] }));
    setKwInput('');
  };
  const handleKwKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addKeyword(kwInput); }
  };
  const removeKeyword = (kw: string) => setForm(f => ({ ...f, keywords: f.keywords.filter(k => k !== kw) }));

  // Subjects
  const addSubject = (s: string) => {
    const sub = s.trim();
    if (sub && !form.subjects.includes(sub))
      setForm(f => ({ ...f, subjects: [...f.subjects, sub] }));
    setSubjectInput('');
  };
  const handleSubjectKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSubject(subjectInput); }
  };
  const removeSubject = (s: string) => setForm(f => ({ ...f, subjects: f.subjects.filter(x => x !== s) }));

  // Thumbnail
  const handleThumbFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsCompressing(true);
    const b64 = await compressImage(file);
    setForm(f => ({ ...f, thumbnail: b64 }));
    setIsCompressing(false);
    if (e.target) e.target.value = '';
  };

  const inputCls = 'w-full px-3 py-2 bg-[#2a2a2a] border border-[#f5f5f0]/10 font-["Crimson_Pro"] text-[#f5f5f0] text-sm focus:border-[#ff6b35] focus:outline-none transition-colors';
  const labelCls = 'block font-["Space_Mono"] text-[10px] tracking-[0.2em] text-[#ff6b35] mb-1.5 uppercase';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border border-[#f5f5f0]/20 p-8 m-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-['Archivo_Black'] text-2xl text-[#f5f5f0]">
            {editingRecord ? 'Edit' : 'Add'} <span className="text-[#ff6b35]">Record</span>
          </h2>
          <button onClick={handleClose} className="text-[#b8b8a8] hover:text-[#ff6b35] transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 5L5 15M5 5l10 10" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className={labelCls}>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className={inputCls}
              placeholder="프로젝트 타이틀 (선택)"
            />
          </div>

          {/* Date */}
          <div>
            <label className={labelCls}>Date</label>
            <input
              type="datetime-local"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className={inputCls + ' [color-scheme:dark]'}
            />
          </div>

          {/* Team / Solo */}
          <div>
            <label className={labelCls}>Type</label>
            <div className="flex gap-2">
              {(['solo', 'team'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, teamType: t }))}
                  className={`px-5 py-2 font-['Space_Mono'] text-xs tracking-wider transition-all duration-200 ${
                    form.teamType === t
                      ? 'bg-[#ff6b35] text-[#0a0a0a]'
                      : 'bg-[#2a2a2a] border border-[#f5f5f0]/10 text-[#b8b8a8] hover:border-[#ff6b35]'
                  }`}
                >
                  {t === 'solo' ? '개인 작업' : '팀 작업'}
                </button>
              ))}
            </div>
            {form.teamType === 'team' && (
              <input
                type="text"
                value={form.collaborators}
                onChange={e => setForm(f => ({ ...f, collaborators: e.target.value }))}
                className={inputCls + ' mt-2'}
                placeholder="공동 작업자 이름 (예: 홍길동, 김철수)"
              />
            )}
          </div>

          {/* Links */}
          <div>
            <label className={labelCls}>Links</label>
            <div className="space-y-2">
              {form.links.map((link, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <select
                    value={link.type}
                    onChange={e => updateLink(i, { type: e.target.value as LinkType })}
                    className="px-2 py-2 bg-[#2a2a2a] border border-[#f5f5f0]/10 text-[#f5f5f0] text-sm focus:border-[#ff6b35] focus:outline-none transition-colors w-32"
                  >
                    {(Object.keys(LINK_TYPE_ICONS) as LinkType[]).map(t => (
                      <option key={t} value={t}>{LINK_TYPE_ICONS[t]} {LINK_TYPE_LABELS[t]}</option>
                    ))}
                  </select>
                  <input
                    type="url"
                    value={link.url}
                    onChange={e => updateLink(i, { url: e.target.value })}
                    placeholder="https://..."
                    className={inputCls + ' flex-1'}
                  />
                  {form.links.length > 1 && (
                    <button type="button" onClick={() => removeLink(i)} className="text-[#b8b8a8] hover:text-red-400 transition-colors px-1">✕</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addLink} className="font-['Space_Mono'] text-[10px] tracking-wider text-[#ff6b35] border border-[#ff6b35]/30 px-3 py-1.5 hover:bg-[#ff6b35]/10 transition-colors">
                + Add Link
              </button>
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <label className={labelCls}>Thumbnail</label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={isCompressing}
                className="px-4 py-2 bg-[#2a2a2a] border border-[#f5f5f0]/10 font-['Space_Mono'] text-[10px] tracking-wider text-[#b8b8a8] hover:border-[#ff6b35] hover:text-[#ff6b35] transition-colors disabled:opacity-50"
              >
                {isCompressing ? 'Processing…' : 'Choose File'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleThumbFile} />
              {form.thumbnail && (
                <div className="flex items-center gap-2">
                  <img src={form.thumbnail} alt="thumb" className="w-20 h-20 object-cover border border-[#f5f5f0]/10" />
                  <button type="button" onClick={() => setForm(f => ({ ...f, thumbnail: '' }))} className="font-['Space_Mono'] text-[10px] text-red-500 hover:text-red-400">REMOVE</button>
                </div>
              )}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className={labelCls}>Keywords</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.keywords.map(kw => (
                <span key={kw} className="flex items-center gap-1 px-2 py-0.5 bg-[#2a2a2a] border border-[#f5f5f0]/10 font-['Space_Mono'] text-[10px] text-[#b8b8a8]">
                  {kw}
                  <button type="button" onClick={() => removeKeyword(kw)} className="text-[#ff6b35] hover:text-[#ff8855]">×</button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={kwInput}
              onChange={e => setKwInput(e.target.value)}
              onKeyDown={handleKwKey}
              onBlur={() => kwInput.trim() && addKeyword(kwInput)}
              placeholder="키워드 입력 후 Enter 또는 쉼표"
              className={inputCls}
            />
          </div>

          {/* Work Note */}
          <div>
            <label className={labelCls}>Work Note</label>
            <textarea
              value={form.workNote}
              onChange={e => setForm(f => ({ ...f, workNote: e.target.value }))}
              rows={4}
              className={inputCls + ' resize-none'}
              placeholder="프로젝트 설명 또는 작업 메모"
            />
          </div>

          {/* Subject / Course */}
          <div>
            <label className={labelCls}>Subject / Course</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.subjects.map(s => (
                <span key={s} className="flex items-center gap-1 px-2 py-0.5 bg-[#ff6b35]/10 border border-[#ff6b35]/30 font-['Space_Mono'] text-[10px] text-[#ff6b35]">
                  {s}
                  <button type="button" onClick={() => removeSubject(s)} className="hover:text-white">×</button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {PREDEFINED_SUBJECTS.filter(s => !form.subjects.includes(s)).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addSubject(s)}
                  className="px-2 py-0.5 bg-[#2a2a2a] border border-[#f5f5f0]/10 font-['Space_Mono'] text-[10px] text-[#b8b8a8] hover:border-[#ff6b35] hover:text-[#ff6b35] transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={subjectInput}
              onChange={e => setSubjectInput(e.target.value)}
              onKeyDown={handleSubjectKey}
              onBlur={() => subjectInput.trim() && addSubject(subjectInput)}
              placeholder="직접 입력 후 Enter"
              className={inputCls}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-[#f5f5f0]/10">
            <button type="submit" className="flex-1 py-3 bg-[#ff6b35] text-[#0a0a0a] font-['Space_Mono'] text-xs tracking-wider hover:bg-[#ff8855] transition-colors">
              {editingRecord ? 'UPDATE' : 'CREATE'}
            </button>
            <button type="button" onClick={handleClose} className="px-6 py-3 border border-[#f5f5f0]/20 font-['Space_Mono'] text-xs tracking-wider text-[#f5f5f0] hover:border-[#ff6b35] hover:text-[#ff6b35] transition-colors">
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
