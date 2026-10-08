import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { copy } from "./content";
import {
  articles,
  biography,
  branches,
  courses,
  events,
  programs,
  resources,
  topics,
  text,
  type Lang,
} from "./catalog";
import { Balance, CoachingJourney, CommunicationTree } from "./experiences";
import { Link, Ornament, PageTitle, localGet, localSet } from "./ui";
import "./style.css";
import "./creative.css";

function InquiryForm({
  lang,
  event = false,
  newsletter = false,
}: {
  lang: Lang;
  event?: boolean;
  newsletter?: boolean;
}) {
  const [sent, setSent] = useState(false),
    t = (fr: string, ar: string) => (lang === "ar" ? ar : fr);
  return (
    <form
      className={newsletter ? "newsletter-form" : ""}
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <p className="demo">
        {t(
          "Démonstration : aucune information n’est envoyée ni enregistrée.",
          "نموذج تجريبي: لا تُرسل المعلومات ولا تُحفظ.",
        )}
      </p>
      {!newsletter && (
        <label>
          {t("Votre nom", "الاسم")}
          <input required autoComplete="name" />
        </label>
      )}
      <label>
        {t("Adresse e-mail", "البريد الإلكتروني")}
        <input required type="email" autoComplete="email" />
      </label>
      {!event && !newsletter && (
        <>
          <label>
            {t("Votre besoin", "نوع المرافقة")}
            <select>
              {programs.map((p) => (
                <option key={p.slug}>{text(p.title, lang)}</option>
              ))}
            </select>
          </label>
          <label>
            {t("Langue préférée", "اللغة المفضلة")}
            <select defaultValue={lang}>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>
          </label>
          <label>
            {t("Un petit mot (facultatif)", "رسالة مختصرة (اختياري)")}
            <textarea maxLength={500} />
          </label>
        </>
      )}
      {!newsletter && (
        <label className="check">
          <input required type="checkbox" />
          {t(
            "Je comprends qu’il s’agit d’une démonstration.",
            "أفهم أن هذا نموذج تجريبي.",
          )}
        </label>
      )}
      <button className="button">
        {newsletter
          ? t("M’inscrire · démo", "اشتراك تجريبي")
          : event
            ? t("Tester l’inscription", "تجربة التسجيل")
            : t("Envoyer ma demande · démo", "إرسال الطلب التجريبي")}{" "}
        ↗
      </button>
      {sent && (
        <p role="status">
          {t(
            "Démonstration terminée. Aucun message n’a été envoyé.",
            "اكتملت التجربة. لم تُرسل أي رسالة.",
          )}
        </p>
      )}
    </form>
  );
}
function CourseFeature({ lang }: { lang: Lang }) {
  const t = (fr: string, ar: string) => (lang === "ar" ? ar : fr),
    c = copy[lang];
  return (
    <section className="course split">
      <div>
        <span className="eyebrow">
          {t(
            "UN PARCOURS EN ARABE · À VOTRE RYTHME",
            "مسار باللغة العربية · وفق إيقاعك",
          )}
        </span>
        <h2>{c.course}</h2>
        <p>{c.courseText}</p>
        <Link to="course" lang={lang} className="button">
          {t("Découvrir le parcours", "اكتشف المسار")}
        </Link>
      </div>
      <div className="course-art">
        <span>01 / {t("CONNAISSANCE DE SOI", "معرفة الذات")}</span>
        <p lang="ar" dir="rtl">
          الثقة
          <br />
          بالنفس
        </p>
        <small>SAADIA AANTRI</small>
        <Ornament word="النمو" />
      </div>
    </section>
  );
}
function ProgramCards({ lang }: { lang: Lang }) {
  return (
    <div className="program-grid">
      {programs.map((p, i) => (
        <Link
          key={p.slug}
          to={`program/${p.slug}`}
          lang={lang}
          className="program-card"
        >
          <span className="eyebrow">
            0{i + 1} / {text(p.duration, lang)}
          </span>
          <h3>{text(p.title, lang)}</h3>
          <p>{text(p.description, lang)}</p>
          <span className="card-action">
            {lang === "ar" ? "اكتشف البرنامج" : "Explorer le programme"} ↗
          </span>
        </Link>
      ))}
    </div>
  );
}
function EditorialLibrary({
  lang,
  kind = "articles",
  preview = false,
}: {
  lang: Lang;
  kind?: "articles" | "resources";
  preview?: boolean;
}) {
  const [query, setQuery] = useState(""),
    [branch, setBranch] = useState(-1),
    t = (fr: string, ar: string) => (lang === "ar" ? ar : fr);
  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f\u064b-\u065f]/g, "")
      .toLowerCase();
  const results = (kind === "articles" ? articles : resources).filter(
    (x) =>
      (branch === -1 || x.branch === branch) &&
      normalize(text(x.title, lang)).includes(normalize(query)),
  );
  return (
    <>
      {!preview && (
        <div className="library-controls">
          <label>
            {t("Rechercher", "البحث")}
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("Un mot, une question…", "كلمة أو سؤال…")}
            />
          </label>
          <label>
            {t("Thème", "الموضوع")}
            <select
              value={branch}
              onChange={(e) => setBranch(Number(e.target.value))}
            >
              <option value={-1}>{t("Tous les thèmes", "كل المواضيع")}</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {text(b.title, lang)}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      <div className="articles">
        {results.map((x, i) => (
          <Link
            key={x.slug}
            to={`${kind === "articles" ? "article" : "resource"}/${x.slug}`}
            lang={lang}
            className="editorial-card"
          >
            <span className="eyebrow">
              0{i + 1} / {text(branches[x.branch].title, lang)}
            </span>
            <span className="card-ornament" aria-hidden="true">
              {["❧", "✧", "❋"][i % 3]}
            </span>
            <h3>{text(x.title, lang)}</h3>
            {kind === "resources" && (
              <p className="demo">
                {text(resources.find((r) => r.slug === x.slug)!.status, lang)}
              </p>
            )}
            <span className="card-action">
              {kind === "articles"
                ? t("Lire l’article", "اقرأ المقال")
                : t("Découvrir la ressource", "اكتشف المورد")}{" "}
              ↗
            </span>
          </Link>
        ))}
      </div>
      {!results.length && (
        <p role="status">
          {t(
            "Aucun résultat. Essayez un autre mot ou thème.",
            "لا توجد نتائج. جرّب كلمة أو موضوعًا آخر.",
          )}
        </p>
      )}
    </>
  );
}
function TrainingLibrary({ lang }: { lang: Lang }) {
  const [branch, setBranch] = useState(-1),
    t = (fr: string, ar: string) => (lang === "ar" ? ar : fr);
  return (
    <>
      <PageTitle
        label={t("BIBLIOTHÈQUE DES THÈMES", "مكتبة المواضيع")}
        title={t("Des branches à explorer.", "فروع تستحق الاستكشاف.")}
      />
      <section>
        <div className="filters">
          <button
            className={branch === -1 ? "active" : ""}
            aria-pressed={branch === -1}
            onClick={() => setBranch(-1)}
          >
            {t("Tous les thèmes", "كل المواضيع")}
          </button>
          {branches.map((b) => (
            <button
              key={b.id}
              className={branch === b.id ? "active" : ""}
              aria-pressed={branch === b.id}
              onClick={() => setBranch(b.id)}
            >
              {text(b.title, lang)}
            </button>
          ))}
        </div>
        <div className="articles">
          {topics
            .filter((x) => branch === -1 || x.branch === branch)
            .map((x) => (
              <Link
                key={x.slug}
                to={`topic/${x.slug}`}
                lang={lang}
                className="training-card"
              >
                <span className="eyebrow">
                  {text(branches[x.branch].title, lang)}
                </span>
                <h3>{text(x.title, lang)}</h3>
                <p>{text(x.description, lang)}</p>
              </Link>
            ))}
        </div>
      </section>
    </>
  );
}
function CourseCatalog({ lang }: { lang: Lang }) {
  const [language, setLanguage] = useState("all"),
    [branch, setBranch] = useState(-1),
    t = (fr: string, ar: string) => (lang === "ar" ? ar : fr);
  const result = courses.filter(
    (x) =>
      (language === "all" || language === x.language) &&
      (branch === -1 || branch === x.branch),
  );
  return (
    <>
      <PageTitle
        label={t("COURS EN LIGNE", "الدورات عبر الإنترنت")}
        title={t("Apprendre. À votre rythme.", "تعلّم وفق إيقاعك.")}
      />
      <section>
        <div className="library-controls">
          <label>
            {t("Langue du cours", "لغة الدورة")}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="all">
                {t("Toutes les langues", "كل اللغات")}
              </option>
              <option value="ar">العربية</option>
              <option value="fr">Français</option>
            </select>
          </label>
          <label>
            {t("Thème", "الموضوع")}
            <select
              value={branch}
              onChange={(e) => setBranch(Number(e.target.value))}
            >
              <option value={-1}>{t("Tous les thèmes", "كل المواضيع")}</option>
              {branches.map((b) => (
                <option value={b.id} key={b.id}>
                  {text(b.title, lang)}
                </option>
              ))}
            </select>
          </label>
        </div>
        {result.length ? (
          result.map((x) => (
            <div className="catalog-course split" key={x.slug}>
              <div className="course-art">
                <span>SAADIA AANTRI</span>
                <p lang="ar" dir="rtl">
                  الثقة
                  <br />
                  بالنفس
                </p>
                <Ornament word="النمو" />
              </div>
              <div>
                <span className="eyebrow">
                  {t("COURS ENREGISTRÉ · ARABE", "دورة مسجّلة · العربية")}
                </span>
                <h2>{text(x.title, lang)}</h2>
                <p>{text(x.description, lang)}</p>
                <p className="availability">{text(x.status, lang)}</p>
                <Link to="course" lang={lang} className="button">
                  {t("Programme & inscription", "البرنامج والتسجيل")}
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p role="status">
            {t(
              "Aucun cours disponible pour ces filtres.",
              "لا توجد دورة بهذه الخيارات.",
            )}
          </p>
        )}
      </section>
    </>
  );
}
function TrainingDays({ lang }: { lang: Lang }) {
  const [day, setDay] = useState(0),
    t = (fr: string, ar: string) => (lang === "ar" ? ar : fr);
  const days = [
    {
      title: t("Comprendre", "الفهم"),
      description: t(
        "Identifier les enjeux de communication et clarifier les objectifs de la formation.",
        "تحديد تحديات التواصل وتوضيح أهداف التكوين.",
      ),
    },
    {
      title: t("Pratiquer", "الممارسة"),
      description: t(
        "Explorer des situations concrètes, expérimenter les outils et apprendre par l’échange.",
        "استكشاف مواقف عملية وتجربة الأدوات والتعلّم من الحوار.",
      ),
    },
    {
      title: t("Intégrer", "التطبيق"),
      description: t(
        "Relier les apprentissages au quotidien professionnel et réfléchir aux prochaines actions.",
        "ربط التعلم بالحياة المهنية والتفكير في الخطوات القادمة.",
      ),
    },
  ];
  return (
    <>
      <div className="day-leaves">
        {days.map((x, i) => (
          <button
            key={i}
            className={day === i ? "selected" : ""}
            aria-pressed={day === i}
            onClick={() => setDay(i)}
          >
            <span>0{i + 1}</span>
            <strong>{x.title}</strong>
            <small>
              {t("JOUR", "اليوم")} {i + 1}
            </small>
          </button>
        ))}
      </div>
      <div className="day-description" aria-live="polite">
        <h3>{days[day].title}</h3>
        <p>{days[day].description}</p>
      </div>
    </>
  );
}

function App() {
  const [path, setPath] = useState(location.pathname),
    [menu, setMenu] = useState(false);
  const parts = path.split("/").filter(Boolean),
    lang: Lang = parts[0] === "ar" ? "ar" : "fr",
    ar = lang === "ar",
    page = parts[1] || "home",
    slug = parts[2],
    c = copy[lang],
    t = (fr: string, a: string) => (ar ? a : fr);
  const param = (name: string, max: number) =>
    Math.min(
      max,
      Math.max(0, Number(new URLSearchParams(location.search).get(name)) || 0),
    );
  const [branch, setBranch] = useState(() => param("branch", 5)),
    [dimension, setDimension] = useState(() => param("dimension", 3)),
    [lesson, setLesson] = useState(0),
    [checkout, setCheckout] = useState(false),
    [done, setDone] = useState<number[]>(() => {
      try {
        const x = JSON.parse(localGet("saadia-progress") || "[]");
        return Array.isArray(x)
          ? x.filter(
              (v: unknown) =>
                Number.isInteger(v) && Number(v) >= 0 && Number(v) < 4,
            )
          : [];
      } catch {
        return [];
      }
    });
  useEffect(() => {
    const fn = () => {
      setPath(location.pathname);
      setBranch(param("branch", 5));
      setDimension(param("dimension", 3));
    };
    window.addEventListener("popstate", fn);
    return () => window.removeEventListener("popstate", fn);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = ar ? "rtl" : "ltr";
    document.title = `${ar ? "سعادية عنتري" : "Saadia Aantri"} — ${page}`;
    setMenu(false);
    setCheckout(false);
    window.scrollTo(0, 0);
  }, [path]);
  const select = (key: string, value: number) => {
    const url = new URL(location.href);
    url.searchParams.set(key, String(value));
    history.replaceState({}, "", url.pathname + url.search);
    key === "branch" ? setBranch(value) : setDimension(value);
  };
  const nav = [
    ["about", t("À propos", "عن سعادية")],
    ["services", t("Services & programmes", "المرافقة والبرامج")],
    ["courses", t("Cours", "الدورات")],
    ["events", t("Événements", "اللقاءات")],
    ["blog", t("Articles & ressources", "المقالات والموارد")],
    ["contact", t("Contact", "تواصل")],
  ];
  const balance = (
    <Balance
      lang={lang}
      selected={dimension}
      setSelected={(id) => select("dimension", id)}
    />
  );
  let body: React.ReactNode = (
    <>
      <PageTitle
        label="404"
        title={t("Cette page est introuvable.", "الصفحة غير موجودة.")}
      />
      <section>
        <Link to="home" lang={lang} className="button">
          {t("Retour à l’accueil", "الرئيسية")}
        </Link>
      </section>
    </>
  );
  if (page === "home")
    body = (
      <>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">
              {t(
                "FORMATRICE · COACH · TRANSMISSION",
                "تكوين · مرافقة · مشاركة المعرفة",
              )}
            </span>
            <h1>
              {t("Mieux se", "نفهم")}
              <br />
              <em>{t("comprendre.", "أنفسنا.")}</em>
              <br />
              {t("Mieux vivre", "ونحسن العيش")}
              <br />
              {t("ensemble.", "معًا.")}
            </h1>
            <div className="hero-bottom">
              <p className="full-promise">
                {t(
                  "Mieux se comprendre. Mieux communiquer. Mieux vivre ensemble.",
                  "نفهم أنفسنا. نتواصل بوعي. ونحسن العيش معًا.",
                )}
              </p>
              <p>{c.intro}</p>
              <Link to="services" lang={lang} className="button">
                {t("Trouver mon accompagnement", "اكتشف المرافقة المناسبة")}
              </Link>
            </div>
            <Ornament />
          </div>
          <div className="hero-image">
            <img
              src="/portrait.png"
              alt={t("Portrait de Saadia Aantri", "سعادية عنتري")}
            />
            <span className="portrait-caption">
              Saadia
              <br />
              <em>Aantri</em>
              <small>{t("L’art de créer du lien.", "فن بناء الروابط.")}</small>
            </span>
            <span className="image-tag">
              {t("GRANDIR, ENSEMBLE", "نتقدم معًا")} ↗
            </span>
            <img className="hero-botanical" src="/botanical-tree.png" alt="" />
          </div>
        </section>
        <div className="ticker">
          <span>{t("L’ESPRIT", "العقل")}</span>
          <b>✧</b>
          <span>{t("LE CŒUR", "القلب")}</span>
          <b>♡</b>
          <span>{t("L’ÂME", "الروح")}</span>
          <b>☼</b>
          <span>{t("LE CORPS", "الجسد")}</span>
        </div>
        <section className="intro split">
          <div className="photo-frame">
            <img src="/about.png" alt="Saadia Aantri" loading="lazy" />
            <span className="photo-note">
              {t("Bonjour, je suis Saadia.", "مرحبًا، أنا سعادية.")}
            </span>
          </div>
          <div>
            <span className="eyebrow">
              01 / {t("FAISONS CONNAISSANCE", "تعارف")}
            </span>
            <h2>{c.about}</h2>
            <p>{c.story}</p>
            <Link to="about" lang={lang} className="text-link">
              {t("Mon histoire & mon parcours", "قصتي ومساري")}
            </Link>
          </div>
        </section>
        <CommunicationTree
          lang={lang}
          branch={branch}
          setBranch={(id) => select("branch", id)}
        />
        {balance}
        <section className="program-preview">
          <div className="section-head">
            <div>
              <span className="eyebrow">
                03 / {t("LES FAÇONS DE GRANDIR ENSEMBLE", "طرق النمو معًا")}
              </span>
              <h2>
                {t("Un chemin qui", "مسار")}
                <br />
                <em>{t("vous ressemble.", "يناسبك.")}</em>
              </h2>
            </div>
            <Link to="services" lang={lang}>
              {t("Tous les accompagnements", "كل أنواع المرافقة")}
            </Link>
          </div>
          <ProgramCards lang={lang} />
        </section>
        <CourseFeature lang={lang} />
        <section className="credentials">
          {["25+", "1 600+", "200+"].map((x, i) => (
            <div key={x}>
              <strong>{x}</strong>
              <p>
                {
                  [
                    t("années d’expérience", "عامًا من الخبرة"),
                    t("professionnels formés", "مهني استفاد من التكوين"),
                    t("heures de coaching", "ساعة مرافقة"),
                  ][i]
                }
              </p>
            </div>
          ))}
        </section>
        <section className="event split">
          <div>
            <span className="eyebrow">
              {t("LE PROCHAIN RENDEZ-VOUS", "اللقاء القادم")}
            </span>
            <h2>{text(events[0].title, lang)}</h2>
            <p>{text(events[0].description, lang)}</p>
            <p className="availability">{text(events[0].status, lang)}</p>
            <Link to="events" lang={lang} className="button">
              {t("Explorer l’atelier", "تفاصيل الورشة")}
            </Link>
          </div>
          <div className="event-illustration">
            <Ornament word="الرحمة" />
            <span aria-hidden="true">❧</span>
          </div>
        </section>
        <section>
          <div className="section-head">
            <h2>
              {t("Des mots pour", "كلمات")}
              <br />
              <em>{t("ouvrir le dialogue.", "تفتح باب الحوار.")}</em>
            </h2>
            <Link to="blog" lang={lang}>
              {t("Le journal & les ressources", "المقالات والموارد")}
            </Link>
          </div>
          <EditorialLibrary lang={lang} preview />
        </section>
        <section className="resources-preview split">
          <div>
            <span className="eyebrow">
              {t("LES RESSOURCES GRATUITES", "الموارد المجانية")}
            </span>
            <h2>
              {t("Pour prolonger", "لنكمل")}
              <br />
              <em>{t("la réflexion.", "التأمل.")}</em>
            </h2>
            <p>
              {t(
                "Des supports à découvrir au fil de leur publication. Les premiers carnets sont en préparation.",
                "مواد تكتشفونها مع نشرها. الدفاتر الأولى قيد الإعداد.",
              )}
            </p>
            <Link to="resources" lang={lang} className="text-link">
              {t("Explorer les ressources", "اكتشف الموارد")}
            </Link>
          </div>
          <div className="resource-collage">
            <span lang="ar">المعرفة</span>
            <p>
              {t(
                "Une idée. Une question. Un premier pas.",
                "فكرة. سؤال. خطوة أولى.",
              )}
            </p>
            <Ornament word="التأمل" />
          </div>
        </section>
        <section className="media-preview">
          <div>
            <span className="eyebrow">YOUTUBE / SAADIA AANTRI</span>
            <h2>
              {t("Une voix, des idées, du lien.", "صوت وأفكار وروابط إنسانية.")}
            </h2>
          </div>
          <Link to="media" lang={lang} className="button">
            {t("Regarder & écouter", "شاهد واستمع")}
          </Link>
        </section>
        <section className="newsletter">
          <h2>{t("Gardons le lien.", "نبقى على تواصل.")}</h2>
          <InquiryForm lang={lang} newsletter />
        </section>
      </>
    );
  else if (page === "about")
    body = (
      <>
        <PageTitle label={c.nav[0]} title={c.about} />
        <section className="split">
          <img className="about-photo" src="/about.png" alt="Saadia Aantri" />
          <div>
            <h2>
              {t("Transmettre pour transformer.", "التعلّم يغيّر حياتنا.")}
            </h2>
            <p>{c.story}</p>
            <h3>
              {t("Un parcours de transmission", "مسار من التعليم والمشاركة")}
            </h3>
            <p>{text(biography.background, lang)}</p>
            <p>
              {t(
                "Enseignement et formation notamment à",
                "تدريس وتكوين، من بين المؤسسات",
              )}{" "}
              {biography.institutions.join(" · ")}.
            </p>
            <p>{text(biography.additional, lang)}</p>
            <Link to="contact" lang={lang} className="text-link">
              {c.contact}
            </Link>
          </div>
        </section>
        <section className="values-section">
          <Ornament word="الرحمة" />
          <h2>{t("L’humain, au centre.", "الإنسان في المركز.")}</h2>
          <p>{c.values}</p>
          <p>
            {t(
              "Respect, écoute, autonomie et responsabilité traversent tous mes accompagnements. Les offres professionnelles sont ouvertes aux personnes de tous horizons.",
              "الاحترام والإصغاء والاستقلالية والمسؤولية أساس مرافقتي. العروض المهنية مفتوحة لمختلف الخلفيات.",
            )}
          </p>
        </section>
        {balance}
      </>
    );
  else if (page === "services")
    body = (
      <>
        <PageTitle
          label={t("SERVICES & PROGRAMMES", "المرافقة والبرامج")}
          title={t("Rencontrons votre prochain pas.", "لنكتشف خطوتك القادمة.")}
        />
        <section>
          <ProgramCards lang={lang} />
        </section>
        <section className="split">
          <div>
            <span className="eyebrow">
              {t("COACHING INDIVIDUEL", "المرافقة الفردية")}
            </span>
            <h2>
              {t("6–8 séances.", "6–8 جلسات.")}
              <br />
              <em>{t("Un espace pour vous.", "مساحة لك.")}</em>
            </h2>
            <p>
              {t(
                "En moyenne, un accompagnement en tête-à-tête adapté à vos besoins. Nous commençons par écouter, puis comprendre et pratiquer.",
                "مرافقة فردية تتكوّن في المتوسط من ست إلى ثماني جلسات، تتكيّف مع احتياجاتك. نبدأ بالإصغاء ثم الفهم والممارسة.",
              )}
            </p>
            <Link to="program/individual" lang={lang} className="text-link">
              {t("Découvrir le parcours", "اكتشف المسار")}
            </Link>
          </div>
          <CoachingJourney lang={lang} />
        </section>
        <section>
          <h2>{t("Explorer par thème", "استكشف حسب الموضوع")}</h2>
          <div className="pillars">
            {branches.map((b) => (
              <Link key={b.id} to={`service/${b.id}`} lang={lang}>
                <span className="number">0{b.id + 1}</span>
                <h3>{text(b.title, lang)}</h3>
                <p>{text(b.description, lang)}</p>
              </Link>
            ))}
          </div>
          <Link to="training" lang={lang} className="text-link">
            {t("La bibliothèque des thèmes", "مكتبة المواضيع")}
          </Link>
        </section>
      </>
    );
  else if (page === "program") {
    const p = programs.find((x) => x.slug === slug);
    if (p)
      body = (
        <>
          <PageTitle
            label={text(p.duration, lang)}
            title={text(p.title, lang)}
          />
          <section className="split">
            <div>
              <h2>{text(p.description, lang)}</h2>
              <p>
                {t(
                  "Un accompagnement éducatif et pratique : objectifs partagés, exercices, échanges et outils à appliquer au quotidien.",
                  "مرافقة تربوية وعملية: أهداف مشتركة وتمارين وحوار وأدوات للحياة اليومية.",
                )}
              </p>
              {p.slug === "family" && <p>{c.values}</p>}
              <p className="availability">{text(p.duration, lang)}</p>
              <p>
                {t(
                  "Tarif, modalités et disponibilité à définir lors de notre échange.",
                  "السعر والتفاصيل والإتاحة تُحدّد خلال التواصل.",
                )}
              </p>
              <Link to="contact" lang={lang} className="button">
                {t("Parlons de votre besoin", "لنناقش احتياجاتك")}
              </Link>
            </div>
            <img
              className="teaching-photo"
              src={p.slug === "professional" ? "/teaching.png" : "/about.png"}
              alt="Saadia Aantri"
            />
          </section>
          {p.slug === "professional" ? (
            <section className="three-days">
              <span className="eyebrow">
                {t(
                  "STRUCTURE ILLUSTRATIVE · PROGRAMME À VALIDER",
                  "هيكلة توضيحية · البرنامج يحتاج إلى مراجعة",
                )}
              </span>
              <h2>
                {t("Trois jours pour pratiquer.", "ثلاثة أيام للممارسة.")}
              </h2>
              <TrainingDays lang={lang} />
            </section>
          ) : (
            <section>
              <h2>
                {t("Écouter. Comprendre. Avancer.", "نصغي. نفهم. نتقدّم.")}
              </h2>
              <CoachingJourney lang={lang} />
            </section>
          )}
          {balance}
        </>
      );
  } else if (page === "service") {
    const b = branches.find((x) => String(x.id) === slug);
    if (b)
      body = (
        <>
          <PageTitle
            label={t("UN CHEMIN DE COMMUNICATION", "مسار للتواصل")}
            title={text(b.title, lang)}
          />
          <section className="split">
            <div>
              <h2>{text(b.description, lang)}</h2>
              <p>
                {t(
                  "Écoute, réflexion et exercices concrets : nous partons de votre situation pour choisir l’accompagnement adapté.",
                  "إصغاء وتأمل وتمارين عملية: ننطلق من وضعك لاختيار المرافقة المناسبة.",
                )}
              </p>
              {[3, 4].includes(b.id) && <p>{c.values}</p>}
              <Link
                to={`program/${b.id === 2 ? "professional" : [3, 4].includes(b.id) ? "family" : b.id === 5 ? "youth" : "individual"}`}
                lang={lang}
                className="button"
              >
                {t("Voir le programme", "اكتشف البرنامج")}
              </Link>
            </div>
            <div className="blue-panel">
              <h3>{t("Les thèmes à explorer", "مواضيع للاستكشاف")}</h3>
              <ul>
                {topics
                  .filter((x) => x.branch === b.id)
                  .map((x) => (
                    <li key={x.slug}>
                      <Link to={`topic/${x.slug}`} lang={lang}>
                        {text(x.title, lang)}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </section>
        </>
      );
  } else if (page === "topic") {
    const x = topics.find((x) => x.slug === slug);
    if (x)
      body = (
        <>
          <PageTitle
            label={text(branches[x.branch].title, lang)}
            title={text(x.title, lang)}
          />
          <section className="reading">
            <p>{text(x.description, lang)}</p>
            <h2>{t("Choisir votre prochain pas.", "اختر خطوتك القادمة.")}</h2>
            <div className="related-links">
              <Link to={`service/${x.branch}`} lang={lang}>
                {t("Un accompagnement sur ce thème", "مرافقة في هذا الموضوع")}
              </Link>
              <Link to={`article/${articles[x.article].slug}`} lang={lang}>
                {t("Un article pour réfléchir", "مقال للتأمل")}
              </Link>
              <Link to="resources" lang={lang}>
                {t("Les ressources disponibles", "الموارد المتاحة")}
              </Link>
              {x.branch === 0 && (
                <Link to="course" lang={lang}>
                  {t("Le cours de confiance en soi", "دورة الثقة بالنفس")}
                </Link>
              )}
              <Link to="training" lang={lang}>
                {t("Tous les thèmes de formation", "كل مواضيع التكوين")}
              </Link>
            </div>
          </section>
        </>
      );
  } else if (page === "training") body = <TrainingLibrary lang={lang} />;
  else if (page === "courses") body = <CourseCatalog lang={lang} />;
  else if (page === "course")
    body = (
      <>
        <PageTitle
          label={t("COURS ENREGISTRÉ · EN ARABE", "دورة مسجلة · العربية")}
          title={c.course}
        />
        <CourseFeature lang={lang} />
        <section className="split">
          <div>
            <h2>{t("Un chemin vers soi.", "مسار نحو الذات.")}</h2>
            <ol>
              {courses[0].curriculum.map((x) => (
                <li key={x.fr}>{text(x, lang)}</li>
              ))}
            </ol>
            <p className="availability">{text(courses[0].status, lang)}</p>
            <p>
              {t(
                "Le parcours d’achat ci-dessous est une démonstration. Aucun paiement n’est demandé.",
                "مسار الشراء أدناه تجربة فقط. لا يُطلب أي دفع.",
              )}
            </p>
            <Link to="checkout" lang={lang} className="button">
              {t("Acheter le cours · démo", "شراء الدورة · تجربة")}
            </Link>
          </div>
          <div className="blue-panel">
            <h3>{t("Apprendre en autonomie", "تعلّم باستقلالية")}</h3>
            <p>{text(courses[0].description, lang)}</p>
            <p>
              {t(
                "Langue : arabe. Vidéos et documents définitifs à venir. Le prototype propose des exercices de réflexion.",
                "اللغة: العربية. الفيديوهات والملفات النهائية غير متاحة بعد. النموذج يقدم تمارين للتأمل.",
              )}
            </p>
            <Link to="learn" lang={lang} className="text-link">
              {t("Aperçu de l’espace apprenant", "معاينة مساحة المتعلم")}
            </Link>
          </div>
        </section>
      </>
    );
  else if (page === "checkout")
    body = (
      <>
        <PageTitle
          label={t("INSCRIPTION · DÉMONSTRATION", "التسجيل · تجربة")}
          title={t("Votre prochain pas.", "خطوتك القادمة.")}
        />
        <section className="split">
          <div className="blue-panel">
            <span className="eyebrow">{t("RÉCAPITULATIF", "ملخّص")}</span>
            <h2>{text(courses[0].title, lang)}</h2>
            <p>{t("Cours enregistré en arabe", "دورة مسجلة باللغة العربية")}</p>
            <p>{text(courses[0].status, lang)}</p>
            <p>
              {t(
                "Aucune carte bancaire, aucun paiement ni compte réel.",
                "لا بطاقة بنكية ولا دفع ولا حساب حقيقي.",
              )}
            </p>
          </div>
          <div>
            {!checkout ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setCheckout(true);
                }}
              >
                <label>
                  {t("Nom", "الاسم")}
                  <input required autoComplete="name" />
                </label>
                <label>
                  {t("Adresse e-mail", "البريد الإلكتروني")}
                  <input required type="email" autoComplete="email" />
                </label>
                <label className="check">
                  <input required type="checkbox" />
                  {t(
                    "Je comprends que cette inscription est simulée.",
                    "أفهم أن هذا تسجيل تجريبي.",
                  )}
                </label>
                <button className="button">
                  {t(
                    "Confirmer l’inscription · démo",
                    "تأكيد التسجيل التجريبي",
                  )}{" "}
                  ↗
                </button>
              </form>
            ) : (
              <div role="status">
                <h2>
                  {t("Bienvenue dans le parcours.", "مرحبًا بك في المسار.")}
                </h2>
                <p>
                  {t(
                    "Inscription simulée réussie. Aucune donnée n’a été transmise et aucun achat n’a été effectué.",
                    "اكتمل التسجيل التجريبي. لم تُرسل بيانات ولم يتم أي شراء.",
                  )}
                </p>
                <Link to="learn" lang={lang} className="button">
                  {t("Accéder à mes leçons", "الدخول إلى الدروس")}
                </Link>
              </div>
            )}
          </div>
        </section>
      </>
    );
  else if (page === "learn")
    body = (
      <>
        <PageTitle
          label={t("ESPACE APPRENANT · DÉMO", "مساحة المتعلم · تجربة")}
          title={t("Votre chemin vers la confiance.", "رحلتك نحو الثقة.")}
        />
        <section className="learner">
          <aside>
            <p>
              {done.length} / 4 {t("leçons terminées", "دروس مكتملة")}
            </p>
            <progress
              value={done.length}
              max={4}
              aria-label={t("Progression du cours", "تقدم الدورة")}
            />
            {courses[0].curriculum.map((x, i) => (
              <button
                key={x.fr}
                className={lesson === i ? "active" : ""}
                aria-pressed={lesson === i}
                onClick={() => setLesson(i)}
              >
                {done.includes(i) ? "✓" : `0${i + 1}`} {text(x, lang)}
              </button>
            ))}
            <Link to="contact" lang={lang}>
              {t("Contacter le support", "المساعدة")}
            </Link>
          </aside>
          <div>
            <div className="lesson-screen">
              <span aria-hidden="true">▷</span>
              <p>
                {t(
                  "Aperçu de démonstration — vidéo à venir",
                  "عرض تجريبي — الفيديو غير متاح",
                )}
              </p>
            </div>
            <h2>{text(courses[0].curriculum[lesson], lang)}</h2>
            <p>
              {
                [
                  t(
                    "Quelles qualités appréciez-vous chez vous ?",
                    "ما الصفات التي تقدّرها في نفسك؟",
                  ),
                  t(
                    "Quels mots employez-vous pour vous parler ?",
                    "ما الكلمات التي تستخدمها للحديث مع نفسك؟",
                  ),
                  t(
                    "Qu’est-ce qui vous a aidé à traverser une difficulté ?",
                    "ما الذي ساعدك على تجاوز صعوبة؟",
                  ),
                  t(
                    "Choisissez un petit pas réalisable cette semaine.",
                    "اختر خطوة صغيرة قابلة للتطبيق هذا الأسبوع.",
                  ),
                ][lesson]
              }
            </p>
            <button
              className="button"
              onClick={() => {
                const next = done.includes(lesson) ? done : [...done, lesson];
                setDone(next);
                localSet("saadia-progress", JSON.stringify(next));
              }}
            >
              {done.includes(lesson)
                ? t("Terminée ✓", "مكتمل ✓")
                : t("Marquer comme terminée", "تحديد الدرس كمكتمل")}
            </button>
            <p className="demo">
              {t(
                "Progression enregistrée dans ce navigateur uniquement, si le stockage est autorisé.",
                "يُحفظ التقدم في هذا المتصفح فقط إذا كان التخزين مسموحًا.",
              )}
            </p>
            <button
              className="text-button"
              onClick={() => {
                setDone([]);
                localSet("saadia-progress", "[]");
              }}
            >
              {t("Réinitialiser la progression", "إعادة ضبط التقدم")}
            </button>
          </div>
        </section>
      </>
    );
  else if (page === "blog")
    body = (
      <>
        <PageTitle
          label={t("ARTICLES & RESSOURCES", "المقالات والموارد")}
          title={t("La connaissance se partage.", "المعرفة تُشارك.")}
        />
        <section>
          <div className="library-links">
            <Link to="resources" lang={lang}>
              {t("Ressources gratuites", "الموارد المجانية")}
            </Link>
            <Link to="media" lang={lang}>
              {t("Vidéos & podcast", "الفيديو والبودكاست")}
            </Link>
          </div>
          <EditorialLibrary lang={lang} />
        </section>
      </>
    );
  else if (page === "article") {
    const x = articles.find((a) => a.slug === slug) || articles[Number(slug)];
    if (x)
      body = (
        <>
          <PageTitle
            label={t(
              "ARTICLE DE DÉMONSTRATION · À VALIDER",
              "مقال نموذجي · يحتاج إلى مراجعة",
            )}
            title={text(x.title, lang)}
          />
          <section className="reading">
            {x.paragraphs.map((p) => (
              <p key={p.fr}>{text(p, lang)}</p>
            ))}
            <blockquote>
              {t(
                "Comprendre ouvre la voie au dialogue.",
                "الفهم يفتح باب الحوار.",
              )}
            </blockquote>
            <Link
              to={x.branch === 4 ? "events" : "contact"}
              lang={lang}
              className="text-link"
            >
              {x.branch === 4 ? text(events[0].title, lang) : c.contact}
            </Link>
            <div className="related-links">
              <Link to="resources" lang={lang}>
                {t("Prolonger la réflexion", "لنواصل التأمل")}
              </Link>
            </div>
          </section>
        </>
      );
  } else if (page === "resources")
    body = (
      <>
        <PageTitle
          label={t("RESSOURCES GRATUITES", "الموارد المجانية")}
          title={t("Des outils pour votre quotidien.", "أدوات لحياتك اليومية.")}
        />
        <section>
          <p>
            {t(
              "Les supports ci-dessous sont en préparation. Les fichiers seront proposés lorsqu’ils seront disponibles.",
              "المواد أدناه قيد الإعداد. ستتوفر الملفات عندما تصبح جاهزة.",
            )}
          </p>
          <EditorialLibrary lang={lang} kind="resources" />
        </section>
      </>
    );
  else if (page === "resource") {
    const x = resources.find((r) => r.slug === slug);
    if (x)
      body = (
        <>
          <PageTitle
            label={t("RESSOURCE GRATUITE", "مورد مجاني")}
            title={text(x.title, lang)}
          />
          <section className="reading">
            <p>{text(x.description, lang)}</p>
            <p className="availability">{text(x.status, lang)}</p>
            {x.file ? (
              <a className="button" href={x.file} download>
                {t("Télécharger", "تحميل")}
              </a>
            ) : (
              <p>
                {t(
                  "Il n’y a pas encore de fichier à télécharger.",
                  "لا يوجد ملف للتحميل بعد.",
                )}
              </p>
            )}
            <Link
              to={x.branch === 0 ? "about" : "article/parenting"}
              lang={lang}
              className="text-link"
            >
              {t("Explorer ce thème dès maintenant", "استكشف الموضوع الآن")}
            </Link>
            <div className="related-links">
              <Link to="resources" lang={lang}>
                {t("Toutes les ressources", "كل الموارد")}
              </Link>
            </div>
          </section>
        </>
      );
  } else if (page === "events")
    body = (
      <>
        <PageTitle
          label={t("ÉVÉNEMENTS & ATELIERS", "اللقاءات والورشات")}
          title={t("Apprendre, ensemble.", "نتعلّم معًا.")}
        />
        <section>
          {events.map((x) => (
            <div className="split event-listing" key={x.slug}>
              <div>
                <span className="eyebrow">
                  {t("ATELIER EN PRÉPARATION", "ورشة قيد الإعداد")}
                </span>
                <h2>{text(x.title, lang)}</h2>
                <p>{text(x.description, lang)}</p>
                <p className="availability">{text(x.status, lang)}</p>
                <Link to={`event/${x.slug}`} lang={lang} className="button">
                  {t("Détails & inscription", "التفاصيل والتسجيل")}
                </Link>
              </div>
              <div className="event-illustration">
                <Ornament word="الرحمة" />
                <span aria-hidden="true">❧</span>
              </div>
            </div>
          ))}
        </section>
      </>
    );
  else if (page === "event") {
    const x = events.find((e) => e.slug === slug);
    if (x)
      body = (
        <>
          <PageTitle
            label={t("ATELIER · EN PRÉPARATION", "ورشة · قيد الإعداد")}
            title={text(x.title, lang)}
          />
          <section className="split">
            <div>
              <p>{text(x.description, lang)}</p>
              <p>{c.values}</p>
              <dl className="event-facts">
                {[
                  [
                    t("Date", "الموعد"),
                    x.date || t("À confirmer", "قيد التأكيد"),
                  ],
                  [
                    t("Format", "الصيغة"),
                    x.format
                      ? text(x.format, lang)
                      : t("À confirmer", "قيد التأكيد"),
                  ],
                  [
                    t("Lieu ou lien en ligne", "المكان أو الرابط"),
                    x.location
                      ? text(x.location, lang)
                      : t("À confirmer", "قيد التأكيد"),
                  ],
                ].map(([label, value]) => (
                  <React.Fragment key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </React.Fragment>
                ))}
              </dl>
              <Link to="register" lang={lang} className="button">
                {t("Tester l’inscription", "تجربة التسجيل")}
              </Link>
            </div>
            <Ornament word="الرحمة" />
          </section>
        </>
      );
  } else if (page === "register")
    body = (
      <>
        <PageTitle
          label={t("INSCRIPTION · DÉMONSTRATION", "التسجيل · تجربة")}
          title={text(events[0].title, lang)}
        />
        <section className="split">
          <div>
            <p>{text(events[0].description, lang)}</p>
            <p className="availability">{text(events[0].status, lang)}</p>
            <p>
              {t(
                "Cette inscription est simulée et ne réserve aucune place.",
                "هذا التسجيل تجريبي ولا يحجز أي مكان.",
              )}
            </p>
          </div>
          <InquiryForm key={lang} lang={lang} event />
        </section>
      </>
    );
  else if (page === "media")
    body = (
      <>
        <PageTitle
          label={t("REGARDER & ÉCOUTER", "شاهد واستمع")}
          title={t(
            "Une voix, des idées, du lien.",
            "صوت وأفكار وروابط إنسانية.",
          )}
        />
        <section className="split">
          <img
            className="teaching-photo"
            src="/teaching.png"
            alt="Saadia Aantri"
          />
          <div>
            <h2>
              {t("Retrouvez Saadia sur YouTube", "تابع سعادية على يوتيوب")}
            </h2>
            <p>
              {t(
                "Des contenus autour de la communication, du développement personnel et des relations humaines.",
                "محتوى حول التواصل والنمو والعلاقات الإنسانية.",
              )}
            </p>
            <a
              className="button"
              href="https://www.youtube.com/@Saadiaantri"
              target="_blank"
              rel="noreferrer"
            >
              YouTube · @Saadiaantri ↗
            </a>
            <p className="demo">
              {t(
                "Les épisodes et podcasts seront ajoutés après vérification.",
                "الحلقات والبودكاست ستُضاف بعد التحقق.",
              )}
            </p>
          </div>
        </section>
      </>
    );
  else if (page === "contact")
    body = (
      <>
        <PageTitle label={t("PRENONS CONTACT", "تواصل")} title={c.contact} />
        <section className="split">
          <div>
            <h2>{t("Je suis là pour vous écouter.", "أنا هنا لأصغي.")}</h2>
            <p>
              {t(
                "Dites-moi simplement quel accompagnement vous intéresse. Les détails sensibles pourront attendre une conversation privée.",
                "حدّد نوع المرافقة المطلوبة. يمكن ترك التفاصيل الحساسة لمحادثة خاصة.",
              )}
            </p>
            <img
              className="contact-portrait"
              src="/signoff.png"
              alt="Saadia Aantri"
            />
          </div>
          <InquiryForm key={lang} lang={lang} />
        </section>
      </>
    );
  return (
    <>
      <a className="skip" href="#main">
        {t("Aller au contenu", "انتقل إلى المحتوى")}
      </a>
      <header>
        <Link to="home" lang={lang} className="brand">
          Saadia <em>Aantri</em>
          <small>
            {t(
              "COMMUNICATION & RELATIONS HUMAINES",
              "التواصل والعلاقات الإنسانية",
            )}
          </small>
        </Link>
        <button
          className="menu-toggle"
          aria-label={t("Menu principal", "القائمة الرئيسية")}
          aria-expanded={menu}
          aria-controls="main-nav"
          onClick={() => setMenu(!menu)}
        >
          {menu ? "✕" : "☰"}
        </button>
        <nav
          id="main-nav"
          aria-label={t("Navigation principale", "التنقل الرئيسي")}
          className={menu ? "open" : ""}
        >
          {nav.map(([to, label]) => (
            <Link
              to={to}
              lang={lang}
              key={to}
              className={page === to ? "current" : ""}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <a
            className="language"
            href={`/${ar ? "fr" : "ar"}/${parts.slice(1).join("/") || "home"}${location.search}`}
            onClick={(e) => {
              e.preventDefault();
              history.pushState(
                {},
                "",
                `/${ar ? "fr" : "ar"}/${parts.slice(1).join("/") || "home"}${location.search}`,
              );
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
          >
            {ar ? "FR" : "العربية"}
          </a>
          <Link to="learn" lang={lang} className="learner-link">
            {t("Mon espace", "مساحتي")}
          </Link>
        </div>
      </header>
      <main id="main" key={`${lang}/${page}/${slug || ""}`}>
        {body}
      </main>
      <section className="closing">
        <Ornament word="الرحمة" />
        <img src="/signoff.png" alt="Saadia Aantri" loading="lazy" />
        <h2>{c.footer}</h2>
        <Link to="contact" lang={lang} className="text-link">
          {t("Commençons le dialogue", "لنبدأ الحوار")}
        </Link>
      </section>
      <footer>
        <div className="footer-brand">
          Saadia <em>Aantri</em>
          <p>
            {t(
              "FORMATRICE · COACH · TRANSMISSION",
              "تكوين · مرافقة · مشاركة المعرفة",
            )}
          </p>
        </div>
        <div className="footer-links">
          {[
            ...nav,
            ["resources", t("Ressources gratuites", "الموارد المجانية")],
            ["training", t("Bibliothèque des thèmes", "مكتبة المواضيع")],
            ["learn", t("Espace apprenant", "مساحة المتعلم")],
            ["media", t("Vidéos & podcast", "الفيديو والبودكاست")],
          ].map(([to, label]) => (
            <Link to={to} lang={lang} key={to}>
              {label}
            </Link>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© 2026 Saadia Aantri</span>
          <span>
            {t(
              "Prototype · sans paiement ni transmission de données",
              "نموذج تجريبي · بدون دفع أو إرسال بيانات",
            )}
          </span>
        </div>
      </footer>
    </>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
