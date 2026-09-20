(() => {
  "use strict";

  // STEP 1: Web / メール
  const appButtons = document.querySelectorAll(".choice");
  const layer4Label = document.getElementById("layer4");

  appButtons.forEach((button) => {
    button.addEventListener("click", () => {
      appButtons.forEach((b) => b.classList.remove("selected"));
      button.classList.add("selected");

      const isWeb = button.dataset.app === "web";
      layer4Label.textContent = isWeb
        ? "Webの「リクエスト」を作る"
        : "メールの「メッセージ」を作る";

      const layer4Mark = document.querySelector('.layer[data-layer="4"] mark');
      if (layer4Mark) layer4Mark.textContent = isWeb ? "HTTP" : "SMTP";

      const status = document.getElementById("status");
      if (status) {
        status.textContent = isWeb
          ? "Webページを選択しました。HTTP / HTTPSなどのルールで通信します。"
          : "メールを選択しました。SMTP / POP3などのルールで通信します。";
      }
    });
  });

  // STEP 2: 4階層の操作
  const layerInfo = {
    4: {
      title: "4. アプリケーション層",
      desc: "Webやメールなど、利用するアプリケーションに合わせたデータを作ります。",
      examples: ["Web：HTTP / HTTPS", "メール：SMTP / POP3", "名前解決：DNS"],
      action: "データを作る",
      result: "アプリケーションのデータができました！"
    },
    3: {
      title: "3. トランスポート層",
      desc: "TCPやUDPを使って、データをどのように届けるかを決めます。",
      examples: ["TCP：順番・再送を確認", "UDP：確認を減らして高速に送る"],
      action: "TCPヘッダを付ける",
      result: "TCPの制御情報を追加しました！"
    },
    2: {
      title: "2. インターネット層",
      desc: "IPアドレスを使って、宛先までデータを運ぶための情報を付けます。",
      examples: ["送信元IP", "宛先IP", "ルーティング"],
      action: "IPヘッダを付ける",
      result: "宛先IPなどの情報を追加しました！"
    },
    1: {
      title: "1. ネットワークインターフェース層",
      desc: "データを電波や電気信号にして、実際のネットワークへ送り出します。",
      examples: ["Wi-Fi：無線LAN", "Ethernet：有線LAN"],
      action: "電波に変換する",
      result: "データを電波・電気信号として送れる状態にしました！"
    }
  };

  const layers = document.querySelectorAll(".layer");
  const workbench = document.getElementById("workbench");

  function showLayer(layerNumber) {
    const info = layerInfo[layerNumber];
    if (!info || !workbench) return;

    layers.forEach((layer) => {
      layer.classList.toggle("active", layer.dataset.layer === String(layerNumber));
    });

    workbench.innerHTML = `
      <div class="work-icon">🔧</div>
      <h3>${info.title}</h3>
      <p>${info.desc}</p>
      <div class="mini-packet">
        <span>DATA</span>
        <b id="miniHeader">＋ 制御情報</b>
      </div>
      <div class="example-list">
        ${info.examples.map((item) => `<span>${item}</span>`).join("")}
      </div>
      <button class="primary work-action" id="workAction">${info.action}</button>
      <p class="work-result" id="workResult">ボタンを押して、この層の仕事を体験しよう。</p>
    `;

    const action = document.getElementById("workAction");
    const result = document.getElementById("workResult");
    const miniHeader = document.getElementById("miniHeader");

    action.addEventListener("click", () => {
      action.disabled = true;
      action.textContent = "完了 ✓";
      result.textContent = info.result;
      result.classList.add("show");
      miniHeader.textContent = layerNumber === 4 ? "＋ アプリデータ" : "＋ ヘッダ情報";
      miniHeader.classList.add("added");
    });
  }

  layers.forEach((layer) => {
    layer.addEventListener("click", () => showLayer(layer.dataset.layer));
  });

  // STEP 3: カプセル化
  const encapButton = document.getElementById("encap");
  const sendButton = document.getElementById("send");
  const resetButton = document.getElementById("reset");
  const capsule = document.getElementById("capsule");
  const movingPacket = document.getElementById("movingPacket");
  const status = document.getElementById("status");

  const capsuleSteps = [
    { label: "Webリクエスト", cls: "app" },
    { label: "TCPヘッダ", cls: "tcp" },
    { label: "IPヘッダ", cls: "ip" },
    { label: "電波・電気信号", cls: "signal" }
  ];
  let capsuleCount = 0;

  function renderCapsule() {
    if (!capsule) return;
    capsule.innerHTML = capsuleSteps
      .slice(0, capsuleCount)
      .map((step, index) => `
        <div class="capsule-item ${step.cls}" style="--delay:${index * 0.08}s">
          <span>${index + 1}</span>${step.label}
        </div>
      `)
      .join("");

    if (encapButton) {
      encapButton.disabled = capsuleCount >= capsuleSteps.length;
      encapButton.textContent =
        capsuleCount >= capsuleSteps.length ? "✓ カプセル化完了" : "📦 1枚追加する";
    }
  }

  if (encapButton) {
    encapButton.addEventListener("click", () => {
      if (capsuleCount < capsuleSteps.length) {
        capsuleCount += 1;
        renderCapsule();
        status.textContent =
          capsuleCount < capsuleSteps.length
            ? `${capsuleSteps[capsuleCount - 1].label}を追加しました。次の情報も追加してみよう。`
            : "カプセル化完了！これで送信できる形になりました。「送信する」を押してみよう。";
      }
    });
  }

  if (sendButton) {
    sendButton.addEventListener("click", () => {
      if (capsuleCount < capsuleSteps.length) {
        status.textContent = "まず「1枚追加する」で、4枚の情報をそろえよう。";
        return;
      }
      movingPacket.classList.remove("moving");
      void movingPacket.offsetWidth;
      movingPacket.classList.add("moving");
      status.textContent = "送信中……パケットがあなたの端末からサーバーへ移動しています！";
      setTimeout(() => {
        status.textContent = "到着！受信側では、追加された情報を順番に確認して元のデータを取り出します。";
      }, 1800);
    });
  }

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      capsuleCount = 0;
      renderCapsule();
      movingPacket.classList.remove("moving");
      status.textContent = "アプリケーションデータができました。「1枚追加する」を押してみよう。";
    });
  }

  // STEP 4: TCP / UDP
  const protoButtons = document.querySelectorAll(".proto");
  const reliability = document.getElementById("reliability");
  const speed = document.getElementById("speed");
  const delivery = document.getElementById("delivery");
  const protoText = document.getElementById("protoText");

  function showProtocol(proto) {
    const tcp = proto === "tcp";
    protoButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.proto === proto);
    });

    reliability.style.width = tcp ? "92%" : "45%";
    speed.style.width = tcp ? "62%" : "95%";

    delivery.innerHTML = Array.from({ length: 8 }, (_, i) =>
      `<span class="${!tcp && i === 4 ? "lost" : ""}">${i + 1}</span>`
    ).join("");

    protoText.textContent = tcp
      ? "TCPは、届いたか・順番どおりかを確認し、必要なら再送します。信頼性を重視する通信に向いています。"
      : "UDPは確認や再送を減らして、速さを重視します。多少の欠落よりリアルタイム性を優先する通信で使われます。";
  }

  protoButtons.forEach((button) => {
    button.addEventListener("click", () => showProtocol(button.dataset.proto));
  });

  // STEP 5: IPルーティング
  const routeButton = document.getElementById("routeBtn");
  const routeStatus = document.getElementById("routeStatus");
  const routeDevices = document.querySelectorAll(".route-map > div");
  let routeStep = 0;

  function updateRoute() {
    routeDevices.forEach((device, index) => {
      device.classList.toggle("route-active", index === routeStep);
      device.classList.toggle("route-done", index < routeStep);
    });

    if (routeStep === 0) {
      routeStatus.textContent = "スタート地点です。ボタンを押すとIPパケットが移動します。";
    } else if (routeStep === 1) {
      routeStatus.textContent = "① ルーターが宛先IP（203.0.113.20）を確認し、次の道を選びました。";
    } else if (routeStep === 2) {
      routeStatus.textContent = "② 2台目のルーターへ到着。宛先に近い次の道を選びます。";
    } else {
      routeStatus.textContent = "③ 目的地に到着！IPアドレスは、パケットを届けるための「宛先」を示します。";
    }

    if (routeButton) {
      routeButton.textContent =
        routeStep >= 3 ? "✓ 到着しました" : "🧭 IPパケットを進める";
      routeButton.disabled = routeStep >= 3;
    }
  }

  if (routeButton) {
    routeButton.addEventListener("click", () => {
      if (routeStep < 3) routeStep += 1;
      updateRoute();
    });
  }

  // スタートボタン
  const startButton = document.getElementById("start");
  const experiment = document.getElementById("experiment");
  if (startButton && experiment) {
    startButton.addEventListener("click", () => {
      experiment.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // 初期表示
  showLayer(4);
  renderCapsule();
  showProtocol("tcp");
  updateRoute();
})();
