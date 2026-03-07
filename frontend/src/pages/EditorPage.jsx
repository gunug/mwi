import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchInvitation, saveInvitation } from '../data/api'
import { COMPONENT_TYPES } from '../data/componentDefaults'
import ComponentList from '../components/editor/ComponentList'
import AddComponentModal from '../components/editor/AddComponentModal'
import InvitationPreview from '../components/preview/InvitationPreview'
import './EditorPage.css'

export default function EditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchInvitation(id)
      .then(setData)
      .catch(() => navigate('/'))
  }, [id, navigate])

  const handleSave = useCallback(async () => {
    if (!data) return
    setSaving(true)
    await saveInvitation(id, data)
    setSaving(false)
  }, [id, data])

  function updateComponent(componentId, field, section, value) {
    setData(prev => ({
      ...prev,
      components: prev.components.map(c =>
        c.id === componentId
          ? { ...c, [section]: { ...c[section], [field]: value } }
          : c
      ),
    }))
  }

  function toggleAdvanced(componentId) {
    setData(prev => ({
      ...prev,
      components: prev.components.map(c =>
        c.id === componentId ? { ...c, showAdvanced: !c.showAdvanced } : c
      ),
    }))
  }

  function removeComponent(componentId) {
    setData(prev => {
      const comp = prev.components.find(c => c.id === componentId)
      const deleted = { ...prev.deletedComponents }
      if (comp) {
        if (!deleted[comp.type]) deleted[comp.type] = []
        deleted[comp.type].push({ basic: comp.basic, advanced: comp.advanced })
      }
      return {
        ...prev,
        components: prev.components
          .filter(c => c.id !== componentId)
          .map((c, i) => ({ ...c, order: i })),
        deletedComponents: deleted,
      }
    })
  }

  function addComponent(type) {
    setData(prev => {
      const def = COMPONENT_TYPES[type]
      const deleted = { ...prev.deletedComponents }
      let basic = { ...def.defaultBasic }
      let advanced = { ...def.defaultAdvanced }

      if (deleted[type] && deleted[type].length > 0) {
        const restored = deleted[type].pop()
        basic = restored.basic
        advanced = restored.advanced
        if (deleted[type].length === 0) delete deleted[type]
      }

      const newComp = {
        id: `${type}_${Date.now()}`,
        type,
        order: prev.components.length,
        basic,
        advanced,
        showAdvanced: false,
      }

      return {
        ...prev,
        components: [...prev.components, newComp],
        deletedComponents: deleted,
      }
    })
    setShowAddModal(false)
  }

  function reorderComponents(activeId, overId) {
    setData(prev => {
      const items = [...prev.components]
      const oldIndex = items.findIndex(c => c.id === activeId)
      const newIndex = items.findIndex(c => c.id === overId)
      const [moved] = items.splice(oldIndex, 1)
      items.splice(newIndex, 0, moved)
      return {
        ...prev,
        components: items.map((c, i) => ({ ...c, order: i })),
      }
    })
  }

  if (!data) return <div className="loading">Loading...</div>

  return (
    <div className="editor-page">
      <header className="editor-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          &larr; 목록
        </button>
        <h2>{id}</h2>
        <div className="editor-header-actions">
          <button className="btn-view" onClick={() => window.open(`/${id}`, '_blank')}>
            미리보기
          </button>
          <button className="btn-save" onClick={handleSave} disabled={saving}>
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </header>

      <div className="editor-body">
        <div className="editor-left">
          <div className="editor-left-header">
            <span>컴포넌트 편집</span>
            <button className="btn-add" onClick={() => setShowAddModal(true)}>
              +
            </button>
          </div>
          <ComponentList
            components={data.components}
            onUpdate={updateComponent}
            onToggleAdvanced={toggleAdvanced}
            onRemove={removeComponent}
            onReorder={reorderComponents}
          />
        </div>
        <div className="editor-right">
          <InvitationPreview components={data.components} />
        </div>
      </div>

      {showAddModal && (
        <AddComponentModal
          onSelect={addComponent}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}
