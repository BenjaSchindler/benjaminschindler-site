"use client";
import { profile } from "@/lib/data";
import { SectionHeader } from "./SectionHeader";
import { Mail, Phone, MapPin } from "lucide-react";
import { LinkedinIcon } from "./icons/Brands";
import { useViewMode } from "@/lib/ViewMode";

export function ContactSection() {
  const { detailed } = useViewMode();

  return (
    <section id="contact" className="py-20 sm:py-28 px-6 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <SectionHeader index="05" title="contact" subtitle="open to interesting problems" />

        {detailed ? (
          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            <ContactCard
              icon={<Mail className="size-5" />}
              label="email"
              value={profile.email}
              href={`mailto:${profile.email}`}
            />
            <ContactCard
              icon={<LinkedinIcon className="size-5" />}
              label="linkedin"
              value="/in/benjamin-schindler"
              href={profile.linkedin}
              external
            />
            <ContactCard
              icon={<Phone className="size-5" />}
              label="phone"
              value={profile.phone}
              href={`tel:${profile.phone.replace(/\s/g, "")}`}
            />
            <ContactCard
              icon={<MapPin className="size-5" />}
              label="based in"
              value={profile.location}
            />
          </div>
        ) : (
          <div className="mt-8 max-w-2xl">
            <p className="font-serif text-2xl sm:text-3xl text-[var(--foreground)] leading-tight tracking-tight">
              Building production AI that pays back —{" "}
              <span className="italic text-[var(--accent-gold-soft)]">
                let&apos;s talk.
              </span>
            </p>
            <ul className="mt-7 space-y-3 text-sm sm:text-base font-normal">
              <ContactRow
                icon={<Mail className="size-4" />}
                label="Email"
                value={profile.email}
                href={`mailto:${profile.email}`}
              />
              <ContactRow
                icon={<LinkedinIcon className="size-4" />}
                label="LinkedIn"
                value="/in/benjamin-schindler"
                href={profile.linkedin}
                external
              />
              <ContactRow
                icon={<Phone className="size-4" />}
                label="Phone"
                value={profile.phone}
                href={`tel:${profile.phone.replace(/\s/g, "")}`}
              />
              <ContactRow
                icon={<MapPin className="size-4" />}
                label="Based in"
                value={profile.location}
              />
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const valueEl = href ? (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="text-[var(--foreground)] underline underline-offset-[6px] decoration-[var(--border-strong)] hover:decoration-[var(--accent-gold)] transition-colors"
    >
      {value}
    </a>
  ) : (
    <span className="text-[var(--foreground)]">{value}</span>
  );
  return (
    <li className="flex items-baseline gap-3">
      <span className="text-[var(--foreground-muted)] translate-y-[2px]">{icon}</span>
      <span className="w-20 text-[var(--foreground-muted)]">{label}</span>
      {valueEl}
    </li>
  );
}

function ContactCard({
  icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <span className="text-[var(--accent)]">{icon}</span>
      <div className="min-w-0">
        <div className="font-mono text-xs text-[var(--foreground-muted)]">{label}/</div>
        <div className="font-mono text-sm text-[var(--foreground)] truncate">{value}</div>
      </div>
    </>
  );

  const className =
    "flex items-center gap-4 p-4 rounded border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/40 hover:bg-[var(--surface-raised)] transition-colors";

  if (!href) {
    return <div className={className}>{inner}</div>;
  }

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={className}
    >
      {inner}
    </a>
  );
}
