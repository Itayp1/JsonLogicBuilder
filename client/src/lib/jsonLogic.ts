import jsonLogic from "json-logic-js";

// Add custom "length" operation
jsonLogic.add_operation("length", (number: number) => {
  // Convert to string and get the length
  return number.toString().length;
});

export { jsonLogic };

export function validateJsonLogic(logic: any): boolean {
  try {
    if (typeof logic !== 'object' || logic === null) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

export function applyJsonLogic(logic: any, data: any): any {
  // Basic implementation of JSON Logic operations
  if (typeof logic !== 'object' || logic === null) {
    return logic;
  }

  const operators = {
    '+': (a: number[], b: number[]) => a.reduce((x, y) => x + y, 0) + b.reduce((x, y) => x + y, 0),
    '*': (a: number, b: number) => a * b,
    '==': (a: any, b: any) => a === b,
    'var': (a: string) => {
      return data[a];
    },
    'length': (a: any) => String(a).length,
    'max': (arr: number[]) => Math.max(...arr)
  };

  const operator = Object.keys(logic)[0];
  const values = logic[operator];

  if (operator in operators) {
    return operators[operator](...(Array.isArray(values) ? values : [values]));
  }

  return null;
}