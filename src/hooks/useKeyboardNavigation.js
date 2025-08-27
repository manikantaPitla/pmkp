import { useEffect, useCallback } from "react";

const useKeyboardNavigation = onKeyDown => {
  const handleKeyDown = useCallback(
    event => {
      // Prevent default behavior for specific keys
      const preventDefaultKeys = ["Tab", "Escape", "Enter", "Space"];
      if (preventDefaultKeys.includes(event.key)) {
        event.preventDefault();
      }

      // Call the provided onKeyDown handler
      if (onKeyDown) {
        onKeyDown(event);
      }
    },
    [onKeyDown]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return handleKeyDown;
};

export default useKeyboardNavigation;
