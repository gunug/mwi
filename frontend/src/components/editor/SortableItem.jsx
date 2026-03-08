import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function SortableItem({ id, children, disabled }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...(disabled ? {} : { ...attributes, ...listeners })}>
      {typeof children === 'function'
        ? children({ dragHandleProps: disabled ? null : { ...attributes, ...listeners } })
        : children}
    </div>
  )
}
