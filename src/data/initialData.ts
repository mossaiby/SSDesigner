import { SoftwareItem, ProjectItem, BlogPost, LeadInquiry, MediaItem, AdminUser, AuditLog } from '../types';

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr_admin_01',
    name: 'Dr. Marcus Vance, CEng',
    email: 'admin@ssdesigner.ir',
    role: 'administrator',
    lastLogin: '2026-09-23 09:14 UTC',
  },
  {
    id: 'usr_lead_02',
    name: 'Elena Rostova, PhD',
    email: 'lead.analyst@ssdesigner.ir',
    role: 'lead_engineer',
    lastLogin: '2026-09-22 16:45 UTC',
  },
  {
    id: 'usr_editor_03',
    name: 'Kaito Tanaka',
    email: 'content.editor@ssdesigner.ir',
    role: 'editor',
    lastLogin: '2026-09-21 11:20 UTC',
  },
];

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  // FormSpace Prime media
  {
    id: 'med_fs_01',
    type: 'photo',
    title: 'Tensegrity Prism Dynamic Equilibrium State',
    caption: 'Kinetic damping iteration #420 reaching machine-precision zero-force nodal residual.',
    url: '/src/assets/images/software_form_finding_1790188528595.jpg',
    targetId: 'soft_formspace',
    targetType: 'software',
    technicalNote: 'Residual norm ||R|| < 1.0e-9 N | 84 tension cables, 24 compression struts',
    dimensions: '3840 x 2160 UHD',
    tags: ['Equilibrium', 'Tensegrity', 'Form-Finding'],
    createdAt: '2026-08-14',
  },
  {
    id: 'med_fs_02',
    type: 'video',
    title: 'Nonlinear Dynamic Relaxation Simulation',
    caption: 'Real-time kinetic damping relaxation of a 140m cable-net roof under pretensioning.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: '/src/assets/images/software_form_finding_1790188528595.jpg',
    duration: '0:15',
    targetId: 'soft_formspace',
    targetType: 'software',
    technicalNote: 'Time step dt = 0.002s | Mass proportional kinetic energy trace monitoring',
    dimensions: '1920 x 1080 60fps',
    tags: ['Simulation', 'Dynamic Relaxation', 'Cable-Net'],
    createdAt: '2026-08-18',
  },
  {
    id: 'med_fs_03',
    type: 'photo',
    title: 'Double-Layer Elliptic Paraboloid Form Analysis',
    caption: 'Curvature-aligned grid optimization with uniform member lengths under gravity preload.',
    url: '/src/assets/images/hero_space_structure_1790188515133.jpg',
    targetId: 'soft_formspace',
    targetType: 'software',
    technicalNote: 'Force density matrix Rank = 1,480 | Geometrical stiffness formulation',
    dimensions: '4096 x 2304',
    tags: ['Double-Layer Grid', 'Space Truss', 'Optimization'],
    createdAt: '2026-09-02',
  },

  // AeroLattice 3D media
  {
    id: 'med_al_01',
    type: 'photo',
    title: 'Reticulated Dome Snap-Through Buckling Mode',
    caption: 'Bifurcation point detection via Arc-Length Newton-Raphson nonlinear solver.',
    url: '/src/assets/images/project_botanical_dome_1790188539068.jpg',
    targetId: 'soft_aerolattice',
    targetType: 'software',
    technicalNote: 'Critical Load Factor λ_cr = 2.41 | GNLFEA co-rotational beam elements',
    dimensions: '3840 x 2160',
    tags: ['Buckling', 'GNLFEA', 'Geodesic Dome'],
    createdAt: '2026-07-29',
  },
  {
    id: 'med_al_02',
    type: 'video',
    title: 'Post-Critical Equilibrium Path Tracking',
    caption: 'Cylindrical arc-length constraint following equilibrium state into deep post-buckling regime.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: '/src/assets/images/project_botanical_dome_1790188539068.jpg',
    duration: '0:30',
    targetId: 'soft_aerolattice',
    targetType: 'software',
    technicalNote: 'Tangent stiffness determinant zero-crossing captured in 14 load increments',
    dimensions: '1920 x 1080',
    tags: ['Path Following', 'Post-Buckling', 'FEA'],
    createdAt: '2026-08-05',
  },

  // DeployX Space media
  {
    id: 'med_dx_01',
    type: 'photo',
    title: 'Orbital Mesh Antenna Deployment Mechanism',
    caption: '18.4-meter carbon composite pantographic scissor ring truss deployment kinematic state.',
    url: '/src/assets/images/project_orbital_reflector_1790188550567.jpg',
    targetId: 'soft_deployx',
    targetType: 'software',
    technicalNote: 'Zero-g multibody dynamics with flexible link strain-energy release',
    dimensions: '3840 x 2160',
    tags: ['Aerospace', 'Deployable', 'Satellite Reflector'],
    createdAt: '2026-08-28',
  },
  {
    id: 'med_dx_02',
    type: 'video',
    title: 'Stowage-to-Orbit Deployment Sequence',
    caption: 'Full 120-second simulated unlatching and kinetic extension under gravity gradient & solar radiation pressure.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: '/src/assets/images/project_orbital_reflector_1790188550567.jpg',
    duration: '0:45',
    targetId: 'soft_deployx',
    targetType: 'software',
    technicalNote: 'Kinematic degrees of freedom = 1 | Strain energy dissipation damping = 0.04',
    dimensions: '1920 x 1080',
    tags: ['Deployment', 'Multibody Dynamics', 'Spacecraft'],
    createdAt: '2026-09-10',
  },

  // NodeGen Parametric media
  {
    id: 'med_ng_01',
    type: 'photo',
    title: 'Solid Spherical MERO Ball Joint CNC Toolpath',
    caption: 'Automated 5-axis CNC toolpath generation for high-strength steel spherical spatial joint.',
    url: '/src/assets/images/hero_space_structure_1790188515133.jpg',
    targetId: 'soft_nodegen',
    targetType: 'software',
    technicalNote: '18 threaded tapped bores | Inter-member clearance verified at 12.4 degrees',
    dimensions: '3840 x 2160',
    tags: ['CNC Fabrication', 'MERO Nodes', 'Ball Joints'],
    createdAt: '2026-08-11',
  },

  // Project Media: Botanical Dome
  {
    id: 'med_proj_dome_01',
    type: 'photo',
    title: 'Al-Miraj Bioclimatic Dome Twilight View',
    caption: '118-meter geodesic Schwedler dome illuminated during commissioning, showing triangular insulated glazing units.',
    url: '/src/assets/images/project_botanical_dome_1790188539068.jpg',
    targetId: 'proj_botanical_dome',
    targetType: 'project',
    technicalNote: 'Clear span: 118.0 m | Height: 44.5 m | Weight: 34.2 kg/m² structural steel',
    dimensions: '3840 x 2160',
    tags: ['Geodesic', 'Architecture', 'Clear Span'],
    createdAt: '2026-07-15',
  },
  {
    id: 'med_proj_dome_02',
    type: 'video',
    title: 'Thermal Expansion & Cyclic Wind Vibration Simulation',
    caption: 'Nonlinear dynamic response under 160 km/h desert storm gusting and +52°C solar heat load.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailUrl: '/src/assets/images/project_botanical_dome_1790188539068.jpg',
    duration: '0:22',
    targetId: 'proj_botanical_dome',
    targetType: 'project',
    technicalNote: 'Peak nodal deflection: 41.8 mm (well within L/500 code requirement)',
    dimensions: '1920 x 1080',
    tags: ['Wind Tunnel', 'Thermal FEA', 'Commissioning'],
    createdAt: '2026-07-22',
  },

  // Project Media: Helios-9
  {
    id: 'med_proj_h9_01',
    type: 'photo',
    title: 'Helios-9 Reflector Stowed vs Deployed Configuration',
    caption: '18.4-meter aperture deployable space antenna shown in carbon fiber ring truss deployment trial.',
    url: '/src/assets/images/project_orbital_reflector_1790188550567.jpg',
    targetId: 'proj_helios9',
    targetType: 'project',
    technicalNote: 'Stowed envelope: 1.6m diameter x 3.8m length | Total mass: 78.4 kg',
    dimensions: '3840 x 2160',
    tags: ['Aerospace', 'Deployment Test', 'Carbon Fiber'],
    createdAt: '2026-08-19',
  },
  {
    id: 'med_proj_h9_02',
    type: 'video',
    title: 'Zero-G Thermal Vacuum Chamber Deployment Test',
    caption: 'Deployment verification video at -120°C to +130°C thermal cycling inside vacuum chamber.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: '/src/assets/images/project_orbital_reflector_1790188550567.jpg',
    duration: '0:35',
    targetId: 'proj_helios9',
    targetType: 'project',
    technicalNote: 'Synchronous motorized cable winch release | Surface RMS error < 0.35 mm',
    dimensions: '1920 x 1080',
    tags: ['Thermal Vacuum', 'Flight Model', 'Space Qualification'],
    createdAt: '2026-08-24',
  },

  // Project Media: Grand Falcon Velodrome
  {
    id: 'med_proj_velodrome_01',
    type: 'photo',
    title: 'Grand Falcon 142m Double-Layer Space Grid Erection',
    caption: 'Continuous spatial truss assembly using ground-assembled blocks lifted by 4 synchronized tower cranes.',
    url: '/src/assets/images/hero_space_structure_1790188515133.jpg',
    targetId: 'proj_velodrome',
    targetType: 'project',
    technicalNote: 'Structural span: 142 m x 98 m | Total steel weight: 612 tonnes | Saved 194 tonnes steel',
    dimensions: '4096 x 2304',
    tags: ['Space Grid', 'Arena', 'Heavy Lifting'],
    createdAt: '2026-06-10',
  }
];

