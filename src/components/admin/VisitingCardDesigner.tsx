'use client';

import React, { useState, useEffect } from 'react';
import { VisitingCardPreview, VisitingCardData } from './VisitingCardPreview';
import { VisitingCardPrint } from './VisitingCardPrint';
import {
  User,
  Building,
  Palette,
  QrCode,
  Download,
  Printer,
  Save,
  CheckCircle,
  AlertCircle,
  Sparkles,
  FileText,
  ImageIcon,
  FileDown,
} from 'lucide-react';

interface EmployeeUser {
  id: string;
  name: string;
  email: string;
  department?: string;
  designation?: string;
  phone?: string;
  image?: string;
  employeeId?: string;
}

interface VisitingCardDesignerProps {
  initialData?: any;
  onSaved?: () => void;
}

export const VisitingCardDesigner: React.FC<VisitingCardDesignerProps> = ({
  initialData,
  onSaved,
}) => {
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  const [employees, setEmployees] = useState<EmployeeUser[]>([]);
  const [selectedEmpId, setSelectedEmpId] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Default Visiting Card Form State
  const [cardForm, setCardForm] = useState<VisitingCardData>({
    fullName: initialData?.fullName || 'Moazam Muzzamil',
    designation: initialData?.designation || 'Managing Director',
    department: initialData?.department || 'Executive Management',
    employeeCode: initialData?.employeeCode || 'RMC-EMP-001',
    phone: initialData?.phone || '+92 302 55555',
    whatsapp: initialData?.whatsapp || '+92 302 55555',
    email: initialData?.email || 'moazam@rebonmotorcompany.com',
    extension: initialData?.extension || '101',
    address: initialData?.address || '88-D/1, Main Boulevard, Gulberg III, Lahore, Pakistan',
    companyName: initialData?.companyName || 'REBON MOTOR COMPANY',
    website: initialData?.website || 'www.rebonmotorcompany.com',
    primaryColor: initialData?.primaryColor || '#D72626',
    secondaryColor: initialData?.secondaryColor || '#1E1E1E',
    backgroundColor: initialData?.backgroundColor || '#0F0F11',
    textColor: initialData?.textColor || '#FFFFFF',
    fontFamily: initialData?.fontFamily || 'Inter',
    borderRadius: initialData?.borderRadius || '16px',
    templateType: initialData?.templateType || 'MODERN',
    qrCodeType: initialData?.qrCodeType || 'VCARD',
    customQrUrl: initialData?.customQrUrl || '',
    profilePhoto: initialData?.profilePhoto || '',
  });

  // Load employees and company settings on mount
  useEffect(() => {
    fetchEmployees();
    fetchCompanySettings();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setEmployees(data.data);
      }
    } catch (e) {
      console.error('Failed to load employees:', e);
    }
  };

  const fetchCompanySettings = async () => {
    try {
      const res = await fetch('/api/cms/settings?format=list');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const settingsMap: Record<string, string> = {};
        data.data.forEach((item: any) => {
          settingsMap[item.key] = item.value || '';
        });

        // Auto-fill company details if empty
        setCardForm(prev => ({
          ...prev,
          companyName: settingsMap.site_name || prev.companyName,
          website: settingsMap.website_url ? settingsMap.website_url.replace(/^https?:\/\//, '') : prev.website,
          address: settingsMap.office_address || prev.address,
          companyLogo: settingsMap.logo_dark || settingsMap.logo_primary || prev.companyLogo,
        }));
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
  };

  const handleEmployeeSelect = (empId: string) => {
    setSelectedEmpId(empId);
    if (!empId) return;

    const emp = employees.find(e => e.id === empId);
    if (emp) {
      setCardForm(prev => ({
        ...prev,
        fullName: emp.name,
        email: emp.email,
        department: emp.department || prev.department,
        designation: emp.designation || prev.designation,
        phone: emp.phone || prev.phone,
        whatsapp: emp.phone || prev.whatsapp,
        profilePhoto: emp.image || prev.profilePhoto,
        employeeCode: emp.employeeId || `RMC-EMP-${emp.id.slice(-4).toUpperCase()}`,
      }));
    }
  };

  const handleInputChange = (field: keyof VisitingCardData, value: string) => {
    setCardForm(prev => ({ ...prev, [field]: value }));
  };

  // Preset Template selector
  const applyPresetTemplate = (type: string) => {
    let updates: Partial<VisitingCardData> = { templateType: type };
    if (type === 'DARK') {
      updates = { ...updates, backgroundColor: '#0F0F11', textColor: '#FFFFFF', primaryColor: '#D72626' };
    } else if (type === 'CORPORATE') {
      updates = { ...updates, backgroundColor: '#111827', textColor: '#F9FAFB', primaryColor: '#2563EB' };
    } else if (type === 'MINIMAL') {
      updates = { ...updates, backgroundColor: '#FFFFFF', textColor: '#111827', primaryColor: '#D72626' };
    } else if (type === 'PREMIUM') {
      updates = { ...updates, backgroundColor: '#09090B', textColor: '#FAFAFA', primaryColor: '#EAB308' };
    } else if (type === 'MODERN') {
      updates = { ...updates, backgroundColor: '#0F0F11', textColor: '#FFFFFF', primaryColor: '#D72626' };
    }
    setCardForm(prev => ({ ...prev, ...updates }));
  };

  // Save Card Handler
  const handleSaveCard = async () => {
    setSaving(true);
    setMessage(null);

    const cardName = `${cardForm.fullName} — ${cardForm.designation || 'Visiting Card'}`;
    const payload = {
      cardName,
      fullName: cardForm.fullName,
      designation: cardForm.designation,
      department: cardForm.department,
      employeeCode: cardForm.employeeCode,
      phone: cardForm.phone,
      whatsapp: cardForm.whatsapp,
      email: cardForm.email,
      extension: cardForm.extension,
      employeeId: selectedEmpId || undefined,
      qrCodeType: cardForm.qrCodeType,
      customQrUrl: cardForm.customQrUrl,
      profilePhoto: cardForm.profilePhoto,
      companyName: cardForm.companyName,
      companyLogo: cardForm.companyLogo,
      website: cardForm.website,
      address: cardForm.address,
      frontBgType: 'POLYGON',
      backBgType: 'LIGHT_POLYGON',
      status: 'ACTIVE',
    };

    try {
      const url = initialData?.id ? `/api/visiting-cards/${initialData.id}` : '/api/visiting-cards';
      const method = initialData?.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Visiting Card saved successfully!' });
        if (onSaved) onSaved();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save visiting card.' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  // Print Visiting Card (Dedicated Print Window, Grid Centered, 1 Page Fit, 100% Color & Ratio Match)
  const handlePrint = () => {
    const printElem = document.getElementById('printable-visiting-card-area');
    if (!printElem) {
      window.print();
      return;
    }

    const printWin = window.open('', '_blank', 'width=950,height=800');
    if (!printWin) {
      window.print();
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: A4 portrait;
              margin: 15mm 0mm;
            }
            html, body {
              background-color: #0F0F11 !important;
              color: #FFFFFF !important;
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              min-height: 100vh !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              justify-content: center !important;
              font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              box-sizing: border-box;
            }
            /* Grid Centered Layout for A4 Physical Printing */
            .printable-grid-container {
              display: grid !important;
              grid-template-rows: auto auto !important;
              justify-content: center !important;
              align-content: center !important;
              gap: 15mm !important;
              width: 100% !important;
              margin: auto !important;
            }
            .card-print-frame {
              box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
              border: 1px solid rgba(255, 255, 255, 0.15) !important;
            }
          </style>
        </head>
        <body>
          ${printElem.innerHTML}
          <script>
            document.title = "";
            setTimeout(function() {
              window.print();
              window.close();
            }, 450);
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  // Download both Front & Back sides together in ONE click (HD PNG)
  const handleDownloadBothPNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1050; // 3.5in
    canvas.height = 1250; // Front (600) + Spacer (50) + Back (600)
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ─── 1. FRONT SIDE ────────────────────────────────────────────────────────
    ctx.fillStyle = cardForm.backgroundColor || '#0F0F11';
    ctx.fillRect(0, 0, 1050, 600);

    ctx.fillStyle = cardForm.primaryColor || '#D72626';
    ctx.fillRect(0, 0, 1050, 14);

    ctx.fillStyle = '#A3A3A3';
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.fillText(cardForm.companyName.toUpperCase(), 50, 65);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 48px Montserrat, sans-serif';
    ctx.fillText(cardForm.fullName.toUpperCase(), 50, 160);

    ctx.fillStyle = cardForm.primaryColor || '#D72626';
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.fillText(`${(cardForm.designation || 'STAFF').toUpperCase()} — ${(cardForm.department || 'MANAGEMENT').toUpperCase()}`, 50, 230);

    ctx.fillStyle = '#F5F5F5';
    ctx.font = '500 24px Inter, sans-serif';
    ctx.fillText(`Email:  ${cardForm.email}`, 50, 350);
    ctx.fillText(`Phone: ${cardForm.phone}`, 50, 410);
    ctx.fillText(`Address: ${cardForm.address}`, 50, 470);
    ctx.fillText(`Website: ${cardForm.website}`, 50, 530);

    // Spacer between cards
    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(0, 600, 1050, 50);

    // ─── 2. BACK SIDE ─────────────────────────────────────────────────────────
    ctx.fillStyle = '#F6F6F8';
    ctx.fillRect(0, 650, 1050, 600);

    ctx.fillStyle = cardForm.primaryColor || '#D72626';
    ctx.fillRect(0, 650, 1050, 14);

    ctx.fillStyle = '#09090B';
    ctx.font = '900 72px Montserrat, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(cardForm.companyName, 525, 920);

    ctx.fillStyle = cardForm.primaryColor || '#D72626';
    ctx.fillRect(450, 960, 150, 6);

    ctx.fillStyle = '#525252';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillText('ENGINEERING THE FUTURE OF MOBILITY', 525, 1020);

    ctx.fillStyle = '#737373';
    ctx.font = '500 20px Inter, sans-serif';
    ctx.fillText(cardForm.website, 525, 1070);

    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `${cardForm.fullName.replace(/\s+/g, '_')}_Visiting_Card_HD.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
    {/* ─── PRINT-ONLY CONTAINER (ISO 85.6mm x 54mm PHYSICAL UNITS) ─── */}
    <div id="printable-visiting-card-area">
      <VisitingCardPrint cardData={cardForm} sizePreset="ISO" />
    </div>

      {/* ─── LEFT PANEL: CONTROL STUDIO ────────────────────────────────────── */}
      <div className="lg:col-span-7 space-y-6">
        {/* Employee Auto-fill & Company Selector */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <User className="text-[#D72626]" size={20} />
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Employee & Organization Information
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                Auto-fill from Employee Database
              </label>
              <select
                value={selectedEmpId}
                onChange={e => handleEmployeeSelect(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:border-[#D72626] outline-none cursor-pointer"
              >
                <option value="" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white py-1">-- Manual Entry / Select Employee --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white py-1">
                    {emp.name} ({emp.designation || 'Staff'}) — {emp.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  value={cardForm.fullName}
                  onChange={e => handleInputChange('fullName', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:border-[#D72626] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Designation</label>
                <input
                  type="text"
                  value={cardForm.designation}
                  onChange={e => handleInputChange('designation', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:border-[#D72626] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Department</label>
                <input
                  type="text"
                  value={cardForm.department}
                  onChange={e => handleInputChange('department', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:border-[#D72626] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Mobile / Phone</label>
                <input
                  type="text"
                  value={cardForm.phone}
                  onChange={e => handleInputChange('phone', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:border-[#D72626] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  value={cardForm.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:border-[#D72626] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Website URL</label>
                <input
                  type="text"
                  value={cardForm.website}
                  onChange={e => handleInputChange('website', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:border-[#D72626] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Office Address</label>
              <input
                type="text"
                value={cardForm.address}
                onChange={e => handleInputChange('address', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:border-[#D72626] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Templates & Theme Customization */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="text-[#D72626]" size={20} />
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Card Templates & Styling Controls
            </h3>
          </div>

          <div className="space-y-4">
            {/* Presets Grid */}
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Preset Layout Templates</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'MODERN', label: 'Dark Modern' },
                  { id: 'CORPORATE', label: 'Corporate Blue' },
                  { id: 'MINIMAL', label: 'Clean Minimal' },
                  { id: 'PREMIUM', label: 'Premium Gold' },
                ].map(tmpl => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => applyPresetTemplate(tmpl.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      cardForm.templateType === tmpl.id
                        ? 'border-[#D72626] bg-red-50 dark:bg-red-950/40 text-[#D72626]'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {tmpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Primary Accent Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={cardForm.primaryColor}
                    onChange={e => handleInputChange('primaryColor', e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                  />
                  <input
                    type="text"
                    value={cardForm.primaryColor}
                    onChange={e => handleInputChange('primaryColor', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Card Background</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={cardForm.backgroundColor}
                    onChange={e => handleInputChange('backgroundColor', e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                  />
                  <input
                    type="text"
                    value={cardForm.backgroundColor}
                    onChange={e => handleInputChange('backgroundColor', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* QR Code Action Type */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">QR Code Data Payload</label>
              <select
                value={cardForm.qrCodeType}
                onChange={e => handleInputChange('qrCodeType', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:border-[#D72626] outline-none cursor-pointer"
              >
                <option value="VCARD" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white py-1">Save Contact (vCard 3.0 Standard)</option>
                <option value="WEBSITE" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white py-1">Company Website URL</option>
                <option value="WHATSAPP" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white py-1">Direct WhatsApp Chat Link</option>
                <option value="EMAIL" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white py-1">Email Contact Link</option>
                <option value="CUSTOM" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white py-1">Custom URL Link</option>
              </select>

              {cardForm.qrCodeType === 'CUSTOM' && (
                <div className="mt-3">
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Custom QR Code URL</label>
                  <input
                    type="text"
                    placeholder="https://rebonmotorcompany.com/card/moazam"
                    value={cardForm.customQrUrl || ''}
                    onChange={e => handleInputChange('customQrUrl', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:border-[#D72626] outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL: LIVE PREVIEW & EXPORT ACTIONS STUDIO ───────────────── */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 shadow-2xl text-white sticky top-24">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="text-[#D72626]" size={20} />
              <h3 className="text-base font-bold">Real-time Live Card Preview</h3>
            </div>
            <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-full border border-neutral-800">
              <button
                type="button"
                onClick={() => setActiveSide('front')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                  activeSide === 'front' ? 'bg-[#D72626] text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Front Side
              </button>
              <button
                type="button"
                onClick={() => setActiveSide('back')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                  activeSide === 'back' ? 'bg-[#D72626] text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Back Side
              </button>
            </div>
          </div>

          {/* Business Card Render Viewport */}
          <div className="py-6 flex justify-center bg-neutral-900/50 rounded-2xl border border-neutral-800/60 shadow-inner">
            <VisitingCardPreview
              cardData={cardForm}
              side={activeSide}
              scale={0.9}
              showFlipButton
              onFlip={() => setActiveSide(s => (s === 'front' ? 'back' : 'front'))}
            />
          </div>

          {/* Notification Message */}
          {message && (
            <div
              className={`mt-4 p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                message.type === 'success' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
              }`}
            >
              {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{message.text}</span>
            </div>
          )}

          {/* Action Toolbar */}
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={handleSaveCard}
              disabled={saving}
              className="w-full py-3 bg-[#D72626] hover:bg-red-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Save size={16} />
              <span>{saving ? 'Saving Design...' : 'Save Card Design'}</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handlePrint}
                className="py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Printer size={14} />
                <span>Print Card (1 Page)</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="py-2.5 bg-neutral-900 hover:bg-neutral-800 text-red-400 border border-neutral-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <FileDown size={14} />
                <span>Download Card (PDF)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleDownloadBothPNG}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <ImageIcon size={16} />
              <span>Download Both Sides (PNG) — One Click</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
