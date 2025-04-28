import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-900 py-8">
      <div className="container mx-auto flex items-center justify-start px-4 py-4">
        <Link href="/" className="text-5xl font-bold text-white hover:text-gray-300 transition-colors">
          NextShop
        </Link>
      </div>
    </header>
  );
} 