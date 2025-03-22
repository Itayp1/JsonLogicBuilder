import jsonLogic from "json-logic-js";

// Add custom "length" operation
jsonLogic.add_operation("length", (number: number) => {
  // Convert to string and get the length
  return number.toString().length;
});

export { jsonLogic };

// Function to recursively check if JSON logic is valid
export function validateJsonLogic(logic: any): boolean {
  // If it's not an object, it's a direct value (valid)
  if (typeof logic !== 'object' || logic === null) {
    return true;
  }
  
  // If it's an array, validate each element
  if (Array.isArray(logic)) {
    return logic.every(item => validateJsonLogic(item));
  }
  
  // If it's an object, check that it has exactly one key (operation)
  const keys = Object.keys(logic);
  if (keys.length !== 1) {
    return false;
  }
  
  const operation = keys[0];
  const value = logic[operation];
  
  // Check operation validity
  try {
    // Special case for var which can be a string
    if (operation === 'var' && typeof value === 'string') {
      return true;
    }
    
    // For operations that expect arrays
    if (Array.isArray(value)) {
      return value.every(item => validateJsonLogic(item));
    }
    
    // For operations with single values
    return validateJsonLogic(value);
  } catch (error) {
    return false;
  }
}

// Apply JSON Logic to data
export function applyJsonLogic(logic: any, data: any): any {
  try {
    return jsonLogic.apply(logic, data);
  } catch (error) {
    console.error("Error applying JSON Logic:", error);
    return null;
  }
}
