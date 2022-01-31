export class NewModel {
  id: number;
  title: string;
  country: "srb" | "cro";
  description: string;
  content: string;
  constructor(obj?: any) {
    this.id = (obj && obj.id) || null;
    this.title = (obj && obj.title) || null;
    this.country = (obj && obj.country) || null;
    this.description = (obj && obj.description) || null;
    this.content = (obj && obj.content) || null;
  }
}
