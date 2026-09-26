import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure upload & data directories exist
const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');
const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// Strict Directory Listing Blocker Middleware
// Denies direct browsing or indexing of directories across all paths
app.use((req, res, next) => {
  const reqPath = decodeURIComponent(req.path);

  // Permit root path to pass through to application frontend
  if (reqPath === '/' || reqPath === '') {
    return next();
  }

  // Redirect /admin and /admin/ to /#/admin
  if (reqPath.toLowerCase() === '/admin' || reqPath.toLowerCase() === '/admin/') {
    return res.redirect('/#/admin');
  }

  // Deny path traversal attempts
  if (reqPath.includes('..') || reqPath.includes('/.')) {
    return res.status(403).type('text/plain').send('403 Forbidden: Directory traversal blocked.');
  }

  // Check physical directories
  const checkPaths = [
    path.join(process.cwd(), reqPath),
    path.join(process.cwd(), 'public', reqPath),
    path.join(UPLOADS_DIR, reqPath.replace(/^\/uploads\/?/, '')),
    path.join(DATA_DIR, reqPath.replace(/^\/data\/?/, '')),
  ];

  for (const p of checkPaths) {
    try {
      if (fs.existsSync(p) && fs.statSync(p).isDirectory()) {
        return res.status(403).type('text/plain').send('403 Forbidden: Directory listing is disabled.');
      }
    } catch {
      // Ignore lookup errors and proceed
    }
  }

  // Block any URL ending in a trailing slash (other than root)
  if (reqPath.endsWith('/')) {
    return res.status(403).type('text/plain').send('403 Forbidden: Directory listing is disabled.');
  }

  next();
});

// Serve uploads with directory indexing disabled
app.use('/uploads', express.static(UPLOADS_DIR, { index: false, dotfiles: 'deny' }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9_\.-]/g, '_');
    const unique = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${cleanName}`;
    cb(null, unique);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// JSON File Database Storage Helper
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseStore {
  software: any[];
  projects: any[];
  articles: any[];
  media: any[];
  leads: any[];
  users: any[];
  auditLogs: any[];
}

function loadDatabase(): DatabaseStore {
  let db: any = {};
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(data) || {};
    }
  } catch (err) {
    console.error('Error loading DB file, reinitializing:', err);
  }

  // Ensure all collections are guaranteed arrays and support backward compatibility
  const ensured: DatabaseStore = {
    software: Array.isArray(db.software) ? db.software : [],
    projects: Array.isArray(db.projects) ? db.projects : [],
    articles: Array.isArray(db.articles) ? db.articles : (Array.isArray(db.blog) ? db.blog : (Array.isArray(db.posts) ? db.posts : [])),
    media: Array.isArray(db.media) ? db.media : [],
    leads: Array.isArray(db.leads) ? db.leads : [],
    users: Array.isArray(db.users) && db.users.length > 0 ? db.users : [
      {
        id: 'usr_admin_master',
        name: 'System Administrator',
        email: 'admin@ssdesigner.ir',
        role: 'administrator',
        password: 'AeroAdmin2026!',
        lastLogin: new Date().toISOString(),
      },
    ],
    auditLogs: Array.isArray(db.auditLogs) ? db.auditLogs : [],
  };

  return ensured;
}

function saveDatabase(data: DatabaseStore) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB file:', err);
  }
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Diagnostics & Status
app.get('/api/status', (_req: Request, res: Response) => {
  const db = loadDatabase();
  res.json({
    connected: true,
    engine: 'Server Database Engine (Ready for MySQL)',
    database: process.env.DB_NAME || 'ssdesign_db',
    counts: {
      software: db.software.length,
      projects: db.projects.length,
      articles: db.articles.length,
      media: db.media.length,
      leads: db.leads.length,
      users: db.users.length,
    },
  });
});

app.get('/api/setup', (_req: Request, res: Response) => {
  const db = loadDatabase();
  saveDatabase(db);
  res.json({
    success: true,
    message: 'Database structure verified and active.',
    tables: ['software', 'projects', 'articles', 'media', 'leads', 'users', 'auditLogs'],
  });
});

// Software CRUD
app.get('/api/software', (_req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db.software);
});

app.get('/api/software/:id', (req: Request, res: Response) => {
  const db = loadDatabase();
  const item = db.software.find((s) => s.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Software not found' });
  res.json(item);
});

app.post('/api/software', (req: Request, res: Response) => {
  const db = loadDatabase();
  const newItem = {
    id: req.body.id || `soft_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  db.software.unshift(newItem);
  saveDatabase(db);
  res.status(201).json(newItem);
});

