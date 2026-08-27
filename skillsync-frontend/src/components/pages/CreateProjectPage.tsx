import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiX } from 'react-icons/fi';
import ProjectService from '../../services/ProjectService';
import SkillService from '../../services/SkillService';
import { useAuth } from '../../context/AuthContext';
import { SkillDTO } from '../../model/Skill';
import SkillChip from '../SkillChip';

const CreateProjectPage = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', maxTeamSize: 5 });
  const [skills, setSkills] = useState<SkillDTO[]>([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { SkillService.getAllSkills().then(setSkills).catch(() => {}); }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (form.maxTeamSize < 2 || form.maxTeamSize > 20) e.maxTeamSize = 'Team size must be between 2 and 20';
    return e;
  };

  const toggleSkill = (id: number) => {
    setSelectedSkillIds(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    ProjectService.createProject(authUser!.userId, { ...form, requiredSkillIds: selectedSkillIds })
      .then(p => navigate(`/projects/${p.projectId}`))
      .catch(err => { setApiError(err.response?.data?.errorMessage || 'Failed to create project'); setLoading(false); });
  };

  const selectedSkills = skills.filter(s => selectedSkillIds.includes(s.skillId));

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-6">Create New Project</h1>
      {apiError && <div className="alert-error mb-4">{apiError}</div>}
      <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-5">
        <div>
          <label className="label">Project Title</label>
          <input className={`input ${errors.title ? 'border-red-400' : ''}`} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. AI-powered task manager" />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className={`input h-32 resize-none ${errors.description ? 'border-red-400' : ''}`} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What is this project about?" />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
        </div>
        <div>
          <label className="label">Max Team Size</label>
          <input type="number" className={`input w-32 ${errors.maxTeamSize ? 'border-red-400' : ''}`} value={form.maxTeamSize} min={2} max={20} onChange={e => setForm(f => ({ ...f, maxTeamSize: Number(e.target.value) }))} />
          {errors.maxTeamSize && <p className="text-xs text-red-500 mt-1">{errors.maxTeamSize}</p>}
        </div>
        <div>
          <label className="label">Required Skills</label>
          {selectedSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedSkills.map(s => (
                <SkillChip key={s.skillId} name={s.name} category={s.category} size="medium"
                  onDelete={() => toggleSkill(s.skillId)} />
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg p-3">
            {skills.map(s => (
              <button key={s.skillId} type="button" onClick={() => toggleSkill(s.skillId)}
                className={`chip cursor-pointer transition-all ${selectedSkillIds.includes(s.skillId) ? 'chip-primary ring-2 ring-pink-400 dark:ring-pink-600' : 'chip-default hover:chip-primary'}`}>
                {!selectedSkillIds.includes(s.skillId) && <FiPlus className="w-3 h-3" />}
                {s.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/projects')}>Cancel</button>
          <button type="submit" className={`btn-primary flex-1 ${loading ? 'btn-disabled' : ''}`} disabled={loading}>
            {loading ? 'Creating…' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectPage;
