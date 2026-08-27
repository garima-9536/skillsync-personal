import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiBriefcase, FiInbox, FiCheckSquare, FiPlusCircle, FiArrowRight, FiUser } from 'react-icons/fi';
import ProjectService from '../../services/ProjectService';
import CollaborationService from '../../services/CollaborationService';
import { useAuth } from '../../context/AuthContext';
import { ProjectSummaryDTO } from '../../model/Project';
import ProjectCard from '../ProjectCard';
import LoadingSpinner from '../LoadingSpinner';
import EmptyState from '../EmptyState';

const AVATAR_COLORS = [
  'from-pink-500 to-rose-600',
  'from-fuchsia-500 to-pink-600',
  'from-rose-500 to-pink-700',
  'from-pink-400 to-fuchsia-600',
  'from-purple-500 to-pink-500',
];

const DashboardPage = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const userId = authUser!.userId;
  const [myProjects, setMyProjects] = useState<ProjectSummaryDTO[]>([]);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [pendingApplications, setPendingApplications] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ProjectService.getMyProjects(userId),
      CollaborationService.getReceivedRequests(userId),
      ProjectService.getMyApplications(userId),
    ]).then(([projects, requests, apps]) => {
      setMyProjects(projects);
      setPendingRequests(requests.filter((r: any) => r.status === 'PENDING').length);
      setPendingApplications(apps.filter((a: any) => a.status === 'PENDING').length);
    }).catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <LoadingSpinner message="Loading dashboard…" />;

  const initials = authUser?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  const colorClass = AVATAR_COLORS[(userId || 0) % AVATAR_COLORS.length];
  const firstName = authUser?.fullName?.split(' ')[0] || 'there';

  const STATS = [
    {
      icon: <FiBriefcase className="w-6 h-6" />,
      value: myProjects.length,
      label: 'My Projects',
      color: 'bg-pink-100 text-pink-600',
      border: 'border-pink-200',
      href: '/my-projects',
    },
    {
      icon: <FiInbox className="w-6 h-6" />,
      value: pendingRequests,
      label: 'Pending Requests',
      color: 'bg-amber-100 text-amber-600',
      border: 'border-amber-200',
      href: '/requests',
      badge: pendingRequests > 0,
    },
    {
      icon: <FiCheckSquare className="w-6 h-6" />,
      value: pendingApplications,
      label: 'Pending Applications',
      color: 'bg-emerald-100 text-emerald-600',
      border: 'border-emerald-200',
      href: '/applications',
      badge: pendingApplications > 0,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">

      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-pink-800 via-rose-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-2xl font-extrabold shadow-lg ring-2 ring-white/30`}>
              {initials}
            </div>
            <div>
              <p className="text-rose-200 text-sm font-medium">Welcome back</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold">{firstName}!</h1>
              <p className="text-rose-200 text-sm mt-0.5">{authUser?.email}</p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-2">
              <Link to={`/users/${userId}`} className="btn bg-white/10 hover:bg-white/20 text-white border border-white/20 btn-sm backdrop-blur hidden sm:flex">
                <FiUser className="w-4 h-4" />View Profile
              </Link>
              <Link to="/profile/edit" className="btn bg-white text-pink-700 hover:bg-pink-50 font-bold btn-sm shadow dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600">
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 -mt-4">
          {STATS.map(s => (
            <button type="button" key={s.label}
              className={`card p-5 flex items-center gap-4 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all text-left border ${s.border} relative overflow-hidden group`}
              onClick={() => navigate(s.href)}>
              <div className={`icon-box ${s.color} group-hover:scale-110 transition-transform`}>{s.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{s.value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
              </div>
              {s.badge && (
                <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              )}
              <FiArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-pink-500 dark:group-hover:text-pink-400 group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>

        {/* My Projects */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">My Projects</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Projects you own or manage</p>
          </div>
          <button type="button" className="btn-primary btn-sm" onClick={() => navigate('/projects/create')}>
            <FiPlusCircle className="w-3.5 h-3.5" />New Project
          </button>
        </div>

        {myProjects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Create your first project and start building a team"
            actionLabel="Create Project"
            onAction={() => navigate('/projects/create')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {myProjects.map(p => <ProjectCard key={p.projectId} project={p} />)}
          </div>
        )}

        {/* Quick links */}
        <div className="mt-10 border-t border-slate-200 dark:border-slate-700 pt-8">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-secondary btn-sm" onClick={() => navigate('/teammates')}>
              <FiUser className="w-3.5 h-3.5" />Find Teammates
            </button>
            <button type="button" className="btn-secondary btn-sm" onClick={() => navigate('/projects')}>
              <FiBriefcase className="w-3.5 h-3.5" />Browse Projects
            </button>
            <button type="button" className="btn-secondary btn-sm" onClick={() => navigate('/requests')}>
              <FiInbox className="w-3.5 h-3.5" />Collaboration Requests
            </button>
            <button type="button" className="btn-secondary btn-sm" onClick={() => navigate('/applications')}>
              <FiCheckSquare className="w-3.5 h-3.5" />Applications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
