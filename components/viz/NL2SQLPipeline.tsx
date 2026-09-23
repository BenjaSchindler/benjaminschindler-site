"use client";

import { motion } from "framer-motion";
import { DemoControls, useDemoPlayback } from "./primitives/DemoPlayback";
import { useLanguage } from "@/lib/Language";

export function NL2SQLPipeline() {
  const { lang } = useLanguage();
  const es = lang === "es";
  const [ref, demo] = useDemoPlayback(4, 1100);
  return <div ref={ref} className="grid gap-6 md:grid-cols-[0.7fr_1fr] md:gap-8">
    <figure aria-label={es ? "Cierre mensual: antes 8 días, después 3 días" : "Monthly close: 8 days before, 3 days after"}>
      <figcaption className="text-base font-medium">{es ? "Cierre mensual" : "Monthly close"}</figcaption>
      <div className="mt-4 space-y-3">
        {[{ label: es ? "Antes" : "Before", days: 8 }, { label: es ? "Después" : "After", days: 3 }].map(({ label, days }) => <div key={days}>
          <div className="mb-1.5 flex justify-between text-sm"><span className="text-[var(--foreground-dim)]">{label}</span><span className="tabular-nums font-medium">{days} {es ? "días" : "days"}</span></div>
          <div aria-hidden className="h-2 rounded-full bg-[var(--border)]"><motion.div initial={false} animate={{ scaleX: demo.step >= (days === 8 ? 1 : 2) ? 1 : 0 }} transition={{ duration: demo.reduced ? 0 : .7, ease: [0.22, 1, 0.36, 1] }} className={`h-full origin-left rounded-full ${days === 3 ? "bg-[var(--accent)]" : "bg-[var(--foreground-muted)]"}`} style={{ width: `${days / 8 * 100}%` }} /></div>
        </div>)}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-[var(--foreground-dim)]">{es ? "Resultado reportado en el CV · automatización de facturas" : "Result reported in the CV · invoice automation"}</p>
    </figure>

    <figure className="border-t border-[var(--border-strong)] pt-5 md:border-t-0 md:border-l md:pt-0 md:pl-8">
      <figcaption className="text-base font-medium">{es ? "De una pregunta a una consulta" : "From a question to a query"}</figcaption>
      <p className="mt-1 text-xs text-[var(--foreground-dim)]">{es ? "Ejemplo ilustrativo con datos ficticios" : "Illustrative example with fictional data"}</p>
      <ol className="mt-4 space-y-4">
        <li className="border-l-2 border-[var(--accent)] pl-4">
          <p className="text-xs font-medium text-[var(--accent-cyan)]">01 · {es ? "Pregunta" : "Question"}</p>
          <p className="mt-1 text-sm leading-relaxed">{es ? "¿Cuáles son los tres clientes con más compras en los últimos tres meses?" : "Which three customers spent the most in the last three months?"}</p>
        </li>
        <li className="border-l-2 border-[var(--border-strong)] pl-4">
          <details className="group">
            <summary className="min-h-10 cursor-pointer text-sm font-medium text-[var(--foreground-dim)] hover:text-[var(--foreground)]">02 · {es ? "Ver consulta SQL generada" : "View generated SQL query"}</summary>
            <pre className="mt-2 whitespace-pre-wrap break-words rounded-md border border-[var(--border)] bg-[var(--surface)] p-3 font-mono text-xs leading-relaxed text-[var(--foreground-dim)]"><code>{`SELECT customer_id, SUM(amount) AS total
FROM orders
WHERE created_at >= now() - INTERVAL '3 months'
GROUP BY customer_id
ORDER BY total DESC
LIMIT 3;`}</code></pre>
          </details>
        </li>
        <li className="border-l-2 border-[var(--border-strong)] pl-4">
          <p className="text-xs font-medium text-[var(--accent-cyan)]">03 · {es ? "Resultado" : "Result"}</p>
          <table className="mt-2 w-full text-left text-sm tabular-nums">
            <caption className="sr-only">{es ? "Resultado ficticio de la consulta" : "Fictional query result"}</caption>
            <thead><tr className="text-xs text-[var(--foreground-dim)]"><th scope="col" className="pb-2 font-normal">{es ? "Cliente" : "Customer"}</th><th scope="col" className="pb-2 text-right font-normal">{es ? "Total (u. monetarias)" : "Total (currency units)"}</th></tr></thead>
            <tbody>{[["C-101", 1200], ["C-204", 950], ["C-309", 720]].map(([id, value]) => <motion.tr key={id} initial={false} animate={{ opacity: demo.step >= 3 ? 1 : .65, y: demo.step >= 3 || demo.reduced ? 0 : 4 }} transition={{ duration: demo.reduced ? 0 : .3 }} className="border-t border-[var(--border)]"><th scope="row" className="py-2 font-normal">{id}</th><td className="py-2 text-right">{Number(value).toLocaleString(es ? "es-CL" : "en-US")}</td></motion.tr>)}</tbody>
          </table>
        </li>
      </ol>
    </figure>
    <div className="md:col-span-2"><DemoControls playback={demo} label={es ? "Impacto reportado · consulta ilustrativa" : "Reported impact · illustrative query"} /></div>
  </div>;
}
