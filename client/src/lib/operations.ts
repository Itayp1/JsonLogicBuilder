export interface Operation {
  type: string;
  name: string;
  description: string;
  category: 'logic' | 'data' | 'numeric' | 'array' | 'string';
  icon: string;
  tooltip: string;
  isCustom?: boolean;
}

interface OperationCategory {
  label: string;
  operations: Operation[];
}

export const operations: Record<string, OperationCategory> = {
  logic: {
    label: "Logic Operations",
    operations: [
      {
        type: "if",
        name: "if-then-else",
        description: "Conditional logic",
        category: "logic",
        icon: "git-branch-line",
        tooltip: "Conditional logic: if condition is true, return 'then' result, otherwise return 'else' result."
      },
      {
        type: "==",
        name: "Equal (==)",
        description: "Equality comparison",
        category: "logic",
        icon: "equal-line",
        tooltip: "Compare if two values are equal (loose equality)."
      },
      {
        type: "===",
        name: "Strict Equal (===)",
        description: "Strict equality comparison",
        category: "logic",
        icon: "equal-line",
        tooltip: "Compare if two values are equal with same type (strict equality)."
      },
      {
        type: "!=",
        name: "Not Equal (!=)",
        description: "Inequality comparison",
        category: "logic",
        icon: "close-line",
        tooltip: "Compare if two values are not equal (loose inequality)."
      },
      {
        type: "!==",
        name: "Strict Not Equal (!==)",
        description: "Strict inequality comparison",
        category: "logic",
        icon: "close-line",
        tooltip: "Compare if two values are not equal or not same type (strict inequality)."
      },
      {
        type: ">",
        name: "Greater Than (>)",
        description: "Greater than comparison",
        category: "logic",
        icon: "greater-than-line",
        tooltip: "Check if first value is greater than second value."
      },
      {
        type: ">=",
        name: "Greater Than or Equal (>=)",
        description: "Greater than or equal comparison",
        category: "logic",
        icon: "greater-than-line",
        tooltip: "Check if first value is greater than or equal to second value."
      },
      {
        type: "<",
        name: "Less Than (<)",
        description: "Less than comparison",
        category: "logic",
        icon: "less-than-line",
        tooltip: "Check if first value is less than second value."
      },
      {
        type: "<=",
        name: "Less Than or Equal (<=)",
        description: "Less than or equal comparison",
        category: "logic",
        icon: "less-than-line",
        tooltip: "Check if first value is less than or equal to second value."
      },
      {
        type: "!",
        name: "Not (!)",
        description: "Logical NOT",
        category: "logic",
        icon: "close-circle-line",
        tooltip: "Negate a boolean value."
      },
      {
        type: "!!",
        name: "Boolean Cast (!!)",
        description: "Cast to boolean",
        category: "logic",
        icon: "checkbox-circle-line",
        tooltip: "Convert a value to boolean (true/false)."
      },
      {
        type: "and",
        name: "Logical AND",
        description: "All conditions must be true",
        category: "logic",
        icon: "function-line",
        tooltip: "Return true only if all conditions are true."
      },
      {
        type: "or",
        name: "Logical OR",
        description: "At least one condition must be true",
        category: "logic",
        icon: "function-line",
        tooltip: "Return true if at least one condition is true."
      }
    ]
  },
  data: {
    label: "Data Operations",
    operations: [
      {
        type: "var",
        name: "Variable",
        description: "Access a variable",
        category: "data",
        icon: "database-2-line",
        tooltip: "Access a variable from the data object using dot notation or array syntax."
      },
      {
        type: "missing",
        name: "Missing",
        description: "Check for required fields",
        category: "data",
        icon: "error-warning-line",
        tooltip: "Check if required keys are missing from the data object."
      },
      {
        type: "missing_some",
        name: "Missing Some",
        description: "Check if some fields are missing",
        category: "data",
        icon: "error-warning-line",
        tooltip: "Check if a certain number of required keys are missing from the data object."
      }
    ]
  },
  numeric: {
    label: "Numeric Operations",
    operations: [
      {
        type: "+",
        name: "Addition (+)",
        description: "Add numbers",
        category: "numeric",
        icon: "add-line",
        tooltip: "Add two or more numbers together."
      },
      {
        type: "-",
        name: "Subtraction (-)",
        description: "Subtract numbers",
        category: "numeric",
        icon: "subtract-line",
        tooltip: "Subtract second number from first number."
      },
      {
        type: "*",
        name: "Multiplication (*)",
        description: "Multiply numbers",
        category: "numeric",
        icon: "close-line",
        tooltip: "Multiply two or more numbers together."
      },
      {
        type: "/",
        name: "Division (/)",
        description: "Divide numbers",
        category: "numeric",
        icon: "divide-line",
        tooltip: "Divide first number by second number."
      },
      {
        type: "%",
        name: "Modulo (%)",
        description: "Remainder after division",
        category: "numeric",
        icon: "percent-line",
        tooltip: "Get remainder when first number is divided by second number."
      },
      {
        type: "min",
        name: "Minimum",
        description: "Find minimum value",
        category: "numeric",
        icon: "arrow-down-line",
        tooltip: "Find the minimum value in a set of numbers."
      },
      {
        type: "max",
        name: "Maximum",
        description: "Find maximum value",
        category: "numeric",
        icon: "arrow-up-line",
        tooltip: "Find the maximum value in a set of numbers."
      },
      {
        type: "length",
        name: "Length",
        description: "Get length of a number",
        category: "numeric",
        icon: "ruler-line",
        tooltip: "Custom operation: Get the length (number of digits) of a number.",
        isCustom: true
      }
    ]
  },
  array: {
    label: "Array Operations",
    operations: [
      {
        type: "map",
        name: "Map",
        description: "Transform array elements",
        category: "array",
        icon: "list-check",
        tooltip: "Transform each element in an array using a specified logic."
      },
      {
        type: "filter",
        name: "Filter",
        description: "Filter array elements",
        category: "array",
        icon: "filter-line",
        tooltip: "Filter array elements based on a condition."
      },
      {
        type: "reduce",
        name: "Reduce",
        description: "Reduce array to single value",
        category: "array",
        icon: "compress-line",
        tooltip: "Reduce an array to a single value using accumulator logic."
      },
      {
        type: "merge",
        name: "Merge",
        description: "Combine multiple arrays",
        category: "array",
        icon: "merge-cells-horizontal",
        tooltip: "Merge multiple arrays into a single array."
      },
      {
        type: "in",
        name: "In",
        description: "Check if item exists in array",
        category: "array",
        icon: "search-line",
        tooltip: "Check if a value exists in an array."
      }
    ]
  },
  string: {
    label: "String Operations",
    operations: [
      {
        type: "cat",
        name: "Concatenate",
        description: "Join strings together",
        category: "string",
        icon: "text",
        tooltip: "Concatenate (join) multiple strings together."
      },
      {
        type: "substr",
        name: "Substring",
        description: "Extract part of a string",
        category: "string",
        icon: "text",
        tooltip: "Extract a section from a string between specified positions."
      }
    ]
  }
};

export function findOperationByType(type: string): Operation | undefined {
  for (const category of Object.values(operations)) {
    const found = category.operations.find(op => op.type === type);
    if (found) return found;
  }
  return undefined;
}
