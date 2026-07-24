'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Briefcase, Clock, Filter, ChevronRight, X, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Career {
  id: string;
  title: string;
  department?: string;
  location?: string;
  employmentType?: string;
  experience?: string;
  salaryRange?: string;
  deadline?: string;
  createdAt: string;
}

interface Filters {
  departments: string[];
  locations: string[];
  employmentTypes: string[];
}

const TYPE_LABELS: Record<string, string> = {
  FULL_TIME:  'Full Time',
  PART_TIME:  'Part Time',
  CONTRACT:   'Contract',
  INTERNSHIP: 'Internship',
  REMOTE:     'Remote',
};

export const CareersPage: React.FC = () => {
  const [careers, setCareers]       = useState<Career[]>([]);
  const [filters, setFilters]       = useState<Filters>({ departments: [], locations: [], employmentTypes: [] });
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [dept, setDept]             = useState('');
  const [location, setLocation]     = useState('');
  const [empType, setEmpType]       = useState('');

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ search, department: dept, location, employmentType: empType });
    const res  = await fetch(`/api/public/careers?${params}`);
    const json = await res.json();
    if (json.success) {
      setCareers(json.data);
      if (json.filters) setFilters(json.filters);
    }
    setLoading(false);
  }, [search, dept, location, empType]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const clearFilters = () => { setSearch(''); setDept(''); setLocation(''); setEmpType(''); };
  const hasFilters   = search || dept || location || empType;

  const isExpiring = (deadline?: string) => {
    if (!deadline) return false;
    const diff = new Date(deadline).getTime() - Date.now();
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000; // within 7 days
  };

  return (
    <section className="py-24 bg-[#FFFFFF] dark:bg-[#0A0A0A] text-neutral-900 dark:text-neutral-100 transition-colors duration-300 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black text-[#D72626] uppercase tracking-[0.25em] mb-2">
            Join Our Team
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black font-display tracking-tight uppercase">
            Careers at Rebon
          </motion.h1>
          <div className="w-16 h-1 bg-[#D72626] mx-auto mt-4 rounded-full" />
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="mt-6 text-base text-neutral-500 dark:text-neutral-400">
            Be part of Pakistan's leading electric vehicle revolution. We're looking for passionate people.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="bg-[#F5F5F5] dark:bg-[#111111] border border-neutral-200/50 dark:border-neutral-800/80 rounded-2xl p-5 mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search job titles, skills, departments…"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-red-500 outline-none transition-all" />
          </div>

          {/* Dropdowns */}
          <div className="flex flex-wrap gap-3">
            {filters.departments.length > 0 && (
              <select value={dept} onChange={e => setDept(e.target.value)}
                className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-700 dark:text-neutral-300 focus:ring-2 focus:ring-red-500 outline-none">
                <option value="">All Departments</option>
                {filters.departments.map(d => <option key={d} value={d!}>{d}</option>)}
              </select>
            )}
            {filters.locations.length > 0 && (
              <select value={location} onChange={e => setLocation(e.target.value)}
                className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-700 dark:text-neutral-300 focus:ring-2 focus:ring-red-500 outline-none">
                <option value="">All Locations</option>
                {filters.locations.map(l => <option key={l} value={l!}>{l}</option>)}
              </select>
            )}
            {filters.employmentTypes.length > 0 && (
              <select value={empType} onChange={e => setEmpType(e.target.value)}
                className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-700 dark:text-neutral-300 focus:ring-2 focus:ring-red-500 outline-none">
                <option value="">All Types</option>
                {filters.employmentTypes.map(t => <option key={t} value={t!}>{TYPE_LABELS[t!] || t}</option>)}
              </select>
            )}
            {hasFilters && (
              <button onClick={clearFilters}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-500 hover:text-red-600 hover:border-red-500 transition-colors">
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-neutral-500">
            {loading ? 'Searching…' : `${careers.length} open position${careers.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[#D72626]" />
          </div>
        )}

        {/* Empty state */}
        {!loading && careers.length === 0 && (
          <div className="text-center py-20">
            <Briefcase size={48} className="mx-auto mb-4 text-neutral-300 dark:text-neutral-700" />
            <h3 className="text-lg font-semibold text-neutral-600 dark:text-neutral-400">No positions found</h3>
            <p className="text-sm text-neutral-400 mt-2">Try adjusting your search filters.</p>
          </div>
        )}

        {/* Job Cards */}
        {!loading && careers.length > 0 && (
          <div className="space-y-4">
            {careers.map((job, i) => (
              <motion.div key={job.id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <Link href={`/company/careers/${job.id}`}
                  className="block bg-[#F5F5F5] dark:bg-[#111111] border border-neutral-200/50 dark:border-neutral-800/80 rounded-2xl p-6 hover:border-red-500/40 transition-all duration-300 group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h2 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-[#D72626] transition-colors">
                          {job.title}
                        </h2>
                        {isExpiring(job.deadline) && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] font-bold uppercase">
                            Closing Soon
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-neutral-500">
                        {job.department && (
                          <span className="flex items-center gap-1"><Filter size={12} />{job.department}</span>
                        )}
                        {job.location && (
                          <span className="flex items-center gap-1"><MapPin size={12} />{job.location}</span>
                        )}
                        {job.employmentType && (
                          <span className="flex items-center gap-1"><Briefcase size={12} />{TYPE_LABELS[job.employmentType] || job.employmentType}</span>
                        )}
                        {job.experience && (
                          <span className="flex items-center gap-1"><Clock size={12} />{job.experience}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.salaryRange && (
                          <span className="px-3 py-1 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                            {job.salaryRange}
                          </span>
                        )}
                        {job.deadline && (
                          <span className="px-3 py-1 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400">
                            Deadline: {new Date(job.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-neutral-300 group-hover:text-[#D72626] transition-colors flex-shrink-0 mt-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
