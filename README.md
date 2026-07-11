# Lentium Gallery — първа версия

Начална работеща основа за клиентската галерия на **LENTIUM PRODUCTION Ltd.**

## Какво вече има

- брандирана начална страница;
- логото на LENTIUM PRODUCTION;
- примерен адрес `/gallery/darina-georgi`;
- адаптивен дизайн за телефон и компютър;
- готово място за снимките;
- готова структура за индивидуални MEGA линкове;
- готов бутон за изтегляне на цялата сватба.

## Качване в GitHub през браузър

1. Отвори публичното repository `lentiumproduction/lentium-gallery`.
2. Натисни **Add file → Upload files**.
3. Разархивирай ZIP файла на компютъра.
4. Маркирай всички файлове и папки вътре в `lentium-gallery-starter`.
5. Плъзни ги в страницата на GitHub.
6. Долу натисни **Commit changes**.

Важно: качи съдържанието на папката, а не самата външна папка.

## Пускане във Vercel

1. Влез във Vercel.
2. Натисни **Add New → Project**.
3. Избери GitHub repository `lentiumproduction/lentium-gallery`.
4. Vercel трябва автоматично да разпознае Next.js.
5. Натисни **Deploy**.

## Добавяне на снимки по-късно

Снимките за преглед ще поставим в `public/galleries/darina-georgi/`.

След това ще добавим записите им в `data/galleries.ts`, например:

```ts
{
  id: "IMG_0001",
  src: "/galleries/darina-georgi/IMG_0001.jpg",
  alt: "Дарина и Георги",
  downloadUrl: "MEGA_LINK_КЪМ_ОРИГИНАЛА"
}
```

Линкът за целия ZIP архив се поставя в `downloadAllUrl`.

## Следваща стъпка

След първия успешен deploy добавяме:
- реалните снимки;
- fullscreen преглед;
- парола;
- индивидуално сваляне;
- MEGA ZIP;
- любими кадри.
