import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import { arc, pie, PieArcDatum, scaleOrdinal, select, selectAll } from 'd3';
import { Graph, removeWhiteSpace } from '../../../../../utils';

type dataShape = { genre: string; quantity: number };

@Component({
  selector: 'overview-pie-chart',
  imports: [],
  template: `<svg class="piechart" #piechart></svg> `,
  styles: ``,
})

// display genres
export class PieChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('piechart') private chartContainer!: ElementRef<HTMLElement>;

  private width = 500;
  private height = 500;
  private margin = 50;

  private MAXIMUM_ELEMENTS = 10;
  private MAX_CHAR_DISPLAY = 7;
  private graphClass = new Graph(this.width, this.height);
  private radius = Math.min(this.width, this.height) / 2 - this.margin;

  data = input.required<dataShape[] | []>();
  helperArrows = input<boolean>(false);

  // guide from https://d3-graph-gallery.com/graph/donut_label.html cuz this is insane
  ngAfterViewInit(): void {
    this.data().length;
    const sortedData =
      this.data()?.length > 0
        ? this.data()
            .slice(0, this.MAXIMUM_ELEMENTS)
            .sort((a, b) => (b?.quantity ?? 0) - (a?.quantity ?? 0))
        : [{ genre: 'No available information', quantity: 1 }];

    //! clean up
    select(this.chartContainer.nativeElement).selectAll('*').remove();

    //! Defining data form
    const svg = select(this.chartContainer.nativeElement)
      .attr('width', this.width)
      .attr('height', this.height)
      .style('overflow', 'visible')
      .append('g')
      .attr(
        'transform',
        'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
      );

    //! useful variables
    const colors = scaleOrdinal().range(
      this.data().length > 0
        ? this.graphClass.colors
        : [this.graphClass.notFoundColor]
    );

    //this can be sorted inverse
    const pieGraph = pie<dataShape>()
      .sort(null)
      .value((d) => d.quantity);
    const data_ready = pieGraph(sortedData);

    const innerArc = arc<PieArcDatum<dataShape>>()
      .innerRadius(this.radius * 0.5)
      .outerRadius(this.radius * 0.8);

    const outerArc = arc<PieArcDatum<dataShape>>()
      .innerRadius(this.radius * 0.8)
      .outerRadius(this.radius * 0.6);

    //! drawing

    svg
      .selectAll('*')
      .data(data_ready)
      .join('path')
      .attr('d', innerArc)
      .attr('fill', (_, i) => colors.range()[i] as string)
      .attr('stroke', 'white')
      .attr('class', 'graphElement')
      .style('stroke-width', '3px')
      .style('opacity', 0.8)
      .style('position', 'relative')
      .style('transition', 'all 0.3s ease-in-out')
      .on('mouseover', function (_, d) {
        selectAll('path').style('opacity', 0.4);
        select(this)
          .style('scale', 1.05)
          .style('opacity', 1)
          .style('cursor', 'pointer');

        select(`.inner-text-${removeWhiteSpace(d.data.genre)}`).style(
          'visibility',
          'visible'
        );
      })
      .on('mouseout', function (_, d) {
        selectAll('path').style('opacity', 0.8);
        select(this).style('scale', 1);

        select(`.inner-text-${removeWhiteSpace(d.data.genre)}`).style(
          'visibility',
          'hidden'
        );
      });

    svg
      .selectAll('text')
      .data(data_ready)
      .join('foreignObject')
      .text((d) => d.data.genre)
      .attr('x', `-${this.radius * 0.4}`)
      .attr('y', `-${this.radius * 0.4}`)
      .attr(
        'class',
        (d) => `inner-text inner-text-${removeWhiteSpace(d.data.genre)}`
      )
      .style('width', `${this.radius * 0.8}px`)
      .style('height', `${this.radius * 0.8}px`)
      .style('visibility', 'hidden')
      .style('text-anchor', 'middle')
      .style('align-content', 'center')
      .style('font-size', '16px')
      .style('font-family', 'monospace')
      .style('font-weight', '600')
      .style('text-align', 'center')
      .style('color', 'black');

    if (!this.helperArrows()) return;

    svg
      .selectAll('allPolylines')
      .data(data_ready)
      .join('polyline')
      .attr('stroke', 'black')
      .style('fill', 'none')
      .attr('stroke-width', 1)
      .attr('points', (d) => {
        const posA = innerArc.centroid(d);
        const posB = outerArc.centroid(d);
        const posC = outerArc.centroid(d);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        posC[0] = this.radius * 0.87 * (midangle < Math.PI ? 1 : -1);
        return [posA, posB, posC].map((point) => point.join(' '));
      });
    svg
      .selectAll('allLabels')
      .data(data_ready)
      .join('text')
      .text((d) =>
        d.data.genre.length > this.MAX_CHAR_DISPLAY + 1
          ? d.data.genre.substring(0, this.MAX_CHAR_DISPLAY) + '...'
          : d.data.genre
      )
      .attr('transform', (d) => {
        const pos = outerArc.centroid(d);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = this.radius * 0.9 * (midangle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style('text-anchor', (d) => {
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midangle < Math.PI ? 'start' : 'end';
      })
      .append('title')
      .text((d) => d.data.genre);

    // return [sortedData, colors.range()];
  }

  ngOnDestroy(): void {
    select(this.chartContainer.nativeElement).selectAll('*').remove();
  }
}
