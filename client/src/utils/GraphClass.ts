export class Graph {
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
    '#E74C3C',
    '#F1C40F',
    '#8E44AD',
    '#16A085',
  ];

  constructor(width: number, height: number) {
    this.height = height ?? 0;
    this.width = width ?? 0;
  }

  pickRandomColor() {
    const idx = Math.floor(Math.random() * this.colors.length);
    return this.colors[idx] ?? '#CCCCCC';
  }
}

export class Rectangle {
  value: number = 0;
  private graphVals!: Graph;

  constructor(value: number, graph: Graph) {
    this.value = value;
    this.graphVals = graph;
  }

  // CalculateRectHeight(data: number[]) {
  //   const chartHeight = RoundDecimals(
  //     this.graphVals.height / Math.max(...data)
  //   );
  //   return RoundDecimals(chartHeight * this.value);
  // }

  // CalculateRectWidth(data: number[], gap: number = 10) {
  //   return RoundDecimals(this.graphVals.width / data.length) - gap;
  // }

  //! fix this
  GetUniqueColor = () => this.graphVals.pickRandomColor();
}
