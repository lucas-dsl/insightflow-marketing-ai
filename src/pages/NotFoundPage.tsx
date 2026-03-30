import { Link } from "react-router-dom";

export const NotFoundPage = () => (
  <section className="screen-container flex items-center justify-center">
    <div className="space-y-3 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        404
      </p>
      <h1 className="text-3xl font-bold text-foreground">Tela nao encontrada</h1>
      <p className="text-sm text-muted-foreground">
        O MVP possui apenas upload, dashboard, tendencias e insights.
      </p>
      <Link
        to="/"
        className="inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        Voltar para upload
      </Link>
    </div>
  </section>
);
