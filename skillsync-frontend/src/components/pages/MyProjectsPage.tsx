import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlusCircle } from 'react-icons/fi';
import ProjectService from '../../services/ProjectService';
import { useAuth } from '../../context/AuthContext';
import { ProjectSummaryDTO } from '../../model/Project';
import ProjectCard from '../ProjectCard';
import LoadingSpinner from '../LoadingSpinner';
import EmptyState from '../EmptyState';

const MyProjectsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user!.userId;
  const [projects, setProjects] = useState<ProjectSummaryDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ProjectService.getMyProjects(userId)
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <LoadingSpinner message="Loading your projects…" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">My Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Projects you own or manage</p>
        </div>
        <button type="button" className="btn-primary btn-sm" onClick={() => navigate('/projects/create')}>
          <FiPlusCircle className="w-3.5 h-3.5" />New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create your first project and start building a team"
          actionLabel="Create Project"
          onAction={() => navigate('/projects/create')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map(p => <ProjectCard key={p.projectId} project={p} />)}
        </div>
      )}
    </div>
  );
};

export default MyProjectsPage;
