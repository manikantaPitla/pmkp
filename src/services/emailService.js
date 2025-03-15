import emailjs from "@emailjs/browser";

export const sendMail = async (toMail) => {
  await emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    { message: "USER IS ACTIVE CURRENTLY", to_email: toMail },
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  );
};
