interface ChartData {
  id: number;
  hours: number;
  color: string;
}

interface ChartConfig {
  strokeWidth: number;
  radius: number;
}

interface ChartSector {
  id: number;
  hours: number;
  color: string;
  width: number;
  offset: number;
}

interface SvgAttrs {
  id?: number;
  viewBox?: string;
  fill?: string;
  width?: number;
  height?: number;
  cx?: number;
  cy?: number;
  r?: number;
  'stroke-dasharray'?: string;
  'stroke-dashoffset'?: string;
  stroke?: string;
  'stroke-width'?: number;
}

interface ObjNum {
  [id: string]: number;
}

export { ChartData, ChartConfig, SvgAttrs, ChartSector, ObjNum };
