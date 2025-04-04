import emailjs from "@emailjs/browser";

export const sendMail = async (name, toMail) => {
  if (!name && !toMail) {
    throw new Error("toMail or Name cannot be empty");
  }

  try {
    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        name,
        message: `USER IS ACTIVE CURRENTLY`,
        to_email: toMail,
      },
      PUBLIC_KEY
    );
  } catch (error) {
    throw error;
  }
};
