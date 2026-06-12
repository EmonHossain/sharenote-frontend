export type Gender = 'female' | 'male' | 'non_binary' | 'prefer_not_to_say';

export type VerificationMethod = 'organization_email' | 'public_email';

export type VerificationStatus =
  | 'email_pending'
  | 'organization_id_required'
  | 'organization_id_review'
  | 'fully_verified';

export type AccessLevel = 'limited' | 'full';

export type UserProfile = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  phoneNumber: string;
  organizationName?: string;
};

export type AuthSession = {
  accessLevel: AccessLevel;
  token?: string;
  user: UserProfile;
  verificationMethod: VerificationMethod;
  verificationStatus: VerificationStatus;
  futureOrganizationIdRequired: boolean;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type RegistrationRequest = {
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  phoneNumber: string;
  password: string;
};

export type ApiMessage = {
  message: string;
};
