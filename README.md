# Natalia Isakova — Portfolio

Сайт-портфолио на Astro, Markdown/MDX и Tailwind CSS.

- Сайт: https://aromagirl.github.io/portfolio/
- Основная рабочая ветка: `dev`.
- Главная и About: `src/content/pages/`.
- Тексты и изображения проектов: `src/content/companies/`.

## Локальный запуск

Используется Node.js 24, как в GitHub Actions.

```sh
npm install
npm run dev
```

Откройте адрес из терминала, обычно http://localhost:4321/portfolio/.

- `npm run build` — сборка в `dist/`.
- `npm run preview` — просмотр готовой сборки.
- `npm run screenshots` — ручная съёмка сайтов в PNG; конфигурация и команды в [scripts/README.md](scripts/README.md).

После небольших изменений текста или CSS полная сборка обычно не нужна. Проверяйте сборку после изменения маршрутов, структуры контента или компонентов.

При запуске из ограниченной песочницы агента на Windows сборка может завершаться ошибкой `require is not defined` при загрузке YAML. В этом проекте ошибка исчезала при запуске той же команды вне песочницы; сначала проверьте среду запуска, прежде чем менять контент или зависимости.

## Где редактировать контент

| Страница | Файл | Адрес без префикса /portfolio |
| --- | --- | --- |
| Главная | `src/content/pages/home.md` | `/` |
| About me | `src/content/pages/about-me.md` | `/about/` |
| FraudScore | `src/content/companies/fraudscore/index.md` | `/fraudscore/` |
| Mafia Game | `src/content/companies/mafia-bot-mini-app/index.md` | `/work/mafia-bot-mini-app/` |
| Tickeron | `src/content/companies/tickeron/index.md` | `/work/tickeron/` |
| MyHospital | `src/content/companies/myhospital/index.md` | `/work/myhospital/` |
| KidswearCycle | `src/content/companies/kidswearcycle/index.md` | `/work/kidswearcycle/` |
| I-Jet Media | `src/content/companies/ijet-media/index.md` | `/work/ijet-media/` |

Главная содержит карточки SafeClick Website и FraudScore Website через `HomeProjectCard`. Их выбор и описания задаются в массиве `homeProjects` в метаданных `home.md`: `projectId` указывает ID направления (например, `fraudscore-safeclick-website`), `summary` переопределяет описание. Заголовок, обложка и `cardDisabled` читаются из Markdown соответствующего проекта. При `cardDisabled: true` ссылки на проект и изображение отключены, вместо Read more показано Coming soon. Эта же настройка действует в каталоге и блоке Explore the work компании. Если у карточки нет изображения, сайт сохраняет пустую область обложки.

В файлах проектов, главной и About используется обычный Markdown с метаданными в начале. HTML, JSX и импорты для оформления контента не нужны. Оформление главной и About задаёт `src/components/EditablePage.astro`.

### About и сертификаты

Текст страницы хранится в `src/content/pages/about-me.md`. Секции начинаются с `##`, подразделы — с `###`. Во всех секциях основной текст расположен под заголовком и занимает всю ширину контентной области. Секция Experience & Background удалена.

Три сертификата лежат рядом с Markdown, в `src/content/pages/`:

| Файл | Подпись |
| --- | --- |
| `Certificate Coursera.jpg` | Google UX Design Professional Certificate · Google / Coursera · 2024 |
| `Certificate UsabilityLab.jpg` | Certified Usability Professional — Module 1 · UsabilityLab · 2010 |
| `Certificate UPA Europe.jpg` | User Experience Russia — UPA Europe · Conference participation · 16 hours · 2009 |

Блок Education & Certifications содержит вводный текст, затем карточки сертификатов. Для каждой карточки используйте заголовок `###`, изображение и абзац с подписью:

```markdown
### Google UX Design Professional Certificate

![Описание сертификата](<./Certificate Coursera.jpg>)

Google / Coursera · 2024
```

Угловые скобки позволяют использовать пробелы в имени файла. Карточки формируются автоматически в порядке Markdown: три в ряд на широком экране, одна под другой на телефоне. Сертификаты показываются целиком, по нажатию открывается изображение в полном размере. Astro обрабатывает локальные изображения и создаёт WebP при сборке; копировать сертификаты в `public` не нужно. Для замены сертификата сохраните имя файла либо обновите ссылку в Markdown. Название секции `Education & Certifications` используется компонентом для включения карточной раскладки.

### Шаблоны кейсов

Общий компонент: `src/components/theme/CompanyOverview.astro`.

