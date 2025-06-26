import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
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
export class HeatMapComponent implements AfterViewInit {
  @ViewChild('heatmap') private chartContainer!: ElementRef<HTMLElement>;

  private width = 500;
  private height = 500;
  private margin = 30;

  private graphClass = new Graph(
    this.width - this.margin,
    this.height - this.margin
  );

  data =
    input.required<
      { Xgroup: string; Ygroup: string; description: string; value: number }[]
    >();

  ngAfterViewInit(): void {
    const XLabels = [...(new Set(this.data().map((e) => e.Xgroup)) ?? ['A'])];
    const YLabels = [...(new Set(this.data().map((e) => e.Ygroup)) ?? ['1'])];

    const svg = select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.height * 2)
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

    //! color
    const color = scaleLinear<string>()
      .domain([1, 100])
      .range(['white', this.graphClass.pickRandomColor()]);

    //! tooltip
    const tooltip = select(this.chartContainer.nativeElement)
      .append('div')
      .style('opacity', 0)
      .attr('class', 'tooltip')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-width', '2px')
      .style('border-radius', '5px')
      .style('padding', '5px');

    //! add the squares
    svg
      .selectAll()
      .data(this.data, function (d) {
        return d?.Xgroup + ':' + d?.Ygroup;
      })
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.Xgroup) ?? 0)
      .attr('y', (d) => y(d.Ygroup) ?? 0)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .style('fill', (d) => color(d.value))
      .on('mouseover', () => tooltip.style('opacity', 1))
      .on('mousemove', (event, d) => {
        tooltip
          .html('The exact value of<br>this cell is: ' + d.value)
          .style('left', event.x / 2 + 'px')
          .style('top', event.y / 2 + 'px');
      })
      .on('mouseleave', () => tooltip.style('opacity', 0));
  }
}
