# Lentium Gallery v0.2

Тази версия добавя:

- fullscreen преглед;
- стрелки наляво/надясно;
- клавиатура: `←`, `→`, `Esc`;
- любими кадри, запазвани в браузъра;
- бутон за индивидуално изтегляне;
- бутон „Изтегли всички“;
- masonry подредба.

## Качване

1. Разархивирай ZIP файла.
2. В GitHub отвори `lentiumproduction/lentium-gallery`.
3. Натисни **Add file → Upload files**.
4. Качи всички файлове и папки от архива, като разрешиш замяната.
5. Натисни **Commit changes**.
6. Vercel ще направи автоматичен deployment.

## Добавяне на реални снимки

Създай папка:

`public/galleries/darina-georgi/`

Постави там оптимизирани JPG/WebP файлове за разглеждане.

После в `data/galleries.ts` добави:

```ts
photos: [
  {
    id: "IMG_0001",
    src: "/galleries/darina-georgi/IMG_0001.jpg",
    alt: "Дарина и Георги",
    downloadUrl: "MEGA_LINK_КЪМ_ОРИГИНАЛА"
  }
]
```

За целия ZIP архив постави MEGA линка в `downloadAllUrl`.
