import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full  border-b border-slate-200 bg-white py-4">
      <div className="container max-w-8xl mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <div className="mb-4 md:mb-0">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo/contracty-logo.png"
              alt="Contracty logo"
              width={80}
              height={80}
              className="rounded object-cover"
              priority
            />
          </Link>
        </div>
        <div className="flex flex-wrap justify-center md:justify-start mb-4 md:mb-0">
          <ul className="flex space-x-4 text-black">
            <li>
              <Link href="/about" className="hover:text-orange-500 transition">
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-orange-500 transition"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-orange-500 transition">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                href="/privacy-policy"
                className="hover:text-orange-500 transition"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm text-black mt-2 md:mt-0">
            &copy; {currentYear} Contracty. Built for trust. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
