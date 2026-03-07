import { useState } from 'react'

export default function CopyPasteInput({
  label,
  value,
  onChange,
  type = 'text',
  multiline = false,
}) {
  const [showCopied, setShowCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(value || '')
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 1500)
  }

  async function handlePaste() {
    const text = await navigator.clipboard.readText()
    onChange(text)
  }

  const inputProps = {
    value: value || '',
    onChange: e => onChange(e.target.value),
    className: 'cp-input-field',
  }

  return (
    <div className="cp-input">
      <label className="cp-label">{label}</label>
      <div className="cp-input-row">
        {multiline ? (
          <textarea {...inputProps} rows={3} />
        ) : type === 'checkbox' ? (
          <input
            type="checkbox"
            checked={!!value}
            onChange={e => onChange(e.target.checked)}
            className="cp-checkbox"
          />
        ) : (
          <input type={type} {...inputProps} />
        )}
        {type !== 'checkbox' && (
          <div className="cp-buttons">
            <button
              type="button"
              className="cp-btn"
              onClick={handleCopy}
              title="복사"
            >
              {showCopied ? 'V' : 'C'}
            </button>
            <button
              type="button"
              className="cp-btn"
              onClick={handlePaste}
              title="붙여넣기"
            >
              P
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
