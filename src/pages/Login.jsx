
import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";
import { toast } from "react-toastify";
import "../CSS/Login.css";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  // =====================================================
  // JOURNEY RECEIVED FROM PREVIOUS PAGE
  // =====================================================

  const loginType =
    location.state?.loginType || null;

  const redirectTo =
    location.state?.redirectTo || null;

  // =====================================================
  // DEFAULT LOGIN ROLE
  // =====================================================

  const defaultLoginRole =
    loginType === "JOB_SEEKER"
      ? "JOB_SEEKER"
      : loginType === "CUSTOMER"
        ? "CUSTOMER"
        : "";

  // =====================================================
  // LOGIN FORM
  // =====================================================

  const [login, setLogin] = useState({
    email: "",
    password: ""
  });

  const [selectedRole, setSelectedRole] =
    useState(defaultLoginRole);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    role: ""
  });

  const [loading, setLoading] = useState(false);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLogin((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  };

  // =====================================================
  // HANDLE ROLE CHANGE
  // =====================================================

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);

    setErrors((prev) => ({
      ...prev,
      role: ""
    }));
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    const newErrors = {};

    // ---------------------------------------------
    // ROLE VALIDATION
    // ---------------------------------------------

    if (!selectedRole) {
      newErrors.role =
        "Please select how you want to login";
    }

    // ---------------------------------------------
    // EMAIL VALIDATION
    // ---------------------------------------------

    const email = login.email.trim();

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

    // ---------------------------------------------
    // PASSWORD VALIDATION
    // ---------------------------------------------

    if (!login.password) {
      newErrors.password =
        "Password is required";
    } else if (
      login.password.length < 6
    ) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =====================================================
  // SAVE USER
  // =====================================================

  const saveUser = (data) => {
    localStorage.setItem(
      "user",
      JSON.stringify(data)
    );

    localStorage.setItem(
      "userId",
      String(data.userId)
    );

    window.dispatchEvent(
      new Event("authChanged")
    );
  };

  // =====================================================
  // GO TO REGISTER
  // =====================================================

  const goToRegister = (role) => {
    navigate("/register", {
      replace: true,
      state: {
        registerType: role,

        loginType: role,

        redirectTo:
          role === "JOB_SEEKER"
            ? "/job-dashboard"
            : "/user/dashboard"
      }
    });
  };

  // =====================================================
  // LOGIN
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ---------------------------------------------
    // FRONTEND VALIDATION
    // ---------------------------------------------

    if (!validateForm()) {
      window.alert(
        "Please correct the highlighted errors before logging in."
      );

      return;
    }

    try {
      setLoading(true);

      // =================================================
      // LOGIN API
      // =================================================

      const response = await fetch(
        "http://localhost:8080/users/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            email:
              login.email.trim(),

            password:
              login.password
          })
        }
      );

      // =================================================
      // LOGIN FAILED
      // =================================================

      if (!response.ok) {
        let errorMessage = "";

        try {
          const errorData =
            await response.json();

          errorMessage =
            errorData?.message ||
            errorData?.error ||
            "";
        } catch {
          try {
            errorMessage =
              await response.text();
          } catch {
            errorMessage = "";
          }
        }

        console.error(
          "LOGIN FAILED:",
          errorMessage
        );

        // ---------------------------------------------
        // WRONG EMAIL / PASSWORD
        // ---------------------------------------------

        window.alert(
          "Invalid email or password.\n\n" +
          "Please check your email and password and try again."
        );

        setErrors((prev) => ({
          ...prev,
          email:
            "Please check your email",
          password:
            "Please check your password"
        }));

        return;
      }

      // =================================================
      // SUCCESS RESPONSE
      // =================================================

      const data =
        await response.json();

      console.log(
        "LOGIN RESPONSE:",
        data
      );

      const actualRole =
        data.role?.toUpperCase();

      console.log(
        "ACTUAL ROLE:",
        actualRole
      );

      console.log(
        "SELECTED LOGIN AS:",
        selectedRole
      );

      // =================================================
      // ADMIN
      // =================================================

      if (actualRole === "ADMIN") {
        saveUser(data);

        toast.success(
          "Admin Login Successful 🎉"
        );

        navigate("/admin", {
          replace: true
        });

        return;
      }

      // =================================================
      // ROLE MISMATCH
      // =================================================

      // CUSTOMER LOGIN BUT ACTUAL ROLE IS JOB SEEKER
      if (
        selectedRole === "CUSTOMER" &&
        actualRole === "JOB_SEEKER"
      ) {
        window.alert(
          "You are registered as a Job Seeker.\n\n" +
          "You cannot login as Customer using this account.\n\n" +
          "Please register a new account as Customer to use services."
        );

        goToRegister("CUSTOMER");

        return;
      }

      // JOB SEEKER LOGIN BUT ACTUAL ROLE IS CUSTOMER
      if (
        selectedRole === "JOB_SEEKER" &&
        (
          actualRole === "CUSTOMER" ||
          actualRole === "USER"
        )
      ) {
        window.alert(
          "You are registered as a Customer.\n\n" +
          "You cannot login as Job Seeker using this account.\n\n" +
          "Please register a new account as Job Seeker to apply for jobs."
        );

        goToRegister("JOB_SEEKER");

        return;
      }

      // =================================================
      // CUSTOMER LOGIN
      // =================================================

      if (
        selectedRole === "CUSTOMER" &&
        (
          actualRole === "CUSTOMER" ||
          actualRole === "USER"
        )
      ) {
        saveUser(data);

        toast.success(
          "Customer Login Successful 🎉"
        );

        // ---------------------------------------------
        // BOOK SERVICE
        // ---------------------------------------------

        if (
          redirectTo === "/book-service"
        ) {
          navigate("/book-service", {
            replace: true,
            state: {
              service:
                location.state?.service
            }
          });

          return;
        }

        // ---------------------------------------------
        // MY BOOKINGS
        // ---------------------------------------------

        if (
          redirectTo === "/my-bookings"
        ) {
          navigate("/my-bookings", {
            replace: true
          });

          return;
        }

        // ---------------------------------------------
        // CUSTOMER DASHBOARD
        // ---------------------------------------------

        navigate("/user/dashboard", {
          replace: true
        });

        return;
      }

      // =================================================
      // JOB SEEKER LOGIN
      // =================================================

      if (
        selectedRole === "JOB_SEEKER" &&
        actualRole === "JOB_SEEKER"
      ) {
        saveUser(data);

        toast.success(
          "Job Seeker Login Successful 🎉"
        );

        // ---------------------------------------------
        // APPLY JOB
        // ---------------------------------------------

        if (
          redirectTo === "/apply-job"
        ) {
          navigate("/apply-job", {
            replace: true,
            state: {
              job:
                location.state?.job
            }
          });

          return;
        }

        // ---------------------------------------------
        // MY APPLICATIONS
        // ---------------------------------------------

        if (
          redirectTo === "/my-applications"
        ) {
          navigate("/my-applications", {
            replace: true
          });

          return;
        }

        // ---------------------------------------------
        // JOB DASHBOARD
        // ---------------------------------------------

        navigate("/job-dashboard", {
          replace: true
        });

        return;
      }

      // =================================================
      // UNKNOWN ROLE
      // =================================================

      window.alert(
        "Invalid account role.\n\n" +
        "Please contact support."
      );

    } catch (error) {

      console.error(
        "Login Error:",
        error
      );

      // =================================================
      // NETWORK / SERVER ERROR
      // =================================================

      window.alert(
        "Unable to login right now.\n\n" +
        "Please check that the backend server is running and try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="login-container">

      <form
        className="login-form"
        onSubmit={handleSubmit}
      >

        {/* =================================================
            TITLE
        ================================================= */}

        <h2>
          Login
        </h2>

        {/* =================================================
            JOURNEY MESSAGE
        ================================================= */}

        {loginType === "JOB_SEEKER" ? (

          <p className="login-journey-text">
            💼 Login to continue with
            your job search
          </p>

        ) : loginType === "CUSTOMER" ? (

          <p className="login-journey-text">
            🛠️ Login to continue with
            your service booking
          </p>

        ) : (

          <p className="login-journey-text">
            Welcome back to ServiceBook
          </p>

        )}

        {/* =================================================
            LOGIN AS
        ================================================= */}

        <div className="input-group">

          <label
            htmlFor="loginRole"
            className="login-role-label"
          >
            Login As *
          </label>

          <select
            id="loginRole"
            name="loginRole"
            value={selectedRole}
            onChange={handleRoleChange}
            disabled={loading}
          >

            <option value="">
              Select Login Type
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

        </div>

        {/* =================================================
            EMAIL
        ================================================= */}

        <div className="input-group">

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={login.email}
            onChange={handleChange}
            disabled={loading}
            autoComplete="email"
          />

          {errors.email && (
            <span className="error-text">
              {errors.email}
            </span>
          )}

        </div>

        {/* =================================================
            PASSWORD
        ================================================= */}

        <div className="input-group">

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={login.password}
            onChange={handleChange}
            disabled={loading}
            autoComplete="current-password"
          />

          {errors.password && (
            <span className="error-text">
              {errors.password}
            </span>
          )}

        </div>

        {/* =================================================
            FORGOT PASSWORD
        ================================================= */}

        <Link
          to="/Forgotpassword"
          className="frm2"
        >
          Forgot Password?
        </Link>

        {/* =================================================
            LOGIN BUTTON
        ================================================= */}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Logging In..."
            : "Login"}
        </button>

        {/* =================================================
            REGISTER
        ================================================= */}

        <p className="frm1">

          Don't have an account?

          <Link
            to="/register"
            state={{
              registerType:
                selectedRole ||
                loginType ||
                "CUSTOMER",

              loginType:
                selectedRole ||
                loginType ||
                "CUSTOMER",

              redirectTo:
                selectedRole === "JOB_SEEKER"
                  ? "/job-dashboard"
                  : "/user/dashboard"
            }}
          >
            {" "}Register
          </Link>

        </p>

      </form>

    </div>
  );
}
