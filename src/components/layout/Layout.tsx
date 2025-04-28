import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({ children, title, description }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Head>
        <title>{title ? `${title} - NextShop` : "NextShop"}</title>
        <meta name="description" content={description || "NextShop - Your one-stop shop for Next.js products"} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="container mx-auto px-4 py-12">
        {children}
      </main>
      <Footer />
    </div>
  );
} 