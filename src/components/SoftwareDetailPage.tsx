import React, { useEffect } from 'react';
import { useData } from '../context/DataContext';
import { 
  ArrowLeft, 
  Layers, 
  Cpu, 
  FileCode2, 
  CheckCircle2, 
  Image as ImageIcon, 
  Film, 
  Play, 
  Download, 
  ExternalLink, 
  Share2, 
  ShieldCheck, 
  Compass, 
  Plus,
  BookOpen,
  Sigma
} from 'lucide-react';
import { MathRenderer, FormattedMathText, BlockMath, InlineMath } from './MathRenderer';

interface SoftwareDetailPageProps {
  softwareId: string;
}

export const SoftwareDetailPage: React.FC<SoftwareDetailPageProps> = ({ softwareId }) => {
  const { 
    softwareList, 
    projectsList, 
    mediaList, 
    navigateTo, 
    openLeadModal, 
    openGalleryModal, 
    openMediaLightbox, 
    can 
  } = useData();

  const software = softwareList.find(s => s.id === softwareId) || softwareList[0];

  // Projects that used this software
  const usedInProjects = projectsList.filter(p => 
    p.softwareUsed.some(name => software.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(software.name.toLowerCase()))
  );

  // Media associated with this software
  const softwareMedia = mediaList.filter(m => m.targetType === 'software' && m.targetId === software.id);

  // Update document title for Technical SEO
  useEffect(() => {
    document.title = `${software.name} – Space Structures Engineering Software | AeroSpatial`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [software]);

  return (
    <article className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      {/* Breadcrumb & Navigation */}
      <div className="max-w-6xl mx-auto mb-8">
        <button
          onClick={() => navigateTo({ view: 'all_software' })}
          className="inline-flex items-center gap-2 text-xs font-mono text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to All Engineering Software
        </button>
      </div>

      {/* Prominent Header Banner */}
      <header className="max-w-6xl mx-auto mb-12">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400 mb-3">
          <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{software.category}</span>
          <span>·</span>
          <span>Version {software.version}</span>
          <span>·</span>
          <span>Release Date: {software.releaseDate}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight mb-4 text-balance">
          {software.name}
        </h1>

        <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed mb-6 font-normal">
          {software.tagline}
        </p>

        {/* CTA Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => openLeadModal({ softwareInterest: software.name, inquiryType: 'Software Demo' })}
            className="px-6 py-3 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-950/20"
          >
            Request Evaluation License & Live Demo
          </button>

          <button
            onClick={() => openGalleryModal(software.id, 'software', software.name)}
            className="px-5 py-3 text-xs font-medium rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-cyan-500 transition-colors flex items-center gap-2 shadow-sm"
          >
            <ImageIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Open Media Gallery ({softwareMedia.length})</span>
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Primary Details */}
        <div className="lg:col-span-8 space-y-12">
          {/* Detailed Engineering Overview */}
          <section className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white tracking-tight mb-4">
              Structural Engineering Capabilities
            </h2>
            <div className="whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed">
              <FormattedMathText text={software.description} />
            </div>
          </section>

          {/* Key Capabilities Grid */}
          <section>
            <h3 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight mb-4">
              Core Solver Features & Modules
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {software.keyFeatures.map((feat, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex items-start gap-3 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-snug">
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Mathematical Foundations with KaTeX renderer */}
          <section className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                Mathematical Foundations & Formulations
              </h3>
              <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-300 dark:border-cyan-800">
                react-katex Verified
              </span>
            </div>
            <div className="space-y-3">
              {software.mathematicalFoundations.map((formula, idx) => (
                <MathRenderer key={idx} formula={formula} />
              ))}
            </div>
          </section>

          {/* Solver Numerical Pipeline & TeX Derivations Documentation */}
          <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white tracking-tight">
                    Solver Numerical Documentation & Algorithmic Pipeline
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Step-by-step state transition equations and convergence criteria executed by {software.name}.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 px-2 py-1 rounded bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800">
                react-katex Engine
              </span>
            </div>

            {software.id === 'soft_formspace' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <p>
                  FormSpace Prime integrates a central difference kinetic damping time-stepping algorithm that operates without inverting large structural stiffness matrices:
                </p>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                    <span className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-400">Step 1: Out-of-Balance Nodal Residual</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Calculates residual vector <InlineMath math="\mathbf{R}_i^t" /> across all connected cables <InlineMath math="j \in \mathcal{N}_i" />:</p>
                    <BlockMath math="\mathbf{R}_i^t = \mathbf{F}_i^{\text{ext}} - \sum_{j \in \mathcal{N}_i} \frac{T_{ij}^t}{L_{ij}^t} (\mathbf{x}_j^t - \mathbf{x}_i^t)" />
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                    <span className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-400">Step 2: Half-Interval Velocity & Coordinate Leapfrog</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Integrates velocity at mid-steps to guarantee second-order symplectic phase accuracy:</p>
                    <BlockMath math="\mathbf{v}_i^{t + \Delta t/2} = \mathbf{v}_i^{t - \Delta t/2} + \frac{\Delta t}{m_i} \mathbf{R}_i^t \quad \implies \quad \mathbf{x}_i^{t + \Delta t} = \mathbf{x}_i^t + \Delta t \, \mathbf{v}_i^{t + \Delta t/2}" />
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                    <span className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-400">Step 3: Kinetic Energy Peak Reset & Convergence Check</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">When total kinetic energy begins to decelerate, velocity is snapped to zero to eliminate kinetic overshoot:</p>
                    <BlockMath math="E_k(t) = \frac{1}{2} \sum_{i=1}^n m_i \|\mathbf{v}_i^t\|^2 \quad \text{with} \quad E_k(t) < E_k(t - \Delta t) \implies \mathbf{v}_i \leftarrow \mathbf{0}, \quad \|\mathbf{R}\|_\infty \le 10^{-10}\,\text{N}" />
                  </div>
                </div>
              </div>
            )}

            {software.id === 'soft_aerolattice' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <p>
                  AeroLattice 3D utilizes the modified Riks-Crisfield cylindrical arc-length method to trace through unstable post-buckling snap-through paths:
                </p>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                    <span className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-400">Step 1: Tangent Predictor Step</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Evaluates initial displacement direction along the tangent stiffness gradient:</p>
                    <BlockMath math="\Delta \mathbf{u}_0 = \Delta \lambda_0 \mathbf{K}_T^{-1} \mathbf{P}_{\text{ref}} \quad \text{where} \quad \Delta \lambda_0 = \pm \frac{\Delta l}{\sqrt{\mathbf{P}_{\text{ref}}^T \mathbf{K}_T^{-T} \mathbf{K}_T^{-1} \mathbf{P}_{\text{ref}} + \psi^2 \|\mathbf{P}_{\text{ref}}\|^2}}" />
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                    <span className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-400">Step 2: Constrained Newton-Raphson Orthogonal Corrector</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Restricts corrective iterations to lie on a cylindrical hypersurface in displacement-load space:</p>
                    <BlockMath math="\begin{bmatrix} \mathbf{K}_T & -\mathbf{P} \\ 2\Delta\mathbf{u}^T & 2\psi^2 \Delta\lambda (\mathbf{P}^T\mathbf{P}) \end{bmatrix} \begin{bmatrix} \delta\mathbf{u} \\ \delta\lambda \end{bmatrix} = \begin{bmatrix} \mathbf{R} \\ \Delta l^2 - \|\Delta\mathbf{u}\|^2 - \psi^2 \Delta\lambda^2 \|\mathbf{P}\|^2 \end{bmatrix}" />
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                    <span className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-400">Step 3: Bifurcation Detection & Tangent Determinant</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Captures shell snap-through at the singular limit point where tangent stiffness determinant approaches zero:</p>
                    <BlockMath math="\det\left(\mathbf{K}_T\right) = 0 \quad \text{where} \quad \mathbf{K}_T = \mathbf{K}_e + \mathbf{K}_g(\boldsymbol{\sigma}) + \mathbf{K}_{uL}(\mathbf{u})" />
                  </div>
                </div>
              </div>
            )}

            {software.id === 'soft_deployx' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <p>
                  DeployX Space solves flexible multibody aerospace kinematics using the Absolute Nodal Coordinate Formulation (ANCF) with Baumgarte constraint stabilization:
                </p>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                    <span className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-400">Step 1: Index-3 Differential-Algebraic Equations (DAE)</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Couples flexible coordinate dynamics with spatial kinematic joint constraints <InlineMath math="\boldsymbol{\Phi}(\mathbf{q}) = \mathbf{0}" />:</p>
                    <BlockMath math="\begin{bmatrix} \mathbf{M}(\mathbf{q}) & \boldsymbol{\Phi}_{\mathbf{q}}^T \\ \boldsymbol{\Phi}_{\mathbf{q}} & \mathbf{0} \end{bmatrix} \begin{bmatrix} \ddot{\mathbf{q}} \\ \boldsymbol{\lambda} \end{bmatrix} = \begin{bmatrix} \mathbf{Q}_{\text{ext}} - \mathbf{C}\dot{\mathbf{q}} - \mathbf{K}\mathbf{q} \\ -\dot{\boldsymbol{\Phi}}_{\mathbf{q}}\dot{\mathbf{q}} - 2\alpha\dot{\boldsymbol{\Phi}} - \beta^2\boldsymbol{\Phi} \end{bmatrix}" />
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                    <span className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-400">Step 2: Best-Fit Parabolic Surface RMS Validation</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Validates deployable reflector surface precision against target RF telemetry standards:</p>
                    <BlockMath math="\delta_{\text{RMS}} = \sqrt{ \frac{1}{N} \sum_{k=1}^N \left( z_k - \frac{x_k^2 + y_k^2}{4 F} \right)^2 } \le 0.35\,\text{mm}" />
                  </div>
                </div>
              </div>
            )}

            {software.id === 'soft_nodegen' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <p>
                  NodeGen Parametric checks inter-member collision envelopes on solid spherical nodes and checks local notch stress concentrations:
                </p>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                    <span className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-400">Step 1: 3D Spatial Member Non-Collision Angular Cone</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Guarantees that tubular members and wrenches have sufficient clearance during site assembly:</p>
                    <BlockMath math="\theta_{ij} = \arccos\left(\frac{\mathbf{v}_i \cdot \mathbf{v}_j}{\|\mathbf{v}_i\| \|\mathbf{v}_j\|}\right) \ge \arcsin\left(\frac{r_i}{R}\right) + \arcsin\left(\frac{r_j}{R}\right) + \theta_{\text{clearance}}" />
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                    <span className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-400">Step 2: Neuber Notch Plasticity Rule</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Computes peak localized stresses around internal tapped threads in MERO joints:</p>
                    <BlockMath math="\sigma_{\text{max}} \cdot \epsilon_{\text{max}} = K_t^2 \cdot S \cdot e \quad \implies \quad \sigma_{\text{max}} = \sqrt{E \cdot S \cdot e \cdot K_t^2}" />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Dedicated Photo & Video Gallery Section */}
          <section className="border-t border-slate-200 dark:border-slate-800 pt-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight">
                  Photo & Video Simulation Gallery
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Visual validation records, dynamic simulation clips, and high-resolution meshes. Click any asset to open with next / prev controls.
                </p>
              </div>

              <button
                onClick={() => openGalleryModal(software.id, 'software', software.name)}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30 hover:bg-cyan-100 dark:hover:bg-cyan-500/20 transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-3 h-3" />
                Manage Gallery
              </button>
            </div>

            {softwareMedia.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/20 text-center">
                <ImageIcon className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-400 mb-1">
                  Gallery initialized and ready for uploads
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  Photos and video simulations can be uploaded anytime via the administrator panel.
                </p>
                {can('manage_media') && (
                  <button
                    onClick={() => openGalleryModal(software.id, 'software', software.name)}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
                  >
                    Upload First Media Asset
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {softwareMedia.map(item => (
                  <div
                    key={item.id}
                    onClick={() => openMediaLightbox(item, softwareMedia)}
                    className="group relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden cursor-pointer hover:border-cyan-500 transition-all shadow-sm"
                  >
                    <div className="relative aspect-video bg-slate-950 overflow-hidden">
                      <img
                        src={item.type === 'photo' ? item.url : (item.thumbnailUrl || item.url)}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      {item.type === 'video' && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                          </div>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-cyan-300">
                        {item.type.toUpperCase()}
                      </div>
                    </div>
                    <div className="p-3">
                      <h5 className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                        {item.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {item.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Real-World Projects Using This Software */}
          {usedInProjects.length > 0 && (
            <section className="border-t border-slate-200 dark:border-slate-800 pt-8">
              <h3 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight mb-4">
                Real-World Structures Engineered with {software.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {usedInProjects.map(proj => (
                  <div
                    key={proj.id}
                    onClick={() => navigateTo({ view: 'project', id: proj.id })}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-cyan-500 cursor-pointer transition-colors shadow-sm"
                  >
                    <div className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 mb-1">{proj.category}</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">{proj.title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">{proj.location} · {proj.year}</div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">Weight Saved: {proj.steelWeightSaved}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Sticky Sidebar: Technical Specifications Matrix */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-md">
            <h3 className="text-base font-bold text-slate-950 dark:text-white mb-4 flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <FileCode2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Technical Specifications Matrix
            </h3>

            <div className="space-y-4 text-xs font-sans">
              <div>
                <span className="block font-mono text-[10px] text-slate-400 uppercase">Solver Engine</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">{software.specs.solverType}</span>
              </div>

              <div>
                <span className="block font-mono text-[10px] text-slate-400 uppercase">Formulation</span>
                <span className="text-slate-700 dark:text-slate-300">{software.specs.formulation}</span>
              </div>

              <div>
                <span className="block font-mono text-[10px] text-slate-400 uppercase">Tested Capacity</span>
                <span className="font-mono text-cyan-700 dark:text-cyan-300 font-bold">{software.specs.maxNodesTested}</span>
              </div>

              <div>
                <span className="block font-mono text-[10px] text-slate-400 uppercase mb-1">Supported Elements</span>
                <div className="flex flex-wrap gap-1">
                  {software.specs.elementsSupported.map((elem, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300">
                      {elem}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="block font-mono text-[10px] text-slate-400 uppercase mb-1">File I/O Interoperability</span>
                <div className="flex flex-wrap gap-1">
                  {software.specs.fileIOFormats.map((fmt, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[10px] text-cyan-700 dark:text-cyan-400">
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="block font-mono text-[10px] text-slate-400 uppercase">Hardware Acceleration</span>
                <span className="text-slate-700 dark:text-slate-300">{software.specs.hardwareAcceleration}</span>
              </div>

              <div>
                <span className="block font-mono text-[10px] text-slate-400 uppercase mb-1">Engineering Code Compliance</span>
                <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                  {software.specs.complianceStandards.map((std, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-cyan-500" />
                      <span>{std}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => openLeadModal({ softwareInterest: software.name, inquiryType: 'Commercial Quotation' })}
                className="w-full py-2.5 px-4 font-semibold text-xs rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
              >
                Inquire for Site License
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
