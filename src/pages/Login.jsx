import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "../components/ui";
import { loginUser } from "../services";
import { useLoading } from "../hooks";
import { FormContainer } from "../styles";
import { MainLayout, toast, getFirebaseErrorMessage, Divider, validateEmail, loginRateLimiter, TEXT } from "../utils";

import { mailIcon, lockIcon } from "../assets/icons/svg/index.js";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const { loading, startLoading, stopLoading } = useLoading();
  const navigate = useNavigate();

  const handleInputChange = useCallback(
    e => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));

      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: "" }));
      }
    },
    [errors]
  );

  const validateForm = () => {
    const { email, password } = formData;
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!email) {
      newErrors.email = "Please enter email";
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter valid email";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Please enter password";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault();

      if (!validateForm()) return;

      if (!loginRateLimiter.checkLimit(formData.email)) {
        toast.error("Too many login attempts. Please wait 5 minutes before trying again.");
        return;
      }

      try {
        startLoading();
        const { email, password } = formData;

        const userDoc = await toast.promise(loginUser(email, password), {
          loading: "Verifying user...",
          success: "Login Successful",
          error: err => getFirebaseErrorMessage(err),
        });
        if (userDoc?.user?.uid) {
          setFormData({ email: "", password: "" });
          loginRateLimiter.reset(formData.email); // Reset rate limit on successful login
          try {
            localStorage.setItem("pmkp_last_active", String(Date.now()));
          } catch {}
          navigate(`/profile/${userDoc.user.uid}`);
        }
      } catch (error) {
      } finally {
        stopLoading();
      }
    },
    [formData, navigate]
  );

  return (
    <MainLayout>
      <HeaderBlock>
        <Title>{TEXT.LOGIN.TITLE}</Title>
        <Description>{TEXT.LOGIN.DESCRIPTION}</Description>
      </HeaderBlock>
      <FormContainer onSubmit={handleSubmit}>
        <div>
          <Input
            iconSrc={mailIcon}
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleInputChange}
            value={formData.email}
            autoComplete="email"
            error={!!errors.email}
            label="Email address"
            id="login-email"
          />
          {errors.email && <div style={{ color: "#ff4444", fontSize: "12px", marginTop: "4px", marginLeft: "4px" }}>{errors.email}</div>}
        </div>
        <div>
          <Input
            iconSrc={lockIcon}
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleInputChange}
            value={formData.password}
            autoComplete="current-password"
            error={!!errors.password}
            label="Password"
            id="login-password"
          />
          {errors.password && <div style={{ color: "#ff4444", fontSize: "12px", marginTop: "4px", marginLeft: "4px" }}>{errors.password}</div>}
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid transparent",
                  borderTop: "2px solid #000",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
            </div>
          ) : (
            "Login"
          )}
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

const HeaderBlock = styled.div`
  text-align: center;
`;

const Title = styled.h3`
  font-size: 18px;
`;

const Description = styled.p`
  font-size: var(--fs-xl);
`;