- Вверху отображаются название, логотип при наличии и краткое описание.
- Блок About … содержит описание слева и роль справа.
- Колонка роли начинается с заголовка `## My role …`.
- На узких экранах колонки располагаются друг под другом.

Tickeron, FraudScore и I-Jet Media имеют блок Explore the work со ссылками на отдельные направления.

MyHospital и KidswearCycle — цельные кейсы: описание и роль находятся сверху, остальные разделы идут ниже на той же странице. Весь текст хранится в одном `index.md`.

Mafia Game использует такой же верх страницы, без дополнительных разделов. Текущий текст и обязанности — черновая «рыба», их нужно заменить фактическим описанием проекта.

### Файлы направлений

Все пути ниже указаны относительно `src/content/companies/`.

| Проект | Файлы направлений |
| --- | --- |
| Tickeron | `tickeron/projects/website-ui/website-ui.md`, `tickeron/projects/landing-pages/landing-pages.md`, `tickeron/projects/icons-banners/icons-banners.md` |
| FraudScore | `fraudscore/projects/safeclick-website/safeclick-website.md`, `fraudscore/projects/fraudscore-website/fraudscore-website.md`, `fraudscore/projects/fraudscore-platform/fraudscore-platform.md`, `fraudscore/projects/social-media-blog/social-media-blog.md`, `fraudscore/projects/expo-design/expo-design.md`, `fraudscore/projects/presentations/presentations.md` |
| I-Jet Media | `ijet-media/projects/game-interfaces/game-interfaces.md`, `ijet-media/projects/mobile-versions/mobile-versions.md`, `ijet-media/projects/technical-specifications/technical-specifications.md` |

Файлы направлений автоматически появляются на обзорной странице родительского проекта. Их адрес: `/work/<project-slug>/<section-slug>/`.

В SafeClick Website и FraudScore Website описание проекта и изменений находится слева, а список `## My role as Product Designer:` — справа; на телефоне блоки идут друг под другом. Заголовок `## About …` относится к левой колонке. Внизу всех направлений кнопка Explore more work ведёт в `/work/`.

В SafeClick Website и FraudScore Website включены галереи Before / After (`comparison: true`). Скриншоты кладите в папки `before/` и `after/` рядом с Markdown проекта: `src/content/companies/fraudscore/projects/safeclick-website/` или `src/content/companies/fraudscore/projects/fraudscore-website/`. Поддерживаются PNG, JPG, JPEG, WebP, AVIF, GIF и SVG. Изображения подхватываются автоматически при сборке, в локальном dev — при обновлении страницы.

Главная показывается крупно, остальные страницы — сеткой с облегчёнными WebP-превью. Имена `Desktop - 1920 - home.png`, `pricing.png`, `registration.png` и другие названия страниц распознаются автоматически; порядок и подписи заданы в `WebsiteComparison.astro`. Новые страницы тоже появляются автоматически. Для главной после редизайна используются `homepage-desktop.png` и `homepage-mobile.png`, по нажатию открываются соответствующие `homepage-desktop-full.png` и `homepage-mobile-full.png` (если есть). Повторный `Desktop - 1920 - home.png` в этом случае скрывается. Полные страницы открываются в окне с прокруткой, стрелками и закрытием по Escape; ссылка Open original открывает исходник отдельно. Без JavaScript превью ведут прямо на исходники. После добавления файлов опубликованный сайт потребуется заново собрать и опубликовать.

Пример метаданных нового направления:

```yaml
---
project: tickeron
slug: new-section
title: "Section title"
summary: ""
cover: null
order: 100
---
```

`project` — ID родительского проекта, соответствующий его `slug`. `order` задаёт порядок карточек. `fillCover: true` заполняет обложкой всю область карточки.

Коллекция `workSections` загружает файлы `companies/<company>/projects/<project>/<project>.md`. Внутренние имена коллекций `projects` и `workSections` сохранены для совместимости компонентов.

## Изображения и документы

Текст и изображения хранятся рядом. Общий файл компании — `index.md`, каждый отдельный проект — папка в `projects/`:

```text
src/content/companies/
  fraudscore/
    index.md
    cover.png
    01.webp
    projects/
      safeclick-website/
        safeclick-website.md
        cover.png
      fraudscore-platform/
        fraudscore-platform.md
        cover.png
```

