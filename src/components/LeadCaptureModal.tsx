import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { X, CheckCircle2, ShieldCheck, Send } from 'lucide-react';
import { LeadInquiry } from '../types';

export const LeadCaptureModal: React.FC = () => {
  const { 
    isLeadModalOpen, 
    closeLeadModal, 
    leadModalPreset, 
    softwareList, 
    submitLead 
  } = useData();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [inquiryType, setInquiryType] = useState<LeadInquiry['inquiryType']>(
    leadModalPreset.inquiryType || 'Software Demo'
  );
  const [softwareInterest, setSoftwareInterest] = useState<string>(
    leadModalPreset.softwareInterest || softwareList[0]?.name || 'FormSpace Prime'
  );
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isLeadModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLead({
      name,
      email,
      organization,
      role: role || 'Structural Engineer',
      inquiryType,
      softwareInterest,
      message,
    });
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setName('');
    setEmail('');
    setOrganization('');
    setMessage('');
    closeLeadModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl p-6 sm:p-8 shadow-2xl my-8 transition-colors">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-300 dark:border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-950 dark:text-white">
              Inquiry Dispatched Successfully
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
              Thank you, <span className="text-slate-950 dark:text-white font-semibold">{name}</span>. An engineering specialist from SSDesigner will review your structural requirements and send credentials or benchmark documentation to <span className="text-cyan-700 dark:text-cyan-400 font-mono font-medium">{email}</span>.
            </p>
            <div className="pt-4">
              <button
                onClick={handleClose}
                className="px-6 py-2 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-700 dark:text-cyan-400 uppercase tracking-wider mb-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Direct Lead Generation</span>
            </div>
            <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-2">
              Request Technical Evaluation & Demo
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-400 mb-6 font-normal">
              Connect with our structural software team for evaluation licenses, computational benchmarks, or commercial quotes.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-mono font-medium">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Dr. Helena Weber"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-mono font-medium">Professional Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="h.weber@structure.aero"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-mono font-medium">Company / Institute *</label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={e => setOrganization(e.target.value)}
                    placeholder="e.g. Foster + Partners / TUM"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-mono font-medium">Role / Designation</label>
                  <input
                    type="text"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    placeholder="Lead Structural Engineer"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-mono font-medium">Inquiry Nature</label>
                  <select
                    value={inquiryType}
                    onChange={e => setInquiryType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-cyan-500 focus:outline-none font-medium"
                  >
                    <option value="Software Demo">Technical Demo (Live)</option>
                    <option value="Commercial Quotation">Commercial Licensing</option>
                    <option value="Academic License">Academic / University</option>
                    <option value="Consulting / Engineering Partnership">Project Consulting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-mono font-medium">Software Interest</label>
                  <select
                    value={softwareInterest}
                    onChange={e => setSoftwareInterest(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-cyan-500 focus:outline-none font-medium"
                  >
                    {softwareList.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                    <option value="Complete SSDesigner Suite">Complete SSDesigner Suite</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-mono font-medium">Project Requirements / Model Brief</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Detail your structure type (e.g. 160m double curved truss, cable-net, deployable antenna) and solver requirements..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Technical Request</span>
                </button>
              </div>

              <p className="text-[10px] text-slate-600 dark:text-slate-400 text-center font-mono">
                Encrypted in transit. No marketing spam. Direct response from licensed engineering team.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
