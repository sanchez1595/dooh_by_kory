"use client";

import Link from "next/link";
import { useApp } from "@/context/app-context";
import { soporteToast } from "@/data";

export function Footer() {
  const { openModal, showToast } = useApp();

  return (
    <footer className="mt-auto bg-[#0D0D0D] px-6 py-10 text-[#9CA3AF]">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/blanco.svg" alt="Kory" className="h-[22px]" />
          <span className="text-xs text-[#6B7280]">DOOH by Kory · © 2026</span>
        </div>
        <div className="flex gap-6 text-[12.5px]">
          <button onClick={() => openModal("como")} className="cursor-pointer text-[#9CA3AF] hover:text-white">
            Cómo funciona
          </button>
          <Link href="/panel" className="text-[#9CA3AF] hover:text-white">
            Para dueños
          </Link>
          <Link href="/para-redes" className="text-[#9CA3AF] hover:text-white">
            Para redes
          </Link>
          <Link href="/cuanto-cuesta" className="text-[#9CA3AF] hover:text-white">
            Precios
          </Link>
          <button onClick={() => showToast(soporteToast)} className="cursor-pointer text-[#9CA3AF] hover:text-white">
            Soporte
          </button>
        </div>
      </div>
    </footer>
  );
}
