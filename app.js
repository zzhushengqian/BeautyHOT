const GROUPS = {
  global: [
    { name: "L'Oréal", rank: 1, aliases: ["欧莱雅", "L'Oréal", "Loreal"] },
    { name: "Unilever Beauty & Wellbeing", rank: 2, aliases: ["联合利华", "Unilever"] },
    { name: "Estée Lauder Companies", rank: 3, aliases: ["雅诗兰黛", "Estée Lauder", "ELC"] },
    { name: "P&G Beauty", rank: 4, aliases: ["宝洁", "P&G", "Procter & Gamble"] },
    { name: "LVMH Perfumes & Cosmetics", rank: 5, aliases: ["LVMH", "路威酩轩"] },
    { name: "Shiseido", rank: 6, aliases: ["资生堂", "Shiseido"] },
    { name: "Beiersdorf", rank: 7, aliases: ["拜尔斯道夫", "Beiersdorf"] },
    { name: "Kao", rank: 8, aliases: ["花王", "Kao"] },
    { name: "Coty", rank: 9, aliases: ["科蒂", "Coty"] },
    { name: "Natura &Co", rank: 10, aliases: ["Natura", "纳图拉"] }
  ],
  china: [
    { name: "Proya Cosmetics", rank: 1, aliases: ["珀莱雅", "Proya"] },
    { name: "Shanghai Jahwa", rank: 2, aliases: ["上海家化", "Shanghai Jahwa"] },
    { name: "Bloomage Biotech", rank: 3, aliases: ["华熙生物", "Bloomage"] },
    { name: "Giant Biogene", rank: 4, aliases: ["巨子生物", "Giant Biogene"] },
    { name: "BTN", rank: 5, aliases: ["贝泰妮", "薇诺娜", "BTN"] },
    { name: "Yatsen Holding", rank: 6, aliases: ["逸仙电商", "完美日记", "Yatsen", "Perfect Diary"] },
    { name: "Chicmax", rank: 7, aliases: ["上美股份", "韩束", "Chicmax"] },
    { name: "Mao Geping", rank: 8, aliases: ["毛戈平", "Mao Geping"] },
    { name: "S'Young Group", rank: 9, aliases: ["水羊股份", "御泥坊", "S'Young"] },
    { name: "Marubi", rank: 10, aliases: ["丸美股份", "丸美", "Marubi"] }
  ]
};

const CATEGORIES = {
  all: "全部",
  brands: "品牌",
  people: "人事",
  deals: "投融资",
  financials: "业绩",
  products: "产品研发",
  channels: "渠道",
  marketing: "营销趋势",
  regulation: "监管",
  "supply-chain": "供应链"
};

