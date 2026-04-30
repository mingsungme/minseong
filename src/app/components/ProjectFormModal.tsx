import { useState } from 'react';

interface ProjectFormData {
  title: string;
  role: string;
  period: string;
  company: string;
  description: string;
  objectives: string[];
  outcomes: string[];
  tags: string[];
  thumbnail?: string;
  link?: string;
  metrics?: Array<{ label: string; value: string }>;
}

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  editingProject?: { id: string } & ProjectFormData | null;
}

export function ProjectFormModal({ isOpen, onClose, onSubmit, editingProject }: ProjectFormModalProps) {
  const [formData, setFormData] = useState<ProjectFormData>(() =>
    editingProject
      ? {
          title: editingProject.title,
          role: editingProject.role,
          period: editingProject.period,
          company: editingProject.company,
          description: editingProject.description,
          objectives: editingProject.objectives,
          outcomes: editingProject.outcomes,
          tags: editingProject.tags,
          thumbnail: editingProject.thumbnail || '',
          link: editingProject.link || '',
          metrics: editingProject.metrics || [{ label: '', value: '' }]
        }
      : {
          title: '',
          role: '',
          period: '',
          company: '',
          description: '',
          objectives: [''],
          outcomes: [''],
          tags: [],
          thumbnail: '',
          link: '',
          metrics: [{ label: '', value: '' }]
        }
  );

  const [tagInput, setTagInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty objectives and outcomes
    const cleanedData = {
      ...formData,
      objectives: formData.objectives.filter(obj => obj.trim() !== ''),
      outcomes: formData.outcomes.filter(out => out.trim() !== ''),
      metrics: formData.metrics?.filter(m => m.label && m.value) || undefined,
      thumbnail: formData.thumbnail || undefined,
      link: formData.link || undefined
    };

    onSubmit(cleanedData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      role: '',
      period: '',
      company: '',
      description: '',
      objectives: [''],
      outcomes: [''],
      tags: [],
      thumbnail: '',
      link: '',
      metrics: [{ label: '', value: '' }]
    });
    setTagInput('');
    onClose();
  };

  const addObjective = () => {
    setFormData(prev => ({ ...prev, objectives: [...prev.objectives, ''] }));
  };

  const addOutcome = () => {
    setFormData(prev => ({ ...prev, outcomes: [...prev.outcomes, ''] }));
  };

  const addMetric = () => {
    setFormData(prev => ({
      ...prev,
      metrics: [...(prev.metrics || []), { label: '', value: '' }]
    }));
  };

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...formData.objectives];
    newObjectives[index] = value;
    setFormData(prev => ({ ...prev, objectives: newObjectives }));
  };

  const updateOutcome = (index: number, value: string) => {
    const newOutcomes = [...formData.outcomes];
    newOutcomes[index] = value;
    setFormData(prev => ({ ...prev, outcomes: newOutcomes }));
  };

  const updateMetric = (index: number, field: 'label' | 'value', value: string) => {
    const newMetrics = [...(formData.metrics || [])];
    newMetrics[index][field] = value;
    setFormData(prev => ({ ...prev, metrics: newMetrics }));
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const removeOutcome = (index: number) => {
    setFormData(prev => ({
      ...prev,
      outcomes: prev.outcomes.filter((_, i) => i !== index)
    }));
  };

  const removeMetric = (index: number) => {
    setFormData(prev => ({
      ...prev,
      metrics: prev.metrics?.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border border-[#f5f5f0]/20 p-8 m-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-['Archivo_Black'] text-3xl text-[#f5f5f0]">
            {editingProject ? 'Edit' : 'Add New'} <span className="text-[#ff6b35]">Project</span>
          </h2>
          <button
            onClick={handleClose}
            className="text-[#b8b8a8] hover:text-[#ff6b35] transition-colors duration-300"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-['Space_Mono'] text-xs tracking-wider text-[#ff6b35] mb-2">
                PROJECT TITLE *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#f5f5f0]/10 font-['Crimson_Pro'] text-[#f5f5f0] focus:border-[#ff6b35] focus:outline-none transition-colors"
                placeholder="프로젝트 제목"
              />
            </div>
            <div>
              <label className="block font-['Space_Mono'] text-xs tracking-wider text-[#ff6b35] mb-2">
                YOUR ROLE *
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#f5f5f0]/10 font-['Crimson_Pro'] text-[#f5f5f0] focus:border-[#ff6b35] focus:outline-none transition-colors"
                placeholder="Product Manager"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-['Space_Mono'] text-xs tracking-wider text-[#ff6b35] mb-2">
                PERIOD *
              </label>
              <input
                type="text"
                required
                value={formData.period}
                onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#f5f5f0]/10 font-['Crimson_Pro'] text-[#f5f5f0] focus:border-[#ff6b35] focus:outline-none transition-colors"
                placeholder="2024.01 - 2024.12"
              />
            </div>
            <div>
              <label className="block font-['Space_Mono'] text-xs tracking-wider text-[#ff6b35] mb-2">
                COMPANY *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#f5f5f0]/10 font-['Crimson_Pro'] text-[#f5f5f0] focus:border-[#ff6b35] focus:outline-none transition-colors"
                placeholder="회사명"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-['Space_Mono'] text-xs tracking-wider text-[#ff6b35] mb-2">
              DESCRIPTION *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#f5f5f0]/10 font-['Crimson_Pro'] text-[#f5f5f0] focus:border-[#ff6b35] focus:outline-none transition-colors resize-none"
              placeholder="프로젝트 설명"
            />
          </div>

          {/* Thumbnail & Link */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-['Space_Mono'] text-xs tracking-wider text-[#ff6b35] mb-2">
                THUMBNAIL IMAGE URL
              </label>
              <input
                type="url"
                value={formData.thumbnail}
                onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#f5f5f0]/10 font-['Crimson_Pro'] text-[#f5f5f0] focus:border-[#ff6b35] focus:outline-none transition-colors"
                placeholder="https://..."
              />
              {formData.thumbnail && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={formData.thumbnail} alt="Preview" className="h-12 w-12 object-cover border border-[#f5f5f0]/10" />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, thumbnail: '' }))}
                    className="font-['Space_Mono'] text-[10px] text-red-500 hover:text-red-400"
                  >
                    REMOVE
                  </button>
                </div>
              )}
            </div>
            <div>
              <label className="block font-['Space_Mono'] text-xs tracking-wider text-[#ff6b35] mb-2">
                PROJECT LINK
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#f5f5f0]/10 font-['Crimson_Pro'] text-[#f5f5f0] focus:border-[#ff6b35] focus:outline-none transition-colors h-32 align-top"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Objectives */}
          <div>
            <label className="block font-['Space_Mono'] text-xs tracking-wider text-[#ff6b35] mb-2">
              OBJECTIVES
            </label>
            <div className="space-y-2">
              {formData.objectives.map((obj, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={obj}
                    onChange={(e) => updateObjective(index, e.target.value)}
                    className="flex-1 px-4 py-2 bg-[#2a2a2a] border border-[#f5f5f0]/10 font-['Crimson_Pro'] text-[#f5f5f0] focus:border-[#ff6b35] focus:outline-none transition-colors"
                    placeholder="목표"
                  />
                  {formData.objectives.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeObjective(index)}
                      className="px-3 py-2 bg-[#2a2a2a] border border-[#f5f5f0]/10 text-[#b8b8a8] hover:text-[#ff6b35] hover:border-[#ff6b35] transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addObjective}
                className="px-4 py-2 font-['Space_Mono'] text-xs tracking-wider text-[#ff6b35] border border-[#ff6b35]/30 hover:bg-[#ff6b35]/10 transition-colors"
              >
                + Add Objective
              </button>
            </div>
          </div>

          {/* Outcomes */}
          <div>
            <label className="block font-['Space_Mono'] text-xs tracking-wider text-[#ff6b35] mb-2">
              OUTCOMES
            </label>
            <div className="space-y-2">
              {formData.outcomes.map((outcome, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={outcome}
                    onChange={(e) => updateOutcome(index, e.target.value)}
                    className="flex-1 px-4 py-2 bg-[#2a2a2a] border border-[#f5f5f0]/10 font-['Crimson_Pro'] text-[#f5f5f0] focus:border-[#ff6b35] focus:outline-none transition-colors"
                    placeholder="성과"
                  />
                  {formData.outcomes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOutcome(index)}
                      className="px-3 py-2 bg-[#2a2a2a] border border-[#f5f5f0]/10 text-[#b8b8a8] hover:text-[#ff6b35] hover:border-[#ff6b35] transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addOutcome}
                className="px-4 py-2 font-['Space_Mono'] text-xs tracking-wider text-[#ff6b35] border border-[#ff6b35]/30 hover:bg-[#ff6b35]/10 transition-colors"
              >
                + Add Outcome
              </button>
            </div>
          </div>

          {/* Metrics */}
          <div>
            <label className="block font-['Space_Mono'] text-xs tracking-wider text-[#ff6b35] mb-2">
              METRICS (Optional)
            </label>
            <div className="space-y-2">
              {formData.metrics?.map((metric, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={metric.label}
                    onChange={(e) => updateMetric(index, 'label', e.target.value)}
                    className="flex-1 px-4 py-2 bg-[#2a2a2a] border border-[#f5f5f0]/10 font-['Crimson_Pro'] text-[#f5f5f0] focus:border-[#ff6b35] focus:outline-none transition-colors"
                    placeholder="Label (e.g., User Growth)"
                  />
                  <input
                    type="text"
                    value={metric.value}
                    onChange={(e) => updateMetric(index, 'value', e.target.value)}
                    className="w-32 px-4 py-2 bg-[#2a2a2a] border border-[#f5f5f0]/10 font-['Crimson_Pro'] text-[#f5f5f0] focus:border-[#ff6b35] focus:outline-none transition-colors"
                    placeholder="Value"
                  />
                  {(formData.metrics?.length || 0) > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMetric(index)}
                      className="px-3 py-2 bg-[#2a2a2a] border border-[#f5f5f0]/10 text-[#b8b8a8] hover:text-[#ff6b35] hover:border-[#ff6b35] transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addMetric}
                className="px-4 py-2 font-['Space_Mono'] text-xs tracking-wider text-[#ff6b35] border border-[#ff6b35]/30 hover:bg-[#ff6b35]/10 transition-colors"
              >
                + Add Metric
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-['Space_Mono'] text-xs tracking-wider text-[#ff6b35] mb-2">
              TAGS *
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-4 py-2 bg-[#2a2a2a] border border-[#f5f5f0]/10 font-['Crimson_Pro'] text-[#f5f5f0] focus:border-[#ff6b35] focus:outline-none transition-colors"
                placeholder="태그 입력 후 엔터"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 font-['Space_Mono'] text-xs tracking-wider text-[#ff6b35] border border-[#ff6b35]/30 hover:bg-[#ff6b35]/10 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[#2a2a2a] border border-[#f5f5f0]/10 font-['Space_Mono'] text-xs text-[#b8b8a8] flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-[#ff6b35] hover:text-[#ff8855]"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-[#f5f5f0]/10">
            <button
              type="submit"
              className="flex-1 px-8 py-4 bg-[#ff6b35] text-[#0a0a0a] font-['Space_Mono'] text-sm tracking-wider hover:bg-[#ff8855] transition-colors duration-300"
            >
              {editingProject ? 'Update Project' : 'Create Project'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-8 py-4 border border-[#f5f5f0]/20 font-['Space_Mono'] text-sm tracking-wider text-[#f5f5f0] hover:border-[#ff6b35] hover:text-[#ff6b35] transition-colors duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
