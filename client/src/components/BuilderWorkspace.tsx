import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LogicNode from "./LogicNode";
import { useDrop } from "react-dnd";

interface BuilderWorkspaceProps {
  jsonLogic: any;
  onUpdateOperation: (path: string[], update: any) => void;
  onRemoveOperation: (path: string[]) => void;
  onClearAll: () => void;
  onValidate: () => boolean;
}

export default function BuilderWorkspace({
  jsonLogic,
  onUpdateOperation,
  onRemoveOperation,
  onClearAll,
  onValidate
}: BuilderWorkspaceProps) {
  const { toast } = useToast();
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    setIsEmpty(Object.keys(jsonLogic || {}).length === 0);
  }, [jsonLogic]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'operation',
    drop: (item: { type: string }) => {
      onUpdateOperation([], { [item.type]: item.type === 'if' ? [true, "", ""] : [] });
      return undefined;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleValidate = () => {
    const isValid = onValidate();
    toast({
      title: isValid ? "Validation Successful" : "Validation Failed",
      description: isValid ? "Your JSON Logic is valid." : "Your JSON Logic has errors.",
      variant: isValid ? "default" : "destructive",
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-neutral-50 overflow-auto">
      <div className="border-b border-neutral-200 bg-white p-4 flex justify-between items-center">
        <h2 className="font-semibold text-neutral-800">Builder Workspace</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearAll}
            disabled={isEmpty}
          >
            <Trash2 className="h-4 w-4 mr-1.5" /> Clear All
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleValidate}
            disabled={isEmpty}
          >
            <AlertTriangle className="h-4 w-4 mr-1.5" /> Validate
          </Button>
        </div>
      </div>
      
      <div className="p-6 flex-1 overflow-auto">
        {isEmpty ? (
          <div 
            ref={drop}
            className={`dropzone border-2 border-dashed border-neutral-300 rounded-lg p-8 bg-white min-h-[60vh] flex flex-col items-center justify-center ${
              isOver ? "border-primary bg-primary/5" : ""
            }`}
          >
            <div className="text-center">
              <svg 
                className="mx-auto w-24 h-24 text-neutral-300 mb-4" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <h3 className="text-lg font-medium text-neutral-700 mb-2">Start Building Your Logic</h3>
              <p className="text-neutral-500 mb-4 max-w-md">Drag operations from the left panel and drop them here. You can nest operations to create complex logic.</p>
              <div className="flex flex-wrap justify-center gap-3 max-w-md mx-auto">
                <div className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">if-then-else</div>
                <div className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">var</div>
                <div className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full">+, -, *, /</div>
                <div className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded-full">map, filter</div>
                <div className="bg-rose-50 text-rose-700 text-xs px-2 py-1 rounded-full">cat, substr</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-0 border border-neutral-200 rounded-lg bg-white p-6 shadow-sm overflow-auto">
            <div className="min-w-[600px]">
              <LogicNode 
                node={jsonLogic} 
                path={[]} 
                onUpdate={onUpdateOperation}
                onRemove={onRemoveOperation}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
