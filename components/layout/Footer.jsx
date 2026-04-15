import Link from "next/link";
import { Mail, MapPin, PawPrint, Phone } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white pb-8 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-primary-600">
              <PawPrint size={28} />
              <span className="text-xl font-bold">PetCare Hub</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500">
              Premium all-in-one platform bridging the gap between top-tier pet services,
              products, and loving owners exactly when you need them.
            </p>
            <div className="flex gap-4 pt-2 text-gray-400">
              <a href="#" className="transition-colors hover:text-primary-500"><FaFacebook size={20} /></a>
              <a href="#" className="transition-colors hover:text-primary-500"><FaTwitter size={20} /></a>
              <a href="#" className="transition-colors hover:text-primary-500"><FaInstagram size={20} /></a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-gray-500 transition-colors hover:text-primary-600">Home Page</Link></li>
              <li><Link href="/services" className="text-sm text-gray-500 transition-colors hover:text-primary-600">Book Services</Link></li>
              <li><Link href="/products" className="text-sm text-gray-500 transition-colors hover:text-primary-600">Pet Products</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">Support</h3>
            <ul className="space-y-3">
              <li><Link href="/complaints" className="text-sm text-gray-500 transition-colors hover:text-primary-600">Help Center & Tickets</Link></li>
              <li><Link href="/login" className="text-sm text-gray-500 transition-colors hover:text-primary-600">Account Login</Link></li>
              <li><a href="#" className="text-sm text-gray-500 transition-colors hover:text-primary-600">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-gray-500">
                <MapPin size={16} className="text-primary-400" />
                <span>123 Bark Avenue, Mumbai, IN</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-500">
                <Phone size={16} className="text-primary-400" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-500">
                <Mail size={16} className="text-primary-400" />
                <span>hello@petcarehub.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 md:flex-row">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} PetCare Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
