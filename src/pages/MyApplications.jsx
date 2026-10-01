
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../CSS/MyApplications.css";

export default function MyApplications() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH MY APPLICATIONS
  // ==========================================

  const fetchApplications = async () => {
    if (!user?.userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:8080/api/job-applications/user/${user.userId}`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load your applications"
        );
      }

      const data = await response.json();

      setApplications(
        Array.isArray(data) ? data : []
      );

    } catch (err) {
      console.error(
        "My Applications Error:",
        err
      );

      setError(
        "Unable to load your applications."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);


  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "APPLIED":
        return "application-status-applied";

      case "SHORTLISTED":
        return "application-status-shortlisted";

      case "INTERVIEW":
        return "application-status-interview";

      case "SELECTED":
        return "application-status-selected";

      case "REJECTED":
        return "application-status-rejected";

      default:
        return "application-status-default";
    }
  };


  // ==========================================
  // STATUS LABEL
  // ==========================================

  const getStatusLabel = (status) => {
    switch (status) {
      case "APPLIED":
        return "Applied";

      case "SHORTLISTED":
        return "Shortlisted";

      case "INTERVIEW":
        return "Interview";

      case "SELECTED":
        return "Selected";

      case "REJECTED":
        return "Rejected";

      default:
        return status || "Unknown";
    }
  };


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };


  // ==========================================
  // DOWNLOAD / VIEW RESUME
  // ==========================================

  const handleViewResume = async (
    application
  ) => {

    try {

      const response = await fetch(
        `http://localhost:8080/api/job-applications/${application.id}/resume`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to open resume"
        );
      }

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(blob);

      window.open(
        url,
        "_blank"
      );

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 10000);

    } catch (err) {

      console.error(
        "Resume Error:",
        err
      );

      toast.error(
        "Unable to open resume"
      );
    }
  };


  // ==========================================
  // LOGIN CHECK
  // ==========================================

  if (!user) {

    return (
      <div className="my-applications-page">

        <div className="applications-login-card">

          <div className="applications-empty-icon">
            🔐
          </div>

          <h2>
            Login Required
          </h2>

          <p>
            Please login to view your job
            applications.
          </p>

          <button
            onClick={() =>
              navigate("/login")
            }
          >
            Login →
          </button>

        </div>

      </div>
    );
  }


  return (
    <div className="my-applications-page">


      {/* ========================================
          HERO
      ======================================== */}

      <section className="applications-hero">

        <div className="applications-hero-content">

          <span className="applications-tag">
            📋 JOB APPLICATIONS
          </span>

          <h1>
            My Applications
          </h1>

          <p>
            Track your job applications,
            view their status and manage
            your application journey.
          </p>

        </div>


        <div className="applications-hero-icon">
          📄
        </div>

      </section>


      {/* ========================================
          STATISTICS
      ======================================== */}

      <section className="application-stats">

        <div className="application-stat-card">

          <div className="application-stat-icon">
            📋
          </div>

          <span>
            Total Applications
          </span>

          <strong>
            {applications.length}
          </strong>

        </div>


        <div className="application-stat-card">

          <div className="application-stat-icon">
            🕐
          </div>

          <span>
            Applied
          </span>

          <strong>
            {
              applications.filter(
                (app) =>
                  app.status === "APPLIED"
              ).length
            }
          </strong>

        </div>


        <div className="application-stat-card">

          <div className="application-stat-icon">
            ⭐
          </div>

          <span>
            Shortlisted
          </span>

          <strong>
            {
              applications.filter(
                (app) =>
                  app.status === "SHORTLISTED"
              ).length
            }
          </strong>

        </div>


        <div className="application-stat-card">

          <div className="application-stat-icon">
            ✅
          </div>

          <span>
            Selected
          </span>

          <strong>
            {
              applications.filter(
                (app) =>
                  app.status === "SELECTED"
              ).length
            }
          </strong>

        </div>

      </section>


      {/* ========================================
          APPLICATION SECTION
      ======================================== */}

      <section className="applications-section">

        <div className="applications-section-header">

          <div>

            <span>
              YOUR JOB APPLICATIONS
            </span>

            <h2>
              Applied Jobs
            </h2>

            <p>
              Your most recent applications
              are shown first.
            </p>

          </div>


          <button
            className="find-jobs-btn"
            onClick={() =>
              navigate("/jobs")
            }
          >
            + Find More Jobs
          </button>

        </div>


        {/* ======================================
            LOADING
        ====================================== */}

        {loading && (

          <div className="applications-loading">

            <div className="applications-spinner"></div>

            <p>
              Loading your applications...
            </p>

          </div>

        )}


        {/* ======================================
            ERROR
        ====================================== */}

        {!loading && error && (

          <div className="applications-error-card">

            <div className="applications-error-icon">
              ⚠️
            </div>

            <h3>
              Unable to Load Applications
            </h3>

            <p>
              {error}
            </p>

            <button
              onClick={fetchApplications}
            >
              Try Again
            </button>

          </div>

        )}


        {/* ======================================
            NO APPLICATIONS
        ====================================== */}

        {!loading &&
          !error &&
          applications.length === 0 && (

            <div className="applications-empty">

              <div className="applications-empty-icon">
                💼
              </div>

              <h2>
                No Applications Yet
              </h2>

              <p>
                You haven't applied for any jobs.
                Explore available opportunities
                and submit your first application.
              </p>

              <button
                onClick={() =>
                  navigate("/jobs")
                }
              >
                Explore Jobs →
              </button>

            </div>
          )}


        {/* ======================================
            APPLICATION CARDS
        ====================================== */}

        {!loading &&
          !error &&
          applications.length > 0 && (

            <div className="applications-grid">

              {applications.map(
                (application) => (

                  <div
                    className="application-card"
                    key={application.id}
                  >

                    {/* TOP */}

                    <div className="application-card-top">

                      <div className="application-company-logo">
                        {application.company
                          ? application.company.charAt(0)
                          : "J"}
                      </div>


                      <span
                        className={`application-status ${getStatusClass(
                          application.status
                        )}`}
                      >
                        {getStatusLabel(
                          application.status
                        )}
                      </span>

                    </div>


                    {/* BODY */}

                    <div className="application-card-body">

                      <h3>
                        {application.jobTitle}
                      </h3>

                      <p className="application-company">
                        {application.company}
                      </p>


                      {/* JOB DETAILS */}

                      <div className="application-details">

                        <span>
                          📍 {application.location}
                        </span>

                        <span>
                          💰 {application.salary}
                        </span>

                        <span>
                          🕒 {application.type}
                        </span>

                      </div>


                      {/* APPLICANT */}

                      <div className="application-applicant">

                        <div>

                          <small>
                            Applicant
                          </small>

                          <strong>
                            {application.fullName}
                          </strong>

                        </div>


                        <div>

                          <small>
                            Experience
                          </small>

                          <strong>
                            {application.experience}
                          </strong>

                        </div>

                      </div>


                      {/* META */}

                      <div className="application-meta">

                        <div>

                          <small>
                            Applied On
                          </small>

                          <strong>
                            {formatDate(
                              application.appliedAt
                            )}
                          </strong>

                        </div>


                        <div>

                          <small>
                            Resume
                          </small>

                          <button
                            className="resume-view-btn"
                            onClick={() =>
                              handleViewResume(
                                application
                              )
                            }
                          >
                            📄 View Resume
                          </button>

                        </div>

                      </div>


                      {/* FOOTER */}

                      <div className="application-card-footer">

                        <span>
                          Application #
                          {application.id}
                        </span>

                        <button
                          onClick={() =>
                            navigate(
                              `/job-details/${application.jobId}`
                            )
                          }
                        >
                          View Job →
                        </button>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>
          )}

      </section>


      {/* ========================================
          BOTTOM CTA
      ======================================== */}

      <section className="applications-cta">

        <div>

          <span>
            LOOKING FOR MORE OPPORTUNITIES?
          </span>

          <h2>
            Keep exploring and find
            your next job.
          </h2>

          <p>
            Browse available service jobs
            and apply to opportunities that
            match your skills.
          </p>

        </div>


        <button
          onClick={() =>
            navigate("/jobs")
          }
        >
          Explore Jobs →
        </button>

      </section>

    </div>
  );
}
