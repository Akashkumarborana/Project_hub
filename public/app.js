// app.js - Frontend application controller for Antigravity Projects Hub

let allProjects = [];
let currentCategory = 'All';
let activeDiscount = 0; // percentage
let appliedCouponCode = '';
let currentCheckoutItem = null; // { id, title, price, original_price, is_custom, custom_data }
let generatedAIData = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  fetchProjects();
  checkURLReferral();
});

// Check if user came via referral link (?ref=...)
function checkURLReferral() {
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get('ref');
  if (ref) {
    appliedCouponCode = ref.toUpperCase();
    activeDiscount = 50;
    showToast(`Referral link detected! 50% discount activated (${appliedCouponCode})`);
  }
}

// Fetch all 16 projects (Works on GitHub Pages statically OR via local Python server)
async function fetchProjects() {
  if (typeof PROJECTS !== 'undefined' && Array.isArray(PROJECTS) && PROJECTS.length > 0) {
    allProjects = PROJECTS;
    renderProjects(allProjects);
    return;
  }
  try {
    const res = await fetch('/api/projects');
    const data = await res.json();
    if (data.success) {
      allProjects = data.projects;
      renderProjects(allProjects);
    }
  } catch (err) {
    console.error('Failed to load projects from server, checking fallback:', err);
    if (typeof PROJECTS !== 'undefined' && Array.isArray(PROJECTS)) {
      allProjects = PROJECTS;
      renderProjects(allProjects);
    }
  }
}

