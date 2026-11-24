import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell inner-page">
      <header className="page-heading">
        <h1>Page not found</h1>
        <p>The address may have changed or the page may have been removed.</p>
        <Link className="button button-primary" href="/">Back to home</Link>
      </header>
    </div>
  );
}