export const INITIAL_SOFTWARE_ITEMS: SoftwareItem[] = [
  {
    id: 'soft_formspace',
    name: 'FormSpace Prime',
    tagline: 'Nonlinear Dynamic Relaxation & Force-Density Form-Finding Engine',
    category: 'Form-Finding & Cable-Net',
    version: '2026.4 LTS',
    description: 'The industry-standard computational engine for self-stressed tensegrity systems, cable-net structures, and double-layer space grids. FormSpace Prime executes kinetic damping relaxation algorithms that solve extreme geometrical equilibrium states with zero numerical drift.',
    keyFeatures: [
      'Dynamic Relaxation with Kinetic & Viscous Damping algorithms',
      'Force Density Method (FDM) with linear & nonlinear branch-length constraints',
      'Slack cable auto-detection with non-smooth unilateral contact handling',
      'Pretension optimization satisfying strict allowable member envelope bounds',
      'Direct bidirectional geometry sync with Rhino/Grasshopper, Revit, and STEP',
      'GPU-accelerated matrix decomposition handling up to 250,000 active degrees of freedom'
    ],
    mathematicalFoundations: [
      'Nodal Residual Force Vector: \\mathbf{R}_i(t) = \\mathbf{F}_{\\text{ext}, i} - \\sum_{j \\in N_i} \\frac{T_{ij}}{L_{ij}} (\\mathbf{x}_j - \\mathbf{x}_i) = \\mathbf{0}',
      'Kinetic Damping Peak Energy: E_k(t) = \\frac{1}{2} \\sum_{i=1}^{n} m_i \\|\\mathbf{v}_i\\|^2 \\quad \\Longrightarrow \\quad \\mathbf{x}^{t} \\leftarrow \\mathbf{x}^{t - \\Delta t / 2}',
      'Prestressed Tangent Stiffness: \\mathbf{K}_T = \\mathbf{K}_e + \\mathbf{K}_g(\\mathbf{T}) + \\mathbf{K}_u(\\mathbf{u})'
    ],
    specs: {
      solverType: 'Kinetic Damping Dynamic Relaxation & Sparse Cholesky Solver',
      formulation: 'Co-rotational 3D space truss & tension-only cable network formulation',
      elementsSupported: ['Tension-only Cables', 'Compression Struts', 'Beam-Columns', 'Membrane Triangular Facets'],
      maxNodesTested: '150,000+ Spatial Nodes',
      fileIOFormats: ['STEP (.stp)', 'IFC 4.3', 'DXF 3D', 'Rhino 8 (.3dm)', 'ANSYS CDB', 'NASTRAN BDF'],
      hardwareAcceleration: 'CUDA & Apple Metal hardware accelerated sparse algebra',
      complianceStandards: ['Eurocode 3 (EN 1993-1-11)', 'ASCE 19-10 (Structural Applications of Steel Cables)', 'IASS Guidelines for Space Structures']
    },
    thumbnail: '/src/assets/images/software_form_finding_1790188528595.jpg',
    gallery: [],
    releaseDate: '2026-03-01',
    featured: true,
  },
  {
    id: 'soft_aerolattice',
    name: 'AeroLattice 3D',
    tagline: 'Geometrically Nonlinear FEA & Snap-Through Buckling Solver',
    category: 'Nonlinear FEA & Buckling',
    version: '2026.2 R3',
    description: 'Purpose-built for ultra-large span reticulated domes, barrel vaults, and spatial lattice shells. AeroLattice 3D implements advanced cylindrical and spherical arc-length constraint solvers to capture unstable post-buckling branches, bifurcation points, and joint stiffness degradation.',
    keyFeatures: [
      'Geometrically & Materially Nonlinear FEA (GMNIA) tailored for spatial grids',
      'Riks-Crisfield cylindrical arc-length path following with automatic step size control',
      'Semi-rigid node connector modeling (MERO ball joint moment-rotation hysteresis)',
      'Asymmetric pattern wind load generator according to Eurocode 1 & ASCE 7',
      'Eigenvalue & perturbation-based initial imperfection injection (L/1000 to L/300)',
      'Automated global and local member buckling safety verification'
    ],
    mathematicalFoundations: [
      'Cylindrical Arc-Length Constraint: \\Delta\\mathbf{u}^T \\Delta\\mathbf{u} + \\psi^2 \\Delta\\lambda^2 (\\mathbf{P}^T \\mathbf{P}) = \\Delta l^2',
      'Green-Lagrange Spatial Strain Tensor: \\mathbf{E} = \\frac{1}{2}\\left( \\mathbf{F}^T\\mathbf{F} - \\mathbf{I} \\right) = \\frac{1}{2}\\left( \\nabla\\mathbf{u} + \\nabla\\mathbf{u}^T + \\nabla\\mathbf{u}^T\\nabla\\mathbf{u} \\right)',
      'Bifurcation Point & Limit Load Criterion: \\det\\left( \\mathbf{K}_e + \\lambda_{\\text{cr}} \\mathbf{K}_g \\right) = 0 \\quad \\Longleftrightarrow \\quad \\min_i \\{\\lambda_i\\}'
    ],
    specs: {
      solverType: 'Newton-Raphson + Modified Riks Cylindrical Arc-Length Solver',
      formulation: 'Co-rotational 3D frame formulation with finite rotations (quaternions)',
      elementsSupported: ['Nonlinear 3D Beams', 'Semi-Rigid Springs', 'Eccentric Rigid Links', 'Shell Facets'],
      maxNodesTested: '80,000 Framework Nodes',
      fileIOFormats: ['STEP', 'DXF', 'SAP2000 .s2k', 'Abaqus .inp', 'CSV Tables', 'JSON API'],
      hardwareAcceleration: 'Multi-threaded OpenMP + AVX-512 SIMD vectorization',
      complianceStandards: ['EN 1993-1-6 (Strength & Stability of Shell Structures)', 'ANSI/AISC 360-22 Direct Analysis Method', 'GB 50017']
    },
    thumbnail: '/src/assets/images/project_botanical_dome_1790188539068.jpg',
    gallery: [],
    releaseDate: '2026-02-15',
    featured: true,
  },
  {
    id: 'soft_deployx',
    name: 'DeployX Space',
    tagline: 'Kinematic & Dynamic Solver for Deployable Aerospace Structures',
    category: 'Aerospace Deployables',
    version: '2026.1 SP2',
    description: 'Specialized simulation environment for aerospace spatial mechanisms: articulating satellite antennas, scissor-pantograph booms, solar sail trusses, and bistable composite booms. Accurately simulates deployment kinematics under zero-g orbital microgravity.',
    keyFeatures: [
      'Flexible multibody dynamics with high-strain composite hinge deployment',
      'Zero-g kinematic trajectory validation and latching impact impulse analysis',
      'Origami-based tessellation kinematics (Miura-ori, Yoshimura, Flasher crease patterns)',
      'Thermo-elastic distortion simulation under direct solar flux and Earth albedo',
      'Surface parabolic RMS accuracy estimation for RF transmission compliance',
      'Hardware-in-the-loop (HIL) telemetry streaming interface'
    ],
    mathematicalFoundations: [
      'Lagrangian DAE Multibody Dynamics: \\mathbf{M}(\\mathbf{q})\\ddot{\\mathbf{q}} + \\mathbf{C}(\\mathbf{q}, \\dot{\\mathbf{q}})\\dot{\\mathbf{q}} + \\mathbf{K}\\mathbf{q} + \\boldsymbol{\\Phi}_{\\mathbf{q}}^T \\boldsymbol{\\lambda} = \\mathbf{Q}_{\\text{ext}}',
      'Baumgarte Constraint Stabilization: \\ddot{\\boldsymbol{\\Phi}} + 2\\alpha\\dot{\\boldsymbol{\\Phi}} + \\beta^2\\boldsymbol{\\Phi} = \\mathbf{0}',
      'Best-Fit Paraboloid Surface RMS Error: \\delta_{\\text{RMS}} = \\sqrt{ \\frac{1}{N} \\sum_{k=1}^N \\left( z_k - \\frac{x_k^2 + y_k^2}{4F} \\right)^2 }'
    ],
    specs: {
      solverType: 'Implicit Newmark-Beta Generalized-α DAE Multibody Dynamic Solver',
      formulation: 'Flexible multibody Absolute Nodal Coordinate Formulation (ANCF)',
      elementsSupported: ['Articulated Rigid Links', 'Flexible Slender Beams', 'Bistable Tape Springs', 'Mesh Reflectors'],
      maxNodesTested: '35,000 Multibody Coordinate DoFs',
      fileIOFormats: ['STEP AP242', 'Nastran BDF', 'MATLAB/Simulink export', 'GLTF 3D animation'],
      hardwareAcceleration: 'DirectX / Vulkan GPU physics simulation engine',
      complianceStandards: ['ECSS-E-ST-32-08C (Space Engineering - Materials)', 'NASA-STD-5020', 'AIAA S-110']
    },
    thumbnail: '/src/assets/images/project_orbital_reflector_1790188550567.jpg',
    gallery: [],
    releaseDate: '2026-01-20',
    featured: true,
  },
  {
    id: 'soft_nodegen',
    name: 'NodeGen Parametric',
    tagline: 'Automated 5-Axis CNC Detailing & Spatial Ball Joint Fabricator',
    category: 'Parametric Detailing & CNC',
    version: '2026.3',
    description: 'Bridging computational analysis with modern robotic and CNC fabrication. NodeGen automatically generates manufacturing-ready solid spherical ball joints (MERO system), cast hubs, and welded nodes directly from finite element load combinations with clash prevention.',
    keyFeatures: [
      'Automated MERO solid ball joint dimensioning based on 3D spatial member clash angles',
      'Direct G-code and 5-axis CNC machining toolpath generation for mill-turn centers',
      'Bolted sleeve, pin-joint, and fork-clevis connector engineering to ISO standards',
      'Automated Bill of Materials (BOM) with member cut-lengths and bevel angles',
      'BIM Level 3 integration with Tekla Structures, Revit, and STEP AP214 solid geometry',
      'Stress concentration factor (SCF) evaluation around tapped threaded apertures'
    ],
    mathematicalFoundations: [
      'Spatial Member Collision Cone Criterion: \\theta_{ij} \\ge \\arcsin\\left(\\frac{r_i}{R}\\right) + \\arcsin\\left(\\frac{r_j}{R}\\right) + \\theta_{\\text{clearance}}',
      'Neuber Notch Stress-Strain Rule: K_t^2 = \\frac{\\sigma \\cdot \\epsilon}{S \\cdot e} \\quad \\Longrightarrow \\quad \\sigma_{\\text{max}} = \\sqrt{E \\cdot S \\cdot e \\cdot K_t^2}',
      'Spherical Voronoi Tessellation Boundary: \\mathcal{V}_i = \\left\\{ \\mathbf{p} \\in \\mathbb{S}^2 \\;\\middle|\\; d(\\mathbf{p}, \\mathbf{v}_i) \\le d(\\mathbf{p}, \\mathbf{v}_j), \\; \\forall j \\ne i \\right\\}'
    ],
    specs: {
      solverType: 'Parametric Solid Geometry Kernel & Spatial Collision Octree Engine',
      formulation: 'Boundary representation (B-Rep) solid modeling with exact NURBS geometry',
      elementsSupported: ['Solid Spherical Nodes', 'Cast Steel Hubs', 'Cylindrical Pipe Ends', 'Conical Reducers'],
      maxNodesTested: 'Unlimited Parametric Batch Runs (Tested on 12,000 unique nodes)',
      fileIOFormats: ['STEP (.stp)', 'IGES', 'Tekla Custom Component (.uel)', 'NC1 (DSTV)', 'DXF', 'BIM IFC4'],
      hardwareAcceleration: 'Multi-core CPU geometry rendering & GPU ray-cast collision',
      complianceStandards: ['DIN 18800-1', 'AISC 360-16 Chapter K', 'ISO 898-1 Fastener Mechanical Properties']
    },
    thumbnail: '/src/assets/images/hero_space_structure_1790188515133.jpg',
    gallery: [],
    releaseDate: '2026-03-12',
    featured: false,
  }
];

