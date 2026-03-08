require('dotenv').config()
const express = require('express')
const cors = require('cors')
const multer = require('multer')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 3000
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

// Upload image (full: 1920px, thumb: 300px)
app.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  try {
    const baseName = req.file.filename.replace(path.extname(req.file.filename), '')
    const fullName = `full_${baseName}.jpg`
    const thumbName = `thumb_${baseName}.jpg`

    await sharp(req.file.path)
      .resize(1920, null, { withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toFile(path.join(UPLOAD_DIR, fullName))

    await sharp(req.file.path)
      .resize(300)
      .jpeg({ quality: 85 })
      .toFile(path.join(UPLOAD_DIR, thumbName))

    fs.unlinkSync(req.file.path)

    res.json({ url: `/uploads/${fullName}`, thumbUrl: `/uploads/${thumbName}` })
  } catch (err) {
    res.json({ url: `/uploads/${req.file.filename}`, thumbUrl: `/uploads/${req.file.filename}` })
  }
})

// Upload multiple images (gallery)
app.post('/api/upload-multiple', upload.array('images', 50), async (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files uploaded' })
  try {
    const results = []
    for (const file of req.files) {
      const baseName = file.filename.replace(path.extname(file.filename), '')
      const fullName = `full_${baseName}.jpg`
      const thumbName = `thumb_${baseName}.jpg`

      await sharp(file.path)
        .resize(1920, null, { withoutEnlargement: true })
        .jpeg({ quality: 90 })
        .toFile(path.join(UPLOAD_DIR, fullName))

      await sharp(file.path)
        .resize(300)
        .jpeg({ quality: 85 })
        .toFile(path.join(UPLOAD_DIR, thumbName))

      fs.unlinkSync(file.path)

      results.push({ url: `/uploads/${fullName}`, thumbUrl: `/uploads/${thumbName}` })
    }
    res.json(results)
  } catch (err) {
    console.error('Upload error:', err)
    res.status(500).json({ error: 'Upload failed' })
  }
})

// Kakao address search proxy
app.get('/api/search-address', async (req, res) => {
  const query = req.query.query
  if (!query) return res.json({ documents: [] })

  const apiKey = process.env.KAKAO_REST_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'Kakao API key not configured' })

  try {
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&size=5`
    const response = await fetch(url, {
      headers: { Authorization: `KakaoAK ${apiKey}` },
    })
    const data = await response.json()
    const results = (data.documents || []).map(d => ({
      name: d.place_name,
      address: d.road_address_name || d.address_name,
      latitude: d.y,
      longitude: d.x,
    }))
    res.json(results)
  } catch (err) {
    res.status(500).json({ error: 'Search failed' })
  }
})

// Serve frontend static files
const FRONTEND_DIST = path.join(__dirname, '..', 'frontend', 'dist')
app.use(express.static(FRONTEND_DIST))

// Dynamic OG meta tags for invitation viewer pages
app.get('/:slug', (req, res, next) => {
  const slug = req.params.slug
  const dataPath = path.join(DATA_DIR, `${slug}.json`)
  if (!fs.existsSync(dataPath)) return next()

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  const title = data.title || '모바일 청첩장'
  const ogImage = data.ogImageUrl || ''
  const url = `${req.protocol}://${req.get('host')}/${slug}`

  let html = fs.readFileSync(path.join(FRONTEND_DIST, 'index.html'), 'utf-8')

  const ogTags = [
    `<meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${url}" />`,
    ogImage ? `<meta property="og:image" content="${ogImage.startsWith('http') ? ogImage : url.replace(`/${slug}`, ogImage)}" />` : '',
    `<meta property="og:description" content="${title.replace(/"/g, '&quot;')}" />`,
    `<title>${title.replace(/</g, '&lt;')}</title>`,
  ].filter(Boolean).join('\n    ')

  html = html.replace(/<title>[^<]*<\/title>/, ogTags)

  res.send(html)
})

app.get('*path', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIST, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
