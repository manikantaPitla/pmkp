import { useEffect, useRef, useCallback } from "react";

/**
 * Custom hook for auto-scrolling to bottom of a container with pagination support
 * @param {Array} dependencies - Array of dependencies that trigger scroll
 * @param {Object} options - Scroll options
 * @param {Function} onScrollToTop - Callback when scrolling to top (for pagination)
 * @returns {Object} Ref and scroll functions
 */
const useAutoScroll = (dependencies = [], options = {}, onScrollToTop = null) => {
  const containerRef = useRef(null);
  const { behavior = "smooth", block = "end", inline = "nearest", enabled = true, offset = 0, autoScrollOnNewMessages = true, isLoadingOlderMessages = false } = options;
  const lastScrollTop = useRef(0);
  const previousMessageCount = useRef(0);
  const wasAtBottom = useRef(true);

  const scrollToBottom = useCallback(() => {
    if (!containerRef.current || !enabled) return;

    const container = containerRef.current;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const maxScrollTop = scrollHeight - clientHeight;

    container.scrollTo({
      top: maxScrollTop + offset,
      behavior,
    });
  }, [behavior, enabled, offset]);

  const scrollToElement = useCallback(
    elementId => {
      if (!containerRef.current) return;

      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({
          behavior,
          block,
          inline,
        });
      }
    },
    [behavior, block, inline]
  );

  const scrollToTop = useCallback(() => {
    if (!containerRef.current) return;

    containerRef.current.scrollTo({
      top: 0,
      behavior,
    });
  }, [behavior]);

  const isAtBottom = useCallback(() => {
    if (!containerRef.current) return true;

    const container = containerRef.current;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const threshold = 10; // pixels from bottom

    return scrollTop + clientHeight >= scrollHeight - threshold;
  }, []);

  const isAtTop = useCallback(() => {
    if (!containerRef.current) return true;

    const container = containerRef.current;
    const threshold = 10; // pixels from top

    return container.scrollTop <= threshold;
  }, []);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || !onScrollToTop) return;

    const container = containerRef.current;
    const { scrollTop, scrollHeight, clientHeight } = container;

    wasAtBottom.current = scrollTop + clientHeight >= scrollHeight - 10;

    if (scrollTop < 100 && scrollTop < lastScrollTop.current) {
      onScrollToTop(scrollTop, scrollHeight, clientHeight);
    }

    lastScrollTop.current = scrollTop;
  }, [onScrollToTop]);

  useEffect(() => {
    const container = containerRef.current;
    if (container && onScrollToTop) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll, onScrollToTop]);

  useEffect(() => {
    if (!enabled || !autoScrollOnNewMessages || isLoadingOlderMessages) return;

    const currentMessageCount = dependencies[0]?.length || 0;

    if (currentMessageCount > previousMessageCount.current && wasAtBottom.current) {
      scrollToBottom();
    }

    previousMessageCount.current = currentMessageCount;
  }, dependencies);

  return {
    containerRef,
    scrollToBottom,
    scrollToElement,
    scrollToTop,
    isAtBottom,
    isAtTop,
  };
};

export default useAutoScroll;
