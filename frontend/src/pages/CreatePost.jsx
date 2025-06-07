import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

import { isTokenValid } from "../utils/auth";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientMiddleName, setPatientMiddleName] = useState("");
  const [patientLastName, setPatientLastName] = useState("");
  const [bagsNeeded, setBagsNeeded] = useState("");
  const [showAlert, setShowAlert] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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

    setToken(storedToken);
  }, [navigate]);

  const handleShowAlert = (message, variant = "success") => {
    setShowAlert({ message, variant });
    setTimeout(() => {
      setShowAlert(null);
    }, 3000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowAlert(null);

    try {
      if (!token || !isTokenValid(token)) {
        localStorage.removeItem("jwtToken");
        return navigate("/login");
      }

      const response = await fetch(
        `${import.meta.env.VITE_APP_BASE_URL}/api/posts/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            patientFirstName,
            patientMiddleName,
            patientLastName,
            bagsNeeded,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        handleShowAlert(data.error || "Failed to create a post.", "danger");
        throw new Error(response.status);
      }

      handleShowAlert("Post created successfully! Redirecting...");
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
      <h1>Create post</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            onChange={(event) => setTitle(event.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            placeholder="Enter description"
            onChange={(event) => setDescription(event.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Patient First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter patient first name"
            onChange={(event) => setPatientFirstName(event.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Patient Middle Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter patient middle name"
            onChange={(event) => setPatientMiddleName(event.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Patient Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter patient last name"
            onChange={(event) => setPatientLastName(event.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Bags Needed</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter bags needed"
            onChange={(event) => setBagsNeeded(event.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
}

export default CreatePost;
