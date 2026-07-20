'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Phone, Mail, Award, Key, CheckCircle, ArrowRight, X,
  MessageCircle, Globe, Clock, Zap, Wrench, Store, Search,
  ChevronLeft, ChevronRight, AlertCircle, Loader2,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LiveDealer {
  id:            string;
  name:          string;
  slug:          string;
  dealerCode:    string;
  businessName:  string | null;
  dealerType:    string;
  status:        string;
  contactPerson: string | null;
  designation:   string | null;
  phone:         string | null;
  whatsapp:      string | null;
  email:         string | null;
  address:       string | null;
  city:          string | null;
  district:      string | null;
  province:      string | null;
  country:       string | null;
  googleMapsUrl: string | null;
  products:      string[] | null;
  services:      string[] | null;
  openingTime:   string | null;
  closingTime:   string | null;
  workingDays:   string[] | null;
  facebook:      string | null;
  instagram:     string | null;
  website:       string | null;
  logo:          string | null;
  coverImage:    string | null;
  isActive:      boolean;
  publicNotes:   string | null;
}

interface ApiResponse {
  success:    boolean;
  data:       LiveDealer[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  meta:       { cities: string[]; provinces: string[] };
}

// ─── Label Maps ───────────────────────────────────────────────────────────────

const PRODUCT_LABELS: Record<string, string> = {
  ELECTRIC_BIKES: 'Electric Bikes',
  PETROL_BIKES:   'Petrol Bikes',
  SPARE_PARTS:    'Spare Parts',
  ACCESSORIES:    'Accessories',
  BATTERIES:      'Batteries',
  CHARGERS:       'Chargers',
};

const SERVICE_LABELS: Record<string, string> = {
  SALES:       'Sales',
  SERVICE:     'Service',
  WARRANTY:    'Warranty',
  MAINTENANCE: 'Maintenance',
  SPARE_PARTS: 'Spare Parts',
  TEST_RIDE:   'Test Ride',
};

const TYPE_BADGE: Record<string, { label: string; cls: string }> = {
  AUTHORIZED:  { label: 'Authorized',  cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  FRANCHISE:   { label: 'Franchise',   cls: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  DISTRIBUTOR: { label: 'Distributor', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  RETAIL:      { label: 'Retail',      cls: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
};

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-neutral-200/50 dark:border-neutral-800/80 bg-[#F5F5F5] dark:bg-[#111111] overflow-hidden animate-pulse">
      <div className="h-28 bg-neutral-300 dark:bg-neutral-800" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-3/4" />
        <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
        <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3" />
        <div className="h-8 bg-neutral-300 dark:bg-neutral-800 rounded-xl mt-4" />
      </div>
    </div>
  );
}

// ─── Dealer Card ─────────────────────────────────────────────────────────────

function DealerCard({ dealer, onClick, isSelected }: {
  dealer: LiveDealer;
  onClick: () => void;
  isSelected: boolean;
}) {
  const typeBadge = TYPE_BADGE[dealer.dealerType] || { label: dealer.dealerType, cls: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20' };
  const products  = dealer.products || [];
  const services  = dealer.services || [];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
      className={`group cursor-pointer rounded-2xl border overflow-hidden transition-all duration-300 ${
        isSelected
          ? 'border-[#D72626] shadow-lg shadow-red-500/10 bg-white dark:bg-[#111111]'
          : 'border-neutral-200/50 dark:border-neutral-800/80 bg-[#F5F5F5] dark:bg-[#111111] hover:border-[#D72626]/60 hover:shadow-md'
      }`}
    >
      {/* Cover / Logo strip */}
      <div className="relative h-24 overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900">
        {dealer.coverImage ? (
          <img
            src={dealer.coverImage}
            alt={dealer.name}
            loading="lazy"
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-red-600/20 flex items-center justify-center">
              <Store className="w-6 h-6 text-[#D72626]" />
            </div>
          </div>
        )}

        {/* Logo overlay */}
        {dealer.logo && (
          <div className="absolute bottom-2 left-3 w-10 h-10 rounded-lg border-2 border-white/20 bg-white/10 backdrop-blur-sm overflow-hidden">
            <img src={dealer.logo} alt="logo" className="w-full h-full object-contain" />
          </div>
        )}

        {/* Type badge */}
        <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold border ${typeBadge.cls}`}>
          {typeBadge.label}
        </div>

        {/* Active dot */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] text-white font-bold">ACTIVE</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white leading-tight line-clamp-1 group-hover:text-[#D72626] transition-colors">
            {dealer.name}
          </h3>
          {dealer.businessName && (
            <p className="text-[10px] text-neutral-500 mt-0.5 line-clamp-1">{dealer.businessName}</p>
          )}
        </div>

        {/* Location */}
        <div className="flex items-start gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
          <MapPin size={11} className="text-[#D72626] flex-shrink-0 mt-0.5" />
          <span className="line-clamp-1">
            {[dealer.address, dealer.city, dealer.province].filter(Boolean).join(', ')}
          </span>
        </div>

        {/* Contact */}
        {dealer.phone && (
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
            <Phone size={11} className="text-[#D72626] flex-shrink-0" />
            <span>{dealer.phone}</span>
          </div>
        )}

        {/* Products chips — up to 3 */}
        {products.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {products.slice(0, 3).map(p => (
              <span key={p} className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-red-500/10 text-[#D72626] border border-red-500/20">
                {PRODUCT_LABELS[p] || p}
              </span>
            ))}
            {products.length > 3 && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-neutral-200 dark:bg-neutral-800 text-neutral-500">
                +{products.length - 3}
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <button className="w-full mt-1 py-2 rounded-xl bg-neutral-900 dark:bg-neutral-800 group-hover:bg-[#D72626] text-white text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1">
          <span>View Details</span>
          <ArrowRight size={11} />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DealerDetailPanel({ dealer }: { dealer: LiveDealer }) {
  const products    = dealer.products    || [];
  const services    = dealer.services    || [];
  const workingDays = dealer.workingDays || [];
  const typeBadge   = TYPE_BADGE[dealer.dealerType] || { label: dealer.dealerType, cls: '' };

  const formatTime = (t: string | null) => {
    if (!t) return null;
    const [h, m] = t.split(':');
    const hour = parseInt(h);
    return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={dealer.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
        className="p-6 rounded-3xl bg-[#F5F5F5] dark:bg-[#111111] border border-neutral-200/50 dark:border-neutral-800/80 shadow-sm space-y-5"
      >
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded border ${typeBadge.cls}`}>
              {typeBadge.label} Dealership
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest bg-red-500/10 text-[#D72626] border border-red-500/20 px-2.5 py-1 rounded">
              RMC Certified
            </span>
          </div>
          <h3 className="text-xl font-black font-display text-neutral-900 dark:text-white uppercase leading-tight">
            {dealer.name}
          </h3>
          {dealer.businessName && (
            <p className="text-xs text-neutral-400 mt-0.5">{dealer.businessName}</p>
          )}
          <p className="text-xs text-neutral-400 font-bold tracking-widest uppercase mt-1">
            {[dealer.city, dealer.province, 'Pakistan'].filter(Boolean).join(', ')}
          </p>
        </div>

        {/* Contact block */}
        <div className="space-y-2.5 text-xs font-light">
          {dealer.address && (
            <div className="flex gap-2.5 items-start">
              <MapPin size={14} className="text-[#D72626] mt-0.5 flex-shrink-0" />
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">{dealer.address}{dealer.city ? `, ${dealer.city}` : ''}</p>
            </div>
          )}
          {dealer.phone && (
            <div className="flex gap-2.5 items-center">
              <Phone size={14} className="text-[#D72626] flex-shrink-0" />
              <a href={`tel:${dealer.phone}`} className="text-neutral-600 dark:text-neutral-300 hover:text-[#D72626] transition-colors">{dealer.phone}</a>
            </div>
          )}
          {dealer.whatsapp && (
            <div className="flex gap-2.5 items-center">
              <MessageCircle size={14} className="text-emerald-500 flex-shrink-0" />
              <a href={`https://wa.me/${dealer.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                className="text-neutral-600 dark:text-neutral-300 hover:text-emerald-500 transition-colors">
                {dealer.whatsapp}
              </a>
            </div>
          )}
          {dealer.email && (
            <div className="flex gap-2.5 items-center">
              <Mail size={14} className="text-[#D72626] flex-shrink-0" />
              <a href={`mailto:${dealer.email}`} className="text-neutral-600 dark:text-neutral-300 hover:text-[#D72626] transition-colors">{dealer.email}</a>
            </div>
          )}
          {dealer.contactPerson && (
            <div className="flex gap-2.5 items-center">
              <CheckCircle size={14} className="text-[#D72626] flex-shrink-0" />
              <span className="text-neutral-600 dark:text-neutral-300">
                {dealer.contactPerson}{dealer.designation ? ` — ${dealer.designation}` : ''}
              </span>
            </div>
          )}
          {dealer.googleMapsUrl && (
            <a href={dealer.googleMapsUrl} target="_blank" rel="noopener noreferrer"
              className="flex gap-2.5 items-center text-blue-400 hover:text-blue-300 transition-colors">
              <Globe size={14} className="flex-shrink-0" />
              <span>View on Google Maps</span>
            </a>
          )}
        </div>

        {/* Hours + Services */}
        <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Business Hours</span>
            <span className="text-neutral-800 dark:text-neutral-200 font-semibold mt-0.5 block">
              {dealer.openingTime && dealer.closingTime
                ? `${formatTime(dealer.openingTime)} — ${formatTime(dealer.closingTime)}`
                : 'Call for hours'}
            </span>
            {workingDays.length > 0 && (
              <span className="text-[10px] text-neutral-500 mt-0.5 block">
                {workingDays.join(', ')}
              </span>
            )}
          </div>
          <div>
            <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Services</span>
            <span className="text-emerald-500 font-bold mt-0.5 block text-[11px]">
              {services.slice(0, 3).map(s => SERVICE_LABELS[s] || s).join(', ') || 'Contact dealer'}
            </span>
          </div>
        </div>

        {/* Products */}
        {products.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {products.map(p => (
              <span key={p} className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/10 text-[#D72626] border border-red-500/20">
                {PRODUCT_LABELS[p] || p}
              </span>
            ))}
          </div>
        )}

        {/* Public notes */}
        {dealer.publicNotes && (
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 italic border-t border-neutral-200 dark:border-neutral-800 pt-3">
            {dealer.publicNotes}
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface DealerNetworkProps {
  lang: string;
}

export const DealerNetwork: React.FC<DealerNetworkProps> = ({ lang }) => {
  // ── State ──────────────────────────────────────────────────────────────────
  const [dealers, setDealers]           = useState<LiveDealer[]>([]);
  const [selectedDealer, setSelectedDealer] = useState<LiveDealer | null>(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [total, setTotal]               = useState(0);
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [cities, setCities]             = useState<string[]>([]);

  // Filter state
  const [search,     setSearch]     = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Application modal
  const [registerOpen,    setRegisterOpen]    = useState(false);
  const [formName,        setFormName]        = useState('');
  const [formCity,        setFormCity]        = useState('');
  const [formPhone,       setFormPhone]       = useState('');
  const [formExperience,  setFormExperience]  = useState('');
  const [formSubmitted,   setFormSubmitted]   = useState(false);

  const LIMIT = 6;

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchDealers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page:  String(page),
        limit: String(LIMIT),
        ...(search     && { search }),
        ...(cityFilter && { city: cityFilter }),
        ...(typeFilter && { dealerType: typeFilter }),
        sortBy: 'name',
      });

      const res  = await fetch(`/api/public/dealers?${params}`);
      const data: ApiResponse = await res.json();

      if (!data.success) throw new Error('Failed to load dealers');

      setDealers(data.data);
      setTotal(data.pagination.total);
      setTotalPages(data.pagination.totalPages);

      // Set selected dealer: preserve selection if still in list, else default to first
      if (data.data.length > 0) {
        setSelectedDealer(prev => {
          const stillHere = prev && data.data.find(d => d.id === prev.id);
          return stillHere ? prev : data.data[0];
        });
      } else {
        setSelectedDealer(null);
      }

      // Populate city filter on first load
      if (data.meta?.cities?.length > 0 && cities.length === 0) {
        setCities(data.meta.cities);
      }
    } catch (err: any) {
      setError('Unable to load dealers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, search, cityFilter, typeFilter]);

  useEffect(() => { fetchDealers(); }, [fetchDealers]);

  // Reset page on filter change
  const handleSearch     = (v: string) => { setSearch(v);     setPage(1); };
  const handleCityFilter = (v: string) => { setCityFilter(v); setPage(1); };
  const handleTypeFilter = (v: string) => { setTypeFilter(v); setPage(1); };

  // ── Dealership Application ────────────────────────────────────────────────

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formCity || !formPhone) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setRegisterOpen(false);
      setFormSubmitted(false);
      setFormName(''); setFormCity(''); setFormPhone(''); setFormExperience('');
    }, 2000);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <section id="dealers" className="py-24 bg-[#FFFFFF] dark:bg-[#0A0A0A] text-[#1E1E1E] dark:text-neutral-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[10px] font-black text-[#D72626] uppercase tracking-[0.25em] mb-2 block">
            {lang === 'en' ? 'Showroom Network' : 'شعبہ ڈیلرشپ'}
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight text-neutral-900 dark:text-white uppercase">
            {lang === 'en' ? 'RMC Dealer Network' : 'ہمارا ملک گیر ڈیلر نیٹ ورک'}
          </h2>
          <div className="w-16 h-1 bg-[#D72626] mx-auto mt-4 rounded-full" />
          <p className="text-xs text-neutral-500 mt-4 font-light max-w-lg mx-auto">
            {total > 0 ? `${total} certified dealer${total !== 1 ? 's' : ''} across Pakistan` : 'Professional support is always right around the corner.'}
          </p>
        </div>

        {/* ── Search & Filters ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search by name, city…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#111111] text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#D72626]"
            />
            {search && (
              <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                <X size={13} />
              </button>
            )}
          </div>

          <select
            value={cityFilter}
            onChange={e => handleCityFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#111111] text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-[#D72626]"
          >
            <option value="">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={typeFilter}
            onChange={e => handleTypeFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#111111] text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-[#D72626]"
          >
            <option value="">All Types</option>
            <option value="AUTHORIZED">Authorized</option>
            <option value="FRANCHISE">Franchise</option>
            <option value="DISTRIBUTOR">Distributor</option>
            <option value="RETAIL">Retail</option>
          </select>
        </div>

        {/* ── Main Layout: Card Grid + Detail Panel ───────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">

          {/* Card Grid — left 7 columns */}
          <div className="lg:col-span-7">

            {/* Loading */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: LIMIT }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-16 space-y-3">
                <AlertCircle className="w-10 h-10 text-red-500" />
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{error}</p>
                <button onClick={fetchDealers}
                  className="px-4 py-2 rounded-lg bg-[#D72626] text-white text-xs font-bold hover:bg-red-700 transition-colors">
                  Retry
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && dealers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 space-y-3">
                <Store className="w-12 h-12 text-neutral-300 dark:text-neutral-700" />
                <p className="text-sm font-medium text-neutral-500">No dealers found</p>
                {(search || cityFilter || typeFilter) && (
                  <button
                    onClick={() => { handleSearch(''); handleCityFilter(''); handleTypeFilter(''); }}
                    className="text-xs text-[#D72626] hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {/* Dealer Cards */}
            {!loading && !error && dealers.length > 0 && (
              <>
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {dealers.map(dealer => (
                      <DealerCard
                        key={dealer.id}
                        dealer={dealer}
                        isSelected={selectedDealer?.id === dealer.id}
                        onClick={() => setSelectedDealer(dealer)}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <p className="text-xs text-neutral-500">
                      Page {page} of {totalPages} · {total} dealers
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 disabled:opacity-40 transition-colors"
                      >
                        <ChevronLeft size={15} />
                      </button>
                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 disabled:opacity-40 transition-colors"
                      >
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Detail Panel + CTA — right 5 columns */}
          <div className="lg:col-span-5 space-y-6">
            {loading && (
              <div className="p-8 rounded-3xl bg-[#F5F5F5] dark:bg-[#111111] border border-neutral-200/50 dark:border-neutral-800/80 flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 text-[#D72626] animate-spin" />
              </div>
            )}

            {!loading && selectedDealer && (
              <DealerDetailPanel dealer={selectedDealer} />
            )}

            {/* Become a Dealer CTA */}
            <div className="p-8 rounded-3xl bg-neutral-900 dark:bg-neutral-950 border border-neutral-800 text-white flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-black font-display uppercase tracking-wider mb-2">Partner with Rebon Motor</h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-light mb-6">
                  Expand your business portfolio. Gain access to eco-friendly electric drivetrains, high-volume petrol models, parts delivery pipelines, and comprehensive mechanic diagnostic training.
                </p>
              </div>
              <button
                onClick={() => setRegisterOpen(true)}
                className="w-full py-3.5 bg-[#D72626] hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-lg shadow-red-500/25 flex items-center justify-center gap-1"
              >
                <span>Apply for Dealership</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Dealership Privileges Grid ────────────────────────────────────── */}
        <div>
          <div className="text-center mb-10">
            <h3 className="text-[10px] font-black text-[#D72626] uppercase tracking-[0.25em]">Dealership Privileges</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Key,          title: 'Territorial Rights', desc: 'Exclusive operational rights in your designated municipal radius preventing sales conflicts.' },
              { icon: Award,        title: 'Branding & Signage',  desc: 'Complimentary 3D premium external storefront signage and high-end sales brochures provided.' },
              { icon: CheckCircle,  title: 'Mechanic Training',  desc: 'Bi-annual localized technical courses on lithium cells, BMS diagnosis, and EFI configuration loops.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/80 bg-[#F5F5F5] dark:bg-[#111111] text-center">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3 text-[#D72626]">
                  <Icon size={16} />
                </div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white">{title}</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light mt-1.5 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Dealer Application Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {registerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 relative"
            >
              <button onClick={() => setRegisterOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <X size={18} />
              </button>

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold font-display text-neutral-900 dark:text-white uppercase">Dealership Partnership Program</h3>
                <p className="text-xs text-neutral-500 mt-1">Submit your basic details. Our corporate business development team will contact you within 48 hours.</p>
              </div>

              {formSubmitted ? (
                <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 text-emerald-800 dark:text-emerald-100 p-6 rounded-2xl text-center py-8">
                  <CheckCircle size={40} className="mx-auto mb-2 text-emerald-500" />
                  <p className="font-bold">Application Received Successfully!</p>
                  <p className="text-xs mt-1 text-emerald-600 dark:text-emerald-400">
                    Your tracking number is #RMC-DEALER-{Math.floor(Math.random() * 90000 + 10000)}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Your Full Name</label>
                      <input type="text" required value={formName} onChange={e => setFormName(e.target.value)}
                        placeholder="e.g. Kamran Ali"
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white text-xs outline-none focus:border-[#D72626]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Target City</label>
                      <input type="text" required value={formCity} onChange={e => setFormCity(e.target.value)}
                        placeholder="e.g. Faisalabad"
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white text-xs outline-none focus:border-[#D72626]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Contact Phone Number</label>
                    <input type="tel" required value={formPhone} onChange={e => setFormPhone(e.target.value)}
                      placeholder="e.g. +92 321 4567890"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white text-xs outline-none focus:border-[#D72626]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Automotive Experience (Optional)</label>
                    <textarea value={formExperience} onChange={e => setFormExperience(e.target.value)}
                      placeholder="Briefly explain your previous automotive experience..."
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white text-xs outline-none focus:border-[#D72626]" />
                  </div>
                  <button type="submit"
                    className="w-full py-3 bg-[#D72626] hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-lg">
                    Submit Dealership Proposal
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
