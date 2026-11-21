import { Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowUpRight, Info } from "lucide-react";
import RiskBadge from "@/components/RiskBadge";
import { formatTimestamp, shortenAddress, shortenHash } from "@/lib/format";
import { networkLabel } from "@/lib/blockchain/demo-data";

export default function AlertCard({ alert }) {
  return (
    <article className="panel overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/70 p-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-md border border-amber-400/25 bg-amber-400/10 text-amber-300">
            <AlertTriangle className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-medium text-foreground">{alert.type}</h3>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {networkLabel(alert.network)} · {formatTimestamp(alert.detectedAt)} · ref{" "}
              <span className="num">{alert.id}</span>
            </p>
          </div>
        </div>
        <RiskBadge risk={alert.risk} score={alert.score} />
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Why it was flagged
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-foreground/90">{alert.reason}</p>
          </div>
          <div className="rounded-lg border border-border/70 bg-secondary/30 p-3">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <Info className="h-3 w-3" /> Investigative context
            </p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{alert.flagged}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Related wallets
            </p>
            <ul className="mt-2 space-y-1.5">
              {alert.wallets.map((wallet) => (
                <li key={wallet}>
                  <Link
                    to="/investigate"
                    search={{ address: wallet, network: alert.network }}
                    className="group flex items-center justify-between gap-2 rounded border border-border/60 bg-card px-2.5 py-1.5"
                  >
                    <span className="num truncate text-[11px] text-foreground/85 group-hover:text-primary">
                      {shortenAddress(wallet, 10, 8)}
                    </span>
                    <ArrowUpRight className="h-3 w-3 shrink-0 text-muted-foreground group-hover:text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Transaction hashes
            </p>
            <ul className="mt-2 space-y-1">
              {alert.hashes.map((hash) => (
                <li key={hash} className="num truncate text-[11px] text-muted-foreground" title={hash}>
                  {shortenHash(hash)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="border-t border-border/70 bg-secondary/20 px-5 py-2.5 text-[10.5px] text-muted-foreground">
        Lead only — pattern alerts describe statistical behaviour and do not establish guilt, intent or
        criminal activity by any wallet or person.
      </p>
    </article>
  );
}