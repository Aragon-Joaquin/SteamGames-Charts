import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { axisBottom, axisLeft, scaleBand, scaleLinear, select } from 'd3';
import { Graph } from '../../../../../utils';

export type heatMapDataType = {
  Xgroup: string;
  Ygroup: string;
  description?: string;
  value: number;
};
@Component({
  selector: 'overview-heatmap',
  imports: [],
  template: `<svg class="heatmap" #heatmap></svg>`,
  styles: ``,
})
export class HeatMapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heatmap') private chartContainer!: ElementRef<HTMLElement>;

  private margin = { X: 100, Y: 20 };
  private width = 800 - this.margin.X;
  private height = 500 - this.margin.Y;

  private graphClass = new Graph(this.width, this.height);

  data = input.required<heatMapDataType[]>();

  ngAfterViewInit() {
    const data = this.data();
    const XLabels = [...new Set(data.map((e) => e.Xgroup))];
    const YLabels = [...new Set(data.map((e) => e.Ygroup))];

    const svg = select(this.chartContainer.nativeElement)
      .attr('width', this.width + this.margin.X * 2)
      .attr('height', this.height + this.margin.Y * 2)
      .style('overflow', 'visible')
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.X + ',' + this.margin.Y + ')'
      );

    //! axis declarations
    const x = scaleBand().range([0, this.width]).domain(XLabels).padding(0.01);
    const y = scaleBand().range([this.height, 0]).domain(YLabels).padding(0.01);

    //! append axis
    svg
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(axisBottom(x));

    svg.append('g').call(axisLeft(y));

    // Style axis labels to wrap and expand vertically when there's no more horizontal space
    svg
      .selectAll('text')
      .style('fill', 'black')
      .style('font-weight', '600')
      .style('overflow', 'visible');

    if (data?.length == 0)
      return svg
        .append('text')
        .attr('x', this.width / 2)
        .attr('y', this.height / 2)
        .attr('text-anchor', 'middle')
        .attr('transform', `rotate(-5, ${this.width / 2}, ${this.height / 2})`)
        .text('No data available!')
        .style('fill', 'red')
        .style('font-size', '2rem')
        .style('font-weight', 'bold')
        .style('opacity', 0.7);

    //! color
    const color = scaleLinear<string>()
      .domain([1, 10])
      .range(['white', this.graphClass.pickRandomColor()]);

    //! tooltip
    const tooltip = select(this.chartContainer.nativeElement.parentElement)
      .append('span')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('padding', '2px 4px')
      .style('opacity', 0)
      .attr('class', 'tooltip')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('color', 'black')
      .style('border-width', '2px')
      .style('border-radius', '5px')
      .style('font-size', '12px')
      .style('z-index', '1');

    //! add the squares
    svg
      .selectAll()
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.Xgroup) ?? 0)
      .attr('y', (d) => y(d.Ygroup) ?? 0)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .style('fill', (d) => color(d.value + 3))
      .style('transition', 'all 0.2s ease-in-out')
      .on('mouseover', function () {
        tooltip.style('opacity', 1);
        const rect = select(this);
        const cx = +rect.attr('x') + x.bandwidth() / 2;
        const cy = +rect.attr('y') + y.bandwidth() / 2;
        rect.attr(
          'transform',
          `translate(${cx},${cy}) scale(0.9) translate(${-cx},${-cy})`
        );
      })
      .on('mouseout', function () {
        tooltip.style('opacity', 0);
        select(this).attr('transform', null);
      })
      .on('mousemove', (event: MouseEvent, d) => {
        tooltip
          .html(`${d.description}:  <b style='color: black'>${d.value}</b>`)
          .style('left', event.x + 10 + 'px')
          .style('top', event.y - (tooltip.node()?.offsetHeight ?? 0) + 'px');
      });
    return;
  }

  ngOnDestroy = () =>
    select(this.chartContainer.nativeElement).selectAll('*').remove();
}
