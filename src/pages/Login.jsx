import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "../components/ui";
import { loginUser } from "../services";
import { useLoading } from "../hooks";
import { FormContainer } from "../styles";
import { MainLayout, toast, getFirebaseErrorMessage, Divider } from "../utils";

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
      toast.error("Please enter valid email");
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
          error: (err) => getFirebaseErrorMessage(err),
        });
        if (userDoc?.user?.uid) {
          setFormData({ email: "", password: "" });
          navigate(`/profile/${userDoc.user.uid}`);
        }
      } catch (error) {
        console.log(getFirebaseErrorMessage(error));
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
      <Divider>❤️</Divider>
      <Link to="/">
        <Button type="button">Go Back</Button>
      </Link>
    </MainLayout>
  );
}

export default React.memo(Login);
