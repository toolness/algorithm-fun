import {pathLength, svgPathFromPoints} from "../util.js";
import algorithms from "./algorithms/index.js";

const DIAGRAM_WIDTH = 300;
const DIAGRAM_HEIGHT = 400;
const POINT_RADIUS = 6;
const SALESMAN_RADIUS = 3;

let TSPoint = React.createClass({
  getDefaultProps() {
    return {
      className: ''
    };
  },
  handleClick(e) {
    if (this.props.onClick) {
      this.props.onClick(e, this.props.point);
    }
  },
  render() {
    let point = this.props.point;

    return (
      <g className={`ts-point ${this.props.className}`}
         onTouchEnd={this.handleClick}
         onClick={this.handleClick}>
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
      <svg width={DIAGRAM_WIDTH} height={DIAGRAM_HEIGHT} style={{
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
  handleTap(e) {
    if (e.target !== this.getDOMNode()) return;
    let rect = this.getDOMNode().getBoundingClientRect();
    if (this.props.onClick) {
      this.props.onClick({
        x: e.center.x - rect.left,
        y: e.center.y - rect.top
      });
    }
  },
  handlePointClick(e, point) {
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
    this.hammertime = new Hammer(this.getDOMNode());
    this.hammertime.on('tap', this.handleTap);
    this.animate();
  },
  componentDidUpdate() {
    this.animate();
  },
  componentWillUnmount() {
    this.hammertime.destroy();
  },
  render() {
    return (
      <svg width={DIAGRAM_WIDTH} height={DIAGRAM_HEIGHT} style={{
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
                  onClick={this.handlePointClick}/>;
        })}
      </svg>
    );
  }
});

const STORAGE_KEY = "ts_state";
const DEFAULT_INITIAL_STATE = {
  "points": [
    {
      "x": 73,
      "y": 117
    },
    {
      "x": 71,
      "y": 88
    },
    {
      "x": 148,
      "y": 84
    },
    {
      "x": 102,
      "y": 153
    },
    {
      "x": 152,
      "y": 324
    },
    {
      "x": 171,
      "y": 323
    }
  ],
  "algorithm": "nearestNeighborPath"
};

export let TSApp = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  getInitialState() {
    return this.loadState() || DEFAULT_INITIAL_STATE;
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
        <h1>Algorithm Fun: The Traveling Salesdot</h1>
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
        <p>
          Total path length is {pathLength(path).toFixed(2)}.
        </p>
        {debugFrames.length ? <h2>Path Construction</h2> : null}
        {debugFrames}
      </div>
    );
  }
});
