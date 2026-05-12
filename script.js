const problems = [
{
  text: "悪いな でも古くからある島のしきたりなんだ",
  kana: "わるいなでもふるくからあるしまのしきたりなんだ",
  display: "waruina demo furukukaraaru shimano shikatarinanda"
},
{
  text: "結婚式前夜に花婿は海に潜って─",
  kana: "けっこんしきぜんやにはなむこはうみにもぐって",
  display: "kekkonshiki zenyani hanamukoha umini mogutte"
},
{
  text: "沈没船の中にあるトロイのヘレンのネックレスを探すのさ",
  kana: "ちんぼつせんのなかにあるとろいのへれんのねっくれすをさがすのさ",
  display: "chinbotsusenno nakaniaru toroino herenno nekkuresuwo sagasunosa"
},
{
  text: "真珠を見つけた男には幸せな結婚生活が待ってるから",
  kana: "しんじゅをみつけたおとこにはしあわせなけっこんせいかつがまってるから",
  display: "shinjuwo mitsuketa otokoniha shiawasena kekkonseikatsuga matterukara"
},
{
  text: "へえ 僕のふるさとじゃみんなヘベレケになって終わりだ",
  kana: "へえぼくのふるさとじゃみんなへべれけになっておわりだ",
  display: "hee bokuno furusatoja minna heberekeni natte owarida"
},
{
  text: "ああ それもちゃんとやるよ",
  kana: "ああそれもちゃんとやるよ",
  display: "aa soremo chanto yaruyo"
},
{
  text: "ソフィは慌てものだな",
  kana: "そふぃはあわてものだな",
  display: "sofiha awatemonodana"
},
{
  text: "巡りあった最初の男と結婚しちゃうなんて",
  kana: "めぐりあったさいしょのおとことけっこんしちゃうなんて",
  display: "meguriatta saishono otokoto kekkon shichaunante"
}
];

const romajiMap = {
  "あ":"a","い":"i","う":"u","え":"e","お":"o",

  "か":"ka","き":"ki","く":"ku","け":"ke","こ":"ko",
  "が":"ga","ぎ":"gi","ぐ":"gu","げ":"ge","ご":"go",

  "さ":"sa","し":"shi","す":"su","せ":"se","そ":"so",
  "ざ":"za","じ":"ji","ず":"zu","ぜ":"ze","ぞ":"zo",

  "た":"ta","ち":"chi","つ":"tsu","て":"te","と":"to",
  "だ":"da","ぢ":"ji","づ":"zu","で":"de","ど":"do",

  "な":"na","に":"ni","ぬ":"nu","ね":"ne","の":"no",

  "は":"ha","ひ":"hi","ふ":"fu","へ":"he","ほ":"ho",
  "ば":"ba","び":"bi","ぶ":"bu","べ":"be","ぼ":"bo",
  "ぱ":"pa","ぴ":"pi","ぷ":"pu","ぺ":"pe","ぽ":"po",

  "ま":"ma","み":"mi","む":"mu","め":"me","も":"mo",

  "や":"ya","ゆ":"yu","よ":"yo",

  "ら":"ra","り":"ri","る":"ru","れ":"re","ろ":"ro",

  "わ":"wa","を":"wo","ん":"n"
};

const comboMap = {
  "きゃ":"kya","きゅ":"kyu","きょ":"kyo",
  "ぎゃ":"gya","ぎゅ":"gyu","ぎょ":"gyo",

  "しゃ":"sha","しゅ":"shu","しょ":"sho",
  "じゃ":"ja","じゅ":"ju","じょ":"jo",

  "ちゃ":"cha","ちゅ":"chu","ちょ":"cho",

  "にゃ":"nya","にゅ":"nyu","にょ":"nyo",

  "ひゃ":"hya","ひゅ":"hyu","ひょ":"hyo",
  "びゃ":"bya","びゅ":"byu","びょ":"byo",
  "ぴゃ":"pya","ぴゅ":"pyu","ぴょ":"pyo",
"ふぁ":"fa","ふぃ":"fi","ふぇ":"fe",
  "みゃ":"mya","みゅ":"myu","みょ":"myo",

  "りゃ":"rya","りゅ":"ryu","りょ":"ryo"
};

