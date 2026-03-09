export class PageBuilderModel {
  backgroundImage: string | null = '';
  metaShareImage: string | null = '';
  slug: string | null = '/';
  title: string = '';
  metaTitle: string | null = '';
  keywords: string | null = '';
  metaDescription: string | null = '';
  layout: 'one' | 'full' | 'ltr' | 'rtl' | null = 'one';
  sections: any[] = [];
  sectionsLtr: any[] = [];
  sectionsRtl: any[] = [];
  backgroundColor: string | null = '#000';
  id: string | null = null;

  constructor(public whiteLabel: any, data?: any) {
    if (data?.backgroundImage) {
      this.backgroundImage = data.backgroundImage || this.whiteLabel?.logoUrl;
    }
    if (data?.metaShareImage) {
      this.metaShareImage = data.metaShareImage || this.whiteLabel?.logoUrl;
    }
    if (data?.backgroundColor) {
      this.backgroundColor = data.backgroundColor || this.whiteLabel?.logoUrl;
    }
    if (data?.slug) {
      this.slug = data.slug;
    }
    if (data?.title) {
      this.title = data.title || this.whiteLabel?.name;
    }
    if (data?.layout) {
      this.layout = data.layout;
    }
    if (data?.metaTitle) {
      this.metaTitle = data.metaTitle || this.whiteLabel?.name;
    }
    if (data?.keywords) {
      this.keywords = data.keywords || this.whiteLabel?.description;
    }
    if (data?.metaDescription) {
      this.metaDescription = data.metaDescription || this.whiteLabel?.description;
    }
    if (data?.sections) {
      this.sections = data.sections;
    }
    if (data?.sectionsLtr) {
      this.sectionsLtr = data.sectionsLtr;
    }
    if (data?.sectionsRtl) {
      this.sectionsRtl = data.sectionsRtl;
    }
    if (data?.id) {
      this.id = data.id;
    }
  }
}
