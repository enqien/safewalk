import React, { useEffect, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import axios from "axios";
import { Select } from "antd";
const token = localStorage.getItem("token");

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
};

const api = axios.create();
function Chart() {
  const [chartData, setChartData] = useState([]);
  const [year, setYear] = useState("2020");
  useEffect(() => {
    api.get("http://localhost:8080/chartdata/" + year, options).then((res) => {
      if (res.data) {
        console.log(res.data.response);
        setChartData(
          res.data.response.map((item) => {
            return item.Count;
          })
        );
      }
    });
  }, [year]);
  function handleChange(value) {
    console.log(value);
    setYear(value);
  }
  const option = {
    xAxis: {
      type: "category",
      data: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: chartData,
        type: "line",
      },
    ],
  };
  return (
    <div>
      <Select
        defaultValue="2020"
        style={{
          width: 120,
        }}
        onChange={handleChange}
        options={[
          {
            value: "2020",
            label: "2020",
          },
          {
            value: "2021",
            label: "2021",
          },
          {
            value: "2022",
            label: "2022",
          },
          {
            value: "2023",
            label: "2023",
          },
          {
            value: "2024",
            label: "2024",
          },
        ]}
      />
      <ReactECharts
        option={option}
        style={{ height: "400px", width: "100%" }}
      />
    </div>
  );
}
export default Chart;
