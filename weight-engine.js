const PROFILE_KEY = "beautyhot-weight-profile-v2";

const DEFAULT_PROFILE = {
  dimensions: {
    impact: 10,
    magnitude: 8,
    china: 9,
    novelty: 7,
    actionability: 6
  },
  modifiers: {
    headBonus: 14,
    sourceA: 12,
    sourceB: 8,
    sourceC: 4,
    multiSource: 6,
    rumorPenalty: 12,
    softPenalty: 10,
    duplicatePenalty: 22
  },
  eventBoost: {
    regulation: 12,
    deals: 9,
    financials: 7,
    people: 6,
    products: 5,
    channels: 5,
    brands: 3,
    marketing: 4,
    "supply-chain": 6
  },
  display: {
    threshold: 70,
    maxItems: 12
  },
  hardRules: {
    excludeRumors: false,
    excludeSoft: false,
    collapseDuplicates: true
  }
};

const SIGNALS = {
  "basf-bota-collagen": { impact: 8, magnitude: 6, china: 8, novelty: 9, actionability: 8 },
  "perfect-diary-sephora": { impact: 8, magnitude: 8, china: 10, novelty: 7, actionability: 8 },
  "tmall-618-ranking": { impact: 8, magnitude: 9, china: 10, novelty: 7, actionability: 9 },
  "shiseido-liyuan": { impact: 9, magnitude: 8, china: 10, novelty: 9, actionability: 8 },
  "maxmara-pugh": { impact: 5, magnitude: 6, china: 3, novelty: 5, actionability: 4 },
  "ariana-cloud-aurora": { impact: 3, magnitude: 4, china: 2, novelty: 4, actionability: 3 },
  "saltair-sale": { impact: 7, magnitude: 8, china: 2, novelty: 8, actionability: 7 },
  "shiseido-bonds": { impact: 6, magnitude: 7, china: 6, novelty: 6, actionability: 6 },
  "iff-refinancing": { impact: 8, magnitude: 10, china: 4, novelty: 7, actionability: 8 },
  "saks-restructuring": { impact: 8, magnitude: 10, china: 3, novelty: 9, actionability: 8 },
  "iberchem-guangzhou": { impact: 7, magnitude: 8, china: 10, novelty: 6, actionability: 8 },
  "dphue-frankel": { impact: 6, magnitude: 5, china: 2, novelty: 7, actionability: 7 },
  "unilever-thorne-rumor": { impact: 8, magnitude: 10, china: 3, novelty: 8, actionability: 8 },
  "fit-longevity-research": { impact: 7, magnitude: 6, china: 4, novelty: 8, actionability: 9 }
};

const ITEM_FLAGS = {
  "ariana-cloud-aurora": { soft: true },
  "saltair-sale": { rumor: true },
  "unilever-thorne-rumor": { rumor: true }
};

