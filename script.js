// ============================================
// 同義詞表（食材正規化）
// ============================================
const SYNONYMS = {
  // 番茄
  '蕃茄': '番茄',
  '西紅柿': '番茄',
  'tomato': '番茄',
  // 雞蛋
  '蛋': '雞蛋',
  '鴨蛋': '雞蛋',
  'egg': '雞蛋',
  // 豬肉
  '豬絞肉': '豬肉',
  '豬肉片': '豬肉',
  '豬里肌': '豬肉',
  '梅花肉': '豬肉',
  '五花肉': '豬肉',
  '里肌肉': '豬肉',
  // 雞肉
  '雞胸肉': '雞肉',
  '雞胸': '雞肉',
  '雞腿肉': '雞肉',
  '雞腿': '雞肉',
  '土雞': '雞肉',
  '全雞': '雞肉',
  // 牛肉
  '牛肉片': '牛肉',
  '牛腱': '牛肉',
  '牛肋條': '牛肉',
  '火鍋牛肉片': '牛肉',
  // 米飯
  '白米': '米飯',
  '飯': '米飯',
  '白飯': '米飯',
  '米': '米飯',
  '隔夜飯': '米飯',
  // 馬鈴薯
  '土豆': '馬鈴薯',
  '洋芋': '馬鈴薯',
  'potato': '馬鈴薯',
  // 紅蘿蔔
  '紅羅蔔': '紅蘿蔔',
  '胡蘿蔔': '紅蘿蔔',
  '蘿蔔': '紅蘿蔔',
  '紅蘿': '紅蘿蔔',
  // 白蘿蔔
  '菜頭': '白蘿蔔',
  // 大白菜
  '白菜': '大白菜',
  '山東白菜': '大白菜',
  // 高麗菜
  '甘藍': '高麗菜',
  '甘藍菜': '高麗菜',
  // 豆腐
  '嫩豆腐': '豆腐',
  '板豆腐': '豆腐',
  '雞蛋豆腐': '豆腐',
  // 蝦子
  '蝦': '蝦子',
  '白蝦': '蝦子',
  '草蝦': '蝦子',
  '蝦仁': '蝦子',
  // 麵條
  '麵': '麵條',
  '白麵': '麵條',
  '關廟麵': '麵條',
  '拉麵': '麵條',
  '刀削麵': '麵條',
  '油麵': '麵條',
  '細麵': '麵條',
  '陽春麵': '麵條',
  // 茄子
  '紫茄': '茄子',
  // 鮭魚
  '鮭': '鮭魚',
  '三文魚': '鮭魚',
  // 魚（通用）
  '鱸魚': '魚',
  '鯛魚': '魚',
  '吳郭魚': '魚',
  '午仔魚': '魚',
  '鯽魚': '魚',
  // 蛤蜊
  '文蛤': '蛤蜊',
  '蛤': '蛤蜊',
  // 玉米
  '玉米粒': '玉米',
  '甜玉米': '玉米',
  // 麵粉
  '中筋麵粉': '麵粉',
  '低筋麵粉': '麵粉',
  '高筋麵粉': '麵粉',
  // 吐司
  '土司': '吐司',
  '白吐司': '吐司',
  '厚片吐司': '吐司',
  // 透抽
  '中卷': '透抽',
  '小卷': '透抽',
  '花枝': '透抽',
  // 蝦皮
  '櫻花蝦': '蝦皮',
  // 菜脯
  '蘿蔔乾': '菜脯',
  // 排骨
  '小排骨': '排骨',
  '小排': '排骨',
  '豬小排': '排骨',
  // 雞翅
  '二節翅': '雞翅',
  '小雞翅': '雞翅',
  // 紫菜
  '海苔': '紫菜',
  // 蔥
  '青蔥': '蔥',
  '珠蔥': '蔥',
  // 鯖魚
  '青花魚': '鯖魚',
  // 義大利麵
  '義麵': '義大利麵',
  'pasta': '義大利麵'
};

function normalizeIngredient(ingredient) {
  if (!ingredient) return '';
  const trimmed = ingredient.trim().toLowerCase();
  return SYNONYMS[trimmed] || trimmed;
}

// ============================================
// 比對邏輯
// ============================================
function findRecipes(userIngredients, recipes) {
  const normalized = userIngredients
    .map(normalizeIngredient)
    .filter(Boolean);

  if (normalized.length === 0) return [];

  const scored = recipes.map(recipe => {
    const required = recipe.required_ingredients;
    const matched = required.filter(ing =>
      normalized.includes(normalizeIngredient(ing))
    );
    const missing = required.filter(ing =>
      !normalized.includes(normalizeIngredient(ing))
    );

    return {
      ...recipe,
      _match_count: matched.length,
      _total_required: required.length,
      _missing: missing,
      _can_make: missing.length === 0
    };
  });

  return scored
    .filter(r => r._missing.length <= 2 && r._match_count > 0)
    .sort((a, b) => {
      if (a._missing.length !== b._missing.length) {
        return a._missing.length - b._missing.length;
      }
      return a.time_minutes - b.time_minutes;
    });
}