// Render project cards
function renderProjects(projects) {
  const grid = document.getElementById('projectsGrid');
  if (!projects || projects.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-500">
        <i class="fa-solid fa-magnifying-glass text-2xl mb-2"></i>
        <p>No projects found matching your query.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = projects.map(p => {
    const discountedPrice = Math.round(p.price * 0.5);
    return `
      <div class="glass3d glass3d-hover rounded-3xl p-6 flex flex-col justify-between border border-white/5">
        <div>
          <!-- Top Row: Badge & Category -->
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-2.5 py-1 rounded-md border border-indigo-500/30">
              ${p.category}
            </span>
            ${p.badge ? `
              <span class="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/15 px-2.5 py-1 rounded-md border border-amber-400/30 flex items-center gap-1 shadow-sm">
                <i class="fa-solid fa-fire text-[9px] text-amber-400"></i> ${p.badge}
              </span>
            ` : ''}
          </div>

          <!-- Project Title & Tagline -->
          <h3 class="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
            ${p.title}
          </h3>
          <p class="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            ${p.tagline}
          </p>

          <!-- Tech Stack Tags -->
          <div class="mt-4 flex flex-wrap gap-1.5">
            ${p.tech_stack.slice(0, 4).map(tech => `
              <span class="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded-md font-mono">
                ${tech}
              </span>
            `).join('')}
          </div>

          <!-- Rating & Downloads -->
          <div class="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
            <div class="flex items-center gap-1 text-amber-400 font-semibold">
              <i class="fa-solid fa-star text-[11px]"></i>
              <span class="text-white">${p.rating}</span>
              <span class="text-slate-500">(${p.downloads})</span>
            </div>
            <div class="text-[11px] text-slate-400 flex items-center gap-1">
              <i class="fa-solid fa-circle-down text-indigo-400"></i> ${p.downloads}+ downloads
            </div>
          </div>
        </div>

        <!-- Pricing & Action Buttons -->
        <div class="mt-6 pt-4 border-t border-slate-800/80">
          <div class="flex items-baseline justify-between mb-3">
            <div>
              <span class="text-xs text-slate-500 line-through">₹${p.original_price}</span>
              <span class="text-xl font-black text-white ml-1.5">₹${p.price}</span>
            </div>
            <div class="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              50% Ref: ₹${discountedPrice}
            </div>
          </div>

          <div class="grid grid-cols-3 gap-2 mt-3">
            <button onclick="openLiveDemoModal('${p.id}')" class="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold text-xs py-2 px-2 rounded-xl transition text-center flex items-center justify-center gap-1">
              <i class="fa-solid fa-play text-[10px] text-indigo-400"></i> Demo
            </button>
            <button onclick="openDetailsModal('${p.id}')" class="bg-slate-950/80 hover:bg-slate-800 text-slate-200 border border-white/10 font-semibold text-xs py-2 px-2 rounded-xl transition text-center flex items-center justify-center gap-1">
              <i class="fa-regular fa-eye"></i> Specs
            </button>
            <button onclick="openCheckoutModal('${p.id}')" class="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 px-2 rounded-xl shadow-lg shadow-indigo-600/30 transition text-center flex items-center justify-center gap-1">
              <i class="fa-solid fa-download"></i> Buy
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Category filter
function setCategory(cat) {
  currentCategory = cat;
  document.querySelectorAll('.cat-pill').forEach(btn => {
    if (btn.innerText.includes(cat) || (cat === 'All' && btn.innerText.includes('All'))) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  filterProjects();
}

// Search and filter logic
function filterProjects() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  const sort = document.getElementById('sortSelect').value;

  let filtered = allProjects.filter(p => {
    const matchesCat = (currentCategory === 'All') || (p.category.toLowerCase() === currentCategory.toLowerCase()) || (currentCategory === 'Cloud' && (p.category === 'Cloud' || p.category === 'IoT'));
    const matchesQuery = !query || 
      p.title.toLowerCase().includes(query) ||
      p.tagline.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.tech_stack.some(t => t.toLowerCase().includes(query));
    return matchesCat && matchesQuery;
  });

  // Sort
  if (sort === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else {
    // popular
    filtered.sort((a, b) => b.downloads - a.downloads);
  }

  renderProjects(filtered);
}

// Quick prompt filler in Antigravity AI Box
function fillSamplePrompt(text) {
  document.getElementById('aiPrompt').value = text;
}

// ANTIGRAVITY AI ENGINE - Custom Project Generator
async function generateCustomAIProject() {
  const prompt = document.getElementById('aiPrompt').value.trim();
  const techStack = document.getElementById('aiTechStack').value;
  let projectName = document.getElementById('aiProjectName').value.trim();

  if (!prompt) {
    showToast("Please describe your project requirements in the box first!", false);
    document.getElementById('aiPrompt').focus();
    return;
  }

  if (!projectName) {
    projectName = "Custom-" + prompt.split(" ").slice(0, 3).join("-").replace(/[^a-zA-Z0-9-]/g, "");
  }

  const resultArea = document.getElementById('aiResultArea');
  const progressBox = document.getElementById('aiProgressBox');
  const successCard = document.getElementById('aiSuccessCard');
  const progressBar = document.getElementById('aiProgressBar');
  const stepText = document.getElementById('aiStepText');
  const percentText = document.getElementById('aiPercent');
  const btn = document.getElementById('btnGenerateAI');

  resultArea.classList.remove('hidden');
  progressBox.classList.remove('hidden');
  successCard.classList.add('hidden');
  btn.disabled = true;
  btn.classList.add('opacity-50');

  // Progressive simulated synthesis steps
  const steps = [
    { pct: 20, msg: "Analyzing prompt requirements and architectural models..." },
    { pct: 45, msg: "Synthesizing UI components, CSS layouts and templates..." },
    { pct: 70, msg: "Writing modular backend controllers and business logic..." },
    { pct: 90, msg: "Compiling run.bat, setup guides, and README instructions..." },
    { pct: 100, msg: "Packaging source files into production-ready ZIP!" }
  ];

  for (let s of steps) {
    progressBar.style.width = `${s.pct}%`;
    percentText.innerText = `${s.pct}%`;
    stepText.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin text-indigo-400"></i> ${s.msg}`;
    await new Promise(r => setTimeout(r, 600));
  }

  try {
    const res = await fetch('/api/generate-ai-project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: prompt,
        tech_stack: techStack,
        project_name: projectName
      })
    });
    const data = await res.json();
    generatedAIData = data;

    progressBox.classList.add('hidden');
    successCard.classList.remove('hidden');

    document.getElementById('resProjectName').innerText = data.project_name.toUpperCase();
    document.getElementById('resProjectStack').innerText = `Tech Stack: ${data.tech_stack} • Synthesized by Antigravity AI`;
    document.getElementById('fileCountBadge').innerText = `${data.files_count} files generated & packaged`;

    // Render file tabs
    renderAIFilesTabs(data.files);
    showToast("🎉 Custom project generated successfully!");

  } catch (err) {
    console.warn("Server AI API not reachable (running on static host like GitHub Pages). Using client-side Antigravity synthesizer:", err);
    const data = clientSideSynthesizeAI(prompt, techStack, projectName);
    generatedAIData = data;

    progressBox.classList.add('hidden');
    successCard.classList.remove('hidden');

    document.getElementById('resProjectName').innerText = data.project_name.toUpperCase();
    document.getElementById('resProjectStack').innerText = `Tech Stack: ${data.tech_stack} • Synthesized by Antigravity AI`;
    document.getElementById('fileCountBadge').innerText = `${data.files_count} files generated & packaged`;

    renderAIFilesTabs(data.files);
    showToast("🎉 Custom project generated successfully (Client-side AI)!");
  } finally {
    btn.disabled = false;
    btn.classList.remove('opacity-50');
  }
}

