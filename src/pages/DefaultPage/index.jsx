import React, { useState } from "react";
import MainLayout from "../../components/MainLayout";
import Header from "../../components/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Form } from "./styled-component";
import toast from "react-hot-toast";
import { sendDirectMessage } from "../../services/firebaseFunctions";

function DefaultPage() {
  const [formData, setFormData] = useState({ id: "", message: "" });

  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validateForm = () => {
    const { id, message } = formData;

    if (!id || (id !== "0928" && id !== "0830")) {
      toast.error("Please enter a valid unique ID");
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

        await toast.promise(sendDirectMessage(id, message), {
          loading: "Sending...",
          success: "Message sent successfully",
          error: (err) => err.message,
        });

        setFormData({ id: "", message: "" });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MainLayout>
      <Header />
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Sender Unique ID"
          name="id"
          onChange={handleInputChange}
          value={formData.id}
        />
        <Input
          type="text"
          placeholder="Type Message..."
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
