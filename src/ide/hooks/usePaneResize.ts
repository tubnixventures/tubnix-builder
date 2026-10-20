import { useState, useCallback, useEffect, useRef } from 'react';

export function usePaneResize(
  defaultExplorerWidth = 240,
  defaultChatWidth = 360,
  defaultTerminalHeight = 220
) {
  const [explorerWidth, setExplorerWidth] = useState(defaultExplorerWidth);
  const [chatWidth, setChatWidth] = useState(defaultChatWidth);
  const [terminalHeight, setTerminalHeight] = useState(defaultTerminalHeight);
  const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);
  const prevTerminalHeightRef = useRef(defaultTerminalHeight);
  const isDraggingRef = useRef<'explorer' | 'chat' | 'terminal' | null>(null);

  const startDragExplorer = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = 'explorer';
  }, []);

  const startDragChat = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = 'chat';
  }, []);

  const startDragTerminal = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = 'terminal';
  }, []);

  const resetExplorer = useCallback(() => setExplorerWidth(defaultExplorerWidth), [defaultExplorerWidth]);
  const resetChat = useCallback(() => setChatWidth(defaultChatWidth), [defaultChatWidth]);
  const resetTerminal = useCallback(() => {
    setIsTerminalMaximized(false);
    setTerminalHeight(defaultTerminalHeight);
  }, [defaultTerminalHeight]);

  const toggleMaximizeTerminal = useCallback(() => {
    setIsTerminalMaximized((max) => {
      if (max) {
        setTerminalHeight(prevTerminalHeightRef.current || defaultTerminalHeight);
        return false;
      }
      prevTerminalHeightRef.current = terminalHeight;
      setTerminalHeight(Math.max(400, Math.floor(window.innerHeight * 0.75)));
      return true;
    });
  }, [terminalHeight, defaultTerminalHeight]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      if (isDraggingRef.current === 'explorer') {
        const newWidth = Math.max(160, Math.min(500, e.clientX - 48));
        setExplorerWidth(newWidth);
      } else if (isDraggingRef.current === 'chat') {
        const newWidth = Math.max(260, Math.min(650, window.innerWidth - e.clientX));
        setChatWidth(newWidth);
      } else if (isDraggingRef.current === 'terminal') {
        const fromBottom = window.innerHeight - e.clientY - 24; // 24px status bar
        const newHeight = Math.max(80, Math.min(window.innerHeight - 140, fromBottom));
        setIsTerminalMaximized(false);
        setTerminalHeight(newHeight);
      }
    };
    const handleMouseUp = () => {
      isDraggingRef.current = null;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return {
    explorerWidth,
    chatWidth,
    terminalHeight,
    isTerminalMaximized,
    startDragExplorer,
    startDragChat,
    startDragTerminal,
    resetExplorer,
    resetChat,
    resetTerminal,
    toggleMaximizeTerminal,
  };
}