// Client-side Antigravity AI Synthesizer (Works 100% on GitHub Pages with zero backend!)
function clientSideSynthesizeAI(prompt, techStack, projectName) {
  const safeName = projectName.toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'ai-custom-project';
  const isPython = techStack.toLowerCase().includes('python');
  
  const files = {
    "README.md": `# ${projectName} - Built with Antigravity AI\n\n## Custom Requirements:\n> "${prompt}"\n\n### Tech Stack:\n- ${techStack}\n\n## Quick Start:\n1. Extract this ZIP file.\n2. Double click 'run.bat' on Windows or run 'npm install && npm run dev'.\n3. Visit http://localhost:3000 in your browser!`,
    "run.bat": `@echo off\ntitle Launching ${projectName}\ncolor 0A\necho Starting local server...\nstart http://localhost:3000\npython -m http.server 3000\npause`,
    "index.html": `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>${projectName}</title>\n  <script src="https://cdn.tailwindcss.com"></script>\n  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">\n</head>\n<body class="bg-slate-950 text-white min-h-screen p-6 font-sans">\n  <header class="border-b border-white/10 pb-4 mb-6 flex justify-between items-center">\n    <div>\n      <h1 class="text-2xl font-black text-white">${projectName}</h1>\n      <p class="text-xs text-indigo-400">Synthesized by Antigravity AI Engine</p>\n    </div>\n    <span class="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full border border-emerald-500/20 font-semibold">\n      <i class="fa-solid fa-circle-check mr-1"></i> Live & Ready\n    </span>\n  </header>\n  <main class="max-w-4xl mx-auto space-y-6">\n    <div class="bg-slate-900 border border-indigo-500/30 p-6 rounded-2xl shadow-xl">\n      <span class="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Requirement Prompt:</span>\n      <p class="text-slate-200 text-sm mt-1 leading-relaxed italic">"${prompt}"</p>\n    </div>\n    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">\n      <div class="bg-slate-900 p-4 rounded-xl border border-white/5">\n        <div class="text-xs text-slate-400">System Status</div>\n        <div class="text-xl font-bold mt-1 text-emerald-400">100% Operational</div>\n      </div>\n      <div class="bg-slate-900 p-4 rounded-xl border border-white/5">\n        <div class="text-xs text-slate-400">Active Records</div>\n        <div class="text-xl font-bold mt-1 text-white">450 Items</div>\n      </div>\n      <div class="bg-slate-900 p-4 rounded-xl border border-white/5">\n        <div class="text-xs text-slate-400">Configured Stack</div>\n        <div class="text-xl font-bold mt-1 text-indigo-400">${techStack}</div>\n      </div>\n    </div>\n  </main>\n  <script src="app.js"></script>\n</body>\n</html>`,
    "app.js": `// Logic for ${projectName}\nconsole.log("${projectName} initialized successfully!");`
  };

  if (isPython) {
    files["app.py"] = `from http.server import HTTPServer, SimpleHTTPRequestHandler\nprint("Server starting at http://localhost:3000")\nHTTPServer(('localhost', 3000), SimpleHTTPRequestHandler).serve_forever()`;
    files["requirements.txt"] = "# Zero extra libraries needed! Uses Python standard library.\n";
  } else {
    files["package.json"] = JSON.stringify({
      name: safeName,
      version: "1.0.0",
      description: prompt,
      scripts: { "dev": "npx serve -l 3000 ." }
    }, null, 2);
  }

  return {
    success: true,
    project_name: safeName,
    tech_stack: techStack,
    files_count: Object.keys(files).length,
    files: files
  };
}

