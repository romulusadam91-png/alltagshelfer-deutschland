export type Language = 'ro' | 'de';

export type CategoryKey =
  | 'kuendigung'
  | 'vermieter'
  | 'krankenkasse'
  | 'kita_schule'
  | 'internet_handy'
  | 'arbeitgeber'
  | 'behoerden'
  | 'bank'
  | 'sonstige';

export interface Category {
  id: CategoryKey;
  iconName: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  count: number;
}

export type FieldType = 'text' | 'textarea' | 'date' | 'select' | 'number';

export interface FieldOption {
  value: string;
  label: Record<Language, string>;
}

export interface TemplateField {
  id: string;
  label: Record<Language, string>;
  placeholder?: Record<Language, string>;
  helpText?: Record<Language, string>;
  type: FieldType;
  options?: FieldOption[];
  defaultValue?: string;
  required?: boolean;
}

export interface SenderProfile {
  fullName: string;
  street: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  birthDate?: string;
}

export interface RecipientInfo {
  organization: string;
  department?: string;
  contactPerson?: string;
  street: string;
  postalCode: string;
  city: string;
}

export interface GeneratedDocument {
  sender: SenderProfile;
  recipient: RecipientInfo;
  date: string;
  place: string;
  subject: string;
  salutation: string;
  paragraphs: string[];
  closing: string;
  signName: string;
  enclosures?: string[];
}

export interface LetterTemplate {
  id: string;
  categoryId: CategoryKey;
  isPremium: boolean;
  title: Record<Language, string>;
  shortDescription: Record<Language, string>;
  bureaucraticTip: Record<Language, string>;
  defaultRecipient?: Partial<RecipientInfo>;
  fields: TemplateField[];
  buildLetter: (
    answers: Record<string, string>,
    sender: SenderProfile,
    recipient: RecipientInfo
  ) => GeneratedDocument;
}