// ============================================
// 常數
// ============================================
const QUICK_INGREDIENTS = [
  '雞蛋', '洋蔥', '紅蘿蔔', '馬鈴薯', '雞肉',
  '豬肉', '番茄', '高麗菜', '米飯'
];

const CATEGORIES = [
  '全部', '蛋料理', '蔬菜', '肉類', '海鮮', '湯品', '主食', '早餐點心'
];

// ============================================
// 狀態
// ============================================
const state = {
  allRecipes: [],
  currentCategory: '全部',
  mode: 'browse',     // 'browse' | 'match'
  matchedResults: []  // 比對模式下的結果
};

// ============================================
// DOM 工具
// ============================================
const $ = (id) => document.getElementById(id);

function parseUserIngredients() {
  const raw = $('ingredients-input').value;
  return raw
    .split(/[,，\n、]+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function isIngredientInInput(ingredient) {
  const list = parseUserIngredients().map(normalizeIngredient);
  return list.includes(normalizeIngredient(ingredient));
}

// ============================================
// 渲染：快速 chips
// ============================================
function renderQuickChips() {
  const container = $('quick-chips');
  container.innerHTML = '';

  QUICK_INGREDIENTS.forEach(ing => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip';
    btn.dataset.ingredient = ing;
    btn.textContent = ing;
    btn.addEventListener('click', () => toggleChip(ing));
    container.appendChild(btn);
  });

  updateChipStates();
}

function toggleChip(ingredient) {
  const input = $('ingredients-input');
  const items = parseUserIngredients();
  const normalized = items.map(normalizeIngredient);
  const target = normalizeIngredient(ingredient);

  if (normalized.includes(target)) {
    const filtered = items.filter(i => normalizeIngredient(i) !== target);
    input.value = filtered.join('、');
  } else {
    input.value = items.length > 0
      ? items.join('、') + '、' + ingredient
      : ingredient;
  }

  updateChipStates();
}

function updateChipStates() {
  document.querySelectorAll('.chip').forEach(btn => {
    const ing = btn.dataset.ingredient;
    if (isIngredientInInput(ing)) {
      btn.classList.add('chip-active');
    } else {
      btn.classList.remove('chip-active');
    }
  });
}

// ============================================
// 渲染：分類 tabs
// ============================================
function renderCategoryTabs() {
  const container = $('category-tabs');
  container.innerHTML = '';

  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tab';
    btn.dataset.category = cat;
    btn.textContent = cat;
    btn.addEventListener('click', () => selectCategory(cat));
    container.appendChild(btn);
  });

  updateTabStates();
}

function selectCategory(cat) {
  state.currentCategory = cat;
  updateTabStates();
  rerenderResults();
}

function updateTabStates() {
  document.querySelectorAll('.tab').forEach(btn => {
    if (btn.dataset.category === state.currentCategory) {
      btn.classList.add('tab-active');
    } else {
      btn.classList.remove('tab-active');
    }
  });
}

// ============================================
// 渲染：結果區
// ============================================
function rerenderResults() {
  const grid = $('results-grid');
  const emptyState = $('empty-state');
  const noResults = $('no-results');
  const header = $('results-header');
  const title = $('results-title');
  const subtitle = $('results-subtitle');
  const countBadge = $('recipe-count');

  grid.innerHTML = '';
  emptyState.classList.add('hidden');
  noResults.classList.add('hidden');
  header.classList.add('hidden');

  let recipes = [];

  if (state.mode === 'match') {
    recipes = state.matchedResults;
    if (state.currentCategory !== '全部') {
      recipes = recipes.filter(r => r.category === state.currentCategory);
    }

    if (recipes.length > 0) {
      header.classList.remove('hidden');
      const canMakeCount = recipes.filter(r => r._can_make).length;
      title.textContent = canMakeCount > 0
        ? '可以做這幾道喔'
        : '這幾道只差 1-2 樣食材';
      subtitle.textContent = `共 ${recipes.length} 道${state.currentCategory !== '全部' ? `（${state.currentCategory}）` : ''}`;
    } else {
      noResults.classList.remove('hidden');
      const matchedTotal = state.matchedResults.length;
      if (matchedTotal === 0) {
        $('no-results').querySelector('p').textContent = '目前內建食譜中沒有適合的';
      } else {
        $('no-results').querySelector('p').textContent = `這個分類下沒有可做的料理`;
      }
    }

    countBadge.textContent = `共 ${recipes.length} 道`;
  } else {
    recipes = state.allRecipes;
    if (state.currentCategory !== '全部') {
      recipes = recipes.filter(r => r.category === state.currentCategory);
    }

    if (state.currentCategory === '全部') {
      emptyState.classList.remove('hidden');
      countBadge.textContent = `共 ${state.allRecipes.length} 道`;
      return;
    }

    if (recipes.length > 0) {
      header.classList.remove('hidden');
      title.textContent = state.currentCategory;
      subtitle.textContent = `共 ${recipes.length} 道`;
    }
    countBadge.textContent = `共 ${recipes.length} 道`;
  }

  recipes.forEach(r => grid.appendChild(createRecipeCard(r)));
}

