import React, { useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import MainLayout from "../../components/MainLayout";
import { Form, HeaderFlex } from "./styled-component";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/firebaseFunctions";
import toast from "react-hot-toast";
import { CustomButton } from "../../components/ui/Button/styled-component";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const navigate = useNavigate();

  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validateForm = () => {
    const { email, password } = formData;

    if (!email) {
      toast.error("Please enter Email");
      return false;
    }

    if (!password) {
      toast.error("Please enter Password");
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
                return "Invalid Email or Password";
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
      <HeaderFlex>
        <Link to="/">
          <CustomButton type="button">Back</CustomButton>
        </Link>
      </HeaderFlex>
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleInputChange}
          value={formData.email}
        />
        <Input
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleInputChange}
          value={formData.password}
        />

        <Button type="submit">Login</Button>
      </Form>
    </MainLayout>
  );
}

export default Login;
