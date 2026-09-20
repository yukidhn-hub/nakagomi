const layerInfo = {
  4: {
    title: "4. アプリケーション層",
    desc: "ユーザーが使うアプリケーションに合わせて、「どんな形式でデータをやり取りするか」を決める層です。",
    examples: ["HTTP / HTTPS：Webページ", "DNS：ドメイン名をIPアドレスに変換", "SMTP / POP3：メールの送受信"],
    analogy: "手紙の「本文」を書いたり、読んだりする段階。"
  },
  3: {
    title: "3. トランスポート層",
    desc: "データを相手に届けるとき、確実性や速さなどを調整します。代表的なのがTCPとUDPです。",
    examples: ["TCP：順番や再送を確認して、確実に届ける", "UDP：確認を減らして、速さを重視する"],
    analogy: "手紙が確実に届いたか、順番通りかをチェックする係。"
  },
  2: {
    title: "2. インターネット層",
    desc: "IPアドレスを使って、データを最終目的地まで運ぶための道筋（ルーティング）を考えます。",
    examples: ["IP：宛先・送信元のIPアドレスを扱う", "ICMP：通信の診断などに使われる"],
    analogy: "封筒に「宛先住所（IPアドレス）」を書く係。"
  },
  1: {
    title: "1. ネットワークインターフェース層",
    desc: "データを電気信号や電波などに変換し、同じネットワーク上の機器へ実際に届けます。",
    examples: ["Ethernet：有線LAN", "Wi-Fi：無線LAN"],
    analogy: "トラックや飛行機など、実際の運搬手段で荷物を運ぶ段階。"
  }
};

const layers = document.querySelectorAll(".layer-card");
const detail = document.getElementById("layerDetail");

layers.forEach(card => {
  card.addEventListener("click", () => {
    const info = layerInfo[card.dataset.layer];
    layers.forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    detail.innerHTML = `
      <div class="detail-content">
        <div>
          <h3>${info.title}</h3>
          <p>${info.desc}</p>
        </div>
        <div class="detail-example">
          <b>代表例</b>
          <ul>${info.examples.map(x => `<li>${x}</li>`).join("")}</ul>
          <p><strong>📮 たとえると：</strong>${info.analogy}</p>
        </div>
      </div>
    `;
    updateProgress();
  });
});

const capsuleItems = [...document.querySelectorAll(".capsule-item")];
const packet = document.getElementById("packet");
const message = document.getElementById("simulationMessage");

function showCapsules(count) {
  capsuleItems.forEach((item, i) => item.classList.toggle("show", i < count));
}

document.getElementById("encapBtn").addEventListener("click", () => {
  showCapsules(4);
  packet.classList.add("move");
  document.getElementById("packetLabel").textContent = "📦";
  message.textContent = "カプセル化完了！データに各層の情報が加わり、相手へ送信されます。";
  updateProgress();
});

document.getElementById("decapBtn").addEventListener("click", () => {
  packet.classList.remove("move");
  showCapsules(0);
  document.getElementById("packetLabel").textContent = "データ";
  message.textContent = "非カプセル化！受信側では、下の層から順に制御情報を取り除きます。";
  updateProgress();
});

document.getElementById("resetBtn").addEventListener("click", () => {
  packet.classList.remove("move");
  showCapsules(0);
  document.getElementById("packetLabel").textContent = "データ";
  message.textContent = "「カプセル化して送信」を押すと、送り状が順番に追加されます。";
});

const questions = [
  {
    q: "「プロトコル」の説明として最も適切なのはどれ？",
    a: ["通信を行うための共通のルール", "パソコンの性能を測る数値", "Wi-Fiの電波を強くする装置", "Webページのデザイン"],
    correct: 0,
    explain: "その通り！プロトコルは、コンピューター同士が通信するための共通ルールです。"
  },
  {
    q: "TCP/IPモデルで、IPアドレスを使って目的地までの道筋を考えるのはどの層？",
    a: ["アプリケーション層", "トランスポート層", "インターネット層", "ネットワークインターフェース層"],
    correct: 2,
    explain: "正解！インターネット層ではIPを使って、目的地までデータを届ける役割を担います。"
  },
  {
    q: "送信時、データに各層の制御情報を順番に付け加えていくことを何という？",
    a: ["ルーティング", "カプセル化", "暗号化", "圧縮"],
    correct: 1,
    explain: "正解！送信側でヘッダなどを付け加えていくことを「カプセル化」といいます。"
  }
];

