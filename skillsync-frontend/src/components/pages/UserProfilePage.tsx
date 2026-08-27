import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiMapPin, FiGithub, FiLinkedin, FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import UserService from '../../services/UserService';
import SkillService from '../../services/SkillService';
import MatchingService from '../../services/MatchingService';
import { useAuth } from '../../context/AuthContext';
import { UserDTO } from '../../model/User';
import { SkillDTO } from '../../model/Skill';
import { MatchedProjectDTO } from '../../model/Matching';
import SkillChip from '../SkillChip';
import AvailabilityBadge from '../AvailabilityBadge';
import LoadingSpinner from '../LoadingSpinner';
import EmptyState from '../EmptyState';

const proficiencyPct: Record<string, number> = { BEGINNER: 25, INTERMEDIATE: 50, ADVANCED: 75, EXPERT: 100 };
const PROFICIENCY = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

const UserProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<UserDTO | null>(null);
  const [matchingProjects, setMatchingProjects] = useState<MatchedProjectDTO[]>([]);
  const [allSkills, setAllSkills] = useState<SkillDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [addSkillId, setAddSkillId] = useState('');
  const [addProficiency, setAddProficiency] = useState('INTERMEDIATE');
  const [addYears, setAddYears] = useState(0);
  const [skillMsg, setSkillMsg] = useState('');
  const [skillError, setSkillError] = useState('');

  const isOwnProfile = authUser?.userId === Number(userId);

  useEffect(() => {
    const fetches: Promise<any>[] = [
      UserService.getUserById(Number(userId)),
      MatchingService.findMatchingProjects(Number(userId)),
    ];
    if (isOwnProfile) fetches.push(SkillService.getAllSkills());

    Promise.all(fetches)
      .then(([u, projects, skills]) => {
        setUser(u);
        setMatchingProjects(projects);
        if (skills) setAllSkills(skills);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId, isOwnProfile]);

  const handleAddSkill = () => {
    if (!addSkillId) return;
    setSkillMsg(''); setSkillError('');
    UserService.addSkill(authUser!.userId, { skillId: Number(addSkillId), proficiencyLevel: addProficiency as any, yearsExperience: addYears })
      .then(newSkill => {
        setUser(u => u ? { ...u, skills: [...(u.skills || []), newSkill] } : u);
        setAddSkillId('');
        setSkillMsg('Skill added!');
      })
      .catch(err => setSkillError(err.response?.data?.errorMessage || 'Failed to add skill'));
  };

  const handleRemoveSkill = (userSkillId: number) => {
    setSkillMsg(''); setSkillError('');
    UserService.removeSkill(authUser!.userId, userSkillId)
      .then(() => {
        setUser(u => u ? { ...u, skills: u.skills?.filter(s => s.userSkillId !== userSkillId) } : u);
        setSkillMsg('Skill removed');
      })
      .catch(err => setSkillError(err.response?.data?.errorMessage || 'Failed to remove'));
  };

  if (loading) return <LoadingSpinner message="Loading profile…" />;
  if (!user) return <div className="text-center py-24 text-slate-500 dark:text-slate-400">User not found</div>;

  const initials = user.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  const addedSkillIds = user.skills?.map(s => s.skillId) || [];
  const availableToAdd = allSkills.filter(s => !addedSkillIds.includes(s.skillId));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="card p-6 mb-6">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="avatar-2xl">{initials}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{user.fullName}</h1>
              {isOwnProfile && (
                <Link to="/profile/edit" className="btn btn-secondary btn-sm"><FiEdit2 />Edit Profile</Link>
              )}
            </div>
            {user.availabilityStatus && <AvailabilityBadge status={user.availabilityStatus as any} />}
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
              {user.location && <span className="flex items-center gap-1"><FiMapPin />{user.location}</span>}
              {user.githubUrl && <a href={user.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-pink-600"><FiGithub />GitHub</a>}
              {user.linkedinUrl && <a href={user.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-pink-600"><FiLinkedin />LinkedIn</a>}
            </div>
            {user.bio && <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{user.bio}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills card */}
        <div className="card p-6">
          <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Skills</h2>

          {skillMsg && <p className="text-xs text-emerald-600 mb-3">{skillMsg}</p>}
          {skillError && <p className="text-xs text-red-500 mb-3">{skillError}</p>}

          {user.skills?.length ? (
            <div className="flex flex-col gap-4 mb-4">
              {user.skills.map(s => (
                <div key={s.userSkillId}>
                  <div className="flex items-center justify-between mb-1">
                    <SkillChip name={s.skillName} category={s.category} />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400">{s.proficiencyLevel}{s.yearsExperience ? ` · ${s.yearsExperience}yr` : ''}</span>
                      {isOwnProfile && (
                        <button type="button" onClick={() => handleRemoveSkill(s.userSkillId)}
                          className="text-red-400 hover:text-red-600 transition-colors p-0.5" title="Remove skill">
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill bg-pink-500" style={{ width: `${proficiencyPct[s.proficiencyLevel] || 25}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-4">
              <EmptyState title="No skills added yet" />
            </div>
          )}

          {isOwnProfile && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex flex-wrap gap-2 items-end">
              <div>
                <label className="label">Add Skill</label>
                <select className="select w-36 h-10" value={addSkillId} onChange={e => setAddSkillId(e.target.value)}>
                  <option value="">Select…</option>
                  {availableToAdd.map(s => <option key={s.skillId} value={s.skillId}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Level</label>
                <select className="select w-32 h-10" value={addProficiency} onChange={e => setAddProficiency(e.target.value)}>
                  {PROFICIENCY.map(p => <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Yrs</label>
                <input type="number" className="input w-16 h-10" min={0} max={30} value={addYears} onChange={e => setAddYears(Number(e.target.value))} />
              </div>
              <button type="button" className="btn-primary btn-sm h-10" onClick={handleAddSkill} disabled={!addSkillId}>
                <FiPlus />Add
              </button>
            </div>
          )}
        </div>

        {/* Matching projects card */}
        <div className="card p-6">
          <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Matching Projects</h2>
          {matchingProjects.length ? (
            <div className="flex flex-col gap-3">
              {matchingProjects.slice(0, 5).map(mp => (
                <Link key={mp.projectId} to={`/projects/${mp.projectId}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-950/20 transition-colors border border-transparent hover:border-pink-200 dark:hover:border-pink-800">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{mp.title}</span>
                  <span className="chip chip-primary text-xs ml-2 flex-shrink-0">{mp.matchScore}%</span>
                </Link>
              ))}
            </div>
          ) : <EmptyState title="No matching projects" />}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
