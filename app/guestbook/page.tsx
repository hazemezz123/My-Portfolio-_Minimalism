import Navbar from "../components/ui/Navbar";
import Guestbook from "../components/sections/Guestbook";
import Footer from "../components/ui/Footer";

export default function GuestbookPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-14">
        <Guestbook />
      </div>
      <Footer />
    </main>
  );
}
