import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../CSS/Jobs.css";

export default function Jobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  // ==============================
  // GET ALL JOBS
  // ==============================
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:8080/api/jobs"
      );

      if (!response.ok) {
        throw new Error("Failed to load jobs");
      }

      const data = await response.json();

      setJobs(data);

    } catch (err) {
      console.error("Jobs Fetch Error:", err);

      setError(
        "Unable to load jobs. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // LOAD JOBS WHEN PAGE OPENS
  // ==============================
  useEffect(() => {
    fetchJobs();
  }, []);

  // ==============================
  // SEARCH JOBS
  // ==============================
  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      setSearching(true);
      setError("");

      const params = new URLSearchParams();

      if (keyword.trim()) {
        params.append(
          "keyword",
          keyword.trim()
        );
      }

      if (location.trim()) {
        params.append(
          "location",
          location.trim()
        );
      }

      const url =
        `http://localhost:8080/api/jobs/search?${params.toString()}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          "Job search failed"
        );
      }

      const data = await response.json();

      setJobs(data);

      if (data.length === 0) {
        toast.info(
          "No jobs found for your search."
        );
      }

    } catch (err) {
      console.error("Job Search Error:", err);

      setError(
        "Unable to search jobs. Please try again."
      );

    } finally {
      setSearching(false);
    }
  };

  // ==============================
  // CLEAR SEARCH
  // ==============================
  const handleClearSearch = () => {
    setKeyword("");
    setLocation("");
    fetchJobs();
  };

  // ==============================
  // VIEW JOB DETAILS
  // ==============================
  const handleViewJob = (job) => {
    navigate(`/job-details/${job.id}`, {
      state: { job }
    });
  };

  return (
    <div className="jobs-page">

      {/* =========================
          HERO
      ========================== */}

      <section className="jobs-hero">

        <div className="jobs-hero-content">

          <span className="jobs-tag">
            💼 CAREER OPPORTUNITIES
          </span>

          <h1>
            Find Your Next
            <span> Job Opportunity</span>
          </h1>

          <p>
            Find jobs for house helpers, cooks,
            carpenters, plumbers, electricians,
            cleaners and other service professionals.
          </p>

          <div className="jobs-hero-actions">

            <button
              className="jobs-primary-btn"
              onClick={() =>
                document
                  .getElementById("jobs-list")
                  ?.scrollIntoView({
                    behavior: "smooth"
                  })
              }
            >
              🔎 Explore Jobs
            </button>

            <button
              className="jobs-secondary-btn"
              onClick={() =>
                navigate("/my-applications")
              }
            >
              📋 My Applications
            </button>

          </div>

        </div>


        {/* HERO CARD */}

        <div className="jobs-hero-card">

          <div className="floating-icon icon-one">
            💼
          </div>

          <div className="floating-icon icon-two">
            📄
          </div>

          <div className="floating-icon icon-three">
            🚀
          </div>

          <div className="career-card">

            <div className="career-card-icon">
              💼
            </div>

            <h3>
              Find Work With ServiceBook
            </h3>

            <p>
              Explore local work opportunities
              and apply for jobs online.
            </p>

            <div className="career-card-stats">

              <div>
                <strong>
                  {jobs.length}+
                </strong>

                <span>
                  Jobs
                </span>
              </div>

              <div>
                <strong>
                  10+
                </strong>

                <span>
                  Categories
                </span>
              </div>

              <div>
                <strong>
                  24/7
                </strong>

                <span>
                  Access
                </span>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          SEARCH
      ========================== */}

      <section className="job-search-section">

        <form
          className="job-search-box"
          onSubmit={handleSearch}
        >

          <div className="search-field">

            <span>
              🔍
            </span>

            <input
              type="text"
              placeholder="Job title, skill or work type"
              value={keyword}
              onChange={(e) =>
                setKeyword(e.target.value)
              }
            />

          </div>


          <div className="search-field">

            <span>
              📍
            </span>

            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
            />

          </div>


          <button
            type="submit"
            className="search-btn"
            disabled={searching}
          >
            {searching
              ? "Searching..."
              : "Search Jobs"}
          </button>

        </form>


        {(keyword || location) && (
          <button
            className="clear-search-btn"
            onClick={handleClearSearch}
          >
            ✕ Clear Search
          </button>
        )}

      </section>


      {/* =========================
          JOBS SECTION
      ========================== */}

      <section
        className="jobs-list-section"
        id="jobs-list"
      >

        <div className="jobs-section-heading">

          <div>

            <span>
              JOB OPPORTUNITIES
            </span>

            <h2>
              Latest Jobs
            </h2>

            <p>
              Find work opportunities based on
              your skills and experience.
            </p>

          </div>


          <div className="jobs-count">

            {jobs.length}{" "}
            {jobs.length === 1
              ? "Job"
              : "Jobs"}{" "}
            Available

          </div>

        </div>


        {/* =========================
            LOADING
        ========================== */}

        {loading && (

          <div className="jobs-loading">

            <div className="jobs-spinner"></div>

            <p>
              Loading available jobs...
            </p>

          </div>

        )}


        {/* =========================
            ERROR
        ========================== */}

        {!loading && error && (

          <div className="jobs-error">

            <div className="jobs-error-icon">
              ⚠️
            </div>

            <h3>
              Unable to Load Jobs
            </h3>

            <p>
              {error}
            </p>

            <button
              onClick={fetchJobs}
            >
              Try Again
            </button>

          </div>

        )}


        {/* =========================
            JOB CARDS
        ========================== */}

        {!loading &&
          !error &&
          jobs.length > 0 && (

            <div className="jobs-grid">

              {jobs.map((job) => (

                <div
                  className="job-card"
                  key={job.id}
                >

                  <div className="job-card-top">

                    <div className="company-logo">
                      {job.company
                        ? job.company.charAt(0)
                        : "J"}
                    </div>

                    <span className="job-type">
                      {job.type}
                    </span>

                  </div>


                  <div className="job-card-content">

                    <h3>
                      {job.title}
                    </h3>

                    <p className="company-name">
                      {job.company}
                    </p>


                    <div className="job-info">

                      <span>
                        📍 {job.location}
                      </span>

                      <span>
                        🎓 {job.experience}
                      </span>

                      <span>
                        💰 {job.salary}
                      </span>

                      {job.workingHours && (
                        <span>
                          🕒 {job.workingHours}
                        </span>
                      )}

                    </div>


                    <div className="job-skills">

                      {job.skills &&
                        job.skills.map(
                          (skill, index) => (

                            <span key={index}>
                              {skill}
                            </span>

                          )
                        )}

                    </div>


                    <div className="job-card-bottom">

                      <small>
                        Posted{" "}
                        {job.postedAt
                          ? new Date(
                              job.postedAt
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                              }
                            )
                          : "Recently"}
                      </small>


                      <button
                        onClick={() =>
                          handleViewJob(job)
                        }
                      >
                        View Job →
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}


        {/* =========================
            NO JOBS
        ========================== */}

        {!loading &&
          !error &&
          jobs.length === 0 && (

            <div className="no-jobs">

              <div className="no-jobs-icon">
                🔍
              </div>

              <h3>
                No Jobs Found
              </h3>

              <p>
                Try searching with another
                job title, skill or location.
              </p>

              <button
                onClick={handleClearSearch}
              >
                View All Jobs
              </button>

            </div>

          )}

      </section>


      {/* =========================
          CTA
      ========================== */}

      <section className="job-cta">

        <div>

          <span>
            LOOKING FOR WORK?
          </span>

          <h2>
            Find work that matches
            your skills.
          </h2>

          <p>
            Explore available jobs, apply online,
            upload your resume and track your
            applications from one place.
          </p>

        </div>


        <button
          onClick={() =>
            navigate("/my-applications")
          }
        >
          View My Applications →
        </button>

      </section>

    </div>
  );
}