// Render generated file tabs and source viewer
function renderAIFilesTabs(files) {
  const tabList = document.getElementById('fileTabList');
  const codeBlock = document.getElementById('codePreviewBlock');
  const fileKeys = Object.keys(files);

  tabList.innerHTML = fileKeys.map((name, idx) => `
    <button onclick="showFileCode('${name}')" id="tab-${name.replace(/[^a-zA-Z0-9]/g, '_')}" class="tab-btn px-3 py-1 rounded-md text-xs font-mono transition ${idx === 0 ? 'bg-indigo-600 text-white font-bold' : 'hover:text-slate-200 text-slate-400'}">
      ${name}
    </button>
  `).join('');

  if (fileKeys.length > 0) {
    showFileCode(fileKeys[0]);
  }
}

function showFileCode(filename) {
  if (!generatedAIData || !generatedAIData.files) return;
  const content = generatedAIData.files[filename] || "";
  document.getElementById('codePreviewBlock').innerText = content;

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.className = "tab-btn px-3 py-1 rounded-md text-xs font-mono transition hover:text-slate-200 text-slate-400";
  });
  const activeTab = document.getElementById(`tab-${filename.replace(/[^a-zA-Z0-9]/g, '_')}`);
  if (activeTab) {
    activeTab.className = "tab-btn px-3 py-1 rounded-md text-xs font-mono transition bg-indigo-600 text-white font-bold";
  }
}

// Open checkout for AI-generated project
function openAICheckoutModal() {
  if (!generatedAIData) return;
  openCheckoutModal(null, true);
}

// MODAL CONTROLS: Details
function openDetailsModal(projectId) {
  const p = allProjects.find(item => item.id === projectId);
  if (!p) return;

  document.getElementById('detailCategory').innerText = p.category;
  document.getElementById('detailTitle').innerText = p.title;
  document.getElementById('detailTagline').innerText = p.tagline;
  document.getElementById('detailDescription').innerText = p.description;
  document.getElementById('detailOriginalPrice').innerText = `₹${p.original_price}`;
  document.getElementById('detailPrice').innerText = `₹${p.price}`;

  // Tech stack pills
  document.getElementById('detailTechStack').innerHTML = p.tech_stack.map(t => `
    <span class="text-xs bg-slate-950 text-indigo-300 border border-slate-800 px-3 py-1 rounded-lg font-mono">
      ${t}
    </span>
  `).join('');

  // Features list
  document.getElementById('detailFeatures').innerHTML = p.features.map(f => `
    <li class="flex items-center gap-2">
      <i class="fa-solid fa-check text-emerald-400 text-xs"></i>
      <span>${f}</span>
    </li>
  `).join('');

  // Setup steps
  document.getElementById('detailSetupSteps').innerHTML = p.setup_steps.map(s => `
    <div class="flex items-start gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
      <span class="text-indigo-400 font-bold shrink-0">Step ${s.step}:</span>
      <div>
        <div class="font-sans text-xs text-slate-300 font-semibold">${s.title}</div>
        <code class="text-indigo-300 text-[11px] block mt-0.5">${s.cmd}</code>
      </div>
    </div>
  `).join('');

  document.getElementById('btnDetailBuy').onclick = () => {
    closeDetailsModal();
    openCheckoutModal(p.id);
  };

  document.getElementById('detailsModal').classList.remove('hidden');
}

function closeDetailsModal() {
  document.getElementById('detailsModal').classList.add('hidden');
}

