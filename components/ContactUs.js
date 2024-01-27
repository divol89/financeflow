import emailjs from "emailjs-com";
import React from "react";

export default function ContactUs() {
  function sendEmail(e) {
    e.preventDefault();

    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        e.target,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID,
      )

      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        },
      );
    e.target.reset();
  }

  return (
    <div id="contact us" className=" flex items-center justify-center h-full ">
      <form
        className="bg-yellow-500 shadow-md rounded-lg px-8 pt-1 mb-4 lg:w-1/2 mt-0"
        onSubmit={sendEmail}
      >
        <h3 className="text-xl lg:text-3xl mb-4 text-center pt-2 mt-2 text-white font-bold">
          Contact Us
        </h3>

        <div className="mb-4 flex flex-col p-4 pl-2 lg:flex-row lg:space-x-4 ">
          <div className="w-full lg:w-2/5">
            <label className="block  text-center    text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              className="shadow appearance-none border  rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="from_name"
              type="text"
              required
            />
          </div>
          <div className="w-full lg:w-2/8 lg:pl-12">
            <label className="block text-center text-gray-700 text-sm font-bold mb-2 ">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="from_mail"
              type="email"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-center text-gray-700 text-sm font-bold mb-2">
            Message
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-12 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="message"
            required
          />
        </div>

        <div className="flex items-center justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
}
