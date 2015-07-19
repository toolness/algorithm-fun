import {range} from "../util.js";
import algorithms from "./algorithms/index.js";

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
  handlePointClick(point, e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.onClick) {
      this.props.onClick(point);
    }
  },
  render() {
    const RADIUS = 6;

    return (
      <svg width={300} height={400} onClick={this.handleClick} style={{
        border: '1px solid black'
      }}>
        <polyline className="ts-path"
                  points={this.props.path.map(function(i) {
                    let point = typeof(i) === 'number' ? this.props.points[i]
                                                       : i;
                    return point.x + "," + point.y;
                  }.bind(this)).join(" ")}/>
        {this.props.points.map(function(point, i) {
          return (
            <g className="ts-point" key={i}
             onClick={this.handlePointClick.bind(this, point)}>
              <circle cx={point.x} cy={point.y} r={RADIUS}/>
              <text x={point.x + RADIUS} y={point.y + RADIUS}>{i}</text>
            </g>
          );
        }.bind(this))}
      </svg>
    );
  }
});

const STORAGE_KEY = "ts_state";

export let TSApp = React.createClass({
  getInitialState() {
    return this.loadState() || {
      points: range(3).map(function(i) {
        return {x: 40 + i * 40, y: 40 + i * 4};
      }),
      algorithm: 'nearestNeighborPath'
    };
  },
  componentDidUpdate(prevProps, prevState) {
    this.saveState();
  },
  handleDiagramClick(point) {
    let points = this.state.points;

    if (points.indexOf(point) === -1) {
      this.setState({
        points: points.concat([point])
      });
    } else {
      this.setState({
        points: points.filter(p => p !== point)
      });
    }
  },
  handleClearClick(e) {
    this.setState({
      points: []
    });
  },
  handleAlgorithmChange(e) {
    this.setState({
      algorithm: e.target.value
    });
  },
  saveState() {
    window.sessionStorage[STORAGE_KEY] = JSON.stringify(this.state);
  },
  loadState() {
    try {
      return JSON.parse(window.sessionStorage[STORAGE_KEY]);
    } catch (e) {
      return null;
    }
  },
  render() {
    let points = this.state.points;
    let algorithm = algorithms[this.state.algorithm];
    let path = points.length ? algorithm(points) : [];

    return (
      <div>
        <TSDiagram points={points}
                   path={path}
                   onClick={this.handleDiagramClick}/>
        <div>
          <select value={this.state.algorithm}
                  onChange={this.handleAlgorithmChange}>
            {Object.keys(algorithms).map(function(name) {
              return <option key={name} value={name}>{name}</option>;
            })}
          </select>
          {" "}
          <button onClick={this.handleClearClick}>Clear</button>
        </div>
      </div>
    );
  }
});
