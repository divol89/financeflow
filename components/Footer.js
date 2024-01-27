import { FaTwitter, FaTelegram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-4 text-white text-center">
      <div className="flex justify-center mb-2">
        <a
          href="https://twitter.com/financeflowx"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white mx-2"
        >
          <FaTwitter size={20} />
        </a>
        <a
          href="https://t.me/+Rg6SJ5On8FpiMzg8"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white mx-2"
        >
          <FaTelegram size={20} />
        </a>
        <a
          href="mailto:financeflowelprofit@gmail.com"
          className="text-white mx-2"
        >
          @mail
        </a>
      </div>
      <p className="text-xs italic">
        Disclaimer: Nothing mentioned on this website constitutes financial
        advice. Investing in cryptocurrencies carries significant risks, and you
        should conduct your own research before making any investment decisions.
      </p>
    </footer>
  );
};

export default Footer;
