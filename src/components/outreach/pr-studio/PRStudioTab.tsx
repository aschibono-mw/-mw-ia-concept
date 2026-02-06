import { useState } from "react";
import { Pitch, mockPitches } from "./types";
import { PRStudioLanding } from "./PRStudioLanding";
import { PRStudioWorkspace } from "./PRStudioWorkspace";
import { toast } from "sonner";

export const PRStudioTab = () => {
  const [pitches, setPitches] = useState<Pitch[]>(mockPitches);
  const [activePitchId, setActivePitchId] = useState<string | null>(null);

  const activePitch = activePitchId
    ? pitches.find((p) => p.id === activePitchId) || null
    : null;

  const handleCreateNew = () => {
    const newPitch: Pitch = {
      id: `pitch-${Date.now()}`,
      name: "Untitled Pitch",
      type: "media-pitch",
      status: "draft",
      createdBy: "You",
      lastUpdated: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      content: "",
      language: "english",
      tone: "professional",
      length: "medium",
      quotes: [],
    };
    setPitches((prev) => [newPitch, ...prev]);
    setActivePitchId(newPitch.id);
    toast.success("New pitch created");
  };

  const handleDeletePitch = (pitchId: string) => {
    setPitches((prev) => prev.filter((p) => p.id !== pitchId));
    if (activePitchId === pitchId) setActivePitchId(null);
  };

  const handleDuplicatePitch = (pitchId: string) => {
    const source = pitches.find((p) => p.id === pitchId);
    if (!source) return;
    const duplicate: Pitch = {
      ...source,
      id: `pitch-${Date.now()}`,
      name: `${source.name} (Copy)`,
      lastUpdated: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      status: "draft",
      starred: false,
    };
    setPitches((prev) => [duplicate, ...prev]);
    toast.success("Pitch duplicated");
  };

  const handleToggleStar = (pitchId: string) => {
    setPitches((prev) =>
      prev.map((p) => (p.id === pitchId ? { ...p, starred: !p.starred } : p))
    );
  };

  const handleUpdatePitch = (pitchId: string, updates: Partial<Pitch>) => {
    setPitches((prev) =>
      prev.map((p) =>
        p.id === pitchId
          ? {
              ...p,
              ...updates,
              lastUpdated: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              }),
            }
          : p
      )
    );
  };

  if (activePitch) {
    return (
      <PRStudioWorkspace
        pitch={activePitch}
        onBack={() => setActivePitchId(null)}
        onUpdatePitch={handleUpdatePitch}
      />
    );
  }

  return (
    <PRStudioLanding
      pitches={pitches}
      onCreateNew={handleCreateNew}
      onOpenPitch={setActivePitchId}
      onDeletePitch={handleDeletePitch}
      onDuplicatePitch={handleDuplicatePitch}
      onToggleStar={handleToggleStar}
    />
  );
};
