const express = require('express')
const cors = require('cors')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 4000
const DATA_DIR = path.join(__dirname, 'data')
const UPLOAD_DIR = path.join(__dirname, 'uploads')

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(UPLOAD_DIR))

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`)
  },
})
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })

// Get all invitations
app.get('/api/invitations', (req, res) => {
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'))
  const list = files.map(f => {
    const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf-8'))
    return { id: data.id, createdAt: data.createdAt }
  })
  res.json(list)
})

// Get single invitation
app.get('/api/invitations/:id', (req, res) => {
  const filePath = path.join(DATA_DIR, `${req.params.id}.json`)
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Not found' })
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  res.json(data)
})

// Check if slug is available
app.get('/api/check-slug/:slug', (req, res) => {
  const slug = req.params.slug
  if (!/^[a-z0-9]{6,}$/i.test(slug)) {
    return res.json({ available: false, reason: 'Must be alphanumeric, 6+ characters' })
  }
  const filePath = path.join(DATA_DIR, `${slug}.json`)
  res.json({ available: !fs.existsSync(filePath) })
})

// Create invitation
app.post('/api/invitations', (req, res) => {
  const { id } = req.body
  if (!/^[a-z0-9]{6,}$/i.test(id)) {
    return res.status(400).json({ error: 'Invalid ID: alphanumeric, 6+ characters required' })
  }
  const filePath = path.join(DATA_DIR, `${id}.json`)
  if (fs.existsSync(filePath)) {
    return res.status(409).json({ error: 'ID already exists' })
  }
  fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2))
  res.status(201).json({ success: true })
})

// Update invitation
app.put('/api/invitations/:id', (req, res) => {
  const filePath = path.join(DATA_DIR, `${req.params.id}.json`)
  fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2))
  res.json({ success: true })
})

// Delete invitation
app.delete('/api/invitations/:id', (req, res) => {
  const filePath = path.join(DATA_DIR, `${req.params.id}.json`)
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  res.json({ success: true })
})

// Upload image
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  res.json({ url: `/uploads/${req.file.filename}` })
})

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
