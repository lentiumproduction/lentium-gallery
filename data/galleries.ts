export type GalleryPhoto = {
  id: string;
  src: string;
  alt: string;
  downloadUrl?: string;
  filename?: string;
};

export type Gallery = {
  id?: string;
  slug: string;
  title: string;
  date: string;
  message: string;
  cover: string;
  downloadAllUrl?: string;
  photos: GalleryPhoto[];
};

export const fallbackGallery: Gallery = {
  slug: "darina-georgi",
  title: "Дарина & Георги",
  date: "20.06.2026",
  message: "Вашите спомени са готови.",
  cover: "/galleries/darina-georgi/darina-georgi-03.jpg",
  downloadAllUrl:
    "https://mega.nz/folder/IcBFFRKZ#w7nERLh-9OZu_i5s-GqRqg",
  photos: [
    {
      id: "darina-georgi-01",
      src: "/galleries/darina-georgi/darina-georgi-01.jpg",
      alt: "Дарина и Георги до сватбения автомобил",
      filename: "darina-georgi-01.jpg",
    },
    {
      id: "darina-georgi-02",
      src: "/galleries/darina-georgi/darina-georgi-02.jpg",
      alt: "Дарина и Георги на железопътните релси",
      filename: "darina-georgi-02.jpg",
    },
    {
      id: "darina-georgi-03",
      src: "/galleries/darina-georgi/darina-georgi-03.jpg",
      alt: "Дарина и Георги в романтичен сватбен кадър",
      filename: "darina-georgi-03.jpg",
    },
  ],
};
