import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import "../CSS/ApplyJob.css";

export default function ApplyJob() {
  const location = useLocation();
  const navigate = useNavigate();

  const job = location.state?.job;

  const storedUser = localStorage.getItem("user");
  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    experience: "",
    skills: "",
    education: "",
    coverLetter: "",
    resume: null
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ==============================
  // HANDLE INPUT
  // ==============================

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    const newValue = files
      ? files[0]
      : value;

    setForm((prev) => ({
      ...prev,
      [name]: newValue
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  };


  // ==============================
  // VALIDATION
  // ==============================

  const validateForm = () => {

    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName =
        "Full name is required";
    }

    if (!form.email.trim()) {
      newErrors.email =
        "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        form.email
      )
    ) {
      newErrors.email =
        "Enter a valid email address";
    }

    if (!form.phoneNumber.trim()) {
      newErrors.phoneNumber =
        "Phone number is required";
    } else if (
      !/^[0-9]{10}$/.test(
        form.phoneNumber
      )
    ) {
      newErrors.phoneNumber =
        "Phone number must be exactly 10 digits";
    }

    if (!form.experience.trim()) {
      newErrors.experience =
        "Experience is required";
    }

    if (!form.skills.trim()) {
      newErrors.skills =
        "Skills are required";
    }

    if (!form.education.trim()) {
      newErrors.education =
        "Education is required";
    }

    if (!form.resume) {
      newErrors.resume =
        "Resume is required";
    } else {

      const fileName =
        form.resume.name.toLowerCase();

      const validFile =
        fileName.endsWith(".pdf") ||
        fileName.endsWith(".doc") ||
        fileName.endsWith(".docx");

      if (!validFile) {
        newErrors.resume =
          "Only PDF, DOC and DOCX files are allowed";
      }

      if (
        form.resume.size >
        5 * 1024 * 1024
      ) {
        newErrors.resume =
          "Resume must be less than 5 MB";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  // ==============================
  // SUBMIT APPLICATION
  // ==============================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!user) {

      toast.warning(
        "Please login before applying."
      );

      navigate("/login", {
        state: {
          redirectTo: `/job-details/${job?.id}`
        }
      });

      return;
    }

    if (!job) {

      toast.error(
        "Job information is missing."
      );

      navigate("/jobs");

      return;
    }

    if (!validateForm()) {

      toast.warning(
        "Please fix the errors."
      );

      return;
    }

    try {

      setLoading(true);

      // ==========================
      // FORM DATA
      // ==========================

      const formData =
        new FormData();

      formData.append(
        "userId",
        user.userId
      );

      formData.append(
        "jobId",
        job.id
      );

      formData.append(
        "fullName",
        form.fullName.trim()
      );

      formData.append(
        "email",
        form.email.trim()
      );

      formData.append(
        "phoneNumber",
        form.phoneNumber.trim()
      );

      formData.append(
        "experience",
        form.experience.trim()
      );

      formData.append(
        "skills",
        form.skills.trim()
      );

      formData.append(
        "education",
        form.education.trim()
      );

      formData.append(
        "coverLetter",
        form.coverLetter.trim()
      );

      formData.append(
        "resume",
        form.resume
      );


      // ==========================
      // API CALL
      // ==========================

      const response = await fetch(
        "http://localhost:8080/api/job-applications",
        {
          method: "POST",
          body: formData
        }
      );


      // ==========================
      // RESPONSE
      // ==========================

      let data = {};

      try {
        data =
          await response.json();
      } catch {
        data = {};
      }


      if (!response.ok) {

        throw new Error(
          data?.message ||
          "Failed to submit application"
        );
      }


      // ==========================
      // SUCCESS
      // ==========================

      toast.success(
        "Application submitted successfully 🎉"
      );

      navigate(
        "/my-applications"
      );

    } catch (error) {

      console.error(
        "Application Error:",
        error
      );

      toast.error(
        error.message ||
        "Something went wrong while applying."
      );

    } finally {

      setLoading(false);
    }
  };


  // ==============================
  // JOB NOT FOUND
  // ==============================

  if (!job) {

    return (
      <div className="apply-job-page">

        <div className="application-not-found">

          <div className="not-found-icon">
            ⚠️
          </div>

          <h2>
            Job Information Not Found
          </h2>

          <p>
            Please select a job before
            applying.
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
    <div className="apply-job-page">

      <div className="apply-job-container">


        {/* =================================
            LEFT JOB INFORMATION
        ================================= */}

        <aside className="apply-job-sidebar">

          <button
            className="back-job-btn"
            onClick={() =>
              navigate(
                `/job-details/${job.id}`,
                {
                  state: { job }
                }
              )
            }
          >
            ← Back to Job
          </button>


          <div className="job-apply-summary">

            <span className="application-tag">
              💼 JOB APPLICATION
            </span>

            <div className="apply-company-logo">
              {job.company
                ? job.company.charAt(0)
                : "J"}
            </div>

            <h1>
              {job.title}
            </h1>

            <h3>
              {job.company}
            </h3>

            <div className="apply-job-info">

              <div>
                📍 {job.location}
              </div>

              <div>
                💰 {job.salary}
              </div>

              <div>
                🕒 {job.type}
              </div>

              <div>
                🎓 {job.experience}
              </div>

            </div>


            <div className="apply-divider"></div>


            <h4>
              Required Skills
            </h4>

            <div className="apply-skills">

              {job.skills &&
                job.skills.map(
                  (skill, index) => (
                    <span key={index}>
                      {skill}
                    </span>
                  )
                )}

            </div>


            <div className="application-process">

              <h4>
                Application Process
              </h4>

              <div className="process-step">
                <span>1</span>
                <p>
                  Fill your details
                </p>
              </div>

              <div className="process-step">
                <span>2</span>
                <p>
                  Upload your resume
                </p>
              </div>

              <div className="process-step">
                <span>3</span>
                <p>
                  Submit application
                </p>
              </div>

              <div className="process-step">
                <span>4</span>
                <p>
                  Track application status
                </p>
              </div>

            </div>

          </div>

        </aside>


        {/* =================================
            APPLICATION FORM
        ================================= */}

        <main className="application-form-card">

          <div className="application-form-header">

            <span>
              APPLY NOW
            </span>

            <h2>
              Submit Your Application
            </h2>

            <p>
              Enter your details carefully
              and upload your latest resume.
            </p>

          </div>


          <form
            className="application-form"
            onSubmit={handleSubmit}
          >

            {/* FULL NAME */}

            <div className="form-group">

              <label>
                Full Name *
              </label>

              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleChange}
              />

              {errors.fullName && (
                <span className="application-error">
                  {errors.fullName}
                </span>
              )}

            </div>


            {/* EMAIL + PHONE */}

            <div className="form-row">

              <div className="form-group">

                <label>
                  Email Address *
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                />

                {errors.email && (
                  <span className="application-error">
                    {errors.email}
                  </span>
                )}

              </div>


              <div className="form-group">

                <label>
                  Phone Number *
                </label>

                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="10 digit phone number"
                  maxLength="10"
                  value={form.phoneNumber}
                  onChange={(e) => {

                    const value =
                      e.target.value.replace(
                        /\D/g,
                        ""
                      );

                    setForm((prev) => ({
                      ...prev,
                      phoneNumber: value
                    }));

                    setErrors((prev) => ({
                      ...prev,
                      phoneNumber: ""
                    }));

                  }}
                />

                {errors.phoneNumber && (
                  <span className="application-error">
                    {errors.phoneNumber}
                  </span>
                )}

              </div>

            </div>


            {/* EXPERIENCE + EDUCATION */}

            <div className="form-row">

              <div className="form-group">

                <label>
                  Experience *
                </label>

                <input
                  type="text"
                  name="experience"
                  placeholder="Example: Fresher / 2 Years"
                  value={form.experience}
                  onChange={handleChange}
                />

                {errors.experience && (
                  <span className="application-error">
                    {errors.experience}
                  </span>
                )}

              </div>


              <div className="form-group">

                <label>
                  Education *
                </label>

                <input
                  type="text"
                  name="education"
                  placeholder="Example: Graduate / 12th Pass"
                  value={form.education}
                  onChange={handleChange}
                />

                {errors.education && (
                  <span className="application-error">
                    {errors.education}
                  </span>
                )}

              </div>

            </div>


            {/* SKILLS */}

            <div className="form-group">

              <label>
                Skills *
              </label>

              <input
                type="text"
                name="skills"
                placeholder="Example: Cooking, Cleaning, Child Care"
                value={form.skills}
                onChange={handleChange}
              />

              <small>
                Separate multiple skills with commas.
              </small>

              {errors.skills && (
                <span className="application-error">
                  {errors.skills}
                </span>
              )}

            </div>


            {/* RESUME */}

            <div className="form-group">

              <label>
                Resume *
              </label>

              <div className="resume-upload-box">

                <div className="resume-upload-icon">
                  📄
                </div>

                <div className="resume-upload-content">

                  <strong>
                    Upload your resume
                  </strong>

                  <span>
                    PDF, DOC or DOCX • Maximum 5 MB
                  </span>

                  {form.resume && (
                    <small className="selected-resume">
                      ✓ {form.resume.name}
                    </small>
                  )}

                </div>

                <input
                  type="file"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleChange}
                />

              </div>

              {errors.resume && (
                <span className="application-error">
                  {errors.resume}
                </span>
              )}

            </div>


            {/* COVER LETTER */}

            <div className="form-group">

              <label>
                About Yourself
              </label>

              <textarea
                name="coverLetter"
                rows="6"
                placeholder="Tell the employer about yourself, your experience and why you are suitable for this job..."
                value={form.coverLetter}
                onChange={handleChange}
              />

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              className="submit-application-btn"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Submitting Application...
                </>
              ) : (
                <>
                  Submit Application →
                </>
              )}

            </button>


            <p className="application-note">
              By submitting this application,
              you confirm that the information
              provided is accurate.
            </p>

          </form>

        </main>

      </div>

    </div>
  );
}
