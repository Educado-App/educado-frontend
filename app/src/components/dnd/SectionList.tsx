import { useState } from 'react';

// DND-KIT
import {
  DndContext,
  closestCenter,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";

// Components
import { SortableItem } from './@dnd/SortableItem';
import { Item } from './@dnd/Item';

interface Props {
  sections: Array<string>
  addOnSubmitSubscriber: Function
}


export const SectionList = ({ sections, addOnSubmitSubscriber }: Props) => {
  // States
  const [activeId, setActiveId] = useState(null);
  const [items, setItems] = useState(sections);
  const [savedSID, setSavedSID] = useState<string>("");

  // Setup of pointer and keyboard sensor
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // handle start of dragging
  const handleDragStart = (event: any) => {
    const { active } = event;
    setActiveId(active.id);
  }

  // handle end of dragging
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className='w-full'>
      <DndContext
        modifiers={[restrictToVerticalAxis]}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      
      >
        <SortableContext items={items.map(item => item)} strategy={verticalListSortingStrategy}>
          {items.map((item, key: React.Key) => <SortableItem key={key} sid={item} addOnSubmitSubscriber={addOnSubmitSubscriber} savedSID={savedSID} setSavedSID={setSavedSID} />)}
        </SortableContext>

       
        <DragOverlay className='w-full' >
          {activeId ? <Item id={activeId} /> : null}
        </DragOverlay>
        
      </DndContext>
    </div>
  );
}