- Для замены изображения сохраните его имя и расширение.
- Для изображения отдельного проекта используйте ссылку `/images/projects/<company>/<project>/<filename>`.
- Например: `![Описание](/images/projects/fraudscore/fraudscore-platform/cover.png)`.
- Общие обложки и логотипы компании лежат рядом с её `index.md`; компании без отдельных проектов хранят там все изображения.
- Обложки и логотипы задаются в метаданных `cover` и `logo`.
- `cover: null` оставляет карточку каталога без изображения.
- Изображения SafeClick: `fraudscore/projects/safeclick-website/`.
- Изображения Mafia Game: `mafia-bot-mini-app/`, рядом с `index.md`.
- Обложки Tickeron, MyHospital и KidswearCycle: `cover.webp` в папке каждой компании.
- Обложка FraudScore в каталоге: `fraudscore/cover.png`; FraudScore Platform: `fraudscore/projects/fraudscore-platform/cover.png`.
- Компании без отдельных проектов не требуют пустой папки `projects/`.

Интеграция `src/integrations/project-images.mjs` отдаёт изображения из новой структуры в режиме разработки и копирует их в сборку по прежним публичным URL. Markdown не публикуется как медиа. Дублировать изображения в `public` не нужно.

Портрет и общие изображения главной и About остаются в `public/images/projects/home/` и `public/images/projects/about-me/`. Актуальные три сертификата About берутся из `src/content/pages/`, а не из старого изображения `public/images/projects/about-me/02.webp`. Фирменные логотипы сайта — в `public/images/brand/`.

PDF FraudScore хранится в `public/documents/marketing-design/fraudscore.pdf`. Обычная Markdown-ссылка на PDF автоматически создаёт встроенный просмотр. Несколько изображений подряд без пустых строк формируют галерею.

## Каталог Work

Каталог `src/pages/work/index.astro` показывает отдельные проекты из `companies/<company>/projects/`. Если у компании нет отдельных проектов (например, MyHospital), показывается карточка самой компании. Родительская карточка не дублирует её проекты; название компании подписано над названием каждого проекта.

- `title`, `summary`, `cover`, `fillCover` берутся из метаданных отображаемого проекта. Сначала карточки упорядочены по `order` компании, затем по `order` её проектов.
- `expertise` и `industries` проекта наследуются от компании, если не указаны в его Markdown. Укажите собственный массив для переопределения или `[]`, чтобы убрать теги этой группы.
- Допустимые теги `expertise` и `industries` заданы в `src/data/work-tags.ts`; пустые массивы разрешены.
- Внутри группы фильтры работают по OR, между Expertise и Industries — по AND.
- Фильтры сохраняются в URL, поддерживаются перезагрузка и Back/Forward.
- Числа возле тегов считают отображаемые карточки проектов независимо от выбранных фильтров.
- `visibility: hidden` у компании исключает её и её проекты из каталога; у отдельного проекта — только его карточку. Страницы и sitemap сохраняются. Если все проекты компании скрыты, её карточка не появляется вместо них.
- `status` проекта допускает `placeholder`, `in-progress` и `published`; страница создаётся для каждого статуса.

Пример: `/portfolio/work/?expertise=ui-design&industries=healthcare`.

### Новый проект

1. Создайте `src/content/companies/<project>/index.md`. Начальные поля можно взять из `templates/project.template.md`.
2. Заполните `title`, уникальный `slug`, `summary`, `cover`, теги и `order`.
3. Поместите общие изображения рядом с `index.md`.
4. Для общего шаблона добавьте описание и заголовок `## My role …` со списком обязанностей. Название проекта уже выводит шаблон, дублировать его в тексте не нужно.
5. Для отдельного проекта создайте `projects/<project>/<project>.md` с полем `project`, указывающим ID компании. Поместите его изображения в ту же папку.

Обычный адрес проекта — `/work/<slug>/`. FraudScore использует `casePage: fraudscore`, чтобы сохранить адрес `/fraudscore/`.

## Старые ссылки и sitemap

| Старый адрес | Куда ведёт |
| --- | --- |
| `/user-research/` | `/work/?expertise=ux-research` |
| `/uxui-design/` | `/work/?expertise=ui-design` |
| `/marketing-design/` | `/fraudscore/` |
| `/work/safeclick/` | `/work/fraudscore/safeclick-website/` |
| `/work/fraudscore/safeclick/` | `/work/fraudscore/safeclick-website/` |
| `/work/fraudscore/website/` | `/work/fraudscore/fraudscore-website/` |

Старые MDX-подборки User research и UX/UI design удалены. Футер содержит ссылки Home, Work, About, email и LinkedIn, а также копирайт и Back to top. Отдельных ссылок на категории работ в футере нет.

Совместимость старых якорей хранится в `src/config/content-anchors.ts`. При изменении заголовков проверяйте связанные якоря.

Sitemap: `/portfolio/sitemap.xml`. В него входят главная, опубликованные страницы, проекты и направления; страницы перенаправлений не включаются.

## Настройки и оформление

