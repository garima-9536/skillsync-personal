import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiArrowRight } from 'react-icons/fi';
import { ProjectSummaryDTO } from '../model/Project';
import SkillChip from './SkillChip';

const STATUS_CONFIG: Record<string, { label: string; cls: string; bar: string }> = {
  OPEN:        { label: 'Open',        cls: 'chip-success',  bar: 'bg-emerald-500' },
  IN_PROGRESS: { label: 'In Progress', cls: 'chip-primary',  bar: 'bg-indigo-500' },
  COMPLETED:   { label: 'Completed',   cls: 'chip-default',  bar: 'bg-slate-400' },
  CLOSED:      { label: 'Closed',      cls: 'chip-error',    bar: 'bg-red-400' },
};

const ProjectCard = ({ project }: { project: ProjectSummaryDTO }) => {
  const navigate = useNavigate();
  const cfg = STATUS_CONFIG[project.status] || { label: project.status, cls: 'chip-default', bar: 'bg-slate-400' };
  const fill = project.maxTeamSize > 0 ? Math.round((project.memberCount / project.maxTeamSize) * 100) : 0;

  return (
    <div
      className="card group cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-pink-300 dark:hover:border-pink-700 flex flex-col overflow-hidden"
      onClick={() => navigate(`/projects/${project.projectId}`)}>

      {/* coloured top accent bar */}
      <div className={`h-1 w-full ${cfg.bar}`} />

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* title row */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug line-clamp-2 flex-1 group-hover:text-pink-700 dark:group-hover:text-pink-400 transition-colors">
            {project.title}
          </h3>
          <span className={`${cfg.cls} flex-shrink-0`}>{cfg.label}</span>
        </div>

        {project.ownerName && (
          <p className="text-xs text-slate-500 dark:text-slate-400">by <span className="font-medium text-slate-700 dark:text-slate-300">{project.ownerName}</span></p>
        )}

        {/* skill chips */}
        {project.requiredSkills?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.requiredSkills.slice(0, 4).map(s => (
              <SkillChip key={s.skillId} name={s.name} category={s.category} />
            ))}
            {project.requiredSkills.length > 4 && (
              <span className="chip chip-default">+{project.requiredSkills.length - 4}</span>
            )}
          </div>
        )}

        {/* team fill bar */}
        <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <FiUsers className="w-3.5 h-3.5" />
              <span className="font-medium text-slate-700 dark:text-slate-300">{project.memberCount}</span>/{project.maxTeamSize} members
            </span>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 group-hover:text-pink-600 dark:group-hover:text-pink-400 flex items-center gap-0.5 transition-colors">
              View <FiArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
          <div className="progress-bar h-1.5">
            <div className={`progress-fill ${cfg.bar} opacity-70`} style={{ width: `${fill}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
