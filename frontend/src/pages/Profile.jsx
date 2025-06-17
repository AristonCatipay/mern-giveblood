import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

import { isTokenValid } from "../utils/auth";

export default function UserPosts() {
  const [posts, setPosts] = useState(null);
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

        // Fetch user posts.
        const postsResponse = await fetch(
          `${import.meta.env.VITE_APP_BASE_URL}/api/posts/user/me`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        if (!postsResponse.ok) {
          const data = await postsResponse.json();
          console.error(data.error || "Failed to retrieve users posts.");
          return;
        }

        const posts = await postsResponse.json();
        setPosts(posts);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInformationAndPosts();
  }, [navigate]);

  if (isLoading || !posts) return <Spinner animation="border" variant="info" />;

  const handleEditProfile = () => {
    navigate("/profile/edit");
  };

  return (
    <>
      {showAlert && (
        <Alert variant={showAlert.variant}>{showAlert.message}</Alert>
      )}
      {/* User Information Section */}
      <h2 className="mb-3">Your Profile</h2>
      {currentUser && (
        <Card className="mb-4">
          <Card.Header>Your Profile</Card.Header>
          <Card.Body>
            <Card.Text>First Name: {currentUser.firstName}</Card.Text>
            <Card.Text>Middle Name: {currentUser.middleName}</Card.Text>
            <Card.Text>Last Name: {currentUser.lastName}</Card.Text>
            <Card.Text>Username: {currentUser.username}</Card.Text>
            <Card.Text>Email: {currentUser.email}</Card.Text>
            {/* Add more user details here if available in your user object */}
            <Button variant="info" onClick={handleEditProfile}>
              Edit Profile
            </Button>
          </Card.Body>
        </Card>
      )}

      {/* User Posts Section */}
      <h2 className="mb-3">Your Posts</h2>
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <Card key={post._id} className="mb-3">
            <Card.Header>{post.author.username}</Card.Header>
            <Card.Body>
              <Card.Title>{post.title}</Card.Title>
              <Card.Text>{post.description}</Card.Text>
              <Button variant="primary" as={Link} to={`/posts/${post._id}`}>
                View Post Details
              </Button>
            </Card.Body>
          </Card>
        ))
      ) : (
        <Card className="mb-3">
          <Card.Header>You haven't created any post yet.</Card.Header>
        </Card>
      )}
    </>
  );
}
