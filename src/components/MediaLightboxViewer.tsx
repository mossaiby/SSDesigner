import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Film, 
  Image as ImageIcon, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

export const MediaLightboxViewer: React.FC = () => {
  const { 
    activeMediaItem, 
    activeMediaList,
    activeMediaIndex,
    hasPrevMedia,
    hasNextMedia,
    prevMediaItem,
    nextMediaItem,
    closeMediaLightbox 
  } = useData();

  const [zoomLevel, setZoomLevel] = useState(1);

  // Reset zoom on item change
  useEffect(() => {
    setZoomLevel(1);
  }, [activeMediaItem?.id]);

  // Keyboard navigation
  useEffect(() => {
    if (!activeMediaItem) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMediaLightbox();
      } else if (e.key === 'ArrowLeft') {
        prevMediaItem();
      } else if (e.key === 'ArrowRight') {
        nextMediaItem();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeMediaItem, prevMediaItem, nextMediaItem, closeMediaLightbox]);

  if (!activeMediaItem) return null;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(3, prev + 0.25));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(0.5, prev - 0.25));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-slate-950/95 dark:bg-slate-950/95 backdrop-blur-lg">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-900/90 z-20">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400">
            {activeMediaItem.type === 'photo' ? <ImageIcon className="w-4 h-4" /> : <Film className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white tracking-tight">
                {activeMediaItem.title}
              </h3>
              {activeMediaList.length > 1 && (
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-800/60 px-2 py-0.5 rounded">
                  {activeMediaIndex + 1} / {activeMediaList.length}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {activeMediaItem.dimensions || 'High Resolution'} · Added {activeMediaItem.createdAt}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {activeMediaItem.type === 'photo' && (
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 mr-2">
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs text-cyan-400 px-1 w-12 text-center tabular-nums">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}

          <a
            href={activeMediaItem.url}
            download={activeMediaItem.title}
            target="_blank"
            rel="noreferrer"
            className="p-2 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800 transition-colors"
            title="Open Raw / Download"
          >
            <Download className="w-4 h-4" />
          </a>

          <button
            onClick={closeMediaLightbox}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-2"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Stage with Prominent Left and Right Navigation Buttons */}
      <div className="flex-1 relative flex items-center justify-center p-4 sm:p-8 overflow-hidden select-none">
        {/* Previous Button "<" */}
        {hasPrevMedia && (
          <button
            onClick={prevMediaItem}
            className="absolute left-4 sm:left-6 z-30 p-3 sm:p-4 rounded-full bg-slate-900/80 hover:bg-cyan-500 text-slate-300 hover:text-slate-950 border border-slate-700 hover:border-cyan-400 shadow-2xl backdrop-blur transition-all duration-150 transform hover:scale-110 active:scale-95 group"
            title="Previous Asset (Left Arrow)"
            aria-label="Previous Asset"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}

        {/* Content Viewer */}
        {activeMediaItem.type === 'photo' ? (
          <div className="relative max-w-full max-h-full flex items-center justify-center overflow-auto">
            <img
              src={activeMediaItem.url}
              alt={activeMediaItem.title}
              style={{ transform: `scale(${zoomLevel})` }}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl transition-transform duration-150"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden bg-black shadow-2xl border border-slate-800">
            <video
              key={activeMediaItem.url}
              src={activeMediaItem.url}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {/* Next Button ">" */}
        {hasNextMedia && (
          <button
            onClick={nextMediaItem}
            className="absolute right-4 sm:right-6 z-30 p-3 sm:p-4 rounded-full bg-slate-900/80 hover:bg-cyan-500 text-slate-300 hover:text-slate-950 border border-slate-700 hover:border-cyan-400 shadow-2xl backdrop-blur transition-all duration-150 transform hover:scale-110 active:scale-95 group"
            title="Next Asset (Right Arrow)"
            aria-label="Next Asset"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}
      </div>

      {/* Bottom Telemetry HUD */}
      <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="max-w-2xl">
          <p className="text-slate-200 font-medium mb-1">
            {activeMediaItem.caption || activeMediaItem.title}
          </p>
          {activeMediaItem.technicalNote && (
            <p className="font-mono text-cyan-400 text-[11px]">
              ENGINEERING NOTE: {activeMediaItem.technicalNote}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {activeMediaItem.tags && activeMediaItem.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {activeMediaItem.tags.map(tag => (
                <span key={tag} className="text-[11px] font-mono text-slate-400 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {activeMediaList.length > 1 && (
            <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px]">←</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px]">→</kbd>
              <span>to navigate</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
