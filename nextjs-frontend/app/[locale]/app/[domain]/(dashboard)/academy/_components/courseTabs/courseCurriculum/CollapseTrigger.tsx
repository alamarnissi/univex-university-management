import { CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CollapseTrigger = ({id_item, isCollapsed, onClickCollapse}: {id_item: string, isCollapsed: boolean, onClickCollapse: () => void}) => {
  return (
    <CollapsibleTrigger key={id_item} onClick={() => {
        onClickCollapse();
    }}
    className='text-black dark:text-white'>
        {isCollapsed ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
    </CollapsibleTrigger>
  )
}

export default CollapseTrigger