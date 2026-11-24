import Link from "next/link";
import { Blocks, ScanLine, Terminal } from "lucide-react";

const work = [
  {
    label: "Undergraduate research",
    title: "Verifying malware analysis data",
    description: "An ongoing Gunadarma University research project using smart contracts to verify analysis records and an LLM to summarize findings.",
    href: "/about/#paper-blockchain",
    icon: Blocks,
  },
  {
    label: "Registered patent",
    title: "ParQR",
    description: "A QR-based parking monitoring system that records violations in real time and keeps a verifiable log.",
    href: "/about/#paper-parqr",
    icon: ScanLine,
  },
  {
    label: "Community",
    title: "CTF challenge design",
    description: "Web security challenges authored for TechnoFair, Hackfest, and Gunadarma Code Week.",
    href: "/about/#leadership",
    icon: Terminal,
  },
];

export function SelectedWork() {
  return (
    <section id="featured-research" className="section-block" aria-labelledby="work-heading">
      <div className="section-heading">
        <h2 id="work-heading">Selected work</h2>
        <Link className="text-link" href="/about/#research">Research &amp; background</Link>
      </div>
      <div className="work-grid">
        {work.map(({ label, title, description, href, icon: Icon }) => (
          <Link href={href} className="work-card" key={title}>
            <span className="work-icon"><Icon size={21} strokeWidth={1.55} aria-hidden="true" /></span>
            <p className="work-label">{label}</p>
            <h3>{title}</h3>
            <p className="muted">{description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
