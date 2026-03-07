import { COMPONENT_TYPES } from '../../data/componentDefaults'

export default function AddComponentModal({ onSelect, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>컴포넌트 추가</h2>
        <div className="add-component-list">
          {Object.entries(COMPONENT_TYPES).map(([type, def]) => (
            <button
              key={type}
              className="add-component-item"
              onClick={() => onSelect(type)}
            >
              <span>{def.label}</span>
              {def.initial && <span className="badge-initial">기본</span>}
            </button>
          ))}
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  )
}
