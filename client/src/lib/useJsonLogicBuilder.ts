import { useState, useCallback } from "react";
import { jsonLogic, validateJsonLogic, applyJsonLogic } from "./jsonLogic";
import set from "lodash/set";
import get from "lodash/get";
import cloneDeep from "lodash/cloneDeep";

export function useJsonLogicBuilder() {
  const [jsonLogicObj, setJsonLogicObj] = useState<any>({});

  const formatJsonString = useCallback(() => {
    try {
      return JSON.stringify(jsonLogicObj, null, 2);
    } catch (e) {
      return "{}";
    }
  }, [jsonLogicObj]);

  const updateOperation = useCallback((path: string[], update: any) => {
    setJsonLogicObj(prevState => {
      const newState = cloneDeep(prevState);
      if (path.length === 0) {
        // For root level updates, replace the entire object
        return update;
      } else {
        // For nested updates, use lodash set
        set(newState, path, update);
        return newState;
      }
    });
  }, []);

  const removeOperation = useCallback((path: string[]) => {
    setJsonLogicObj(prevState => {
      const newState = cloneDeep(prevState);
      
      if (path.length === 0) {
        // Remove everything
        return {};
      }
      
      // Get the parent path and key
      const parentPath = path.slice(0, -1);
      const key = path[path.length - 1];
      
      if (parentPath.length === 0) {
        // We're removing a top-level key
        const newState = { ...prevState };
        delete newState[key];
        return newState;
      }
      
      const parent = get(newState, parentPath);
      
      // Handle removing from arrays or objects
      if (Array.isArray(parent)) {
        const index = parseInt(key);
        if (!isNaN(index)) {
          parent.splice(index, 1);
        }
      } else if (typeof parent === 'object' && parent !== null) {
        delete parent[key];
      }
      
      return newState;
    });
  }, []);

  const addOperation = useCallback((type: string) => {
    setJsonLogicObj(prevState => {
      // If the state is empty, initialize with this operation
      if (Object.keys(prevState).length === 0) {
        // Handle different initial values based on operation type
        if (type === 'if') {
          return { [type]: [true, "", ""] };
        } else if (['var', 'missing', 'missing_some'].includes(type)) {
          return { [type]: "" };
        } else {
          return { [type]: [] };
        }
      }
      
      // Otherwise return unchanged (operation should be added via drag-and-drop)
      return prevState;
    });
  }, []);

  const clearAll = useCallback(() => {
    setJsonLogicObj({});
  }, []);

  const validateLogic = useCallback(() => {
    return validateJsonLogic(jsonLogicObj);
  }, [jsonLogicObj]);

  const testLogic = useCallback((data: any) => {
    return applyJsonLogic(jsonLogicObj, data);
  }, [jsonLogicObj]);

  return {
    jsonLogic: jsonLogicObj,
    jsonLogicString: formatJsonString(),
    setJsonLogic: setJsonLogicObj,
    updateOperation,
    removeOperation,
    addOperation,
    clearAll,
    validateLogic,
    testLogic
  };
}
