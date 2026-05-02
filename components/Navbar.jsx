import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
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
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-slate-700 transition hover:text-orange-500"
          >
            Home
          </Link>
          <Link
            href="/browse"
            className="text-sm font-medium text-slate-700 transition hover:text-orange-500"
          >
            Browse
          </Link>
          <Link
            href="/signin"
            className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
