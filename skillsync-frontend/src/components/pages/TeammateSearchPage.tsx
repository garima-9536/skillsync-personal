import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import UserService from '../../services/UserService';
import MatchingService from '../../services/MatchingService';
import SkillService from '../../services/SkillService';
import { useAuth } from '../../context/AuthContext';
import { UserSummaryDTO } from '../../model/User';
import { SkillDTO } from '../../model/Skill';
import UserCard from '../UserCard';
import PaginationControl from '../PaginationControl';
import LoadingSpinner from '../LoadingSpinner';
import EmptyState from '../EmptyState';

const AVAIL_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Open', value: 'OPEN' },
  { label: 'Part-time', value: 'PART_TIME' },
];

const TeammateSearchPage = () => {
  const { user: authUser, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<UserSummaryDTO[]>([]);
  const [skills, setSkills] = useState<SkillDTO[]>([]);
  const [skillIds, setSkillIds] = useState<number[]>([]);
  const [availability, setAvailability] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchScores, setMatchScores] = useState<Record<number, number>>({});

  useEffect(() => { SkillService.getAllSkills().then(setSkills).catch(() => {}); }, []);

  useEffect(() => {
    setLoading(true);
    UserService.searchUsers({ skillIds, location: location || undefined, availability: availability || undefined, page, size: 9 })
      .then(data => {
        setUsers(data.content || []);
        setTotalPages(data.totalPages || 0);
        if (isAuthenticated && authUser?.userId) {
          return MatchingService.findMatchesForProject(0).catch(() => []);
        }
        return Promise.resolve([]);
      })
      .then(() => {})
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [skillIds, availability, location, page]);

  const toggleSkill = (id: number) => {
    setSkillIds(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    setPage(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-6">Find Teammates</h1>

      <div className="card p-4 mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-48">
          <label className="label"><FiSearch className="inline mr-1" />Location</label>
          <input className="input" value={location} onChange={e => { setLocation(e.target.value); setPage(0); }} placeholder="City or country…" />
        </div>
        <div>
          <label className="label">Availability</label>
          <div className="flex gap-1">
            {AVAIL_FILTERS.map(f => (
              <button key={f.value} type="button" onClick={() => { setAvailability(f.value); setPage(0); }}
                className={`tab ${availability === f.value ? 'tab-active' : 'tab-inactive'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full">
          <label className="label"><FiFilter className="inline mr-1" />Filter by Skills</label>
          <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
            {skills.map(s => (
              <button key={s.skillId} type="button" onClick={() => toggleSkill(s.skillId)}
                className={`chip cursor-pointer transition-all ${skillIds.includes(s.skillId) ? 'chip-primary ring-2 ring-pink-400 dark:ring-pink-600' : 'chip-default hover:chip-primary'}`}>
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : users.length === 0 ? (
        <EmptyState title="No teammates found" description="Try adjusting your filters" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {users.map(u => <UserCard key={u.userId} user={u} matchScore={matchScores[u.userId]} />)}
          </div>
          <PaginationControl page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default TeammateSearchPage;
