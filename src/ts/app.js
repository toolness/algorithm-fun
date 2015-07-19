import {range, pathLength} from "../util.js";
import algorithms from "./algorithms/index.js";

const POINT_RADIUS = 6;
const SALESMAN_RADIUS = 3;

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
    let svgPath = this.props.path.map((point, i) => {
      return (i === 0 ? "M " : "L ") + point.x + "," + point.y;
    }).join(" ");

    return (
      <svg width={300} height={400} onClick={this.handleClick} style={{
        border: '1px solid black'
      }}>
        {this.props.path.length > 2
         ? <g>
             <path ref="path" className="ts-path" d={svgPath}/>
             <circle cx={0} cy={0} r={SALESMAN_RADIUS} className="ts-salesman">
               <animateMotion ref="animateMotion"/>
             </circle>
           </g>
         : null}
        {this.props.points.map((point, i) => {
          return (
            <g className="ts-point" key={i}
             onClick={this.handlePointClick.bind(this, point)}>
              <circle cx={point.x} cy={point.y} r={POINT_RADIUS}/>
              <text x={point.x + POINT_RADIUS}
                    y={point.y + POINT_RADIUS}>{i}</text>
            </g>
          );
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
    let path = points.length ? algorithm(points) : [];

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
      </div>
    );
  }
});
