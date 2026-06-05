const STORAGE_KEY = "moodle-alpha-site-university";

const campusSettings = {
  ksu: {
    label: "京都産業大学",
    heroChip: "京都産業大学向け表示",
    campusNote: "京都産業大学向けの機能を表示しています。",
    heroSubcopy:
      "Googleカレンダー連携、締め切りの見える化、近代的なUI、ショートカット追加。日々の学習管理を、スマホでもPCでも、よりスムーズに進化させます。",
    heroImage: "./images/dashboard.jpeg",
    heroImageAlt: "京都産業大学向け moodle α ダッシュボード",
    floatingTitle: "締め切りを、ひと目で。",
    floatingText:
      "近い課題を強調表示し、カレンダーとあわせて学習の流れをすっきり整理します。",
    featuresDescription:
      "京都産業大学のMoodle環境に合わせて、日々の課題管理とアクセスを快適にします。",
    showcaseDescription:
      "見やすく整理された締切表示とカレンダーの統合で、課題管理をもっと自然なものにします。"
  },

  kait: {
    label: "神奈川工科大学",
    heroChip: "神奈川工科大学向け表示",
    campusNote: "神奈川工科大学向けの機能を表示しています。",
    heroSubcopy:
      "時間割表示、締め切りの見える化、マイコースや授業ページの改善、ダークモード対応。毎日の学習管理を、より見やすく快適に進化させます。",
    heroImage: "./images/dashboard-kait.jpeg",
    heroImageAlt: "神奈川工科大学向け moodle α ダッシュボード",
    floatingTitle: "授業を、時間割でひと目に。",
    floatingText:
      "自分で設定した授業を時間割形式で表示し、必要な授業へすばやくアクセスできます。",
    featuresDescription:
      "神奈川工科大学のMoodle環境に合わせて、授業、課題、コースの確認を快適にします。",
    showcaseDescription:
      "時間割表示、マイコース改善、ページ全体の統一で、日々の学習をもっと自然なものにします。"
  }
};

const universityButtons = document.querySelectorAll(".university-option");
const campusContents = document.querySelectorAll("[data-campus-content]");

const heroSubcopy = document.getElementById("hero-subcopy");
const heroDashboardImage = document.getElementById("hero-dashboard-image");
const heroFloatingTitle = document.getElementById("hero-floating-title");
const heroFloatingText = document.getElementById("hero-floating-text");
const selectedCampusChip = document.getElementById("selected-campus-chip");
const campusNote = document.getElementById("campus-note");
const featuresDescription = document.getElementById("features-description");
const showcaseDescription = document.getElementById("showcase-description");

function applyImageFallback(image) {
  const fallback = image.dataset.fallback;

  if (!fallback) {
    return;
  }

  image.addEventListener("error", () => {
    if (image.dataset.fallbackApplied === "true") {
      return;
    }

    image.dataset.fallbackApplied = "true";
    image.src = fallback;
  });
}

document
  .querySelectorAll("img[data-fallback]")
  .forEach((image) => applyImageFallback(image));

function setHeroImage(source, altText) {
  heroDashboardImage.dataset.fallbackApplied = "false";
  heroDashboardImage.alt = altText;

  heroDashboardImage.onerror = () => {
    if (heroDashboardImage.dataset.fallbackApplied === "true") {
      return;
    }

    heroDashboardImage.dataset.fallbackApplied = "true";
    heroDashboardImage.src = "./images/dashboard.jpeg";
  };

  heroDashboardImage.src = source;
}

function showCampusContent(selectedCampus) {
  campusContents.forEach((content) => {
    const shouldShow = content.dataset.campusContent === selectedCampus;

    content.hidden = !shouldShow;

    if (shouldShow) {
      content
        .querySelectorAll(".reveal")
        .forEach((element) => element.classList.add("is-visible"));
    }
  });
}

function updateButtons(selectedCampus) {
  universityButtons.forEach((button) => {
    const isActive = button.dataset.university === selectedCampus;

    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
}

function switchUniversity(selectedCampus) {
  const settings = campusSettings[selectedCampus];

  if (!settings) {
    return;
  }

  localStorage.setItem(STORAGE_KEY, selectedCampus);

  updateButtons(selectedCampus);
  showCampusContent(selectedCampus);

  heroSubcopy.textContent = settings.heroSubcopy;
  heroFloatingTitle.textContent = settings.floatingTitle;
  heroFloatingText.textContent = settings.floatingText;
  selectedCampusChip.textContent = settings.heroChip;
  campusNote.textContent = settings.campusNote;
  featuresDescription.textContent = settings.featuresDescription;
  showcaseDescription.textContent = settings.showcaseDescription;

  setHeroImage(settings.heroImage, settings.heroImageAlt);
}

universityButtons.forEach((button) => {
  button.addEventListener("click", () => {
    switchUniversity(button.dataset.university);
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -40px 0px"
  }
);

document
  .querySelectorAll(".reveal:not(.is-visible)")
  .forEach((element) => observer.observe(element));

const savedCampus = localStorage.getItem(STORAGE_KEY);
const initialCampus = campusSettings[savedCampus] ? savedCampus : "ksu";

switchUniversity(initialCampus);
