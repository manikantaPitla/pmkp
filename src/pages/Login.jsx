import React, { useState } from "react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import MainLayout from "../components/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/firebaseFunctions";
import toast from "react-hot-toast";
import { Divider, FormContainer } from "../styles/customStyles";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const navigate = useNavigate();

  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validateForm = () => {
    const { email, password } = formData;

    if (!email) {
      toast.error("Please enter email");
      return false;
    }

    if (!password) {
      toast.error("Please enter password");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email format");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (validateForm()) {
        const { email, password } = formData;
        const userDoc = await toast.promise(loginUser(email, password), {
          loading: "verifying user...",
          success: "Login Successful",
          error: (err) => {
            switch (err.code) {
              case "auth/network-request-failed":
                return "Check your network connection";
              case "auth/invalid-credential":
                return "Invalid email or password";
              default:
                return "Something went wrong!";
            }
          },
        });
        if (userDoc?.user?.uid) {
          setFormData({ email: "", password: "" });
          navigate(`/profile/${userDoc.user.uid}`);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MainLayout>
      <FormContainer onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleInputChange}
          value={formData.email}
          autoComplete="true"
        />
        <Input
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleInputChange}
          value={formData.password}
        />

        <Button type="submit">Login</Button>
      </FormContainer>
      <Divider>
        <hr />
        ❤️
        <hr />
      </Divider>
      <Link to="/">
        <Button type="button">Go Back</Button>
      </Link>
    </MainLayout>
  );
}

export default Login;
