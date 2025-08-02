import React, { useState } from "react";
import { Divider, MainLayout } from "../utils/ComponentUtils";
import { FormContainer } from "../styles/customStyles";
import Input from "../components/ui/Input";
import { Button } from "../components/ui";

function Registration() {
  const [formData, setFormData] = useState({
    userInfo: {},
    chatPatnerInfo: {},
  });

  const handleSubmit = e => {
    e.preventDefault();
  };

  return (
    <MainLayout>
      <h3 align="center">One Time Registration</h3>
      <FormContainer onSubmit={handleSubmit}>
        <Divider>Your details</Divider>
        <Input type="text" placeholder="Username" />
        <Input type="email" placeholder="Email" />
        <Input type="text" placeholder="Unique ID (4 Digit Number)" maxLength={4} />
        <Divider>Chat patner details</Divider>
        <Input type="text" placeholder="Username" />
        <Input type="email" placeholder="Email" />
        <Input type="text" placeholder="Unique ID (4 Digit Number)" maxLength={4} />
        <Button type="submit">Register</Button>
      </FormContainer>
    </MainLayout>
  );
}

export default Registration;