let NEWS = [
  {
    id: "basf-bota-collagen",
    title: "BASF 联合博塔生物推出 AI 驱动的重组胶原蛋白原料",
    summary: "双方正式推出 SkinNexus Collag3n，用于个人护理产品。研发结合 AI、合成生物学与规模化制造，并从超过 2,000 个胶原片段中筛选候选物。",
    why: "原料竞争正在从成分概念，转向 AI 筛选、生物制造与产业化验证的闭环。",
    category: "products",
    source: "BASF 官方",
    sourceTier: "A",
    verification: "official",
    sourceCount: 2,
    publishedAt: "2026-06-30T00:00:00+08:00",
    publishedLabel: "今天",
    url: "https://www.basf.com/global/en/media/news-releases/2026/06/p-26-120",
    companies: ["BASF", "Bota Biosciences"],
    tags: ["AI研发", "合成生物", "胶原蛋白", "原料"],
    baseScore: 71
  },
  {
    id: "perfect-diary-sephora",
    title: "完美日记进入中国约 300 家丝芙兰门店",
    summary: "完美日记进入北京、上海、广州、深圳等城市的丝芙兰门店，价格带向 100–200 元移动，并以 Biolip、Biotec 等技术平台强化功效型、高端化定位。",
    why: "国货美妆正在从线上流量品牌，转向高端线下渠道与科技功效叙事。",
    category: "channels",
    source: "Global Cosmetics News",
    sourceTier: "C",
    verification: "corroborated",
    sourceCount: 3,
    publishedAt: "2026-06-26T00:00:00+08:00",
    publishedLabel: "4 天前",
    url: "https://www.globalcosmeticsnews.com/perfect-diary-expands-into-sephora-china/",
    companies: ["Yatsen Holding", "Perfect Diary", "Sephora"],
    tags: ["国货美妆", "线下零售", "高端化"],
    baseScore: 68
  },
  {
    id: "tmall-618-ranking",
    title: "618 美妆前三名换血：修丽可登顶，珀莱雅退居第三",
    summary: "天猫美妆全周期榜单中，修丽可升至第一、雅诗兰黛第二、珀莱雅第三；珀莱雅仍是前十中唯一国货美妆品牌。",
    why: "高端功效护肤回暖，同时平台资源进一步向头部品牌集中。",
    category: "financials",
    source: "经济观察网",
    sourceTier: "B",
    verification: "corroborated",
    sourceCount: 3,
    publishedAt: "2026-06-29T00:00:00+08:00",
    publishedLabel: "昨天",
    url: "https://www.eeo.com.cn/2026/0629/935124.shtml",
    companies: ["L'Oréal", "Estée Lauder Companies", "Proya Cosmetics"],
    tags: ["618", "电商数据", "高端美妆", "国货美妆"],
    baseScore: 72
  },
  {
    id: "shiseido-liyuan",
    title: "北京丽源拟退出与资生堂持续三十余年的合资公司",
    summary: "北京丽源拟以不低于 1.995 亿元出售资生堂丽源 35% 股权；资生堂方面已确认拟议交易，但交易尚未完成。",
    why: "这可能改变欧珀莱背后的本土合资结构，也是国际集团调整中国资产配置的最新样本。",
    category: "deals",
    source: "第一财经英文网",
    sourceTier: "B",
    verification: "corroborated",
    sourceCount: 3,
    publishedAt: "2026-06-25T00:00:00+08:00",
    publishedLabel: "5 天前",
    url: "https://www.yicaiglobal.com/news/beijing-liyuan-to-exit-chinese-venture-with-japanese-cosmetics-giant-shiseido",
    companies: ["Shiseido", "北京丽源", "欧珀莱"],
    tags: ["中国市场", "股权出售", "合资公司"],
    baseScore: 75
  },
  {
    id: "maxmara-pugh",
    title: "Max Mara 任命 Florence Pugh 为首款香水全球代言人",
    summary: "Max Mara 与资生堂推进长期香水授权合作，品牌首款香水预计于 8 月 24 日推出，并由 Florence Pugh 担任全球代言人。",
    why: "资生堂正在通过授权香水扩大欧洲业务，明星营销将决定新品牌线的启动效率。",
    category: "brands",
    source: "Max Mara / Shiseido",
    sourceTier: "A",
    verification: "official",
    sourceCount: 2,
    publishedAt: "2026-06-30T00:00:00+08:00",
    publishedLabel: "今天",
    url: "https://corp.shiseido.com/en/news/detail.html?n=00000000003854",
    companies: ["Shiseido", "Max Mara"],
    tags: ["香水", "品牌授权", "明星营销"],
    baseScore: 58
  },
  {
    id: "ariana-cloud-aurora",
    title: "Ariana Grande 香水系列推出 Cloud Aurora",
    summary: "Ariana Grande 与 Luxe Brands 推出 Cloud 系列新品 Cloud Aurora，计划于 7 月 14 日上市。",
    why: "明星香水正在由一次性授权商品转向可持续扩展的系列化品牌资产。",
    category: "brands",
    source: "Luxe Brands 官方",
    sourceTier: "A",
    verification: "official",
    sourceCount: 1,
    publishedAt: "2026-06-29T00:00:00+08:00",
    publishedLabel: "昨天",
    url: "https://www.prnewswire.com/news-releases/ariana-grande-in-partnership-with-luxe-brands-launches-cloud-aurora-the-newest-addition-to-the-global-award-winning-cloud-collection-302812459.html",
    companies: ["Luxe Brands"],
    tags: ["香水", "明星品牌", "新品"],
    baseScore: 52
  },
  {
    id: "saltair-sale",
    title: "Saltair 据报探索出售，预计 2026 年销售约 1.5 亿美元",
    summary: "报道称母公司 The Center 已聘请 Raymond James 推进潜在出售，初步报价即将截止；公司代表拒绝评论。",
    why: "身体护理继续成为并购热门，但交易尚未确认，需等待正式报价或公司公告。",
    category: "deals",
    source: "TheIndustry.beauty",
    sourceTier: "C",
    verification: "reported",
    sourceCount: 2,
    publishedAt: "2026-06-29T00:00:00+08:00",
    publishedLabel: "昨天",
    url: "https://theindustry.beauty/saltair-potential-sale-beauty-brand-exit/",
    companies: ["Saltair", "The Center"],
    tags: ["待观察", "身体护理", "潜在出售"],
    baseScore: 61
  },
  {
    id: "shiseido-bonds",
    title: "资生堂据报拟发行 130 亿日元五年期无担保债券",
    summary: "行业媒体称资生堂计划通过公开发行五年期无担保债券筹资 130 亿日元，用于债务偿还与提升财务灵活性。",
    why: "在中国业务和资产结构持续调整期间，融资动作值得与集团后续战略支出一并观察。",
    category: "financials",
    source: "资生堂投资者关系",
    sourceTier: "A",
    verification: "official",
    sourceCount: 2,
    publishedAt: "2026-06-26T00:00:00+08:00",
    publishedLabel: "4 天前",
    url: "https://corp.shiseido.com/jp/ir/issue/bond.html",
    companies: ["Shiseido"],
    tags: ["债券", "集团财务", "官方披露"],
    baseScore: 59
  },
  {
    id: "iff-refinancing",
    title: "IFF 完成 10 亿美元贷款再融资，待食品原料业务出售后偿还",
    summary: "IFF 根据 6 月 23 日提交的 SEC 文件获得 10 亿美元贷款安排，用于再融资 9 月到期的 8 亿美元优先票据；公司计划在食品原料业务出售完成后偿还贷款。",
    why: "IFF 正通过资产出售和债务重组聚焦香精香料、健康与生物科学业务，直接影响全球美妆原料供应格局。",
    category: "financials",
    source: "SEC / Cosmetics Business",
    sourceTier: "A",
    verification: "official",
    sourceCount: 2,
    publishedAt: "2026-06-29T00:00:00+08:00",
    publishedLabel: "昨天",
    url: "https://cosmeticsbusiness.com/iff-secures-1-billion-loan-refinancing-this-is",
    companies: ["IFF"],
    tags: ["再融资", "香精香料", "资产出售"],
    baseScore: 74
  },
  {
    id: "saks-restructuring",
    title: "Saks Global 完成破产重组并更名，债务减少近 75%",
    summary: "Saks Global 在申请 Chapter 11 约五个月后完成重组，更名为 Exemplar Luxury Group，获得 5 亿美元新增融资，并将美国门店组合缩减至 49 家核心门店。",
    why: "Neiman Marcus、Saks Fifth Avenue 与 Bergdorf Goodman 是高端美妆的重要零售入口，重组将影响品牌账期、柜台布局和美国奢侈品分销。",
    category: "channels",
    source: "Cosmetics Business",
    sourceTier: "C",
    verification: "corroborated",
    sourceCount: 2,
    publishedAt: "2026-06-29T00:00:00+08:00",
    publishedLabel: "昨天",
    url: "https://cosmeticsbusiness.com/saks-global-emerges-from-chapter-11-bankruptcy-with-new-name",
    companies: ["Saks Global", "Neiman Marcus", "Bergdorf Goodman"],
    tags: ["破产重组", "奢侈品零售", "渠道"],
    baseScore: 76
  },
  {
    id: "iberchem-guangzhou",
    title: "Iberchem 广州新中心投产，整合香精研发与自动化生产",
    summary: "Iberchem 在广州增城启用 3 万平方米新设施，包含研发实验室、办公室、自动化生产中心和仓库，并容纳超过 170 名全职员工。",
    why: "中国已成为 Iberchem 销售第一大市场，新产能显示国际香精企业继续押注中国及亚洲的本地化研发和交付。",
    category: "supply-chain",
    source: "Iberchem / Cosmetics Business",
    sourceTier: "A",
    verification: "official",
    sourceCount: 2,
    publishedAt: "2026-06-29T00:00:00+08:00",
    publishedLabel: "昨天",
    url: "https://cosmeticsbusiness.com/iberchem-opens-new-guangzhou-centre-to-support-next",
    companies: ["Iberchem", "Croda"],
    tags: ["中国市场", "香精香料", "产能", "研发"],
    baseScore: 73
  },
  {
    id: "dphue-frankel",
    title: "Bethenny Frankel 入股 dpHUE 并出任首席品牌官",
    summary: "高端染护品牌 dpHUE 宣布 Bethenny Frankel 获得公司重要股权，并加入管理团队担任新设立的首席品牌官，参与产品创新、品牌营销和消费者教育。",
    why: "这不是普通明星代言，而是股权绑定与经营岗位结合，反映名人合作从流量采购向品牌共建升级。",
    category: "people",
    source: "dpHUE 官方",
    sourceTier: "A",
    verification: "official",
    sourceCount: 2,
    publishedAt: "2026-06-29T00:00:00+08:00",
    publishedLabel: "昨天",
    url: "https://dphue.com/blogs/news/meet-dphues-new-chief-b-officer-bethenny-frankel",
    companies: ["dpHUE"],
    tags: ["股权投资", "高管任命", "明星品牌"],
    baseScore: 66
  },
  {
    id: "unilever-thorne-rumor",
    title: "联合利华据报考虑竞购营养补充剂品牌 Thorne",
    summary: "媒体援引知情人士称，联合利华是潜在竞购方之一；卖方 L Catterton 据报寻求最高约 40 亿美元估值，联合利华拒绝置评。",
    why: "若交易推进，将强化联合利华 Beauty & Wellbeing 在美国健康美容市场的布局；目前仍属于未获官方确认的交易传闻。",
    category: "deals",
    source: "Financial Times / Cosmetics Business",
    sourceTier: "B",
    verification: "reported",
    sourceCount: 2,
    publishedAt: "2026-06-29T00:00:00+08:00",
    publishedLabel: "昨天",
    url: "https://cosmeticsbusiness.com/unilever-rumoured-to-be-exploring-a-bid-for-thorne",
    companies: ["Unilever", "Thorne", "L Catterton"],
    tags: ["待观察", "潜在收购", "营养美容"],
    baseScore: 75
  },
  {
    id: "fit-longevity-research",
    title: "FIT 调研揭示美妆‘长寿科学’信任缺口",
    summary: "FIT 2026 年研究覆盖 1,654 名美国美妆消费者：56% 认为品牌未能清楚解释衰老科学，仅 12% 认为解释非常清晰；消费者更信任可衡量功效，而非复杂科技术语。",
    why: "研究提示品牌应减少‘长寿洗白’和术语堆砌，把研发证据转化为消费者能理解、能验证的功效表达。",
    category: "marketing",
    source: "FIT / Global Cosmetic Industry",
    sourceTier: "C",
    verification: "corroborated",
    sourceCount: 2,
    publishedAt: "2026-06-29T00:00:00+08:00",
    publishedLabel: "昨天",
    url: "https://www.gcimagazine.com/brands-products/skin-care/article/22969750/the-longevity-illusion-fits-2026-think-tank-exposes-the-credibility-gap-in-beauty-innovation",
    companies: ["Fashion Institute of Technology", "Coty"],
    tags: ["消费者洞察", "长寿科学", "功效传播"],
    baseScore: 69
  }];

