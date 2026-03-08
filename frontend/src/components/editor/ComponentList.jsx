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
import { REORDER_COLORS } from '../../data/reorderColors'

export default function ComponentList({
  components,
  onUpdate,
  onRemove,
  onReorder,
  reorderMode,
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
          {components.map((comp, index) => (
            <SortableItem key={comp.id} id={comp.id} disabled={!reorderMode}>
              {({ dragHandleProps }) => (
                <ComponentEditor
                  component={comp}
                  onUpdate={onUpdate}
                  onRemove={onRemove}
                  collapsed={reorderMode}
                  color={reorderMode ? REORDER_COLORS[index % REORDER_COLORS.length] : null}
                  dragHandleProps={dragHandleProps}
                />
              )}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
