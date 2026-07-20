'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Folder, FolderPlus, FileText, Image as ImageIcon, Video, File, Search, Grid, List,
  UploadCloud, X, ArrowLeft, Trash2, Edit3, Download, Copy, ChevronLeft, ChevronRight,
  FolderOpen, Plus, Tag, HelpCircle, Loader2, AlertCircle, CheckCircle, Info, Move
} from 'lucide-react';

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface MediaFile {
  id:           string;
  filename:     string;
  originalName: string;
  url:          string;
  mimeType:     string;
  size:         number;
  type:         string;
  width:        number | null;
  height:       number | null;
  duration:     number | null;
  altText:      string | null;
  caption:      string | null;
  description:  string | null;
  tags:         string[] | null;
  folderId:     string | null;
  createdAt:    string;
  folder:       FolderType | null;
  usages?:      MediaUsageType[];
}

interface FolderType {
  id:        string;
  name:      string;
  parentId:  string | null;
  _count?: {
    media: number;
  };
}

interface MediaUsageType {
  id:        string;
  entity:    string;
  entityId:  string;
  fieldName: string | null;
}

interface UploadTask {
  id:       string;
  name:     string;
  progress: number;
  status:   'uploading' | 'success' | 'error';
  error?:   string;
}

interface MediaLibraryProps {
  mode?:        'manage' | 'select'; // select mode is for Media Picker Modal
  onSelect?:    (url: string) => void;
  allowedTypes?: string[]; // e.g. ["IMAGE", "PDF"]
}

// Helper to format bytes
function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// ─── Client-Side Compression & Conversion ─────────────────────────────────────
function processImageToWebP(file: File): Promise<{ blob: Blob; filename: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    // Keep raw SVGs, GIFs or non-images
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
      return resolve({ blob: file, filename: file.name, width: 0, height: 0 });
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Failed to create canvas context'));

      // Resize logic
      const MAX_WIDTH = 1920;
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          // Rename extension to .webp
          const nameParts = file.name.split('.');
          nameParts.pop();
          const newName = `${nameParts.join('.')}.webp`;
          resolve({ blob, filename: newName, width, height });
        } else {
          reject(new Error('Canvas WebP conversion failed'));
        }
      }, 'image/webp', 0.82);
    };
    img.onerror = () => reject(new Error('Failed to load image for WebP compression'));
  });
}

