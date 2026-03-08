import { useState, useEffect, useRef } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import './InvitationPreview.css'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${days[d.getDay()]}요일`
}

function formatTime(timeStr) {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':').map(Number)
  const period = h < 12 ? '오전' : '오후'
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${period} ${hour}시${m > 0 ? ` ${m}분` : ''}`
}

function GreetingPreview({ basic, advanced }) {
  return (
    <div
      className="preview-section preview-greeting"
      style={{
        textAlign: advanced?.textAlign || 'center',
        backgroundColor: advanced?.backgroundColor || '#ffffff',
      }}
    >
      <h3 className="greeting-title">{basic.title}</h3>
      <p className="greeting-content">
        {basic.content?.split('\n').map((line, i) => (
          <span key={i}>{line}<br /></span>
        ))}
      </p>
    </div>
  )
}

function PersonPreview({ basic, advanced, role }) {
  const deceased = (name, isDead) =>
    isDead ? <span className="deceased">故 {name}</span> : name

  return (
    <div className="preview-section preview-person">
      <div className="person-role">{role}</div>
      <div className="person-parents">
        {deceased(basic.fatherName, basic.deceasedFather)}
        {basic.fatherName && basic.motherName && ' · '}
        {deceased(basic.motherName, basic.deceasedMother)}
        {(basic.fatherName || basic.motherName) && basic.relation && (
          <span className="person-relation">의 {basic.relation}</span>
        )}
      </div>
      <div className="person-name">{basic.name}</div>
    </div>
  )
}

function WeddingDatePreview({ basic, advanced }) {
  return (
    <div className="preview-section preview-date">
      <div className="date-main">{formatDate(basic.date)}</div>
      <div className="date-time">{formatTime(basic.time)}</div>
      {advanced?.showCalendar && basic.date && (
        <MiniCalendar dateStr={basic.date} />
      )}
    </div>
  )
}

function MiniCalendar({ dateStr }) {
  const target = new Date(dateStr)
  const year = target.getFullYear()
  const month = target.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  return (
    <div className="mini-calendar">
      <div className="cal-header">
        {['일', '월', '화', '수', '목', '금', '토'].map(d => (
          <span key={d} className="cal-day-name">{d}</span>
        ))}
      </div>
      <div className="cal-grid">
        {days.map((d, i) => (
          <span
            key={i}
            className={`cal-day ${d === target.getDate() ? 'cal-today' : ''} ${!d ? 'cal-empty' : ''}`}
          >
            {d}
          </span>
        ))}
      </div>
    </div>
  )
}

function WeddingVenuePreview({ basic, advanced }) {
  return (
    <div className="preview-section preview-venue">
      <div className="venue-name">
        {basic.venueName}
        {advanced?.hallName && <span className="venue-hall"> {advanced.hallName}</span>}
      </div>
      <div className="venue-address">{basic.address}</div>
    </div>
  )
}

function TransportationPreview({ basic }) {
  if (!basic.content) return null
  return (
    <div className="preview-section preview-transportation">
      <div className="transport-title">오시는 길</div>
      <p className="transport-content">
        {basic.content.split('\n').map((line, i) => (
          <span key={i}>{line}<br /></span>
        ))}
      </p>
    </div>
  )
}

function KakaoMapView({ latitude, longitude, name }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)

  useEffect(() => {
    if (!latitude || !longitude || !mapRef.current) return
    if (!window.kakao?.maps) return

    window.kakao.maps.load(() => {
      const lat = parseFloat(latitude)
      const lng = parseFloat(longitude)
      const position = new window.kakao.maps.LatLng(lat, lng)

      if (mapInstance.current) {
        mapInstance.current.setCenter(position)
      } else {
        const map = new window.kakao.maps.Map(mapRef.current, {
          center: position,
          level: 3,
          draggable: false,
        })
        mapInstance.current = map
      }

      // Clear existing markers
      const marker = new window.kakao.maps.Marker({ position })
      marker.setMap(mapInstance.current)

      if (name) {
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:4px 8px;font-size:12px;white-space:nowrap">${name}</div>`,
        })
        infowindow.open(mapInstance.current, marker)
      }
    })
  }, [latitude, longitude, name])

  return <div ref={mapRef} className="kakao-map" />
}

