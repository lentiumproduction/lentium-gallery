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
    date: "Вашият сватбен ден",
    message: "Вашите спомени са готови.",
    cover: "/galleries/darina-georgi/darina-georgi-03.jpg",
    downloadAllUrl: "",
    photos: [
      {
        id: "darina-georgi-01",
        src: "/galleries/darina-georgi/darina-georgi-01.jpg",
        alt: "Дарина и Георги до сватбения автомобил"
      },
      {
        id: "darina-georgi-02",
        src: "/galleries/darina-georgi/darina-georgi-02.jpg",
        alt: "Дарина и Георги на железопътните релси"
      },
      {
        id: "darina-georgi-03",
        src: "/galleries/darina-georgi/darina-georgi-03.jpg",
        alt: "Дарина и Георги в романтичен сватбен кадър"
      }
    ]
  }
];

export function getGallery(slug: string) {
  return galleries.find((gallery) => gallery.slug === slug);
}
