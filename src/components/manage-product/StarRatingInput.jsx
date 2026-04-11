import React from "react";

export default function StarRatingInput({
  value = 4,
  onChange,
  disabled = false,
}) {
  const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;

  return (
    <div>
      <div
        className="flex items-center gap-1"
        role="radiogroup"
        aria-label="Product rating"
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={safeValue === star}
            onClick={() => {
              if (disabled) return;
              onChange?.(star);
            }}
            disabled={disabled}
            className="text-3xl leading-none disabled:cursor-not-allowed"
          >
            <span
              className={star <= safeValue ? "text-amber-400" : "text-gray-300"}
            >
              ★
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
