import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Camera, ArrowRight, Check, User } from "lucide-react";

const INTERESTS = [
  { value: "party", emoji: "🎉", label: "Party" },
  { value: "salsa", emoji: "💃", label: "Salsa" },
  { value: "yoga", emoji: "🧘", label: "Yoga" },
  { value: "food", emoji: "🍜", label: "Food" },
  { value: "chill", emoji: "😎", label: "Chill" },
  { value: "adventure", emoji: "🏔️", label: "Adventure" },
] as const;

export default function Onboarding() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => {
      const next = new Set(prev);
      if (next.has(interest)) next.delete(interest);
      else next.add(interest);
      return next;
    });
  };

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);

    try {
      let avatar_url: string | null = null;

      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop();
        const path = `${user.id}/avatar.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, avatarFile, { upsert: true });
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
          avatar_url = publicUrl;
        }
      }

      await supabase
        .from("profiles")
        .update({
          display_name: name,
          avatar_url,
          onboarding_completed: true,
        })
        .eq("user_id", user.id);

      if (selectedInterests.size > 0) {
        const rows = Array.from(selectedInterests).map((interest) => ({
          user_id: user.id,
          interest,
        }));
        await supabase.from("user_interests").insert(rows);
      }

      await refreshProfile();
      navigate("/", { replace: true });
    } catch {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    }
    setSaving(false);
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-6 max-w-md mx-auto">
      <div className="w-full space-y-8">
        {/* Progress */}
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-fade-in-subtle">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">What's your name?</h2>
              <p className="text-sm text-muted-foreground">So people know who they're meeting 🤝</p>
            </div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 text-lg"
                autoFocus
              />
            </div>
            <Button
              className="w-full gap-2"
              disabled={!name.trim()}
              onClick={() => setStep(2)}
            >
              Continue <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in-subtle">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Add a photo</h2>
              <p className="text-sm text-muted-foreground">Helps others recognize you 📸</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <label className="cursor-pointer group">
                <Avatar className="h-28 w-28 ring-4 ring-border group-hover:ring-primary transition-colors">
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} />
                  ) : (
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      <Camera className="w-8 h-8" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
              <p className="text-xs text-muted-foreground">Tap to upload</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(3)}>
                Skip
              </Button>
              <Button className="flex-1 gap-2" onClick={() => setStep(3)}>
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in-subtle">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">What are you into?</h2>
              <p className="text-sm text-muted-foreground">Pick as many as you like 🎯</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {INTERESTS.map(({ value, emoji, label }) => {
                const selected = selectedInterests.has(value);
                return (
                  <button
                    key={value}
                    onClick={() => toggleInterest(value)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all btn-press ${
                      selected
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <span className="text-2xl">{emoji}</span>
                    <span className={`font-medium ${selected ? "text-primary" : "text-foreground"}`}>
                      {label}
                    </span>
                    {selected && <Check className="w-4 h-4 text-primary ml-auto" />}
                  </button>
                );
              })}
            </div>
            <Button
              className="w-full gap-2"
              onClick={handleFinish}
              disabled={saving}
            >
              {saving ? "Setting up..." : "Let's go!"} 🚀
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
