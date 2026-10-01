import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "../CSS/JobDetails.css";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==============================
  // FETCH JOB DETAILS
  // ==============================
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:8080/api/jobs/${id}`
        );

        if (!response.ok) {
          throw new Error("Job not found");
        }

        const data = await response.json();

        setJob(data);
      } catch (err) {
        console.error("Job Details Error:", err);

        setError(
          "Unable to load job details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // ==============================
  // APPLY NOW
  // ==============================
  const handleApply = () => {
    const user = localStorage.getItem("user");

    if (!user) {
      toast.warning(
        "Please login or register to apply for this job."
      );

      navigate("/login", {
        state: {
          redirectTo: `/job-details/${id}`
        }
      });

      return;
    }

    const loggedInUser =
      JSON.parse(user);

    // Allow only job seekers
    if (
      loggedInUser.role !== "JOB_SEEKER"
    ) {
      toast.warning(
        "Please use a Job Seeker account to apply for jobs."
      );

      return;
    }

    navigate("/apply-job", {
      state: {
        job
      }
    });
  };

  // ==============================
  // LOADING
  // ==============================
  if (loading) {
    return (
      <div className="job-details-page">

        <div className="job-details-loading">

          <div className="job-details-spinner"></div>

          <p>
            Loading job details...
          </p>

        </div>

      </div>
    );
  }

  // ==============================
  // ERROR
  // ==============================
  if (error || !job) {
    return (
      <div className="job-details-page">

        <div className="job-details-error">

          <div className="job-details-error-icon">
            ⚠️
          </div>

          <h2>
            Job Not Found
          </h2>

          <p>
            {error ||
              "The requested job could not be found."}
          </p>

          <button
            onClick={() =>
              navigate("/jobs")
            }
          >
            ← Back to Jobs
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="job-details-page">

      {/* =========================
          TOP
      ========================== */}

      <div className="job-details-container">

        <button
          className="back-jobs-btn"
          onClick={() =>
            navigate("/jobs")
          }
        >
          ← Back to Jobs
        </button>


        {/* =========================
            JOB HEADER
        ========================== */}

        <section className="job-details-header">

          <div className="job-details-company-logo">
            {job.company
              ? job.company.charAt(0)
              : "J"}
          </div>


          <div className="job-details-title">

            <span className="job-details-badge">
              {job.type}
            </span>

            <h1>
              {job.title}
            </h1>

            <h3>
              {job.company}
            </h3>

            <div className="job-details-location">
              📍 {job.location}
            </div>

          </div>


          <div className="job-details-header-action">

            <button
              className="apply-now-btn"
              onClick={handleApply}
            >
              Apply Now →
            </button>

          </div>

        </section>


        {/* =========================
            JOB QUICK INFO
        ========================== */}

        <section className="job-quick-info">

          <div className="quick-info-card">

            <span>
              💰
            </span>

            <div>
              <small>
                Salary
              </small>

              <strong>
                {job.salary}
              </strong>
            </div>

          </div>


          <div className="quick-info-card">

            <span>
              🎓
            </span>

            <div>
              <small>
                Experience
              </small>

              <strong>
                {job.experience}
              </strong>
            </div>

          </div>


          <div className="quick-info-card">

            <span>
              🕒
            </span>

            <div>
              <small>
                Working Hours
              </small>

              <strong>
                {job.workingHours ||
                  "Not specified"}
              </strong>
            </div>

          </div>


          <div className="quick-info-card">

            <span>
              📍
            </span>

            <div>
              <small>
                Location
              </small>

              <strong>
                {job.location}
              </strong>
            </div>

          </div>

        </section>


        {/* =========================
            MAIN CONTENT
        ========================== */}

        <div className="job-details-layout">

          {/* LEFT */}
          <main className="job-details-main">

            {/* Description */}
            <section className="job-details-section">

              <h2>
                Job Description
              </h2>

              <p>
                {job.description ||
                  "No job description available."}
              </p>

            </section>


            {/* Responsibilities */}
            <section className="job-details-section">

              <h2>
                Responsibilities
              </h2>

              {job.responsibilities ? (
                <div className="job-text-content">
                  {job.responsibilities}
                </div>
              ) : (
                <p>
                  Responsibilities have not
                  been specified.
                </p>
              )}

            </section>


            {/* Requirements */}
            <section className="job-details-section">

              <h2>
                Requirements
              </h2>

              {job.requirements ? (
                <div className="job-text-content">
                  {job.requirements}
                </div>
              ) : (
                <p>
                  Requirements have not
                  been specified.
                </p>
              )}

            </section>


            {/* Skills */}
            <section className="job-details-section">

              <h2>
                Required Skills
              </h2>

              <div className="details-skills">

                {job.skills &&
                  job.skills.length > 0 ? (
                    job.skills.map(
                      (skill, index) => (
                        <span key={index}>
                          {skill}
                        </span>
                      )
                    )
                  ) : (
                    <p>
                      No skills specified.
                    </p>
                  )}

              </div>

            </section>

          </main>


          {/* RIGHT SIDEBAR */}
          <aside className="job-details-sidebar">

            <div className="apply-card">

              <div className="apply-card-icon">
                💼
              </div>

              <h3>
                Interested in this job?
              </h3>

              <p>
                Submit your application and
                upload your resume to apply.
              </p>

              <button
                onClick={handleApply}
              >
                Apply Now →
              </button>

            </div>


            <div className="job-summary-card">

              <h3>
                Job Summary
              </h3>

              <div className="summary-row">

                <span>
                  Job Type
                </span>

                <strong>
                  {job.type}
                </strong>

              </div>


              <div className="summary-row">

                <span>
                  Experience
                </span>

                <strong>
                  {job.experience}
                </strong>

              </div>


              <div className="summary-row">

                <span>
                  Salary
                </span>

                <strong>
                  {job.salary}
                </strong>

              </div>


              <div className="summary-row">

                <span>
                  Location
                </span>

                <strong>
                  {job.location}
                </strong>

              </div>


              <div className="summary-row">

                <span>
                  Working Hours
                </span>

                <strong>
                  {job.workingHours ||
                    "Not specified"}
                </strong>

              </div>

            </div>

          </aside>

        </div>


        {/* =========================
            BOTTOM CTA
        ========================== */}

        <section className="job-details-cta">

          <div>

            <span>
              READY TO APPLY?
            </span>

            <h2>
              Take the next step in your career.
            </h2>

            <p>
              Submit your application and
              let the employer know you're
              interested.
            </p>

          </div>

          <button
            onClick={handleApply}
          >
            Apply for This Job →
          </button>

        </section>

      </div>

    </div>
  );
}
