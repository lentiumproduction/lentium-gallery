import Image from "next/image";
import Link from "next/link";
import { createGallery } from "../actions";
import CoverUploader from "@/components/CoverUploader";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

const errorMessages: Record<string, string> = {
  "missing-title": "Въведи заглавие на галерията.",
  "invalid-slug": "Адресът на галерията не е валиден.",
  "duplicate-slug": "Вече съществува галерия с този адрес.",
  database: "Supabase отказа записа. Провери RLS политиките.",
};

export default async function NewGalleryPage({ searchParams }: PageProps) {
  const { error } = await searchParams;

  return (
    <main className="admin-page">
      <header className="admin-topbar">
        <Image
          src="/lentium-logo.png"
          alt="LENTIUM PRODUCTION"
          width={220}
          height={115}
          className="admin-logo"
          priority
        />
        <div>
          <p className="eyebrow">LENTIUM ADMIN</p>
          <h1>Нова галерия</h1>
          <p className="admin-subtitle">
            Създай клиентска галерия без редактиране на код.
          </p>
        </div>
        <Link className="secondary-admin-button" href="/admin">
          Назад
        </Link>
      </header>

      <section className="admin-form-panel">
        {error && (
          <div className="admin-alert">
            {errorMessages[error] ?? "Възникна неизвестна грешка."}
          </div>
        )}

        <form action={createGallery} className="admin-form">
          <div className="form-grid">
            <label className="form-field form-field-wide">
              Заглавие
              <input
                name="title"
                placeholder="Например: Мария & Иван"
                required
              />
            </label>

            <label className="form-field">
              Адрес на галерията
              <input
                name="slug"
                placeholder="maria-ivan"
                pattern="[a-z0-9\u0400-\u04ff-]+"
              />
              <small>
                Остави празно и системата ще го създаде автоматично.
              </small>
            </label>

            <label className="form-field">
              Дата на сватбата
              <input name="wedding_date" type="date" />
            </label>

            <label className="form-field form-field-wide">
              Послание
              <textarea
                name="message"
                rows={4}
                defaultValue="Вашите спомени са готови."
              />
            </label>

            <div className="form-field form-field-wide">
              <span>Корична снимка</span>
              <CoverUploader />
            </div>

            <label className="form-field form-field-wide">
              MEGA линк
              <input
                name="mega_url"
                type="url"
                placeholder="https://mega.nz/folder/..."
              />
            </label>
          </div>

          <label className="publish-toggle">
            <input name="is_published" type="checkbox" defaultChecked />
            <span>
              <strong>Публикувай веднага</strong>
              <small>Галерията ще бъде видима за клиента.</small>
            </span>
          </label>

          <div className="admin-form-actions">
            <Link className="secondary-admin-button" href="/admin">
              Отказ
            </Link>
            <button className="primary-button" type="submit">
              Създай галерията
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