const state = {
  category: "all",
  query: new URLSearchParams(location.search).get("q") || "",
  sort: "score",
  useGroupWeight: true
};

const confidenceBonus = { official: 10, corroborated: 7, reported: 2 };
const confidenceLabel = { official: "官方确认", corroborated: "多源核验", reported: "媒体报道" };

function findWeightedGroup(companies) {
  const haystack = companies.join(" ").toLowerCase();
  const matches = [];
  Object.entries(GROUPS).forEach(([market, groups]) => {
    groups.forEach(group => {
      const matched = [group.name, ...group.aliases].some(name => haystack.includes(name.toLowerCase()));
      if (matched) matches.push({ ...group, market });
    });
  });
  return matches.sort((a, b) => a.rank - b.rank);
}

function calculateScore(item) {
  const evidence = confidenceBonus[item.verification] || 0;
  const sourceBonus = Math.min(item.sourceCount * 2, 6);
  let groupBonus = 0;
  const groups = findWeightedGroup(item.companies);
  if (state.useGroupWeight && groups.length) {
    groupBonus = 19 - groups[0].rank;
    if (new Set(groups.map(group => group.market)).size > 1) groupBonus += 2;
    groupBonus = Math.min(groupBonus, 18);
  }
  const publicInterest = ["regulation", "deals", "financials"].includes(item.category) ? 4 : 0;
  return Math.min(99, item.baseScore + evidence + sourceBonus + groupBonus + publicInterest);
}

