import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mt-8 min-h-screen mx-auto">
        {children}
      </main>
      <Footer />
    </>
  );
}
  