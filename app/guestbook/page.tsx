import Guestbook from "../components/sections/Guestbook";
import Footer from "../components/ui/Footer";

export const metadata = {
  title: "Guestbook | Hazem Ezz",
  description: "Leave a message in the guestbook.",
};

export default function GuestbookPage() {
  return (
    <main id="main-content">
      <div className="pt-14">
        <Guestbook />
      </div>
      <Footer />
    </main>
  );
}