// ============================================
// 渲染：料理卡片
// ============================================
function createRecipeCard(recipe) {
  const card = document.createElement('article');
  card.className = 'recipe-card';
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `查看 ${recipe.name} 的作法`);

  const isMatchMode = state.mode === 'match';
  const canMake = recipe._can_make;
  const missing = recipe._missing || [];

  let statusBadge = '';
  if (isMatchMode) {
    if (canMake) {
      statusBadge = `<span class="badge badge-can-make">✓ 完全可以做</span>`;
    } else {
      statusBadge = `<span class="badge badge-missing">差 ${missing.length} 樣：${missing.join('、')}</span>`;
    }
  } else {
    statusBadge = `<span class="badge badge-category">${recipe.category}</span>`;
  }

  const difficultyStars = '★'.repeat(recipe.difficulty) + '☆'.repeat(3 - recipe.difficulty);

  card.innerHTML = `
    ${statusBadge}
    <h3 class="recipe-name">${recipe.name}</h3>
    <p class="recipe-desc">${recipe.description}</p>
    <div class="recipe-meta">
      <span>⏱ ${recipe.time_minutes} 分鐘</span>
      <span>${difficultyStars}</span>
    </div>
    <p class="recipe-ingredients">
      食材：${recipe.required_ingredients.concat(recipe.optional_ingredients.slice(0, 2)).join('、')}
    </p>
  `;

  card.addEventListener('click', () => openModal(recipe));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(recipe);
    }
  });

  return card;
}

