import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="home">
      <section className="hero">
        <Image
          src="/lentium-logo.png"
          alt="LENTIUM PRODUCTION"
          width={620}
          height={326}
          className="brand-logo"
          priority
        />

        <p className="eyebrow">КЛИЕНТСКА ФОТОГАЛЕРИЯ</p>
        <h1>Вашите спомени.<br />Представени красиво.</h1>
        <p className="intro">
          Частно пространство за разглеждане, избор и изтегляне на вашите фотографии.
        </p>

        <Link className="primary-button" href="/gallery/darina-georgi">
          Отвори примерната галерия
        </Link>
      </section>

      <footer>
        © {new Date().getFullYear()} LENTIUM PRODUCTION Ltd.
      </footer>
    </main>
  );
}
