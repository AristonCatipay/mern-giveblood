import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

import { isTokenValid } from "../utils/auth";

export default function ProfileDetails() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAlert, setShowAlert] = useState(null);

  const handleShowAlert = (message, variant = "success") => {
    setShowAlert({ message, variant });
    setTimeout(() => {
      setShowAlert(null);
    }, 3000);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInformationAndPosts = async () => {
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

    fetchUserInformationAndPosts();
  }, [navigate]);
  return <div>ProfileDetails</div>;
}
