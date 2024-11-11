import { useParams } from "react-router-dom";
function Case() {
  let { id } = useParams();
  return <h1>DRNO: {id}</h1>;
}
export default Case;
