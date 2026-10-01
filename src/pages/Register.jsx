
import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";
import { toast } from "react-toastify";
import "../CSS/Register.css";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  // =====================================================
  // ROLE RECEIVED FROM PREVIOUS PAGE
  // =====================================================

  const previousRole =
    location.state?.registerType || "";

  const previousLoginType =
    location.state?.loginType || "";

  const previousRedirectTo =
    location.state?.redirectTo || "";

  // =====================================================
  // FORM
  // =====================================================

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",

    role:
      previousRole === "JOB_SEEKER"
        ? "JOB_SEEKER"
        : previousRole === "CUSTOMER"
          ? "CUSTOMER"
          : ""
  });

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Only numbers for phone
    if (name === "phoneNumber") {
      value = value.replace(/\D/g, "");
    }

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    // Remove error when user changes field
    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    const newErrors = {};

    // =================================================
    // FULL NAME
    // =================================================

    const fullName = form.fullName.trim();

    if (!fullName) {
      newErrors.fullName =
        "Full Name is required";
    } else if (fullName.length < 3) {
      newErrors.fullName =
        "Name must be at least 3 characters";
    } else if (!/^[A-Za-z\s]+$/.test(fullName)) {
      newErrors.fullName =
        "Name can contain only letters and spaces";
    }

    // =================================================
    // EMAIL
    // =================================================

    const email = form.email.trim();

    if (!email) {
      newErrors.email =
        "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        email
      )
    ) {
      newErrors.email =
        "Enter a valid email address";
    }

    // =================================================
    // PHONE
    // =================================================

    const phone = form.phoneNumber.trim();

    if (!phone) {
      newErrors.phoneNumber =
        "Phone Number is required";
    } else if (!/^[0-9]{10}$/.test(phone)) {
      newErrors.phoneNumber =
        "Phone Number must be exactly 10 digits";
    } else if (!/^[6-9][0-9]{9}$/.test(phone)) {
      newErrors.phoneNumber =
        "Enter a valid 10-digit mobile number";
    }

    // =================================================
    // ROLE
    // =================================================

    if (!form.role) {
      newErrors.role =
        "Please select how you want to use ServiceBook";
    }

    // =================================================
    // PASSWORD
    // =================================================

    if (!form.password) {
      newErrors.password =
        "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    // =================================================
    // CONFIRM PASSWORD
    // =================================================

    if (!form.confirmPassword) {
      newErrors.confirmPassword =
        "Confirm Password is required";
    } else if (
      form.password !==
      form.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =====================================================
  // REGISTER
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // =================================================
    // FRONTEND VALIDATION
    // =================================================

    if (!validateForm()) {
      window.alert(
        "Please correct the highlighted fields before creating your account."
      );

      return;
    }

    try {
      setLoading(true);

      // =================================================
      // USER DATA
      // =================================================

      const userData = {
        fullName:
          form.fullName.trim(),

        email:
          form.email.trim(),

        phoneNumber:
          form.phoneNumber.trim(),

        password:
          form.password,

        role:
          form.role
      };

      console.log(
        "REGISTER USER:",
        userData
      );

      // =================================================
      // REGISTER API
      // =================================================

      const response = await fetch(
        "http://localhost:8080/users/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(userData)
        }
      );

      // =================================================
      // READ RESPONSE
      // =================================================

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      // =================================================
      // REGISTRATION FAILED
      // =================================================

      if (!response.ok) {
        const serverMessage =
          data?.message ||
          data?.error ||
          "Registration failed";

        console.error(
          "REGISTRATION FAILED:",
          serverMessage
        );

        const lowerMessage =
          serverMessage.toLowerCase();

        // ---------------------------------------------
        // DUPLICATE EMAIL
        // ---------------------------------------------

        if (
          lowerMessage.includes("email") &&
          (
            lowerMessage.includes("exist") ||
            lowerMessage.includes("already") ||
            lowerMessage.includes("duplicate") ||
            lowerMessage.includes("unique")
          )
        ) {
          setErrors((prev) => ({
            ...prev,
            email:
              "This email is already registered."
          }));

          window.alert(
            "This email is already registered.\n\nPlease use a different email address or login with your existing account."
          );

          return;
        }

        // ---------------------------------------------
        // DUPLICATE PHONE
        // ---------------------------------------------

        if (
          lowerMessage.includes("phone") &&
          (
            lowerMessage.includes("exist") ||
            lowerMessage.includes("already") ||
            lowerMessage.includes("duplicate") ||
            lowerMessage.includes("unique")
          )
        ) {
          setErrors((prev) => ({
            ...prev,
            phoneNumber:
              "This phone number is already registered."
          }));

          window.alert(
            "This phone number is already registered.\n\nPlease use another phone number."
          );

          return;
        }

        // ---------------------------------------------
        // INVALID EMAIL
        // ---------------------------------------------

        if (
          lowerMessage.includes("invalid email")
        ) {
          setErrors((prev) => ({
            ...prev,
            email:
              "Please enter a valid email address."
          }));

          window.alert(
            "Please enter a valid email address."
          );

          return;
        }

        // ---------------------------------------------
        // PHONE ERROR
        // ---------------------------------------------

        if (
          lowerMessage.includes("phone")
        ) {
          setErrors((prev) => ({
            ...prev,
            phoneNumber:
              serverMessage
          }));

          window.alert(
            serverMessage
          );

          return;
        }

        // ---------------------------------------------
        // GENERIC SERVER ERROR
        // ---------------------------------------------

        window.alert(
          serverMessage
        );

        return;
      }

      // =================================================
      // REGISTRATION SUCCESS
      // =================================================

      console.log(
        "REGISTRATION SUCCESS:",
        data
      );

      if (
        form.role === "JOB_SEEKER"
      ) {
        window.alert(
          "Job Seeker account created successfully!"
        );

        toast.success(
          "Job Seeker Registration Successful 🎉"
        );
      } else {
        window.alert(
          "Customer account created successfully!"
        );

        toast.success(
          "Customer Registration Successful 🎉"
        );
      }

      // =================================================
      // DETERMINE LOGIN REDIRECT
      // =================================================

      let nextRedirect =
        previousRedirectTo;

      if (!nextRedirect) {
        nextRedirect =
          form.role === "JOB_SEEKER"
            ? "/job-dashboard"
            : "/user/dashboard";
      }

      // =================================================
      // GO TO LOGIN
      // =================================================

      navigate("/login", {
        replace: true,

        state: {
          registerType:
            form.role,

          loginType:
            form.role,

          redirectTo:
            nextRedirect
        }
      });

    } catch (error) {

      console.error(
        "Registration Error:",
        error
      );

      // =================================================
      // NETWORK / BACKEND ERROR
      // =================================================

      window.alert(
        "Unable to create your account.\n\n" +
        "Please make sure the backend server is running and try again."
      );

      toast.error(
        error.message ||
        "Registration failed"
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ROLE DESCRIPTION
  // =====================================================

  const roleDescription =
    form.role === "JOB_SEEKER"
      ? "💼 You can browse jobs, apply online and track applications."
      : form.role === "CUSTOMER"
        ? "🛠️ You can book home services and manage your bookings."
        : "Choose how you want to use ServiceBook.";

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="register-container">

      <form
        className="register-form"
        onSubmit={handleSubmit}
      >

        {/* =================================================
            TITLE
        ================================================= */}

        <h2>
          Create Account
        </h2>

        <p className="welcome-text">
          Create your ServiceBook account
          to get started.
        </p>


        {/* =================================================
            ROLE
        ================================================= */}

        <div className="role-selection">

          <label htmlFor="role">
            Register As *
          </label>

          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            disabled={loading}
          >

            <option value="">
              Select Account Type
            </option>

            <option value="CUSTOMER">
              🛠️ Customer
            </option>

            <option value="JOB_SEEKER">
              💼 Job Seeker
            </option>

          </select>

          {errors.role && (
            <span className="error-text">
              {errors.role}
            </span>
          )}

          <small className="role-description">
            {roleDescription}
          </small>

        </div>


        {/* =================================================
            FULL NAME
        ================================================= */}

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          disabled={loading}
          autoComplete="name"
        />

        {errors.fullName && (
          <span className="error-text">
            {errors.fullName}
          </span>
        )}


        {/* =================================================
            EMAIL
        ================================================= */}

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          disabled={loading}
          autoComplete="email"
        />

        {errors.email && (
          <span className="error-text">
            {errors.email}
          </span>
        )}


        {/* =================================================
            PHONE
        ================================================= */}

        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          maxLength="10"
          value={form.phoneNumber}
          onChange={handleChange}
          disabled={loading}
          autoComplete="tel"
        />

        {errors.phoneNumber && (
          <span className="error-text">
            {errors.phoneNumber}
          </span>
        )}


        {/* =================================================
            PASSWORD
        ================================================= */}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          disabled={loading}
          autoComplete="new-password"
        />

        {errors.password && (
          <span className="error-text">
            {errors.password}
          </span>
        )}


        {/* =================================================
            CONFIRM PASSWORD
        ================================================= */}

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          disabled={loading}
          autoComplete="new-password"
        />

        {errors.confirmPassword && (
          <span className="error-text">
            {errors.confirmPassword}
          </span>
        )}


        {/* =================================================
            REGISTER BUTTON
        ================================================= */}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating Account..."
            : "Register"}
        </button>


        {/* =================================================
            LOGIN
        ================================================= */}

        <p className="login-link">

          Already have an account?

          <Link
            to="/login"
            state={{
              registerType:
                form.role ||
                previousRole ||
                "CUSTOMER",

              loginType:
                form.role ||
                previousLoginType ||
                "CUSTOMER",

              redirectTo:
                previousRedirectTo ||
                (
                  form.role === "JOB_SEEKER"
                    ? "/job-dashboard"
                    : "/user/dashboard"
                )
            }}
          >
            {" "}Login
          </Link>

        </p>

      </form>

    </div>
  );
}
