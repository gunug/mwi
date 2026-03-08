const API_BASE = import.meta.env.VITE_API_URL || ''

export async function fetchInvitations() {
  const res = await fetch(`${API_BASE}/api/invitations`)
  return res.json()
}

export async function fetchInvitation(id) {
  const res = await fetch(`${API_BASE}/api/invitations/${id}`)
  if (!res.ok) throw new Error('Not found')
  return res.json()
}

export async function checkSlug(slug) {
  const res = await fetch(`${API_BASE}/api/check-slug/${slug}`)
  return res.json()
}

export async function createInvitation(data) {
  const res = await fetch(`${API_BASE}/api/invitations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function saveInvitation(id, data) {
  const res = await fetch(`${API_BASE}/api/invitations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function deleteInvitation(id) {
  const res = await fetch(`${API_BASE}/api/invitations/${id}`, {
    method: 'DELETE',
  })
  return res.json()
}

export async function searchAddress(query) {
  const res = await fetch(`${API_BASE}/api/search-address?query=${encodeURIComponent(query)}`)
  return res.json()
}

export async function uploadImage(file) {
  const formData = new FormData()
  formData.append('image', file)
  const res = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    body: formData,
  })
  return res.json()
}

export async function uploadImages(files) {
  const formData = new FormData()
  for (const file of files) {
    formData.append('images', file)
  }
  const res = await fetch(`${API_BASE}/api/upload-multiple`, {
    method: 'POST',
    body: formData,
  })
  return res.json()
}
