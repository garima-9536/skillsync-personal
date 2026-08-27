import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiSearch, FiArrowRight, FiUsers, FiBriefcase, FiZap, FiStar, FiCode, FiLayers, FiTrendingUp } from 'react-icons/fi';
import { HiOutlineLightningBolt } from 'react-icons/hi';
import ProjectService from '../../services/ProjectService';
import ProjectCard from '../ProjectCard';
import LoadingSpinner from '../LoadingSpinner';
import { ProjectSummaryDTO } from '../../model/Project';

const STATS = [
  { icon: <FiUsers className="w-6 h-6" />, value: '500+', label: 'Developers', color: 'bg-pink-100 text-pink-600' },
  { icon: <FiBriefcase className="w-6 h-6" />, value: '200+', label: 'Open Projects', color: 'bg-rose-100 text-rose-600' },
  { icon: <FiZap className="w-6 h-6" />, value: '95%', label: 'Match Accuracy', color: 'bg-emerald-100 text-emerald-600' },
  { icon: <FiStar className="w-6 h-6" />, value: '50+', label: 'Skills Listed', color: 'bg-amber-100 text-amber-600' },
];

const FEATURES = [
  {
    icon: <FiCode className="w-7 h-7" />,
    color: 'bg-pink-500',
    title: 'Skill-Based Matching',
    desc: 'Our algorithm finds teammates whose skills complement yours — not just by title, but by actual proficiency.',
  },
  {
    icon: <FiLayers className="w-7 h-7" />,
    color: 'bg-rose-500',
    title: 'Project Collaboration',
    desc: 'Create projects, define required skills, and build your dream team from a pool of vetted developers.',
  },
  {
    icon: <FiTrendingUp className="w-7 h-7" />,
    color: 'bg-emerald-500',
    title: 'Availability Tracking',
    desc: 'Know who is open to collaborate right now. Filter by availability so you only reach out to people ready to build.',
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [featured, setFeatured] = useState<ProjectSummaryDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ProjectService.getProjects({ status: 'OPEN', size: 6 })
      .then(data => setFeatured(data.content || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/projects?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-pink-800 via-rose-700 to-purple-800">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, #ec4899 0%, transparent 50%), radial-gradient(circle at 75% 20%, #a855f7 0%, transparent 40%)' }} />
        <div className="absolute top-20 right-20 w-64 h-64 bg-rose-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-pink-300/10 rounded-full blur-2xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 md:py-28 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-8 text-rose-200">
            <HiOutlineLightningBolt className="w-4 h-4 text-yellow-400" />
            Skill-based team matching platform
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
            Build your<br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">dream team</span>
          </h1>
          <p className="text-lg md:text-xl text-rose-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect with skilled developers, designers, and builders. Find collaborators whose skills perfectly match your project needs.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-10">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search projects, skills, or technologies…"
                className="input pl-12 h-14 text-base shadow-xl text-slate-900 bg-white/95 backdrop-blur border-0 rounded-2xl" />
            </div>
            <button type="submit" className="btn bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 font-bold h-14 px-8 rounded-2xl hover:from-yellow-300 hover:to-orange-300 shadow-xl text-base">
              Search
            </button>
          </form>

          <div className="flex items-center justify-center gap-8 text-sm text-rose-200 flex-wrap">
            <button onClick={() => navigate('/projects')} className="flex items-center gap-2 hover:text-white transition-colors group">
              Browse all projects <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <span className="text-rose-400">•</span>
            <button onClick={() => navigate('/teammates')} className="flex items-center gap-2 hover:text-white transition-colors group">
              Find teammates <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <span className="text-rose-400">•</span>
            <Link to="/register" className="flex items-center gap-2 hover:text-white transition-colors group">
              Join free <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="bg-white border-b border-slate-100 dark:bg-slate-900 dark:border-slate-700">
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(s => (
            <div key={s.label} className="flex items-center gap-4">
              <div className={`icon-box ${s.color} dark:bg-opacity-20`}>{s.icon}</div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{s.value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">Why SkillSync?</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">Stop searching blindly. Our platform matches you with collaborators based on what actually matters — skills.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="card p-7 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-lg mb-2">{f.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Open Projects ── */}
      <div className="bg-slate-50/80 dark:bg-slate-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Open Projects</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Join a project that matches your skills</p>
            </div>
            <button onClick={() => navigate('/projects')} className="btn-secondary hidden sm:flex">
              View All <FiArrowRight />
            </button>
          </div>

          {loading ? <LoadingSpinner message="Loading projects…" /> : featured.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg mb-4">No open projects yet.</p>
              <button onClick={() => navigate('/projects/create')} className="btn-primary btn-lg">Create the first project</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {featured.map(p => <ProjectCard key={p.projectId} project={p} />)}
              </div>
              <div className="text-center mt-8">
                <button onClick={() => navigate('/projects')} className="btn-primary btn-lg">
                  Browse All Projects <FiArrowRight />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="bg-gradient-to-r from-pink-700 to-purple-700 py-16 px-4 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to build something great?</h2>
        <p className="text-rose-100 text-lg mb-8 max-w-lg mx-auto">Join hundreds of developers already collaborating on SkillSync.</p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/register" className="btn bg-white text-pink-700 hover:bg-pink-50 font-bold btn-lg shadow-xl">
            Get Started Free
          </Link>
          <button onClick={() => navigate('/projects')} className="btn border-2 border-white/50 text-white hover:bg-white/10 btn-lg">
            Explore Projects
          </button>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-extrabold text-xl">
            <span className="bg-pink-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black">S</span>
            SkillSync
          </div>
          <div className="flex gap-6 text-sm flex-wrap justify-center">
            <Link to="/projects" className="hover:text-white transition-colors">Projects</Link>
            <Link to="/teammates" className="hover:text-white transition-colors">Find Teammates</Link>
            <Link to="/register" className="hover:text-white transition-colors">Sign Up</Link>
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
          </div>
          <p className="text-sm">© 2026 SkillSync. Built with ♥</p>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