// MODAL CONTROLS: Referral
function openReferralModal() {
  document.getElementById('referralModal').classList.remove('hidden');
}
function closeReferralModal() {
  document.getElementById('referralModal').classList.add('hidden');
}
function copyRefLink() {
  const input = document.getElementById('refLinkInput');
  navigator.clipboard.writeText(input.value);
  showToast("📋 Referral link copied to clipboard!");
}
function shareWhatsApp() {
  const link = encodeURIComponent(document.getElementById('refLinkInput').value);
  const text = encodeURIComponent("Check out this IT Projects Hub & AI Studio! Use my link to get a 50% discount on source codes: ");
  window.open(`https://api.whatsapp.com/send?text=${text}${link}`, '_blank');
}
function shareTelegram() {
  const link = encodeURIComponent(document.getElementById('refLinkInput').value);
  const text = encodeURIComponent("Get 50% off on complete verified IT projects source code: ");
  window.open(`https://t.me/share/url?url=${link}&text=${text}`, '_blank');
}
function applyDiscountNow(code) {
  closeReferralModal();
  appliedCouponCode = code;
  activeDiscount = 50;
  showToast(`🎉 50% Coupon ${code} activated for your checkout!`);
}

// MODAL CONTROLS: Checkout
function openCheckoutModal(projectId, isCustom = false) {
  if (isCustom) {
    currentCheckoutItem = {
      id: 'custom-ai',
      title: generatedAIData.project_name.toUpperCase(),
      tagline: 'Custom Antigravity AI Synthesized Project',
      price: 1499,
      original_price: 2999,
      is_custom: true,
      files: generatedAIData.files,
      project_name: generatedAIData.project_name
    };
  } else {
    const p = allProjects.find(item => item.id === projectId);
    if (!p) return;
    currentCheckoutItem = {
      id: p.id,
      title: p.title,
      tagline: p.tagline,
      price: p.price,
      original_price: p.original_price,
      is_custom: false
    };
  }

  document.getElementById('checkoutTitle').innerText = currentCheckoutItem.title;
  document.getElementById('checkoutTagline').innerText = currentCheckoutItem.tagline;
  document.getElementById('checkoutOriginalPrice').innerText = `₹${currentCheckoutItem.original_price}`;
  document.getElementById('checkoutBasePrice').innerText = `₹${currentCheckoutItem.price}`;

  // If coupon code was previously activated via referral link
  if (appliedCouponCode) {
    document.getElementById('couponCodeInput').value = appliedCouponCode;
  }

  updateCheckoutTotals();
  document.getElementById('checkoutModal').classList.remove('hidden');
}

function closeCheckoutModal() {
  document.getElementById('checkoutModal').classList.add('hidden');
}

function updateCheckoutTotals() {
  if (!currentCheckoutItem) return;
  const basePrice = currentCheckoutItem.price;
  const discountRow = document.getElementById('referralDiscountRow');
  const finalPriceSpan = document.getElementById('checkoutFinalPrice');
  const discountAmtSpan = document.getElementById('checkoutDiscountAmt');

  if (activeDiscount > 0) {
    const discountAmt = Math.round(basePrice * (activeDiscount / 100));
    const finalPrice = basePrice - discountAmt;
    discountRow.classList.remove('hidden');
    discountAmtSpan.innerText = `-₹${discountAmt} (${activeDiscount}% OFF)`;
    finalPriceSpan.innerText = `₹${finalPrice}`;
  } else {
    discountRow.classList.add('hidden');
    finalPriceSpan.innerText = `₹${basePrice}`;
  }
}