function matchesQuery(item, query) {
  if (!query) return true;
  const target = [
    item.title, item.summary, item.why, item.source,
    ...item.companies, ...item.tags, CATEGORIES[item.category]
  ].join(" ").toLowerCase();
  return query.trim().toLowerCase().split(/\s+/).every(part => target.includes(part));
}

function filteredNews() {
  const filtered = NEWS.filter(item => {
    const categoryMatch = state.category === "all" || item.category === state.category;
    return categoryMatch && matchesQuery(item, state.query);
  });
  return filtered.sort((a, b) => {
    if (state.sort === "latest") return new Date(b.publishedAt) - new Date(a.publishedAt);
    if (state.sort === "confidence") {
      return (confidenceBonus[b.verification] || 0) - (confidenceBonus[a.verification] || 0)
        || calculateScore(b) - calculateScore(a);
    }
    return calculateScore(b) - calculateScore(a);
  });
}

function renderCategoryTabs() {
  const container = document.querySelector("#category-tabs");
  container.innerHTML = Object.entries(CATEGORIES).map(([key, label]) => `
    <button class="${state.category === key ? "active" : ""}" data-category="${key}">${label}</button>
  `).join("");
}

function formatPublishedDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "日期待核";
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date).replaceAll("/", ".");
}

function renderTopStories() {
  const top = [...NEWS]
    .sort((a, b) => calculateScore(b) - calculateScore(a))
    .slice(0, 3);
  document.querySelector("#top-stories").innerHTML = top.map((item, index) => `
    <a class="top-story" href="#${item.id}">
      <span class="top-rank">0${index + 1}</span>
      <div>
        <h3>${item.title}</h3>
        <p>${item.sourceCount} 个信源 · ${formatPublishedDate(item.publishedAt)}</p>
      </div>
      <span class="top-score">${calculateScore(item)}</span>
    </a>
  `).join("");
}

