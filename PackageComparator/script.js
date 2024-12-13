const packagesData = {
  PRIME: [
    "Prowadzenie księgowości",
    "Nielimitowane konsultacje podatkowe",
    "Automatyczne płatności",
    "Dostęp do platformy umożliwiającej przekazywanie dokumentów",
    "Dostęp do danych raportowych takich jak podatki, wynagrodzenia, ewidencja VAT",
    "Wsparcie w kontrolach podatkowych",
    "Powiadomienia SMS o zbliżających się terminach płatności podatków itp.",
    "Dostęp do wzorów umów",
    "Dostęp do webinarów",
    "Newsletter podatkowy",
  ],
  "Mentzen+ IT podstawowy": [
    "Nielimitowane konsultacje podatkowe",
    "Uproszczony audyt ksiąg rachunkowych",
    "Obsługa księgowa do 10 lub 30 dok. miesięcznie",
    "Zakładanie spółek przez system S24",
    "Zakładanie JDG",
    "Wnioski do GUS",
    "Start z Mentzenem",
    "Wsparcie w procesie IP BOX",
    "Wniosek o wydanie interpretacji indywidualnej w zakresie ulgi IP BOX oraz zastosowanie stawek 12% oraz 8,5% ryczałtu",
    "Dostęp do wzorów umów",
    "Dostęp do szkoleń podatkowych",
    "Dostęp do webinarów",
    "Dostęp do alertu podatkowego",
    "Opracowania do materiałów publikowanych na YouTube",
    "Newsletter podatkowy",
  ],
  "Mentzen+ IT ryczałt": [
    "Nielimitowane konsultacje podatkowe",
    "Uproszczony audyt ksiąg rachunkowych",
    "Obsługa księgowa do 10 lub 30 dok. miesięcznie",
    "Zakładanie spółek przez system S24",
    "Zakładanie JDG",
    "Wnioski do GUS",
    "Start z Mentzenem",
    "Wsparcie w procesie IP BOX",
    "Wniosek o wydanie interpretacji indywidualnej w zakresie ulgi IP BOX oraz zastosowanie stawek 12% oraz 8,5% ryczałtu",
    "Dostęp do wzorów umów",
    "Dostęp do szkoleń podatkowych",
    "Dostęp do webinarów",
    "Dostęp do alertu podatkowego",
    "Opracowania do materiałów publikowanych na YouTube",
  ],
  "Mentzen+ IT średni": [
    "Nielimitowane konsultacje podatkowe",
    "Nielimitowane konsultacje prawne",
    "Uproszczony audyt ksiąg rachunkowych",
    "Zakładanie spółek przez system S24",
    "Zakładanie JDG",
    "Wnioski do GUS",
    "Start z Mentzenem",
    "Wsparcie w procesie IP BOX",
    "Wniosek o wydanie interpretacji indywidualnej w zakresie ulgi IP BOX oraz zastosowanie stawek 12% oraz 8,5% ryczałtu",
    "Dostęp do wzorów umów",
    "Dostęp do szkoleń podatkowych",
    "Dostęp do webinarów",
    "Dostęp do alertu podatkowego",
    "Opracowania do materiałów publikowanych na YouTube",
  ],
  "Mentzen+ IT premium": [
    "Nielimitowane konsultacje podatkowe",
    "Nielimitowane konsultacje prawne",
    "Uproszczony audyt ksiąg rachunkowych",
    "Zakładanie spółek przez system S24",
    "Zakładanie JDG",
    "Wnioski do GUS",
    "Start z Mentzenem",
    "Wsparcie w procesie IP BOX",
    "Wniosek o wydanie interpretacji indywidualnej w zakresie ulgi IP BOX oraz zastosowanie stawek 12% oraz 8,5% ryczałtu",
    "Dostęp do wzorów regulaminów i OWU opracowanych przez Kancelarię",
    "Dostęp do wzorów uchwał i innych dokumentów korporacyjnych opracowanych przez Kancelarię",
    "Dostęp do wzorów umów handlowych",
    "Dostęp do wzorów umów",
    "Dostęp do szkoleń podatkowych",
    "Dostęp do webinarów",
    "Dostęp do alertu podatkowego",
    "Newsletter podatkowy",
    "Opracowania do materiałów publikowanych na YouTube",
  ],
  "Mentzen+ Prawo i Podatki": [
    "Nielimitowane konsultacje podatkowe",
    "Nielimitowane konsultacje prawne",
    "Analiza podatkowa",
    "Uproszczony audyt księgowy",
    "Zakładanie spółki w S24 oraz zmiany w S24",
    "Zakładanie JDG",
    "Wnioski do GUS",
    "Wsparcie w procesie IP BOX",
    "Wniosek o wydanie interpretacji indywidualnej w zakresie ulgi IP BOX oraz zastosowanie stawek 12% oraz 8,5% ryczałtu",
    "Przygotowanie wezwania do zapłaty raz w miesiącu",
    "Preferencyjna cena za pozostałe usługi Usługodawcy",
    "Dostęp do bazy wiedzy przygotowanej przez Usługodawcę, zawierającej: opracowania, checklisty",
    "Dostęp do wzorów umów",
    "Dostęp do uchwał i krótkich pism",
    "Dostęp do szkoleń",
    "Newsletter podatkowy",
    "Newsletter prawny",
    "Opracowania do materiałów publikowanych na YouTube",
    "Po roku nieprzerwanego posiadania Pakietu Usług, darmowe 4 godziny usługi/usług prawnych dostępnych w ofercie Usługodawcy",
  ],
  "Mentzen+ Prawo": [
    "Nielimitowane konsultacje prawne",
    "Audyt prawny tematyczny raz w miesiącu",
    "Zakładanie spółek przez system S24 oraz zmiany w S24",
    "Zakładanie JDG",
    "Przygotowanie raz w miesiącu wezwania do zapłaty",
    "Preferencyjna cena za pozostałe usługi Usługodawcy",
    "Dostęp do bazy wiedzy przygotowanej przez Usługodawcę, zawierającej: opracowania, checklisty",
    "Dostęp do wzorów umów",
    "Dostęp do uchwał i krótkich pism",
    "Dostęp do szkoleń",
    "Newsletter prawny",
    "Po roku nieprzerwanego posiadania Pakietu Usług, darmowe 2 godziny usługi/usług prawnych dostępnych w ofercie Usługodawcy",
  ],
  "Mentzen+ Podatki": [
    "Nielimitowane konsultacje podatkowe",
    "Analiza podatkowa",
    "Uproszczony audyt księgowy",
    "Preferencyjna cena za pozostałe usługi Usługodawcy",
    "Zakładanie JDG",
    "Dostęp do bazy wiedzy",
    "Dostęp do szkoleń",
    "Newsletter podatkowy",
  ],
};