export const INITIAL_PROJECT_ITEMS: ProjectItem[] = [
  {
    id: 'proj_botanical_dome',
    title: 'Al-Miraj Bioclimatic Botanical Dome',
    subtitle: '118-Meter Clear-Span Geodesic Schwedler Dome with Thermal Expansion Relief',
    category: 'Botanical & Domes',
    location: 'Doha, Qatar',
    year: 2025,
    span: '118.0 m Clear Span (44.5 m Apex Height)',
    structuralSystem: 'Single-layer reticulated Schwedler geodesic steel dome with perimeter pin bearings',
    nodeCount: '2,640 Solid Nodes',
    memberCount: '7,480 CHS Steel Members',
    steelWeightSaved: '29.4% vs Conventional Truss System',
    clientOrEngineer: 'National Environment Authority / Lead Consultant: ARUP Spatial',
    softwareUsed: ['AeroLattice 3D', 'FormSpace Prime', 'NodeGen Parametric'],
    challenge: 'Extreme diurnal desert thermal gradients (+54°C daytime sun to +14°C night) creating immense secondary axial forces and severe risk of elasto-plastic snap-through buckling under cyclic wind shears.',
    engineeringSolution: 'Using AeroLattice 3D, the team conducted full GMNIA arc-length simulations incorporating initial geometric member imperfections (L/800). FormSpace Prime calibrated variable ring prestress forces to counterbalance thermal hoop expansions, and NodeGen generated 2,640 CNC-machined spheroidal joint nodes that eliminated on-site welding.',
    heroImage: '/src/assets/images/project_botanical_dome_1790188539068.jpg',
    gallery: [],
    keyMetrics: [
      { label: 'Clear Span', value: '118.0', unit: 'meters' },
      { label: 'Structural Mass', value: '34.2', unit: 'kg/m²' },
      { label: 'Buckling Safety Factor', value: '2.84', unit: 'λ_cr' },
      { label: 'Thermal Range', value: '-5°C to +58°C', unit: 'design' },
    ],
    featured: true,
  },
  {
    id: 'proj_helios9',
    title: 'Helios-9 Orbital Deployable Reflector',
    subtitle: '18.4-Meter Aperture Deployable Carbon-Composite Space Antenna',
    category: 'Aerospace & Satellites',
    location: 'Geostationary Transfer Orbit (GTO) / ESA & JAXA Consortium',
    year: 2026,
    span: '18.4 m Aperture (Stowed: 1.6 m x 3.8 m)',
    structuralSystem: 'Pantographic scissor carbon-fiber ring truss with gold-plated molybdenum wire mesh',
    nodeCount: '48 Articulated Titanium Joints',
    memberCount: '96 Carbon Composite Rods',
    steelWeightSaved: 'Mass density: 0.29 kg/m² aperture area',
    clientOrEngineer: 'Aerospace Communications Consortium / Astrium Dynamics',
    softwareUsed: ['DeployX Space', 'FormSpace Prime'],
    challenge: 'Achieving sub-millimeter parabolic surface RMS accuracy (<0.35 mm) across an 18.4m flexible aperture while guaranteeing 100% unassisted kinematic deployment in zero gravity with zero motor stall margin.',
    engineeringSolution: 'DeployX Space simulated full flexible-multibody deployment dynamics including nonlinear tape spring strain-energy release, friction hysteresis in titanium pivot joints, and solar radiation pressure. FormSpace Prime solved the static equilibrium of the pretensioned cable-net backing that tensions the reflective molybdenum mesh.',
    heroImage: '/src/assets/images/project_orbital_reflector_1790188550567.jpg',
    gallery: [],
    keyMetrics: [
      { label: 'Aperture Diameter', value: '18.4', unit: 'meters' },
      { label: 'Total Reflector Mass', value: '78.4', unit: 'kg' },
      { label: 'Surface Accuracy RMS', value: '0.31', unit: 'mm' },
      { label: 'Deployment Reliability', value: '99.98', unit: '%' },
    ],
    featured: true,
  },
  {
    id: 'proj_velodrome',
    title: 'Grand Falcon International Velodrome',
    subtitle: '142-Meter Elliptic Paraboloid Double-Layer Space Grid',
    category: 'Sports & Arenas',
    location: 'Munich, Germany',
    year: 2025,
    span: '142.0 m Long Axis x 98.0 m Short Axis',
    structuralSystem: 'Double-layer orthogonal space truss on peripheral concrete buttresses with MERO ball joints',
    nodeCount: '4,120 MERO Ball Nodes',
    memberCount: '15,800 Tubular Steel Elements',
    steelWeightSaved: '194 tonnes steel saved (24.1% reduction)',
    clientOrEngineer: 'Bavarian Sports Infrastructure / Schlaich Bergermann Partner Collaboration',
    softwareUsed: ['FormSpace Prime', 'AeroLattice 3D', 'NodeGen Parametric'],
    challenge: 'Achieving column-free unobstructed sightlines for 8,500 spectators over an Olympic cycling bowl while keeping total steel roof weight under 45 kg/m² under heavy Bavarian snow drifts (2.4 kN/m²).',
    engineeringSolution: 'FormSpace Prime’s dynamic relaxation engine optimized the member coordinate topography to maximize compressive arching action, converting 68% of bending moments into axial member thrusts. NodeGen produced complete CNC mill-turn files for all 4,120 nodes with zero shop re-machining required.',
    heroImage: '/src/assets/images/hero_space_structure_1790188515133.jpg',
    gallery: [],
    keyMetrics: [
      { label: 'Long Axis Span', value: '142.0', unit: 'meters' },
      { label: 'Roof Steel Weight', value: '41.8', unit: 'kg/m²' },
      { label: 'Snow Load Capacity', value: '3.10', unit: 'kN/m²' },
      { label: 'Assembly Time', value: '8.5', unit: 'weeks' },
    ],
    featured: true,
  },
  {
    id: 'proj_skyline_canopy',
    title: 'SkyLine Central Multimodal Terminal Canopy',
    subtitle: '210-Meter Inverted Tree-Column Freeform Spatial Canopy',
    category: 'Transit Hubs',
    location: 'Singapore Changi Intermodal Zone',
    year: 2024,
    span: '210.0 m Length Continuous Triangulated Canopy',
    structuralSystem: 'Continuous spatial steel diagrid supported by 8 branching hollow cast-steel tree columns',
    nodeCount: '3,850 Cast & Welded Hubs',
    memberCount: '11,200 High-Tensile Steel Struts',
    steelWeightSaved: '18.5% Material Savings',
    clientOrEngineer: 'Transit Infrastructure Authority / Foster + Partners Lead Spatial Engineering',
    softwareUsed: ['FormSpace Prime', 'NodeGen Parametric'],
    challenge: 'Designing a flowing, organic freeform roof that seamlessly drains high-intensity monsoon rainfall (120 mm/hr) while distributing asymmetric gust vortex shedding from neighboring elevated runways.',
    engineeringSolution: 'FormSpace solved the inverted drainage topography through minimum-energy funicular form-finding. NodeGen automatically parameterized each cast branch joint with internal rainwater siphon routing integrated directly into the structural node envelope.',
    heroImage: '/src/assets/images/hero_space_structure_1790188515133.jpg',
    gallery: [],
    keyMetrics: [
      { label: 'Total Length', value: '210.0', unit: 'meters' },
      { label: 'Rainfall Handling', value: '140', unit: 'mm/hr' },
      { label: 'Unique Node Types', value: '3,850', unit: 'units' },
      { label: 'Seismic Performance', value: 'Zone 2B', unit: 'compliant' },
    ],
    featured: false,
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog_01',
    title: 'Geometrically Nonlinear Snap-Through Buckling in Reticulated Spatial Domes: Theory and Practice',
    slug: 'nonlinear-snap-through-buckling-spatial-domes',
    category: 'Computational Mechanics',
    readTime: '7 min read',
    publishedAt: '2026-09-08',
    author: {
      name: 'Dr. Marcus Vance, CEng',
      role: 'Chief Structural Scientist, AeroSpatial',
    },
    excerpt: 'Traditional linear eigenvalue analysis dangerously overestimates the load-bearing capacity of large-span reticulated domes. Here is how modern arc-length solvers track equilibrium paths beyond the limit point.',
    content: `## 1. The Peril of Linear Bifurcation Analysis

For conventional building frames, linear Euler buckling (Euler-Cauchy eigenvalue problem) often provides a conservative baseline for member sizing. In **single-layer reticulated domes and double-layer space grids**, however, the interaction between global shell deformation and local member snap-through creates an intensely unstable, subcritical post-buckling path.

In classical linearized stability analysis, the critical buckling factor $\\lambda_{\\text{cr}}$ is determined by solving:

$$\\det\\left( \\mathbf{K}_0 + \\lambda_{\\text{cr}} \\mathbf{K}_g \\right) = 0$$

Where $\\mathbf{K}_0$ represents the linear small-displacement stiffness matrix, and $\\mathbf{K}_g$ is the geometric (stress) stiffness matrix. In our recent benchmark tests across 40 geodesic and Schwedler test configurations, classical linear buckling predicted failure loads **up to 280% higher** than actual experimental collapse loads.

### Why Does This Discrepancy Occur?
1. **Geometric Imperfection Sensitivity**: Random nodal deviations as small as $\\delta_{\\text{imp}} = L/1000$ (where $L$ is member length) induce early asymmetric bifurcation.
2. **Pre-Buckling Nonlinear Deflection**: Under asymmetric wind or snow ponding, large nodal rotations fundamentally alter the tangent stiffness matrix $\\mathbf{K}_T$ prior to reaching the apex limit point.
3. **Semi-Rigid Joint Flexibility**: Bolted MERO ball connections experience nonlinear moment-rotation curves ($\\phi = M / K_{\\text{joint}}$) that reduce rotational restraint.

## 2. Cylindrical Arc-Length Path Following (Riks-Crisfield Formulation)

To traverse the unstable descending branch of the equilibrium curve without numerical divergence at $\\det(\\mathbf{K}_T) = 0$, AeroLattice 3D implements the cylindrical arc-length constraint:

$$\\Delta \\mathbf{u}^T \\Delta \\mathbf{u} + \\psi^2 \\Delta \\lambda^2 (\\mathbf{P}^T \\mathbf{P}) = \\Delta l^2$$

Here, $\\Delta \\mathbf{u}$ is the incremental nodal displacement vector, $\\Delta \\lambda$ is the load multiplier increment, $\\mathbf{P}$ is the normalized reference load vector, and $\\psi$ is a dimensionless scaling parameter.

The coupled system of linear equations solved at iteration $k$ is given by:

$$\\begin{bmatrix} \\mathbf{K}_T & -\\mathbf{P} \\\\ 2\\Delta\\mathbf{u}^T & 2\\psi^2\\Delta\\lambda (\\mathbf{P}^T\\mathbf{P}) \\end{bmatrix} \\begin{bmatrix} \\delta\\mathbf{u} \\\\ \\delta\\lambda \\end{bmatrix} = \\begin{bmatrix} \\mathbf{R} \\\\ \\Delta l^2 - \\Delta\\mathbf{u}^T\\Delta\\mathbf{u} - \\psi^2\\Delta\\lambda^2(\\mathbf{P}^T\\mathbf{P}) \\end{bmatrix}$$

By dynamically scaling the constraint radius $\\Delta l$ based on previous convergence iterations, the solver seamlessly tracks both snap-through (load decrease at constant displacement) and snap-back (simultaneous load and displacement decrease) phenomena.

### Benchmark Comparison: Linear vs. GMNIA Arc-Length Analysis

| Structural Configuration | Linear $\\lambda_{\\text{cr}}$ | GMNIA Limit $\\lambda_{\\text{ult}}$ | Reduction Factor | Governed By |
| :--- | :--- | :--- | :--- | :--- |
| 60m Schwedler Dome | 4.12 | 1.84 | 55.3% | Global snap-through |
| 118m Geodesic Grid (Al-Miraj) | 3.65 | 1.42 | 61.1% | Asymmetric bifurcation |
| 142m Double-Layer Velodrome | 5.28 | 3.10 | 41.3% | Member localized buckling |
| 45m Cylindrical Barrel Vault | 2.94 | 1.08 | 63.3% | Diamond snap-back branch |

## 3. Engineering Recommendations for Practicing Engineers
- **Always conduct GMNIA (Geometrically and Materially Nonlinear Analysis with Imperfections)** according to Eurocode EN 1993-1-6.
- **Inject eigenmode-scaled initial imperfections**: Superimpose at least the first 3 buckling eigenmodes with an amplitude of $\\pm t/2$ to capture the worst-case geometric defect:

$$\\mathbf{x}_{\\text{imperfect}} = \\mathbf{x}_{\\text{nominal}} + \\sum_{m=1}^3 \\alpha_m \\boldsymbol{\\phi}_m$$

- **Model node joint stiffness**: Never assume ideal pinned or rigid nodes. Include experimental or catalog $M$-$\\theta$ curves for your specific ball joint diameter.`,
    coverImage: '/src/assets/images/project_botanical_dome_1790188539068.jpg',
    tags: ['Nonlinear FEA', 'Buckling', 'Geodesic Domes', 'Arc-Length Method'],
  },
  {
    id: 'blog_02',
    title: 'Kinetic Damping in Dynamic Relaxation: Solving Complex Tensegrity Systems with Zero Drift',
    slug: 'kinetic-damping-dynamic-relaxation-tensegrity',
    category: 'Computational Mechanics',
    readTime: '6 min read',
    publishedAt: '2026-08-25',
    author: {
      name: 'Elena Rostova, PhD',
      role: 'Head of Form-Finding Algorithms',
    },
    excerpt: 'Tensegrity structures require simultaneous satisfaction of kinematic equilibrium and self-stress states. Learn how kinetic damping dynamic relaxation achieves machine precision without matrix inversion.',
    content: `## The Challenge of Self-Stressed Spatial Equilibria

Tensegrity systems—structural networks consisting of isolated compression struts floating inside a continuous web of tensioned cables—pose a unique computational challenge: their initial geometry is unknown until an internal self-stress vector is solved in equilibrium with zero external loads.

Standard Newton-Raphson solvers frequently fail because the initial tangent stiffness matrix has multiple zero eigenvalues (rigid body mechanisms and infinitesimal mechanisms):

$$\\mathbf{K}_T \\boldsymbol{\\phi}_m = \\mathbf{0} \\quad \\text{for } m = 1, \\dots, k$$

## Dynamic Relaxation: Physics-Based Equilibrium

Dynamic Relaxation (DR) bypasses tangent stiffness inversion entirely. It treats the structural network as a fictitious dynamic system governed by Newton's second law:

$$\\mathbf{M} \\ddot{\\mathbf{x}}(t) + \\mathbf{C} \\dot{\\mathbf{x}}(t) + \\mathbf{R}(\\mathbf{x}(t)) = \\mathbf{0}$$

Where $\\mathbf{R}(\\mathbf{x})$ is the nodal out-of-balance residual force vector calculated directly from member tensions and current coordinates:

$$\\mathbf{R}_i = \\mathbf{F}_i^{\\text{ext}} - \\sum_{j \\in \\mathcal{N}_i} \\frac{T_{ij}}{L_{ij}} (\\mathbf{x}_j - \\mathbf{x}_i) = \\mathbf{0}$$

The fictitious nodal masses $m_i$ are assigned using Greschgörin's theorem to ensure numerical stability:

$$m_i \\ge \\frac{\\Delta t^2}{2} \\sum_{j \\in \\mathcal{N}_i} \\left( \\frac{E_{ij} A_{ij}}{L_{ij}} + \\frac{T_{ij}}{L_{ij}} \\right)$$

### The Power of Kinetic Damping
Instead of applying arbitrary viscous damping coefficients $\\mathbf{C}$, which slow convergence, **Kinetic Damping** monitors the total kinetic energy of the spatial system:

$$E_k(t) = \\frac{1}{2} \\sum_{i=1}^N m_i \\|\\mathbf{v}_i(t)\\|^2$$

When $E_k(t)$ reaches a local peak ($E_k(t) < E_k(t - \\Delta t)$), the system has reached the point of maximum velocity where coordinates are closest to the equilibrium state. At that exact instant:

1. All nodal velocities are abruptly reset to zero:

$$\\mathbf{v}_i \\leftarrow \\mathbf{0}$$

2. Coordinates are reset to the peak kinetic energy position:

$$\\mathbf{x}_i^* = \\mathbf{x}_i^t - \\frac{1}{2} \\Delta t \\, \\mathbf{v}_i^{t + \\Delta t/2}$$

3. Motion restarts from rest until the next peak.

In FormSpace Prime, this produces monotonic convergence to residual norms below $\\|\\mathbf{R}\\|_\\infty < 10^{-10} \\text{ N}$ in fewer than 400 iterations for grids with thousands of cables.`,
    coverImage: '/src/assets/images/software_form_finding_1790188528595.jpg',
    tags: ['Dynamic Relaxation', 'Tensegrity', 'Form-Finding', 'Algorithms'],
  },
  {
    id: 'blog_03',
    title: 'DeployX v4.2 Release: Origami Crease Kinematics and Flexible Multibody Dynamics for Satellite Reflectors',
    slug: 'deployx-v42-origami-crease-kinematics-aerospace',
    category: 'Product Releases',
    readTime: '4 min read',
    publishedAt: '2026-08-10',
    author: {
      name: 'AeroSpatial Product Team',
      role: 'Aerospace Engineering Division',
    },
    excerpt: 'Introducing crease-pattern origami generators, zero-g solar thermal deformation coupling, and direct NASA/ESA telemetry streaming in DeployX v4.2.',
    content: `We are thrilled to announce the general availability of **DeployX Space v4.2**, our dedicated simulation and kinematics platform for deployable aerospace spatial structures.

## What's New in Version 4.2?

### 1. Parametric Origami Crease Generator
- Native support for **Miura-ori**, **Yoshimura**, and **Flasher** origami fold patterns.
- Automated rigid-facet collision detection preventing facet interference during dynamic stowage and orbital unfolding.
- Crease compliance modeling using nonlinear torsional spring formulations with hysteresis:

$$M_{\\text{hinge}}(\\theta) = K_0 (\\theta - \\theta_0) + K_{\\text{nl}} (\\theta - \\theta_0)^3 + c_{\\text{rot}} \\dot{\\theta}$$

### 2. High-Fidelity Solar Flux Thermo-Elastic Coupling
Deployable space antennas experience rapid thermal shocks when crossing from Earth eclipse into direct solar radiation (+140°C on sun-facing face, -110°C on shadow face). DeployX v4.2 couples transient thermal conduction with structural deformation to compute the instantaneous best-fit parabolic surface RMS error at every orbital timestamp:

$$\\delta_{\\text{RMS}}(t) = \\sqrt{ \\frac{1}{N} \\sum_{k=1}^N \\left( z_k(t) - \\frac{x_k^2(t) + y_k^2(t)}{4 F_{\\text{opt}}} \\right)^2 }$$

Where $F_{\\text{opt}}$ is the optimal focal length computed via least-squares fitting against RF gain constraints.

### 3. Hardware-in-the-Loop Telemetry Stream
Connect live test chamber strain gauges and optical photogrammetry cameras directly to DeployX via WebSocket API to validate model parameters against ground deployment trials in real-time.`,
    coverImage: '/src/assets/images/project_orbital_reflector_1790188550567.jpg',
    tags: ['Product Release', 'Aerospace', 'Origami', 'Satellites'],
  },
  {
    id: 'blog_04',
    title: 'Force Density Method vs. Dynamic Relaxation: Mathematical Formulations for Spatial Cable Networks',
    slug: 'force-density-method-vs-dynamic-relaxation-form-finding',
    category: 'Computational Mechanics',
    readTime: '9 min read',
    publishedAt: '2026-07-28',
    author: {
      name: 'Dr. Marcus Vance, CEng',
      role: 'Chief Structural Scientist, AeroSpatial',
    },
    excerpt: 'A comprehensive comparative derivation of the linear Force Density Method (FDM) and nonlinear Dynamic Relaxation (DR) for cable-net roofs and membrane structures.',
    content: `## Executive Overview

Form-finding of tension structures—such as cable nets, fabric membranes, and tensegrity systems—requires determining an equilibrium geometry under prescribed internal prestress forces.

Two primary mathematical paradigms dominate the field:
1. **The Force Density Method (FDM)** (Schek, 1974)
2. **Dynamic Relaxation (DR)** (Day, 1965; Barnes, 1999)

This article provides the governing matrix derivations and compares their computational performance in spatial engineering practice.

---

## 1. The Force Density Method (FDM) Formulation

The brilliance of the Force Density Method lies in linearizing the inherently nonlinear geometrical equilibrium equations by introducing the **force:length ratio** $q_k = T_k / L_k$ as the primary design variable.

For a spatial pin-jointed network with $m$ members and $n$ nodes ($n_f$ free nodes, $n_b$ fixed boundary nodes), the nodal equilibrium in the global coordinate directions is:

$$\\mathbf{C}^T \\mathbf{Q} \\mathbf{C} \\mathbf{x} = \\mathbf{p}_x$$
$$\\mathbf{C}^T \\mathbf{Q} \\mathbf{C} \\mathbf{y} = \\mathbf{p}_y$$
$$\\mathbf{C}^T \\mathbf{Q} \\mathbf{C} \\mathbf{z} = \\mathbf{p}_z$$

Where:
- $\\mathbf{C} \\in \\mathbb{R}^{m \\times n}$ is the branch-node topological incidence matrix
- $\\mathbf{Q} = \\operatorname{diag}(q_1, q_2, \\dots, q_m) \\in \\mathbb{R}^{m \\times m}$ is the diagonal force density matrix
- $\\mathbf{p}_x, \\mathbf{p}_y, \\mathbf{p}_z$ are the external nodal force vectors

Partitioning the branch-node matrix into free nodes $\\mathbf{C}_f$ and fixed boundary nodes $\\mathbf{C}_b$:

$$\\mathbf{C} = \\begin{bmatrix} \\mathbf{C}_f & \\mathbf{C}_b \\end{bmatrix}$$

The system matrix $\\mathbf{D} = \\mathbf{C}_f^T \\mathbf{Q} \\mathbf{C}_f$ is symmetric and positive-definite for any positive force density vector $\\mathbf{q} > \\mathbf{0}$. The spatial equilibrium coordinates $\\mathbf{x}_f, \\mathbf{y}_f, \\mathbf{z}_f$ of all internal free nodes are solved directly:

$$\\mathbf{D} \\mathbf{x}_f = \\mathbf{p}_x - \\mathbf{C}_f^T \\mathbf{Q} \\mathbf{C}_b \\mathbf{x}_b$$
$$\\mathbf{D} \\mathbf{y}_f = \\mathbf{p}_y - \\mathbf{C}_f^T \\mathbf{Q} \\mathbf{C}_b \\mathbf{y}_b$$
$$\\mathbf{D} \\mathbf{z}_f = \\mathbf{p}_z - \\mathbf{C}_f^T \\mathbf{Q} \\mathbf{C}_b \\mathbf{z}_b$$

Because $\\mathbf{D}$ is identical across all three cartesian coordinates, a single **Cholesky factorization** $\\mathbf{D} = \\mathbf{L} \\mathbf{L}^T$ solves all 3D nodal positions instantaneously!

---

## 2. Dynamic Relaxation (DR) Formulation

While FDM yields an exact analytical solution for given force densities, real structural cables possess material elasticity $E A$ and unstressed fabrication lengths $L_0$.

Under material elasticity, the internal member force is nonlinear with respect to coordinates:

$$T_k = \\begin{cases} \\frac{E_k A_k}{L_{0, k}} (L_k - L_{0, k}) + T_{0, k} & \\text{if } L_k > L_{0, k} \\\\ 0 & \\text{if slack (cable uncoupling)} \\end{cases}$$

Dynamic Relaxation models this physical behavior directly using an explicit central-difference time integration:

$$\\mathbf{v}_i^{t + \\Delta t/2} = \\mathbf{v}_i^{t - \\Delta t/2} + \\frac{\\Delta t}{m_i} \\mathbf{R}_i^t$$
$$\\mathbf{x}_i^{t + \\Delta t} = \\mathbf{x}_i^t + \\Delta t \\, \\mathbf{v}_i^{t + \\Delta t/2}$$

---

## 3. Algorithmic Comparison Matrix

| Property | Force Density Method (FDM) | Dynamic Relaxation (DR) |
| :--- | :--- | :--- |
| **Linearity** | Fully Linear System ($\\mathbf{D} \\mathbf{x} = \\mathbf{p}$) | Nonlinear Explicit Dynamic System |
| **Matrix Operations** | Sparse Cholesky factorization $\\mathcal{O}(n^{1.5})$ | Vector operations only $\\mathcal{O}(n)$ |
| **Memory Footprint** | Moderate (stiffness pattern storage) | Minimal (vector state buffers) |
| **Material Elasticity** | Requires nonlinear inner loop | Handled natively ($E A$, $L_0$, slack) |
| **Tensegrity Mechanism** | Requires rank analysis $\\operatorname{rank}(\\mathbf{D})$ | Naturally converges with kinetic damping |
| **Boundary Changes** | Requires re-factorization | Instantaneous coordinate updates |

---

## 4. Implementation Example: Python FDM Solver

Below is the vectorized NumPy implementation used in FormSpace Prime's linear seed generator:

\`\`\`python
import numpy as np
from scipy.sparse import csc_matrix
from scipy.sparse.linalg import factorized

def solve_force_density(C_free, C_fixed, q_vector, p_ext, xyz_fixed):
    \"\"\"
    Solves 3D node coordinates for given force density vector q.
    C_free: (m, nf) incidence matrix for free nodes
    C_fixed: (m, nb) incidence matrix for boundary nodes
    q_vector: (m,) array of force densities (T / L)
    \"\"\"
    # Assemble D = C_free.T @ diag(q) @ C_free
    Q = csc_matrix((q_vector, (np.arange(len(q_vector)), np.arange(len(q_vector)))))
    D = C_free.T @ Q @ C_free
    
    # Solve linear system using sparse Cholesky decomposition
    solve_D = factorized(D)
    
    # Compute boundary influence: D_b = C_free.T @ Q @ C_fixed
    D_b = C_free.T @ Q @ C_fixed
    
    # Solve for X, Y, Z coordinates simultaneously
    xyz_free = np.zeros((C_free.shape[1], 3))
    for dim in range(3):
        rhs = p_ext[:, dim] - D_b @ xyz_fixed[:, dim]
        xyz_free[:, dim] = solve_D(rhs)
        
    return xyz_free
\`\`\`

## 5. Summary & Engineering Recommendation

For initial conceptual exploration and rapid interactive slider updates in Rhino/Grasshopper, **FDM** is the gold standard because of its linear velocity. For final fabrication detailing with real cable cross-sections, turnbuckle prestress limits, and slack boundary conditions, **Dynamic Relaxation with Kinetic Damping** provides unmatched physical fidelity.`,
    coverImage: '/src/assets/images/software_form_finding_1790188528595.jpg',
    tags: ['Form-Finding', 'Force Density', 'Dynamic Relaxation', 'Algorithms'],
  }
];

