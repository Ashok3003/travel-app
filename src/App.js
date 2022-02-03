import logo from "./logo.svg";
import "./App.css";
import {
  Button,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Navbar,
  NavbarToggler,
  Input,
  Label,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect, useState } from "react";
import { CustomMessage } from "./customMessage";
import { useSnackbar } from "notistack";
import axios from "axios";
import moment from "moment";
import MapRoute from "./MapRoute";

const CHECK_IN_LATITUDE = "CHECK_IN_LATITUDE";
const CHECK_IN_LONGITUDE = "CHECK_IN_LONGITUDE";

const CHECK_IN_LOCATION = "CHECK_IN_LOCATION";

const CHECK_OUT_LATITUDE = "CHECK_OUT_LATITUDE";
const CHECK_OUT_LONGITUDE = "CHECK_OUT_LONGITUDE";

const CHECK_OUT_LOCATION = "CHECK_OUT_LOCATION";

const TRAVEL_AMOUNT = "TRAVEL_AMOUNT";

const API_END_POINT = `https://api.opencagedata.com/geocode/v1/json?q=`;
const API_KEY = `006e4071afe5461dab7cbdf9de3f20f0`;

function App() {
  const { enqueueSnackbar } = useSnackbar();
  const [showCheckInBtn, setShowCheckInBtn] = useState(false);
  const [modalWidth, setModalWidth] = useState({ width: "100px" });
  const [amount, setAmount] = useState("");
  const [inputVecVal, setInputVecVal] = useState("");
  const [travelName, setTravelName] = useState("");
  const [kiloMeter, setKiloMeter] = useState(0);
  const [isConfirm, setIsConfirm] = useState(false);
  const [modal, setModal] = useState(false);
  const getCheckInCurrentLocation = () => {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition((res) => {
        const coords = res?.coords;
        localStorage.setItem(CHECK_IN_LATITUDE, coords.latitude);
        localStorage.setItem(CHECK_IN_LONGITUDE, coords.longitude);
        axios
          .get(
            `${API_END_POINT}${getCheckInLatitude}+${getCheckInLongitude}&key=${API_KEY}`
          )
          .then((response) => {
            const { data } = response;
            localStorage.setItem(CHECK_IN_LOCATION, data.results[0]?.formatted);
            CustomMessage(
              `You have checked in ${data.results[0]?.formatted}`,
              "success",
              enqueueSnackbar
            );
            setShowCheckInBtn(true);
          });
      });
    }
  };

  const getCheckOutCurrentocation = () => {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition((res) => {
        setShowCheckInBtn(false);
        const coords = res?.coords;
        localStorage.setItem(CHECK_OUT_LATITUDE, coords.latitude);
        localStorage.setItem(CHECK_OUT_LONGITUDE, coords.longitude);
        axios
          .get(
            `${API_END_POINT}${getCheckInLatitude}+${getCheckInLongitude}&key=${API_KEY}`
          )
          .then((response) => {
            const { data } = response;
            localStorage.setItem(
              CHECK_OUT_LOCATION,
              data.results[0]?.formatted
            );
            CustomMessage(
              `You have check out ${data?.results[0]?.formatted}`,
              "success",
              enqueueSnackbar
            );
            setIsConfirm(true);
          });
      });
    }
  };

  const getCheckInLatitude = localStorage.getItem(CHECK_IN_LATITUDE);
  const getCheckInLongitude = localStorage.getItem(CHECK_IN_LONGITUDE);
  const getCheckOutLatitude = localStorage.getItem(CHECK_OUT_LATITUDE);
  const getCheckOutLongitude = localStorage.getItem(CHECK_OUT_LONGITUDE);
  const getCheckInLocation = localStorage.getItem(CHECK_IN_LOCATION);
  const getCheckOutLocation = localStorage.getItem(CHECK_OUT_LOCATION);

  useEffect(() => {
    if (isConfirm) {
      const distance = getDistanceFromLatLonInKm(
        getCheckInLatitude,
        getCheckInLongitude,
        getCheckOutLatitude,
        getCheckOutLongitude
      );
      setKiloMeter(distance);
      // Above 1 km show modal
      // if (!kiloMeter) {
      //   setModal(!modal);
      // }

      if (!kiloMeter) {
        //below 1 km
        setModal(!modal);
      }
    }
  }, [isConfirm]);

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var radius = 6371;
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var average =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var calc = 2 * Math.atan2(Math.sqrt(average), Math.sqrt(1 - average));
    var distance = radius * calc;
    return distance;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  const toggleModal = () => {
    setModal(!modal);
    setIsConfirm(false);
    setShowCheckInBtn(false);
  };

  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = () => {
    localStorage.setItem(TRAVEL_AMOUNT, amount);
    CustomMessage("Amount saved successfully...", "success", enqueueSnackbar);
  };

  const handleTravelType = (e) => {
    setTravelName(e.target.name);
  };
  const handleInputVehicle = (e) => {
    setInputVecVal(e.target.name);
  };

  return (
    <div className="root">
      <Navbar color="faded" light>
        {!showCheckInBtn && (
          <NavbarToggler
            style={{
              backgroundColor: "#1f7837",
              color: "white",
              fontWeight: "600",
              fontSize: "18px",
              fontFamily: "sans-serif",
            }}
            onClick={getCheckInCurrentLocation}
          >
            Check In
          </NavbarToggler>
        )}
        {showCheckInBtn && (
          <NavbarToggler
            style={{
              backgroundColor: "#e01c19",
              color: "white",
              fontWeight: "600",
              fontSize: "18px",
              fontFamily: "sans-serif",
            }}
            onClick={getCheckOutCurrentocation}
          >
            Check Out
          </NavbarToggler>
        )}
      </Navbar>

      <Modal isOpen={modal} toggle={getCheckInCurrentLocation}>
        <ModalHeader toggle={toggleModal}>
          You have travelved {kiloMeter} km
        </ModalHeader>
        <ModalBody>
          <div style={{ display: "flex", width: "100%", padding: "0%" }}>
            <Col
              style={{
                justifyContent: "flex-start",
                fontSize: "15px",
                fontWeight: "700",
              }}
            >
              From (
              <span style={{ color: "#226ce3" }}>{getCheckInLocation}</span>)
            </Col>
            <Col
              style={{
                textAlign: "center",
                fontSize: "15px",
                fontWeight: "bolder",
              }}
            >
              --
            </Col>
            <Col
              style={{
                justifyContent: "flex-end",
                alignItems: "flex-end",
                textAlign: "end",
                fontSize: "15px",
                fontWeight: "700",
              }}
            >
              To (
              <span style={{ color: "#226ce3" }}>{getCheckOutLocation}</span>)
            </Col>
          </div>
          <div
            style={{
              marginTop: "20px",
              marginLeft: "10rem",
            }}
          >
            <Label check style={{ fontSize: "15px", fontWeight: "500" }}>
              <Input
                type="radio"
                name="self"
                onChange={handleTravelType}
                checked={travelName === "self"}
              />{" "}
              Self
            </Label>
            <Label
              check
              style={{
                marginLeft: "50px",
                fontSize: "15px",
                fontWeight: "500",
              }}
            >
              <Input
                type="radio"
                name="public"
                onChange={handleTravelType}
                checked={travelName === "public"}
              />{" "}
              Public
            </Label>
            {travelName === "self" && (
              <Row>
                <div style={{ marginTop: "15px" }}>
                  <Col sm="12">
                    <Label style={{ fontSize: "15px", fontWeight: "500" }}>
                      <Input
                        type="radio"
                        name="twoWheeler"
                        checked={inputVecVal === "twoWheeler"}
                        onChange={handleInputVehicle}
                      />{" "}
                      Two Wheeler
                    </Label>
                  </Col>
                  <Col sm="12">
                    <Label
                      check
                      style={{ fontSize: "15px", fontWeight: "500" }}
                    >
                      <Input
                        type="radio"
                        name="fourWheeler"
                        checked={inputVecVal === "fourWheeler"}
                        onChange={handleInputVehicle}
                      />{" "}
                      Four Wheeler
                    </Label>
                  </Col>
                </div>
              </Row>
            )}
            {travelName === "public" && (
              <Row>
                <Col sm="12">
                  <form onSubmit={handleSubmit}>
                    <input
                      placeholder="Enter a amount"
                      className="inpt"
                      onChange={handleChange}
                      value={amount}
                    />
                    <Button
                      color="success"
                      type="submit"
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </form>
                </Col>
              </Row>
            )}
          </div>
          <MapRoute />
        </ModalBody>
      </Modal>
    </div>
  );
}

export default App;
