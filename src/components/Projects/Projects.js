import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { FaGithub, FaExternalLinkAlt, FaLink } from "react-icons/fa";

function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const projectsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectsList);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <>
      <style>{`
        .project-section {
          background-color: #9e85ffaa;
          min-height: 100vh;
          padding: 60px 15px 80px;
          color: #d0c5ff;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          overflow-x: hidden;
        }
        .project-heading {
          font-weight: 700;
          font-size: 3rem;
          text-align: center;
          margin-bottom: 10px;
          color: #caa3ff;
          letter-spacing: 1.2px;
        }
        .project-heading .purple {
          color: #d8bfff;
          font-weight: 600;
        }
        .project-description {
          text-align: center;
          font-size: 1.15rem;
          margin-bottom: 50px;
          color: #b9aaffcc;
          max-width: 650px;
          margin-left: auto;
          margin-right: auto;
          font-weight: 400;
          line-height: 1.5;
        }
        .projects-row {
          justify-content: center;
          gap: 24px;
        }
        .project-card {
          background-color: #3a1e70;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(122, 81, 255, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          height: 100%;
          border: 1px solid #9e85ffaa;
          padding: 1rem;
          color: #d0c5ff;
          position: relative;
        }
        .project-card:hover {
          transform: scale(1.03);
          box-shadow: 0 8px 20px rgba(202, 163, 255, 0.2);
          border-color: #b9aaffcc;
        }
        .project-icons {
          margin-top: auto;
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .icon-link {
          color: #caa3ff;
          font-size: 1.6rem;
          transition: color 0.2s ease;
          display: flex;
          align-items: center;
        }
        .icon-link:hover {
          color: #e2bbff;
        }
        .icon-image {
          width: 22px;
          height: 22px;
          margin-right: 6px;
          filter: invert(80%) sepia(20%) saturate(300%) hue-rotate(260deg);
        }
        .loading-text {
          font-style: italic;
          color: #9a8fde;
          font-size: 1.2rem;
          text-align: center;
          margin-top: 40px;
        }
        .project-title {
          font-weight: 600;
          font-size: 1.4rem;
          margin-bottom: 0.5rem;
          color: #d8bfff;
        }
        .project-description-text {
          font-size: 1rem;
          line-height: 1.4;
          color: #cbbfffcc;
          margin-bottom: 1rem;
          flex-grow: 1;
        }
        .project-image {
          width: 100%;
          border-radius: 10px;
          margin-bottom: 1rem;
          object-fit: cover;
          max-height: 180px;
          background-color: #9e85ffaa;
          box-shadow: 0 0 10px #9e85ffaa;
        }
      `}</style>

      <Container fluid className="project-section">
        <Particle />
        <Container>
          <h1 className="project-heading">
            My Recent <strong className="purple">Works</strong>
          </h1>
          <p className="project-description">
            Here are a few projects I've worked on recently.
          </p>

          <Row className="projects-row">
            {projects.length === 0 ? (
              <p className="loading-text">Loading projects...</p>
            ) : (
              projects.map(
                ({
                  id,
                  imgPath,
                  isBlog,
                  title,
                  description,
                  ghLink,
                  demoLink,
                  extraLinks,
                }) => (
                  <Col md={4} key={id} className="project-card-wrapper">
                    <div
                      className="project-card"
                      role="region"
                      aria-label={`Project: ${title}`}
                    >
                      {imgPath && (
                        <img
                          src={imgPath}
                          alt={`${title} screenshot`}
                          className="project-image"
                        />
                      )}
                      <h3 className="project-title">{title}</h3>
                      <p className="project-description-text">{description}</p>

                      <div className="project-icons">
                        {ghLink && (
                          <a
                            href={ghLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub Link"
                            className="icon-link"
                          >
                            <FaGithub />
                          </a>
                        )}
                        {demoLink && (
                          <a
                            href={demoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Demo Link"
                            className="icon-link"
                          >
                            <FaExternalLinkAlt />
                          </a>
                        )}
                        {extraLinks &&
                          extraLinks.map(({ label, url, iconUrl }, i) =>
                            url ? (
                              <a
                                key={i}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label || "Extra Link"}
                                className="icon-link"
                              >
                                {iconUrl ? (
                                  <img
                                    src={iconUrl}
                                    alt={label || "icon"}
                                    className="icon-image"
                                  />
                                ) : (
                                  <FaLink />
                                )}
                              </a>
                            ) : null
                          )}
                      </div>
                    </div>
                  </Col>
                )
              )
            )}
          </Row>
        </Container>
      </Container>
    </>
  );
}

export default Projects;
