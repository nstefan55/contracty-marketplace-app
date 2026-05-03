import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-6">
      <div className="container mx-auto flex max-w-8xl flex-col gap-6 px-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
        <div className="flex justify-center md:justify-start">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo/contracty-logo.png"
              alt="Contracty logo"
              width={72}
              height={72}
              className="rounded object-cover"
              priority
            />
          </Link>
        </div>
        <div className="flex justify-center">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-black sm:grid-cols-4 md:flex md:flex-wrap md:gap-4">
            <li>
              <Link href="/about" className="transition hover:text-orange-500">
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="transition hover:text-orange-500"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link href="/terms" className="transition hover:text-orange-500">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                href="/privacy-policy"
                className="transition hover:text-orange-500"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex justify-center md:justify-end">
          <p className="text-sm text-black">
            &copy; {currentYear} Contracty. Built for trust. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
