import { dbService } from "./database";

const CODE_PREFIXES = [
  "ALPHA",
  "BRAVO",
  "CHARLIE",
  "DELTA",
  "ECHO",
  "FOXTROT",
  "GOLF",
  "HOTEL",
  "INDIA",
  "JULIET",
  "KILO",
  "LIMA",
  "MIKE",
  "NOVEMBER",
  "OSCAR",
  "PAPA",
  "QUEBEC",
  "ROMEO",
  "SIERRA",
  "TANGO",
  "UNIFORM",
  "VICTOR",
  "WHISKEY",
  "XRAY",
  "YANKEE",
  "ZULU",
];

const CODE_SUFFIXES = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
  "49",
  "50",
];

export function generateInviteCode(): string {
  const prefix =
    CODE_PREFIXES[Math.floor(Math.random() * CODE_PREFIXES.length)];
  const suffix =
    CODE_SUFFIXES[Math.floor(Math.random() * CODE_SUFFIXES.length)];
  return `CODE-${prefix}-${suffix}`;
}

export async function generateUniqueInviteCode(): Promise<string> {
  let code: string;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    code = generateInviteCode();
    const existingInvite = await dbService.getInviteByCode(code);
    isUnique = !existingInvite;
    attempts++;
  } while (!isUnique && attempts < maxAttempts);

  if (!isUnique) {
    throw new Error(
      "Unable to generate unique invite code after maximum attempts"
    );
  }

  return code;
}

export async function generateInviteCodes(
  count: number = 2
): Promise<string[]> {
  const codes: string[] = [];

  for (let i = 0; i < count; i++) {
    const code = await generateUniqueInviteCode();
    codes.push(code);
  }

  return codes;
}
