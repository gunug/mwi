import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchInvitation } from '../data/api'
import InvitationPreview from '../components/preview/InvitationPreview'
import './ViewerPage.css'

export default function ViewerPage() {
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchInvitation(slug)
      .then(setData)
      .catch(() => setError(true))
  }, [slug])

  if (error) {
    return (
      <div className="viewer-error">
        <h2>청첩장을 찾을 수 없습니다</h2>
        <p>URL을 다시 확인해주세요.</p>
      </div>
    )
  }

  if (!data) {
    return <div className="viewer-loading">Loading...</div>
  }

  return (
    <div className="viewer-page">
      <InvitationPreview components={data.components} />
    </div>
  )
}
