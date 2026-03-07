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
        {deceased(basic.fatherName, advanced?.deceasedFather)}
        {basic.fatherName && basic.motherName && ' · '}
        {deceased(basic.motherName, advanced?.deceasedMother)}
        {(basic.fatherName || basic.motherName) && advanced?.relation && (
          <span className="person-relation">의 {advanced.relation}</span>
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
      {advanced?.transportation && (
        <div className="venue-transport">
          <div className="transport-title">오시는 길</div>
          <p>{advanced.transportation}</p>
        </div>
      )}
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

const RENDERERS = {
  greeting: GreetingPreview,
  groomInfo: (props) => <PersonPreview {...props} role="신랑" />,
  brideInfo: (props) => <PersonPreview {...props} role="신부" />,
  weddingDate: WeddingDatePreview,
  weddingVenue: WeddingVenuePreview,
  contact: ContactPreview,
}

export default function InvitationPreview({ components }) {
  return (
    <div className="invitation-preview">
      {components.map(comp => {
        const Renderer = RENDERERS[comp.type]
        if (!Renderer) return null
        return (
          <Renderer
            key={comp.id}
            basic={comp.basic}
            advanced={comp.advanced}
          />
        )
      })}
    </div>
  )
}
