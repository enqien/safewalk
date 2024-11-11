import React, { useEffect, useState } from "react";
import "./CrimeReportForm.css";
import axios from "axios";
import dayjs from "dayjs";
import {
  Button,
  Checkbox,
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
} from "antd";
const token = localStorage.getItem("token");

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
};

const api = axios.create();
const UpdateForm = (props) => {
  const [crime, setCrime] = useState([]);
  const [status, setStatus] = useState([]);
  const [weapon, setWeapon] = useState([]);
  const [area, setArea] = useState([]);
  const [premis, setPremis] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    console.log(props.DR_NO);
    if (props.DR_NO) {
      api
        .get("http://localhost:8080/case/" + props.DR_NO, options)
        .then((res) => {
          if (res.data) {
            const updatedData = {
              ...res.data.response,
              DateOccurred: dayjs(res.data.response.DateOccurred),
              DateReported: dayjs(res.data.response.DateReported),
            };
            form.setFieldsValue(updatedData);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [props.DR_NO]);

  useEffect(() => {
    api.get("http://localhost:8080/crime", options).then((res) => {
      if (res.data) {
        setCrime(
          res.data.map((item) => {
            return { label: item.CrmCdDesc, value: item.CrmCd };
          })
        );
      }
    });
    api.get("http://localhost:8080/premis", options).then((res) => {
      if (res.data) {
        setPremis(
          res.data.map((item) => {
            return { label: item.PremisDesc, value: item.PremisCd };
          })
        );
      }
    });
    api.get("http://localhost:8080/area", options).then((res) => {
      if (res.data) {
        setArea(
          res.data.map((item) => {
            return { label: item.AreaName, value: item.Area };
          })
        );
      }
    });
    api.get("http://localhost:8080/weapon", options).then((res) => {
      if (res.data) {
        setWeapon(
          res.data.map((item) => {
            return { label: item.WeaponDesc, value: item.WeaponUsedCd };
          })
        );
      }
    });
    api.get("http://localhost:8080/status", options).then((res) => {
      if (res.data) {
        setStatus(
          res.data.map((item) => {
            return { label: item.StatusDesc, value: item.StatusCd };
          })
        );
      }
    });
  }, []);
  // const handleInputChange = (e) => {
  //   console.log(e.target);
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };
  const onFinish = (values) => {
    api
      .put("http://localhost:8080/cases/" + props.DR_NO, values, options)
      .then((response) => response.data)
      .then((data) => {
        props.closeModal();
        alert("edit case with id " + props.DR_NO + " successfully");
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // window.location.reload();
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    alert("edit failed!!!");
  };

  return (
    <Form
      name="basic"
      labelCol={{
        span: 10,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      id="update-form"
      form={form}
    >
      <h1 className="input-header">Time</h1>
      <div className="row">
        <Form.Item
          label="DateReported"
          name="DateReported"
          rules={[
            {
              required: true,
              message: "Please input DateReported!",
            },
          ]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          label="DateOccurred"
          name="DateOccurred"
          rules={[
            {
              required: true,
              message: "Please input DateOccurred!",
            },
          ]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          label="TimeOccurred"
          name="TimeOccurred"
          rules={[
            {
              required: true,
              message: "TimeOccurred",
            },
          ]}
        >
          <InputNumber type="number" />
        </Form.Item>
      </div>
      <h1 className="input-header">Crime Info</h1>
      <div className="row">
        <Form.Item
          label="Status"
          name="StatusCd"
          rules={[
            {
              required: true,
              message: "TimeOccurred",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Select a status"
            optionFilterProp="label"
            options={status}
          />
        </Form.Item>
        <Form.Item
          label="Crime type"
          name="CrmCd"
          rules={[
            {
              required: true,
              message: "TimeOccurred",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Select a crime"
            optionFilterProp="label"
            options={crime}
          />
        </Form.Item>

        <Form.Item
          label="WeaponUsed"
          name="WeaponUsedCd"
          rules={[
            {
              required: true,
              message: "TimeOccurred",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Select a weapon"
            optionFilterProp="label"
            options={weapon}
          />
        </Form.Item>
      </div>
      <h1 className="input-header">Location</h1>
      <div className="row">
        <Form.Item
          label="Area"
          name="Area"
          rules={[
            {
              required: true,
              message: "TimeOccurred",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Select a area"
            optionFilterProp="label"
            options={area}
          />
        </Form.Item>
        <Form.Item
          label="Premis"
          name="PremisCd"
          rules={[
            {
              required: true,
              message: "TimeOccurred",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Select a premis"
            optionFilterProp="label"
            options={premis}
          />
        </Form.Item>
        <Form.Item
          label="Location"
          name="Location"
          rules={[
            {
              required: true,
              message: "TimeOccurred",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </div>
      <h1 className="input-header">Victim info</h1>
      <div className="row">
        <Form.Item
          label="Victim Age"
          name="VictAge"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber type="number" />
        </Form.Item>

        <Form.Item
          label="Victim Sex"
          name="VictSex"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Victim Descent"
          name="VictDescent"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
      </div>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      ></Form.Item>
    </Form>
  );
};

export default UpdateForm;
