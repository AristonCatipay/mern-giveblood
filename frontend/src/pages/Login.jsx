import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../components/AlertComponent";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { showAlert, AlertComponent } = useAlert();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      showAlert("Please fill in all the fields.", "warning");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BASE_URL}/api/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        showAlert(data.error || "Login failed.", "danger");
        return;
      }

      const data = await response.json();

      if (!data.token) {
        showAlert("Login failed. No token received.", "danger");
        return;
      }

      localStorage.setItem("jwtToken", data.token);
      showAlert("Login successful! Redirecting..");
      setTimeout(() => {
        navigate("/posts");
      }, 3000);
    } catch (error) {
      console.error("Failed:", error.message);
      showAlert("An unexpected error occurred.", "danger");
    }
  };

  return (
    <>
      <AlertComponent />
      <h1>Login Page</h1>
      <Form onSubmit={handleSubmit}>
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
          Login
        </Button>
      </Form>
    </>
  );
}

export default Login;
