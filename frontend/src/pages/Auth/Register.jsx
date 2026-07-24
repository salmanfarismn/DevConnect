import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { FormControl, Select, Button } from "@mui/material";
import { useState } from "react";
import "./Register.css";
import { Link } from "@mui/material";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "client",
    password: "",
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post(
      "http://localhost:3000/api/auth/register",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="register-title">Create Account</h1>

        <p className="register-subtitle">
          Join DevConnect and start collaborating.
        </p>

        <form
          className="register-form"
          method="POST"
          action=""
          onSubmit={handleSubmit}
        >
          <TextField
            required
            id="register-name"
            label="Enter your name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <TextField
            required
            id="register-email"
            label="Enter your email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />

          <TextField
            required
            id="register-phone"
            label="Phone number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <FormControl>
            <InputLabel id="register-role-label">Role</InputLabel>

            <Select
              labelId="register-role-label"
              id="register-role-select"
              name="role"
              value={formData.role}
              label="Role"
              onChange={handleChange}
            >
              <MenuItem value={"client"}>Client</MenuItem>
              <MenuItem value={"developer"}>Developer</MenuItem>
            </Select>
          </FormControl>

          <TextField
            required
            id="register-password"
            name="password"
            label="Enter your password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />

          <Button type="submit" variant="contained" className="register-btn">
            Register
          </Button>
        </form>

        <p className="register-footer">
          Already have an account?{" "}
          <span>
            <Link to="/login">Login</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
