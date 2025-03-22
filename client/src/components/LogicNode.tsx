import React from 'react';
import { useDrop } from 'react-dnd';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Trash2 } from 'lucide-react';
import { findOperationByType } from '@/lib/operations';

interface LogicNodeProps {
  node: any;
  path: string[];
  onUpdate: (path: string[], value: any) => void;
  onRemove: (path: string[]) => void;
}

export default function LogicNode({ node, path, onUpdate, onRemove }: LogicNodeProps) {
  // Early check to avoid React hooks errors
  if (!node) return null;

  // Get operation type from node
  const operationType = Object.keys(node)[0];
  if (!operationType) return null;

  const operation = findOperationByType(operationType);
  if (!operation) return null;

  // Calculate the nesting level to add appropriate visual cues
  const nestingLevel = path.length;

  // Main drop zone for the node
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

  // Drop zones for different value indices
  const [{ isOver: isOver1 }, drop1] = useDrop(() => ({
    accept: 'operation',
    drop: (item: { type: string }) => {
      const operationType = item.type;
      const defaultValue = operationType === 'if' ? [true, "", ""] : [];
      handleAddChild(operationType, defaultValue, 0);
      return undefined;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  }));

  const [{ isOver: isOver2 }, drop2] = useDrop(() => ({
    accept: 'operation',
    drop: (item: { type: string }) => {
      const operationType = item.type;
      const defaultValue = operationType === 'if' ? [true, "", ""] : [];
      handleAddChild(operationType, defaultValue, 1);
      return undefined;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  }));

  const [{ isOver: isOver3 }, drop3] = useDrop(() => ({
    accept: 'operation',
    drop: (item: { type: string }) => {
      const operationType = item.type;
      const defaultValue = operationType === 'if' ? [true, "", ""] : [];
      handleAddChild(operationType, defaultValue, 2);
      return undefined;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  }));

  const handleAddChild = (childType: string, defaultValue: any, specificIndex?: number) => {
    const newValue = { [childType]: defaultValue };

    // For array values like conditions, then/else blocks
    if (Array.isArray(node[operationType])) {
      const updatedArray = [...node[operationType]];

      // If a specific index is provided, replace that position with the new operation
      if (specificIndex !== undefined && specificIndex < updatedArray.length) {
        updatedArray[specificIndex] = newValue;
      } else {
        // Otherwise append to the array
        updatedArray.push(newValue);
      }

      onUpdate([...path, operationType], updatedArray);
    }
  };

  const getCategoryColorClasses = () => {
    // Adjust background opacity based on nesting level for better visual hierarchy
    const getOpacity = () => {
      if (nestingLevel === 0) return 'bg-opacity-100 border-opacity-100';
      // Use predefined opacity classes to avoid Tailwind purge issues
      switch (nestingLevel) {
        case 1: return 'bg-opacity-85 border-opacity-85';
        case 2: return 'bg-opacity-70 border-opacity-70';
        case 3: return 'bg-opacity-55 border-opacity-55';
        default: return 'bg-opacity-50 border-opacity-50';
      }
    };

    // Use predefined colors with opacity based on nesting level
    switch (operation.category) {
      case 'logic': return `bg-blue-50 border border-blue-200 ${getOpacity()}`;
      case 'data': return `bg-green-50 border border-green-200 ${getOpacity()}`;
      case 'numeric': return `bg-purple-50 border border-purple-200 ${getOpacity()}`;
      case 'array': return `bg-amber-50 border border-amber-200 ${getOpacity()}`;
      case 'string': return `bg-rose-50 border border-rose-200 ${getOpacity()}`;
      default: return `bg-gray-50 border border-gray-200 ${getOpacity()}`;
    }
  };

  const getIconColorClasses = () => {
    // Make icons more prominent and consistently visible across nesting levels
    switch (operation.category) {
      case 'logic': return 'bg-blue-100 text-blue-700 shadow-sm';
      case 'data': return 'bg-green-100 text-green-700 shadow-sm';
      case 'numeric': return 'bg-purple-100 text-purple-700 shadow-sm';
      case 'array': return 'bg-amber-100 text-amber-700 shadow-sm';
      case 'string': return 'bg-rose-100 text-rose-700 shadow-sm';
      default: return 'bg-gray-100 text-gray-700 shadow-sm';
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
              <div className="border rounded-md p-3 border-neutral-200 relative flex-1">
                <div className="absolute -top-3 left-2 bg-white px-1 text-xs text-neutral-500">Condition</div>
                {Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' ? (
                  <LogicNode 
                    node={value[0]} 
                    path={[...path, operationType, '0']} 
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                  />
                ) : (
                  <div 
                    ref={drop1}
                    className={`flex justify-center p-4 text-neutral-500 text-sm border-2 border-dashed ${isOver1 ? 'border-primary bg-primary/5' : 'border-neutral-300'} rounded-md cursor-pointer`}
                  >
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <div className="h-10 w-10 rounded-full border-2 border-dashed border-neutral-300 flex items-center justify-center">
                          <span className="text-lg">+</span>
                        </div>
                      </div>
                      <p>Drag and drop an operation here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Then */}
            <div className="mb-3">
              <div className="text-sm font-medium text-neutral-600 mb-2">Then:</div>
              <div className="border rounded-md p-3 border-neutral-200 relative flex-1">
                <div className="absolute -top-3 left-2 bg-white px-1 text-xs text-neutral-500">Then</div>
                {Array.isArray(value) && value.length > 1 ? (
                  typeof value[1] === 'object' ? (
                    <LogicNode 
                      node={value[1]} 
                      path={[...path, operationType, '1']} 
                      onUpdate={onUpdate}
                      onRemove={onRemove}
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <Input 
                        value={value[1]?.toString() || ''} 
                        onChange={(e) => {
                          const newValue = [...value];
                          newValue[1] = e.target.value;
                          onUpdate([...path, operationType], newValue);
                        }}
                        className="flex-1"
                      />
                      <div 
                        ref={drop2}
                        className={`h-6 w-6 rounded-full flex items-center justify-center border ${isOver2 ? 'border-primary bg-primary/10' : 'border-neutral-300'} cursor-pointer`}
                        title="Drop an operation here"
                      >
                        <span className="text-xs">+</span>
                      </div>
                    </div>
                  )
                ) : (
                  <div 
                    ref={drop2}
                    className={`flex justify-center p-4 text-neutral-500 text-sm border-2 border-dashed ${isOver2 ? 'border-primary bg-primary/5' : 'border-neutral-300'} rounded-md cursor-pointer`}
                  >
                    <div className="text-center">
                      <p>Drop or enter 'then' value</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Else */}
            <div>
              <div className="text-sm font-medium text-neutral-600 mb-2">Else:</div>
              <div className="border rounded-md p-3 border-neutral-200 relative flex-1">
                <div className="absolute -top-3 left-2 bg-white px-1 text-xs text-neutral-500">Else</div>
                {Array.isArray(value) && value.length > 2 ? (
                  typeof value[2] === 'object' ? (
                    <LogicNode 
                      node={value[2]} 
                      path={[...path, operationType, '2']} 
                      onUpdate={onUpdate}
                      onRemove={onRemove}
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <Input 
                        value={value[2]?.toString() || ''} 
                        onChange={(e) => {
                          const newValue = [...value];
                          newValue[2] = e.target.value;
                          onUpdate([...path, operationType], newValue);
                        }}
                        className="flex-1"
                      />
                      <div 
                        ref={drop3}
                        className={`h-6 w-6 rounded-full flex items-center justify-center border ${isOver3 ? 'border-primary bg-primary/10' : 'border-neutral-300'} cursor-pointer`}
                        title="Drop an operation here"
                      >
                        <span className="text-xs">+</span>
                      </div>
                    </div>
                  )
                ) : (
                  <div 
                    ref={drop3}
                    className={`flex justify-center p-4 text-neutral-500 text-sm border-2 border-dashed ${isOver3 ? 'border-primary bg-primary/5' : 'border-neutral-300'} rounded-md cursor-pointer`}
                  >
                    <div className="text-center">
                      <p>Drop or enter 'else' value</p>
                    </div>
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
          <div className="flex-1 space-y-4">
            <div className="flex items-center">
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
              <div className="flex flex-col gap-3 mt-4 w-full">
                <div className="border rounded-md p-2 border-neutral-200 relative flex-1">
                  <div className="absolute -top-3 left-2 bg-white px-1 text-xs text-neutral-500">Value 1</div>
                  {value.length > 0 && typeof value[0] === 'object' ? (
                    <LogicNode 
                      node={value[0]} 
                      path={[...path, operationType, '0']} 
                      onUpdate={onUpdate}
                      onRemove={onRemove}
                    />
                  ) : (
                    <div 
                      ref={drop1}
                      className={`${isOver1 ? 'bg-primary/5 border-primary' : ''} rounded-md transition-colors duration-150`}
                    >
                      <div className="flex flex-col py-2">
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
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
                            className="w-full text-sm"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="flex-shrink-0 h-8 sm:w-auto w-full mt-1 sm:mt-0"
                            title="Add operation as value"
                            onClick={() => {
                              // Replace with a placeholder operation
                              const newValue = [...value];
                              newValue[0] = { "var": "" };
                              onUpdate([...path, operationType], newValue);
                            }}
                          >
                            <span className="text-xs">+ Add operation</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border rounded-md p-2 border-neutral-200 relative flex-1">
                  <div className="absolute -top-3 left-2 bg-white px-1 text-xs text-neutral-500">Value 2</div>
                  {value.length > 1 && typeof value[1] === 'object' ? (
                    <LogicNode 
                      node={value[1]} 
                      path={[...path, operationType, '1']} 
                      onUpdate={onUpdate}
                      onRemove={onRemove}
                    />
                  ) : (
                    <div 
                      ref={drop2}
                      className={`${isOver2 ? 'bg-primary/5 border-primary' : ''} rounded-md transition-colors duration-150`}
                    >
                      <div className="flex flex-col py-2">
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
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
                            className="w-full text-sm"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="flex-shrink-0 h-8 sm:w-auto w-full mt-1 sm:mt-0"
                            title="Add operation as value"
                            onClick={() => {
                              // Replace with a placeholder operation
                              const newValue = [...value];
                              newValue[1] = { "var": "" };
                              onUpdate([...path, operationType], newValue);
                            }}
                          >
                            <span className="text-xs">+ Add operation</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
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

            <div className="flex flex-col gap-3 mt-4 w-full">
              {Array.isArray(value) && value.map((item, index) => (
                <div key={index} className="border rounded-md p-2 border-neutral-200 flex-1">
                  {typeof item === 'object' ? (
                    <LogicNode 
                      node={item} 
                      path={[...path, operationType, index.toString()]} 
                      onUpdate={onUpdate}
                      onRemove={onRemove}
                    />
                  ) : (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <span className="text-sm font-medium mb-1 sm:mb-0 sm:mr-2">Value {index + 1}:</span>
                      <div className="flex flex-col sm:flex-row gap-2 w-full">
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
                          className="flex-1 text-sm"
                        />
                        <Button
                          type="button" 
                          variant="outline"
                          size="sm"
                          className="h-8 sm:w-auto w-full mt-1 sm:mt-0"
                          title="Replace with operation"
                          onClick={() => {
                            // Create a placeholder operation to replace this value
                            const newValue = [...value];
                            newValue[index] = { "var": "" };
                            onUpdate([...path, operationType], newValue);
                          }}
                        >
                          <span className="text-xs">+ Add operation</span>
                        </Button>
                      </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <div>
                  <div className="text-sm font-medium text-neutral-600 mb-1">Array:</div>
                  <div className="border rounded-md p-2 border-neutral-200 flex-1">
                    {value.length > 0 && typeof value[0] === 'object' ? (
                      <LogicNode 
                        node={value[0]} 
                        path={[...path, operationType, '0']} 
                        onUpdate={onUpdate}
                        onRemove={onRemove}
                      />
                    ) : (
                      <div 
                        ref={drop1}
                        className={`${isOver1 ? 'bg-primary/5 border-primary' : ''} rounded-md transition-colors duration-150`}
                      >
                        <div className="flex flex-col py-2">
                          <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <Input 
                              value={value[0]?.toString() || ''} 
                              onChange={(e) => {
                                const newValue = [...value];
                                newValue[0] = e.target.value;
                                onUpdate([...path, operationType], newValue);
                              }}
                              className="flex-1 text-sm"
                              placeholder="Array variable (e.g. items)"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="flex-shrink-0 h-8 sm:w-auto w-full mt-1 sm:mt-0"
                              title="Add operation as value"
                              onClick={() => {
                                // Replace with a placeholder operation
                                const newValue = [...value];
                                newValue[0] = { "var": "" };
                                onUpdate([...path, operationType], newValue);
                              }}
                            >
                              <span className="text-xs">+ Add operation</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-neutral-600 mb-1">Logic:</div>
                  <div className="border rounded-md p-2 border-neutral-200 flex-1">
                    {value.length > 1 && typeof value[1] === 'object' ? (
                      <LogicNode 
                        node={value[1]} 
                        path={[...path, operationType, '1']} 
                        onUpdate={onUpdate}
                        onRemove={onRemove}
                      />
                    ) : (
                      <div 
                        ref={drop2}
                        className={`flex justify-center p-4 text-neutral-500 text-sm border-2 border-dashed ${isOver2 ? 'border-primary bg-primary/5' : 'border-neutral-300'} rounded-md cursor-pointer`}
                      >
                        <div className="text-center">
                          <p>Drop logic here</p>
                        </div>
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

            <div className="border rounded-md p-2 border-neutral-200 flex-1">
              {Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' ? (
                <LogicNode 
                  node={value[0]} 
                  path={[...path, operationType, '0']} 
                  onUpdate={onUpdate}
                  onRemove={onRemove}
                />
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 w-full">
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
                    className="flex-1 text-sm"
                    placeholder="Enter a number"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0 h-8 sm:w-auto w-full mt-1 sm:mt-0"
                    title="Add operation as value"
                    onClick={() => {
                      // Replace with a placeholder operation
                      const newValue = [...(Array.isArray(value) ? value : [])];
                      newValue[0] = { "var": "" };
                      onUpdate([...path, operationType], newValue);
                    }}
                  >
                    <span className="text-xs">+ Add operation</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      default:
        // For our custom operations and other operations that take array arguments
        return (
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <div>
                <h4 className="font-medium text-neutral-800 flex items-center">
                  {operation ? operation.name : operationType}
                  {operation?.isCustom && (
                    <span className="ml-2 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                      Custom
                    </span>
                  )}
                </h4>
                <p className="text-xs text-neutral-500 mt-1">{operation?.description || 'Apply operation to values'}</p>
              </div>
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
              <div className="flex flex-col gap-3 mt-4 w-full">
                <div className="border rounded-md p-3 border-neutral-200 flex-1">
                  <div className="font-medium text-sm mb-2">Arguments:</div>
                  {value.map((item, index) => (
                    <div key={index} className="mb-2 border-b pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-neutral-500 mb-1">Argument {index + 1}</div>
                      </div>
                      {typeof item === 'object' ? (
                        <LogicNode 
                          node={item} 
                          path={[...path, operationType, index.toString()]} 
                          onUpdate={onUpdate}
                          onRemove={onRemove}
                        />
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
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
                            className="flex-1 text-sm"
                          />
                          <Button
                            type="button" 
                            variant="outline"
                            size="sm"
                            className="flex-shrink-0 h-8 sm:w-auto w-full mt-1 sm:mt-0"
                            title="Add operation as value"
                            onClick={() => {
                              // Replace with a placeholder operation
                              const newValue = [...value];
                              newValue[index] = { "var": "" };
                              onUpdate([...path, operationType], newValue);
                            }}
                          >
                            <span className="text-xs">+ Add operation</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Button to add more arguments if needed */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 w-full text-neutral-600"
                    onClick={() => {
                      const newValue = [...value, ""];
                      onUpdate([...path, operationType], newValue);
                    }}
                  >
                    + Add Argument
                  </Button>
                </div>
              </div>
            )}

            {/* For non-array values, display the JSON */}
            {!Array.isArray(value) && (
              <div className="text-sm text-neutral-500 p-2 bg-neutral-50 rounded-md">
                {JSON.stringify(value)}
              </div>
            )}
          </div>
        );
    }
  };

  // Calculate box shadow based on nesting level for better visual hierarchy
  const getShadowClass = () => {
    // Only add shadow for nested nodes
    if (nestingLevel > 0) {
      return 'shadow-sm';
    }
    return '';
  };

  // Add a left border based on nesting level
  const getBorderClass = () => {
    if (nestingLevel === 0) return '';

    // Use predefined border classes based on nesting level
    switch (nestingLevel) {
      case 1: return 'border-l-4 border-l-blue-400';
      case 2: return 'border-l-4 border-l-purple-400';
      case 3: return 'border-l-4 border-l-amber-400';
      case 4: return 'border-l-4 border-l-green-400';
      default: return 'border-l-4 border-l-rose-400';
    }
  };

  // Increase padding based on nesting level for better readability
  const getPaddingClass = () => {
    return nestingLevel > 0 ? 'p-4' : 'p-5';
  };

  // Increase margin as nesting gets deeper
  const getMarginClass = () =>{
    if (nestingLevel === 0) return '';

    //    // Use predefined margin classes
        switch (Math.min(nestingLevel, 4)) {
      case 1: return 'my-2';
      case 2: return 'my-3';
      case 3: return 'my-4';
      case 4: 
      default: return 'my-5';
    }
  };

  return (
    <div 
      className={`
        ${getCategoryColorClasses()} 
        ${getShadowClass()}        ${getBorderClass()}
        ${getPaddingClass()}
        ${getMarginClass()}
        rounded-md
        w-full
        break-words
        transition-all
        duration-200
      `}
      style={{
        width: `${Math.max(300 + nestingLevel * 50, 300)}px`
      }}
    >
      <div className="flex items-start relative gap-2">
        <div className={`${getIconColorClasses()} rounded p-1.5 mr-3 mt-1`}>
          <i className={`ri-${operation.icon}`}></i>
        </div>
        {renderNodeContent()}
      </div>

      {/* Add a nesting indicator for debug purposes */}
      {nestingLevel > 0 && (
        <div className="mt-1 text-xs text-neutral-400 text-right">
          Nesting level: {nestingLevel}
        </div>
      )}

      {/* Add immediate visual feedback for drag operations */}
      <div className="operation-drop-indicator" style={{ opacity: isOver ? 1 : 0 }}>
        <div className="h-1 bg-blue-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}