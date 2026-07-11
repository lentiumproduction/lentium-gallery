import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="eyebrow">404</p>
      <h1>Галерията не е намерена.</h1>
      <Link className="primary-button" href="/">Към началната страница</Link>
    </main>
  );
}
