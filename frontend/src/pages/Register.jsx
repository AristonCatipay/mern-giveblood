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
  const [gender, setGender] = useState();
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bloodType, setBloodType] = useState();
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      handleShowAlert("Please fill in all fields.", "warning");
      return;
    }

    if (password != confirmPassword) {
      handleShowAlert("Passwords doesn't match.", "warning");
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
            gender,
            dateOfBirth,
            bloodType,
            contactNumber,
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

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Confirm Password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGender">
          <Form.Label>Gender:</Form.Label>
          <Form.Select
            value={gender}
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
            value={bloodType}
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
            value={dateOfBirth ? dateOfBirth.toISOString().split("T")[0] : ""}
            onChange={(event) => setDateOfBirth(new Date(event.target.value))}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formContactNumber">
          <Form.Label>Contact Number:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter contact number:"
            value={contactNumber}
            onChange={(event) => setContactNumber(event.target.value)}
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
