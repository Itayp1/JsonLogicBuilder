import { useDrag } from 'react-dnd';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Operation } from '@/lib/operations';

interface OperationCardProps {
  operation: Operation;
  onAddOperation: () => void;
}

export default function OperationCard({ operation, onAddOperation }: OperationCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'operation',
    item: { type: operation.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const getBgColorClass = () => {
    switch (operation.category) {
      case 'logic': return 'bg-blue-50 border-blue-200';
      case 'data': return 'bg-green-50 border-green-200';
      case 'numeric': return 'bg-purple-50 border-purple-200';
      case 'array': return 'bg-amber-50 border-amber-200';
      case 'string': return 'bg-rose-50 border-rose-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getIconBgClass = () => {
    switch (operation.category) {
      case 'logic': return 'bg-blue-100 text-blue-600';
      case 'data': return 'bg-green-100 text-green-600';
      case 'numeric': return 'bg-purple-100 text-purple-600';
      case 'array': return 'bg-amber-100 text-amber-600';
      case 'string': return 'bg-rose-100 text-rose-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            ref={drag}
            className={`operation-card ${getBgColorClass()} rounded-md p-3 cursor-grab active:cursor-grabbing ${
              isDragging ? 'opacity-50' : ''
            }`}
            draggable
            onClick={onAddOperation}
          >
            <div className="flex items-center">
              <div className={`${getIconBgClass()} rounded p-1 mr-2`}>
                <i className={`ri-${operation.icon}`}></i>
              </div>
              <div>
                <h4 className="font-medium text-neutral-800">{operation.name}</h4>
                <p className="text-xs text-neutral-500">{operation.description}</p>
              </div>
              {operation.isCustom && (
                <span className="ml-auto bg-yellow-100 text-yellow-700 text-xs px-1.5 py-0.5 rounded">Custom</span>
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{operation.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