function kanaToRomaji(kana) {

  let result = "";

  for (let i = 0; i < kana.length; i++) {

    const char = kana[i];
    const next = kana[i + 1];

    // 小さい「っ」
    if (char === "っ") {

      const nextRomaji =
        comboMap[kana.slice(i + 1, i + 3)] ||
        romajiMap[next];

      if (nextRomaji) {
        result += nextRomaji[0];
      }

      continue;
    }

    // 拗音対応
    const combo = char + next;

    if (comboMap[combo]) {
      result += comboMap[combo];
      i++;
      continue;
    }

    result += romajiMap[char] || char;
  }

  return result;
}

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const resultScreen = document.getElementById("result-screen");

const jpText = document.getElementById("jp-text");
const kanaText = document.getElementById("kana-text");
const romanText = document.getElementById("roman-text");
const typedText = document.getElementById("typed-text");

const timerEl = document.getElementById("timer");
const missEl = document.getElementById("miss-count");

const finalTime = document.getElementById("final-time");
const finalMiss = document.getElementById("final-miss");
const finalScore = document.getElementById("final-score");
const finalRank = document.getElementById("final-rank");

let currentIndex = 0;
let currentRomaji = "";
let inputIndex = 0;
let missCount = 0;
let startTime = 0;
let timerInterval = null;

function showScreen(screen) {

  startScreen.classList.remove("active");
  gameScreen.classList.remove("active");
  resultScreen.classList.remove("active");

  screen.classList.add("active");
}

function loadProblem() {

  const problem = problems[currentIndex];

  jpText.textContent = problem.text;
  kanaText.textContent = problem.kana;

  // 入力判定用（空白なし）
  currentRomaji = kanaToRomaji(problem.kana);

  // 表示用（空白あり）
  const displayRomaji = problem.display;

  // 表示上の空白を除去して比較
  const displayWithoutSpaces =
    displayRomaji.replace(/\s/g, "");

  let displayHtml = "";
  let typedCount = 0;

  for (const char of displayRomaji) {

    if (char === " ") {
      displayHtml += " ";
      continue;
    }

    if (typedCount < inputIndex) {
      displayHtml += `<span style="color:#22c55e">${char}</span>`;
    } else {
      displayHtml += char;
    }

    typedCount++;
  }

  romanText.innerHTML = displayHtml;

  typedText.textContent =
    displayWithoutSpaces.slice(0, inputIndex);
}

function startGame() {

  currentIndex = 0;
  inputIndex = 0;
  missCount = 0;

  missEl.textContent = "0";
  timerEl.textContent = "0.00";

  startTime = performance.now();

  clearInterval(timerInterval);

  timerInterval = setInterval(() => {

    const sec =
      ((performance.now() - startTime) / 1000).toFixed(2);

    timerEl.textContent = sec;

  }, 10);

  loadProblem();
  showScreen(gameScreen);
}

function finishGame() {

  clearInterval(timerInterval);

  const finalSec = parseFloat(timerEl.textContent);

  const totalChars = problems.reduce((sum, p) => {
    return sum + kanaToRomaji(p.kana).length;
  }, 0);

  let score = Math.floor(
    totalChars * 10
    - missCount * 50
    - finalSec * 5
  );

  if (score < 0) score = 0;

  let rank = "C";

  if (score >= 1200) rank = "S";
  else if (score >= 900) rank = "A";
  else if (score >= 600) rank = "B";

  finalTime.textContent = `${finalSec} sec`;
  finalMiss.textContent = missCount;
  finalScore.textContent = score;
  finalRank.textContent = rank;

  showScreen(resultScreen);
}

window.addEventListener("keydown", (e) => {

  if (!gameScreen.classList.contains("active")) return;

  const key = e.key.toLowerCase();

  if (key.length !== 1) return;

  if (key === currentRomaji[inputIndex]) {

    inputIndex++;

    loadProblem();

    if (inputIndex >= currentRomaji.length) {

      currentIndex++;
      inputIndex = 0;

      if (currentIndex >= problems.length) {
        finishGame();
      } else {
        loadProblem();
      }
    }

  } else {

    missCount++;
    missEl.textContent = missCount;
  }
});

document
  .getElementById("start-button")
  .addEventListener("click", startGame);

document
  .getElementById("retry-button")
  .addEventListener("click", startGame);
  