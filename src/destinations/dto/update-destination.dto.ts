export class UpdateDestinationDto {
  slug?: string;
  name?: string;
  description?: string;
  cover_image?: string;
  best_months?: string;
  difficulty?: string;
  how_to_get_there?: string;
  warnings?: string;
  avg_budget?: string;
  is_featured?: boolean | string;
}
