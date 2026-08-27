import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import UserService from '../../services/UserService';
import SkillService from '../../services/SkillService';
import { useAuth } from '../../context/AuthContext';
import { UserDTO } from '../../model/User';
import { SkillDTO, UserSkillDTO } from '../../model/Skill';
import SkillChip from '../SkillChip';
import LoadingSpinner from '../LoadingSpinner';

const AVAILABILITY = ['OPEN', 'PART_TIME', 'BUSY'];
const PROFICIENCY = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

const EditProfilePage = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const userId = authUser!.userId;
  const [user, setUser] = useState<UserDTO | null>(null);
  const [skills, setSkills] = useState<SkillDTO[]>([]);
  const [form, setForm] = useState({ fullName: '', bio: '', location: '', githubUrl: '', linkedinUrl: '', availabilityStatus: 'OPEN' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addSkillId, setAddSkillId] = useState('');
  const [addProficiency, setAddProficiency] = useState('INTERMEDIATE');
  const [addYears, setAddYears] = useState(0);
  const [apiMsg, setApiMsg] = useState('');
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    Promise.all([UserService.getUserById(userId), SkillService.getAllSkills()])
      .then(([u, allSkills]) => {
        setUser(u);
        setForm({ fullName: u.fullName || '', bio: u.bio || '', location: u.location || '', githubUrl: u.githubUrl || '', linkedinUrl: u.linkedinUrl || '', availabilityStatus: u.availabilityStatus || 'OPEN' });
        setSkills(allSkills);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setApiError('');
    UserService.updateUser(userId, form)
      .then(() => { setApiMsg('Profile updated!'); setSaving(false); })
      .catch(err => { setApiError(err.response?.data?.errorMessage || 'Failed to save'); setSaving(false); });
  };

  const handleAddSkill = () => {
    if (!addSkillId) return;
    UserService.addSkill(userId, { skillId: Number(addSkillId), proficiencyLevel: addProficiency, yearsExperience: addYears })
      .then(newSkill => {
        setUser(u => u ? { ...u, skills: [...(u.skills || []), newSkill] } : u);
        setAddSkillId('');
        setApiMsg('Skill added!');
      })
      .catch(err => setApiError(err.response?.data?.errorMessage || 'Failed to add skill'));
  };

  const handleRemoveSkill = (userSkillId: number) => {
    UserService.removeSkill(userId, userSkillId)
      .then(() => setUser(u => u ? { ...u, skills: u.skills?.filter(s => s.userSkillId !== userSkillId) } : u))
      .catch(err => setApiError(err.response?.data?.errorMessage || 'Failed to remove'));
  };

  if (loading) return <LoadingSpinner message="Loading profile…" />;
  if (!user) return null;

  const addedSkillIds = user.skills?.map(s => s.skillId) || [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-6">Edit Profile</h1>
      {apiMsg && <div className="alert-success mb-4">{apiMsg}</div>}
      {apiError && <div className="alert-error mb-4">{apiError}</div>}

      <form onSubmit={handleSave} className="card p-6 flex flex-col gap-4 mb-6">
        <h2 className="font-bold text-slate-700 dark:text-slate-300">Personal Info</h2>
        {(['fullName', 'location', 'githubUrl', 'linkedinUrl'] as const).map(f => (
          <div key={f}>
            <label className="label">{f === 'fullName' ? 'Full Name' : f === 'githubUrl' ? 'GitHub URL' : f === 'linkedinUrl' ? 'LinkedIn URL' : 'Location'}</label>
            <input className="input" value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))} />
          </div>
        ))}
        <div>
          <label className="label">Bio</label>
          <textarea className="input h-24 resize-none" value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} />
        </div>
        <div>
          <label className="label">Availability</label>
          <select className="select w-56" value={form.availabilityStatus} onChange={e => setForm(p => ({ ...p, availabilityStatus: e.target.value }))}>
            {AVAILABILITY.map(a => <option key={a} value={a}>{a.replace('_', ' ')}</option>)}
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" className="btn btn-secondary" onClick={() => navigate(`/users/${userId}`)}>Cancel</button>
          <button type="submit" className={`btn-primary flex-1 ${saving ? 'btn-disabled' : ''}`} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
        </div>
      </form>

      <div className="card p-6">
        <h2 className="font-bold text-slate-700 dark:text-slate-300 mb-4">My Skills</h2>
        {user.skills?.length ? (
          <div className="flex flex-wrap gap-2 mb-4">
            {user.skills.map(s => (
              <div key={s.userSkillId} className="flex items-center gap-1">
                <SkillChip name={s.skillName} category={s.category} proficiency={s.proficiencyLevel} size="medium" />
                <button type="button" onClick={() => handleRemoveSkill(s.userSkillId)} className="text-red-400 hover:text-red-600 p-0.5"><FiTrash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2 items-end pt-3 border-t border-slate-100 dark:border-slate-700">
          <div>
            <label className="label">Add Skill</label>
            <select className="select w-44" value={addSkillId} onChange={e => setAddSkillId(e.target.value)}>
              <option value="">Select skill</option>
              {skills.filter(s => !addedSkillIds.includes(s.skillId)).map(s => (
                <option key={s.skillId} value={s.skillId}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Proficiency</label>
            <select className="select w-40" value={addProficiency} onChange={e => setAddProficiency(e.target.value)}>
              {PROFICIENCY.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Years Exp.</label>
            <input type="number" className="input w-20" min={0} max={30} value={addYears} onChange={e => setAddYears(Number(e.target.value))} />
          </div>
          <button type="button" className="btn-primary btn-sm" onClick={handleAddSkill}><FiPlus />Add</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
