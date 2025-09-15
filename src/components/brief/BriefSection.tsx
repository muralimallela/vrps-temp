import Image from "next/image";

type BriefSectionProps = {
  title: string;
  subtitle?: string;
  description?: string;
  points?: string[]; // for Awareness lists
  content?: React.ReactNode; // for custom JSX (bold/italic etc.)
  buttonText?: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
};

export default function BriefSection({
  title,
  subtitle,
  description,
  points,
  content,
  buttonText = "Know More",
  imageSrc,
  imageAlt,
  reverse = false,
}: BriefSectionProps) {
  return (
    <section className="bg-[#f5e6cf] py-12 px-6 md:px-16">
      {/* Section Title */}
      <h2 className="text-xl sm:text-2xl md:text-3xl text-center mb-10 font-bold text-gray-900">
        {title}
      </h2>

      <div
        className={`max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 ${
          reverse ? "md:flex-row-reverse" : ""
        }`}
      >
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left">
          {subtitle && (
            <h3 className="mt-2 text-lg sm:text-xl font-semibold text-gray-800">
              {subtitle}
            </h3>
          )}

          {description && (
            <p className="mt-4 text-base sm:text-lg text-[#2B0904] leading-relaxed">
              {description}
            </p>
          )}

          {/* Awareness List */}
          {points && points.length > 0 && (
            <ul className="list-disc list-inside mt-4 space-y-2 text-base sm:text-lg text-[#2B0904] leading-relaxed">
              {points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          )}

          {/* Rich Content (for Culture, History, etc.) */}
          {content && (
            <div className="mt-4 text-base sm:text-lg text-[#2B0904] leading-relaxed">
              {content}
            </div>
          )}

          <button className="mt-6 px-6 py-3 bg-white shadow-md rounded-lg font-semibold text-gray-900 hover:bg-gray-100 transition">
            {buttonText}
          </button>
        </div>

        {/* Right Image */}
        <div className="flex-1">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={500}
            height={300}
            className="rounded-md object-cover w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}
