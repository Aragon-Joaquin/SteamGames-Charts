import { RoundDecimals } from './constants';

export class Graph {
  data: Array<number> = [];
  height: number = 0;
  width: number = 0;

  colors: Array<string> = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#27AE60',
    '#8DD17E',
    '#FF6F91',
    '#345995',
  ];

  constructor(data: Array<number>, height: number, width: number) {
    this.data = data;
    this.height = height;
    this.width = width;
  }
}

export class Rectangle {
  value: number = 0;
  private graphVals!: Graph;

  constructor(value: number, graph: Graph) {
    this.value = value;
    this.graphVals = graph;
  }

  CalculateRectHeight() {
    const chartHeight = RoundDecimals(
      this.graphVals.height / Math.max(...this.graphVals.data)
    );
    return RoundDecimals(chartHeight * this.value);
  }

  CalculateRectWidth(gap: number = 10) {
    return (
      RoundDecimals(this.graphVals.width / this.graphVals.data.length) - gap
    );
  }

  GetColor() {
    const idx = Math.floor(Math.random() * this.graphVals.colors.length);
    return this.graphVals.colors[idx] ?? '#CCCCCC';
  }
}
