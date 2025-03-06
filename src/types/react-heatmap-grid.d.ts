declare module 'react-heatmap-grid' {
    import * as React from 'react';
  
    export interface HeatmapProps {
      xLabels?: string[];
      yLabels?: string[];
      data: number[][];
      height?: number;
      squares?: boolean;
      onClick?: (x: number, y: number) => void;
      cellStyle?: (background: string, value: number, min: number, max: number, data: number[][], x: number, y: number) => React.CSSProperties;
      cellRender?: (value: number) => React.ReactNode;
    }
  
    const Heatmap: React.FC<HeatmapProps>;
    export default Heatmap;
  }