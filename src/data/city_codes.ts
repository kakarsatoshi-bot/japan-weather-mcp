export interface CityInfo {
  code: string;
  nameJa: string;
  nameEn: string;
  prefecture: string;
}

const CITIES: CityInfo[] = [
  { code: "016000", nameJa: "札幌", nameEn: "Sapporo", prefecture: "北海道" },
  { code: "020000", nameJa: "青森", nameEn: "Aomori", prefecture: "青森県" },
  { code: "030000", nameJa: "盛岡", nameEn: "Morioka", prefecture: "岩手県" },
  { code: "040000", nameJa: "仙台", nameEn: "Sendai", prefecture: "宮城県" },
  { code: "050000", nameJa: "秋田", nameEn: "Akita", prefecture: "秋田県" },
  { code: "060000", nameJa: "山形", nameEn: "Yamagata", prefecture: "山形県" },
  { code: "070000", nameJa: "福島", nameEn: "Fukushima", prefecture: "福島県" },
  { code: "080000", nameJa: "水戸", nameEn: "Mito", prefecture: "茨城県" },
  { code: "090000", nameJa: "宇都宮", nameEn: "Utsunomiya", prefecture: "栃木県" },
  { code: "100000", nameJa: "前橋", nameEn: "Maebashi", prefecture: "群馬県" },
  { code: "110000", nameJa: "さいたま", nameEn: "Saitama", prefecture: "埼玉県" },
  { code: "120000", nameJa: "千葉", nameEn: "Chiba", prefecture: "千葉県" },
  { code: "130000", nameJa: "東京", nameEn: "Tokyo", prefecture: "東京都" },
  { code: "140000", nameJa: "横浜", nameEn: "Yokohama", prefecture: "神奈川県" },
  { code: "150000", nameJa: "新潟", nameEn: "Niigata", prefecture: "新潟県" },
  { code: "160000", nameJa: "富山", nameEn: "Toyama", prefecture: "富山県" },
  { code: "170000", nameJa: "金沢", nameEn: "Kanazawa", prefecture: "石川県" },
  { code: "180000", nameJa: "福井", nameEn: "Fukui", prefecture: "福井県" },
  { code: "190000", nameJa: "甲府", nameEn: "Kofu", prefecture: "山梨県" },
  { code: "200000", nameJa: "長野", nameEn: "Nagano", prefecture: "長野県" },
  { code: "210000", nameJa: "岐阜", nameEn: "Gifu", prefecture: "岐阜県" },
  { code: "220000", nameJa: "静岡", nameEn: "Shizuoka", prefecture: "静岡県" },
  { code: "230000", nameJa: "名古屋", nameEn: "Nagoya", prefecture: "愛知県" },
  { code: "240000", nameJa: "津", nameEn: "Tsu", prefecture: "三重県" },
  { code: "250000", nameJa: "大津", nameEn: "Otsu", prefecture: "滋賀県" },
  { code: "260000", nameJa: "京都", nameEn: "Kyoto", prefecture: "京都府" },
  { code: "270000", nameJa: "大阪", nameEn: "Osaka", prefecture: "大阪府" },
  { code: "280000", nameJa: "神戸", nameEn: "Kobe", prefecture: "兵庫県" },
  { code: "290000", nameJa: "奈良", nameEn: "Nara", prefecture: "奈良県" },
  { code: "300000", nameJa: "和歌山", nameEn: "Wakayama", prefecture: "和歌山県" },
  { code: "310000", nameJa: "鳥取", nameEn: "Tottori", prefecture: "鳥取県" },
  { code: "320000", nameJa: "松江", nameEn: "Matsue", prefecture: "島根県" },
  { code: "330000", nameJa: "岡山", nameEn: "Okayama", prefecture: "岡山県" },
  { code: "340000", nameJa: "広島", nameEn: "Hiroshima", prefecture: "広島県" },
  { code: "350000", nameJa: "山口", nameEn: "Yamaguchi", prefecture: "山口県" },
  { code: "360000", nameJa: "徳島", nameEn: "Tokushima", prefecture: "徳島県" },
  { code: "370000", nameJa: "高松", nameEn: "Takamatsu", prefecture: "香川県" },
  { code: "380000", nameJa: "松山", nameEn: "Matsuyama", prefecture: "愛媛県" },
  { code: "390000", nameJa: "高知", nameEn: "Kochi", prefecture: "高知県" },
  { code: "400000", nameJa: "福岡", nameEn: "Fukuoka", prefecture: "福岡県" },
  { code: "410000", nameJa: "佐賀", nameEn: "Saga", prefecture: "佐賀県" },
  { code: "420000", nameJa: "長崎", nameEn: "Nagasaki", prefecture: "長崎県" },
  { code: "430000", nameJa: "熊本", nameEn: "Kumamoto", prefecture: "熊本県" },
  { code: "440000", nameJa: "大分", nameEn: "Oita", prefecture: "大分県" },
  { code: "450000", nameJa: "宮崎", nameEn: "Miyazaki", prefecture: "宮崎県" },
  { code: "460100", nameJa: "鹿児島", nameEn: "Kagoshima", prefecture: "鹿児島県" },
  { code: "471000", nameJa: "那覇", nameEn: "Naha", prefecture: "沖縄県" },
];

