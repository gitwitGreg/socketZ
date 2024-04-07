import NavBar from "@/components/NavBar";
import Page from "./messages/messages";

export default function Home() {

  return (
    <section className="flex flex-col h-auto">
    <nav>
      <NavBar />
    </nav>
    <main>
      <Page />
    </main>
    </section>
  );
}

