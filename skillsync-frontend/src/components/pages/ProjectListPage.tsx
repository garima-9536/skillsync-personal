import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter } from 'react-icons/fi';
import ProjectService from '../../services/ProjectService';
import SkillService from '../../services/SkillService';
import ProjectCard from '../ProjectCard';
import PaginationControl from '../PaginationControl';
import LoadingSpinner from '../LoadingSpinner';
import EmptyState from '../EmptyState';
import { ProjectSummaryDTO } from '../../model/Project';
import { SkillDTO } from '../../model/Skill';

const STATUSES = ['', 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'CLOSED'];

const ProjectListPage = () => {
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState<ProjectSummaryDTO[]>([]);
  const [skills, setSkills] = useState<SkillDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [skillId, setSkillId] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    SkillService.getAllSkills().then(setSkills).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    ProjectService.getProjects({ search, skillId: skillId ? Number(skillId) : undefined, status: status || undefined, page, size: 9 })
      .then(data => { setProjects(data.content || []); setTotalPages(data.totalPages || 0); })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, [search, skillId, status, page]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(0); };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-6">Browse Projects</h1>
      <form onSubmit={handleSearch} className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-56 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects…" className="input pl-9" />
        </div>
        <select value={skillId} onChange={e => { setSkillId(e.target.value); setPage(0); }} className="select w-48">
          <option value="">All Skills</option>
          {skills.map(s => <option key={s.skillId} value={s.skillId}>{s.name}</option>)}
        </select>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(0); }} className="select w-44">
          <option value="">All Statuses</option>
          {STATUSES.slice(1).map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        <button type="submit" className="btn-primary btn-sm"><FiFilter />Filter</button>
      </form>

      {loading ? <LoadingSpinner /> : projects.length === 0 ? (
        <EmptyState title="No projects found" description="Try adjusting your filters" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map(p => <ProjectCard key={p.projectId} project={p} />)}
          </div>
          <PaginationControl page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default ProjectListPage;
