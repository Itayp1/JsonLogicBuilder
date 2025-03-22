import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { operations, findOperationByType } from "@/lib/operations";
import { useDrop } from "react-dnd";

interface LogicNodeProps {
  node: any;
  path: string[];
  onUpdate: (path: string[], value: any) => void;
  onRemove: (path: string[]) => void;
}

export default function LogicNode({ node, path, onUpdate, onRemove }: LogicNodeProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'operation',
    drop: (item: { type: string }, monitor) => {
      // Only handle drop if it's directly on this component (not a child)
      if (monitor.isOver({ shallow: true })) {
        const operationType = item.type;
        const defaultValue = operationType === 'if' ? [true, "", ""] : [];
        handleAddChild(operationType, defaultValue);
      }
      return undefined;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  }));

  if (!node) return null;

  // Get operation type from node
  const operationType = Object.keys(node)[0];
  if (!operationType) return null;

  const operation = findOperationByType(operationType);
  if (!operation) return null;

  const handleAddChild = (childType: string, defaultValue: any) => {
    const newValue = { [childType]: defaultValue };
    
    // For array values like conditions, then/else blocks
    if (Array.isArray(node[operationType])) {
      const updatedArray = [...node[operationType]];
      updatedArray.push(newValue);
      onUpdate([...path, operationType], updatedArray);
    }
  };

  const getCategoryColorClasses = () => {
    switch (operation.category) {
      case 'logic': return 'bg-blue-50 border-blue-200';
      case 'data': return 'bg-green-50 border-green-200';
      case 'numeric': return 'bg-purple-50 border-purple-200';
      case 'array': return 'bg-amber-50 border-amber-200';
      case 'string': return 'bg-rose-50 border-rose-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getIconColorClasses = () => {
    switch (operation.category) {
      case 'logic': return 'bg-blue-100 text-blue-600';
      case 'data': return 'bg-green-100 text-green-600';
      case 'numeric': return 'bg-purple-100 text-purple-600';
      case 'array': return 'bg-amber-100 text-amber-600';
      case 'string': return 'bg-rose-100 text-rose-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Render node based on type
  const renderNodeContent = () => {
    const value = node[operationType];

    switch (operationType) {
      case 'if':
        return (
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <h4 className="font-medium text-neutral-800">if-then-else</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto text-neutral-400 hover:text-neutral-600"
                onClick={() => onRemove(path)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Condition */}
            <div className="mb-3">
              <div className="text-sm font-medium text-neutral-600 mb-2">Condition:</div>
              <div 
                ref={drop}
                className={`border rounded-md p-3 ${isOver ? 'border-primary bg-primary/5' : 'border-neutral-200'}`}
              >
                {Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' ? (
                  <LogicNode 
                    node={value[0]} 
                    path={[...path, operationType, '0']} 
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                  />
                ) : (
                  <div className="flex justify-center p-2 text-neutral-500 text-sm border border-dashed border-neutral-300 rounded-md">
                    Drop a condition here
                  </div>
                )}
              </div>
            </div>
            
            {/* Then */}
            <div className="mb-3">
              <div className="text-sm font-medium text-neutral-600 mb-2">Then:</div>
              <div className="border rounded-md p-3 border-neutral-200">
                {Array.isArray(value) && value.length > 1 ? (
                  typeof value[1] === 'object' ? (
                    <LogicNode 
                      node={value[1]} 
                      path={[...path, operationType, '1']} 
                      onUpdate={onUpdate}
                      onRemove={onRemove}
                    />
                  ) : (
                    <Input 
                      value={value[1].toString()} 
                      onChange={(e) => {
                        const newValue = [...value];
                        newValue[1] = e.target.value;
                        onUpdate([...path, operationType], newValue);
                      }}
                      className="w-full"
                    />
                  )
                ) : (
                  <div className="flex justify-center p-2 text-neutral-500 text-sm border border-dashed border-neutral-300 rounded-md">
                    Drop or enter 'then' value
                  </div>
                )}
              </div>
            </div>
            
            {/* Else */}
            <div>
              <div className="text-sm font-medium text-neutral-600 mb-2">Else:</div>
              <div className="border rounded-md p-3 border-neutral-200">
                {Array.isArray(value) && value.length > 2 ? (
                  typeof value[2] === 'object' ? (
                    <LogicNode 
                      node={value[2]} 
                      path={[...path, operationType, '2']} 
                      onUpdate={onUpdate}
                      onRemove={onRemove}
                    />
                  ) : (
                    <Input 
                      value={value[2].toString()} 
                      onChange={(e) => {
                        const newValue = [...value];
                        newValue[2] = e.target.value;
                        onUpdate([...path, operationType], newValue);
                      }}
                      className="w-full"
                    />
                  )
                ) : (
                  <div className="flex justify-center p-2 text-neutral-500 text-sm border border-dashed border-neutral-300 rounded-md">
                    Drop or enter 'else' value
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'var':
        return (
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h4 className="font-medium text-neutral-800">Variable</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto text-neutral-400 hover:text-neutral-600"
                onClick={() => onRemove(path)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Input 
              value={typeof value === 'string' ? value : ''} 
              onChange={(e) => onUpdate([...path, operationType], e.target.value)}
              placeholder="Variable name (e.g. age, user.name)"
              className="mt-1 block w-full text-sm"
            />
          </div>
        );

      case '+':
      case '-':
      case '*':
      case '/':
      case '%':
      case '>':
      case '>=':
      case '<':
      case '<=':
      case '==':
      case '===':
      case '!=':
      case '!==':
        return (
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h4 className="font-medium text-neutral-800">
                {operation.name}
              </h4>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto text-neutral-400 hover:text-neutral-600"
                onClick={() => onRemove(path)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            {Array.isArray(value) && (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    ref={drop}
                    className={`border rounded-md p-2 ${isOver ? 'border-primary bg-primary/5' : 'border-neutral-200'}`}
                  >
                    {value.length > 0 && typeof value[0] === 'object' ? (
                      <LogicNode 
                        node={value[0]} 
                        path={[...path, operationType, '0']} 
                        onUpdate={onUpdate}
                        onRemove={onRemove}
                      />
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Value 1:</span>
                        <Input 
                          value={value[0]?.toString() || ''} 
                          onChange={(e) => {
                            const newValue = [...value];
                            // Try to convert to number if possible
                            const parsedValue = !isNaN(parseFloat(e.target.value)) 
                              ? parseFloat(e.target.value) 
                              : e.target.value;
                            newValue[0] = parsedValue;
                            onUpdate([...path, operationType], newValue);
                          }}
                          className="w-40 text-sm"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div 
                    className="border rounded-md p-2 border-neutral-200"
                  >
                    {value.length > 1 && typeof value[1] === 'object' ? (
                      <LogicNode 
                        node={value[1]} 
                        path={[...path, operationType, '1']} 
                        onUpdate={onUpdate}
                        onRemove={onRemove}
                      />
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Value 2:</span>
                        <Input 
                          value={value[1]?.toString() || ''} 
                          onChange={(e) => {
                            const newValue = [...value];
                            // Try to convert to number if possible
                            const parsedValue = !isNaN(parseFloat(e.target.value)) 
                              ? parseFloat(e.target.value) 
                              : e.target.value;
                            newValue[1] = parsedValue;
                            onUpdate([...path, operationType], newValue);
                          }}
                          className="w-40 text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'and':
      case 'or':
      case 'min':
      case 'max':
      case 'cat':
      case 'merge':
        return (
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h4 className="font-medium text-neutral-800">{operation.name}</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto text-neutral-400 hover:text-neutral-600"
                onClick={() => onRemove(path)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2 mt-1">
              {Array.isArray(value) && value.map((item, index) => (
                <div key={index} className="border rounded-md p-2 border-neutral-200">
                  {typeof item === 'object' ? (
                    <LogicNode 
                      node={item} 
                      path={[...path, operationType, index.toString()]} 
                      onUpdate={onUpdate}
                      onRemove={onRemove}
                    />
                  ) : (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Value {index + 1}:</span>
                      <Input 
                        value={item?.toString() || ''} 
                        onChange={(e) => {
                          const newValue = [...value];
                          // Try to convert to number if possible
                          const parsedValue = !isNaN(parseFloat(e.target.value)) 
                            ? parseFloat(e.target.value) 
                            : e.target.value;
                          newValue[index] = parsedValue;
                          onUpdate([...path, operationType], newValue);
                        }}
                        className="w-40 text-sm"
                      />
                    </div>
                  )}
                </div>
              ))}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2" 
                onClick={() => {
                  const newValue = [...(Array.isArray(value) ? value : []), ""];
                  onUpdate([...path, operationType], newValue);
                }}
              >
                + Add Value
              </Button>
            </div>
          </div>
        );

      case 'map':
      case 'filter':
      case 'reduce':
        return (
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h4 className="font-medium text-neutral-800">{operation.name}</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto text-neutral-400 hover:text-neutral-600"
                onClick={() => onRemove(path)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            {Array.isArray(value) && (
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-neutral-600 mb-1">Array:</div>
                  <div className="border rounded-md p-2 border-neutral-200">
                    {value.length > 0 && typeof value[0] === 'object' ? (
                      <LogicNode 
                        node={value[0]} 
                        path={[...path, operationType, '0']} 
                        onUpdate={onUpdate}
                        onRemove={onRemove}
                      />
                    ) : (
                      <Input 
                        value={value[0]?.toString() || ''} 
                        onChange={(e) => {
                          const newValue = [...value];
                          newValue[0] = e.target.value;
                          onUpdate([...path, operationType], newValue);
                        }}
                        className="w-full text-sm"
                        placeholder="Array variable (e.g. items)"
                      />
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-neutral-600 mb-1">Logic:</div>
                  <div className="border rounded-md p-2 border-neutral-200">
                    {value.length > 1 && typeof value[1] === 'object' ? (
                      <LogicNode 
                        node={value[1]} 
                        path={[...path, operationType, '1']} 
                        onUpdate={onUpdate}
                        onRemove={onRemove}
                      />
                    ) : (
                      <div className="flex justify-center p-2 text-neutral-500 text-sm border border-dashed border-neutral-300 rounded-md">
                        Drop logic here
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'length':
        return (
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h4 className="font-medium text-neutral-800">
                {operation.name}
                <span className="ml-2 bg-yellow-100 text-yellow-700 text-xs px-1.5 py-0.5 rounded">Custom</span>
              </h4>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto text-neutral-400 hover:text-neutral-600"
                onClick={() => onRemove(path)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="border rounded-md p-2 border-neutral-200">
              {Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' ? (
                <LogicNode 
                  node={value[0]} 
                  path={[...path, operationType, '0']} 
                  onUpdate={onUpdate}
                  onRemove={onRemove}
                />
              ) : (
                <Input 
                  value={value[0]?.toString() || ''} 
                  onChange={(e) => {
                    const newValue = [...(Array.isArray(value) ? value : [])];
                    // Try to convert to number if possible
                    const parsedValue = !isNaN(parseFloat(e.target.value)) 
                      ? parseFloat(e.target.value) 
                      : e.target.value;
                    newValue[0] = parsedValue;
                    onUpdate([...path, operationType], newValue);
                  }}
                  className="w-full text-sm"
                  placeholder="Enter a number"
                />
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h4 className="font-medium text-neutral-800">{operationType}</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto text-neutral-400 hover:text-neutral-600"
                onClick={() => onRemove(path)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-neutral-500">
              {JSON.stringify(value)}
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`${getCategoryColorClasses()} rounded-md p-4`}>
      <div className="flex items-start">
        <div className={`${getIconColorClasses()} rounded p-1 mr-3 mt-1`}>
          <i className={`ri-${operation.icon}`}></i>
        </div>
        {renderNodeContent()}
      </div>
    </div>
  );
}
