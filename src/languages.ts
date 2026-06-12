// Pure data module shared by sidebars.ts (Node config-time) and
// the LanguagePicker component (browser). Must remain free of Node-only imports.

export type LevelConfig = {
  code: string;
  title: string;
  description: string;
};

export type LanguageConfig = {
  code: string;
  label: string;
  levels: LevelConfig[];
};

const level: Record<string, string> = {
  a1: 'Poziom A1 -- początkujący -- podstawowe zwroty potoczne i wyrażenia dotyczące życia codziennego, proste rozmowy.',
  a2: 'Poziom A2 -- podstawowy -- często używane wyrażenia związane z życiem codziennym, rutynowe sytuacje komunikacyjne.',
  b1: 'Poziom B1 -- niższy średnio zaawansowany -- rozumienie znaczenia głównych wątków przekazu zawartego w jasnych, standardowych wypowiedziach, tworzenie prostych, spójnych wypowiedzi oraz opisów i uzasadnień.',
  b2: 'Poziom B2 -- wyższy średnio zaawansowany --  rozumienie znaczenia głównych wątków przekazu zawartego w złożonych tekstach, dyskusja na tematy techniczne.',
  c1: 'Poziom C1 -- zaawansowany -- rozumienie trudnych, dłuższych tekstów, dostrzeganie wyrażone pośrednio, ukrytych znaczeń.',
  c2: 'Poziom C2 -- biegły -- płynne czytanie i streszczanie informacji z dowolnych tekstów.',
};

function allLevels(label: string): LevelConfig[] {
  return (['a1', 'a2', 'b1', 'b2', 'c1', 'c2'] as const).map((code) => ({
    code,
    title: `${label} ${code.toUpperCase()}`,
    description: level[code],
  }));
}

export const languages: LanguageConfig[] = [
  {code: 'arb', label: 'Arabski', levels: allLevels('Arabski')},
  {code: 'bul', label: 'Bułgarski', levels: []},
  {code: 'ces', label: 'Czeski', levels: []},
  {code: 'cmn', label: 'Chiński (mandaryński)', levels: allLevels('Chiński')},
  {code: 'dan', label: 'Duński', levels: []},
  {code: 'deu', label: 'Niemiecki', levels: allLevels('Niemiecki')},
  {code: 'ell', label: 'Nowogrecki', levels: []},
  {code: 'epo', label: 'Esperanto', levels: []},
  {code: 'fas', label: 'Perski', levels: []},
  {code: 'fin', label: 'Fiński', levels: []},
  {code: 'fra', label: 'Francuski', levels: []},
  {code: 'grc', label: 'Starogrecki', levels: allLevels('Starogrecki')},
  {code: 'heb', label: 'Hebrajski', levels: []},
  {code: 'hin', label: 'Hindi', levels: []},
  {code: 'hun', label: 'Węgierski', levels: []},
  {code: 'ind', label: 'Indonezyjski', levels: allLevels('Indonezyjski')},
  {code: 'ita', label: 'Włoski', levels: []},
  {code: 'jpn', label: 'Japoński', levels: []},
  {code: 'kaz', label: 'Kazachski', levels: []},
  {code: 'kor', label: 'Koreański', levels: []},
  {code: 'lat', label: 'Łaciński', levels: allLevels('Łacina')},
  {code: 'lit', label: 'Litewski', levels: []},
  {code: 'mon', label: 'Mongolski', levels: []},
  {code: 'nld', label: 'Niderlandzki', levels: []},
  {code: 'nor', label: 'Norweski', levels: []},
  {code: 'por', label: 'Portugalski', levels: []},
  {code: 'ron', label: 'Rumuński', levels: []},
  {code: 'rus', label: 'Rosyjski', levels: []},
  {code: 'spa', label: 'Hiszpański', levels: allLevels('Hiszpański')},
  {code: 'srp', label: 'Serbski', levels: []},
  {code: 'swa', label: 'Swahili', levels: []},
  {code: 'swe', label: 'Szwedzki', levels: []},
  {code: 'tat', label: 'Tatarski', levels: []},
  {code: 'tgk', label: 'Tadżycki', levels: allLevels('Tadżycki')},
  {code: 'tur', label: 'Turecki', levels: []},
  {code: 'uig', label: 'Ujgurski', levels: []},
  {code: 'ukr', label: 'Ukraiński', levels: allLevels('Ukraiński')},
  {code: 'uzb', label: 'Uzbecki', levels: []},
  {code: 'vie', label: 'Wietnamski', levels: []},
  {code: 'yid', label: 'Jidysz', levels: []},
];

export const languageOptions = languages.map(({code, label}) => ({
  code,
  label,
}));
