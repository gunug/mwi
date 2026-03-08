import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchInvitations, checkSlug, createInvitation, deleteInvitation } from '../data/api'
import { createDefaultInvitation } from '../data/componentDefaults'
import './MainPage.css'

export default function MainPage() {
  const [invitations, setInvitations] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [slugError, setSlugError] = useState('')
  const [copied, setCopied] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadInvitations()
  }, [])

  async function loadInvitations() {
    const list = await fetchInvitations()
    setInvitations(list)
  }

  async function handleCreate() {
    if (!/^[a-z0-9]{6,}$/i.test(slug)) {
      setSlugError('영문 + 숫자, 6자 이상 입력해주세요')
      return
    }
    const check = await checkSlug(slug)
    if (!check.available) {
      setSlugError('이미 사용 중인 배포명입니다')
      return
    }
    const data = createDefaultInvitation(slug, title)
    await createInvitation(data)
    setShowModal(false)
    setSlug('')
    setTitle('')
    navigate(`/editor/${slug}`)
  }

  async function handleDelete(id) {
    if (!confirm('정말 삭제하시겠습니까?')) return
    await deleteInvitation(id)
    loadInvitations()
  }

  function handleCopy(id) {
    const url = `${window.location.origin}/${id}`
    navigator.clipboard.writeText(url)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="main-page">
      <header className="main-header">
        <h1>모바일 청첩장 생성기</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + 새 청첩장 만들기
        </button>
      </header>

      {invitations.length === 0 ? (
        <div className="empty-state">
          <p>아직 생성된 청첩장이 없습니다.</p>
          <p>새 청첩장을 만들어보세요!</p>
        </div>
      ) : (
        <div className="invitation-list">
          {invitations.map(inv => (
            <div key={inv.id} className="invitation-card">
              <div className="card-info">
                <strong>{inv.id}</strong>
                <span className="card-date">{inv.createdAt}</span>
                <a className="card-url" href={`/${inv.id}`} target="_blank" rel="noopener noreferrer">{window.location.origin}/{inv.id}</a>
              </div>
              <div className="card-actions">
                <button
                  className="btn-copy"
                  onClick={() => handleCopy(inv.id)}
                >
                  {copied === inv.id ? 'copied!' : 'URL 복사'}
                </button>
                <button
                  className="btn-edit"
                  onClick={() => navigate(`/editor/${inv.id}`)}
                >
                  편집
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(inv.id)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>새 청첩장 만들기</h2>
            <label>
              타이틀 (링크 제목으로 표시됩니다)
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="예: 홍길동 ♥ 김영희 결혼합니다"
              />
            </label>
            <label>
              배포명 (URL에 사용됩니다)
              <input
                type="text"
                value={slug}
                onChange={e => {
                  setSlug(e.target.value.toLowerCase())
                  setSlugError('')
                }}
                placeholder="영문+숫자 6자 이상 (예: hong2026)"
              />
            </label>
            {slugError && <p className="error">{slugError}</p>}
            <div className="modal-preview">
              {slug && <span>URL: {window.location.origin}/{slug}</span>}
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                취소
              </button>
              <button className="btn-primary" onClick={handleCreate}>
                생성
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