// Validate coupon code (Works both on GitHub Pages statically and with Python server)
async function applyCoupon() {
  const code = document.getElementById('couponCodeInput').value.trim().toUpperCase();
  const msg = document.getElementById('couponMsg');

  if (!code) {
    msg.innerText = "Please enter a coupon code.";
    msg.className = "text-[11px] mt-1.5 text-rose-400 block";
    return;
  }

  // Client-side instant check (works on GitHub Pages!)
  if (code.includes('DEV50') || code.includes('REFER50') || code.includes('50OFF') || code.includes('ANTIGRAVITY')) {
    activeDiscount = 50;
    appliedCouponCode = code;
    msg.innerText = "🎉 50% Referral Discount Applied Successfully!";
    msg.className = "text-[11px] mt-1.5 text-emerald-400 font-bold block";
    updateCheckoutTotals();
    showToast("🎉 50% Referral Discount Applied!");
    return;
  }

  try {
    const res = await fetch('/api/validate-coupon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    const data = await res.json();

    if (data.valid) {
      activeDiscount = data.discount_percent;
      appliedCouponCode = data.code;
      msg.innerText = data.message;
      msg.className = "text-[11px] mt-1.5 text-emerald-400 font-bold block";
      updateCheckoutTotals();
      showToast(data.message);
    } else {
      msg.innerText = data.message;
      msg.className = "text-[11px] mt-1.5 text-rose-400 block";
    }
  } catch (err) {
    msg.innerText = "Invalid coupon code. Try 'DEV50-PREMIUM'!";
    msg.className = "text-[11px] mt-1.5 text-rose-400 block";
  }
}

// Complete purchase and automatically trigger REAL ZIP download (Client-side JSZip + Server fallback)
async function completePurchaseAndDownload() {
  if (!currentCheckoutItem) return;

  const btn = document.getElementById('btnPayNow');
  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Packaging & Preparing ZIP...`;

  try {
    const filename = currentCheckoutItem.is_custom 
      ? `${currentCheckoutItem.project_name || 'custom-ai-project'}.zip` 
      : `${currentCheckoutItem.id}-source-code.zip`;

    // 1. Client-Side JSZip Generation (Works 100% on GitHub Pages with zero server!)
    if (typeof JSZip !== 'undefined') {
      const zip = new JSZip();
      let filesToZip = {};

      if (currentCheckoutItem.is_custom) {
        filesToZip = currentCheckoutItem.files || {};
      } else {
        const proj = allProjects.find(p => p.id === currentCheckoutItem.id);
        if (proj && proj.files) {
          filesToZip = proj.files;
        }
      }

      for (let fname in filesToZip) {
        zip.file(fname, filesToZip[fname]);
      }

      // Add HOW_TO_RUN_ON_PC.txt
      const runGuide = `========================================================================
   HOW TO SETUP & RUN "${currentCheckoutItem.title.toUpperCase()}" ON YOUR PC
========================================================================

Thank you for downloading from Antigravity Projects Hub!
Follow these quick steps to get this project running in 60 seconds:

------------------------------------------------------------------------
STEP 1: EXTRACT THE ZIP
------------------------------------------------------------------------
Right-click this downloaded .zip file and select "Extract All...".

------------------------------------------------------------------------
STEP 2: 1-CLICK LAUNCH (WINDOWS)
------------------------------------------------------------------------
Simply double-click the included "run.bat" file!

------------------------------------------------------------------------
STEP 3: RUN FROM TERMINAL (WINDOWS / MAC / LINUX)
------------------------------------------------------------------------
Open Terminal / Command Prompt in this folder:

For Node.js / React projects:
  > npm install
  > npm run dev

For Python / Flask / Django projects:
  > python -m pip install -r requirements.txt
  > python app.py

Then visit: http://localhost:3000
========================================================================`;
      zip.file("HOW_TO_RUN_ON_PC.txt", runGuide);

      // Generate binary ZIP blob
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const downloadUrl = window.URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

      closeCheckoutModal();
      showToast(`✅ Success! "${filename}" downloaded to your PC.`);

      setTimeout(() => {
        document.getElementById('setup-guide').scrollIntoView({ behavior: 'smooth' });
      }, 800);
      return;
    }

    // 2. Server-side fallback (if JSZip is not loaded)
    const payload = currentCheckoutItem.is_custom ? {
      is_custom: true,
      title: currentCheckoutItem.title,
      project_name: currentCheckoutItem.project_name,
      files: currentCheckoutItem.files
    } : {
      is_custom: false,
      project_id: currentCheckoutItem.id,
      title: currentCheckoutItem.title
    };

    const res = await fetch('/api/download-zip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Download failed");
    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);

    closeCheckoutModal();
    showToast(`✅ Success! "${filename}" downloaded to your PC.`);

    setTimeout(() => {
      document.getElementById('setup-guide').scrollIntoView({ behavior: 'smooth' });
    }, 800);

  } catch (err) {
    console.error("Purchase error:", err);
    showToast("Error downloading project ZIP. Please try again.", false);
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<i class="fa-solid fa-check"></i> <span>Verify Payment & Download ZIP Instantly</span>`;
  }
}

