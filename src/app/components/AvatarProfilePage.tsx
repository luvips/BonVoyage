"use client";

import { useEffect, useState } from "react";
import { Avatar, useUserProfile } from "@/hooks/useUserProfile";

export default function AvatarProfilePage() {
  const { profile, avatars, updating, fetchAvatars, updateAvatar } = useUserProfile();
  const [selected, setSelected] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchAvatars();
  }, [fetchAvatars]);

  async function handleSave() {
    if (selected === null) return;
    const ok = await updateAvatar(selected);
    if (ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-1">Mi Avatar</h1>
      <p className="text-sm text-gray-500 mb-5">Elige el avatar que te represente en Bon Voyage</p>

      {/* Avatar actual */}
      {profile?.avatar_url && (
        <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-xl">
          <img
            src={profile.avatar_url}
            alt="Avatar actual"
            className="w-14 h-14 rounded-full object-cover border-2 border-blue-400"
          />
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Avatar actual</p>
            <p className="text-sm font-medium text-gray-700">{profile.avatar_name ?? "—"}</p>
          </div>
        </div>
      )}

      {/* Grid de avatares */}
      {avatars.length === 0 ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3 mb-6">
          {avatars.map((avatar: Avatar) => (
            <button
              key={avatar.avatar_id}
              onClick={() => setSelected(avatar.avatar_id)}
              title={avatar.name}
              className={`rounded-xl overflow-hidden border-2 transition-all ${
                selected === avatar.avatar_id
                  ? "border-blue-500 scale-105 shadow-md"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <img
                src={avatar.image_url}
                alt={avatar.name}
                className="w-full aspect-square object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={selected === null || updating || success}
        className="w-full py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {success ? "✓ Avatar actualizado" : updating ? "Guardando..." : "Guardar avatar"}
      </button>
    </div>
  );
}