let quizIndex = 0;
let score = 0;
let answered = false;

const quizQuestion = document.getElementById("quizQuestion");
const answers = document.getElementById("answers");
const quizFeedback = document.getElementById("quizFeedback");
const nextBtn = document.getElementById("nextQuizBtn");
const quizCount = document.getElementById("quizCount");
const quizDots = document.getElementById("quizDots");

function renderDots() {
  quizDots.innerHTML = questions.map((_, i) =>
    `<span class="${i < quizIndex ? "done" : i === quizIndex ? "active" : ""}"></span>`
  ).join("");
}

function loadQuiz() {
  answered = false;
  const item = questions[quizIndex];
  quizCount.textContent = `Q${quizIndex + 1} / ${questions.length}`;
  quizQuestion.textContent = item.q;
  quizFeedback.textContent = "";
  quizFeedback.className = "quiz-feedback";
  nextBtn.disabled = true;
  nextBtn.textContent = quizIndex === questions.length - 1 ? "結果を見る →" : "次の問題 →";
  answers.innerHTML = item.a.map((text, i) =>
    `<button class="answer-btn" data-index="${i}">${text}</button>`
  ).join("");
  answers.querySelectorAll(".answer-btn").forEach(btn => {
    btn.addEventListener("click", () => answerQuiz(Number(btn.dataset.index)));
  });
  renderDots();
}

function answerQuiz(selected) {
  if (answered) return;
  answered = true;
  const item = questions[quizIndex];
  const btns = answers.querySelectorAll(".answer-btn");
  btns.forEach(b => b.disabled = true);
  btns[item.correct].classList.add("correct");
  if (selected === item.correct) {
    score++;
    quizFeedback.textContent = "⭕ " + item.explain;
    quizFeedback.classList.add("good");
  } else {
    btns[selected].classList.add("wrong");
    quizFeedback.textContent = `❌ おしい！正解は「${item.a[item.correct]}」。${item.explain}`;
    quizFeedback.classList.add("bad");
  }
  nextBtn.disabled = false;
  updateProgress();
}

nextBtn.addEventListener("click", () => {
  if (!answered) return;
  quizIndex++;
  if (quizIndex >= questions.length) {
    document.getElementById("quizCard").classList.add("hidden");
    document.getElementById("scoreCard").classList.remove("hidden");
    document.getElementById("scoreNumber").textContent = score;
    const scoreMessage = document.getElementById("scoreMessage");
    scoreMessage.textContent =
      score === 3 ? "全問正解！ネットワーク探検、ばっちりです！" :
      score === 2 ? "あと一歩！間違えた問題をもう一度見直してみよう。" :
      "まずは基本をもう一度確認してみよう。焦らなくてOK！";
    document.getElementById("quizCount").textContent = "COMPLETE";
  } else {
    loadQuiz();
  }
});

document.getElementById("retryBtn").addEventListener("click", () => {
  quizIndex = 0;
  score = 0;
  document.getElementById("scoreCard").classList.add("hidden");
  document.getElementById("quizCard").classList.remove("hidden");
  loadQuiz();
  updateProgress();
});

document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("start").scrollIntoView({ behavior: "smooth" });
});

function updateProgress() {
  const layerDone = document.querySelector(".layer-card.active") ? 1 : 0;
  const simulationDone = capsuleItems.some(x => x.classList.contains("show")) ? 1 : 0;
  const quizDone = quizIndex >= questions.length ? 1 : 0;
  const percent = Math.min(100, Math.round(((layerDone + simulationDone + quizDone) / 3) * 100));
  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("progressText").textContent = `学習 ${percent}%`;
}

loadQuiz();
updateProgress();