const QUESTION_SECTIONS = [
  {
    title: "一、你如何判断信息本身的重要性？",
    note: "模型只负责给这些基础维度打分",
    open: true,
    fields: [
      ["dimensions", "impact", "它会改变行业格局吗？", "影响竞争、监管、技术路线或消费者行为", 0, 10],
      ["dimensions", "magnitude", "商业规模有多重要？", "交易金额、营收体量、门店数量与覆盖市场", 0, 10],
      ["dimensions", "china", "中国市场相关性有多重要？", "涉及国货、中国渠道、在华战略或本土供应链", 0, 10],
      ["dimensions", "novelty", "新鲜与反常识有多重要？", "首次发生、明显转向、打破既有行业判断", 0, 10],
      ["dimensions", "actionability", "对从业者的可行动性有多重要？", "能否影响品牌、投资、产品或渠道决策", 0, 10]
    ]
  },
  {
    title: "二、信源与实体应获得多少确定性加成？",
    note: "对应文章中的 T1 / T1.5 / T2 与实体权重",
    open: true,
    fields: [
      ["modifiers", "sourceA", "官方一手信源加多少分？", "公司官网、监管公告、交易所和正式财报", 0, 18],
      ["modifiers", "sourceB", "可靠财经媒体加多少分？", "通讯社、主流财经媒体、具名独立报道", 0, 15],
      ["modifiers", "sourceC", "垂直媒体加多少分？", "美妆行业媒体、专业媒体与二手分析", 0, 10],
      ["modifiers", "multiSource", "多信源交叉验证加多少分？", "同一事件有两个以上独立来源确认", 0, 10],
      ["modifiers", "headBonus", "头部集团最高加多少分？", "国际与国内 Top 10；按名次递减且单条封顶", 0, 20]
    ]
  },
  {
    title: "三、哪些事件类型更值得被看见？",
    note: "不同类别使用不同精选门槛和加成",
    fields: [
      ["eventBoost", "regulation", "监管、安全与处罚", "法规、抽检、召回和重大合规风险", 0, 15],
      ["eventBoost", "deals", "投融资与并购", "融资、收购、股权出售、IPO 与交易进展", 0, 15],
      ["eventBoost", "financials", "财报与经营变化", "业绩、指引、裁员、关店与经营拐点", 0, 15],
      ["eventBoost", "people", "核心人事变动", "集团 CEO、品牌负责人和关键组织调整", 0, 15],
      ["eventBoost", "products", "产品、成分与研发", "技术突破、成分创新与重要新品", 0, 15],
      ["eventBoost", "channels", "渠道与零售", "平台、门店、区域扩张和分销变化", 0, 15],
      ["eventBoost", "brands", "一般品牌与营销", "代言、活动、联名和品牌传播", 0, 15],
      ["eventBoost", "marketing", "营销与消费者趋势", "消费者研究、传播方式与购买行为变化", 0, 15],
      ["eventBoost", "supply-chain", "供应链与制造", "原料、包材、代工、产能和供应风险", 0, 15]
    ]
  },
  {
    title: "四、噪声应该受到多重惩罚？",
    note: "对应文章中的转发、软文与重复报道降分",
    fields: [
      ["modifiers", "rumorPenalty", "未获官方确认的传闻扣多少分？", "单一匿名消息、潜在交易或尚未证实的信息", 0, 25],
      ["modifiers", "softPenalty", "纯营销软文扣多少分？", "只有传播口号、缺少业务增量的品牌内容", 0, 20],
      ["modifiers", "duplicatePenalty", "重复报道扣多少分？", "同一事件无新增事实的转载或二次发布", 0, 30]
    ]
  },
  {
    title: "五、每天呈现多少内容？",
    note: "由代码按门槛筛选，不让模型决定入选",
    open: true,
    fields: [
      ["display", "threshold", "进入精选的最低分", "分数低于门槛的内容只在“全部动态”中出现", 50, 85],
      ["display", "maxItems", "每日精选最多多少条", "过线内容过多时只保留分数最高的条目", 5, 30]
    ]
  }
];

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROFILE_KEY));
    return saved ? mergeProfile(DEFAULT_PROFILE, saved) : deepClone(DEFAULT_PROFILE);
  } catch {
    return deepClone(DEFAULT_PROFILE);
  }
}

function mergeProfile(base, custom) {
  const merged = deepClone(base);
  Object.keys(merged).forEach(section => {
    if (custom?.[section] && typeof merged[section] === "object") {
      Object.assign(merged[section], custom[section]);
    }
  });
  return merged;
}

let activeProfile = loadProfile();
let draftProfile = deepClone(activeProfile);
state.view = "all";

function dimensionScore(item, profile = activeProfile) {
  const signals = item.signals || SIGNALS[item.id] || { impact: 5, magnitude: 5, china: 5, novelty: 5, actionability: 5 };
  const entries = Object.entries(profile.dimensions);
  const totalWeight = entries.reduce((sum, [, weight]) => sum + Number(weight), 0) || 1;
  const weighted = entries.reduce((sum, [key, weight]) => sum + signals[key] * Number(weight), 0);
  return (weighted / totalWeight) * 7;
}

function groupScore(item, profile = activeProfile) {
  if (!state.useGroupWeight) return 0;
  const groups = findWeightedGroup(item.companies);
  if (!groups.length) return 0;
  const top = groups[0];
  const rankFactor = (11 - top.rank) / 10;
  const crossMarket = new Set(groups.map(group => group.market)).size > 1 ? 2 : 0;
  return Math.min(Number(profile.modifiers.headBonus), Number(profile.modifiers.headBonus) * rankFactor + crossMarket);
}

function sourceScore(item, profile = activeProfile) {
  const map = { A: "sourceA", B: "sourceB", C: "sourceC", D: "sourceC" };
  return Number(profile.modifiers[map[item.sourceTier] || "sourceC"]);
}

function penaltyScore(item, profile = activeProfile) {
  const flags = item.flags || ITEM_FLAGS[item.id] || {};
  let penalty = 0;
  if (flags.rumor) penalty += Number(profile.modifiers.rumorPenalty);
  if (flags.soft) penalty += Number(profile.modifiers.softPenalty);
  if (flags.duplicate) penalty += Number(profile.modifiers.duplicatePenalty);
  return penalty;
}

calculateScore = function(item, profile = activeProfile) {
  const multi = item.sourceCount >= 2
    ? Number(profile.modifiers.multiSource) * Math.min((item.sourceCount - 1) / 2, 1)
    : 0;
  const event = Number(profile.eventBoost[item.category] || 0);
  const raw = dimensionScore(item, profile) + sourceScore(item, profile) + groupScore(item, profile) + multi + event - penaltyScore(item, profile);
  return Math.max(0, Math.min(99, Math.round(raw)));
};

