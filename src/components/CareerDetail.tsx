'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Briefcase, Clock, Calendar, Mail, ExternalLink, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface CareerDetailProps {
  id: string;
}

const TYPE_LABELS: Record<string, string> = {
  FULL_TIME:  'Full Time',
  PART_TIME:  'Part Time',
  CONTRACT:   'Contract',
  INTERNSHIP: 'Internship',
  REMOTE:     'Remote',
};

export const CareerDetail: React.FC<CareerDetailProps> = ({ id }) => {
  const [job, setJob]       = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/public/careers/${id}`)
      .then(r => r.json())
      .then(json => {
        if (json.success) setJob(json.data);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF] dark:bg-[#0A0A0A]">
        <Loader2 size={40} className="animate-spin text-[#D72626]" />
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFFFF] dark:bg-[#0A0A0A] text-neutral-900 dark:text-neutral-100">
        <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
        <p className="text-neutral-500 mb-6">This position is no longer available.</p>
        <Link href="/company/careers" className="text-[#D72626] font-medium hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> View all openings
        </Link>
      </div>
    );
  }

  const renderText = (text?: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => (
      <p key={i} className={`text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed ${line.startsWith('•') ? 'ml-2' : ''}`}>
        {line}
      </p>
    ));
  };

  return (
    <section className="py-24 bg-[#FFFFFF] dark:bg-[#0A0A0A] text-neutral-900 dark:text-neutral-100 transition-colors min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <Link href="/company/careers" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-[#D72626] transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Careers
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-black font-display tracking-tight uppercase text-neutral-900 dark:text-white mb-4">
            {job.title}
          </h1>

          {/* Meta tags */}
          <div className="flex flex-wrap gap-3 mb-8">
            {job.department && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F5F5] dark:bg-[#111111] border border-neutral-200/50 dark:border-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                <Briefcase size={12} /> {job.department}
              </span>
            )}
            {job.location && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F5F5] dark:bg-[#111111] border border-neutral-200/50 dark:border-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                <MapPin size={12} /> {job.location}
              </span>
            )}
            {job.employmentType && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F5F5] dark:bg-[#111111] border border-neutral-200/50 dark:border-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                <Clock size={12} /> {TYPE_LABELS[job.employmentType] || job.employmentType}
              </span>
            )}
            {job.experience && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F5F5] dark:bg-[#111111] border border-neutral-200/50 dark:border-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                <Clock size={12} /> {job.experience}
              </span>
            )}
            {job.deadline && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs font-medium text-amber-700 dark:text-amber-400">
                <Calendar size={12} /> Deadline: {new Date(job.deadline).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Salary */}
          {job.salaryRange && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl">
              <p className="text-sm font-semibold text-[#D72626]">Salary Range: {job.salaryRange}</p>
            </div>
          )}
        </motion.div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {job.description && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h2 className="text-sm font-black uppercase tracking-widest text-neutral-900 dark:text-white mb-3">Job Description</h2>
                <div className="space-y-2">{renderText(job.description)}</div>
              </motion.div>
            )}

            {job.responsibilities && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <h2 className="text-sm font-black uppercase tracking-widest text-neutral-900 dark:text-white mb-3">Responsibilities</h2>
                <div className="space-y-2">{renderText(job.responsibilities)}</div>
              </motion.div>
            )}

            {job.requirements && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="text-sm font-black uppercase tracking-widest text-neutral-900 dark:text-white mb-3">Requirements</h2>
                <div className="space-y-2">{renderText(job.requirements)}</div>
              </motion.div>
            )}

            {job.benefits && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <h2 className="text-sm font-black uppercase tracking-widest text-neutral-900 dark:text-white mb-3">Benefits</h2>
                <div className="space-y-2">{renderText(job.benefits)}</div>
              </motion.div>
            )}

            {job.skills && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h2 className="text-sm font-black uppercase tracking-widest text-neutral-900 dark:text-white mb-3">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.split(',').map((s: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-[#F5F5F5] dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Apply Sidebar */}
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
              className="sticky top-8 bg-[#F5F5F5] dark:bg-[#111111] border border-neutral-200/50 dark:border-neutral-800/80 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900 dark:text-white">Apply Now</h3>

              {job.applyUrl && (
                <a href={job.applyUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#D72626] hover:bg-red-700 text-white py-3 rounded-xl font-bold text-sm transition-colors">
                  <ExternalLink size={16} /> Apply Online
                </a>
              )}

              {job.applyEmail && (
                <a href={`mailto:${job.applyEmail}?subject=Application for ${encodeURIComponent(job.title)}`}
                  className="flex items-center justify-center gap-2 w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 hover:border-[#D72626] text-neutral-700 dark:text-neutral-300 py-3 rounded-xl font-bold text-sm transition-colors">
                  <Mail size={16} /> Apply via Email
                </a>
              )}

              {!job.applyUrl && !job.applyEmail && (
                <p className="text-xs text-neutral-400 text-center">Contact us for application details.</p>
              )}

              {job.deadline && (
                <p className="text-xs text-neutral-500 text-center">
                  Application deadline: <strong>{new Date(job.deadline).toLocaleDateString()}</strong>
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
