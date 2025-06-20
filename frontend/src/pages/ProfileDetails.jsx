import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";

import { isTokenValid } from "../utils/auth";

export default function ProfileDetails() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAlert, setShowAlert] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState();
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bloodType, setBloodType] = useState();
  const [contactNumber, setContactNumber] = useState("");

  const handleShowAlert = (message, variant = "success") => {
    setShowAlert({ message, variant });
    setTimeout(() => {
      setShowAlert(null);
    }, 3000);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        const storedToken = localStorage.getItem("jwtToken");

        if (!storedToken) {
          navigate("/login");
          return;
        }

        if (!isTokenValid(storedToken)) {
          localStorage.removeItem("jwtToken");
          navigate("/login");
          return;
        }

        // Fetch current user data
        const userResponse = await fetch(
          `${import.meta.env.VITE_APP_BASE_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          setError(errorData.error || "Failed to retrieve user information.");
          setIsLoading(false);
          return;
        }

        const userData = await userResponse.json();
        setCurrentUser(userData);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInformation();
  }, [navigate]);

  const handleUpdate = async () => {
    try {
      const storedToken = localStorage.getItem("jwtToken");
      if (!storedToken) {
        navigate("/login");
        return;
      }

      if (!isTokenValid(storedToken)) {
        localStorage.removeItem("jwtToken");
        navigate("/login");
        return;
      }

      const updatedProfile = {
        firstName: firstName !== "" ? firstName : currentUser.firstName,
        middleName: middleName !== "" ? middleName : currentUser.middleName,
        lastName: lastName !== "" ? lastName : currentUser.lastName,
        age: age !== "" ? age : currentUser.age,
        email: email !== "" ? email : currentUser.email,
        gender: gender !== "" ? gender : currentUser.gender,
        dateOfBirth: dateOfBirth !== "" ? dateOfBirth : currentUser.dateOfBirth,
        bloodType: bloodType !== "" ? bloodType : currentUser.bloodType,
        contactNumber:
          contactNumber !== "" ? contactNumber : currentUser.contactNumber,
      };

      const response = await fetch(
        `${import.meta.env.VITE_APP_BASE_URL}/api/users/me/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify(updatedProfile),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        handleShowAlert(data.error || "Failed to update post.", "danger");
        return;
      }

      const data = await response.json();
      handleShowAlert(`${data.message} Redirecting...`);
      setTimeout(() => {
        navigate("/posts");
      }, 3000);
    } catch (error) {
      console.error("Failed:", error.message);
      handleShowAlert("An unexpected error occured.", "danger");
    }
  };

  return (
    <>
      {showAlert && (
        <Alert variant={showAlert.variant}>{showAlert.message}</Alert>
      )}

      {/* User Information Section */}
      <h2 className="mb-3">Your Profile</h2>
      {currentUser && (
        <>
          <Form.Group className="mb-3" controlId="formBasicFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              defaultValue={currentUser.firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicMiddleName">
            <Form.Label>Middle Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter middle name"
              defaultValue={currentUser.middleName}
              onChange={(event) => setMiddleName(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              defaultValue={currentUser.lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicAge">
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter age"
              defaultValue={currentUser.age}
              onChange={(event) => setAge(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicLastName">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              defaultValue={currentUser.email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGender">
            <Form.Label>Gender:</Form.Label>
            <Form.Select
              defaultValue={currentUser.gender}
              onChange={(event) => setGender(event.target.value)}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBloodType">
            <Form.Label>Blood Type:</Form.Label>
            <Form.Select
              defaultValue={currentUser.bloodType}
              onChange={(event) => setBloodType(event.target.value)}
            >
              <option value="">Select blood type</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDOB">
            <Form.Label>Date of Birth:</Form.Label>
            <Form.Control
              type="date"
              defaultValue={
                dateOfBirth ? dateOfBirth.toISOString().split("T")[0] : ""
              }
              onChange={(event) => setDateOfBirth(new Date(event.target.value))}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formContactNumber">
            <Form.Label>Contact Number:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter contact number:"
              defaultValue={currentUser.contactNumber}
              onChange={(event) => setContactNumber(event.target.value)}
            />
          </Form.Group>

          <Button variant="primary" className="m-2" onClick={handleUpdate}>
            Update
          </Button>
        </>
      )}
    </>
  );
}
