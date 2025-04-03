import React, { useState } from 'react';
import BACKEND_URL from '../components/config';

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
    if (e.target.checked) setError("");
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || (state === "Sign Up" && !formData.name)) {
      setError("All fields are required.");
      return false;
    }

    if (!formData.email.endsWith("@gmail.com")) {
      setError("Email must be a valid Gmail address.");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    if (!isChecked) {
      setError("You must accept the terms before proceeding.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const endpoint = state === "Login" ? "/login" : "/signup";
      const requestBody = state === "Sign Up" ? 
        { name: formData.name, email: formData.email, password: formData.password } : 
        { email: formData.email, password: formData.password };

      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      console.log(responseData); // Debugging

      if (response.ok && responseData.success) {
        localStorage.setItem("auth-token", responseData.token);
        window.location.replace("/");
      } else {
        setError(responseData.error || "An error occurred.");
      }
    } catch (error) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" && (
            <input
              name="name"
              value={formData.name}
              onChange={changeHandler}
              type="text"
              placeholder="Your Name"
              required
            />
          )}
          <input
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Email Address"
            required
          />
          <input
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="Password"
            required
          />
        </div>

        <div className="loginsignup-agree">
          <input
            type="checkbox"
            id="termsCheckbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="termsCheckbox">
            By continuing, I agree to the terms of use & privacy policy.
          </label>
        </div>

        {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}

        <button onClick={handleSubmit}>
          Continue
        </button>

        {state === "Sign Up" ? (
          <p className="loginsignup-login">
            Already have an account? <span onClick={() => setState("Login")}>Login here</span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account? <span onClick={() => setState("Sign Up")}>Click here</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