export const INITIAL_LEADS: LeadInquiry[] = [
  {
    id: 'lead_01',
    name: 'Dr. Jean-Luc Girard',
    email: 'j.girard@aeropace-alenia.eu',
    organization: 'Thales Alenia Space & Structural Lab',
    role: 'Lead Mechanical Architect',
    inquiryType: 'Software Demo',
    softwareInterest: 'DeployX Space',
    projectScope: '14-meter deployable synthetic aperture radar (SAR) antenna boom for next-generation Earth observation satellite.',
    message: 'We are evaluating deployable kinematics software to replace our in-house code. We need verification of flexible hinge energy release under microgravity.',
    status: 'Demo Scheduled',
    createdAt: '2026-09-21 14:32 UTC',
  },
  {
    id: 'lead_02',
    name: 'Prof. Hans-Peter Keller',
    email: 'keller.hp@tum-bau.de',
    organization: 'Technical University of Munich (TUM)',
    role: 'Professor of Spatial Structural Mechanics',
    inquiryType: 'Academic License',
    softwareInterest: 'FormSpace Prime',
    projectScope: 'Graduate laboratory course on tensegrity form-finding and double-layer space grids (45 student workstations).',
    message: 'Requesting academic bundle pricing for FormSpace Prime and AeroLattice 3D for our winter 2026 master course.',
    status: 'New',
    createdAt: '2026-09-22 08:15 UTC',
  },
  {
    id: 'lead_03',
    name: 'Farah Al-Mansoor',
    email: 'f.mansoor@gulf-engineering.ae',
    organization: 'Gulf Special Structures & Space Grids',
    role: 'Senior Façade & Spatial Frame Engineer',
    inquiryType: 'Commercial Quotation',
    softwareInterest: 'AeroLattice 3D',
    projectScope: '160m clear-span airport departure terminal roof with severe asymmetric thermal and wind loads.',
    message: 'Please send licensing options for 5 floating network seats with priority engineering support.',
    status: 'Contacted',
    createdAt: '2026-09-20 16:40 UTC',
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud_01',
    timestamp: '2026-09-23 09:15:22 UTC',
    actor: 'Dr. Marcus Vance (Administrator)',
    actorEmail: 'admin@spatialfem.com',
    action: 'SYSTEM_INITIALIZATION',
    details: 'Verified database integrity and cryptographic token engine.',
    severity: 'info',
  },
  {
    id: 'aud_02',
    timestamp: '2026-09-22 17:02:11 UTC',
    actor: 'Elena Rostova (Lead Engineer)',
    actorEmail: 'lead.analyst@spatialfem.com',
    action: 'UPDATE_PROJECT_GALLERY',
    details: 'Added 2 thermal simulation clips to Al-Miraj Botanical Dome.',
    severity: 'info',
  },
  {
    id: 'aud_03',
    timestamp: '2026-09-21 11:22:45 UTC',
    actor: 'Kaito Tanaka (Editor)',
    actorEmail: 'content.editor@spatialfem.com',
    action: 'PUBLISH_BLOG_POST',
    details: 'Published article "DeployX v4.2 Release: Origami Crease Kinematics".',
    severity: 'info',
  }
];
