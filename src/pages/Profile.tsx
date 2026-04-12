import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Camera, LogOut, Check } from "lucide-react";
import NationalityPicker from "@/components/NationalityPicker";
import AvatarCropModal from "@/components/AvatarCropModal";

const INTERESTS = [
  { value: "party", emoji: "🎉", label: "Party" },
  { value: "salsa", emoji: "💃", label: "Salsa" },
  { value: "yoga", emoji: "🧘", label: "Yoga" },
  { value: "food", emoji: "🍜", label: "Food" },
  { value: "chill", emoji: "😎", label: "Chill" },
  { value: "adventure", emoji: "🏔️", label: "Adventure" },
] as const;

export default function Profile() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(profile?.display_name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [nationality, setNationality] = useState(profile?.nationality || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [interests, setInterests] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  // Crop modal state
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.display_name || "");
      setBio(profile.bio || "");
      setNationality(profile.nationality || "");
      setAvatarPreview(profile.avatar_url);
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      supabase
        .from("user_interests")
        .select("interest")
        .eq("user_id", user.id)
        .then(({ data }) => {
          if (data) setInterests(new Set(data.map((d) => d.interest)));
        });
    }
  }, [user]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCropSrc(url);
    }
    // Reset so the same file can be re-selected
    e.target.value = "";
  };

  const handleCropDone = (blob: Blob) => {
    const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(blob));
    setCropSrc(null);
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) => {
      const next = new Set(prev);
      if (next.has(interest)) next.delete(interest);
      else next.add(interest);
      return next;
    });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      let avatar_url = profile?.avatar_url || null;

      if (avatarFile) {
        const path = `${user.id}/avatar.jpg`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, avatarFile, { upsert: true, contentType: "image/jpeg" });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
        // Cache-bust so the new image shows immediately
        avatar_url = `${publicUrl}?t=${Date.now()}`;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ display_name: name, bio, nationality, avatar_url })
        .eq("user_id", user.id);

      if (updateError) throw new Error(updateError.message);

      // Sync interests: delete all, re-insert
      await supabase.from("user_interests").delete().eq("user_id", user.id);
      if (interests.size > 0) {
        await supabase.from("user_interests").insert(
          Array.from(interests).map((interest) => ({
            user_id: user.id,
            interest: interest as "party" | "salsa" | "yoga" | "food" | "chill" | "adventure",
          }))
        );
      }

      setAvatarFile(null);
      await refreshProfile();
      toast({ title: "Saved!", description: "Your profile has been updated." });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not save profile.";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col max-w-md mx-auto">
      <header className="flex items-center gap-3 px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-3 sticky top-0 bg-background/80 backdrop-blur-xl z-40">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Profile</h1>
      </header>

      <div className="flex-1 px-5 pb-8 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer group relative"
          >
            <Avatar className="h-24 w-24 ring-4 ring-border group-hover:ring-primary transition-colors">
              {avatarPreview ? (
                <AvatarImage src={avatarPreview} />
              ) : (
                <AvatarFallback className="bg-muted text-muted-foreground text-2xl">
                  {name?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5">
              <Camera className="w-3.5 h-3.5" />
            </div>
          </button>
          <p className="text-xs text-muted-foreground">Tap to change photo</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Bio</label>
            <Input value={bio} onChange={(e) => setBio(e.target.value)} placeholder="One-liner about you" maxLength={100} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Nationality</label>
            <NationalityPicker value={nationality} onChange={setNationality} />
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">Interests</label>
          <div className="grid grid-cols-2 gap-2">
            {INTERESTS.map(({ value, emoji, label }) => {
              const selected = interests.has(value);
              return (
                <button
                  key={value}
                  onClick={() => toggleInterest(value)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all btn-press text-sm ${
                    selected
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <span>{emoji}</span>
                  <span className={selected ? "text-primary font-medium" : "text-foreground"}>{label}</span>
                  {selected && <Check className="w-3.5 h-3.5 text-primary ml-auto" />}
                </button>
              );
            })}
          </div>
        </div>

        <Button className="w-full" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </Button>

        <Button variant="outline" className="w-full gap-2 text-destructive border-destructive/30" onClick={handleSignOut}>
          <LogOut className="w-4 h-4" /> Sign out
        </Button>
      </div>

      {/* Crop Modal */}
      {cropSrc && (
        <AvatarCropModal
          imageSrc={cropSrc}
          onCropDone={handleCropDone}
          onClose={() => setCropSrc(null)}
        />
      )}
    </div>
  );
}
