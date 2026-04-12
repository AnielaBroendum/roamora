import { useState } from "react";
import { Check, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

const NATIONALITIES = [
  { code: "AR", flag: "🇦🇷", label: "Argentine" },
  { code: "AU", flag: "🇦🇺", label: "Australian" },
  { code: "AT", flag: "🇦🇹", label: "Austrian" },
  { code: "BE", flag: "🇧🇪", label: "Belgian" },
  { code: "BR", flag: "🇧🇷", label: "Brazilian" },
  { code: "CA", flag: "🇨🇦", label: "Canadian" },
  { code: "CL", flag: "🇨🇱", label: "Chilean" },
  { code: "CN", flag: "🇨🇳", label: "Chinese" },
  { code: "CO", flag: "🇨🇴", label: "Colombian" },
  { code: "HR", flag: "🇭🇷", label: "Croatian" },
  { code: "CZ", flag: "🇨🇿", label: "Czech" },
  { code: "DK", flag: "🇩🇰", label: "Danish" },
  { code: "NL", flag: "🇳🇱", label: "Dutch" },
  { code: "EC", flag: "🇪🇨", label: "Ecuadorian" },
  { code: "EG", flag: "🇪🇬", label: "Egyptian" },
  { code: "GB", flag: "🇬🇧", label: "British" },
  { code: "FI", flag: "🇫🇮", label: "Finnish" },
  { code: "FR", flag: "🇫🇷", label: "French" },
  { code: "DE", flag: "🇩🇪", label: "German" },
  { code: "GR", flag: "🇬🇷", label: "Greek" },
  { code: "IN", flag: "🇮🇳", label: "Indian" },
  { code: "ID", flag: "🇮🇩", label: "Indonesian" },
  { code: "IE", flag: "🇮🇪", label: "Irish" },
  { code: "IL", flag: "🇮🇱", label: "Israeli" },
  { code: "IT", flag: "🇮🇹", label: "Italian" },
  { code: "JP", flag: "🇯🇵", label: "Japanese" },
  { code: "KR", flag: "🇰🇷", label: "Korean" },
  { code: "MY", flag: "🇲🇾", label: "Malaysian" },
  { code: "MX", flag: "🇲🇽", label: "Mexican" },
  { code: "MA", flag: "🇲🇦", label: "Moroccan" },
  { code: "NZ", flag: "🇳🇿", label: "New Zealander" },
  { code: "NG", flag: "🇳🇬", label: "Nigerian" },
  { code: "NO", flag: "🇳🇴", label: "Norwegian" },
  { code: "PK", flag: "🇵🇰", label: "Pakistani" },
  { code: "PE", flag: "🇵🇪", label: "Peruvian" },
  { code: "PH", flag: "🇵🇭", label: "Filipino" },
  { code: "PL", flag: "🇵🇱", label: "Polish" },
  { code: "PT", flag: "🇵🇹", label: "Portuguese" },
  { code: "RO", flag: "🇷🇴", label: "Romanian" },
  { code: "RU", flag: "🇷🇺", label: "Russian" },
  { code: "SA", flag: "🇸🇦", label: "Saudi" },
  { code: "ZA", flag: "🇿🇦", label: "South African" },
  { code: "ES", flag: "🇪🇸", label: "Spanish" },
  { code: "SE", flag: "🇸🇪", label: "Swedish" },
  { code: "CH", flag: "🇨🇭", label: "Swiss" },
  { code: "TH", flag: "🇹🇭", label: "Thai" },
  { code: "TR", flag: "🇹🇷", label: "Turkish" },
  { code: "UA", flag: "🇺🇦", label: "Ukrainian" },
  { code: "US", flag: "🇺🇸", label: "American" },
  { code: "VE", flag: "🇻🇪", label: "Venezuelan" },
  { code: "VN", flag: "🇻🇳", label: "Vietnamese" },
] as const;

interface NationalityPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function NationalityPicker({ value, onChange }: NationalityPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selected = NATIONALITIES.find((n) => n.label === value || n.code === value);
  const filtered = NATIONALITIES.filter((n) =>
    n.label.toLowerCase().includes(search.toLowerCase())
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2 p-3 rounded-xl border border-border bg-card text-left text-sm transition-colors hover:border-primary/40"
      >
        {selected ? (
          <>
            <span className="text-xl">{selected.flag}</span>
            <span className="text-foreground font-medium">{selected.label}</span>
          </>
        ) : (
          <span className="text-muted-foreground">Tap to choose nationality</span>
        )}
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search nationality..."
          className="pl-9 pr-9"
          autoFocus
        />
        <button
          type="button"
          onClick={() => { setOpen(false); setSearch(""); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto rounded-xl border border-border bg-card p-2">
        {filtered.map(({ code, flag, label }) => {
          const isSelected = value === label || value === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => {
                onChange(label);
                setOpen(false);
                setSearch("");
              }}
              className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-all ${
                isSelected
                  ? "bg-primary/10 border border-primary"
                  : "hover:bg-muted border border-transparent"
              }`}
            >
              <span className="text-lg">{flag}</span>
              <span className={isSelected ? "text-primary font-medium" : "text-foreground"}>
                {label}
              </span>
              {isSelected && <Check className="w-3.5 h-3.5 text-primary ml-auto" />}
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-2 text-center text-muted-foreground text-sm py-4">
            No match found
          </p>
        )}
      </div>
    </div>
  );
}
