import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiArrowRight } from 'react-icons/fi';
import { UserSummaryDTO } from '../model/User';
import AvailabilityBadge from './AvailabilityBadge';
import SkillChip from './SkillChip';
import MatchScoreBar from './MatchScoreBar';

interface UserCardProps {
  user: UserSummaryDTO;
  matchScore?: number;
}

const AVATAR_COLORS = [
  'from-pink-500 to-rose-600',
  'from-fuchsia-500 to-pink-600',
  'from-rose-500 to-pink-700',
  'from-pink-400 to-fuchsia-600',
  'from-purple-500 to-pink-500',
  'from-pink-600 to-rose-700',
];

const UserCard = ({ user, matchScore }: UserCardProps) => {
  const navigate = useNavigate();
  const initials = user.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  const colorClass = AVATAR_COLORS[(user.userId || 0) % AVATAR_COLORS.length];

  return (
    <div
      className="card group cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-pink-300 dark:hover:border-pink-700 overflow-hidden"
      onClick={() => navigate(`/users/${user.userId}`)}>

      {/* header band */}
      <div className="h-12 bg-gradient-to-r from-pink-50 to-rose-50 border-b border-slate-100 dark:from-slate-700 dark:to-slate-700 dark:border-slate-600" />

      <div className="px-5 pb-5 flex flex-col gap-3">
        {/* avatar pulled up over the band */}
        <div className="-mt-6 flex items-end justify-between">
          <div className={`avatar w-14 h-14 text-lg rounded-2xl bg-gradient-to-br ${colorClass} shadow-md ring-2 ring-white dark:ring-slate-800`}>
            {initials}
          </div>
          {user.availabilityStatus && (
            <AvailabilityBadge status={user.availabilityStatus as any} />
          )}
        </div>

        {/* name & location */}
        <div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base group-hover:text-pink-700 dark:group-hover:text-pink-400 transition-colors leading-snug">
            {user.fullName}
          </h3>
          {user.location && (
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <FiMapPin className="w-3 h-3 flex-shrink-0" />{user.location}
            </p>
          )}
        </div>

        {matchScore !== undefined && <MatchScoreBar score={matchScore} />}

        {/* skill chips */}
        {user.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {user.skills.slice(0, 3).map((s: any) => (
              <SkillChip key={s.userSkillId ?? s.skillId} name={s.skillName ?? s.name} category={s.category} proficiency={s.proficiencyLevel} />
            ))}
            {user.skills.length > 3 && (
              <span className="chip chip-default">+{user.skills.length - 3}</span>
            )}
          </div>
        )}

        {/* view link */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex justify-end">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 group-hover:text-pink-600 dark:group-hover:text-pink-400 flex items-center gap-0.5 transition-colors">
            View profile <FiArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
