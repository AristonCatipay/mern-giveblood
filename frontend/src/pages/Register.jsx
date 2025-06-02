import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(null);
  const navigate = useNavigate();

  const handleShowAlert = (message, variant = "success") => {
    setShowAlert({ message, variant });
    setTimeout(() => {
      setShowAlert(null);
    }, 3000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowAlert(null);

    if (
      !username ||
      !password ||
      !firstName ||
      !middleName ||
      !lastName ||
      !age ||
      !email
    ) {
      handleShowAlert("Please fill in all fields", "warning");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BASE_URL}/api/users/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            middleName,
            lastName,
            email,
            age,
            username,
            password,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        handleShowAlert(data.error || "Registration failed.", "danger");
        return;
      }

      handleShowAlert("Registration successful! Redirecting ...");
      setTimeout(() => {
        navigate("/login");
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
      <h1>Register Page</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>First Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter first name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Middle Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter middle name"
            value={middleName}
            onChange={(event) => setMiddleName(event.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Last Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter last name:"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Age:</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter age"
            value={age}
            onChange={(event) => setAge(event.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </>
  );
}

export default Register;
