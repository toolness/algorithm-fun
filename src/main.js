import {range} from "./util.js";

let TSDiagram = React.createClass({
  handleClick(e) {
    e.preventDefault();
    let rect = this.getDOMNode().getBoundingClientRect();
    if (this.props.onClick) {
      this.props.onClick({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  },
  render() {
    return (
      <svg width={300} height={400} onClick={this.handleClick} style={{
        border: '1px solid black'
      }}>
        {this.props.points.map(function(point, i) {
          return <circle key={i} cx={point.x} cy={point.y} r={4}/>;
        })}
        <polyline fill="none" stroke="black" strokeWidth={1}
                  points={this.props.path.map(function(i) {
                    let point = this.props.points[i];
                    return point.x + "," + point.y;
                  }.bind(this)).join(" ")}/>
      </svg>
    );
  }
});

let TSApp = React.createClass({
  getInitialState() {
    return {
      points: range(3).map(function(i) {
        return {x: 40 + i * 40, y: 40 + i * 4};
      }),
      algorithm: trivialPath
    };
  },
  handleDiagramClick(point) {
    this.setState({
      points: this.state.points.concat([point])
    });
  },
  render() {
    let points = this.state.points;
    let path = this.state.algorithm(points);

    return (
      <div>
        <TSDiagram points={points}
                   path={path}
                   onClick={this.handleDiagramClick}/>
      </div>
    );
  }
});

function trivialPath(points) {
  return range(points.length);
}

React.render(
  <TSApp/>,
  document.body
);
