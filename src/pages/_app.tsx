import { type AppType } from "next/app";
import { Geist } from "next/font/google";
import { ProductProvider } from "~/context/ProductContext";
import "~/styles/globals.css";

const geist = Geist({
  subsets: ["latin"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ProductProvider>
      <div className={geist.className}>
        <Component {...pageProps} />
      </div>
    </ProductProvider>
  );
};

export default MyApp;
