import { useState } from 'react'
import { COMPONENT_TYPES } from '../../data/componentDefaults'
import { uploadImage, uploadImages, searchAddress } from '../../data/api'
import CopyPasteInput from '../common/CopyPasteInput'
import './ComponentEditor.css'

const RELATION_OPTIONS_GROOM = ['아들', '장남', '차남', '삼남']
const RELATION_OPTIONS_BRIDE = ['딸', '장녀', '차녀', '삼녀']

function GreetingEditor({ comp, onUpdate }) {
  return (
    <>
      <CopyPasteInput
        label="제목"
        value={comp.basic.title}
        onChange={v => onUpdate(comp.id, 'title', 'basic', v)}
      />
      <CopyPasteInput
        label="본문"
        value={comp.basic.content}
        onChange={v => onUpdate(comp.id, 'content', 'basic', v)}
        multiline
      />
      <CopyPasteInput
        label="배경색"
        value={comp.advanced.backgroundColor}
        onChange={v => onUpdate(comp.id, 'backgroundColor', 'advanced', v)}
        type="color"
      />
      <div className="cp-input">
        <label className="cp-label">텍스트 정렬</label>
        <select
          value={comp.advanced.textAlign}
          onChange={e => onUpdate(comp.id, 'textAlign', 'advanced', e.target.value)}
          className="cp-input-field"
        >
          <option value="left">좌측</option>
          <option value="center">중앙</option>
          <option value="right">우측</option>
        </select>
      </div>
    </>
  )
}

