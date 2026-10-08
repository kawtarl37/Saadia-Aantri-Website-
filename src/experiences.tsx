import { Component, lazy, Suspense, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  branches,
  topics,
  dimensions,
  coachingSteps,
  text,
  type Lang,
} from "./catalog";
import { Link, Ornament } from "./ui";
const Scene = lazy(() => import("./TreeScene"));
class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
function Apple() {
  return (
    <svg className="apple-icon" viewBox="0 0 70 80" aria-hidden="true">
      <path
        d="M34 20q-10-10-22-1C-8 36 9 71 28 72q7-3 13 0C60 72 78 34 57 20q-12-7-23 0"
        fill="#4D0E12"
      />
      <path
        d="M35 20q-2-12 3-17"
        stroke="#4A2E27"
        fill="none"
        strokeWidth="3"
      />
      <path d="M39 11q15-17 25-6q-9 16-25 6" fill="#4A2E27" />
      <path
        d="M15 31q-4 10 1 18"
        stroke="#F5EFC6"
        fill="none"
        strokeWidth="2"
        opacity=".5"
      />
    </svg>
  );
}
function TreeFallback() {
  return (
    <svg className="tree-fallback" viewBox="0 0 800 760" aria-hidden="true">
      <defs>
        <pattern
          id="leaves"
          width="50"
          height="45"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M4 37Q-3 8 25 5Q29 30 4 37M27 44Q25 19 49 15Q53 35 27 44"
            fill="#4A2E27"
            opacity=".35"
          />
        </pattern>
      </defs>
      <path
        d="M380 650L395 375L240 240M395 420L140 370M400 350L420 140M400 410L640 280M410 470L675 450M385 490L215 495"
        stroke="#4A2E27"
        strokeWidth="22"
        fill="none"
      />
      <path
        d="M355 699Q385 630 384 540L414 540Q415 637 450 699M394 668L295 730M406 674L510 731"
        stroke="#4A2E27"
        strokeWidth="10"
        fill="none"
      />
      <path
        d="M130 210Q180 75 340 125Q390 30 520 120Q660 80 700 230Q780 330 690 430Q735 540 580 550Q480 590 403 520Q300 590 200 540Q35 520 100 385Q15 285 130 210"
        fill="url(#leaves)"
      />
    </svg>
  );
}
export function CommunicationTree({
  lang,
  branch,
  setBranch,
}: {
  lang: Lang;
  branch: number;
  setBranch: (id: number) => void;
}) {
  const ar = lang === "ar",
    t = (fr: string, a: string) => (ar ? a : fr);
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false),
    [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false),
    [imageFailed, setImageFailed] = useState(false);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = matchMedia("(min-width: 701px)");
    let supported = false;
    try {
      const canvas = document.createElement("canvas");
      supported = !!canvas.getContext("webgl2");
      setEnabled(!motion.matches && desktop.matches && supported);
    } catch {
      setEnabled(false);
    }
    const listener = () => {
      setEnabled(!motion.matches && desktop.matches && supported);
      setReady(false);
    };
    motion.addEventListener("change", listener);
    desktop.addEventListener("change", listener);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "150px" },
    );
    if (host.current) observer.observe(host.current);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", listener);
      desktop.removeEventListener("change", listener);
    };
  }, []);
  const selected = topics.filter((x) => x.branch === branch);
  return (
    <section className="tree-section" id="communication-tree">
      <div className="tree-heading">
        <span className="eyebrow">
          02 / {t("L’ARBRE DE LA COMMUNICATION", "شجرة التواصل")}
        </span>
        <h2>
          {t("Une même racine.", "جذور واحدة.")}
          <br />
          <em>{t("Mille façons de grandir.", "وطرق كثيرة للنمو.")}</em>
        </h2>
        <p>
          {t(
            "Choisissez une branche, puis cueillez le thème qui vous parle.",
            "اختر فرعًا، ثم اكتشف الموضوع الأقرب إليك.",
          )}
        </p>
        <Ornament />
      </div>
      <div className="tree-layout">
        <div className="tree-stage" ref={host}>
          <div className="tree-paper" aria-hidden="true" />
          <TreeFallback />
          {!imageFailed && (
            <img
              className="tree-art"
              src="/botanical-tree.png"
              alt=""
              onError={() => setImageFailed(true)}
            />
          )}
          <div className="tree-webgl" aria-hidden="true">
            {visible && enabled && !failed && (
              <SceneBoundary
                onFailure={() => {
                  setFailed(true);
                  setReady(false);
                }}
              >
                <Suspense fallback={null}>
                  <Scene
                    onReady={() => setReady(true)}
                    onFailure={() => {
                      setFailed(true);
                      setReady(false);
                    }}
                  />
                </Suspense>
              </SceneBoundary>
            )}
          </div>
          <div
            className={`tree-fruits ${ready && visible && enabled && !failed ? "scene-ready" : ""}`}
          >
            {selected.map((topic, i) => (
              <Link
                key={topic.slug}
                lang={lang}
                to={`topic/${topic.slug}`}
                className={`fruit fruit-${i}`}
              >
                <Apple />
                <span className="fruit-label">{text(topic.title, lang)}</span>
              </Link>
            ))}
          </div>
          <div className="tree-root-label">
            {t("ÉCOUTE · EMPATHIE · DIGNITÉ", "الإصغاء · التعاطف · الكرامة")}
          </div>
        </div>
        <div className="branch-panel">
          <span className="eyebrow">
            {t("LES SIX BRANCHES", "الفروع الستة")}
          </span>
          <div className="branch-controls">
            {branches.map((b) => (
              <button
                key={b.id}
                className={branch === b.id ? "selected" : ""}
                aria-pressed={branch === b.id}
                onClick={() => setBranch(b.id)}
              >
                <span>0{b.id + 1}</span>
                {text(b.title, lang)}
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
          <div className="branch-description" aria-live="polite">
            <h3>{text(branches[branch].title, lang)}</h3>
            <p>{text(branches[branch].description, lang)}</p>
            <ul>
              {selected.map((topic) => (
                <li key={topic.slug}>
                  <Link lang={lang} to={`topic/${topic.slug}`}>
                    {text(topic.title, lang)}
                  </Link>
                </li>
              ))}
            </ul>
            <Link lang={lang} to={`service/${branch}`} className="text-link">
              {t("Découvrir l’accompagnement", "اكتشف المرافقة")}
            </Link>
          </div>
          <Link lang={lang} to="training" className="text-link">
            {t("Voir tous les thèmes", "كل المواضيع")}
          </Link>
        </div>
      </div>
      <p className="tree-roots-copy">
        {t(
          "Les racines : écouter avec empathie, respecter la dignité, développer la responsabilité et transmettre.",
          "الجذور: الإصغاء بتعاطف واحترام الكرامة وتنمية المسؤولية ومشاركة المعرفة.",
        )}
      </p>
    </section>
  );
}
export function Balance({
  lang,
  selected,
  setSelected,
}: {
  lang: Lang;
  selected: number;
  setSelected: (id: number) => void;
}) {
  const ar = lang === "ar",
    t = (fr: string, a: string) => (ar ? a : fr),
    d = dimensions[selected];
  return (
    <section className="balance-section" id="balance">
      <div className="balance-intro">
        <span className="eyebrow">
          {t("L’APPROCHE DE SAADIA", "منهج سعادية")}
        </span>
        <h2>
          {t("L’être humain est", "الإنسان")}
          <br />
          <em>{t("un tout.", "كلّ متكامل.")}</em>
        </h2>
        <p>
          {t(
            "L’esprit, le cœur, l’âme et le corps : quatre dimensions reliées, pour comprendre notre équilibre et notre façon de communiquer.",
            "العقل والقلب والروح والجسد: أربعة أبعاد مترابطة لفهم توازننا وطريقة تواصلنا.",
          )}
        </p>
        <p className="demo">
          {t(
            "Un cadre de réflexion éducatif proposé par Saadia.",
            "إطار تربوي للتأمل تقترحه سعادية.",
          )}
        </p>
      </div>
      <div className="balance-body">
        <div className="medallion">
          <div className="medallion-center">
            <span lang="ar">التوازن</span>
            <small>{t("L’ÉQUILIBRE", "التوازن")}</small>
          </div>
          {dimensions.map((x, i) => (
            <button
              key={x.id}
              className={`petal petal-${i} ${selected === i ? "selected" : ""}`}
              aria-pressed={selected === i}
              onClick={() => setSelected(i)}
            >
              <span className="petal-symbol" aria-hidden="true">
                {x.symbol}
              </span>
              <strong>{text(x.title, lang)}</strong>
              {!ar && <span lang="ar">{x.arabic}</span>}
            </button>
          ))}
        </div>
        <div className="dimension-panel" aria-live="polite">
          <h3>{text(d.title, lang)}</h3>
          <p>{text(d.description, lang)}</p>
          <blockquote>{text(d.prompt, lang)}</blockquote>
          <small>
            {t(
              "Une invitation à réfléchir. Aucune réponse n’est collectée.",
              "دعوة للتأمل. لا تُجمع أي إجابات.",
            )}
          </small>
        </div>
      </div>
    </section>
  );
}
export function CoachingJourney({ lang }: { lang: Lang }) {
  const [step, setStep] = useState(0);
  return (
    <div className="journey">
      <div className="journey-tabs">
        {coachingSteps.map((x, i) => (
          <button
            key={i}
            aria-pressed={step === i}
            className={step === i ? "selected" : ""}
            onClick={() => setStep(i)}
          >
            <span>0{i + 1}</span>
            {text(x.title, lang)}
          </button>
        ))}
      </div>
      <div className="journey-detail" aria-live="polite">
        <h3>{text(coachingSteps[step].title, lang)}</h3>
        <p>{text(coachingSteps[step].description, lang)}</p>
      </div>
    </div>
  );
}