app.put('/api/software/:id', (req: Request, res: Response) => {
  const db = loadDatabase();
  const idx = db.software.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Software not found' });
  db.software[idx] = { ...db.software[idx], ...req.body };
  saveDatabase(db);
  res.json(db.software[idx]);
});

app.delete('/api/software/:id', (req: Request, res: Response) => {
  const db = loadDatabase();
  db.software = db.software.filter((s) => s.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// Projects CRUD
app.get('/api/projects', (_req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db.projects);
});

app.get('/api/projects/:id', (req: Request, res: Response) => {
  const db = loadDatabase();
  const item = db.projects.find((p) => p.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Project not found' });
  res.json(item);
});

app.post('/api/projects', (req: Request, res: Response) => {
  const db = loadDatabase();
  const newItem = {
    id: req.body.id || `proj_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  db.projects.unshift(newItem);
  saveDatabase(db);
  res.status(201).json(newItem);
});

app.put('/api/projects/:id', (req: Request, res: Response) => {
  const db = loadDatabase();
  const idx = db.projects.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Project not found' });
  db.projects[idx] = { ...db.projects[idx], ...req.body };
  saveDatabase(db);
  res.json(db.projects[idx]);
});

app.delete('/api/projects/:id', (req: Request, res: Response) => {
  const db = loadDatabase();
  db.projects = db.projects.filter((p) => p.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// Articles CRUD
app.get(['/api/articles', '/articles'], (req: Request, res: Response, next) => {
  // If requested directly as HTML page via browser navigation, let Vite SPA handle it
  if (req.path === '/articles' && !req.headers.accept?.includes('application/json')) {
    return next();
  }
  try {
    const db = loadDatabase();
    res.json(Array.isArray(db.articles) ? db.articles : []);
  } catch (err: any) {
    console.error('Error fetching articles:', err);
    res.status(500).json({ error: 'Failed to retrieve articles' });
  }
});

app.get(['/api/articles/:id', '/articles/:id'], (req: Request, res: Response, next) => {
  if (req.path.startsWith('/articles/') && !req.headers.accept?.includes('application/json')) {
    return next();
  }
  try {
    const db = loadDatabase();
    const articles = Array.isArray(db.articles) ? db.articles : [];
    const item = articles.find((a) => a.id === req.params.id || a.slug === req.params.id);
    if (!item) return res.status(404).json({ error: 'Article not found' });
    res.json(item);
  } catch (err: any) {
    console.error('Error fetching article item:', err);
    res.status(500).json({ error: 'Failed to retrieve article' });
  }
});

app.post('/api/articles', (req: Request, res: Response) => {
  try {
    const db = loadDatabase();
    if (!Array.isArray(db.articles)) db.articles = [];
    const newItem = {
      id: req.body?.id || `post_${Date.now()}`,
      publishedAt: req.body?.publishedAt || new Date().toISOString().split('T')[0],
      title: req.body?.title || 'Untitled Technical Article',
      ...req.body,
    };
    db.articles.unshift(newItem);
    saveDatabase(db);
    res.status(201).json(newItem);
  } catch (err: any) {
    console.error('Error creating article:', err);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

app.put('/api/articles/:id', (req: Request, res: Response) => {
  try {
    const db = loadDatabase();
    if (!Array.isArray(db.articles)) db.articles = [];
    const idx = db.articles.findIndex((a) => a.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Article not found' });
    db.articles[idx] = { ...db.articles[idx], ...req.body };
    saveDatabase(db);
    res.json(db.articles[idx]);
  } catch (err: any) {
    console.error('Error updating article:', err);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

app.delete('/api/articles/:id', (req: Request, res: Response) => {
  try {
    const db = loadDatabase();
    if (!Array.isArray(db.articles)) db.articles = [];
    db.articles = db.articles.filter((a) => a.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting article:', err);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// Media CRUD
app.get('/api/media', (req: Request, res: Response) => {
  const db = loadDatabase();
  const targetId = req.query.targetId as string;
  if (targetId) {
    res.json(db.media.filter((m) => m.targetId === targetId));
  } else {
    res.json(db.media);
  }
});

app.post('/api/media', (req: Request, res: Response) => {
  const db = loadDatabase();
  const newItem = {
    id: req.body.id || `med_${Date.now()}`,
    createdAt: req.body.createdAt || new Date().toISOString().split('T')[0],
    ...req.body,
  };
  db.media.unshift(newItem);
  saveDatabase(db);
  res.status(201).json(newItem);
});

app.delete('/api/media/:id', (req: Request, res: Response) => {
  const db = loadDatabase();
  db.media = db.media.filter((m) => m.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// Leads
app.get('/api/leads', (_req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db.leads);
});

app.post('/api/leads', (req: Request, res: Response) => {
  const db = loadDatabase();
  const newLead = {
    id: `lead_${Date.now()}`,
    status: 'new',
    submittedAt: new Date().toLocaleString(),
    ...req.body,
  };
  db.leads.unshift(newLead);
  saveDatabase(db);
  res.status(201).json(newLead);
});

app.put('/api/leads/:id', (req: Request, res: Response) => {
  const db = loadDatabase();
  const idx = db.leads.findIndex((l) => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Lead not found' });
  db.leads[idx] = { ...db.leads[idx], ...req.body };
  saveDatabase(db);
  res.json(db.leads[idx]);
});

app.delete('/api/leads/:id', (req: Request, res: Response) => {
  const db = loadDatabase();
  db.leads = db.leads.filter((l) => l.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// File Upload endpoint
app.post('/api/upload', upload.single('file') as any, (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file received for upload' });
  }
  const publicUrl = `/uploads/${req.file.filename}`;
  res.status(201).json({
    success: true,
    filename: req.file.filename,
    url: publicUrl,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
});

// Authentication & Passwords
app.get('/api/auth/users', (_req: Request, res: Response) => {
  const db = loadDatabase();
  const safeUsers = db.users.map(({ password, ...u }) => u);
  res.json(safeUsers);
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const db = loadDatabase();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(404).json({ error: 'User not found in system database' });
  }

  if (user.password && password && user.password !== password) {
    return res.status(401).json({ error: 'Invalid password. Please check your credentials.' });
  }

  user.lastLogin = new Date().toISOString();
  saveDatabase(db);

  const { password: _, ...safeUser } = user;
  res.json({
    user: safeUser,
    token: `tok_${Math.random().toString(36).substring(2)}`,
  });
});

app.post('/api/auth/set-password', (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and newPassword are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const db = loadDatabase();
  let user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    user = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0],
      email: email.toLowerCase(),
      role: 'administrator',
      password: newPassword,
      lastLogin: new Date().toISOString(),
    };
    db.users.push(user);
  } else {
    user.password = newPassword;
  }

  saveDatabase(db);
  res.json({
    success: true,
    message: `Password for ${email} has been updated in database.`,
  });
});

// -------------------------------------------------------------
// Vite Middleware / Static Serving
// -------------------------------------------------------------
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false, dotfiles: 'deny' }));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SSDesigner Engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
