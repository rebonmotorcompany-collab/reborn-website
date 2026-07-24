'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Linkedin, Facebook, Instagram, Twitter, Users } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  position?: string;
  department?: string;
  biography?: string;
  photo?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  isFeatured?: boolean;
}

export const TeamPage: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/public/team')
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          setMembers(json.data);
          const depts = ['All', ...new Set<string>(json.data.map((m: TeamMember) => m.department).filter(Boolean) as string[])];
          setDepartments(depts);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === 'All'
    ? members
    : members.filter(m => m.department === activeFilter);

  return (
    <section className="py-24 bg-[#FFFFFF] dark:bg-[#0A0A0A] text-neutral-900 dark:text-neutral-100 transition-colors duration-300 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black text-[#D72626] uppercase tracking-[0.25em] mb-2">
            The People Behind Rebon
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black font-display tracking-tight uppercase">
            Meet Our Team
          </motion.h1>
          <div className="w-16 h-1 bg-[#D72626] mx-auto mt-4 rounded-full" />
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="mt-6 text-base text-neutral-500 dark:text-neutral-400">
            Passionate engineers, designers, and innovators driving the future of mobility in Pakistan.
          </motion.p>
        </div>

        {/* Department Filters */}
        {departments.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {departments.map(dept => (
              <button key={dept} onClick={() => setActiveFilter(dept)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                  activeFilter === dept
                    ? 'bg-[#D72626] border-[#D72626] text-white'
                    : 'border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-[#D72626] hover:text-[#D72626]'
                }`}>
                {dept}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-neutral-100 dark:bg-neutral-900 animate-pulse h-80" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <Users size={48} className="mx-auto mb-4 text-neutral-300 dark:text-neutral-700" />
            <p className="text-neutral-500">No team members found.</p>
          </div>
        )}

        {/* Team Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((member, i) => (
              <motion.div key={member.id}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="group relative bg-[#F5F5F5] dark:bg-[#111111] border border-neutral-200/50 dark:border-neutral-800/80 rounded-2xl overflow-hidden hover:border-red-500/40 transition-all duration-300">

                {member.isFeatured && (
                  <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full bg-[#D72626] text-white text-[9px] font-black uppercase tracking-widest">
                    Featured
                  </div>
                )}

                {/* Photo */}
                <div className="relative aspect-[4/5] bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Users size={48} className="text-neutral-400" />
                    </div>
                  )}
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{member.name}</h3>
                  {member.position && (
                    <p className="text-xs text-[#D72626] font-medium mt-0.5">{member.position}</p>
                  )}
                  {member.department && (
                    <p className="text-xs text-neutral-500 mt-0.5">{member.department}</p>
                  )}

                  {/* Bio toggle */}
                  {member.biography && (
                    <>
                      <button onClick={() => setExpanded(expanded === member.id ? null : member.id)}
                        className="text-xs text-neutral-400 hover:text-[#D72626] mt-2 transition-colors">
                        {expanded === member.id ? 'Hide bio ↑' : 'Read bio ↓'}
                      </button>
                      {expanded === member.id && (
                        <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                          className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                          {member.biography}
                        </motion.p>
                      )}
                    </>
                  )}

                  {/* Social links */}
                  {(member.linkedin || member.facebook || member.instagram || member.twitter) && (
                    <div className="flex gap-3 mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                      {member.linkedin  && <a href={member.linkedin}  target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#0077b5] transition-colors"><Linkedin  size={14} /></a>}
                      {member.facebook  && <a href={member.facebook}  target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#1877f2] transition-colors"><Facebook  size={14} /></a>}
                      {member.instagram && <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#e1306c] transition-colors"><Instagram size={14} /></a>}
                      {member.twitter   && <a href={member.twitter}   target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#1da1f2] transition-colors"><Twitter   size={14} /></a>}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
