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
@Component({
  selector: 'overview-heatmap',
  imports: [],
  template: `<svg class="heatmap" #heatmap></svg>`,
  styles: ``,
})
export class HeatMapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heatmap') private chartContainer!: ElementRef<HTMLElement>;

  private margin = 30;
  private width = 800 - this.margin;
  private height = 500 - this.margin;

  private graphClass = new Graph(
    this.width - this.margin,
    this.height - this.margin
  );

  data =
    input.required<
      { Xgroup: string; Ygroup: string; description?: string; value: number }[]
    >();

  ngAfterViewInit() {
    const data = this.data();
    const XLabels = [...new Set(data.map((e) => e.Xgroup))];
    const YLabels = [...new Set(data.map((e) => e.Ygroup))];

    const svg = select(this.chartContainer.nativeElement)
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');

    //! axis declarations
    const x = scaleBand().range([0, this.width]).domain(XLabels).padding(0.01);
    const y = scaleBand().range([this.height, 0]).domain(YLabels).padding(0.01);

    //! append axis
    svg
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(axisBottom(x));

    svg.append('g').call(axisLeft(y));

    if (!data.length) return svg.append('text').text('no data');

    //! color
    const color = scaleLinear<string>()
      .domain([1, 100])
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
      .style('fill', (d) => color(d.value))
      .style('transition', 'all 0.1s ease-in-out')
      .on('mouseover', function () {
        tooltip.style('opacity', 1);
        const rect = select(this);
        const cx = +rect.attr('x') + x.bandwidth() / 2;
        const cy = +rect.attr('y') + y.bandwidth() / 2;
        rect
          .transition()
          .duration(100)
          .attr(
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
