import React, { useState, useEffect } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import ProjectService from '../../services/ProjectService';
import { useAuth } from '../../context/AuthContext';
import { ApplicationDTO } from '../../model/Application';
import LoadingSpinner from '../LoadingSpinner';
import EmptyState from '../EmptyState';

const statusCls: Record<string, string> = { PENDING: 'chip-warning', ACCEPTED: 'chip-success', REJECTED: 'chip-error' };

const ApplicationsPage = () => {
  const { user } = useAuth();
  const userId = user!.userId;
  const [tab, setTab] = useState<'mine' | 'received'>('mine');
  const [mine, setMine] = useState<ApplicationDTO[]>([]);
  const [received, setReceived] = useState<ApplicationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    const myApps = ProjectService.getMyApplications(userId).catch(() => [] as any[]);
    const recvApps = ProjectService.getMyProjects(userId)
      .then(projects => {
        if (!projects || projects.length === 0) return [] as any[];
        return Promise.all(
          projects.map((p: any) => ProjectService.getApplications(p.projectId, userId).catch(() => [] as any[]))
        ).then(nested => nested.flat());
      })
      .catch(() => [] as any[]);

    Promise.all([myApps, recvApps])
      .then(([my, recv]) => { setMine(my); setReceived(recv); })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleAccept = (projectId: number, applicationId: number) => {
    ProjectService.acceptApplication(projectId, applicationId, userId)
      .then(() => { setReceived(prev => prev.map(a => a.applicationId === applicationId ? { ...a, status: 'ACCEPTED' } : a)); setActionMsg('Applicant accepted!'); })
      .catch(err => setActionMsg(err.response?.data?.errorMessage || 'Failed'));
  };

  const handleReject = (projectId: number, applicationId: number) => {
    ProjectService.rejectApplication(projectId, applicationId, userId)
      .then(() => { setReceived(prev => prev.map(a => a.applicationId === applicationId ? { ...a, status: 'REJECTED' } : a)); setActionMsg('Application rejected'); })
      .catch(err => setActionMsg(err.response?.data?.errorMessage || 'Failed'));
  };

  if (loading) return <LoadingSpinner message="Loading applications…" />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-6">Applications</h1>
      {actionMsg && <div className="alert-info mb-4">{actionMsg}</div>}
      <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
        <button type="button" className={`tab ${tab === 'mine' ? 'tab-active' : 'tab-inactive'}`} onClick={() => setTab('mine')}>
          My Applications ({mine.length})
        </button>
        <button type="button" className={`tab ${tab === 'received' ? 'tab-active' : 'tab-inactive'}`} onClick={() => setTab('received')}>
          Applications Received ({received.length})
        </button>
      </div>

      {tab === 'mine' && (
        mine.length === 0 ? <EmptyState title="You haven't applied to any projects" /> : (
          <div className="flex flex-col gap-3">
            {mine.map(a => (
              <div key={a.applicationId} className="card p-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{a.projectTitle}</span>
                    <span className={statusCls[a.status] || 'chip-default'}>{a.status}</span>
                  </div>
                  {a.message && <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{a.message}"</p>}
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{new Date(a.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'received' && (
        received.length === 0 ? <EmptyState title="No applications received" /> : (
          <div className="flex flex-col gap-3">
            {received.map(a => (
              <div key={a.applicationId} className="card p-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{a.applicantName}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">→ {a.projectTitle}</span>
                    <span className={statusCls[a.status] || 'chip-default'}>{a.status}</span>
                  </div>
                  {a.message && <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{a.message}"</p>}
                </div>
                {a.status === 'PENDING' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button type="button" className="btn-success btn-sm" onClick={() => handleAccept(a.projectId, a.applicationId)}><FiCheck />Accept</button>
                    <button type="button" className="btn-danger btn-sm" onClick={() => handleReject(a.projectId, a.applicationId)}><FiX />Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default ApplicationsPage;
