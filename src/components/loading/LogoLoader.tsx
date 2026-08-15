import Image from "next/image";

type LogoLoaderProps = {
  message?: string;
  compact?: boolean;
  className?: string;
};

export default function LogoLoader({
  message = "Loading...",
  compact = false,
  className = "",
}: LogoLoaderProps) {
  return (
    <div
      className={`flex items-center justify-center ${
        compact ? "py-4" : "min-h-screen bg-[#fff8ef] px-6"
      } ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <div
          className={`vrps-logo-loader mx-auto ${
            compact ? "h-20 w-20" : "h-32 w-32 md:h-40 md:w-40"
          }`}
        >
          <Image
            src="/vrps-logo-3x.png"
            alt="VRPS"
            width={320}
            height={320}
            priority
            className="h-full w-full object-contain"
          />
        </div>
        <p
          className={`font-semibold tracking-wide text-[#6A160A] ${
            compact ? "mt-2 text-sm" : "mt-4 text-base"
          }`}
        >
          {message}
        </p>
      </div>
    </div>
  );
}
