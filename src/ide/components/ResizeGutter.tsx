import React from 'react';

interface GutterProps {
  direction?: 'horizontal' | 'vertical';
  onMouseDown: (e: React.MouseEvent) => void;
  onDoubleClick?: () => void;
  title?: string;
  className?: string;
}

export const ResizeGutter: React.FC<GutterProps> = ({
  direction = 'horizontal',
  onMouseDown,
  onDoubleClick,
  title = 'Drag to resize pane (Double-click to reset)',
  className = '',
}) => {
  const isHoriz = direction === 'horizontal';

  return (
    <div
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
      title={title}
      className={`relative group select-none transition-all z-20 shrink-0 ${
        isHoriz
          ? 'w-1 hover:w-1.5 active:w-1.5 bg-slate-800/80 hover:bg-blue-500 active:bg-blue-600 cursor-col-resize h-full'
          : 'h-1 hover:h-1.5 active:h-1.5 bg-slate-800/80 hover:bg-blue-500 active:bg-blue-600 cursor-row-resize w-full'
      } ${className}`}
    >
      <div
        className={`absolute ${
          isHoriz ? 'inset-y-0 -left-1.5 -right-1.5' : 'inset-x-0 -top-1.5 -bottom-1.5'
        }`}
      />
    </div>
  );
};
