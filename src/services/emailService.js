import emailjs from "@emailjs/browser";

export const sendMail = async () => {
  try {
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      { message: "PRANU IS ONLINE" },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );
  } catch {}
};
