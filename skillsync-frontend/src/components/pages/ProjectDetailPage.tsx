import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiUsers, FiSend, FiEdit2, FiCheckCircle, FiSearch, FiX } from 'react-icons/fi';
import ProjectService from '../../services/ProjectService';
import CollaborationService from '../../services/CollaborationService';
import UserService from '../../services/UserService';
import { useAuth } from '../../context/AuthContext';
import { ProjectDTO } from '../../model/Project';
import { UserSummaryDTO } from '../../model/User';
import SkillChip from '../SkillChip';
import LoadingSpinner from '../LoadingSpinner';

const statusCls: Record<string, string> = { OPEN: 'chip-success', IN_PROGRESS: 'chip-primary', COMPLETED: 'chip-default', CLOSED: 'chip-error' };

const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user: authUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyMsg, setApplyMsg] = useState('');
  const [applyOpen, setApplyOpen] = useState(false);
  const [applied, setApplied] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteMsg, setInviteMsg] = useState('');
  const [inviteSearch, setInviteSearch] = useState('');
  const [inviteUsers, setInviteUsers] = useState<UserSummaryDTO[]>([]);
  const [inviteUsersLoading, setInviteUsersLoading] = useState(false);
  const [selectedInviteUser, setSelectedInviteUser] = useState<UserSummaryDTO | null>(null);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    ProjectService.getProjectById(Number(projectId))
      .then(setProject)
      .catch(() => navigate('/projects'))
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return <LoadingSpinner message="Loading project…" />;
  if (!project) return null;

  const userId = authUser?.userId;
  const isOwner = userId === project.ownerId;
  const isMember = project.members?.some(m => m.userId === userId);
  const canApply = !isOwner && !isMember && !applied && project.status === 'OPEN' && isAuthenticated;

  const handleApply = () => {
    ProjectService.applyToProject(project.projectId, Number(userId), applyMsg)
      .then(() => { setApplied(true); setApplyOpen(false); setActionMsg('Application submitted!'); })
      .catch(err => setActionMsg(err.response?.data?.errorMessage || 'Failed to apply'));
  };

  const openInviteDialog = () => {
    setInviteOpen(true);
    setSelectedInviteUser(null);
    setInviteSearch('');
    setInviteMsg('');
    setInviteUsersLoading(true);
    const memberIds = new Set((project.members || []).map(m => m.userId));
    UserService.searchUsers({ size: 100 })
      .then(page => {
        setInviteUsers(page.content.filter(u => !memberIds.has(u.userId)));
      })
      .catch(() => setInviteUsers([]))
      .finally(() => setInviteUsersLoading(false));
  };

  const handleInvite = () => {
    if (!selectedInviteUser) return;
    CollaborationService.sendRequest(Number(userId), { projectId: project.projectId, receiverId: selectedInviteUser.userId, message: inviteMsg })
      .then(() => { setInviteOpen(false); setActionMsg('Invitation sent to ' + selectedInviteUser.fullName + '!'); setSelectedInviteUser(null); })
      .catch(err => setActionMsg(err.response?.data?.errorMessage || 'Failed to send invitation'));
  };

  const filteredInviteUsers = inviteUsers.filter(u =>
    u.fullName.toLowerCase().includes(inviteSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(inviteSearch.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{project.title}</h1>
            <span className={statusCls[project.status] || 'chip-default'}>{project.status?.replace('_', ' ')}</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">by {project.ownerName}</p>
        </div>
        {isOwner && (
          <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/projects/${project.projectId}/edit`)}>
            <FiEdit2 />Edit
          </button>
        )}
      </div>

      {actionMsg && <div className="alert-info mb-4">{actionMsg}</div>}

      <div className="card p-6 mb-6">
        <h2 className="font-bold text-slate-700 dark:text-slate-300 mb-2">About this project</h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{project.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card p-6">
          <h2 className="font-bold text-slate-700 dark:text-slate-300 mb-3">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {project.requiredSkills?.map(s => <SkillChip key={s.skillId} name={s.name} category={s.category} size="medium" />) || <p className="text-slate-400 text-sm">No skills listed</p>}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2"><FiUsers />Team ({project.members?.length || 0}/{project.maxTeamSize})</h2>
          <div className="flex flex-col gap-2">
            {project.members?.map(m => (
              <div key={m.userId} className="flex items-center gap-2">
                <div className="avatar-sm">{m.fullName?.charAt(0).toUpperCase()}</div>
                <span className="text-sm text-slate-700 dark:text-slate-300">{m.fullName}</span>
                {m.role === 'OWNER' && <span className="chip chip-primary">Owner</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {isAuthenticated && (
        <div className="flex flex-wrap gap-3">
          {canApply && !applied && (
            <button className="btn-primary" onClick={() => setApplyOpen(true)}><FiSend />Apply to Join</button>
          )}
          {applied && (
            <span className="flex items-center gap-2 chip chip-warning text-sm px-3 py-1.5"><FiCheckCircle />Application Pending</span>
          )}
          {isMember && !isOwner && (
            <span className="flex items-center gap-2 chip chip-success text-sm px-3 py-1.5"><FiCheckCircle />You're a member</span>
          )}
          {isOwner && project.status === 'OPEN' && (
            <button className="btn btn-secondary" onClick={openInviteDialog}><FiSend />Invite Someone</button>
          )}
        </div>
      )}

      {applyOpen && (
        <div className="dialog-overlay" onClick={() => setApplyOpen(false)}>
          <div className="dialog-box" onClick={e => e.stopPropagation()}>
            <div className="dialog-header"><h3 className="font-bold text-slate-900 dark:text-slate-100">Apply to Join</h3></div>
            <div className="dialog-body">
              <label className="label">Message (optional)</label>
              <textarea className="input h-28 resize-none" value={applyMsg} onChange={e => setApplyMsg(e.target.value)} placeholder="Tell the owner why you'd be a great fit…" />
            </div>
            <div className="dialog-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => setApplyOpen(false)}>Cancel</button>
              <button className="btn-primary btn-sm" onClick={handleApply}>Submit Application</button>
            </div>
          </div>
        </div>
      )}

      {inviteOpen && (
        <div className="dialog-overlay" onClick={() => setInviteOpen(false)}>
          <div className="dialog-box max-w-md" onClick={e => e.stopPropagation()}>
            <div className="dialog-header">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Invite Someone</h3>
              <button type="button" className="btn-ghost btn-sm p-1" onClick={() => setInviteOpen(false)}><FiX /></button>
            </div>
            <div className="dialog-body flex flex-col gap-3">
              {selectedInviteUser ? (
                <div className="flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-950/30 rounded-xl border border-pink-200 dark:border-pink-800">
                  <div className="avatar-sm">{selectedInviteUser.fullName.charAt(0).toUpperCase()}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">{selectedInviteUser.fullName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{selectedInviteUser.email}</p>
                  </div>
                  <button type="button" className="btn-ghost btn-sm p-1 text-slate-400" onClick={() => setSelectedInviteUser(null)}><FiX /></button>
                </div>
              ) : (
                <div>
                  <label className="label">Search for a teammate</label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input className="input pl-9" value={inviteSearch} onChange={e => setInviteSearch(e.target.value)} placeholder="Name or email…" autoFocus />
                  </div>
                  <div className="mt-2 max-h-44 overflow-y-auto flex flex-col gap-1">
                    {inviteUsersLoading ? (
                      <p className="text-sm text-slate-400 py-4 text-center">Loading users…</p>
                    ) : filteredInviteUsers.length === 0 ? (
                      <p className="text-sm text-slate-400 py-4 text-center">No users found</p>
                    ) : filteredInviteUsers.map(u => (
                      <button key={u.userId} type="button"
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-pink-50 dark:hover:bg-slate-700 text-left transition-colors w-full"
                        onClick={() => setSelectedInviteUser(u)}>
                        <div className="avatar-sm flex-shrink-0">{u.fullName.charAt(0).toUpperCase()}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{u.fullName}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{u.email}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="label">Message <span className="text-slate-400 font-normal">(optional)</span></label>
                <textarea className="input h-20 resize-none" value={inviteMsg} onChange={e => setInviteMsg(e.target.value)} placeholder="Write a personal message…" />
              </div>
            </div>
            <div className="dialog-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => setInviteOpen(false)}>Cancel</button>
              <button className="btn-primary btn-sm" onClick={handleInvite} disabled={!selectedInviteUser}>Send Invite</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