// ─── Component Main ───────────────────────────────────────────────────────────
export default function MediaLibrary({ mode = 'manage', onSelect, allowedTypes }: MediaLibraryProps) {
  // Lists
  const [files, setFiles]       = useState<MediaFile[]>([]);
  const [folders, setFolders]   = useState<FolderType[]>([]);
  const [activeFolderId, setActiveFolderId] = useState<string>('all'); // "all", "root", or id

  // States
  const [loading, setLoading]   = useState(true);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Search & Filter
  const [search, setSearch]         = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortBy, setSortBy]         = useState('createdAt');
  const [sortOrder, setSortOrder]   = useState<'asc' | 'desc'>('desc');

  // Drawer / Selection
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [bulkSelection, setBulkSelection] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Folder Actions
  const [folderCreateOpen, setFolderCreateOpen] = useState(false);
  const [newFolderName, setNewFolderName]       = useState('');
  const [folderMoveOpen, setFolderMoveOpen]     = useState(false);
  const [targetFolderId, setTargetFolderId]     = useState('');

  // Upload Queue
  const [uploadTasks, setUploadTasks] = useState<UploadTask[]>([]);
  const [showUploadQueue, setShowUploadQueue] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stats summaries
  const [stats, setStats] = useState({ totalFiles: 0, storageUsed: 0 });

  // ─── Fetch Data ────────────────────────────────────────────────────────────

  const fetchFolders = async () => {
    try {
      const res = await fetch('/api/media/folders');
      const data = await res.json();
      if (data.success) setFolders(data.data);
    } catch (err) {
      console.error('Error fetching folders:', err);
    }
  };

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page:     String(page),
        limit:    '18',
        search,
        sortBy,
        sortOrder,
        type: typeFilter,
        folderId: activeFolderId === 'all' ? 'all' : (activeFolderId === 'root' ? 'root' : activeFolderId)
      });

      const res = await fetch(`/api/media?${params}`);
      const data = await res.json();
      if (data.success) {
        setFiles(data.data);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
        setStats({
          totalFiles: data.meta.totalFilesCount,
          storageUsed: data.meta.totalStorageUsed
        });
      }
    } catch (err) {
      console.error('Error fetching files:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, typeFilter, activeFolderId, sortBy, sortOrder]);

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // ─── File Details Side Loader ──────────────────────────────────────────────
  const selectFileForDetails = async (file: MediaFile) => {
    try {
      setSelectedFile(file);
      setIsDrawerOpen(true);
      // Fetch full details containing usage stats
      const res = await fetch(`/api/media/${file.id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedFile(data.data);
      }
    } catch (err) {
      console.error('Error loading detail usages:', err);
    }
  };

  // ─── Folder CRUD Handlers ──────────────────────────────────────────────────
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      const parentId = activeFolderId !== 'all' && activeFolderId !== 'root' ? activeFolderId : null;
      const res = await fetch('/api/media/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFolderName.trim(), parentId })
      });
      const data = await res.json();
      if (res.ok) {
        setNewFolderName('');
        setFolderCreateOpen(false);
        fetchFolders();
      } else {
        alert(data.error || 'Failed to create folder');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFolder = async (folderId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete folder "${name}"? Files inside will be moved to root.`)) return;

    try {
      const res = await fetch(`/api/media/folders/${folderId}`, { method: 'DELETE' });
      if (res.ok) {
        setActiveFolderId('all');
        fetchFolders();
        fetchFiles();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ─── File Actions ─────────────────────────────────────────────────────────

  const handleUpdateMetadata = async (fileId: string, payload: any) => {
    try {
      const res = await fetch(`/api/media/${fileId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setSelectedFile(data.data);
        fetchFiles();
      }
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleDeleteFile = async (fileId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete file "${name}"?`)) return;
    try {
      const res = await fetch(`/api/media/${fileId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setIsDrawerOpen(false);
        setSelectedFile(null);
        fetchFiles();
      } else {
        alert(data.error || 'Failed to delete file');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkMove = async () => {
    if (bulkSelection.length === 0 || !targetFolderId) return;

    try {
      for (const fileId of bulkSelection) {
        await fetch(`/api/media/${fileId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ folderId: targetFolderId })
        });
      }
      setBulkSelection([]);
      setFolderMoveOpen(false);
      fetchFiles();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkDelete = async () => {
    if (bulkSelection.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${bulkSelection.length} selected files?`)) return;

    try {
      let failed = 0;
      for (const fileId of bulkSelection) {
        const res = await fetch(`/api/media/${fileId}`, { method: 'DELETE' });
        if (!res.ok) failed++;
      }
      setBulkSelection([]);
      fetchFiles();
      if (failed > 0) alert(`Some files couldn't be deleted because they are referenced in products/dealers.`);
    } catch (err) {
      console.error(err);
    }
  };

  // Copy Public Link Helper
  const handleCopyLink = (url: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    alert('Copied URL: ' + fullUrl);
  };

  // ─── Upload Handler ────────────────────────────────────────────────────────
  const handleFileUpload = async (filesToUpload: FileList) => {
    setShowUploadQueue(true);

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      const taskId = `${Date.now()}-${i}`;
      
      const newTask: UploadTask = {
        id: taskId,
        name: file.name,
        progress: 10,
        status: 'uploading'
      };
      setUploadTasks(prev => [newTask, ...prev]);

      try {
        // Run Client-Side Conversion to WebP and fetch dimensions!
        const processed = await processImageToWebP(file);
        
        const fd = new FormData();
        fd.append('file', processed.blob, processed.filename);
        if (processed.width) fd.append('width', processed.width.toString());
        if (processed.height) fd.append('height', processed.height.toString());
        
        const activeFolderVal = activeFolderId !== 'all' && activeFolderId !== 'root' ? activeFolderId : 'root';
        fd.append('folderId', activeFolderVal);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/media/upload', true);

        // Track upload progress
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setUploadTasks(prev => prev.map(t => t.id === taskId ? { ...t, progress: pct } : t));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 201) {
            setUploadTasks(prev => prev.map(t => t.id === taskId ? { ...t, progress: 100, status: 'success' } : t));
            fetchFiles();
          } else {
            const errResponse = JSON.parse(xhr.responseText || '{}');
            setUploadTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'error', error: errResponse.error || 'Server Error' } : t));
          }
        };

        xhr.onerror = () => {
          setUploadTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'error', error: 'Connection Failed' } : t));
        };

        xhr.send(fd);
      } catch (err: any) {
        setUploadTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'error', error: err.message || 'Compression Failed' } : t));
      }
    }
  };

  const onDragOver = (e: React.DragEvent) => e.preventDefault();
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Get MIME Icon helper
  const getIconForMime = (mime: string) => {
    if (mime.startsWith('image/')) return ImageIcon;
    if (mime.startsWith('video/')) return Video;
    if (mime === 'application/pdf') return FileText;
    return File;
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-white dark:bg-neutral-950 font-sans shadow-sm">
      {/* ─── LEFT SIDEBAR: Virtual Folders Tree ───────────────────────────────── */}
      <div className="w-60 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20 p-4 space-y-4 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Directories</span>
            <button
              onClick={() => setFolderCreateOpen(true)}
              className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-550 transition-colors"
              title="Create folder"
            >
              <FolderPlus size={15} />
            </button>
          </div>

          {/* Folder Creation Input Pop */}
          {folderCreateOpen && (
            <form onSubmit={handleCreateFolder} className="space-y-2 p-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
              <input
                type="text"
                autoFocus
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                placeholder="Folder name…"
                className="w-full px-2 py-1 text-xs border border-neutral-300 dark:border-neutral-700 bg-transparent rounded outline-none focus:ring-1 focus:ring-red-500"
              />
              <div className="flex justify-end gap-1.5 text-[10px]">
                <button type="button" onClick={() => setFolderCreateOpen(false)} className="px-2 py-1 text-neutral-500">Cancel</button>
                <button type="submit" className="px-2 py-1 bg-red-600 text-white rounded font-bold">Create</button>
              </div>
            </form>
          )}

          {/* Folders navigation tree */}
          <div className="space-y-1">
            <button
              onClick={() => setActiveFolderId('all')}
              className={`w-full flex items-center px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeFolderId === 'all'
                  ? 'bg-red-50 dark:bg-red-950/15 text-red-650 dark:text-red-400'
                  : 'text-neutral-700 dark:text-neutral-450 hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <FolderOpen size={14} className="mr-2" />
              <span>All Media Library</span>
            </button>

            <button
              onClick={() => setActiveFolderId('root')}
              className={`w-full flex items-center px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeFolderId === 'root'
                  ? 'bg-red-50 dark:bg-red-950/15 text-red-650 dark:text-red-400'
                  : 'text-neutral-700 dark:text-neutral-450 hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <Folder size={14} className="mr-2" />
              <span>Unassigned Files (Root)</span>
            </button>

            {folders.map(folder => {
              const isActive = activeFolderId === folder.id;
              return (
                <div key={folder.id} className="group flex items-center justify-between rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 pr-2">
                  <button
                    onClick={() => setActiveFolderId(folder.id)}
                    className={`flex-1 flex items-center px-3 py-2 text-xs font-semibold rounded-lg transition-colors text-left ${
                      isActive
                        ? 'text-red-650 dark:text-red-400'
                        : 'text-neutral-700 dark:text-neutral-450'
                    }`}
                  >
                    <Folder size={14} className="mr-2 flex-shrink-0" />
                    <span className="truncate">{folder.name}</span>
                    <span className="text-[10px] text-neutral-400 font-bold ml-1.5">
                      ({folder._count?.media || 0})
                    </span>
                  </button>
                  <button
                    onClick={() => handleDeleteFolder(folder.id, folder.name)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-red-500 transition-opacity"
                    title="Delete folder"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Storage stats */}
        <div className="p-3 bg-neutral-100 dark:bg-neutral-900/50 rounded-xl space-y-2 border border-neutral-200/50 dark:border-neutral-800/40 text-[10px] text-neutral-500">
          <p className="font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">Library Summary</p>
          <div className="flex justify-between">
            <span>Total Files:</span>
            <span className="font-bold">{stats.totalFiles}</span>
          </div>
          <div className="flex justify-between">
            <span>Storage Used:</span>
            <span className="font-bold">{formatBytes(stats.storageUsed)}</span>
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT: Gallery Library ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden" onDragOver={onDragOver} onDrop={onDrop}>
        {/* Gallery Toolbar header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-neutral-950">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-450" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search file name, metadata..."
                className="w-full pl-9 pr-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-xs focus:ring-1 focus:ring-red-500 outline-none text-neutral-900 dark:text-white placeholder:text-neutral-450"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                  <X size={13} />
                </button>
              )}
            </div>

            <select
              value={typeFilter}
              onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-xs focus:ring-1 focus:ring-red-500 outline-none"
            >
              <option value="">All Types</option>
              <option value="IMAGE">Images Only</option>
              <option value="VIDEO">Videos Only</option>
              <option value="PDF">PDF Documents</option>
              <option value="DOCUMENT">Word/Excel Docs</option>
              <option value="SVG">SVG Graphics</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode controls */}
            <div className="flex border border-neutral-300 dark:border-neutral-700 rounded-lg overflow-hidden p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white' : 'text-neutral-450'}`}
              >
                <Grid size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white' : 'text-neutral-450'}`}
              >
                <List size={14} />
              </button>
            </div>

            {/* Quick Upload action */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-red-650 hover:bg-red-700 text-white px-3.5 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <UploadCloud size={14} />
              <span>Upload Files</span>
            </button>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={e => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
            />
          </div>
        </div>

        {/* Bulk Action Controls */}
        {bulkSelection.length > 0 && (
          <div className="bg-red-50/50 dark:bg-neutral-900 p-3 border-b border-neutral-200 dark:border-neutral-850 flex items-center justify-between text-xs transition-all">
            <span className="font-bold text-red-650 dark:text-red-400">{bulkSelection.length} media selected</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFolderMoveOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-neutral-805 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 rounded-lg"
              >
                <Move size={13} />
                <span>Move to folder</span>
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-650 text-white hover:bg-red-700 rounded-lg font-bold"
              >
                <Trash2 size={13} />
                <span>Delete selected</span>
              </button>
            </div>
          </div>
        )}

        {/* Gallery viewport panel */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full text-neutral-400">
              <Loader2 className="w-6 h-6 animate-spin text-red-550 mr-2" />
              <span className="text-xs">Loading media collection...</span>
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center text-neutral-500">
              <UploadCloud className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mb-3" />
              <p className="text-sm font-semibold">Drop files here to upload</p>
              <p className="text-xs text-neutral-400 mt-1 max-w-[250px] leading-relaxed">
                Drag and drop your images or documents directly or click the upload button to populate your directory.
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {files.map(file => {
                const isSelected = selectedFile?.id === file.id;
                const isChecked = bulkSelection.includes(file.id);
                const Icon = getIconForMime(file.mimeType);

                return (
                  <div
                    key={file.id}
                    className={`group relative rounded-xl border overflow-hidden cursor-pointer bg-neutral-50 dark:bg-neutral-900 transition-all ${
                      isSelected
                        ? 'border-red-600 shadow-md shadow-red-500/5 bg-white dark:bg-neutral-950'
                        : 'border-neutral-200/60 dark:border-neutral-800/80 hover:border-red-500/50'
                    }`}
                  >
                    {/* Bulk Selection Checkbox */}
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={e => {
                        e.stopPropagation();
                        if (e.target.checked) {
                          setBulkSelection(prev => [...prev, file.id]);
                        } else {
                          setBulkSelection(prev => prev.filter(id => id !== file.id));
                        }
                      }}
                      className="absolute top-2.5 left-2.5 z-10 w-4 h-4 text-red-600 rounded border-neutral-300 opacity-0 group-hover:opacity-100 checked:opacity-100 transition-opacity"
                    />

                    {/* Gallery Thumbnail Preview */}
                    <div
                      onClick={() => selectFileForDetails(file)}
                      className="aspect-square bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center overflow-hidden border-b border-neutral-200/50 dark:border-neutral-800/40"
                    >
                      {file.mimeType.startsWith('image/') ? (
                        <img
                          src={file.url}
                          alt=""
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="p-4 rounded-full bg-neutral-200/50 dark:bg-neutral-900 flex items-center justify-center">
                          <Icon className="w-8 h-8 text-neutral-450" />
                        </div>
                      )}
                    </div>

                    {/* Metadata strip */}
                    <div
                      onClick={() => selectFileForDetails(file)}
                      className="p-2 space-y-0.5"
                    >
                      <p className="text-[10px] font-bold text-neutral-800 dark:text-neutral-250 truncate">
                        {file.originalName}
                      </p>
                      <div className="flex items-center justify-between text-[9px] text-neutral-450 font-mono">
                        <span>{formatBytes(file.size, 1)}</span>
                        {file.width && file.height && (
                          <span>{file.width}×{file.height}</span>
                        )}
                      </div>
                    </div>

                    {/* Click trigger callback in Picker mode */}
                    {mode === 'select' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelect) onSelect(file.url);
                        }}
                        className="absolute bottom-2 right-2 p-1 rounded-md bg-red-650 hover:bg-red-700 text-white font-bold text-[9px] uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Select
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
              <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800 text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-900/50">
                  <tr>
                    <th className="px-4 py-3 text-left w-6"></th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Size</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Uploaded</th>
                    <th className="relative px-4 py-3 text-right"></th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-neutral-950 divide-y divide-neutral-200 dark:divide-neutral-800">
                  {files.map(file => {
                    const isChecked = bulkSelection.includes(file.id);
                    const Icon = getIconForMime(file.mimeType);

                    return (
                      <tr
                        key={file.id}
                        onClick={() => selectFileForDetails(file)}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={e => {
                              if (e.target.checked) {
                                setBulkSelection(prev => [...prev, file.id]);
                              } else {
                                setBulkSelection(prev => prev.filter(id => id !== file.id));
                              }
                            }}
                            className="w-4 h-4 text-red-600 rounded border-neutral-300"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Icon size={14} className="text-neutral-450 flex-shrink-0" />
                            <span className="font-bold text-neutral-800 dark:text-neutral-200 truncate max-w-[200px]">{file.originalName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-mono text-neutral-500">{formatBytes(file.size)}</td>
                        <td className="px-4 py-3 whitespace-nowrap font-mono text-neutral-500">{file.mimeType}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-neutral-500">
                          {new Date(file.createdAt).toLocaleDateString('en-PK')}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right" onClick={e => e.stopPropagation()}>
                          {mode === 'select' && onSelect && (
                            <button
                              onClick={() => onSelect(file.url)}
                              className="bg-red-650 hover:bg-red-700 text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider"
                            >
                              Choose
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs bg-white dark:bg-neutral-950">
            <span className="text-neutral-500 font-semibold">Page {page} of {totalPages}</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-500 disabled:opacity-40"
              >
                <ChevronLeft size={13} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-500 disabled:opacity-40"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── RIGHT DRAWER: Metadata Details side drawer ────────────────────────── */}
      {isDrawerOpen && selectedFile && (
        <div className="w-80 border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-y-auto flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/20">
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">File Metadata</span>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-450"
            >
              <X size={15} />
            </button>
          </div>

          <div className="p-4 space-y-5 flex-1">
            {/* Visual Preview */}
            <div className="aspect-video rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800/80 overflow-hidden flex items-center justify-center">
              {selectedFile.mimeType.startsWith('image/') ? (
                <img src={selectedFile.url} alt="" className="w-full h-full object-contain" />
              ) : selectedFile.mimeType.startsWith('video/') ? (
                <video src={selectedFile.url} controls className="w-full h-full object-contain" />
              ) : (
                <FileText className="w-10 h-10 text-neutral-450" />
              )}
            </div>

            {/* Read-only details */}
            <div className="space-y-2 border-b border-neutral-100 dark:border-neutral-800/60 pb-4 text-[11px] text-neutral-600 dark:text-neutral-400">
              <div className="flex justify-between">
                <span>Original Name:</span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200 truncate max-w-[150px]">{selectedFile.originalName}</span>
              </div>
              <div className="flex justify-between">
                <span>File Size:</span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200">{formatBytes(selectedFile.size)}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span>MIME Type:</span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200">{selectedFile.mimeType}</span>
              </div>
              {selectedFile.width && selectedFile.height && (
                <div className="flex justify-between">
                  <span>Dimensions:</span>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">{selectedFile.width}×{selectedFile.height} pixels</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Uploaded At:</span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200">{new Date(selectedFile.createdAt).toLocaleDateString('en-PK')}</span>
              </div>
            </div>

            {/* Editable Fields form */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 mb-1 uppercase tracking-wider">Alt Text (SEO)</label>
                <input
                  type="text"
                  value={selectedFile.altText || ''}
                  onChange={e => handleUpdateMetadata(selectedFile.id, { altText: e.target.value })}
                  placeholder="Alt text describing image..."
                  className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 rounded-lg outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-500 mb-1 uppercase tracking-wider">Caption</label>
                <input
                  type="text"
                  value={selectedFile.caption || ''}
                  onChange={e => handleUpdateMetadata(selectedFile.id, { caption: e.target.value })}
                  placeholder="Add a visible caption..."
                  className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 rounded-lg outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-500 mb-1 uppercase tracking-wider">Description</label>
                <textarea
                  value={selectedFile.description || ''}
                  onChange={e => handleUpdateMetadata(selectedFile.id, { description: e.target.value })}
                  rows={2}
                  placeholder="Detail notes..."
                  className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 rounded-lg outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Usages Tracking block */}
            <div className="border-t border-neutral-150 dark:border-neutral-800 pt-4 space-y-2">
              <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                <Info size={12} className="text-red-500" />
                Active References Usages
              </h4>
              
              {(!selectedFile.usages || selectedFile.usages.length === 0) ? (
                <p className="text-[10px] text-neutral-450 italic">This file is currently not referenced in any modules.</p>
              ) : (
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {selectedFile.usages.map(u => (
                    <div key={u.id} className="p-1.5 bg-neutral-100 dark:bg-neutral-900 rounded text-[9px] font-bold border border-neutral-200/50 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-400">
                      Used in {u.entity} #{u.entityId.slice(0, 8)} ({u.fieldName || 'general'})
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* File Actions block */}
            <div className="pt-4 border-t border-neutral-150 dark:border-neutral-800 flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => handleCopyLink(selectedFile.url)}
                className="flex-1 min-w-[90px] py-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-850 dark:text-neutral-250 font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <Copy size={12} />
                <span>Copy URL</span>
              </button>
              <a
                href={selectedFile.url}
                download={selectedFile.originalName}
                className="flex-1 min-w-[90px] py-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-850 dark:text-neutral-250 font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download size={12} />
                <span>Download</span>
              </a>
              <button
                onClick={() => handleDeleteFile(selectedFile.id, selectedFile.originalName)}
                className="w-full py-2 bg-red-650 hover:bg-red-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 size={12} />
                <span>Delete file</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── FLOATING DRAWER: Upload progress monitor queue ────────────────────── */}
      {showUploadQueue && (
        <div className="fixed bottom-4 right-4 z-50 w-80 bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden font-sans">
          <div className="bg-neutral-50 dark:bg-neutral-805 p-3.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs font-bold">
            <span>Uploading Queue</span>
            <button onClick={() => setShowUploadQueue(false)} className="text-neutral-450 hover:text-neutral-600">
              <X size={14} />
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto divide-y divide-neutral-150 dark:divide-neutral-800 p-2 space-y-2">
            {uploadTasks.map(task => (
              <div key={task.id} className="p-2 space-y-1.5 text-[10px]">
                <div className="flex items-center justify-between font-bold text-neutral-700 dark:text-neutral-300">
                  <span className="truncate max-w-[150px]">{task.name}</span>
                  {task.status === 'success' && <span className="text-emerald-500 flex items-center gap-0.5"><CheckCircle size={11} /> Success</span>}
                  {task.status === 'error' && <span className="text-red-500 flex items-center gap-0.5" title={task.error}><AlertCircle size={11} /> Failed</span>}
                  {task.status === 'uploading' && <span>{task.progress}%</span>}
                </div>
                {task.status === 'uploading' && (
                  <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-red-600 h-1 rounded-full transition-all duration-200" style={{ width: `${task.progress}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── FLOATING DRAWER: Virtual Folder moves modal ───────────────────────── */}
      {folderMoveOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 w-full max-w-sm space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">Move selected files</h3>
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-neutral-500">Destination folder</label>
              <select
                value={targetFolderId}
                onChange={e => setTargetFolderId(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-lg text-xs"
              >
                <option value="">— Select Folder —</option>
                <option value="root">Root Directory</option>
                {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-2 text-xs">
              <button onClick={() => setFolderMoveOpen(false)} className="px-3.5 py-1.5 text-neutral-500 font-semibold">Cancel</button>
              <button onClick={handleBulkMove} disabled={!targetFolderId} className="px-3.5 py-1.5 bg-red-650 hover:bg-red-700 text-white rounded-lg font-bold disabled:opacity-50">Move Files</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
