import {range} from "./util.js";

let TravelingSalesman = React.createClass({
  render() {
    return (
      <svg width={300} height={400} style={{
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

React.render(
  <TravelingSalesman points={range(3).map(function(i) {
    return {x: 40 + i * 40, y: 40 + i * 4};
  })} path={[0, 1, 2]} />,
  document.body
);
