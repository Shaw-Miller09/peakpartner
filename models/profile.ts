export type SnowSportType = "ski" | "snowboard" | "both";
export type AgeGroup = "minor" | "adult";

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
  ageGroup: AgeGroup;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}
