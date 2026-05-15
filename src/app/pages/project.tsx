import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../components/AuthContext';
import { RecordFormModal, RecordFormData, LinkType } from '../components/RecordFormModal';

interface ProjectRecord extends RecordFormData {
  id: string;
  createdAt?: any;
}

const LINK_TYPE_ICONS: Record<LinkType, string> = {
  website: '🌐',
  youtube: '▶️',
  app: '📱',
  image: '🖼️',
  other: '📄',
};

const SUBJECT_FILTERS = ['all', '디자인드리븐', 'SQL', 'UX리서치', '프로덕트 전략', '데이터 분석', '서비스 기획'];

function formatDate(iso: string) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function PMPortfolio() {
  const [records, setRecords] = useState<ProjectRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ProjectRecord | null>(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 5000);
    const unsub = onSnapshot(
      collection(db, 'records'),
      snap => {
        clearTimeout(timer);
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as ProjectRecord));
        docs.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        setRecords(docs);
        setIsLoading(false);
      },
      err => {
        console.error('Firestore onSnapshot error:', err.code, err.message);
        clearTimeout(timer);
        setIsLoading(false);
      }
    );
    return () => { clearTimeout(timer); unsub(); };
  }, []);

  const handleSubmit = async (data: RecordFormData) => {
    try {
      if (editingRecord) {
        await updateDoc(doc(db, 'records', editingRecord.id), { ...data });
      } else {
        await addDoc(collection(db, 'records'), { ...data, createdAt: serverTimestamp() });
      }
    } catch {
      alert('저장에 실패했습니다.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('이 기록을 삭제하시겠습니까?')) return;
    await deleteDoc(doc(db, 'records', id));
  };

  const handleEdit = (record: ProjectRecord) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const filtered = selectedSubject === 'all'
    ? records
    : records.filter(r => r.subjects?.includes(selectedSubject));

  return (
    <div className="min-h-screen pt-8 pb-24 px-8">
      <div className="max-w-[1280px] mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-16">
          <div>
            <div className="font-['Space_Mono'] text-xs tracking-[0.3em] text-[#ff6b35] mb-4">PM & PLANNING PORTFOLIO</div>
            <h1 className="font-['Archivo_Black'] text-7xl mb-6">
              Project<br /><span className="text-[#ff6b35]">Records</span>
            </h1>
            <p className="font-['Crimson_Pro'] text-xl text-[#b8b8a8] max-w-[700px] leading-relaxed">
              데이터 기반의 의사결정과 사용자 중심 사고로 비즈니스 임팩트를 만들어낸 프로젝트들입니다.
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#ff6b35] text-[#0a0a0a] font-['Space_Mono'] text-sm tracking-wider hover:bg-[#ff8855] transition-all duration-300 hover:scale-105 mt-2"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 1v12M1 7h12" />
              </svg>
              Add Project
            </button>
          )}
        </div>

        {/* Subject filter + view toggle */}
        <div className="flex flex-wrap items-center gap-3 mb-12">
          {SUBJECT_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSubject(s)}
              className={`px-4 py-2 font-['Space_Mono'] text-xs tracking-wider transition-all duration-300 ${
                selectedSubject === s
                  ? 'bg-[#ff6b35] text-[#0a0a0a]'
                  : 'bg-[#1a1a1a] text-[#f5f5f0] border border-[#f5f5f0]/10 hover:border-[#ff6b35]'
              }`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}

          <div className="flex border border-[#f5f5f0]/10 bg-[#1a1a1a]">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              title="Grid view"
              className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-[#ff6b35] text-[#0a0a0a]' : 'text-[#b8b8a8] hover:text-[#ff6b35]'}`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="1" width="6" height="6" />
                <rect x="9" y="1" width="6" height="6" />
                <rect x="1" y="9" width="6" height="6" />
                <rect x="9" y="9" width="6" height="6" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              title="List view"
              className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-[#ff6b35] text-[#0a0a0a]' : 'text-[#b8b8a8] hover:text-[#ff6b35]'}`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="2" width="14" height="2" />
                <rect x="1" y="7" width="14" height="2" />
                <rect x="1" y="12" width="14" height="2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-32">
            <div className="w-10 h-10 border-4 border-[#ff6b35] border-t-transparent animate-spin rounded-full" />
          </div>
        )}

        {/* Empty */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-32">
            <p className="font-['Crimson_Pro'] text-xl text-[#b8b8a8]">
              {selectedSubject === 'all' ? '등록된 프로젝트가 없습니다.' : '해당 카테고리의 프로젝트가 없습니다.'}
            </p>
          </div>
        )}

        {/* Cards */}
        {!isLoading && filtered.length > 0 && (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start'
            : 'flex flex-col gap-4'}
          >
            {filtered.map((record, index) => (
              <RecordCard
                key={record.id}
                record={record}
                index={index}
                isAdmin={isAdmin}
                viewMode={viewMode}
                onEdit={() => handleEdit(record)}
                onDelete={() => handleDelete(record.id)}
              />
            ))}
          </div>
        )}
      </div>

      {isAdmin && (
        <RecordFormModal
          key={editingRecord ? `edit-${editingRecord.id}` : 'new'}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          editingRecord={editingRecord}
        />
      )}
    </div>
  );
}

