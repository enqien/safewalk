import logo from "./logo.svg";
import axios from "axios";
import "./Home.css";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import photo from "./SafeWalkLA1.png";
import CrimeReportForm from "./CrimeReportForm";
import UpdateForm from "./UpdateForm";
import { Button, Flex } from "antd";
import SideDrawer from "./SideDrawer";
import Chart from "./Chart";
import CrimeMap from "./CrimeMap";

const token = localStorage.getItem("token");

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
};

const api = axios.create();
function Home() {
  const [areas, setAreas] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [rate, setRate] = useState([]);
  const [DR_NO, setDR_NO] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawerHandler = () => {
    setDrawerOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerOpen(false);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const openUpdateModal = useCallback((DR_NO) => {
    console.log(DR_NO);
    setDR_NO(DR_NO);
    setUpdateModalOpen(true);
  }, []);

  const closeUpdateModal = () => {
    setUpdateModalOpen(false);
  };

  useEffect(() => {
    api
      .get("http://localhost:8080/areacode", options)
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          setAreas(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // const handlerate = () => {
  //   api.get("http://127.0.0.1:5000/rate", options).then((res) => {
  //     if (res.data) {
  //       console.log(res.data);
  //       setRate(res.data.response);
  //     }
  //   });
  // };
  const calculate_avg = useMemo(() => {
    console.log("calculated");
    let total = 0;
    areas.forEach((item, index) => {
      total += item.crime_num;
    });
    return Math.floor(total / areas.length);
  }, [areas]);

  return (
    <div>
      <div className="App">
        <img src={photo} alt="Image Description"></img>
      </div>
      <h1>☆SafeWalkLA☆</h1>
      <button className="open-btn" onClick={openDrawerHandler}>
        Open Drawer
      </button>
      <h2>-Top 5 Dangerous Places-</h2>
      <h3>Average crime cases: {calculate_avg}</h3>
      <div className="transform-tester">test translate</div>
      <div className="single-line">
        This is a single line text content that will be truncated if it exceeds
        the container width.
      </div>
      <div className="multi-line">
        This is a multi-line text content that will be truncated if it exceeds
        the container height. This is a multi-line text content that will be
        truncated if it exceeds the container height. This is a multi-line text
        content that will be truncated if it exceeds the container height.
      </div>
      <div className="test-visibility">test visibility</div>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>

      {areas.length !== 0 ? (
        <ul>
          {areas.map((todo) => (
            <BlockWithDetails
              key={todo.Area}
              todo={todo}
              openUpdateModal={openUpdateModal}
            />
          ))}
        </ul>
      ) : (
        <div className="spinner"></div>
      )}
      <button className="newcasebutton" onClick={openModal}>
        New Case
      </button>
      <Modal isOpen={isModalOpen} closeModal={closeModal} />
      <ModalForUpdate
        isOpen={isUpdateModalOpen}
        closeModal={closeUpdateModal}
        DR_NO={DR_NO}
      />
      <SideDrawer show={drawerOpen} closeDrawer={closeDrawerHandler} />
      <Chart />
      <h1>Crime Hotspots</h1>
      <CrimeMap />
    </div>
  );
}

export default Home;

function areEqual(prevProps, nextProps) {
  if (
    prevProps.todo.Area === nextProps.todo.Area &&
    prevProps.todo.AreaName === nextProps.todo.AreaName &&
    prevProps.todo.crime_num === nextProps.todo.crime_num &&
    prevProps.openUpdateModal === nextProps.openUpdateModal
  ) {
    return true;
  }
  return false;
}
const BlockWithDetails = memo((props) => {
  // State to manage the visibility of details for each block
  // console.log(props.todo);
  console.log("block with key " + props.todo.Area + " refreshed");
  const [showDetails, setShowDetails] = useState(false);

  // Function to toggle the visibility of details for each block
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div key={props.todo.Area}>
      <div className="areablock">
        <span>{props.todo.AreaName}</span>
        <div className="crimeNum">
          Number of crime cases: {props.todo.crime_num}
        </div>
        <button className="togglebutton" onClick={toggleDetails}>
          show cases
        </button>
      </div>

      {showDetails && (
        <Dropdown
          openUpdateModal={props.openUpdateModal}
          Area={props.todo.Area}
        />
      )}
    </div>
  );
}, areEqual);

function Dropdown(props) {
  const [areas, setAreas] = useState([]);
  const [cases, setCases] = useState([]);
  const [deletedCases, setDeletedCases] = useState([]);
  // console.log(props.AreaCode);
  useEffect(() => {
    api
      .get("http://localhost:8080/cases/" + props.Area, options)
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          setCases(res.data);
        }
      });
  }, []);

  const handleDelete = (DR_NO) => {
    console.log(DR_NO);
    api
      .delete("http://localhost:8080/cases/" + DR_NO, options)
      .then((response) => response.data)
      .then((data) => {
        console.log("Response from server:", data);
        setDeletedCases([...deletedCases, DR_NO]);
        alert("delete successfully");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    // window.location.reload();
  };

  const handleUpdate = (DR_NO) => {
    props.openUpdateModal(DR_NO);
  };

  return (
    <div className="dropdowncontainer">
      {cases.map((item) => (
        <div key={item.DR_NO}>
          <span>
            Date: {item.DateReported} Location: {item.Location} Description:{" "}
            {item.CrmCdDesc}
          </span>
          <button className="update" onClick={() => handleUpdate(item.DR_NO)}>
            Update
          </button>
          <button className="delete" onClick={() => handleDelete(item.DR_NO)}>
            Delete
          </button>
          {/* <button className="update" onClick={updateTodo(item.DR_NO, newText)}>Update</button>
        <button className="delete" onClick={deleteCases(item.DR_NO)}>Delete</button> */}
        </div>
      ))}
    </div>
  );
}

// function SearchBar() {
//   const [searchTerm, setSearchTerm] = useState([""]);
//   const [searchAreas, setSearchAreas] = useState([]);
//   useEffect(() => {
//     if (count === 1 || count === 2) {
//       count++;
//       return;
//     }
//     if (searchTerm === "") {
//       return;
//     }
//     console.log(searchTerm);
//     api
//       .get("http://127.0.0.1:5000/search/" + searchTerm, options)
//       .then((res) => {
//         if (res.data) {
//           console.log(res.data);
//           setSearchAreas(res.data.response);
//         }
//       });
//   }, [searchTerm]);

//   return (
//     <div>
//       <div>
//         <input
//           type="text"
//           placeholder="Search Location..."
//           onKeyDown={(e) => {
//             if (e.key === "Enter") {
//               setSearchTerm(e.target.value);
//               e.target.value = "";
//             }
//           }}
//         />
//       </div>
//       <ul>
//         {searchAreas.map((todo) => (
//           <BlockWithDetails key={todo.Area} todo={todo} />
//         ))}
//       </ul>
//     </div>
//   );
// }

const Modal = ({ isOpen, closeModal }) => {
  const modalStyle = {
    display: isOpen ? "block" : "none",
    // add other styles as needed
  };

  return (
    <div className="modal" style={modalStyle}>
      <div className="modal-content">
        <h1 className="insert-header">Insert New Case</h1>
        <CrimeReportForm closeModal={closeModal} />
        <Flex gap="small" justify="flex-end">
          <Button type="primary" htmlType="submit" form="insert-form">
            Submit
          </Button>
          <Button
            className="form-buttom"
            type="primary"
            htmlType="reset"
            form="insert-form"
          >
            Reset
          </Button>
          <Button className="form-buttom" onClick={closeModal}>
            Close
          </Button>
        </Flex>
      </div>
    </div>
  );
};

const ModalForUpdate = ({ isOpen, closeModal, DR_NO }) => {
  const modalStyle = {
    display: isOpen ? "block" : "none",
    // add other styles as needed
  };

  return (
    <div className="modal" style={modalStyle}>
      <div className="modal-content">
        <p>Update this case</p>
        <UpdateForm DR_NO={DR_NO} closeModal={closeModal} />
        <Flex gap="small" justify="flex-end">
          <Button type="primary" htmlType="submit" form="update-form">
            Submit
          </Button>
          <Button
            className="form-buttom"
            type="primary"
            htmlType="reset"
            form="update-form"
          >
            Reset
          </Button>
          <Button className="form-buttom" onClick={closeModal}>
            Close
          </Button>
        </Flex>
      </div>
    </div>
  );
};

// function ShowAvgAge() {
//   const [CrimeCode, setCrimeCode] = useState([]);
//   const [avgAge, setAvgAge] = useState([]);
//   const handlecalculate = () => {
//     if (countAge === 1) {
//       countAge++;
//       return;
//     }
//     if (CrimeCode === "") {
//       return;
//     }
//     api
//       .get("http://127.0.0.1:5000/avgAge/" + CrimeCode, options)
//       .then((res) => {
//         if (res.data) {
//           console.log(res.data);
//           setAvgAge(res.data.response);
//         }
//       });
//   };

//   return (
//     <div>
//       <div>
//         <input
//           type="number"
//           placeholder="input CrimeCode..."
//           onKeyDown={(e) => {
//             if (e.key === "Enter") {
//               setCrimeCode(e.target.value);
//               handlecalculate();
//               e.target.value = "";
//             }
//           }}
//         />
//       </div>
//       <ul>
//         {avgAge.map((todo) => (
//           <AvgAgeBlock key={todo.CrimeCode} todo={todo} />
//         ))}
//       </ul>
//     </div>
//   );
// }

// const AvgAgeBlock = (props) => {
//   return (
//     <div>
//       <div>
//         <span>
//           CrimeCode: {props.todo.CrimeCode}, CrimeDesc: {props.todo.CrimeDesc}
//         </span>
//         <div className="avgAge">Average Age: {props.todo.avgAge}</div>
//         <div className="avgAgeGroup">
//           Average Age Group: {props.todo.ageGroup}
//         </div>
//       </div>
//     </div>
//   );
// };

// const RateBlock = (props) => {
//   return (
//     <div>
//       <div>
//         <span>Month: {props.todo.Month}</span>
//         <span className="rate"> Increase Rate: {props.todo.rate}</span>
//       </div>
//     </div>
//   );
// };
