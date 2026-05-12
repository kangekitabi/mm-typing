const problems = [
  {
    text: "悪いな でも古くからある島のしきたりなんだ",
    kana: "わるいなでもふるくからあるしまのしきたりなんだ"
  },
  {
    text: "結婚式前夜に花婿は海に潜って沈没船の中にあるトロイのヘレンのネックレスを探すのさ",
    kana: "けっこんしきぜんやにはなむこはうみにもぐってちんぼつせんのなかにあるとろいのへれんのねっくれすをさがすのさ"
  },
  {
    text: "真珠を見つけた男には幸せな結婚生活が待ってるから",
    kana: "しんじゅをみつけたおとこにはしあわせなけっこんせいかつがまってるから"
  }
  {
    text: "へえ 僕のふるさとじゃみんなヘベレケになって終わりだ",
    kana: "へえぼくのふるさとじゃみんなへべれけになっておわりだ"
  }  {
    text: "ああ それもちゃんとやるよ",
    kana: "ああそれもちゃんとやるよ"
  }  {
    text: "ソフィは慌てものだな",
    kana: "そふぃはあわてものだな"
  }  {
    text: "巡り会った最初の男と結婚しちゃうなんて",
    kana: "めぐりあったさいしょのおとことけっこんしちゃうなんて"
  }
];

const romajiMap = {
  "あ":"a","い":"i","う":"u","え":"e","お":"o",
  "か":"ka","き":"ki","く":"ku","け":"ke","こ":"ko",
  "さ":"sa","し":"shi","す":"su","せ":"se","そ":"so",
  "た":"ta","ち":"chi","つ":"tsu","て":"te","と":"to",
  "な":"na","に":"ni","ぬ":"nu","ね":"ne","の":"no",
  "は":"ha","ひ":"hi","ふ":"fu","へ":"he","ほ":"ho",
  "ま":"ma","み":"mi","む":"mu","め":"me","も":"mo",
  "や":"ya","ゆ":"yu","よ":"yo",
  "ら":"ra","り":"ri","る":"ru","れ":"re","ろ":"ro",
  "わ":"wa","を":"wo","ん":"n",
  "が":"ga","ぎ":"gi","ぐ":"gu","げ":"ge","ご":"go",
"ざ":"za","じ":"ji","ず":"zu","ぜ":"ze","ぞ":"zo",
"だ":"da","ぢ":"ji","づ":"zu","で":"de","ど":"do",
"ば":"ba","び":"bi","ぶ":"bu","べ":"be","ぼ":"bo",
"ぱ":"pa","ぴ":"pi","ぷ":"pu","ぺ":"pe","ぽ":"po"
};

function kanaToRomaji(kana) {
  let result = "";
  for (const char of kana) {
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

let currentIndex = 0;
let currentRomaji = "";
let inputIndex = 0;
let missCount = 0;
let startTime = 0;

function showScreen(screen) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
}

function loadProblem() {
  const problem = problems[currentIndex];
  jpText.textContent = problem.text;
  kanaText.textContent = problem.kana;
  currentRomaji = kanaToRomaji(problem.kana);
  romanText.textContent = currentRomaji;
  typedText.textContent = currentRomaji.slice(0, inputIndex);
}

function startGame() {
  currentIndex = 0;
  inputIndex = 0;
  missCount = 0;
  startTime = performance.now();
  loadProblem();
  showScreen(gameScreen);
}

function finishGame() {
  const sec = ((performance.now() - startTime) / 1000).toFixed(2);
  document.getElementById("final-time").textContent = sec + " sec";
  document.getElementById("final-miss").textContent = missCount;

  const score = Math.max(0, Math.floor(1500 - missCount * 50 - sec * 10));
  document.getElementById("final-score").textContent = score;

  let rank = "C";
  if (score > 1200) rank = "S";
  else if (score > 900) rank = "A";
  else if (score > 600) rank = "B";

  document.getElementById("final-rank").textContent = rank;

  showScreen(resultScreen);
}

window.addEventListener("keydown", (e) => {
  if (!gameScreen.classList.contains("active")) return;

  const key = e.key.toLowerCase();

  if (key === currentRomaji[inputIndex]) {
    inputIndex++;
    typedText.textContent = currentRomaji.slice(0, inputIndex);

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
    document.getElementById("miss-count").textContent = missCount;
  }
});

document.getElementById("start-button").addEventListener("click", startGame);
document.getElementById("retry-button").addEventListener("click", startGame);
