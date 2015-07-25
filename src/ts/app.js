import {pathLength, svgPathFromPoints, partitionArray} from "../util.js";
import algorithms from "./algorithms/index.js";

const DIAGRAM_VIEWBOX_SIZE = 300;
const DIAGRAM_PROPS = {
  preserveAspectRatio: "xMinYMin meet",
  viewBox: `0 0 ${DIAGRAM_VIEWBOX_SIZE} ${DIAGRAM_VIEWBOX_SIZE}`
};
const POINT_RADIUS = 6;
const SALESMAN_RADIUS = 3;

let HammerMixin = {
  componentDidMount() {
    this.hammer = new Hammer(this.getDOMNode());
  },
  componentWillUnmount() {
    this.hammer.destroy();
  }
};

let TSPoint = React.createClass({
  mixins: [HammerMixin],
  getDefaultProps() {
    return {
      className: ''
    };
  },
  componentDidMount() {
    if (this.props.onTap) {
      this.hammer.on('tap', e => {
        this.props.onTap(e, this.props.point);
      });
    }
    if (this.props.onPan) {
      this.hammer.on('panstart', e => {
        this._panStart = this.props.point;
      });
      this.hammer.on('pan', e => {
        this.props.onPan(e, this.props.point, this._panStart);
      });
    }
  },
  render() {
    let point = this.props.point;

    return (
      <g className={`ts-point ${this.props.className}`}>
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
      <svg className="ts-diagram" {...DIAGRAM_PROPS}>
        {this.props.svgShape}
        {this.props.points.map((point, i) => {
          return <TSPoint className="ts-debug" key={i} point={point}
                          label={i}/>;
        })}
      </svg>
    );
  }
});

let TSDebugDiagrams = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  render() {
    let chunks = [...partitionArray(this.props.data, 4)];
    let points = this.props.points;

    return (
      <div>
        {chunks.map((chunk, i) => {
          return (
            <div className="row" key={i}>
              {chunk.map((svgShape, i) => {
                return (
                  <div className="four columns" key={i}>
                    <TSDebugDiagram points={points} svgShape={svgShape}/>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
});

let TSDiagram = React.createClass({
  mixins: [React.addons.PureRenderMixin, HammerMixin],
  handleTap(e) {
    if (e.target !== this.getDOMNode()) return;
    let rect = this.getDOMNode().getBoundingClientRect();
    if (this.props.onClick) {
      this.props.onClick({
        x: (e.center.x - rect.left) * DIAGRAM_VIEWBOX_SIZE / rect.width,
        y: (e.center.y - rect.top) * DIAGRAM_VIEWBOX_SIZE / rect.height
      });
    }
  },
  handlePointTap(e, point) {
    e.preventDefault();
    e.srcEvent.stopPropagation();
    if (this.props.onClick) {
      this.props.onClick(point);
    }
  },
  handlePointPan(e, point, startPoint) {
    if (this.props.onDrag) {
      let rect = this.getDOMNode().getBoundingClientRect();
      let normDx = e.deltaX * DIAGRAM_VIEWBOX_SIZE / rect.width;
      let normDy = e.deltaY * DIAGRAM_VIEWBOX_SIZE / rect.height;

      this.props.onDrag(point, {
        x: normDx - (point.x - startPoint.x),
        y: normDy - (point.y - startPoint.y)
      });
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
    this.hammer.on('tap', this.handleTap);
    this.animate();
  },
  componentDidUpdate() {
    this.animate();
  },
  render() {
    return (
      <svg className="ts-diagram" {...DIAGRAM_PROPS}>
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
                  onTap={this.handlePointTap} onPan={this.handlePointPan}/>;
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
      "y": 67
    },
    {
      "x": 71,
      "y": 38
    },
    {
      "x": 148,
      "y": 34
    },
    {
      "x": 102,
      "y": 103
    },
    {
      "x": 152,
      "y": 274
    },
    {
      "x": 171,
      "y": 273
    }
  ],
  "algorithm": "nearestNeighborPath"
};

export let TSApp = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  getDefaultProps() {
    return {
      idPrefix: ''
    };
  },
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
  handleDiagramDrag(point, delta) {
    let points = this.state.points;
    let pointIndex = points.indexOf(point);

    if (pointIndex !== -1) {
      this.setState({
        points: React.addons.update(points, {
          $splice: [[pointIndex, 1, {
            x: point.x + delta.x,
            y: point.y + delta.y
          }]]
        })
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

    return (
      <div>
        <h1>Algorithm Fun: The Traveling Salesdot</h1>
        <div className="row">
          <div className="eight columns">
            <div>
              <TSDiagram points={points}
                         path={path}
                         onClick={this.handleDiagramClick}
                         onDrag={this.handleDiagramDrag}/>
            </div>
            <div>
              <label htmlFor={this.props.idPrefix + 'ts_alg'}>Heuristic</label>
              <select id={this.props.idPrefix + 'ts_alg'}
                      value={this.state.algorithm} className="u-full-width"
                      onChange={this.handleAlgorithmChange}>
                {Object.keys(algorithms).map(name => {
                  return <option key={name} value={name}>{name}</option>;
                })}
              </select>
              <button className="u-full-width"
                      onClick={this.handleClearClick}>
                Clear Diagram
              </button>
            </div>
            <p>
              Total path length is <strong>{pathLength(path).toFixed(2)}</strong>.
            </p>
          </div>
          <div className="four columns">
            <p>
            This is a demonstration of some heuristics for the Traveling Salesdot Problem explored in <a href="http://www.algorist.com/">The Algorithm Design Manual</a>, in which a small dot must visit other slightly larger dots using the shortest possible path.
            </p>
            <p>
            For more details, see the <a href="https://github.com/toolness/algorithm-fun#readme">README</a>.
            </p>
            <p>
            Click (or tap) on the diagram to add or remove dots. Drag to move them around.
            </p>
          </div>
        </div>
        {algorithm.debug && points.length > 1
         ? <div>
             <h2>Path Construction</h2>
             <p>Below is a series of snapshots depicting the process through which the <strong>{this.state.algorithm}</strong> heuristic generated its path.</p>
             <div className="row">
               <TSDebugDiagrams points={points} data={algorithm.debug(points)}/>
             </div>
           </div>
         : null}
      </div>
    );
  }
});
