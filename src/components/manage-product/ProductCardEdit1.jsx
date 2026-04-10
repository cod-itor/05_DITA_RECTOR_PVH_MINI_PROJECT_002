import Link from "next/link";
import Image from "next/image";
import { StarRow } from "../ProductCardComponent";

const categoryTone = {
  Skincare: "bg-sky-50 text-sky-800",
  Makeup: "bg-violet-50 text-violet-800",
  Fragrance: "bg-amber-50 text-amber-900",
  Haircare: "bg-emerald-50 text-emerald-900",
};

function badgeClass(label) {
  return categoryTone[label] ?? "bg-indigo-50 text-indigo-800";
}

export default function ProductCardEdit1({
  product,
  categoryLabel,
  href,
  rating = 4,
}) {
  const productName = product?.productName ?? "Product";
  const price = product?.price ?? 0;
  const imageUrl = product?.imageUrl;
  void categoryLabel;
  void href;

  return (
    <article className="group relative flex w-full max-w-70 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      {/* Top Right Options Button */}
      <button
        type="button"
        className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:bg-gray-50"
      >
        ⋯
      </button>

      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden mb-2">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={productName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-contain p-4"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gray-50 text-4xl text-gray-300 rounded-xl">
            ◇
          </div>
        )}
      </div>

      {/* Product Details (Simplified to match image) */}
      <div className="flex flex-col gap-1 pr-12">
        {" "}
        {/* pr-12 prevents text from overlapping the + button */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <StarRow rating={rating} />
          <span className="text-xs font-medium">{rating}</span>
        </div>
        <h3 className="font-semibold leading-snug text-gray-900 mt-1">
          {productName}
        </h3>
        <p className="mt-2 text-lg font-bold tabular-nums text-gray-900">
          ${price}
        </p>
      </div>

      {/* Bottom Right Add Button */}
      <button
        type="button"
        className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-lime-400 text-2xl font-light leading-none text-gray-900 transition hover:bg-lime-500"
      >
        +
      </button>
    </article>
  );
}
