import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <div className="container">
          <h1>Peer Academic Study Support</h1>

          <p>
            The all-in-one platform for studying,
            sharing resources, preparing for exams,
            and succeeding in school.
          </p>
        </div>
      </main>
    </>
  );
}