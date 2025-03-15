import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../components/MainLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { loginUser } from "../services/firebaseFunctions";
import useLoading from "../hooks/useLoading";
import { Divider, FormContainer } from "../styles/customStyles";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const { loading, startLoading, stopLoading } = useLoading();
  const navigate = useNavigate();

  const handleInputChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

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

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      try {
        startLoading();
        const { email, password } = formData;

        const userDoc = await toast.promise(loginUser(email, password), {
          loading: "Verifying user...",
          success: "Login Successful",
          error: (err) => {
            const errorMessages = {
              "auth/network-request-failed": "Check your network connection",
              "auth/invalid-credential": "Invalid email or password",
              "auth/too-many-requests": "Too many requests, wait for some time",
            };
            return errorMessages[err.code] || "Something went wrong!";
          },
        });

        if (userDoc?.user?.uid) {
          setFormData({ email: "", password: "" });
          navigate(`/profile/${userDoc.user.uid}`);
        }
      } catch (error) {
        console.error(error);
      } finally {
        stopLoading();
      }
    },
    [formData, navigate]
  );

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
        <Button type="submit" disabled={loading}>
          Login
        </Button>
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

export default React.memo(Login);
