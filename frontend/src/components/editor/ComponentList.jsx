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
} from '@dnd-kit/sortable'
import SortableItem from './SortableItem'
import ComponentEditor from './ComponentEditor'

export default function ComponentList({
  components,
  onUpdate,
  onToggleAdvanced,
  onRemove,
  onReorder,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      onReorder(active.id, over.id)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={components.map(c => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="component-list">
          {components.map(comp => (
            <SortableItem key={comp.id} id={comp.id}>
              <ComponentEditor
                component={comp}
                onUpdate={onUpdate}
                onToggleAdvanced={onToggleAdvanced}
                onRemove={onRemove}
              />
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
