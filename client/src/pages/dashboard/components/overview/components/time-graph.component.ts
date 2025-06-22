import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { axisBottom, axisLeft, max, scaleBand, scaleLinear, select } from 'd3';
import { AdaptedGraphqlTypes } from '../../../../../adapters/graphqlAdapter';
import { GRAPHQL_ENDPOINTS } from '../../../../../services/endpoints';
import { Graph, Rectangle } from '../../../../../utils';
@Component({
  selector: 'overview-time-graph',
  imports: [],
  template: ` <svg class="timegraph" #timegraph></svg> `,
  styles: `
  .timegraph {
    margin-top: 20px;
  }
  `,
})

// most played in 2 weeks
export class TimeGraphComponent implements AfterViewInit, OnDestroy {
  @ViewChild('timegraph') private chartContainer!: ElementRef<HTMLElement>;

  private width = 928;
  private height = 500;

  private graphClass = new Graph(this.width, this.height);

  data = input.required<
    AdaptedGraphqlTypes<typeof GRAPHQL_ENDPOINTS.RecentGames>['games'] | []
  >();

  ngAfterViewInit(): void {
    //! Defining data form
    const sortedData = this.data()
      .slice(0, 10)
      .sort((a, b) => (b.playtime_2weeks ?? 0) - (a.playtime_2weeks ?? 0));

    const svg = select(this.chartContainer.nativeElement)
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', [0, 0, this.width, this.height])
      .attr('style', 'max-width: 100%; height: auto; overflow: visible;');

    //! clean up
    svg.selectAll('g').remove();
    svg.selectAll('text').remove();

    //! X axis
    const x = scaleBand()
      .domain(sortedData.map((e) => e.name ?? ''))
      .range([40, this.width])
      .padding(0.1);

    const xAxis = svg
      .append('g')
      .attr('transform', `translate(0,${this.height - 30})`)
      .call(axisBottom(x))
      .style('font-size', '15px')
      .style('z-index', '5');

    xAxis.selectAll('line').style('stroke', 'black');
    xAxis.selectAll('path').style('stroke', 'black');

    xAxis
      .selectAll('text')
      .attr('transform', 'rotate(330,0,0) translate(0,0)')
      .style('text-anchor', 'end')
      .style('stroke', 'black');
    //.style('fill', 'black');

    //! Y axis
    const y = scaleLinear()
      .domain([0, max(sortedData, (d) => d.playtime_2weeks ?? 0) ?? 10])
      .range([this.height - 30, 10]);

    const yAxis = svg
      .append('g')
      .attr('transform', `translate(${40},0)`)
      .call(axisLeft(y))
      .style('font-size', '15px')
      .style('z-index', '5');

    yAxis.selectAll('line').style('stroke', 'black');
    yAxis.selectAll('path').style('stroke', 'black');

    yAxis.selectAll('text').style('stroke', 'black');
    //.style('fill', 'black');

    //! Drawing on graph
    svg
      .selectAll('rect')
      .data(
        sortedData.map(
          (e) => new Rectangle(e.playtime_2weeks ?? 0, this.graphClass)
        )
      )
      .enter()
      .append('rect')
      .attr('x', (_, i) => {
        return x(sortedData[i].name ?? '') ?? '';
      })
      .attr('y', (d) => y(d.value))
      .attr('width', () => x.bandwidth())
      .attr('height', (d) => y(0) - y(d.value))
      .style('fill', (d) => d.GetUniqueColor())
      .append('title')
      .text((d, i) =>
        (sortedData[i].name ?? '').concat(` (${d.value} minutes)`)
      );

    //! labels to axis
    svg
      .append('text')
      .attr('class', 'x label')
      .attr('text-anchor', 'end')
      .attr('x', 60)
      .attr('y', 0)
      .style('font-style', 'italic')
      .text('Minutes');

    svg
      .append('text')
      .attr('class', 'x label')
      .attr('text-anchor', 'end')
      .attr('x', this.width)
      .attr('y', this.height - 10)
      .style('font-style', 'italic')
      .text('Game name');
  }

  ngOnDestroy(): void {
    select(this.chartContainer.nativeElement).selectAll('*').remove();
  }
}
