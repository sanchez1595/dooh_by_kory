"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { ciudades, fechasOpts, presupuestos } from "@/data";
import { fmtDia } from "@/lib/format";
import { RangePicker } from "@/components/range-picker";

type Dropdown = "ciudad" | "fechas" | "presu" | null;

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#724CF5" className="h-3 w-3" strokeWidth={2.4}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function DropdownPanel({
  minWidth,
  children,
}: {
  minWidth: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ minWidth }}
      onClick={(e) => e.stopPropagation()}
      className="absolute top-[calc(100%+8px)] left-0 z-20 max-w-[calc(100vw-48px)] cursor-default rounded-xl border border-slate-200 bg-white p-1.5 text-left shadow-dropdown"
    >
      {children}
    </div>
  );
}

function DropdownItem({
  active,
  label,
  onPick,
}: {
  active: boolean;
  label: string;
  onPick: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onPick();
      }}
      className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-left text-[13.5px] font-semibold hover:bg-kory-pale ${
        active ? "bg-kory-tint text-kory" : "text-slate-700"
      }`}
    >
      {label}
      <span className="text-xs text-kory">{active ? "✓" : ""}</span>
    </button>
  );
}

export function SearchBar({ dropdown, setDropdown }: { dropdown: Dropdown; setDropdown: (d: Dropdown) => void }) {
  const router = useRouter();
  const app = useApp();
  const [pendiente, setPendiente] = useState<number | null>(null);

  // Si el dropdown se cierra por click fuera, descartar la selección a medias
  useEffect(() => {
    if (dropdown !== "fechas") setPendiente(null);
  }, [dropdown]);

  const toggle = (d: Exclude<Dropdown, null>) => {
    setPendiente(null);
    setDropdown(dropdown === d ? null : d);
  };
  const finDia = app.inicioDia + app.dias - 1;

  return (
    <div
      data-searchbar
      className="relative mx-auto mt-9 grid max-w-[876px] grid-cols-1 items-stretch rounded-2xl bg-white p-2 shadow-modal md:grid-cols-[1.2fr_1.2fr_1fr_auto]"
    >
      <div
        onClick={() => toggle("ciudad")}
        className="relative cursor-pointer rounded-[10px] border-slate-100 px-[18px] py-2.5 text-left hover:bg-kory-pale md:border-r"
      >
        <div className="flex items-center gap-[5px] text-[11px] font-bold tracking-[0.04em] text-ink uppercase">
          Ciudad <Chevron />
        </div>
        <div className="mt-0.5 text-sm font-semibold text-ink">
          {app.ciudad === "Todas" ? "Todas las ciudades" : app.ciudad}
        </div>
        {dropdown === "ciudad" && (
          <DropdownPanel minWidth="220px">
            {ciudades.map((c) => (
              <DropdownItem
                key={c}
                active={c === app.ciudad}
                label={c === "Todas" ? "Todas las ciudades" : c}
                onPick={() => {
                  app.set({ ciudad: c });
                  setDropdown(null);
                }}
              />
            ))}
          </DropdownPanel>
        )}
      </div>
      <div
        onClick={() => toggle("fechas")}
        className="relative cursor-pointer rounded-[10px] border-slate-100 px-[18px] py-2.5 text-left hover:bg-kory-pale md:border-r"
      >
        <div className="flex items-center gap-[5px] text-[11px] font-bold tracking-[0.04em] text-ink uppercase">
          Fechas de campaña <Chevron />
        </div>
        <div className="mt-0.5 text-sm font-semibold text-ink">
          {fmtDia(app.inicioDia)} — {fmtDia(finDia)}
        </div>
        {dropdown === "fechas" && (
          <DropdownPanel minWidth="296px">
            <div className="flex gap-1.5 px-1.5 pt-1 pb-2">
              {fechasOpts.map((fo) => (
                <button
                  key={fo.dias}
                  onClick={() => {
                    setPendiente(null);
                    app.set({ dias: fo.dias });
                    setDropdown(null);
                  }}
                  className={`flex-1 cursor-pointer rounded-lg border py-1.5 text-[11.5px] font-bold ${
                    fo.dias === app.dias && pendiente === null
                      ? "border-kory bg-kory-tint text-kory"
                      : "border-slate-200 bg-white text-slate-600 hover:border-kory"
                  }`}
                >
                  {fo.dias} días
                </button>
              ))}
            </div>
            <RangePicker
              inicioDia={app.inicioDia}
              finDia={finDia}
              pendiente={pendiente}
              onPick={(g) => {
                if (pendiente === null) {
                  setPendiente(g);
                } else if (g >= pendiente) {
                  app.set({ inicioDia: pendiente, dias: g - pendiente + 1 });
                  setPendiente(null);
                  setDropdown(null);
                } else {
                  setPendiente(g);
                }
              }}
            />
          </DropdownPanel>
        )}
      </div>
      <div
        onClick={() => toggle("presu")}
        className="relative cursor-pointer rounded-[10px] px-[18px] py-2.5 text-left hover:bg-kory-pale"
      >
        <div className="flex items-center gap-[5px] text-[11px] font-bold tracking-[0.04em] text-ink uppercase">
          Presupuesto <Chevron />
        </div>
        <div className="mt-0.5 text-sm font-semibold text-ink">
          {presupuestos.find((p) => p.valor === app.presupuesto)?.label ?? "Sin límite"}
        </div>
        {dropdown === "presu" && (
          <DropdownPanel minWidth="190px">
            {presupuestos.map((b) => (
              <DropdownItem
                key={b.label}
                active={b.valor === app.presupuesto}
                label={b.label}
                onPick={() => {
                  app.set({ presupuesto: b.valor });
                  setDropdown(null);
                }}
              />
            ))}
          </DropdownPanel>
        )}
      </div>
      <button
        onClick={() => router.push("/mapa")}
        className="mx-1.5 inline-flex h-12 cursor-pointer items-center gap-2 self-center rounded-[11px] bg-kory px-[26px] text-sm font-bold text-white transition-colors hover:bg-kory-hover"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4" strokeWidth={2.4}>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        Buscar
      </button>
    </div>
  );
}