function renderNews() {
  const items = filteredNews();
  const list = document.querySelector("#news-list");
  const empty = document.querySelector("#empty-state");
  document.querySelector("#result-count").textContent = items.length;

  list.innerHTML = items.map(item => {
    const score = calculateScore(item);
    const groups = findWeightedGroup(item.companies);
    const primaryGroup = groups[0];
    return `
      <article class="news-card" id="${item.id}">
        <div class="score-badge" style="--score:${score}" title="综合信号分">${score}</div>
        <div class="card-meta">
          <span class="category-label">${CATEGORIES[item.category]}</span>
          <span class="meta-separator"></span>
          <span>${formatPublishedDate(item.publishedAt)}</span>
          <span class="meta-separator"></span>
          <span>${item.source}</span>
          <span class="confidence ${item.verification === "reported" ? "reported" : ""}">${confidenceLabel[item.verification]}</span>
        </div>
        <h3><a href="${item.url}" target="_blank" rel="noreferrer">${item.title}</a></h3>
        <p class="news-summary">${item.summary}</p>
        <p class="why-line"><strong>为什么重要：</strong>${item.why}</p>
        <div class="card-footer">
          <div class="tags">
            ${primaryGroup && state.useGroupWeight ? `<span class="tag group-tag">${primaryGroup.market === "global" ? "国际" : "国内"} Top ${primaryGroup.rank} 加权</span>` : ""}
            ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
          </div>
          <a class="source-link" href="${item.url}" target="_blank" rel="noreferrer">查看原始来源 ↗</a>
        </div>
      </article>
    `;
  }).join("");

  empty.hidden = items.length > 0;
  list.hidden = items.length === 0;
  renderSearchState();
}