function passesHardRules(item, profile = activeProfile) {
  const flags = item.flags || ITEM_FLAGS[item.id] || {};
  if (profile.hardRules.excludeRumors && flags.rumor) return false;
  if (profile.hardRules.excludeSoft && flags.soft) return false;
  if (profile.hardRules.collapseDuplicates && flags.duplicate) return false;
  return true;
}

filteredNews = function() {
  let filtered = NEWS.filter(item => {
    const categoryMatch = state.category === "all" || item.category === state.category;
    const searchMatch = matchesQuery(item, state.query);
    if (!categoryMatch || !searchMatch) return false;
    if (state.view === "selected") {
      return passesHardRules(item) && calculateScore(item) >= Number(activeProfile.display.threshold);
    }
    return true;
  });

  filtered.sort((a, b) => {
    if (state.sort === "latest") return new Date(b.publishedAt) - new Date(a.publishedAt);
    if (state.sort === "confidence") {
      return (confidenceBonus[b.verification] || 0) - (confidenceBonus[a.verification] || 0)
        || calculateScore(b) - calculateScore(a);
    }
    return calculateScore(b) - calculateScore(a);
  });

  if (state.view === "selected") filtered = filtered.slice(0, Number(activeProfile.display.maxItems));
  return filtered;
};

renderTopStories = function() {
  const eligible = NEWS
    .filter(item => passesHardRules(item))
    .sort((a, b) => calculateScore(b) - calculateScore(a))
    .slice(0, 3);
  document.querySelector("#top-stories").innerHTML = eligible.map((item, index) => `
    <a class="top-story" href="#${item.id}">
      <span class="top-rank">0${index + 1}</span>
      <div>
        <h3>${item.title}</h3>
        <p>${item.sourceCount} 个信源 · ${formatPublishedDate(item.publishedAt)}</p>
      </div>
      <span class="top-score">${calculateScore(item)}</span>
    </a>
  `).join("");
};

function injectWeightUI() {
  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = "./weights.css";
  document.head.appendChild(style);

  const selectedLink = document.querySelector(".top-nav a[href='#feed']");
  selectedLink.dataset.view = "selected";

  const questionnaireNav = document.createElement("a");
  questionnaireNav.href = "#";
  questionnaireNav.id = "open-questionnaire-nav";
  questionnaireNav.textContent = "权重问卷";
  document.querySelector(".top-nav").appendChild(questionnaireNav);

  const button = document.createElement("button");
  button.className = "calibrate-button";
  button.id = "open-questionnaire";
  button.textContent = "校准我的信息权重";
  document.querySelector(".weighting-card").appendChild(button);

  const summary = document.createElement("p");
  summary.className = "profile-summary";
  summary.id = "profile-summary";
  document.querySelector(".weighting-card > p").after(summary);

  const dialog = document.createElement("dialog");
  dialog.id = "weight-dialog";
  dialog.className = "weight-dialog";
  dialog.innerHTML = `
    <div class="dialog-header">
      <div>
        <p class="eyebrow dark">EDITORIAL CALIBRATION</p>
        <h2>什么新闻值得你看到？</h2>
      </div>
      <button id="close-weight-dialog" aria-label="关闭">×</button>
    </div>
    <p class="dialog-note">参考 AIHOT 的处理方式：模型只评估基础维度，信源、公司、事件类型、惩罚项和精选门槛由公式计算。拖动权重，右侧排名会实时变化。</p>
    <div class="weight-dialog-grid">
      <form id="weight-form"><div id="questionnaire-sections"></div></form>
      <aside class="ranking-preview">
        <div class="preview-heading"><span>实时排名预览</span><small>你的当前偏好</small></div>
        <ol id="ranking-preview"></ol>
        <div class="preview-logic"><strong>当前公式</strong><p>五维加权分 + 信源 + 头部集团 + 事件类型 + 多源核验 − 风险惩罚</p></div>
      </aside>
    </div>
    <div class="dialog-actions">
      <button class="secondary-button" id="reset-weights" type="button">恢复建议值</button>
      <button class="primary-button" id="apply-weights" type="button">保存并应用到首页</button>
    </div>
  `;
  document.body.appendChild(dialog);
}

function fieldHTML(field) {
  const [section, key, label, description, min, max] = field;
  const value = draftProfile[section][key];
  return `
    <label class="question-row">
      <span class="question-copy"><strong>${label}</strong><span>${description}</span></span>
      <input type="range" min="${min}" max="${max}" step="1" value="${value}" data-section="${section}" data-key="${key}">
      <output class="question-value">${value}</output>
    </label>
  `;
}

