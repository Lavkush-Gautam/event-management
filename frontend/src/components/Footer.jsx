import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Apple,
} from "lucide-react";
import { footerData } from "../assets/data";

const iconComponents = {
  Facebook: <Facebook size={20} />,
  Twitter: <Twitter size={20} />,
  Instagram: <Instagram size={20} />,
  Youtube: <Youtube size={20} />,
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* ABOUT SECTION */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">About Us</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {footerData.about}
          </p>

        {/* SOCIAL MEDIA */}
<div className="flex gap-4 mt-5">
  {footerData.socialMedia.map((item, index) => (
    <a
      key={index}
      href={item.url}
      className="text-gray-400 h-8 w-8 flex justify-center items-center rounded-full border border-gray-500 hover:bg-gray-700 hover:text-white transition"
    >
      {iconComponents[item.icon]}
    </a>
  ))}
</div>

        </div>

        {/* QUICK LINKS */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Quick Links</h2>
          <ul className="space-y-2">
            {footerData.linksColumn1.map((link, index) => (
              <li key={index} className="hover:text-white cursor-pointer">
                {link}
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACT INFO */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Contact Us</h2>

          <div className="flex items-start gap-3 mb-3">
            <MapPin size={20} className="text-red-400" />
            <p>{footerData.contact.address}</p>
          </div>

          <div className="flex items-start gap-3 mb-3">
            <Mail size={20} className="text-green-400" />
            <p>{footerData.contact.email}</p>
          </div>

          <div className="flex items-start gap-3 mb-3">
            <Phone size={20} className="text-blue-400" />
            <p>{footerData.contact.phone}</p>
          </div>

          {/* APP DOWNLOAD
          <div className="mt-6 flex items-center gap-3 bg-black/70 px-4 py-2 rounded-lg w-fit cursor-pointer hover:bg-black transition">
            <Apple size={28} />
            <div className="leading-none">
              <p className="text-xs text-gray-400">Download on the</p>
              <p className="font-semibold text-white">App Store</p>
            </div>
          </div> */}
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="text-center text-gray-500 text-sm mt-10">
        © {new Date().getFullYear()} Eventify — All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
