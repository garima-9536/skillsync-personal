import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import ProjectService from '../../services/ProjectService';
import SkillService from '../../services/SkillService';
import { useAuth } from '../../context/AuthContext';
import { SkillDTO } from '../../model/Skill';
import SkillChip from '../SkillChip';
import LoadingSpinner from '../LoadingSpinner';

const STATUSES = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CLOSED'];

const EditProjectPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', maxTeamSize: 5, status: 'OPEN' });
  const [skills, setSkills] = useState<SkillDTO[]>([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    Promise.all([
      ProjectService.getProjectById(Number(projectId)),
      SkillService.getAllSkills(),
    ]).then(([project, allSkills]) => {
      setForm({ title: project.title, description: project.description, maxTeamSize: project.maxTeamSize, status: project.status });
      setSelectedSkillIds(project.requiredSkills?.map((s: any) => s.skillId) || []);
      setSkills(allSkills);
    }).catch(() => navigate('/projects'))
      .finally(() => setLoading(false));
  }, [projectId]);

  const toggleSkill = (id: number) => {
    setSelectedSkillIds(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setApiError('Title is required'); return; }
    setSaving(true);
    ProjectService.updateProject(Number(projectId), authUser!.userId, { ...form, requiredSkillIds: selectedSkillIds })
      .then(p => navigate(`/projects/${p.projectId}`))
      .catch(err => { setApiError(err.response?.data?.errorMessage || 'Failed to update'); setSaving(false); });
  };

  if (loading) return <LoadingSpinner message="Loading project…" />;

  const selectedSkills = skills.filter(s => selectedSkillIds.includes(s.skillId));

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-6">Edit Project</h1>
      {apiError && <div className="alert-error mb-4">{apiError}</div>}
      <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-5">
        <div>
          <label className="label">Title</label>
          <input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input h-32 resize-none" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="label">Status</label>
            <select className="select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Max Team Size</label>
            <input type="number" className="input w-24" value={form.maxTeamSize} min={2} max={20} onChange={e => setForm(f => ({ ...f, maxTeamSize: Number(e.target.value) }))} />
          </div>
        </div>
        <div>
          <label className="label">Required Skills</label>
          {selectedSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedSkills.map(s => <SkillChip key={s.skillId} name={s.name} category={s.category} size="medium" onDelete={() => toggleSkill(s.skillId)} />)}
            </div>
          )}
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg p-3">
            {skills.map(s => (
              <button key={s.skillId} type="button" onClick={() => toggleSkill(s.skillId)}
                className={`chip cursor-pointer ${selectedSkillIds.includes(s.skillId) ? 'chip-primary ring-2 ring-pink-400 dark:ring-pink-600' : 'chip-default hover:chip-primary'}`}>
                {!selectedSkillIds.includes(s.skillId) && <FiPlus className="w-3 h-3" />}
                {s.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" className="btn btn-secondary" onClick={() => navigate(`/projects/${projectId}`)}>Cancel</button>
          <button type="submit" className={`btn-primary flex-1 ${saving ? 'btn-disabled' : ''}`} disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProjectPage;
