import { LetterTemplate } from '../../types';
import { kuendigungTemplates } from './kuendigung';
import { vermieterTemplates } from './vermieter';
import { krankenkasseTemplates } from './krankenkasse';
import { kitaSchuleTemplates } from './kitaSchule';
import { internetHandyTemplates } from './internetHandy';
import { arbeitgeberTemplates } from './arbeitgeber';
import { behoerdenTemplates } from './behoerden';
import { bankTemplates } from './bank';
import { sonstigeTemplates } from './sonstige';

export const ALL_TEMPLATES: LetterTemplate[] = [
  ...kuendigungTemplates,
  ...vermieterTemplates,
  ...krankenkasseTemplates,
  ...kitaSchuleTemplates,
  ...internetHandyTemplates,
  ...arbeitgeberTemplates,
  ...behoerdenTemplates,
  ...bankTemplates,
  ...sonstigeTemplates,
];

export function getTemplatesByCategory(categoryId: string): LetterTemplate[] {
  return ALL_TEMPLATES.filter((t) => t.categoryId === categoryId);
}

export function getTemplateById(id: string): LetterTemplate | undefined {
  return ALL_TEMPLATES.find((t) => t.id === id);
}