function renderQuestionnaire() {
  const sections = QUESTION_SECTIONS.map(section => `
    <details class="question-section" ${section.open ? "open" : ""}>
      <summary><span>${section.title}</span><small>${section.note}</small></summary>
      <div class="question-list">${section.fields.map(fieldHTML).join("")}</div>
    </details>
  `).join("");

  const hardRules = `
    <details class="question-section">
      <summary><span>六、哪些内容直接不进入精选？</span><small>确定性的硬规则</small></summary>
      <div class="question-list">
        <label class="hard-rule"><span><strong>排除未经确认的传闻</strong><span>仍保留在“全部动态”，但不进入精选</span></span><input type="checkbox" data-hard-key="excludeRumors" ${draftProfile.hardRules.excludeRumors ? "checked" : ""}></label>
        <label class="hard-rule"><span><strong>排除纯营销软文</strong><span>缺少业务或行业信息增量时直接过滤</span></span><input type="checkbox" data-hard-key="excludeSoft" ${draftProfile.hardRules.excludeSoft ? "checked" : ""}></label>
        <label class="hard-rule"><span><strong>同一事件只保留一个主条目</strong><span>官方官网优先于官方社媒，官方社媒优先于媒体</span></span><input type="checkbox" data-hard-key="collapseDuplicates" ${draftProfile.hardRules.collapseDuplicates ? "checked" : ""}></label>
      </div>
    </details>
  `;
  document.querySelector("#questionnaire-sections").innerHTML = sections + hardRules;
  renderRankingPreview();
}

function renderRankingPreview() {
  const ranked = [...NEWS]
    .sort((a, b) => calculateScore(b, draftProfile) - calculateScore(a, draftProfile))
    .slice(0, 8);
  document.querySelector("#ranking-preview").innerHTML = ranked.map(item => {
    const score = calculateScore(item, draftProfile);
    const excluded = !passesHardRules(item, draftProfile) || score < Number(draftProfile.display.threshold);
    return `<li class="${excluded ? "is-out" : ""}"><span>${item.title}</span><b>${score}</b></li>`;
  }).join("");
}

function updateProfileSummary() {
  document.querySelector("#profile-summary").textContent =
    `当前门槛 ${activeProfile.display.threshold} 分 · 每日最多 ${activeProfile.display.maxItems} 条 · 头部集团最高 +${activeProfile.modifiers.headBonus}`;
}

function updateNavState() {
  document.querySelectorAll("[data-view]").forEach(link => {
    link.classList.toggle("active", link.dataset.view === state.view);
  });
}

injectWeightUI();
renderQuestionnaire();
updateProfileSummary();
renderAll();
updateNavState();

document.querySelector("#weight-form").addEventListener("input", event => {
  const input = event.target;
  if (input.matches("input[type='range']")) {
    draftProfile[input.dataset.section][input.dataset.key] = Number(input.value);
    input.nextElementSibling.value = input.value;
  }
  if (input.matches("[data-hard-key]")) {
    draftProfile.hardRules[input.dataset.hardKey] = input.checked;
  }
  renderRankingPreview();
});

function openWeightDialog(event) {
  event?.preventDefault();
  draftProfile = deepClone(activeProfile);
  renderQuestionnaire();
  document.querySelector("#weight-dialog").showModal();
}

document.querySelector("#open-questionnaire").addEventListener("click", openWeightDialog);
document.querySelector("#open-questionnaire-nav").addEventListener("click", openWeightDialog);
document.querySelector("#close-weight-dialog").addEventListener("click", () => document.querySelector("#weight-dialog").close());
document.querySelector("#weight-dialog").addEventListener("click", event => {
  if (event.target.id === "weight-dialog") event.target.close();
});

document.querySelector("#reset-weights").addEventListener("click", () => {
  draftProfile = deepClone(DEFAULT_PROFILE);
  renderQuestionnaire();
});

document.querySelector("#apply-weights").addEventListener("click", () => {
  activeProfile = deepClone(draftProfile);
  localStorage.setItem(PROFILE_KEY, JSON.stringify(activeProfile));
  state.view = "selected";
  renderAll();
  updateNavState();
  updateProfileSummary();
  document.querySelector("#weight-dialog").close();
});

document.querySelector("[data-view='selected']").addEventListener("click", event => {
  event.preventDefault();
  state.view = "selected";
  renderNews();
  renderTopStories();
  updateNavState();
  document.querySelector("#feed").scrollIntoView({ behavior: "smooth" });
});

document.querySelector("[data-view='all']").addEventListener("click", () => {
  state.view = "all";
  setTimeout(() => {
    renderNews();
    updateNavState();
  }, 0);
});


document.addEventListener("beautyhot:data-loaded", () => {
  renderAll();
  renderRankingPreview();
  updateProfileSummary();
});
