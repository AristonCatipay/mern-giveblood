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
  const [username, setUsername] = useState("");

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
        username: username !== "" ? username : currentUser.username,
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

          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              defaultValue={currentUser.username}
              onChange={(event) => setUsername(event.target.value)}
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
