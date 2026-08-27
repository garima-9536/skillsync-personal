import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiInbox, FiSend } from 'react-icons/fi';
import CollaborationService from '../../services/CollaborationService';
import { useAuth } from '../../context/AuthContext';
import { CollaborationRequestDTO } from '../../model/Collaboration';
import LoadingSpinner from '../LoadingSpinner';
import EmptyState from '../EmptyState';

const statusCls: Record<string, string> = { PENDING: 'chip-warning', ACCEPTED: 'chip-success', REJECTED: 'chip-error' };

const CollaborationRequestsPage = () => {
  const { user } = useAuth();
  const userId = user!.userId;
  const [tab, setTab] = useState<'received' | 'sent'>('received');
  const [received, setReceived] = useState<CollaborationRequestDTO[]>([]);
  const [sent, setSent] = useState<CollaborationRequestDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    Promise.all([
      CollaborationService.getReceivedRequests(userId),
      CollaborationService.getSentRequests(userId),
    ]).then(([r, s]) => { setReceived(r); setSent(s); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const handleAccept = (id: number) => {
    CollaborationService.acceptRequest(id, userId)
      .then(() => { setReceived(prev => prev.map(r => r.requestId === id ? { ...r, status: 'ACCEPTED' } : r)); setActionMsg('Request accepted!'); })
      .catch(err => setActionMsg(err.response?.data?.errorMessage || 'Failed'));
  };

  const handleReject = (id: number) => {
    CollaborationService.rejectRequest(id, userId)
      .then(() => { setReceived(prev => prev.map(r => r.requestId === id ? { ...r, status: 'REJECTED' } : r)); setActionMsg('Request rejected'); })
      .catch(err => setActionMsg(err.response?.data?.errorMessage || 'Failed'));
  };

  const RequestRow = ({ req, showActions }: { req: CollaborationRequestDTO; showActions: boolean }) => (
    <div className="card p-4 flex items-start gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
            {showActions ? `From: ${req.senderName}` : `To: ${req.receiverName}`}
          </span>
          <span className={statusCls[req.status] || 'chip-default'}>{req.status}</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Project: <span className="font-medium text-slate-700 dark:text-slate-300">{req.projectTitle}</span></p>
        {req.message && <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{req.message}"</p>}
      </div>
      {showActions && req.status === 'PENDING' && (
        <div className="flex gap-2 flex-shrink-0">
          <button className="btn-success btn-sm" onClick={() => handleAccept(req.requestId)}><FiCheck />Accept</button>
          <button className="btn-danger btn-sm" onClick={() => handleReject(req.requestId)}><FiX />Reject</button>
        </div>
      )}
    </div>
  );

  if (loading) return <LoadingSpinner message="Loading requests…" />;
  const list = tab === 'received' ? received : sent;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-6">Collaboration Requests</h1>
      {actionMsg && <div className="alert-info mb-4">{actionMsg}</div>}
      <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
        <button className={`tab ${tab === 'received' ? 'tab-active' : 'tab-inactive'}`} onClick={() => setTab('received')}>
          <FiInbox className="inline mr-1" />Received ({received.length})
        </button>
        <button className={`tab ${tab === 'sent' ? 'tab-active' : 'tab-inactive'}`} onClick={() => setTab('sent')}>
          <FiSend className="inline mr-1" />Sent ({sent.length})
        </button>
      </div>
      {list.length === 0 ? (
        <EmptyState title={tab === 'received' ? 'No received requests' : 'No sent requests'} />
      ) : (
        <div className="flex flex-col gap-3">
          {list.map(r => <RequestRow key={r.requestId} req={r} showActions={tab === 'received'} />)}
        </div>
      )}
    </div>
  );
};

export default CollaborationRequestsPage;