interface RecordCardProps {
  record: ProjectRecord;
  index: number;
  isAdmin: boolean;
  viewMode: 'grid' | 'list';
  onEdit: () => void;
  onDelete: () => void;
}

function RecordCard({ record, index, isAdmin, viewMode, onEdit, onDelete }: RecordCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isList = viewMode === 'list';

  return (
    <div
      className={`group bg-[#1a1a1a] border border-[#f5f5f0]/10 hover:border-[#ff6b35]/40 transition-all duration-300 ${isList ? 'flex flex-row' : 'flex flex-col'}`}
      style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.07}s both` }}
    >
      <div className={`relative overflow-hidden bg-[#0a0a0a] ${isList ? 'w-48 shrink-0' : 'h-48'}`}>
        {record.thumbnail ? (
          <>
            <img
              src={record.thumbnail}
              alt="thumbnail"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {!isList && <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-60" />}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-[#f5f5f0]/15">
              <rect x="3" y="3" width="18" height="18" rx="1" />
              <circle cx="9" cy="9" r="2" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        {/* Title */}
        {record.title && (
          <h3 className="font-['Archivo_Black'] text-lg text-[#f5f5f0] mb-3 group-hover:text-[#ff6b35] transition-colors duration-300">
            {record.title}
          </h3>
        )}

        {/* Date + admin controls */}
        <div className="flex items-start justify-between mb-3">
          <span className="font-['Space_Mono'] text-[11px] text-[#b8b8a8] tracking-wider">
            {formatDate(record.date)}
          </span>
          {isAdmin && (
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={onEdit}
                className="px-2 py-1 bg-[#2a2a2a] border border-[#f5f5f0]/10 hover:border-[#ff6b35] hover:text-[#ff6b35] font-['Space_Mono'] text-[11px] tracking-wider transition-colors"
              >
                EDIT
              </button>
              <button
                onClick={onDelete}
                className="px-2 py-1 bg-[#2a2a2a] border border-[#f5f5f0]/10 hover:border-red-500 hover:text-red-400 font-['Space_Mono'] text-[11px] tracking-wider transition-colors"
              >
                DEL
              </button>
            </div>
          )}
        </div>

        {/* Team badge */}
        <div className="mb-3">
          {record.teamType === 'solo' ? (
            <span className="inline-flex items-center px-2 py-0.5 bg-[#0a0a0a] border border-[#f5f5f0]/10 font-['Space_Mono'] text-[11px] tracking-wider text-[#b8b8a8]">
              개인 작업
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#ff6b35]/10 border border-[#ff6b35]/20 font-['Space_Mono'] text-[11px] tracking-wider text-[#ff6b35]">
              팀 작업{record.collaborators ? ` · ${record.collaborators}` : ''}
            </span>
          )}
        </div>

        {/* Subjects - single line */}
        <div className="relative flex flex-nowrap gap-1.5 mb-3 h-[22px] overflow-hidden" style={{ maskImage: 'linear-gradient(to right, #000 calc(100% - 24px), transparent)', WebkitMaskImage: 'linear-gradient(to right, #000 calc(100% - 24px), transparent)' }}>
          {record.subjects?.length > 0 ? (
            <>
              {record.subjects.map(s => (
                <span key={s} className="shrink-0 whitespace-nowrap px-2 py-0.5 bg-[#ff6b35]/10 border border-[#ff6b35]/30 font-['Space_Mono'] text-[11px] text-[#ff6b35]">
                  {s}
                </span>
              ))}
              <span className="shrink-0 self-center font-['Space_Mono'] text-[11px] text-[#ff6b35]/60 px-1">···</span>
            </>
          ) : null}
        </div>

        {/* Keywords - single line */}
        <div className="relative flex flex-nowrap gap-1.5 mb-3 h-[22px] overflow-hidden" style={{ maskImage: 'linear-gradient(to right, #000 calc(100% - 24px), transparent)', WebkitMaskImage: 'linear-gradient(to right, #000 calc(100% - 24px), transparent)' }}>
          {record.keywords?.length > 0 ? (
            <>
              {record.keywords.map(kw => (
                <span key={kw} className="shrink-0 whitespace-nowrap px-2 py-0.5 bg-[#2a2a2a] border border-[#f5f5f0]/10 font-['Space_Mono'] text-[11px] text-[#b8b8a8]">
                  {kw}
                </span>
              ))}
              <span className="shrink-0 self-center font-['Space_Mono'] text-[11px] text-[#b8b8a8]/60 px-1">···</span>
            </>
          ) : null}
        </div>

        {/* Work note */}
        {record.workNote && (
          <div className="mb-4 flex-1">
            <p className={`font-['Crimson_Pro'] text-sm text-[#b8b8a8] leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
              {record.workNote}
            </p>
            {record.workNote.length > 120 && (
              <button
                onClick={() => setExpanded(e => !e)}
                className="mt-1 font-['Space_Mono'] text-[11px] text-[#ff6b35] hover:text-[#ff8855] tracking-wider"
              >
                {expanded ? 'COLLAPSE' : 'READ MORE'}
              </button>
            )}
          </div>
        )}

        {/* Links - single line */}
        <div className="mt-auto pt-3 border-t border-[#f5f5f0]/10">
          <div className="relative flex flex-nowrap gap-2 h-[28px] overflow-hidden" style={{ maskImage: 'linear-gradient(to right, #000 calc(100% - 24px), transparent)', WebkitMaskImage: 'linear-gradient(to right, #000 calc(100% - 24px), transparent)' }}>
            {record.links?.filter(l => l.url).length > 0 ? (
              <>
                {record.links.filter(l => l.url).map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 whitespace-nowrap flex items-center gap-1.5 px-2 py-1 bg-[#0a0a0a] border border-[#f5f5f0]/10 hover:border-[#ff6b35] transition-colors font-['Space_Mono'] text-[11px] text-[#b8b8a8] hover:text-[#ff6b35]"
                  >
                    <span>{LINK_TYPE_ICONS[link.type]}</span>
                    <span className="truncate max-w-[100px]">
                      {(() => { try { return new URL(link.url).hostname.replace('www.', ''); } catch { return link.url; } })()}
                    </span>
                  </a>
                ))}
                <span className="shrink-0 self-center font-['Space_Mono'] text-[11px] text-[#b8b8a8]/60 px-1">···</span>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
