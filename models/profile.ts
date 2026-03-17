export type SnowSportType = "ski" | "snowboard" | "both";

export interface Profile {
  id: string;
  username: string;
  fullName: string | null;
  bio: string | null;
  homeMountain: string | null;
  sportType: SnowSportType;
  skillLevel: string | null;
  avatarUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}
