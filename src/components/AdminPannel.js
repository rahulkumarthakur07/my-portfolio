import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
  Nav,
  Spinner,
} from "react-bootstrap";

const AdminPanel = () => {
  // Auth state
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState("");
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Project form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imgPath, setImgPath] = useState("");
  const [ghLink, setGhLink] = useState("");
  const [demoLink, setDemoLink] = useState("");
  const [isBlog, setIsBlog] = useState(false);

  // Extra Links (label + url)
  const [extraLinks, setExtraLinks] = useState([]);

  // Projects list
  const [projects, setProjects] = useState([]);

  // Listen to auth state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      setLoadingUser(false);
      if (usr) fetchProjects();
    });
    return () => unsubscribe();
  }, []);

  // Fetch projects from Firestore
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const querySnapshot = await getDocs(collection(db, "projects"));
      const projs = [];
      querySnapshot.forEach((doc) => {
        projs.push({ id: doc.id, ...doc.data() });
      });
      setProjects(projs);
    } catch (err) {
      setError("Failed to load projects.");
    }
    setLoadingProjects(false);
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut(auth);
    setProjects([]);
  };

  // Add new project
  const handleAddProject = async (e) => {
    e.preventDefault();
    setError("");
    if (!title || !description) {
      setError("Title and description are required.");
      return;
    }
    try {
      await addDoc(collection(db, "projects"), {
        title,
        description,
        imgPath,
        ghLink,
        demoLink,
        isBlog,
        extraLinks: extraLinks.filter(
          (link) => link.label.trim() && link.url.trim()
        ),
      });
      // Clear form
      setTitle("");
      setDescription("");
      setImgPath("");
      setGhLink("");
      setDemoLink("");
      setIsBlog(false);
      setExtraLinks([]);
      fetchProjects();
    } catch (err) {
      setError("Failed to add project.");
    }
  };

  // Delete a project
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "projects", id));
      fetchProjects();
    } catch (err) {
      setError("Failed to delete project.");
    }
  };

  // Extra Links handlers
  const handleAddExtraLink = () => {
    setExtraLinks([...extraLinks, { label: "", url: "" }]);
  };

  const handleRemoveExtraLink = (index) => {
    const newLinks = [...extraLinks];
    newLinks.splice(index, 1);
    setExtraLinks(newLinks);
  };

  const handleExtraLinkChange = (index, field, value) => {
    const newLinks = [...extraLinks];
    newLinks[index][field] = value;
    setExtraLinks(newLinks);
  };

  // If still checking auth state
  if (loadingUser) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  // If not logged in, show login form (centered)
  if (!user) {
    return (
      <Container
        style={{
          maxWidth: "400px",
          marginTop: "100px",
        }}
      >
        <Card>
          <Card.Body>
            <h3 className="mb-4 text-center">Admin Login</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Login
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  // If logged in, show full-screen admin panel with sidebar and main content
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Sidebar */}
      <nav
        style={{
          width: 240,
          backgroundColor: "#212529",
          color: "white",
          display: "flex",
          flexDirection: "column",
          padding: "1rem",
          boxShadow: "2px 0 5px rgba(0,0,0,0.2)",
        }}
      >
        <h2
          style={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            marginBottom: "2rem",
            userSelect: "none",
          }}
        >
          Admin Panel
        </h2>

        <Nav className="flex-column" style={{ flexGrow: 1 }}>
          <Nav.Link
            href="#"
            active
            style={{ color: "white", padding: "0.5rem 1rem" }}
            onClick={(e) => e.preventDefault()}
          >
            Manage Projects
          </Nav.Link>
          {/* You can add more sidebar items here */}
        </Nav>

        <div>
          <Button
            variant="outline-light"
            className="w-100"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </nav>

      {/* Main content */}
      <main
        style={{
          flexGrow: 1,
          overflowY: "auto",
          backgroundColor: "#f8f9fa",
          padding: "2rem 3rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h1 style={{ marginBottom: "1.5rem" }}>Manage Projects</h1>

        {error && (
          <Alert
            variant="danger"
            onClose={() => setError("")}
            dismissible
            className="mb-4"
          >
            {error}
          </Alert>
        )}

        {/* Add Project Form */}
        <Card className="mb-5 shadow-sm" style={{ borderRadius: 8 }}>
          <Card.Body>
            <h5 className="mb-4">Add New Project</h5>
            <Form onSubmit={handleAddProject}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formTitle">
                    <Form.Label>Title *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Project Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      autoComplete="off"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formImgPath">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control
                      type="url"
                      placeholder="https://example.com/image.png"
                      value={imgPath}
                      onChange={(e) => setImgPath(e.target.value)}
                      autoComplete="off"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label>Description *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Project description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formGhLink">
                    <Form.Label>GitHub Link</Form.Label>
                    <Form.Control
                      type="url"
                      placeholder="https://github.com/username/project"
                      value={ghLink}
                      onChange={(e) => setGhLink(e.target.value)}
                      autoComplete="off"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formDemoLink">
                    <Form.Label>Demo Link</Form.Label>
                    <Form.Control
                      type="url"
                      placeholder="https://demo.example.com"
                      value={demoLink}
                      onChange={(e) => setDemoLink(e.target.value)}
                      autoComplete="off"
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Extra Links Inputs */}
              <Form.Label>Extra Links (Optional)</Form.Label>
              {extraLinks.map((link, idx) => (
                <Row key={idx} className="mb-2 align-items-center">
                  <Col md={4}>
                    <Form.Control
                      type="text"
                      placeholder="Label (e.g. YouTube, Docs)"
                      value={link.label}
                      onChange={(e) =>
                        handleExtraLinkChange(idx, "label", e.target.value)
                      }
                      autoComplete="off"
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Control
                      type="url"
                      placeholder="https://example.com"
                      value={link.url}
                      onChange={(e) =>
                        handleExtraLinkChange(idx, "url", e.target.value)
                      }
                      autoComplete="off"
                    />
                  </Col>
                  <Col md={2}>
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveExtraLink(idx)}
                      title="Remove link"
                      style={{ minWidth: 40 }}
                    >
                      &times;
                    </Button>
                  </Col>
                </Row>
              ))}

              <Button
                variant="secondary"
                size="sm"
                onClick={handleAddExtraLink}
                className="mb-3"
              >
                + Add Extra Link
              </Button>

              <Form.Group className="mb-4" controlId="formIsBlog">
                <Form.Check
                  type="checkbox"
                  label="Is Blog?"
                  checked={isBlog}
                  onChange={(e) => setIsBlog(e.target.checked)}
                />
              </Form.Group>

              <Button variant="success" type="submit">
                Add Project
              </Button>
            </Form>
          </Card.Body>
        </Card>

        {/* Projects List */}
        <h4 className="mb-3">Your Projects</h4>

        {loadingProjects ? (
          <div className="text-center my-4">
            <Spinner animation="border" />
          </div>
        ) : projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <Row xs={1} md={3} lg={4} className="g-4">
            {projects.map((proj) => (
              <Col key={proj.id}>
                <Card className="shadow-sm" style={{ borderRadius: 8 }}>
                  {proj.imgPath && (
                    <Card.Img
                      variant="top"
                      src={proj.imgPath}
                      alt={proj.title}
                      style={{ height: "160px", objectFit: "cover" }}
                    />
                  )}
                  <Card.Body>
                    <Card.Title
                      style={{
                        fontWeight: "600",
                        fontSize: "1.1rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {proj.title}
                    </Card.Title>
                    <Card.Text
                      style={{
                        fontSize: "0.9rem",
                        color: "#444",
                        minHeight: 60,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {proj.description}
                    </Card.Text>
                    <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
                      {proj.ghLink && (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          href={proj.ghLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          GitHub
                        </Button>
                      )}
                      {proj.demoLink && (
                        <Button
                          variant="outline-success"
                          size="sm"
                          href={proj.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Demo
                        </Button>
                      )}

                      {/* Render extra links */}
                      {proj.extraLinks &&
                        proj.extraLinks.length > 0 &&
                        proj.extraLinks.map(({ label, url }, i) =>
                          label && url ? (
                            <Button
                              key={i}
                              variant="outline-info"
                              size="sm"
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={label}
                            >
                              {label}
                            </Button>
                          ) : null
                        )}
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "#666",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {proj.isBlog ? "Blog" : "Project"}
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(proj.id)}
                    >
                      Delete
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
