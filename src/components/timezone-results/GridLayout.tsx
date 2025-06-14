'use client';

import { VirtualItem } from '@tanstack/react-virtual';
import { ReactNode } from 'react';

interface GridLayoutProps {
  virtualRow: VirtualItem;
  columns: number;
  isMobile: boolean;
  children: ReactNode;
  measureElement?: (element: HTMLDivElement | null) => void;
}

/**
 * 网格布局组件
 * 用于虚拟化列表中的行布局
 */
const GridLayout = ({ virtualRow, columns, isMobile, children, measureElement }: GridLayoutProps) => {
  return (
    <div
      data-index={virtualRow.index}
      ref={measureElement}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: `${virtualRow.size}px`,
        transform: `translateY(${virtualRow.start}px)`,
        padding: isMobile ? '8px' : '12px',
      }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: isMobile ? '12px' : '16px',
          height: '100%',
          alignItems: 'stretch',
          padding: isMobile ? '4px' : '8px',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default GridLayout;