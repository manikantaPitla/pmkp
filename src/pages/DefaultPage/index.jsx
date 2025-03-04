import React, { useState } from "react";
import MainLayout from "../../components/MainLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Form } from "./styled-component";
import toast from "react-hot-toast";
import { getDocData } from "../../services/firebaseFunctions";

function DefaultPage() {
  const [formData, setFormData] = useState({ id: "", message: "" });

  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validateForm = () => {
    const { id, message } = formData;

    if (!id) {
      toast.error("Please enter a valid ID");
      return false;
    }

    if (!message) {
      toast.error("Please enter a message");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (validateForm()) {
        const { id, message } = formData;

        await toast.promise(getDocData(id, message), {
          loading: "Sending...",
          success: "Message sent successfully",
        });

        setFormData({ id: "", message: "" });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <MainLayout>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Enter Id"
          name="id"
          onChange={handleInputChange}
          value={formData.id}
        />
        <Input
          type="text"
          placeholder="Enter Message"
          name="message"
          onChange={handleInputChange}
          value={formData.message}
        />

        <Button type="submit">Send</Button>
      </Form>
    </MainLayout>
  );
}

export default DefaultPage;
