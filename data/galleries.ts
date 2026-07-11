export type GalleryPhoto = {
  id: string;
  src: string;
  alt: string;
  downloadUrl?: string;
};

export type Gallery = {
  slug: string;
  title: string;
  date: string;
  message: string;
  cover: string;
  downloadAllUrl?: string;
  photos: GalleryPhoto[];
};

export const galleries: Gallery[] = [
  {
    slug: "darina-georgi",
    title: "Дарина & Георги",
    date: "Скоро",
    message: "Вашите спомени са готови.",
    cover: "",
    downloadAllUrl: "",
    photos: []
  }
];

export function getGallery(slug: string) {
  return galleries.find((gallery) => gallery.slug === slug);
}