// 日本語の別名（都道府県名・一般的な表記ゆれ）から正規都市名へのマッピング
const JA_ALIASES: Record<string, string> = {
  "北海道": "札幌",
  "東京都": "東京",
  "大阪市": "大阪",
  "大阪府": "大阪",
  "京都市": "京都",
  "京都府": "京都",
  "愛知": "名古屋",
  "愛知県": "名古屋",
  "宮城": "仙台",
  "宮城県": "仙台",
  "神奈川": "横浜",
  "神奈川県": "横浜",
  "石川": "金沢",
  "石川県": "金沢",
  "岩手": "盛岡",
  "岩手県": "盛岡",
  "群馬": "前橋",
  "群馬県": "前橋",
  "滋賀": "大津",
  "滋賀県": "大津",
  "島根": "松江",
  "島根県": "松江",
  "香川": "高松",
  "香川県": "高松",
  "愛媛": "松山",
  "愛媛県": "松山",
  "沖縄": "那覇",
  "沖縄県": "那覇",
  "埼玉": "さいたま",
  "埼玉県": "さいたま",
  "三重": "津",
  "三重県": "津",
  "山梨": "甲府",
  "山梨県": "甲府",
};

// 英語の別名・スペルゆれマッピング
const EN_ALIASES: Record<string, string> = {
  "hokkaido": "Sapporo",
  "tokyo": "Tokyo",
  "osaka": "Osaka",
  "kyoto": "Kyoto",
  "nagoya": "Nagoya",
  "sapporo": "Sapporo",
  "yokohama": "Yokohama",
  "kobe": "Kobe",
  "fukuoka": "Fukuoka",
  "sendai": "Sendai",
  "hiroshima": "Hiroshima",
  "naha": "Naha",
  "okinawa": "Naha",
  "kanazawa": "Kanazawa",
  "niigata": "Niigata",
  "shizuoka": "Shizuoka",
  "saitama": "Saitama",
  "chiba": "Chiba",
  "mito": "Mito",
  "utsunomiya": "Utsunomiya",
  "maebashi": "Maebashi",
  "nagano": "Nagano",
  "gifu": "Gifu",
  "tsu": "Tsu",
  "otsu": "Otsu",
  "nara": "Nara",
  "wakayama": "Wakayama",
  "tottori": "Tottori",
  "matsue": "Matsue",
  "okayama": "Okayama",
  "yamaguchi": "Yamaguchi",
  "tokushima": "Tokushima",
  "takamatsu": "Takamatsu",
  "matsuyama": "Matsuyama",
  "kochi": "Kochi",
  "saga": "Saga",
  "nagasaki": "Nagasaki",
  "kumamoto": "Kumamoto",
  "oita": "Oita",
  "miyazaki": "Miyazaki",
  "kagoshima": "Kagoshima",
  "aomori": "Aomori",
  "morioka": "Morioka",
  "akita": "Akita",
  "yamagata": "Yamagata",
  "fukushima": "Fukushima",
  "toyama": "Toyama",
  "fukui": "Fukui",
  "kofu": "Kofu",
  "hiroshima city": "Hiroshima",
  "fukuoka city": "Fukuoka",
};

// 正規化した英語名インデックス
const enIndex: Record<string, CityInfo> = {};
for (const city of CITIES) {
  enIndex[city.nameEn.toLowerCase()] = city;
}

// 正規化した日本語名インデックス
const jaIndex: Record<string, CityInfo> = {};
for (const city of CITIES) {
  jaIndex[city.nameJa] = city;
}

export function lookupCity(input: string): CityInfo | null {
  const trimmed = input.trim();

  // 日本語エイリアスを解決
  const jaResolved = JA_ALIASES[trimmed];
  if (jaResolved) {
    return jaIndex[jaResolved] ?? null;
  }

  // 日本語直接マッチ
  if (jaIndex[trimmed]) {
    return jaIndex[trimmed];
  }

  // 英語（大文字小文字を無視）
  const lower = trimmed.toLowerCase();
  const enResolved = EN_ALIASES[lower];
  if (enResolved) {
    return enIndex[enResolved.toLowerCase()] ?? null;
  }

  // 英語直接マッチ
  if (enIndex[lower]) {
    return enIndex[lower];
  }

  return null;
}

export function getAllCities(): CityInfo[] {
  return CITIES;
}
