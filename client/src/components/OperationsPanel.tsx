import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import OperationCard from "./OperationCard";
import { operations } from "@/lib/operations";

interface OperationsPanelProps {
  onAddOperation: (type: string) => void;
}

export default function OperationsPanel({ onAddOperation }: OperationsPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOperations = Object.entries(operations)
    .filter(([_, category]) => {
      const searchLower = searchTerm.toLowerCase();
      return category.operations.some(op => 
        op.name.toLowerCase().includes(searchLower) || 
        op.description.toLowerCase().includes(searchLower)
      );
    });

  return (
    <aside className="w-full md:w-72 lg:w-80 bg-white border-r border-neutral-200 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
        <h2 className="font-semibold text-neutral-800">Operations</h2>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search operations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 w-full text-sm"
          />
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1 p-3">
        {filteredOperations.map(([categoryKey, category]) => (
          <div key={categoryKey} className="mb-6">
            <div className="flex items-center mb-3">
              <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
                {category.label}
              </h3>
              <div className="ml-2 h-px bg-neutral-200 flex-1"></div>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {category.operations
                .filter(op => 
                  searchTerm === "" || 
                  op.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  op.description.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(operation => (
                  <OperationCard 
                    key={operation.type} 
                    operation={operation}
                    onAddOperation={() => onAddOperation(operation.type)}
                  />
                ))
              }
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
