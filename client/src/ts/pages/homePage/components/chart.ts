import { ChartData, ChartConfig, SvgAttrs, ChartSector } from '../../../base/interface';
import Values from '../../../base/enums/values';

class Chart {
  createSvgElement(elementName: string, attrs: SvgAttrs) {
    const svgNs = Values.svgLink;
    const svgEl = document.createElementNS(svgNs, elementName);
    Object.entries(attrs).forEach(([attrName, attrValue]) => svgEl.setAttributeNS(null, attrName, attrValue));
    return svgEl;
  }

  createChart(container: HTMLElement, chartData: ChartData[], config: ChartConfig) {
    const { strokeWidth, radius } = config;
    const svgRadius = radius - strokeWidth / 2;
    const diameter = 2 * radius;
    const circumference = Math.PI * 2 * svgRadius;
    const sectors: ChartSector[] = [];

    chartData.forEach((sectorData, sectorIndex) => {
      const width = (circumference * sectorData.hours) / 12;
      let offset = circumference * 0.25;

      if (sectorIndex > 0) {
        const prevSector = sectors[sectorIndex - 1];
        offset = prevSector.offset - prevSector.width;
      }
      sectors.push({ ...sectorData, width, offset });
    });

    const svg = this.createSvgElement('svg', {
      viewBox: `0 0 ${diameter} ${diameter}`,
      fill: 'none',
      width: diameter,
      height: diameter,
    });

    sectors.forEach((sector) => {
      const circle = this.createSvgElement('circle', {
        id: sector.id,
        cx: svgRadius + strokeWidth / 2,
        cy: svgRadius + strokeWidth / 2,
        r: svgRadius,
        'stroke-dasharray': `${sector.width} ${circumference - sector.width}`,
        'stroke-dashoffset': sector.offset.toString(),
        stroke: sector.color,
        'stroke-width': strokeWidth,
      });
      svg.append(circle);
    });

    container.append(svg);
  }
}

export default Chart;
