export enum InterestType {
  NEIGHBORHOOD = "NEIGHBORHOOD",
  COMMUNITY = "COMMUNITY",
  EDUCATION = "EDUCATION",
  SPORTS = "SPORTS",
  FITNESS = "FITNESS",
  TECHNOLOGY = "TECHNOLOGY",
  PETS = "PETS",
  ENVIRONMENT = "ENVIRONMENT",
  EVENTS = "EVENTS",
  FOOD = "FOOD",
  HOBBIES = "HOBBIES",
  GAMING = "GAMING",
  CAREER = "CAREER",
  LOCAL_BUSINESS = "LOCAL_BUSINESS",
  BUY_SELL = "BUY_SELL",
  TRAVEL = "TRAVEL",
  VOLUNTEERING = "VOLUNTEERING",
  SOCIAL = "SOCIAL",
  OTHER = "OTHER",
}

export enum SkillType {
  TECHNOLOGY = "TECHNOLOGY",
  TEACHING = "TEACHING",
  TUTORING = "TUTORING",
  WRITING = "WRITING",
  DESIGN = "DESIGN",
  PHOTOGRAPHY = "PHOTOGRAPHY",
  COOKING = "COOKING",
  REPAIR = "REPAIR",
  DIY = "DIY",
  MOVING = "MOVING",
  TRANSPORT = "TRANSPORT",
  ERRANDS = "ERRANDS",
  PET_CARE = "PET_CARE",
  GARDENING = "GARDENING",
  FITNESS = "FITNESS",
  SPORTS = "SPORTS",
  EVENT_HELP = "EVENT_HELP",
  ORGANIZING = "ORGANIZING",
  FIRST_AID = "FIRST_AID",
  OTHER = "OTHER",
}

export type ProfileDetails = {
  name: string;
  bio: string;
  profileImage: File | null;
  interests: InterestType[];
  skills: SkillType[];
};

export type LocationDetails = {
  label: string;
  longitude: number | null;
  latitude: number | null;
};

export type PreferenceDetails = {
  localityRadius: number;
  localCommunityRadius: number;
};