function NavigationPreview({ basic, advanced }) {
  const { destinationName, address, latitude, longitude } = basic
  const hasCoords = latitude && longitude
  const name = encodeURIComponent(destinationName || address || '목적지')

  const navLinks = []
  if (advanced?.showNaverMap !== false) {
    navLinks.push({
      label: '네이버 지도',
      url: hasCoords
        ? `nmap://place?lat=${latitude}&lng=${longitude}&name=${name}&appname=wedding`
        : null,
      fallback: hasCoords
        ? `https://map.naver.com/v5/?c=${longitude},${latitude},15,0,0,0,dh`
        : `https://map.naver.com/v5/search/${name}`,
      className: 'nav-btn-naver',
    })
  }
  if (advanced?.showTmap !== false) {
    navLinks.push({
      label: 'T map',
      url: hasCoords
        ? `tmap://route?goalname=${name}&goaly=${latitude}&goalx=${longitude}`
        : null,
      fallback: null,
      className: 'nav-btn-tmap',
    })
  }
  if (advanced?.showKakaoNavi !== false) {
    navLinks.push({
      label: '카카오내비',
      url: hasCoords
        ? `kakaomap://look?p=${latitude},${longitude}`
        : null,
      fallback: hasCoords
        ? `https://map.kakao.com/link/to/${name},${latitude},${longitude}`
        : `https://map.kakao.com/link/search/${name}`,
      className: 'nav-btn-kakao',
    })
  }

  function handleClick(link) {
    if (!link.url && !link.fallback) return
    if (link.url) {
      const timeout = setTimeout(() => {
        if (link.fallback) window.location.href = link.fallback
      }, 1500)
      window.location.href = link.url
      window.addEventListener('blur', () => clearTimeout(timeout), { once: true })
    } else if (link.fallback) {
      window.location.href = link.fallback
    }
  }

  return (
    <div className="preview-section preview-navigation">
      <h4>길 안내</h4>
      {hasCoords && (
        <KakaoMapView
          latitude={latitude}
          longitude={longitude}
          name={destinationName}
        />
      )}
      {address && <div className="nav-address">{address}</div>}
      <div className="nav-buttons">
        {navLinks.map(link => (
          <button
            key={link.label}
            className={`nav-btn ${link.className}`}
            onClick={() => handleClick(link)}
            disabled={!hasCoords && !link.fallback}
          >
            {link.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function ContactPreview({ basic, advanced }) {
  function PhoneLink({ name, phone }) {
    if (!name && !phone) return null
    return (
      <div className="contact-row">
        <span className="contact-name">{name}</span>
        {phone && (
          <a href={`tel:${phone}`} className="contact-phone">{phone}</a>
        )}
      </div>
    )
  }

  return (
    <div className="preview-section preview-contact">
      <h4>연락처</h4>
      <div className="contact-group">
        <PhoneLink name={basic.groomName} phone={basic.groomPhone} />
        <PhoneLink name={basic.brideName} phone={basic.bridePhone} />
      </div>
      {advanced && (advanced.groomFatherName || advanced.groomMotherName ||
        advanced.brideFatherName || advanced.brideMotherName) && (
        <div className="contact-group contact-parents">
          <PhoneLink name={advanced.groomFatherName} phone={advanced.groomFatherPhone} />
          <PhoneLink name={advanced.groomMotherName} phone={advanced.groomMotherPhone} />
          <PhoneLink name={advanced.brideFatherName} phone={advanced.brideFatherPhone} />
          <PhoneLink name={advanced.brideMotherName} phone={advanced.brideMotherPhone} />
        </div>
      )}
    </div>
  )
}

function SummaryPreview({ basic }) {
  return (
    <div className="preview-section preview-summary">
      <div className="summary-names">
        <span className="summary-name">{basic.groomName || '신랑'}</span>
        <span className="summary-amp">&amp;</span>
        <span className="summary-name">{basic.brideName || '신부'}</span>
      </div>
      {basic.date && <div className="summary-date">{formatDate(basic.date)}</div>}
      {basic.time && <div className="summary-time">{formatTime(basic.time)}</div>}
      {basic.venueName && <div className="summary-venue">{basic.venueName}</div>}
    </div>
  )
}

function PhotoPreview({ basic }) {
  if (!basic.imageUrl) return null
  return (
    <div className="preview-section preview-photo">
      <img src={basic.imageUrl} alt={basic.caption || ''} className="photo-image" />
      {basic.caption && <div className="photo-caption">{basic.caption}</div>}
    </div>
  )
}

function GalleryPreview({ basic }) {
  const [viewIndex, setViewIndex] = useState(null)
  const images = basic.images || []
  if (images.length === 0) return null

  return (
    <div className="preview-section preview-gallery">
      <div className="gallery-grid">
        {images.map((img, i) => (
          <div key={i} className="gallery-thumb" onClick={() => setViewIndex(i)}>
            <img src={img.thumbUrl} alt="" />
          </div>
        ))}
      </div>
      {viewIndex !== null && (
        <div className="gallery-popup-overlay" onClick={() => setViewIndex(null)}>
          <button className="gallery-popup-close" onClick={() => setViewIndex(null)}>X</button>
          <img
            className="gallery-popup-image"
            src={images[viewIndex].url}
            alt=""
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}

const RENDERERS = {
  greeting: GreetingPreview,
  groomInfo: (props) => <PersonPreview {...props} role="신랑" />,
  brideInfo: (props) => <PersonPreview {...props} role="신부" />,
  summary: SummaryPreview,
  photo: PhotoPreview,
  gallery: GalleryPreview,
  weddingDate: WeddingDatePreview,
  weddingVenue: WeddingVenuePreview,
  transportation: TransportationPreview,
  navigation: NavigationPreview,
  contact: ContactPreview,
}

function SortablePreviewItem({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}

export default function InvitationPreview({ components, reorderColors, reorderMode, onReorder }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      onReorder(active.id, over.id)
    }
  }

  const content = components.map((comp, index) => {
    const Renderer = RENDERERS[comp.type]
    if (!Renderer) return null
    const color = reorderColors ? reorderColors[index % reorderColors.length] : null
    const inner = (
      <div key={comp.id} className="preview-section-wrap" style={color ? { position: 'relative' } : undefined}>
        {color && (
          <div className="preview-color-overlay" style={{ backgroundColor: color }} />
        )}
        <Renderer
          basic={comp.basic}
          advanced={comp.advanced}
        />
      </div>
    )

    if (reorderMode) {
      return (
        <SortablePreviewItem key={comp.id} id={comp.id}>
          {inner}
        </SortablePreviewItem>
      )
    }
    return inner
  })

  if (reorderMode) {
    return (
      <div className="invitation-preview">
        <div className="preview-reorder-notice">드래그하여 순서를 변경하세요</div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={components.map(c => c.id)} strategy={verticalListSortingStrategy}>
            {content}
          </SortableContext>
        </DndContext>
      </div>
    )
  }

  return (
    <div className="invitation-preview">
      {content}
    </div>
  )
}