function renderSearchState() {
  const box = document.querySelector("#search-state");
  box.hidden = !state.query;
  document.querySelector("#search-term").textContent = state.query;
  document.querySelector("#search-input").value = state.query;
}

function renderGroupDialog() {
  const render = groups => groups.map(group => `
    <li><span>${group.name}</span><b>+${19 - group.rank}</b></li>
  `).join("");
  document.querySelector("#global-groups").innerHTML = render(GROUPS.global);
  document.querySelector("#china-groups").innerHTML = render(GROUPS.china);
}

function syncQueryString() {
  const url = new URL(location.href);
  if (state.query) url.searchParams.set("q", state.query);
  else url.searchParams.delete("q");
  history.replaceState({}, "", url);
}

function applySearch(query) {
  state.query = query.trim();
  syncQueryString();
  renderNews();
  document.querySelector("#feed").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderAll() {
  renderCategoryTabs();
  renderTopStories();
  renderNews();
  renderGroupDialog();
}

document.querySelector("#search-form").addEventListener("submit", event => {
  event.preventDefault();
  applySearch(document.querySelector("#search-input").value);
});

document.querySelectorAll("[data-query]").forEach(button => {
  button.addEventListener("click", () => applySearch(button.dataset.query));
});

document.querySelector("#category-tabs").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  renderCategoryTabs();
  renderNews();
});

document.querySelector("#sort-select").addEventListener("change", event => {
  state.sort = event.target.value;
  renderNews();
});

document.querySelector("#weight-toggle").addEventListener("change", event => {
  state.useGroupWeight = event.target.checked;
  renderTopStories();
  renderNews();
});

document.querySelector("#clear-search").addEventListener("click", () => applySearch(""));
document.querySelector("#reset-filters").addEventListener("click", () => {
  state.category = "all";
  state.query = "";
  renderCategoryTabs();
  syncQueryString();
  renderNews();
});

document.querySelector("[data-view='all']").addEventListener("click", () => {
  state.category = "all";
  state.query = "";
  renderCategoryTabs();
  syncQueryString();
  renderNews();
});

const dialog = document.querySelector("#group-dialog");
document.querySelector("#show-groups").addEventListener("click", () => dialog.showModal());
document.querySelector("#close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});

renderAll();

async function loadNewsFile(path, label = "最新动态") {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`无法读取 ${path}`);
  const payload = await response.json();
  if (!Array.isArray(payload.items) || !payload.items.length) return false;
  NEWS = payload.items;
  state.category = "all";
  state.query = "";
  document.querySelector("#feed-title").textContent = label;
  renderAll();
  document.dispatchEvent(new CustomEvent("beautyhot:data-loaded"));
  return true;
}

async function loadPublishedNews() {
  try {
    await loadNewsFile("./data/latest.json", "最新动态");
  } catch {
    // Keep the bundled editorial fallback when the daily feed is unavailable.
  }
}

async function loadArchiveIndex() {
  try {
    const response = await fetch("./data/archive/index.json", { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    const select = document.querySelector("#archive-select");
    (payload.dates || []).forEach(date => {
      const option = document.createElement("option");
      option.value = date;
      option.textContent = date;
      select.appendChild(option);
    });
  } catch {
    // The latest feed remains available even when the archive index is absent.
  }
}

document.querySelector("#archive-select").addEventListener("change", async event => {
  const date = event.target.value;
  try {
    await loadNewsFile(date ? `./data/archive/${date}.json` : "./data/latest.json", date ? `${date} 归档` : "最新动态");
  } catch {
    event.target.value = "";
  }
});

document.querySelector("#archive-nav").addEventListener("click", () => {
  setTimeout(() => document.querySelector("#archive-select").focus(), 0);
});

loadPublishedNews();
loadArchiveIndex();