/** Lightweight shell while the product RSC payload streams in. */
export default function ProductPageLoading() {
  return (
    <div className="min-h-[70vh] bg-[#fff5f7] animate-pulse" aria-busy aria-label="جاري تحميل المنتج">
      <div className="max-w-lg mx-auto px-4 pt-8 space-y-6">
        <div className="h-6 w-3/4 mx-auto rounded-full bg-rose-200/60" />
        <div className="aspect-square w-full rounded-3xl bg-rose-100/50" />
        <div className="h-10 w-1/2 mx-auto rounded-xl bg-rose-200/50" />
        <div className="h-14 w-full rounded-2xl bg-rose-300/40" />
      </div>
    </div>
  );
}
