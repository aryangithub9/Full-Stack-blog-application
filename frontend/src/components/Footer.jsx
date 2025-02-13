import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          {/* Logo & About */}
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-white">MyBlog</h2>
            <p className="text-sm text-gray-400 mt-2">
              Sharing ideas, stories, and insights.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col md:flex-row gap-4 text-sm">
            <p  className="hover:text-white">Home</p>
            <p  className="hover:text-white">About</p>
            <p  className="hover:text-white">Categories</p>
            <p  className="hover:text-white">Contact</p>
          </div>

          {/* Social Links */}
          <div className="flex gap-4 text-lg mt-4 md:mt-0">
            <p  className="hover:text-white"><FaFacebook /></p>
            <p  className="hover:text-white"><FaTwitter /></p>
            <p  className="hover:text-white"><FaInstagram /></p>
            <p  className="hover:text-white"><FaGithub /></p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-gray-500 mt-6">
          &copy; {new Date().getFullYear()} Blogify. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
