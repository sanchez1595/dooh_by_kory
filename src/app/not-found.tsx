import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <div className="flex h-[120px] w-full max-w-[320px] items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1A0A3E,#724CF5)]">
        <span className="font-mono text-[13px] font-semibold tracking-[0.16em] text-white/60 uppercase">
          Pantalla no encontrada
        </span>
      </div>
      <h1 className="mt-6 mb-2 text-[26px] font-extrabold tracking-[-0.02em]">
        Esta valla no existe (404)
      </h1>
      <p className="m-0 max-w-[38ch] text-sm leading-[1.7] text-slate-600">
        La página que buscas no está al aire. Pero hay 340+ pantallas esperando tu anuncio.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="flex h-11 items-center rounded-[11px] bg-kory px-[22px] text-[13.5px] font-bold text-white hover:bg-kory-hover hover:text-white"
        >
          Explorar pantallas
        </Link>
        <Link
          href="/mapa"
          className="flex h-11 items-center rounded-[11px] border border-slate-200 bg-white px-[22px] text-[13.5px] font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-700"
        >
          Ver el mapa
        </Link>
      </div>
    </div>
  );
}
