import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { arc, pie, PieArcDatum, scaleOrdinal, select } from 'd3';
import { Graph } from '../../../../../../utils';

@Component({
  selector: 'overview-pie-chart',
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `<svg class="piechart" #piechart></svg> `,
  styleUrl: './styles.css',
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

  data = [
    { genre: 'action', quantity: 13 },
    { genre: 'novel', quantity: 3 },
    { genre: 'platasdform', quantity: 7 },
    { genre: 'fps', quantity: 3 },
  ];

  // guide from https://d3-graph-gallery.com/graph/donut_label.html cuz this is insane
  ngAfterViewInit(): void {
    type dataShape = (typeof this.data)[number];

    const sortedData = this.data
      .slice(0, this.MAXIMUM_ELEMENTS)
      .sort((a, b) => (b?.quantity ?? 0) - (a?.quantity ?? 0));

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
    const colors = scaleOrdinal().range(this.graphClass.colors);
    const pieGraph = pie<dataShape>().value((d) => d.quantity);
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
      .attr('fill', (_, i) => (colors.range()[i] as string) ?? '#ccc')
      .attr('stroke', 'white')
      .attr('class', 'graphElement')
      .style('stroke-width', '3px')
      .style('opacity', 0.8)
      .append('title')
      .text((d) => d?.data?.genre ?? 'Unknown');

    svg
      .selectAll('allPolylines')
      .data(data_ready)
      .join('polyline')
      .attr('stroke', 'black')
      .style('fill', 'none')
      .attr('stroke-width', 1)
      .attr('points', (d) => {
        const posA = innerArc.centroid(d); // line insertion in the slice
        const posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
        const posC = outerArc.centroid(d); // Label position = almost the same as posB
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
        posC[0] = this.radius * 0.87 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
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
      });
  }
  ngOnDestroy(): void {
    select(this.chartContainer.nativeElement).selectAll('*').remove();
  }
}
