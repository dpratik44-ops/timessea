export class CreateArticleDto {
  title: string;
  content: string;
  category?: string;
  readTime?: number;
  author?: {
    name: string;
    email: string;
    avatar?: string;
  };
}
