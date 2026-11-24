import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { Portrait } from "@/components/portrait";
import profile from "@/content/profile.json";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "About", alternates: { canonical: "/about/" } };

const sections = [
  ["research", "Research"], ["experience", "Experience"], ["skills", "Skills"],
  ["certifications", "Certifications"], ["education", "Education"], ["leadership", "Leadership"],
  ["achievements", "Achievements"],
];

function Credentials({ entries }: { entries: typeof profile.education }) {
  return (
    <ul className="credential-list">
      {entries.map(({ title, organization, date }) => (
        <li key={title}>
          <div><strong>{title}</strong><span>{organization}</span></div>
          <span className="credential-date">{date}</span>
        </li>
      ))}
    </ul>
  );
}

export default function About() {
  return (
    <div className="shell inner-page">
      <div className="about-hero" id="summary">
        <div>
          <p className="hero-location"><MapPin size={15} aria-hidden="true" /> Tangerang, Indonesia</p>
          <h1>{site.name}</h1>
          <p className="hero-role">Application Security Engineer · Penetration Tester</p>
          <p className="muted about-summary">{profile.summary}</p>
          <div className="actions">
            <a className="button button-primary" href="/CV.pdf" target="_blank" rel="noopener noreferrer">Hit Me!</a>
          </div>
        </div>
        <Portrait eager />
      </div>
      <div className="reading-layout about-layout">
        <nav className="contents" aria-label="On this page">
          <p>On this page</p>
          <ul>{sections.map(([id, title]) => <li key={id}><a href={`#${id}`}>{title}</a></li>)}</ul>
        </nav>
        <div className="about-content">
          <section id="research" className="profile-section">
            <h2>Research</h2>
            <p className="muted">{profile.researchIntro}</p>
            <ul className="tags" aria-label="Research interests">{profile.interests.map((value) => <li key={value}>{value}</li>)}</ul>
            {profile.research.map(({ id, title, authors, venue, reference, description, status, topics }) => (
              <article className="research-entry" key={id} id={id}>
                <p className="work-label">{status}</p>
                <h3>{title}</h3>
                <p className="entry-meta">{authors} · {reference ? <a className="text-link" href={reference}>{venue}</a> : venue}</p>
                <p>{description}</p>
                <ul className="tags" aria-label="Topics">{topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
              </article>
            ))}
          </section>
          <section id="experience" className="profile-section">
            <h2>Experience</h2>
            <ol className="timeline">
              {profile.experience.map(({ title, organization, date, items }) => (
                <li key={organization}>
                  <div className="timeline-heading"><h3>{title}</h3><span>{date}</span></div>
                  <p className="entry-meta">{organization}</p>
                  <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
                </li>
              ))}
            </ol>
          </section>
          <section id="skills" className="profile-section">
            <h2>Skills</h2>
            <div className="skills-grid">{profile.skills.map(({ title, items }) => (
              <div key={title}><h3>{title}</h3><ul className="tags">{items.map((item) => <li key={item}>{item}</li>)}</ul></div>
            ))}</div>
          </section>
          <section id="certifications" className="profile-section"><h2>Certifications</h2><Credentials entries={profile.certifications} /></section>
          <section id="education" className="profile-section"><h2>Education</h2><Credentials entries={profile.education} /></section>
          <section id="leadership" className="profile-section">
            <h2>Leadership and CTF</h2>
            {profile.leadership.map(({ title, date, items }) => <div className="profile-list" key={title}><div className="timeline-heading"><h3>{title}</h3>{date && <span>{date}</span>}</div><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>)}
          </section>
          <section id="achievements" className="profile-section">
            <h2>Achievements</h2>
            {profile.achievements.map(({ title, items }) => <div className="profile-list" key={title}><h3>{title}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>)}
          </section>
        </div>
      </div>
    </div>
  );
}
