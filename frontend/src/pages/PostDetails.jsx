import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

import { isTokenValid } from "../utils/auth";

function PostDetails() {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userIsAuthor, setUserIsAuthor] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientMiddleName, setPatientMiddleName] = useState("");
  const [patientLastName, setPatientLastName] = useState("");
  const [bagsNeeded, setBagsNeeded] = useState("");

  const [showAlert, setShowAlert] = useState(null);

  const handleShowAlert = (message, variant = "success") => {
    setShowAlert({ message, variant });
    setTimeout(() => {
      setShowAlert(null);
    }, 3000);
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
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

        const response = await fetch(
          `${import.meta.env.VITE_APP_BASE_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch current user");
        const userData = await response.json();
        setCurrentUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error.message);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
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

        const response = await fetch(
          `${import.meta.env.VITE_APP_BASE_URL}/api/posts/${id}`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        if (!response.ok) {
          const data = await response.json();
          handleShowAlert(data.error || "Failed to retrieve post.", "danger");
          return;
        }

        const postDetails = await response.json();
        setPost(postDetails);
      } catch (error) {
        console.error("Failed:", error.message);
        handleShowAlert("An unexpected error occured.", "danger");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  useEffect(() => {
    if (post && currentUser) {
      setUserIsAuthor(post.author._id === currentUser._id);
    }
  }, [post, currentUser]);

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

      const updatedPost = {
        title: title !== "" ? title : post.title,
        description: description !== "" ? description : post.description,
        patientFirstName:
          patientFirstName !== "" ? patientFirstName : post.patientFirstName,
        patientMiddleName:
          patientMiddleName !== "" ? patientMiddleName : post.patientMiddleName,
        patientLastName:
          patientLastName !== "" ? patientLastName : post.patientLastName,
        bagsNeeded: bagsNeeded !== "" ? bagsNeeded : post.bagsNeeded,
      };

      const response = await fetch(
        `${import.meta.env.VITE_APP_BASE_URL}/api/posts/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify(updatedPost),
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

  const handleDelete = async () => {
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

      const response = await fetch(
        `${import.meta.env.VITE_APP_BASE_URL}/api/posts/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        handleShowAlert(data.error || "Failed to delete post.", "danger");
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

  if (isLoading) return <Spinner animation="border" variant="info" />;

  return (
    <>
      {showAlert && (
        <Alert variant={showAlert.variant}>{showAlert.message}</Alert>
      )}
      {userIsAuthor ? (
        <>
          <Form.Group className="mb-3" controlId="formBasicTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              defaultValue={post.title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              placeholder="Enter description"
              defaultValue={post.description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicTitle">
            <Form.Label>Patient First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter patient first name"
              defaultValue={post.patientFirstName}
              onChange={(event) => setPatientFirstName(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicTitle">
            <Form.Label>Patient Middle Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter patient middle name"
              defaultValue={post.patientMiddleName}
              onChange={(event) => setPatientMiddleName(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicTitle">
            <Form.Label>Patient Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter patient last name"
              defaultValue={post.patientLastName}
              onChange={(event) => setPatientLastName(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicTitle">
            <Form.Label>Bags Needed</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter bags needed"
              defaultValue={post.bagsNeeded}
              onChange={(event) => setBagsNeeded(event.target.value)}
            />
          </Form.Group>

          <Button variant="primary" className="m-2" onClick={handleUpdate}>
            Update
          </Button>
          <Button variant="danger" className="m-2" onClick={handleDelete}>
            Delete
          </Button>
        </>
      ) : (
        post && (
          <Card key={post._id}>
            <Card.Header>{post.author.username}</Card.Header>
            <Card.Body>
              <Card.Title>{post.title}</Card.Title>
              <Card.Text>{post.description}</Card.Text>
            </Card.Body>
          </Card>
        )
      )}
    </>
  );
}

export default PostDetails;