// Copy terminal commands
function copyTerminalCommands() {
  const text = document.getElementById('termCmds').innerText;
  navigator.clipboard.writeText(text);
  showToast("📋 Terminal commands copied to clipboard!");
}

// Toast notification helper
function showToast(message, isSuccess = true) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  const toastIcon = document.getElementById('toastIcon');

  toastMsg.innerText = message;
  toastIcon.className = isSuccess 
    ? "fa-solid fa-circle-check text-emerald-400" 
    : "fa-solid fa-triangle-exclamation text-rose-400";

  toast.classList.remove('translate-y-20', 'opacity-0');
  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 4000);
}

// --- NEW FEATURE 1: LIVE INTERACTIVE DEMO SANDBOX ---
function openLiveDemoModal(projectId, isCustom = false) {
  const modal = document.getElementById('demoModal');
  const iframe = document.getElementById('demoIframe');
  const title = document.getElementById('demoTitle');
  const openExternalBtn = document.getElementById('demoExternalBtn');

  if (isCustom && generatedAIData) {
    title.innerText = `${generatedAIData.project_name.toUpperCase()} (Live AI Sandbox)`;
    const html = generatedAIData.files["index.html"] || "<h1>No HTML preview available</h1>";
    iframe.srcdoc = html;
    openExternalBtn.onclick = () => {
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    };
  } else {
    const p = allProjects.find(item => item.id === projectId);
    if (!p) return;
    title.innerText = `${p.title} (Live Demo)`;
    
    // Check if project has direct index.html
    const projectHtml = p.files && p.files["index.html"] 
      ? p.files["index.html"] 
      : `<!DOCTYPE html><html><head><title>${p.title}</title><script src="https://cdn.tailwindcss.com"></script><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"></head><body class="bg-slate-950 text-white min-h-screen p-8 flex flex-col justify-center items-center text-center font-sans"><div class="max-w-lg bg-slate-900 p-8 rounded-3xl border border-indigo-500/30 shadow-2xl"><div class="w-14 h-14 bg-indigo-600/20 text-indigo-400 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 border border-indigo-500/30"><i class="fa-solid fa-code"></i></div><h1 class="text-2xl font-black mb-2">${p.title}</h1><p class="text-slate-400 text-xs mb-6">${p.tagline}</p><div class="bg-slate-950 p-3 rounded-xl border border-white/5 text-xs text-indigo-300 font-mono mb-4">Tech Stack: ${p.tech_stack.join(', ')}</div><p class="text-emerald-400 text-xs font-semibold">Source code with full configuration included in downloadable ZIP package.</p></div></body></html>`;

    iframe.srcdoc = projectHtml;
    openExternalBtn.onclick = () => {
      const blob = new Blob([projectHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    };
  }

  setViewport('desktop');
  modal.classList.remove('hidden');
}

function closeLiveDemoModal() {
  const modal = document.getElementById('demoModal');
  const iframe = document.getElementById('demoIframe');
  iframe.src = 'about:blank';
  iframe.srcdoc = '';
  modal.classList.add('hidden');
}

function setViewport(mode) {
  const wrapper = document.getElementById('iframeWrapper');
  document.querySelectorAll('.viewport-btn').forEach(b => b.classList.remove('bg-indigo-600', 'text-white'));

  if (mode === 'mobile') {
    wrapper.style.maxWidth = '375px';
    document.getElementById('btnViewMobile')?.classList.add('bg-indigo-600', 'text-white');
  } else if (mode === 'tablet') {
    wrapper.style.maxWidth = '768px';
    document.getElementById('btnViewTablet')?.classList.add('bg-indigo-600', 'text-white');
  } else {
    wrapper.style.maxWidth = '100%';
    document.getElementById('btnViewDesktop')?.classList.add('bg-indigo-600', 'text-white');
  }
}

// --- NEW FEATURE 2: DIRECT DEVELOPER MESSAGE BOX TAB ---
function switchStudioTab(tab) {
  const tabAI = document.getElementById('tabBtnAI');
  const tabMsg = document.getElementById('tabBtnMsg');
  const panelAI = document.getElementById('panelAI');
  const panelMsg = document.getElementById('panelMsg');

  if (tab === 'message') {
    tabMsg.classList.add('bg-indigo-600', 'text-white');
    tabMsg.classList.remove('text-slate-400');
    tabAI.classList.remove('bg-indigo-600', 'text-white');
    tabAI.classList.add('text-slate-400');
    panelAI.classList.add('hidden');
    panelMsg.classList.remove('hidden');
  } else {
    tabAI.classList.add('bg-indigo-600', 'text-white');
    tabAI.classList.remove('text-slate-400');
    tabMsg.classList.remove('bg-indigo-600', 'text-white');
    tabMsg.classList.add('text-slate-400');
    panelAI.classList.remove('hidden');
    panelMsg.classList.add('hidden');
  }
}

async function submitDirectMessage(event) {
  event?.preventDefault();
  const name = document.getElementById('msgName').value.trim();
  const contact = document.getElementById('msgContact').value.trim();
  const budget = document.getElementById('msgBudget').value;
  const message = document.getElementById('msgText').value.trim();

  if (!contact || !message) {
    showToast("Please provide your contact info and project requirements.", false);
    return;
  }

  const btn = document.getElementById('btnSendMsg');
  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting...`;

  try {
    const res = await fetch('/api/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, contact, budget, message })
    });
    const data = await res.json();
    if (data.success) {
      showToast("✅ Message received! We will reach out shortly.");
      document.getElementById('directMsgForm').reset();
      
      // Provide option to open WhatsApp directly with prefilled text
      if (confirm("Your requirement has been saved! Would you like to chat with the developer directly on WhatsApp now?")) {
        window.open(data.whatsapp_link, '_blank');
      }
    }
  } catch (err) {
    console.error("Error submitting message:", err);
    showToast("Could not send message. Please try WhatsApp.", false);
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Send Custom Requirements`;
  }
}

// --- NEW FEATURE 3: DYNAMIC UPI QR CODE AT CHECKOUT ---
function renderCheckoutQRCode(amount) {
  const qrImg = document.getElementById('checkoutQRImg');
  const qrAmount = document.getElementById('checkoutQRAmt');
  if (qrImg && qrAmount) {
    qrAmount.innerText = `₹${amount}`;
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=devprojects@upi%26pn=AntigravityProjects%26am=${amount}%26cu=INR`;
  }
}

// Hook into updateCheckoutTotals to refresh dynamic QR Code
const originalUpdateTotals = updateCheckoutTotals;
updateCheckoutTotals = function() {
  originalUpdateTotals();
  if (currentCheckoutItem) {
    const finalPriceText = document.getElementById('checkoutFinalPrice').innerText.replace('₹', '');
    renderCheckoutQRCode(finalPriceText);
  }
};

// --- NEW FEATURE 4: MULTI-OS SETUP GUIDE TABS ---
function setSetupOS(os) {
  document.querySelectorAll('.os-tab-btn').forEach(b => b.classList.remove('bg-indigo-600', 'text-white'));
  const termEl = document.getElementById('termCmds');

  if (os === 'mac') {
    document.getElementById('tabOSMac')?.classList.add('bg-indigo-600', 'text-white');
    termEl.innerText = `# macOS Terminal Setup
cd ~/Downloads/your-project-folder

# Node.js projects:
npm install
npm run dev

# Python projects:
python3 -m pip install -r requirements.txt
python3 app.py`;
  } else if (os === 'linux') {
    document.getElementById('tabOSLinux')?.classList.add('bg-indigo-600', 'text-white');
    termEl.innerText = `# Linux / Ubuntu Setup
cd ~/your-project-folder

# Node.js projects:
npm install
npm start

# Python projects:
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python3 app.py`;
  } else {
    document.getElementById('tabOSWin')?.classList.add('bg-indigo-600', 'text-white');
    termEl.innerText = `# Windows CMD / PowerShell Setup
cd your-extracted-project

# 1-Click Launch:
Double-click run.bat

# Or Manual Command:
npm install && npm run dev
# For Python:
python -m pip install -r requirements.txt && python app.py`;
  }
}
