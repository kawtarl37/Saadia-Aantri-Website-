import { copy } from "./content";
export type Lang = "fr" | "ar";
export type Localized = { fr: string; ar: string };
export const text = (value: Localized, lang: Lang) => value[lang];
const l = (fr: string, ar: string): Localized => ({ fr, ar });
export const branches = copy.fr.pillars.map((name, id) => ({
  id,
  title: l(name, copy.ar.pillars[id]),
  description: l(copy.fr.descriptions[id], copy.ar.descriptions[id]),
}));
const topicNames = [
  [
    ["confiance", "Confiance en soi", "الثقة بالنفس"],
    ["emotions", "Gestion des émotions", "فهم المشاعر"],
    ["dialogue-interieur", "Dialogue intérieur", "الحوار الداخلي"],
  ],
  [
    ["ecoute", "Écoute active", "الإصغاء الفعّال"],
    ["conflits", "Traverser les désaccords", "تجاوز الخلافات"],
    ["limites", "Exprimer ses limites", "التعبير عن الحدود"],
  ],
  [
    ["leadership", "Leadership relationnel", "القيادة الإنسانية"],
    ["parole", "Prise de parole", "التحدث أمام الجمهور"],
    ["equipe", "Communication en équipe", "التواصل داخل الفريق"],
  ],
  [
    ["mariage", "Se préparer au mariage", "الاستعداد للزواج"],
    ["dialogue-couple", "Dialogue dans le couple", "الحوار الزوجي"],
    ["respect", "Respect mutuel", "الاحترام المتبادل"],
  ],
  [
    ["parentalite", "Écouter son enfant", "الإصغاء للطفل"],
    ["education", "Autorité bienveillante", "الحزم برحمة"],
    ["autonomie", "Construire l’autonomie", "بناء الاستقلالية"],
  ],
  [
    ["orientation", "Choisir son chemin", "اختيار المسار"],
    ["confiance-jeunes", "Confiance des jeunes", "ثقة الشباب بأنفسهم"],
    ["transition", "Entrer dans la vie adulte", "الانتقال إلى الرشد"],
  ],
];
export const topics = topicNames.flatMap((names, branch) =>
  names.map(([slug, fr, ar], i) => ({
    slug,
    branch,
    title: l(fr, ar),
    description: l(
      `${fr} : comprendre ses habitudes, mettre des mots sur ses besoins et expérimenter des outils concrets dans le quotidien.`,
      `${ar}: فهم العادات والتعبير عن الاحتياجات وتجربة أدوات عملية في الحياة اليومية.`,
    ),
    article: branch === 4 ? 1 : i === 1 ? 0 : 2,
  })),
);
export const dimensions = [
  {
    id: "mind",
    title: l("L’esprit", "العقل"),
    arabic: "العقل",
    symbol: "✧",
    description: l(
      "Nos pensées, nos croyances et la façon dont nous interprétons une situation.",
      "أفكارنا ومعتقداتنا والطريقة التي نفهم بها المواقف.",
    ),
    prompt: l(
      "Quelle histoire suis-je en train de me raconter ?",
      "ما القصة التي أرويها لنفسي؟",
    ),
  },
  {
    id: "heart",
    title: l("Le cœur", "القلب"),
    arabic: "القلب",
    symbol: "♡",
    description: l(
      "Nos émotions, nos besoins affectifs et les liens que nous construisons.",
      "مشاعرنا واحتياجاتنا العاطفية والروابط التي نبنيها.",
    ),
    prompt: l(
      "Qu’est-ce que je ressens, et qu’est-ce qui compte pour moi ?",
      "ماذا أشعر، وما الذي يهمّني؟",
    ),
  },
  {
    id: "soul",
    title: l("L’âme", "الروح"),
    arabic: "الروح",
    symbol: "☼",
    description: l(
      "Le sens, les valeurs et l’ancrage spirituel qui orientent notre vie.",
      "المعنى والقيم والجذور الروحية التي توجّه حياتنا.",
    ),
    prompt: l(
      "Qu’est-ce qui donne du sens à cette situation ?",
      "ما الذي يمنح هذا الموقف معنى؟",
    ),
  },
  {
    id: "body",
    title: l("Le corps", "الجسد"),
    arabic: "الجسد",
    symbol: "❋",
    description: l(
      "Nos sensations physiques, notre énergie et notre rythme de vie.",
      "أحاسيسنا الجسدية وطاقتنا وإيقاع حياتنا.",
    ),
    prompt: l(
      "Qu’est-ce que je remarque dans mon corps ?",
      "ماذا ألاحظ في جسدي؟",
    ),
  },
];
export const coachingSteps = [
  {
    title: l("Écouter", "الإصغاء"),
    description: l(
      "Un premier espace pour vous entendre, accueillir votre vécu et clarifier vos attentes.",
      "مساحة أولى للإصغاء إلى تجربتك وفهم توقعاتك.",
    ),
  },
  {
    title: l("Comprendre", "الفهم"),
    description: l(
      "Identifier ensemble vos préoccupations, les points de difficulté et les habitudes qui reviennent.",
      "تحديد الانشغالات والصعوبات والأنماط المتكررة معًا.",
    ),
  },
  {
    title: l("Relier les quatre dimensions", "ربط الأبعاد الأربعة"),
    description: l(
      "Explorer l’esprit, le cœur, l’âme et le corps pour mieux comprendre votre équilibre.",
      "استكشاف العقل والقلب والروح والجسد لفهم توازنك بشكل أفضل.",
    ),
  },
  {
    title: l("Pratiquer & faire le point", "الممارسة والمراجعة"),
    description: l(
      "Essayer des outils concrets, observer ce qui change et ajuster le travail à vos besoins.",
      "تجربة أدوات عملية وملاحظة التغيّر وتكييف العمل حسب احتياجاتك.",
    ),
  },
];
export const programs = [
  {
    slug: "individual",
    branch: 0,
    title: l("Coaching individuel", "المرافقة الفردية"),
    duration: l(
      "6–8 séances en moyenne · en tête-à-tête",
      "6–8 جلسات في المتوسط · فردية",
    ),
    description: l(
      "Un espace d’écoute et de travail pour mieux vous connaître, comprendre vos difficultés et avancer avec des outils adaptés.",
      "مساحة للإصغاء والعمل لفهم نفسك وصعوباتك والتقدّم بأدوات مناسبة.",
    ),
  },
  {
    slug: "family",
    branch: 4,
    title: l("Couple & famille", "الزوجان والأسرة"),
    duration: l(
      "Accompagnement adapté à votre situation",
      "مرافقة تتناسب مع وضعكم",
    ),
    description: l(
      "Renforcer le dialogue, exprimer les besoins et construire des relations respectueuses, avec une place explicite pour les valeurs islamiques.",
      "تقوية الحوار والتعبير عن الاحتياجات وبناء علاقات محترمة، مع حضور واضح للقيم الإسلامية.",
    ),
  },
  {
    slug: "youth",
    branch: 5,
    title: l("Jeunes & transitions", "الشباب والتحوّلات"),
    duration: l(
      "Accompagnement individuel · modalités à définir",
      "مرافقة فردية · التفاصيل تُحدّد معًا",
    ),
    description: l(
      "Développer la confiance, mieux communiquer et trouver ses repères dans les changements de la vie.",
      "تنمية الثقة وتحسين التواصل وإيجاد التوازن خلال تحوّلات الحياة.",
    ),
  },
  {
    slug: "professional",
    branch: 2,
    title: l("Formations professionnelles", "التكوين المهني"),
    duration: l("3 jours de formation", "3 أيام من التكوين"),
    description: l(
      "Communication, soft skills et leadership : une formation interactive ancrée dans les situations professionnelles.",
      "التواصل والمهارات الإنسانية والقيادة: تكوين تفاعلي مرتبط بالمواقف المهنية.",
    ),
  },
  {
    slug: "group",
    branch: 1,
    title: l("Ateliers & programmes collectifs", "الورشات والبرامج الجماعية"),
    duration: l(
      "Format et calendrier à confirmer",
      "الصيغة والمواعيد قيد التأكيد",
    ),
    description: l(
      "Apprendre par l’échange, les exercices et les situations concrètes, dans un cadre respectueux.",
      "التعلّم من خلال الحوار والتمارين والمواقف العملية في إطار محترم.",
    ),
  },
];
export const biography = {
  background: l(
    "Diplôme Supérieur en Sciences de l’Information et de la Communication. Parcours académique en langue française et qualifications d’enseignement.",
    "دبلوم عالٍ في علوم الإعلام والاتصال، ومسار أكاديمي باللغة الفرنسية ومؤهلات في التدريس.",
  ),
  institutions: ["ENSIAS", "ENSEM", "ENCG"],
  additional: l(
    "Formations complémentaires en psychologie, PNL, gestion du temps, apprentissage accéléré, leadership et management.",
    "تكوينات إضافية في علم النفس والبرمجة اللغوية العصبية وإدارة الوقت والتعلّم المسرّع والقيادة والتسيير.",
  ),
};
export const courses = [
  {
    slug: "confidence",
    branch: 0,
    language: "ar",
    title: l("La confiance en soi", "الثقة بالنفس"),
    description: l(copy.fr.courseText, copy.ar.courseText),
    status: l("Prix & disponibilité à confirmer", "السعر والإتاحة قيد التأكيد"),
    curriculum: [
      l("Se connaître", "معرفة الذات"),
      l("Le dialogue intérieur", "الحوار الداخلي"),
      l("Reconnaître ses ressources", "اكتشاف الموارد الذاتية"),
      l("Passer à l’action", "خطوة عملية"),
    ],
  },
];
export type EventRecord = {
  slug: string;
  branch: number;
  title: Localized;
  description: Localized;
  date: string | null;
  format: Localized | null;
  location: Localized | null;
  status: Localized;
};
export const events: EventRecord[] = [
  {
    slug: "family-dialogue",
    branch: 4,
    title: l(copy.fr.event, copy.ar.event),
    description: l(
      "Présentation d’un atelier sur l’écoute, les émotions et les limites au sein de la famille.",
      "عرض لورشة حول الإصغاء والمشاعر والحدود داخل الأسرة.",
    ),
    date: null,
    format: null,
    location: null,
    status: l(
      "Date, format et lieu à confirmer",
      "الموعد والصيغة والمكان قيد التأكيد",
    ),
  },
];
export const articles = [
  {
    slug: "emotions",
    branch: 0,
    title: l(copy.fr.articles[0], copy.ar.articles[0]),
    paragraphs: [
      l(
        "Avant de répondre à une situation difficile, prenons un instant pour reconnaître ce qui se passe en nous. Nommer une émotion peut nous aider à exprimer notre vécu plus clairement.",
        "قبل الرد في موقف صعب، لنأخذ لحظة للتعرّف إلى ما يجري داخلنا. تسمية الشعور قد تساعدنا على التعبير عن تجربتنا بوضوح.",
      ),
      l(
        "Une émotion n’est pas un ordre d’agir. Nous pouvons ressentir de la colère et choisir des mots qui décrivent nos besoins sans attaquer l’autre.",
        "الشعور ليس أمرًا بالتصرف. يمكن أن نشعر بالغضب ونختار كلمات تصف احتياجاتنا دون مهاجمة الآخر.",
      ),
      l(
        "Pour réfléchir : quelle émotion ai-je ressentie aujourd’hui, et de quoi avais-je besoin à ce moment-là ?",
        "للتأمل: ما الشعور الذي أحسست به اليوم، وما الذي كنت أحتاجه في تلك اللحظة؟",
      ),
    ],
  },
  {
    slug: "parenting",
    branch: 4,
    title: l(copy.fr.articles[1], copy.ar.articles[1]),
    paragraphs: [
      l(
        "Quand un enfant exprime une difficulté, notre premier réflexe peut être de lui donner une solution. Écouter d’abord permet de comprendre ce qu’il souhaite nous dire.",
        "عندما يعبّر الطفل عن صعوبة، قد يكون ردّنا الأول تقديم حل. الإصغاء أولًا يسمح بفهم ما يريد قوله.",
      ),
      l(
        "Accueillir une émotion n’empêche pas de poser une limite. Nous pouvons reconnaître la frustration tout en expliquant une règle avec calme et constance.",
        "تقبّل المشاعر لا يمنع وضع الحدود. يمكننا الاعتراف بالإحباط وشرح القاعدة بهدوء وثبات.",
      ),
      l(
        "Essayez une question ouverte : « Qu’est-ce qui a été difficile pour toi ? » Puis laissez un temps de réponse.",
        "جرّب سؤالًا مفتوحًا: «ما الذي كان صعبًا عليك؟» ثم امنح الطفل وقتًا للإجابة.",
      ),
    ],
  },
  {
    slug: "boundaries",
    branch: 1,
    title: l(copy.fr.articles[2], copy.ar.articles[2]),
    paragraphs: [
      l(
        "Dire non peut protéger notre temps, notre énergie et nos engagements. Une limite claire aide l’autre à comprendre ce qui est possible pour nous.",
        "قول لا قد يحمي وقتنا وطاقتنا والتزاماتنا. الحدود الواضحة تساعد الآخر على فهم ما نستطيع القيام به.",
      ),
      l(
        "Nous pouvons être respectueux et fermes à la fois : expliquer brièvement notre limite, sans multiplier les justifications ni accuser l’autre.",
        "يمكن أن نكون محترمين وحازمين في الوقت نفسه: نشرح الحدّ بإيجاز دون كثرة التبريرات أو اتهام الآخر.",
      ),
      l(
        "Pour vous entraîner, formulez une phrase simple : « Je ne peux pas m’engager sur cela aujourd’hui. »",
        "للتدرّب، صغ عبارة بسيطة: «لا أستطيع الالتزام بهذا اليوم.»",
      ),
    ],
  },
];
export type ResourceRecord = {
  slug: string;
  branch: number;
  title: Localized;
  description: Localized;
  file: string | null;
  status: Localized;
};
export const resources: ResourceRecord[] = [
  {
    slug: "reflection",
    branch: 0,
    title: l(
      "Carnet de réflexion : les quatre dimensions",
      "دفتر التأمل: الأبعاد الأربعة",
    ),
    description: l(
      "Projet de support pour explorer l’esprit, le cœur, l’âme et le corps.",
      "مشروع مادة تساعد على استكشاف العقل والقلب والروح والجسد.",
    ),
    file: null,
    status: l(
      "Ressource en préparation · aucun fichier disponible",
      "مورد قيد الإعداد · لا يوجد ملف متاح",
    ),
  },
  {
    slug: "family-listening",
    branch: 4,
    title: l("Repères pour l’écoute en famille", "مفاتيح الإصغاء داخل الأسرة"),
    description: l(
      "Projet de fiche pratique pour soutenir les échanges parents-enfants.",
      "مشروع ورقة عملية لدعم الحوار بين الآباء والأبناء.",
    ),
    file: null,
    status: l(
      "Ressource en préparation · aucun fichier disponible",
      "مورد قيد الإعداد · لا يوجد ملف متاح",
    ),
  },
];
