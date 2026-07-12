import Image from "next/image";
import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-card">
        <Image
          src="/lentium-logo.png"
          alt="LENTIUM PRODUCTION"
          width={300}
          height={157}
          className="login-logo"
          priority
        />
        <p className="eyebrow">LENTIUM ADMIN</p>
        <h1>Вход</h1>
        <p className="login-intro">
          Административният панел е достъпен само за оторизиран потребител.
        </p>
        <Suspense fallback={<p>Зареждане...</p>}>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
