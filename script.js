let cashChartInstance;
let assetChartInstance;

document.getElementById("fp-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const age = parseInt(document.getElementById("age").value);
  const income = parseInt(document.getElementById("income").value);
  const monthlyLiving = parseInt(document.getElementById("monthlyLiving").value);
  const eventExpense = parseInt(document.getElementById("eventExpense").value);
  const assets = parseInt(document.getElementById("assets").value);
  const retirementAge = parseInt(document.getElementById("retirementAge").value);
  const retirementBonus = parseInt(document.getElementById("retirementBonus").value);
  const pensionStartAge = parseInt(document.getElementById("pensionStartAge").value);
  const pensionAmount = parseInt(document.getElementById("pensionAmount").value);

  const labels = [];
  const cashflowData = [];
  const assetData = [];
  let currentAssets = assets;

  for (let i = age; i <= 80; i++) {
    labels.push(`${i}歳`);

    // 収入計算
    let yearlyIncome = 0;
    if (i < retirementAge) {
      yearlyIncome = income;
    } else if (i === retirementAge) {
      yearlyIncome = retirementBonus;
    } else if (i >= pensionStartAge) {
      yearlyIncome = pensionAmount;
    }

    // 支出計算
    const yearlyExpense = monthlyLiving * 12 + eventExpense;

    const cashflow = yearlyIncome - yearlyExpense;
    cashflowData.push(cashflow);

    currentAssets += cashflow;
    assetData.push(currentAssets);
  }

  // グラフ更新（前回の破棄）
  if (cashChartInstance) cashChartInstance.destroy();
  if (assetChartInstance) assetChartInstance.destroy();

  // キャッシュフローグラフ
  const cashCtx = document.getElementById("cashflowChart").getContext("2d");
  cashChartInstance = new Chart(cashCtx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "年間キャッシュフロー（万円）",
        data: cashflowData,
        borderColor: "#0078D4",
        backgroundColor: "rgba(0,120,212,0.2)",
        fill: true
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "年齢" }},
        y: { title: { display: true, text: "万円" }}
      }
    }
  });

  // 資産残高グラフ
  const assetCtx = document.getElementById("assetChart").getContext("2d");
  assetChartInstance = new Chart(assetCtx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "資産残高（万円）",
        data: assetData,
        borderColor: "#28a745",
        backgroundColor: "rgba(40,167,69,0.2)",
        fill: true
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "年齢" }},
        y: { title: { display: true, text: "万円" }}
      }
    }
  });

  // コメント診断
  const commentDiv = document.getElementById("summaryComment");
  const finalAssets = assetData[assetData.length - 1];

  let comment = "";
  if (finalAssets <= 0) {
    comment = "⚠️ このままでは資産が80歳以前に尽きる可能性があります。生活費・イベント支出の見直しが必要です。";
  } else if (finalAssets < assets) {
    comment = "🟡 資産が徐々に減少しています。イベント支出の抑制や退職後の生活設計を考える時期かもしれません。";
  } else {
    comment = "✅ 資産は安定的に維持・増加しており、現状の生活スタイルでも持続可能な見通しです。";
  }

  comment += "\n※この診断は簡易版です。退職後の生活設計や資産形成の精査は、FP面談にて個別に行うことができます。";

  commentDiv.textContent = comment;
});