/** Login sahifasining o'ng tomoni: to'r naqshi + logo */
export function LoginBrandPanel() {
  return (
    <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-[#161950] lg:flex dark:bg-surface">
      {/* To'r naqshi — markazda ko'rinadi, chetlarga qarab so'nadi */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(255 255 255 / 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.07) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          maskImage: 'radial-gradient(ellipse 60% 45% at 50% 50%, black 30%, transparent 100%)',
        }}
      />
      {/* Bir nechta to'ldirilgan kataklar */}
      <div aria-hidden className="absolute inset-0">
        <span className="absolute top-[calc(50%-78px)] left-[calc(50%-312px)] size-[52px] bg-white/4" />
        <span className="absolute top-[calc(50%-26px)] left-[calc(50%-364px)] size-[52px] bg-white/6" />
        <span className="absolute top-[calc(50%+26px)] left-[calc(50%+260px)] size-[52px] bg-white/5" />
      </div>

      <div className="relative flex max-w-sm flex-col items-center gap-4 px-6 text-center">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary">
            <svg viewBox="0 0 16 16" className="size-6 text-white" aria-hidden>
              <rect x="2" y="3" width="2.5" height="10" rx="1.25" fill="currentColor" />
              <rect x="6.75" y="6" width="2.5" height="7" rx="1.25" fill="currentColor" />
              <rect x="11.5" y="4.5" width="2.5" height="8.5" rx="1.25" fill="currentColor" />
            </svg>
          </span>
          <span className="text-4xl font-semibold text-white">Master Admin</span>
        </div>
        <p className="text-base text-white/60">Do'kon, mahsulotlar va buyurtmalarni boshqarish paneli</p>
      </div>
    </div>
  )
}