- Контакты и навигация: `src/config/site.ts`.
- Общий макет: `src/layouts/BaseLayout.astro`.
- Компоненты оформления: `src/components/theme/`.
- Футер и контактный блок: `src/components/theme/SiteFooter.astro`; данные контактов берутся из `src/config/site.ts`, текст контактного блока — из `src/config/home.ts`.
- Основные стили: `src/styles/global.css`.
- Цветовая библиотека: `src/styles/colors.css`.

| Цвет | HEX | Токен |
| --- | --- | --- |
| Charcoal | #151817 | `--palette-charcoal` |
| Ivory | #F3F1E9 | `--palette-ivory` |
| Forest | #245443 | `--palette-forest` |
| Sage | #B8C9A8 | `--palette-sage` |
| Lime | #D6FF43 | `--palette-lime` |

Компоненты используют семантические токены `--canvas`, `--ink`, `--body` и другие для светлой и тёмной темы. Кнопки и CTA используют Charcoal из палитры.

Логотипы светлой и тёмной темы подключены через `Logomark.astro`. Фавикон `public/favicon.svg` выбирает вариант по теме браузера/системы, независимо от переключателя темы сайта.

Исходные графические референсы находятся в `docs/`. Оформление основано на теме [Maria от Andrei Alba](https://github.com/xocothemes/maria). Локальные шрифты — в `public/fonts/`, лицензия темы — `public/licenses/maria-theme.txt`.

## Миграционные материалы

`migration/` хранит материалы исходного переноса с Google Sites. `manifest.json` содержит исходные блоки текста, ссылки и сведения об изображениях; компоненты используют его для размеров изображений и постеров анимаций.

`migration/raw/` и `migration/assets-original/` — локальные резервные копии, исключённые из Git.

`npm run migrate` — исторический импорт из сохранённого HTML. Он может перезаписать контент и восстановить устаревшую структуру: не используйте его для обычного редактирования сайта.

`migration/scripts/validate.mjs` сравнивает сайт с первоначальным переносом. После изменения текстов и структуры кейсов его результат не является проверкой текущей версии сайта. Для структурных изменений используйте `npm run build` и проверку затронутых страниц.

## Публикация

Адрес и префикс `/portfolio` заданы в `astro.config.mjs`. В компонентах используйте `withBase()` из `src/utils/paths.ts`; обычные Markdown-ссылки обрабатываются компонентами сайта.

В GitHub Settings → Pages → Source должен быть выбран GitHub Actions. Workflow `.github/workflows/deploy.yml` использует Node.js 24 и публикует сайт из `main`. Push в `dev` публикацию не запускает. Ручной запуск workflow также публикует только ветку `main`.

Публикация выполняется после отдельного разрешения; локальная сборка сайт не публикует.


### Единый дизайн кейсов

Страницы кейсов автоматически используют `src/components/CaseContent.astro` и `src/styles/case-design.css` через общие маршруты Work. Индивидуальные размеры уже настроенных изображений сохраняются.

- Новый самостоятельный кейс: `templates/project.template.md`.
- Новый раздел компании: `templates/work-section.template.md`.
- Порядок: заголовок страницы, About и роль, On this page, материалы, результаты.
- About и оглавление выравниваются по основному заголовку; материалы занимают колонку 64rem, текст выровнен влево.
- Изображения в `figure` получают тонкую рамку, подпись снизу и ссылку на полный размер. `case-preview-small` ограничивает ширину; `case-gallery` и `case-gallery-three` создают адаптивные сетки.
- Исключения для конкретного проекта добавляются отдельно от общих правил. Общие переменные стилей управляют оформлением существующих и будущих кейсов.

### SEO и изображения

`BaseLayout.astro` автоматически задаёт canonical без параметров фильтров и Open Graph URL. Заголовок и описание берутся из страницы; главная использует отдельный SEO-заголовок.

В sitemap включаются только проекты со `status: published` и `visibility: public`. Раздел компании дополнительно должен иметь `status: published` и `visibility: public`, а его родительский проект тоже должен быть доступен для индексации. Остальные страницы проектов и разделов получают `noindex, follow`; страница 404 также получает `noindex`. Новый раздел из шаблона начинается со `status: draft`.

`src/utils/image-previews.mjs` автоматически дополняет размеры локальных изображений. Для тяжёлых статичных изображений создаются адаптивные WebP-превью, а для GIF — постер с кнопкой Play/Pause. Пропорции сохраняются, ссылки и полноразмерный просмотр используют оригиналы. Превью кэшируются в `.astro/image-previews/`, доступны в режиме разработки и копируются в сборку; вручную сохранять их в контент не нужно.
