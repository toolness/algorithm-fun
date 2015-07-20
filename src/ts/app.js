import {range, pathLength, svgPathFromPoints} from "../util.js";
import algorithms from "./algorithms/index.js";

const POINT_RADIUS = 6;
const SALESMAN_RADIUS = 3;

let TSPoint = React.createClass({
  render() {
    let point = this.props.point;

    return (
      <g className={"ts-point " + this.props.className}
         onClick={this.props.onClick}>
        <circle cx={point.x} cy={point.y} r={POINT_RADIUS}/>
        <text x={point.x + POINT_RADIUS}
              y={point.y + POINT_RADIUS}>{this.props.label}</text>
      </g>
    );
  }
});

let TSDebugDiagram = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  render() {
    return (
      <svg width={300} height={400} style={{
        border: '1px solid black'
      }}>
        {this.props.svgShape}
        {this.props.points.map((point, i) => {
          return <TSPoint className="ts-debug" key={i} point={point}
                          label={i}/>;
        })}
      </svg>
    );
  }
});

let TSDiagram = React.createClass({
  mixins: [React.addons.PureRenderMixin],
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
  // React doesn't set attributes on <animateMotion> elements, so we'll
  // have to do it manually.
  animate() {
    if (!this.refs.path) return;
    let el = this.refs.animateMotion.getDOMNode();
    let d = this.refs.path.getDOMNode().getAttribute('d');

    el.setAttribute('path', d);
    el.setAttribute('dur', '5s');
    el.setAttribute('repeatCount', 'indefinite');
  },
  componentDidMount() {
    this.animate();
  },
  componentDidUpdate() {
    this.animate();
  },
  render() {
    return (
      <svg width={300} height={400} onClick={this.handleClick} style={{
        border: '1px solid black'
      }}>
        {this.props.path.length > 2
         ? <g>
             <path ref="path" className="ts-path"
                   d={svgPathFromPoints(this.props.path)}/>
             <circle cx={0} cy={0} r={SALESMAN_RADIUS} className="ts-salesman">
               <animateMotion ref="animateMotion"/>
             </circle>
           </g>
         : null}
        {this.props.points.map((point, i) => {
          return <TSPoint key={i} point={point} label={i}
                  onClick={this.handlePointClick.bind(this, point)}/>;
        })}
      </svg>
    );
  }
});

const STORAGE_KEY = "ts_state";

export let TSApp = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  getInitialState() {
    return this.loadState() || {
      points: range(3).map(i => {
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
    let path = points.length > 1 ? algorithm(points) : [];
    let debugFrames = [];

    if (algorithm.debug && points.length > 1) {
      debugFrames = algorithm.debug(points).map((svgShape, i) => {
        return (
          <TSDebugDiagram key={i} points={points} svgShape={svgShape}/>
        );
      });
    }

    return (
      <div>
        <TSDiagram points={points}
                   path={path}
                   onClick={this.handleDiagramClick}/>
        <div>
          <select value={this.state.algorithm}
                  onChange={this.handleAlgorithmChange}>
            {Object.keys(algorithms).map(name => {
              return <option key={name} value={name}>{name}</option>;
            })}
          </select>
          {" "}
          <button onClick={this.handleClearClick}>Clear</button>
        </div>
        <div>
          Path length: {pathLength(path).toFixed(2)}
        </div>
        {debugFrames.length ? <h2>Path Construction</h2> : null}
        {debugFrames}
      </div>
    );
  }
});
