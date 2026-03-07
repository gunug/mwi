import { COMPONENT_TYPES } from '../../data/componentDefaults'
import CopyPasteInput from '../common/CopyPasteInput'
import './ComponentEditor.css'

const RELATION_OPTIONS_GROOM = ['장남', '차남', '삼남', '아들']
const RELATION_OPTIONS_BRIDE = ['장녀', '차녀', '삼녀', '딸']

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
      {comp.showAdvanced && (
        <>
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
      )}
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
      {comp.showAdvanced && (
        <>
          <div className="cp-input">
            <label className="cp-label">관계 표기</label>
            <select
              value={comp.advanced.relation}
              onChange={e => onUpdate(comp.id, 'relation', 'advanced', e.target.value)}
              className="cp-input-field"
            >
              {relationOptions.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <CopyPasteInput
            label="아버지 고인 표기"
            value={comp.advanced.deceasedFather}
            onChange={v => onUpdate(comp.id, 'deceasedFather', 'advanced', v)}
            type="checkbox"
          />
          <CopyPasteInput
            label="어머니 고인 표기"
            value={comp.advanced.deceasedMother}
            onChange={v => onUpdate(comp.id, 'deceasedMother', 'advanced', v)}
            type="checkbox"
          />
        </>
      )}
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
      {comp.showAdvanced && (
        <CopyPasteInput
          label="달력 표시"
          value={comp.advanced.showCalendar}
          onChange={v => onUpdate(comp.id, 'showCalendar', 'advanced', v)}
          type="checkbox"
        />
      )}
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
      {comp.showAdvanced && (
        <>
          <CopyPasteInput
            label="홀명"
            value={comp.advanced.hallName}
            onChange={v => onUpdate(comp.id, 'hallName', 'advanced', v)}
          />
          <CopyPasteInput
            label="교통 안내"
            value={comp.advanced.transportation}
            onChange={v => onUpdate(comp.id, 'transportation', 'advanced', v)}
            multiline
          />
        </>
      )}
    </>
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
      {comp.showAdvanced && (
        <>
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
      )}
    </>
  )
}

const EDITORS = {
  greeting: GreetingEditor,
  groomInfo: (props) => <PersonInfoEditor {...props} relationOptions={RELATION_OPTIONS_GROOM} />,
  brideInfo: (props) => <PersonInfoEditor {...props} relationOptions={RELATION_OPTIONS_BRIDE} />,
  weddingDate: WeddingDateEditor,
  weddingVenue: WeddingVenueEditor,
  contact: ContactEditor,
}

export default function ComponentEditor({ component, onUpdate, onToggleAdvanced, onRemove }) {
  const def = COMPONENT_TYPES[component.type]
  const Editor = EDITORS[component.type]

  return (
    <div className="comp-editor">
      <div className="comp-editor-header">
        <span className="comp-editor-title">{def?.label || component.type}</span>
        <div className="comp-editor-actions">
          <button
            className={`btn-toggle ${component.showAdvanced ? 'active' : ''}`}
            onClick={() => onToggleAdvanced(component.id)}
          >
            {component.showAdvanced ? 'Basic' : 'Advanced'}
          </button>
          <button className="btn-remove" onClick={() => onRemove(component.id)}>
            -
          </button>
        </div>
      </div>
      <div className="comp-editor-body">
        {Editor && <Editor comp={component} onUpdate={onUpdate} />}
      </div>
    </div>
  )
}
