import React, { useState } from 'react';
import { Button } from './ui/button';

const operations = [
  { name: 'Addition', icon: 'add-line', type: '+' },
  { name: 'Subtraction', icon: 'subtract-line', type: '-' },
  { name: 'Multiplication', icon: 'multiply-line', type: '*' },
  { name: 'Division', icon: 'divide-line', type: '/' },
  { name: 'Equal', icon: 'equals-line', type: '=' },
  { name: 'Not Equal', icon: 'not-equal-line', type: '!=' },
];

function LogicNode() {
  const [value, setValue] = useState([]);
  const [operation, setOperation] = useState(null);

  const handleOperationSelect = (op) => {
    setOperation(op);
  };

  const handleValueChange = (index, newValue) => {
    const newValues = [...value];
    newValues[index] = newValue;
    setValue(newValues);
  };

  const addValue = () => {
    setValue([...value, '']);
  };

  const getIconColorClasses = () => {
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="p-4 rounded-md border border-neutral-200 min-w-[300px]">
      <div className="flex items-start gap-2">
        {operation && (
          <div className={`${getIconColorClasses()} rounded p-1.5 mr-3 mt-1`}>
            <i className={`ri-${operation.icon}`}></i>
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <h4 className="font-medium text-neutral-800">
              {operation ? operation.name : 'Select Operation'}
            </h4>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {operations.map((op) => (
              <Button
                key={op.type}
                variant="outline"
                onClick={() => handleOperationSelect(op)}
                className={operation?.type === op.type ? 'ring-2 ring-blue-500' : ''}
              >
                <i className={`ri-${op.icon} mr-2`}></i>
                {op.name}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            {value.map((val, index) => (
              <div key={index} className="border rounded-md p-2 border-neutral-200">
                <input
                  type="text"
                  value={val}
                  onChange={(e) => handleValueChange(index, e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter value..."
                />
              </div>
            ))}
          </div>

          <Button onClick={addValue} className="mt-4">
            Add Value
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LogicNode;