// ============================================
// Modal
// ============================================
function openModal(recipe) {
  const modal = $('recipe-modal');
  const content = $('modal-content');

  const ingredientsHTML = recipe.ingredients_with_amount
    .map(item => `<li><span class="ing-name">${item.name}</span><span class="ing-amount">${item.amount}</span></li>`)
    .join('');

  const stepsHTML = recipe.steps
    .map((step, i) => `<li><span class="step-num">${i + 1}</span><span class="step-text">${step}</span></li>`)
    .join('');

  const tagsHTML = recipe.tags
    .map(t => `<span class="tag">#${t}</span>`)
    .join('');

  content.innerHTML = `
    <div class="modal-header">
      <span class="badge badge-category">${recipe.category}</span>
      <h2 id="modal-title" class="modal-title">${recipe.name}</h2>
      <p class="modal-desc">${recipe.description}</p>
      <div class="modal-meta">
        <span>⏱ ${recipe.time_minutes} 分鐘</span>
        <span>${'★'.repeat(recipe.difficulty)}</span>
        <span>${recipe.servings}</span>
      </div>
      <div class="modal-tags">${tagsHTML}</div>
    </div>

    <section class="modal-section">
      <h3>食材</h3>
      <ul class="ingredients-list">${ingredientsHTML}</ul>
      ${recipe.seasonings.length > 0 ? `<p class="seasonings">調味料：${recipe.seasonings.join('、')}</p>` : ''}
    </section>

    <section class="modal-section">
      <h3>作法</h3>
      <ol class="steps-list">${stepsHTML}</ol>
    </section>

    <section class="modal-tips">
      <h3>★ 小撇步</h3>
      <p>${recipe.tips}</p>
    </section>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  $('recipe-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

// ============================================
// 事件處理
// ============================================
function handleFindClick() {
  const userIngs = parseUserIngredients();

  if (userIngs.length === 0) {
    const input = $('ingredients-input');
    input.classList.add('input-shake');
    input.focus();
    setTimeout(() => input.classList.remove('input-shake'), 500);
    input.placeholder = '先告訴我你有什麼食材～';
    return;
  }

  state.mode = 'match';
  state.matchedResults = findRecipes(userIngs, state.allRecipes);
  rerenderResults();

  document.getElementById('results-section').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

function handleClearClick() {
  $('ingredients-input').value = '';
  state.mode = 'browse';
  state.matchedResults = [];
  state.currentCategory = '全部';
  updateChipStates();
  updateTabStates();
  rerenderResults();
}

function handleInputChange() {
  updateChipStates();
}

// ============================================
// 使用教學
// ============================================
const TUTORIAL_TOTAL_STEPS = 4;
const TUTORIAL_SEEN_KEY = 'fridge_tutorial_seen_v1';

let tutorialCurrentStep = 1;

function showTutorial() {
  tutorialCurrentStep = 1;
  goToTutorialStep(1);
  $('tutorial-overlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeTutorial() {
  $('tutorial-overlay').classList.add('hidden');
  document.body.style.overflow = '';
  try {
    localStorage.setItem(TUTORIAL_SEEN_KEY, '1');
  } catch (e) {
    // localStorage 不可用就算了
  }
}

function goToTutorialStep(n) {
  if (n < 1 || n > TUTORIAL_TOTAL_STEPS) return;
  tutorialCurrentStep = n;

  document.querySelectorAll('.tutorial-step').forEach(el => {
    if (parseInt(el.dataset.step) === n) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });

  document.querySelectorAll('.dot').forEach(dot => {
    if (parseInt(dot.dataset.dot) === n) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  const prevBtn = $('tutorial-prev');
  const nextBtn = $('tutorial-next');
  const skipBtn = $('tutorial-skip');

  if (n === 1) {
    prevBtn.classList.add('hidden');
  } else {
    prevBtn.classList.remove('hidden');
  }

  if (n === TUTORIAL_TOTAL_STEPS) {
    nextBtn.textContent = '開始煮飯吧 👩‍🍳';
    skipBtn.classList.add('hidden');
  } else {
    nextBtn.textContent = '下一步 →';
    skipBtn.classList.remove('hidden');
  }
}

function nextTutorialStep() {
  if (tutorialCurrentStep === TUTORIAL_TOTAL_STEPS) {
    closeTutorial();
  } else {
    goToTutorialStep(tutorialCurrentStep + 1);
  }
}

function prevTutorialStep() {
  if (tutorialCurrentStep > 1) {
    goToTutorialStep(tutorialCurrentStep - 1);
  }
}

// ============================================
// 初始化
// ============================================
async function init() {
  try {
    const res = await fetch('data/recipes.json');
    if (!res.ok) throw new Error('Failed to load recipes');
    state.allRecipes = await res.json();
  } catch (err) {
    console.error('載入食譜失敗：', err);
    $('results-grid').innerHTML = '<p class="text-center text-text-secondary py-12">載入食譜時出問題，請重新整理頁面試試</p>';
    return;
  }

  renderQuickChips();
  renderCategoryTabs();
  rerenderResults();

  $('find-btn').addEventListener('click', handleFindClick);
  $('clear-btn').addEventListener('click', handleClearClick);
  $('ingredients-input').addEventListener('input', handleInputChange);

  $('modal-backdrop').addEventListener('click', closeModal);
  $('modal-close').addEventListener('click', closeModal);
  $('modal-close-bottom').addEventListener('click', closeModal);

  // 使用教學事件
  $('show-tutorial-btn').addEventListener('click', showTutorial);
  $('tutorial-close').addEventListener('click', closeTutorial);
  $('tutorial-skip').addEventListener('click', closeTutorial);
  $('tutorial-backdrop').addEventListener('click', closeTutorial);
  $('tutorial-next').addEventListener('click', nextTutorialStep);
  $('tutorial-prev').addEventListener('click', prevTutorialStep);
  document.querySelectorAll('.dot').forEach(dot => {
    dot.addEventListener('click', () => goToTutorialStep(parseInt(dot.dataset.dot)));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!$('recipe-modal').classList.contains('hidden')) {
        closeModal();
      } else if (!$('tutorial-overlay').classList.contains('hidden')) {
        closeTutorial();
      }
    }
    if (!$('tutorial-overlay').classList.contains('hidden')) {
      if (e.key === 'ArrowRight') nextTutorialStep();
      if (e.key === 'ArrowLeft') prevTutorialStep();
    }
  });

  // 第一次造訪自動跳出教學
  let hasSeen = false;
  try {
    hasSeen = localStorage.getItem(TUTORIAL_SEEN_KEY) === '1';
  } catch (e) {
    hasSeen = false;
  }
  if (!hasSeen) {
    setTimeout(showTutorial, 300);
  }
}

document.addEventListener('DOMContentLoaded', init);