function PersonInfoEditor({ comp, onUpdate, relationOptions }) {
  return (
    <>
      <CopyPasteInput
        label="성명"
        value={comp.basic.name}
        onChange={v => onUpdate(comp.id, 'name', 'basic', v)}
      />
      <CopyPasteInput
        label="아버지 성명"
        value={comp.basic.fatherName}
        onChange={v => onUpdate(comp.id, 'fatherName', 'basic', v)}
      />
      <CopyPasteInput
        label="어머니 성명"
        value={comp.basic.motherName}
        onChange={v => onUpdate(comp.id, 'motherName', 'basic', v)}
      />
      <div className="cp-input">
        <label className="cp-label">관계 표기</label>
        <select
          value={comp.basic.relation}
          onChange={e => onUpdate(comp.id, 'relation', 'basic', e.target.value)}
          className="cp-input-field"
        >
          {relationOptions.map(o => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
      <CopyPasteInput
        label="아버지 고인 표기"
        value={comp.basic.deceasedFather}
        onChange={v => onUpdate(comp.id, 'deceasedFather', 'basic', v)}
        type="checkbox"
      />
      <CopyPasteInput
        label="어머니 고인 표기"
        value={comp.basic.deceasedMother}
        onChange={v => onUpdate(comp.id, 'deceasedMother', 'basic', v)}
        type="checkbox"
      />
    </>
  )
}

function WeddingDateEditor({ comp, onUpdate }) {
  return (
    <>
      <CopyPasteInput
        label="예식 날짜"
        value={comp.basic.date}
        onChange={v => onUpdate(comp.id, 'date', 'basic', v)}
        type="date"
      />
      <CopyPasteInput
        label="예식 시간"
        value={comp.basic.time}
        onChange={v => onUpdate(comp.id, 'time', 'basic', v)}
        type="time"
      />
      <CopyPasteInput
        label="달력 표시"
        value={comp.advanced.showCalendar}
        onChange={v => onUpdate(comp.id, 'showCalendar', 'advanced', v)}
        type="checkbox"
      />
    </>
  )
}

function WeddingVenueEditor({ comp, onUpdate }) {
  return (
    <>
      <CopyPasteInput
        label="예식장명"
        value={comp.basic.venueName}
        onChange={v => onUpdate(comp.id, 'venueName', 'basic', v)}
      />
      <CopyPasteInput
        label="주소"
        value={comp.basic.address}
        onChange={v => onUpdate(comp.id, 'address', 'basic', v)}
      />
      <CopyPasteInput
        label="홀명"
        value={comp.advanced.hallName}
        onChange={v => onUpdate(comp.id, 'hallName', 'advanced', v)}
      />
    </>
  )
}

function TransportationEditor({ comp, onUpdate }) {
  return (
    <CopyPasteInput
      label="교통 안내"
      value={comp.basic.content}
      onChange={v => onUpdate(comp.id, 'content', 'basic', v)}
      multiline
    />
  )
}

function ContactEditor({ comp, onUpdate }) {
  return (
    <>
      <CopyPasteInput
        label="신랑 이름"
        value={comp.basic.groomName}
        onChange={v => onUpdate(comp.id, 'groomName', 'basic', v)}
      />
      <CopyPasteInput
        label="신랑 연락처"
        value={comp.basic.groomPhone}
        onChange={v => onUpdate(comp.id, 'groomPhone', 'basic', v)}
        type="tel"
      />
      <CopyPasteInput
        label="신부 이름"
        value={comp.basic.brideName}
        onChange={v => onUpdate(comp.id, 'brideName', 'basic', v)}
      />
      <CopyPasteInput
        label="신부 연락처"
        value={comp.basic.bridePhone}
        onChange={v => onUpdate(comp.id, 'bridePhone', 'basic', v)}
        type="tel"
      />
      <div className="contact-divider">신랑 측 혼주</div>
      <CopyPasteInput
        label="신랑 부 이름"
        value={comp.advanced.groomFatherName}
        onChange={v => onUpdate(comp.id, 'groomFatherName', 'advanced', v)}
      />
      <CopyPasteInput
        label="신랑 부 연락처"
        value={comp.advanced.groomFatherPhone}
        onChange={v => onUpdate(comp.id, 'groomFatherPhone', 'advanced', v)}
        type="tel"
      />
      <CopyPasteInput
        label="신랑 모 이름"
        value={comp.advanced.groomMotherName}
        onChange={v => onUpdate(comp.id, 'groomMotherName', 'advanced', v)}
      />
      <CopyPasteInput
        label="신랑 모 연락처"
        value={comp.advanced.groomMotherPhone}
        onChange={v => onUpdate(comp.id, 'groomMotherPhone', 'advanced', v)}
        type="tel"
      />
      <div className="contact-divider">신부 측 혼주</div>
      <CopyPasteInput
        label="신부 부 이름"
        value={comp.advanced.brideFatherName}
        onChange={v => onUpdate(comp.id, 'brideFatherName', 'advanced', v)}
      />
      <CopyPasteInput
        label="신부 부 연락처"
        value={comp.advanced.brideFatherPhone}
        onChange={v => onUpdate(comp.id, 'brideFatherPhone', 'advanced', v)}
        type="tel"
      />
      <CopyPasteInput
        label="신부 모 이름"
        value={comp.advanced.brideMotherName}
        onChange={v => onUpdate(comp.id, 'brideMotherName', 'advanced', v)}
      />
      <CopyPasteInput
        label="신부 모 연락처"
        value={comp.advanced.brideMotherPhone}
        onChange={v => onUpdate(comp.id, 'brideMotherPhone', 'advanced', v)}
        type="tel"
      />
    </>
  )
}

function SummaryEditor({ comp, onUpdate }) {
  return (
    <>
      <CopyPasteInput
        label="신랑 이름"
        value={comp.basic.groomName}
        onChange={v => onUpdate(comp.id, 'groomName', 'basic', v)}
      />
      <CopyPasteInput
        label="신부 이름"
        value={comp.basic.brideName}
        onChange={v => onUpdate(comp.id, 'brideName', 'basic', v)}
      />
      <CopyPasteInput
        label="예식 날짜"
        value={comp.basic.date}
        onChange={v => onUpdate(comp.id, 'date', 'basic', v)}
        type="date"
      />
      <CopyPasteInput
        label="예식 시간"
        value={comp.basic.time}
        onChange={v => onUpdate(comp.id, 'time', 'basic', v)}
        type="time"
      />
      <CopyPasteInput
        label="예식장명"
        value={comp.basic.venueName}
        onChange={v => onUpdate(comp.id, 'venueName', 'basic', v)}
      />
    </>
  )
}

function NavigationEditor({ comp, onUpdate }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)

  async function handleSearch() {
    if (!query.trim()) return
    setSearching(true)
    const data = await searchAddress(query)
    setResults(data)
    setSearching(false)
  }

  function handleSelect(item) {
    onUpdate(comp.id, 'destinationName', 'basic', item.name)
    onUpdate(comp.id, 'address', 'basic', item.address)
    onUpdate(comp.id, 'latitude', 'basic', item.latitude)
    onUpdate(comp.id, 'longitude', 'basic', item.longitude)
    setResults([])
    setQuery('')
  }

  return (
    <>
      <div className="cp-input">
        <label className="cp-label">장소 검색</label>
        <div className="cp-input-row">
          <input
            className="cp-input-field"
            placeholder="예식장 이름 또는 주소 검색"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button className="cp-btn" onClick={handleSearch} disabled={searching}>
            {searching ? '...' : '검색'}
          </button>
        </div>
        {results.length > 0 && (
          <div className="address-results">
            {results.map((item, i) => (
              <button
                key={i}
                className="address-result-item"
                onClick={() => handleSelect(item)}
              >
                <span className="address-result-name">{item.name}</span>
                <span className="address-result-addr">{item.address}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {comp.basic.destinationName && (
        <div className="nav-selected-info">
          <div className="nav-selected-name">{comp.basic.destinationName}</div>
          <div className="nav-selected-addr">{comp.basic.address}</div>
          <div className="nav-selected-coords">
            {comp.basic.latitude}, {comp.basic.longitude}
          </div>
        </div>
      )}
      <CopyPasteInput
        label="목적지 이름 (수동)"
        value={comp.basic.destinationName}
        onChange={v => onUpdate(comp.id, 'destinationName', 'basic', v)}
      />
      <CopyPasteInput
        label="주소 (수동)"
        value={comp.basic.address}
        onChange={v => onUpdate(comp.id, 'address', 'basic', v)}
      />
      <CopyPasteInput
        label="위도"
        value={comp.basic.latitude}
        onChange={v => onUpdate(comp.id, 'latitude', 'basic', v)}
      />
      <CopyPasteInput
        label="경도"
        value={comp.basic.longitude}
        onChange={v => onUpdate(comp.id, 'longitude', 'basic', v)}
      />
      <CopyPasteInput
        label="네이버 지도"
        value={comp.advanced.showNaverMap}
        onChange={v => onUpdate(comp.id, 'showNaverMap', 'advanced', v)}
        type="checkbox"
      />
      <CopyPasteInput
        label="티맵"
        value={comp.advanced.showTmap}
        onChange={v => onUpdate(comp.id, 'showTmap', 'advanced', v)}
        type="checkbox"
      />
      <CopyPasteInput
        label="카카오내비"
        value={comp.advanced.showKakaoNavi}
        onChange={v => onUpdate(comp.id, 'showKakaoNavi', 'advanced', v)}
        type="checkbox"
      />
    </>
  )
}

function PhotoEditor({ comp, onUpdate }) {
  const [uploading, setUploading] = useState(false)

  async function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const result = await uploadImage(file)
    onUpdate(comp.id, 'imageUrl', 'basic', result.url)
    onUpdate(comp.id, 'thumbUrl', 'basic', result.thumbUrl || result.url)
    setUploading(false)
  }

  return (
    <>
      <div className="cp-input">
        <label className="cp-label">사진 업로드</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="cp-input-field"
          disabled={uploading}
        />
        {uploading && <span className="photo-uploading">업로드 중...</span>}
      </div>
      {comp.basic.imageUrl && (
        <div className="photo-preview-thumb">
          <img src={comp.basic.thumbUrl || comp.basic.imageUrl} alt="미리보기" />
        </div>
      )}
      <CopyPasteInput
        label="캡션"
        value={comp.basic.caption}
        onChange={v => onUpdate(comp.id, 'caption', 'basic', v)}
      />
    </>
  )
}

function GalleryEditor({ comp, onUpdate }) {
  const [uploading, setUploading] = useState(false)
  const images = comp.basic.images || []

  async function handleFilesChange(e) {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    setUploading(true)
    const results = await uploadImages(files)
    const updated = [...images, ...results]
    onUpdate(comp.id, 'images', 'basic', updated)
    setUploading(false)
    e.target.value = ''
  }

  function removeImage(index) {
    const updated = images.filter((_, i) => i !== index)
    onUpdate(comp.id, 'images', 'basic', updated)
  }

  return (
    <>
      <div className="cp-input">
        <label className="cp-label">사진 추가 (복수 선택 가능)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFilesChange}
          className="cp-input-field"
          disabled={uploading}
        />
        {uploading && <span className="photo-uploading">업로드 중...</span>}
      </div>
      {images.length > 0 && (
        <div className="gallery-editor-grid">
          {images.map((img, i) => (
            <div key={i} className="gallery-editor-item">
              <img src={img.thumbUrl} alt="" />
              <button className="gallery-editor-remove" onClick={() => removeImage(i)}>X</button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

const EDITORS = {
  greeting: GreetingEditor,
  groomInfo: (props) => <PersonInfoEditor {...props} relationOptions={RELATION_OPTIONS_GROOM} />,
  brideInfo: (props) => <PersonInfoEditor {...props} relationOptions={RELATION_OPTIONS_BRIDE} />,
  summary: SummaryEditor,
  photo: PhotoEditor,
  gallery: GalleryEditor,
  weddingDate: WeddingDateEditor,
  weddingVenue: WeddingVenueEditor,
  transportation: TransportationEditor,
  navigation: NavigationEditor,
  contact: ContactEditor,
}

function getComponentSummary(component) {
  const b = component.basic
  switch (component.type) {
    case 'greeting': return b.title || ''
    case 'groomInfo': return b.name ? `${b.fatherName || ''}${b.relation ? ' ' + b.relation : ''} ${b.name}` : ''
    case 'brideInfo': return b.name ? `${b.fatherName || ''}${b.relation ? ' ' + b.relation : ''} ${b.name}` : ''
    case 'weddingDate': return [b.date, b.time].filter(Boolean).join(' ')
    case 'weddingVenue': return [b.venueName, b.address].filter(Boolean).join(' · ')
    case 'transportation': return b.content ? b.content.slice(0, 30) : ''
    case 'summary': return [b.groomName, b.brideName].filter(Boolean).join(' & ')
    case 'photo': return b.caption || (b.imageUrl ? '(image)' : '')
    case 'gallery': return b.images?.length ? `${b.images.length}장` : ''
    case 'navigation': return b.destinationName || b.address || ''
    case 'contact': return [b.groomName, b.brideName].filter(Boolean).join(' · ')
    default: return ''
  }
}

export default function ComponentEditor({ component, onUpdate, onRemove, collapsed, color, dragHandleProps }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const def = COMPONENT_TYPES[component.type]
  const Editor = EDITORS[component.type]

  const style = color
    ? { borderLeft: `4px solid ${color}`, backgroundColor: `${color}4D` }
    : undefined

  return (
    <div
      className={`comp-editor ${collapsed ? 'comp-editor-collapsed' : ''}`}
      style={style}
    >
      <div className="comp-editor-header" style={color ? { background: 'transparent' } : undefined}>
        {dragHandleProps && (
          <span className="drag-handle-inline" {...dragHandleProps}>&#x2630;</span>
        )}
        <span className="comp-editor-title">{def?.label || component.type}</span>
        {!collapsed && (
          <div className="comp-editor-actions">
            <button className="btn-remove" onClick={() => setShowDeleteConfirm(true)} title="삭제">
              🗑
            </button>
          </div>
        )}
      </div>
      {collapsed && (
        <div className="comp-editor-summary">{getComponentSummary(component)}</div>
      )}
      {!collapsed && (
        <div className="comp-editor-body">
          {Editor && <Editor comp={component} onUpdate={onUpdate} />}
        </div>
      )}
      {showDeleteConfirm && (
        <div className="delete-confirm-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="delete-confirm-modal" onClick={e => e.stopPropagation()}>
            <p>'{def?.label || component.type}' 컴포넌트를 삭제하시겠습니까?</p>
            <div className="delete-confirm-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteConfirm(false)}>취소</button>
              <button className="btn-delete" onClick={() => onRemove(component.id)}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
