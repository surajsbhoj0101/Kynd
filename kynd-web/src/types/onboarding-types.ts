export enum IntentType {
  LOOKING_FOR_HELP = "looking_for_help",
  OFFERING_HELP = "offering_help",
  CONTRIBUTE = "contribute",
  ORGANIZE = "organize",
  JUST_BROWSING = "just_browsing",
}

export enum OfferType {
  FOOD = "food",
  TRANSPORTATION = "transportation",
  CHILDCARE = "childcare",
  PETCARE = "petcare",
  MENTAL_HEALTH_SUPPORT = "mental_health_support",
  FINANCIAL_SUPPORT = "financial_support",
  EDUCATIONAL_SUPPORT = "educational_support",
  LEGAL_SUPPORT = "legal_support",
  TECHNICAL_SUPPORT = "technical_support",
  OTHER = "other",
}

export enum DayOfWeek {
  MONDAY = "monday",
  TUESDAY = "tuesday",
  WEDNESDAY = "wednesday",
  THURSDAY = "thursday",
  FRIDAY = "friday",
  SATURDAY = "saturday",
  SUNDAY = "sunday",
}

export const dayOptions = [
  [DayOfWeek.MONDAY, "Monday"],
  [DayOfWeek.TUESDAY, "Tuesday"],
  [DayOfWeek.WEDNESDAY, "Wednesday"],
  [DayOfWeek.THURSDAY, "Thursday"],
  [DayOfWeek.FRIDAY, "Friday"],
  [DayOfWeek.SATURDAY, "Saturday"],
  [DayOfWeek.SUNDAY, "Sunday"],
] as const;

export const timeOptions = [
  ["mornings", "Mornings"],
  ["afternoons", "Afternoons"],
  ["evenings", "Evenings"],
  ["flexible", "Flexible"],
] as const;

export type IntentDetails = {
  intent: IntentType[];
  offer: OfferType[];
};

export type ProfileDetails = {
  name: string;
  bio: string;
  profileImage: File | null;
};

export type LocationArea = {
  label: string;
  longitude: number | null;
  latitude: number | null;
};

export type AvailabilityDetails = {
  availability: Partial<Record<DayOfWeek, string[]>>;
  area: LocationArea;
  personalHelpRadius: number;
  communityHelpRadius: number;
};
