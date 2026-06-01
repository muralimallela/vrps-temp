"use client";

import { useState } from "react";

interface ConsentPreferencesProps {
  onUpdate?: (preferences: ConsentPreferences) => Promise<void>;
  initialData?: ConsentPreferences;
  isLoading?: boolean;
  successMessage?: string;
}

export interface ConsentPreferences {
  publicVisibility: "private" | "public" | "anonymous";
  publicDisplayName?: string;
  showMembershipPublically?: boolean;
  showDonationPublicly?: boolean;
}

export default function ConsentPreferences({
  onUpdate,
  initialData,
  isLoading = false,
  successMessage,
}: ConsentPreferencesProps) {
  const [preferences, setPreferences] = useState<ConsentPreferences>(
    initialData || {
      publicVisibility: "private",
      publicDisplayName: "",
      showMembershipPublically: false,
      showDonationPublicly: false,
    },
  );

  const [saved, setSaved] = useState(false);

  const handleVisibilityChange = (
    value: "private" | "public" | "anonymous",
  ) => {
    setPreferences((prev) => ({
      ...prev,
      publicVisibility: value,
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (onUpdate) {
      try {
        await onUpdate(preferences);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch (error) {
        console.error("Failed to update preferences:", error);
      }
    }
  };

  const visibilityOptions = [
    {
      value: "private" as const,
      label: "Private",
      description: "Not listed publicly",
      icon: "🔒",
    },
    {
      value: "anonymous" as const,
      label: "Anonymous",
      description: "Show contribution, hide identity",
      icon: "😊",
    },
    {
      value: "public" as const,
      label: "Public",
      description: "Show name and contribution",
      icon: "👁️",
    },
  ];

  return (
    <div className="bg-[#fffdf7] rounded-xl p-8 border border-[#e8d4b8]">
      <h3 className="text-2xl font-bold text-[#5A1C16] mb-2">
        Public Visibility Settings
      </h3>
      <p className="text-[#8B6F47] mb-6">
        Control how your community participation is displayed publicly
      </p>

      <div className="space-y-4 mb-8">
        {visibilityOptions.map((option) => (
          <label
            key={option.value}
            className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition"
            style={{
              borderColor:
                preferences.publicVisibility === option.value
                  ? "#0F5F54"
                  : "#e8d4b8",
              backgroundColor:
                preferences.publicVisibility === option.value
                  ? "#f5e6cf"
                  : "white",
            }}
          >
            <input
              type="radio"
              name="visibility"
              value={option.value}
              checked={preferences.publicVisibility === option.value}
              onChange={(e) =>
                handleVisibilityChange(
                  e.target.value as "private" | "public" | "anonymous",
                )
              }
              className="mt-1 mr-4"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{option.icon}</span>
                <p className="font-semibold text-[#5A1C16]">{option.label}</p>
              </div>
              <p className="text-sm text-[#8B6F47]">{option.description}</p>
            </div>
          </label>
        ))}
      </div>

      {preferences.publicVisibility === "public" && (
        <div className="mb-8 p-4 bg-[#ffe6bf] rounded-lg border border-[#e8d4b8]">
          <label className="block mb-3">
            <p className="text-sm font-semibold text-[#5A1C16] mb-2">
              Display Name (Optional)
            </p>
            <input
              type="text"
              value={preferences.publicDisplayName || ""}
              onChange={(e) =>
                setPreferences((prev) => ({
                  ...prev,
                  publicDisplayName: e.target.value,
                }))
              }
              placeholder="Leave blank to use first name + last initial"
              className="w-full px-3 py-2 border border-[#dcc9a8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5F54] text-[#2B0904]"
            />
            <p className="text-xs text-[#8B6F47] mt-2">
              How your name will appear in public listings
            </p>
          </label>
        </div>
      )}

      {saved && (
        <div className="mb-6 p-4 bg-[#e8f5e9] rounded-lg border border-[#0F5F54]">
          <p className="text-sm text-[#0F5F54] font-semibold">
            ✓ {successMessage || "Preferences saved successfully"}
          </p>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={isLoading || saved}
        className="w-full px-6 py-3 bg-[#0F5F54] hover:bg-[#0D4A42] text-white font-semibold rounded-lg transition disabled:opacity-50"
      >
        {isLoading ? "Saving..." : "Save Preferences"}
      </button>

      <p className="text-xs text-[#8B6F47] mt-4 text-center">
        Your privacy is important. You can change these settings anytime.
      </p>
    </div>
  );
}
