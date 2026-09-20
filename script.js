const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);

$("#start").addEventListener("click",()=>$("#experiment").scrollIntoView({behavior:"smooth"}));

const appText={
 web:{protocol:"HTTP / HTTPS",label:"Webの「リクエスト」を作る"},
 mail:{protocol:"SMTP / POP3",label:"メールの「本文」を送る"}
};
$$(".choice").forEach(b=>b.addEventListener("click",()=>{
  $$(".choice").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");
  const a=appText[b.dataset.app];$("#layer4").textContent=a.label;
  $(".layer[data-layer='4'] mark").textContent=a.protocol.split(" ")[0];
}));

const work={
  4:{title:"アプリケーション層",body:"「何を話すか」のルールを担当。WebならHTTP/HTTPS、メールならSMTPなどを使います。",packet:["データ","HTTPリクエスト"],button:"データを作る"},
  3:{title:"トランスポート層",body:"「どう届けるか」を担当。TCPは確実性、UDPは速さを重視します。",packet:["HTTPリクエスト","TCPヘッダ"],button:"TCPヘッダを付ける"},
  2:{title:"インターネット層",body:"「どこへ届けるか」を担当。IPアドレスを使って目的地への道筋を考えます。",packet:["TCPヘッダ","IPヘッダ"],button:"IPヘッダを付ける"},
  1:{title:"ネットワークインターフェース層",body:"「実際にどう送るか」を担当。Wi-FiやEthernetなどで電波・電気信号として送ります。",packet:["IPパケット","電波・電気信号"],button:"電波に変換する"}
};
let doneLayers=new Set();
function showLayer(n){
  const w=work[n]; const wb=$("#workbench");
  wb.innerHTML=`<div class="action-box"><div class="work-icon">🧩</div><h3>${w.title}</h3><p>${w.body}</p><div class="mini-packet">${w.packet.map(x=>`<span>${x}</span>`).join("")}</div><button class="primary" id="layerAction">${doneLayers.has(n)?"✓ 完了！":w.button}</button></div>`;
  $("#layerAction").addEventListener("click",()=>{
    doneLayers.add(n); $("#layerAction").textContent="✓ 完了！";
    wb.querySelector(".mini-packet").insertAdjacentHTML("beforeend",`<span>制御情報</span>`);
  });
}
$$(".layer").forEach(b=>b.addEventListener("click",()=>{
  $$(".layer").forEach(x=>x.classList.remove("active"));b.classList.add("active");showLayer(Number(b.dataset.layer));
}));
showLayer(4);

let capStep=0;
const caps=[
 ["Webリクエスト","アプリケーション層"],
 ["TCPヘッダ","トランスポート層"],
 ["IPヘッダ","インターネット層"],
 ["電波・電気信号","ネットワークインターフェース層"]
];
function renderCaps(){
 $("#capsule").innerHTML=caps.map((x,i)=>`<div class="cap ${i<capStep?"show":""}">${x[0]} <small>${x[1]}</small></div>`).join("");
}
renderCaps();
$("#encap").addEventListener("click",()=>{
 if(capStep<4){capStep++;renderCaps();$("#status").textContent=capStep<4?`📦 ${caps[capStep-1][0]}を追加！さらに下の層へ渡します。`:"🎉 カプセル化完了！全部の情報がそろいました。";}
 else $("#status").textContent="全部そろっています。「送信する」で実際に動かしてみよう。";
});
$("#send").addEventListener("click",()=>{
 if(capStep<4){$("#status").textContent="先に4枚の情報をそろえよう。";return}
 $("#movingPacket").classList.add("go");$("#status").textContent="🚀 送信中！パケットがネットワークを進んでいます。";
});
$("#reset").addEventListener("click",()=>{capStep=0;renderCaps();$("#movingPacket").classList.remove("go");$("#status").textContent="アプリケーションデータができました。「1枚追加する」を押してみよう。";});

function proto(type){
 const tcp=type==="tcp";$("#reliability").style.width=tcp?"92%":"48%";$("#speed").style.width=tcp?"62%":"94%";
 const d=$("#delivery");d.innerHTML=Array.from({length:6},(_,i)=>`<i class="${tcp||i!==2?"ok":""}"></i>`).join("");
 $("#protoText").innerHTML=tcp?"<b>TCP：</b>届いたか・順番は正しいかを確認し、必要なら再送します。Web閲覧など「正確さ」が大切な通信で使われます。":"<b>UDP：</b>確認を減らして速さを優先します。リアルタイム性が大切な通信などで使われます。";
}
$$(".proto").forEach(b=>b.addEventListener("click",()=>{$$(".proto").forEach(x=>x.classList.remove("active"));b.classList.add("active");proto(b.dataset.proto)}));
proto("tcp");

let route=0;
$("#routeBtn").addEventListener("click",()=>{
 const cards=$$(".route-map .device,.route-map .router");
 cards.forEach(x=>x.classList.remove("active-route"));
 if(route<cards.length-1)route++;
 cards[route].classList.add("active-route");
 $("#routeStatus").textContent=route===cards.length-1?"🎯 到着！IPアドレスを手がかりに、目的地まで進みました。":`📡 ルーターが宛先を見て、次の道へ送りました（${route}/3）。`;
});
