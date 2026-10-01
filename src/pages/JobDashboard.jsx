
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../CSS/JobDashboard.css";

export default function JobDashboard() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);


  // ==========================================
  // FETCH APPLICATIONS
  // ==========================================

  const fetchApplications = async (userId) => {

    if (!userId) {
      setLoading(false);
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        `http://localhost:8080/api/job-applications/user/${userId}`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load applications"
        );
      }

      const data = await response.json();

      setApplications(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Dashboard Applications Error:",
        error
      );

      toast.error(
        "Unable to load applications"
      );

      setApplications([]);

    } finally {

      setLoading(false);
    }
  };


  // ==========================================
  // CHECK LOGIN + ROLE
  // ==========================================

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");


    // ------------------------------------------
    // NOT LOGGED IN
    // ------------------------------------------

    if (!storedUser) {

      toast.warning(
        "Please login first"
      );

      navigate("/login", {
        state: {
          redirectTo: "/job-dashboard"
        }
      });

      return;
    }


    try {

      const parsedUser =
        JSON.parse(storedUser);


      // ----------------------------------------
      // CUSTOMER TRYING TO OPEN JOB DASHBOARD
      // ----------------------------------------

      if (
        parsedUser.role !== "JOB_SEEKER" &&
        parsedUser.role !== "ADMIN"
      ) {

        toast.warning(
          "Please use the Service Dashboard."
        );

        navigate("/user/dashboard");

        return;
      }


      // ----------------------------------------
      // ADMIN
      // ----------------------------------------

      if (
        parsedUser.role === "ADMIN"
      ) {

        navigate("/admin");

        return;
      }


      // ----------------------------------------
      // JOB SEEKER
      // ----------------------------------------

      setUser(parsedUser);

      fetchApplications(
        parsedUser.userId
      );

    } catch (error) {

      console.error(
        "User data error:",
        error
      );

      localStorage.removeItem("user");
      localStorage.removeItem("userId");

      toast.error(
        "Session expired. Please login again."
      );

      navigate("/login", {
        state: {
          redirectTo: "/job-dashboard"
        }
      });

    }

  }, [navigate]);


  // ==========================================
  // COUNT BY STATUS
  // ==========================================

  const getCount = (status) => {

    return applications.filter(
      (application) =>
        application.status?.toUpperCase() ===
        status
    ).length;
  };


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {

    if (!date) {
      return "N/A";
    }

    const parsedDate =
      new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };


  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading && !user) {

    return (
      <div className="job-dashboard-page">

        <div className="dashboard-loading-page">

          <div className="applications-spinner"></div>

          <p>
            Loading your dashboard...
          </p>

        </div>

      </div>
    );
  }


  // ==========================================
  // USER NOT AVAILABLE
  // ==========================================

  if (!user) {
    return null;
  }


  return (
    <div className="job-dashboard-page">


      {/* =========================================
          HERO
      ========================================= */}

      <section className="job-dashboard-hero">

        <div>

          <span>
            💼 JOB SEEKER DASHBOARD
          </span>

          <h1>
            Hello, {user.fullName || user.email}
          </h1>

          <p>
            Manage your job search, track
            applications and discover new
            opportunities.
          </p>

        </div>


        <div className="dashboard-avatar">

          {user.fullName
            ?.charAt(0)
            ?.toUpperCase() || "U"}

        </div>

      </section>


      {/* =========================================
          QUICK ACTIONS
      ========================================= */}

      <section className="dashboard-actions">


        {/* FIND JOBS */}

        <button
          type="button"
          onClick={() =>
            navigate("/jobs")
          }
        >

          <span>
            🔎
          </span>

          <div>

            <strong>
              Find Jobs
            </strong>

            <small>
              Explore opportunities
            </small>

          </div>

        </button>


        {/* MY APPLICATIONS */}

        <button
          type="button"
          onClick={() =>
            navigate("/my-applications")
          }
        >

          <span>
            📋
          </span>

          <div>

            <strong>
              My Applications
            </strong>

            <small>
              Track your applications
            </small>

          </div>

        </button>

      </section>


      {/* =========================================
          STATISTICS
      ========================================= */}

      <section className="dashboard-stats">


        {/* TOTAL */}

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon">
            📋
          </div>

          <div>

            <span>
              Total Applications
            </span>

            <strong>
              {applications.length}
            </strong>

          </div>

        </div>


        {/* APPLIED */}

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon">
            🕐
          </div>

          <div>

            <span>
              Applied
            </span>

            <strong>
              {getCount("APPLIED")}
            </strong>

          </div>

        </div>


        {/* SHORTLISTED */}

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon">
            ⭐
          </div>

          <div>

            <span>
              Shortlisted
            </span>

            <strong>
              {getCount("SHORTLISTED")}
            </strong>

          </div>

        </div>


        {/* SELECTED */}

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon">
            ✅
          </div>

          <div>

            <span>
              Selected
            </span>

            <strong>
              {getCount("SELECTED")}
            </strong>

          </div>

        </div>

      </section>


      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <section className="job-dashboard-content">


        {/* =======================================
            PROFILE
        ======================================= */}

        <div className="dashboard-profile-card">

          <div className="profile-card-heading">

            <div>

              <span>
                MY PROFILE
              </span>

              <h2>
                Job Seeker Profile
              </h2>

            </div>

          </div>


          <div className="profile-details">


            <div>

              <small>
                Full Name
              </small>

              <strong>
                {user.fullName ||
                  "Not available"}
              </strong>

            </div>


            <div>

              <small>
                Email
              </small>

              <strong>
                {user.email ||
                  "Not available"}
              </strong>

            </div>


            <div>

              <small>
                Phone Number
              </small>

              <strong>
                {user.phoneNumber ||
                  "Not available"}
              </strong>

            </div>


            <div>

              <small>
                Account Type
              </small>

              <strong>
                Job Seeker
              </strong>

            </div>

          </div>

        </div>


        {/* =======================================
            RECENT APPLICATIONS
        ======================================= */}

        <div className="recent-applications-card">


          <div className="recent-heading">

            <div>

              <span>
                RECENT ACTIVITY
              </span>

              <h2>
                Recent Applications
              </h2>

            </div>


            <button
              type="button"
              onClick={() =>
                navigate("/my-applications")
              }
            >
              View All →
            </button>

          </div>


          {loading ? (

            <div className="dashboard-loading">
              Loading applications...
            </div>

          ) : applications.length === 0 ? (

            <div className="dashboard-no-applications">

              <div>
                💼
              </div>

              <h3>
                No applications yet
              </h3>

              <p>
                Start exploring jobs and apply
                for opportunities that match
                your skills.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/jobs")
                }
              >
                Explore Jobs →
              </button>

            </div>

          ) : (

            <div className="recent-application-list">

              {applications
                .slice(0, 4)
                .map((application) => (

                  <div
                    className="recent-application-item"
                    key={application.id}
                  >


                    <div className="recent-company-logo">

                      {application.company
                        ?.charAt(0)
                        ?.toUpperCase() || "J"}

                    </div>


                    <div className="recent-application-info">

                      <strong>
                        {application.jobTitle}
                      </strong>

                      <span>
                        {application.company}
                      </span>

                      <small>
                        Applied on{" "}
                        {formatDate(
                          application.appliedAt
                        )}
                      </small>

                    </div>


                    <span
                      className={`dashboard-status dashboard-status-${(
                        application.status || ""
                      ).toLowerCase()}`}
                    >
                      {application.status ||
                        "APPLIED"}
                    </span>

                  </div>

                ))}

            </div>

          )}

        </div>

      </section>


      {/* =========================================
          BOTTOM CTA
      ========================================= */}

      <section className="dashboard-cta">

        <div>

          <span>
            KEEP MOVING FORWARD
          </span>

          <h2>
            Your next opportunity starts
            with one application.
          </h2>

          <p>
            Explore available jobs and find
            work that matches your skills
            and experience.
          </p>

        </div>


        <button
          type="button"
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
