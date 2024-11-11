import { Card } from "antd";
import "./AllCases.css";
function AllCases() {
  return (
    <div>
      <h1>all cases</h1>
      <div className="cards-container">
        {" "}
        <Card
          title="Default size card"
          extra={<a href="#">More</a>}
          style={{
            width: 800,
          }}
        >
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
      </div>
    </div>
  );
}
export default AllCases;