const allFeaturesSet = new Set();
Object.values(packagesData).forEach((pkg) =>
  pkg.forEach((f) => allFeaturesSet.add(f))
);
const allFeatures = Array.from(allFeaturesSet);

const packageSelect1 = document.getElementById("package1");
const packageSelect2 = document.getElementById("package2");
const comparisonBody = document.getElementById("comparisonBody");

const packageNames = Object.keys(packagesData);
packageNames.forEach((name) => {
  const opt1 = document.createElement("option");
  opt1.value = name;
  opt1.innerText = name;
  packageSelect1.appendChild(opt1);

  const opt2 = document.createElement("option");
  opt2.value = name;
  opt2.innerText = name;
  packageSelect2.appendChild(opt2);
});

packageSelect1.value = packageNames[0];
packageSelect2.value = packageNames[1];

function createStatusIcon(status) {
  const icon = document.createElement("div");
  icon.className = "status-icon";
  icon.setAttribute("role", "img");
  icon.setAttribute(
    "aria-label",
    status === "Yes" ? "Included" : "Not included"
  );

  if (status === "Yes") {
    icon.innerHTML = `<svg width="15" height="15" viewBox="0 0 14 14" fill="none">
      <path d="M11.6667 3.5L5.25 9.91667L2.33333 7" stroke="#0F766E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  } else {
    icon.innerHTML = `<svg width="15" height="15" viewBox="0 0 14 14" fill="none">
      <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="#B91C1C" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
  }

  return icon;
}

function renderComparison() {
  const p1 = packageSelect1.value;
  const p2 = packageSelect2.value;
  const showOnlyDiff = document.getElementById("diffToggle").checked;
  comparisonBody.innerHTML = "";

  allFeatures.forEach((feature) => {
    const hasP1 = packagesData[p1].includes(feature) ? "Yes" : "No";
    const hasP2 = packagesData[p2].includes(feature) ? "Yes" : "No";

    if (hasP1 === "Yes" || hasP2 === "Yes") {
      if (showOnlyDiff && hasP1 === hasP2) {
        return;
      }

      const row = document.createElement("div");
      row.className = "comparison-row";

      const featureCell = document.createElement("div");
      featureCell.className = "feature-cell";
      featureCell.innerText = feature;

      const statusCell1 = document.createElement("div");
      statusCell1.className = `status-cell ${
        hasP1 === "Yes" ? "status-yes" : "status-no"
      }`;
      statusCell1.setAttribute("data-label", p1);
      statusCell1.appendChild(createStatusIcon(hasP1));

      const statusCell2 = document.createElement("div");
      statusCell2.className = `status-cell ${
        hasP2 === "Yes" ? "status-yes" : "status-no"
      }`;
      statusCell2.setAttribute("data-label", p2);
      statusCell2.appendChild(createStatusIcon(hasP2));

      row.appendChild(featureCell);
      row.appendChild(statusCell1);
      row.appendChild(statusCell2);
      comparisonBody.appendChild(row);
    }
  });
}

const diffToggle = document.getElementById("diffToggle");
diffToggle.addEventListener("change", renderComparison);

packageSelect1.addEventListener("change", renderComparison);
packageSelect2.addEventListener("change", renderComparison);
renderComparison();
