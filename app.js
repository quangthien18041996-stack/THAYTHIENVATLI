/**
 * ============================================================================
 * VẬT LÍ 12 - SÁCH NỔI 3D POP-UP BOOK (FULL 3D SCENE)
 * 
 * BÌNH THƯỜNG CÁC MÔ HÌNH NẰM GẬP TRONG TRANG SÁCH,
 * KHI CHẠM / CLICK VÀO TRANG SÁCH THÌ MỚI NỔI LÊN (POP-UP)!
 * 
 * CHỮ TRONG SÁCH ĐƯỢC IN ĐẬM VÀ TĂNG TƯƠNG PHẢN CỰC KỲ DỄ ĐỌC.
 * 
 * Version: 5.2 (High-Contrast Bold Text & Interactive Phase Triangle 3D)
 * ============================================================================
 */

// ============================================================================
// 1. DATA: NHÀ BÁC HỌC ẢO & CƠ CHẾ CHUYỂN THỂ
// ============================================================================
const scientistsData = {
  brown: {
    id: "brown",
    name: "Robert Brown",
    role: "Nhà thực vật học Hoàng gia Scotland (1773 – 1858)",
    avatar: "assets/scientists/robert_brown_holo.png",
    dialogue: "Xin chào! Năm 1827, khi quan sát hạt phấn hoa lơ lửng trong nước qua kính hiển vi quang học, tôi nhận thấy chúng liên tục đổi hướng và chuyển động hỗn loạn không ngừng. Đó không phải vì chúng còn sống, mà là do hàng triệu phân tử nước xung quanh đang chuyển động nhiệt hỗn loạn và va đập không cân bằng vào chúng từ mọi phía!"
  },
  einstein: {
    id: "einstein",
    name: "Albert Einstein",
    role: "Nhà vật lý lý thuyết vĩ đại – Giải Nobel Vật lí 1921",
    avatar: "assets/scientists/albert_einstein_holo.png",
    dialogue: "Năm 1905, tôi đã dùng toán học để chứng minh thực nghiệm của ngài Brown, qua đó khẳng định chắc chắn rằng nguyên tử, phân tử thực sự tồn tại!"
  }
};

const phaseDescriptions = {
  'hoa-hoi': {
    title: 'Sự Hoá Hơi (Bay Hơi & Sôi)',
    icon: '💨',
    desc: 'Quá trình chuyển từ thể lỏng sang thể khí. Bay hơi xảy ra ở mọi nhiệt độ trên mặt thoáng. Sôi xảy ra tại nhiệt độ sôi (100°C với nước ở áp suất chuẩn) đồng thời cả trong lòng và trên mặt thoáng.'
  },
  'hoa-long': {
    title: 'Sự Hoá Lỏng (Ngưng Tụ)',
    icon: '💧',
    desc: 'Quá trình chất khí toả nhiệt, giảm tốc độ chuyển động nhiệt, các phân tử xích lại gần nhau dưới tác dụng của lực liên kết để trở thành chất lỏng.'
  },
  'nong-chay': {
    title: 'Sự Nóng Chảy',
    icon: '🔥',
    desc: 'Chất rắn nhận nhiệt lượng, các nút mạng tinh thể dao động nhiệt mạnh dần đến nhiệt độ nóng chảy thì phá vỡ liên kết mạng để chuyển sang thể lỏng linh động.'
  },
  'dong-dac': {
    title: 'Sự Đông Đặc',
    icon: '🧊',
    desc: 'Chất lỏng toả nhiệt, động năng phân tử giảm dần và các phân tử bị khoá chặt vào vị trí cân bằng cố định của mạng tinh thể thể rắn.'
  },
  'thang-hoa': {
    title: 'Sự Thăng Hoa',
    icon: '✨',
    desc: 'Hiện tượng chất rắn chuyển thẳng sang thể khí mà không qua thể lỏng (ví dụ: băng khô CO₂, băng tuyết ở áp suất thấp).'
  },
  'ngung-ket': {
    title: 'Sự Ngưng Kết',
    icon: '❄️',
    desc: 'Hiện tượng chất khí chuyển trực tiếp thành thể rắn khi bị làm lạnh đột ngột (ví dụ: sương muối hình thành trong đêm đông giá rét).'
  }
};

let currentScientist = 'brown';
let isAudioEnabled = true;
let synth = window.speechSynthesis;
let currentUtterance = null;
let availableVoices = [];

function loadVoices() {
  if ('speechSynthesis' in window) {
    availableVoices = synth.getVoices();
  }
}
loadVoices();
if ('speechSynthesis' in window && synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = loadVoices;
}

// Web Audio API Synthesizer Chimes
let audioCtx = null;
function playSound(type = 'chime') {
  if (!isAudioEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    if (type === 'page') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(360, t + 0.18);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    } else if (type === 'pop') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(360, t);
      osc.frequency.exponentialRampToValueAtTime(840, t + 0.14);
      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, t);
      osc.frequency.exponentialRampToValueAtTime(1046.5, t + 0.22);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.4);
    }
  } catch (e) {
    console.warn("Audio Context note:", e);
  }
}

// ============================================================================
// 2. MAIN THREE.JS 3D WORLD SETUP
// ============================================================================
let scene, camera, renderer, controls;
const container = document.getElementById('webgl-container');

// Textures cache
const textureLoader = new THREE.TextureLoader();
const pageTextures = {
  cover: textureLoader.load('assets/pages/page_cover.jpg'),
  page6: textureLoader.load('assets/pages/page_6.jpg'),
  page7: textureLoader.load('assets/pages/page_7.jpg'),
  page8: textureLoader.load('assets/pages/page_8.jpg'),
  page9: textureLoader.load('assets/pages/page_9.jpg'),
  robertBrown: textureLoader.load('assets/scientists/robert_brown_holo.png'),
  albertEinstein: textureLoader.load('assets/scientists/albert_einstein_holo.png')
};

// Book structure meshes
let bookRigGroup;
let leftPageMesh, rightPageMesh, bookBaseMesh, frontCoverMesh;
let currentSpread = 1;

// 3D Pop-up Groups
let brownModuleGroup, hologramGroupBrown, hologramGroupEinstein;
let module2Group, triangleModuleGroup, module3Group, naclGroup, plasmaGroup, meltingGraphGroup;
let meltingGraphPivotGroup;
let isMeltingGraphPopped = false;
let hotspotMeltingGraph;
let meltingGraphCursor, meltingGraphCursorLight;
let meltingGraphTimelineProgress = 0.0;
let isMeltingGraphPlaying = true;
let meltingStatusCanvas, meltingStatusTexture, meltingStatusMesh, lastMeltingStage = -1;
let meltingBillboardBadges = [];
let meltingSampleMolecules = [];
let meltingSampleBonds = [];
let meltingPulseRings = [];
let meltingP0, meltingP1, meltingP2, meltingP3;
let meltingChamberGroup;

// States of Pop-up (Bình thường nằm gập = false)
let isBrownPopped = false;
let isBrownHoloPopped = false;
let isStatesPopped = false;
let isTrianglePopped = false;
let isMeltingPopped = false;
let isNaclPopped = false;
let isPlasmaPopped = false;

// Hotspot Badges lying flat on paper
let hotspotBrown, hotspotHoloBrown, hotspotStates, hotspotTriangle, hotspotMelting, hotspotNacl, hotspotPlasma;
const clickableHotspots = [];
const clickablePhaseArrows = [];

// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function init3DWorld() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0c16);
  scene.fog = new THREE.FogExp2(0x0a0c16, 0.012);

  const w = window.innerWidth;
  const h = window.innerHeight;

  camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
  camera.position.set(0, 24, 25);

  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);

  // Set maximum anisotropy so text in book is razor-sharp at any angle!
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  Object.values(pageTextures).forEach(tex => {
    tex.anisotropy = maxAniso;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;
    tex.needsUpdate = true;
  });

  // OrbitControls with limits
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.target.set(0, 1.2, 0);
  controls.minDistance = 2.0;
  controls.maxDistance = 55;
  controls.maxPolarAngle = Math.PI / 2.35; // Limit extreme grazing angle to keep edge models clearly visible
  controls.minAzimuthAngle = -Math.PI / 2.2;
  controls.maxAzimuthAngle = Math.PI / 2.2;

  setupLighting();
  createStudyDeskEnvironment();
  // createClassicalMicroscope(); // REMOVED: Replaced by realistic 3D PBR microscope in scientist station
  create3DPhysicalBook();

  // Create Pop-up Modules (Initially folded flat inside the book)
  createModule1BrownMotion();
  createHologramRobertBrown();
  createModule2StatesOfMatter();
  createModuleTriangleTransition();
  createModule3MeltingAndBoiling();
  createModule4NaclCrystal();
  createModule5Plasma();
  createModule6MeltingGraph();

  // Create Interactive 3D Hotspot Badges on the pages
  createPaperHotspotBadges();

  // Window resize & Raycast events
  window.addEventListener('resize', onWindowResize);
  renderer.domElement.addEventListener('pointerdown', onDocumentPointerDown);
  renderer.domElement.addEventListener('dblclick', onDocumentDoubleClick);
  renderer.domElement.addEventListener('pointermove', onDocumentPointerMove);

  // Initialize view to Spread 1 (Pages 6 & 7)
  setSpread(1, false);

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('spread') === '2') {
    setSpread(2, false);
    if (urlParams.get('pop') === 'nacl') {
      setTimeout(() => {
        toggleModule4Popup();
        if (controls) {
          controls.target.set(-2.06, 1.4, 4.95);
          camera.position.set(-2.06, 5.2, 8.8);
          controls.update();
        }
      }, 400);
    } else if (urlParams.get('pop') === 'plasma') {
      setTimeout(() => {
        togglePlasmaPopup();
        if (controls) {
          controls.target.set(7.66, 1.4, 3.50);
          camera.position.set(7.66, 5.5, 7.8);
          controls.update();
        }
      }, 400);
    } else if (urlParams.get('pop') === 'meltinggraph') {
      setTimeout(() => {
        toggleMeltingGraphPopup();
        if (controls) {
          controls.target.set(7.36, 1.35, -3.64);
          camera.position.set(7.36, 5.8, 1.4);
          controls.update();
        }
      }, 400);
    }
  } else if (urlParams.get('pop') === 'triangle') {
    setTimeout(() => {
      toggleTrianglePopup();
      if (controls) {
        controls.target.set(7.6, 1.3, 4.8);
        camera.position.set(7.6, 6.2, 9.2);
        controls.update();
      }
    }, 400);
  }

  animate();
}

// Lighting setup
function setupLighting() {
  const ambLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambLight);

  // Desk lamp spotlight
  const deskLamp = new THREE.SpotLight(0xfff1dc, 2.4, 75, Math.PI / 3.2, 0.35, 1.2);
  deskLamp.position.set(12, 30, 15);
  deskLamp.target.position.set(0, 1, 0);
  deskLamp.castShadow = true;
  deskLamp.shadow.mapSize.width = 2048;
  deskLamp.shadow.mapSize.height = 2048;
  scene.add(deskLamp);
  scene.add(deskLamp.target);

  // Soft cyan fill light
  const windowFill = new THREE.DirectionalLight(0x40c4ff, 0.65);
  windowFill.position.set(-20, 20, -15);
  scene.add(windowFill);
}

// ============================================================================
// 3. STUDY DESK ENVIRONMENT & ANTIQUE MICROSCOPE
// ============================================================================
let tableMesh;
function createStudyDeskEnvironment() {
  const deskGeom = new THREE.BoxGeometry(64, 2, 44);
  const deskMat = new THREE.MeshStandardMaterial({
    color: 0x221812,
    roughness: 0.45,
    metalness: 0.1
  });
  tableMesh = new THREE.Mesh(deskGeom, deskMat);
  tableMesh.position.set(0, -1, 0);
  tableMesh.receiveShadow = true;
  scene.add(tableMesh);


}

// 3D Classic Antique Microscope (Deprecated, now using high-fidelity 3D model)
let microscopeGroup = null;
function createClassicalMicroscope() {
  // Obsolete - real 3D microscope is attached to Robert Brown's station
}

// ============================================================================
// 4. THE 3D PHYSICAL BOOK RIG (DIMENSIONS: 19cm x 26.5cm)
// ============================================================================
const PAGE_W = 11.2;
const PAGE_H = 15.6;

function create3DPhysicalBook() {
  bookRigGroup = new THREE.Group();
  bookRigGroup.position.set(0, 0, 0);

  // 1. Hardcover Base
  const coverBaseGeom = new THREE.BoxGeometry(PAGE_W * 2 + 0.6, 0.35, PAGE_H + 0.5);
  const coverBaseMat = new THREE.MeshStandardMaterial({ color: 0x1a2138, roughness: 0.4, metalness: 0.1 });
  bookBaseMesh = new THREE.Mesh(coverBaseGeom, coverBaseMat);
  bookBaseMesh.position.set(0, 0.18, 0);
  bookBaseMesh.receiveShadow = true;
  bookBaseMesh.castShadow = true;
  bookRigGroup.add(bookBaseMesh);

  // 2. Slim Vertical Spine running down the crease along the Z-axis
  const spineGeom = new THREE.CylinderGeometry(0.12, 0.12, PAGE_H + 0.2, 16);
  const spineMat = new THREE.MeshStandardMaterial({ color: 0x0d1326, roughness: 0.5 });
  const spineMesh = new THREE.Mesh(spineGeom, spineMat);
  spineMesh.position.set(0, 0.37, 0);
  spineMesh.rotation.x = Math.PI / 2; // Aligned cleanly with Z axis
  bookRigGroup.add(spineMesh);

  // 3. Left Page Surface (Trang Trái: Trang 6 / Trang 8)
  const leftPageGeom = new THREE.PlaneGeometry(PAGE_W, PAGE_H, 2, 2);
  const leftPageMat = new THREE.MeshStandardMaterial({ map: pageTextures.page6, roughness: 0.6, metalness: 0.05 });
  leftPageMesh = new THREE.Mesh(leftPageGeom, leftPageMat);
  leftPageMesh.position.set(-PAGE_W / 2 - 0.06, 0.38, 0);
  leftPageMesh.rotation.x = -Math.PI / 2;
  leftPageMesh.receiveShadow = true;
  leftPageMesh.userData = { isPage: true, side: 'left' };
  bookRigGroup.add(leftPageMesh);

  // 4. Right Page Surface (Trang Phải: Trang 7 / Trang 9)
  const rightPageGeom = new THREE.PlaneGeometry(PAGE_W, PAGE_H, 2, 2);
  const rightPageMat = new THREE.MeshStandardMaterial({ map: pageTextures.page7, roughness: 0.6, metalness: 0.05 });
  rightPageMesh = new THREE.Mesh(rightPageGeom, rightPageMat);
  rightPageMesh.position.set(PAGE_W / 2 + 0.06, 0.38, 0);
  rightPageMesh.rotation.x = -Math.PI / 2;
  rightPageMesh.receiveShadow = true;
  rightPageMesh.userData = { isPage: true, side: 'right' };
  bookRigGroup.add(rightPageMesh);

  // 5. Front Cover Leaf (Bìa gập khi đóng sách)
  const frontCoverGeom = new THREE.PlaneGeometry(PAGE_W, PAGE_H);
  const frontCoverMat = new THREE.MeshStandardMaterial({ map: pageTextures.cover, roughness: 0.4, side: THREE.DoubleSide });
  frontCoverMesh = new THREE.Mesh(frontCoverGeom, frontCoverMat);
  frontCoverMesh.position.set(PAGE_W / 2 + 0.06, 0.42, 0);
  frontCoverMesh.rotation.x = -Math.PI / 2;
  frontCoverMesh.visible = false;
  bookRigGroup.add(frontCoverMesh);

  scene.add(bookRigGroup);
}


// ============================================================================
// 5. CREATING INTERACTIVE 3D HOTSPOT BADGES (NẰM PHẲNG TRÊN TRANG SÁCH)
// ============================================================================
function createBadgeCanvas(text, icon, colorHex = '#00e5ff', customWidth = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = customWidth;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Pill rounded background
  ctx.fillStyle = 'rgba(8, 14, 28, 0.92)';
  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(10, 10, customWidth - 20, 108, 54);
  ctx.fill();
  ctx.stroke();

  // Glowing pulse border
  ctx.shadowColor = colorHex;
  ctx.shadowBlur = 18;

  // Icon & Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${icon} ${text}`, customWidth / 2, 64);

  return new THREE.CanvasTexture(canvas);
}

function createMarginTabCanvas(text, icon, colorHex = '#00e5ff') {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 140;
  const ctx = canvas.getContext('2d');

  // Pill rounded tab background
  ctx.fillStyle = 'rgba(8, 14, 28, 0.94)';
  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(8, 8, canvas.width - 16, canvas.height - 16, 40);
  ctx.fill();
  ctx.stroke();

  // Glowing pulse border
  ctx.shadowColor = colorHex;
  ctx.shadowBlur = 16;

  // Icon & Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px Nunito, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${icon} ${text}`, canvas.width / 2, canvas.height / 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createPaperHotspotBadges() {
  // Sleek 3D Pop-Up Margin Tabs placed strictly on the outer margins of the book!
  // NEVER COVERS ANY TEXT OR EQUATIONS OF THE BOOK!
  const tabGeom = new THREE.PlaneGeometry(3.3, 0.78);

  // 1. Tab for Module 1 (Hình 1.1/1.2 trên Trang 6) - Lề ngoài trang 6 (phía dưới)
  hotspotBrown = new THREE.Mesh(tabGeom, new THREE.MeshBasicMaterial({
    map: createMarginTabCanvas('Giọt Nước Brown 3D', '🔬', '#00e5ff'),
    transparent: true, opacity: 0.95
  }));
  hotspotBrown.position.set(-11.0, 0.42, 3.8);
  hotspotBrown.rotation.x = -Math.PI / 2;
  hotspotBrown.userData = { action: 'toggleBrown' };
  scene.add(hotspotBrown);
  clickableHotspots.push(hotspotBrown);

  // 2. Tab for Robert Brown Hologram (Trang 6) - Lề ngoài trang 6 (phía trên)
  hotspotHoloBrown = new THREE.Mesh(tabGeom, new THREE.MeshBasicMaterial({
    map: createMarginTabCanvas('Gặp Robert Brown', '✨', '#ffd54f'),
    transparent: true, opacity: 0.95
  }));
  hotspotHoloBrown.position.set(-11.0, 0.42, -3.8);
  hotspotHoloBrown.rotation.x = -Math.PI / 2;
  hotspotHoloBrown.userData = { action: 'toggleHoloBrown' };
  scene.add(hotspotHoloBrown);
  clickableHotspots.push(hotspotHoloBrown);

  // 3. Tab for Module 2 (Hình 1.3 trên Trang 7) - Lề ngoài trang 7 (phía trên)
  hotspotStates = new THREE.Mesh(tabGeom, new THREE.MeshBasicMaterial({
    map: createMarginTabCanvas('3 Khối Hộp 3 Thể', '🧊', '#00e676'),
    transparent: true, opacity: 0.95
  }));
  hotspotStates.position.set(11.0, 0.42, -3.8);
  hotspotStates.rotation.x = -Math.PI / 2;
  hotspotStates.userData = { action: 'toggleStates' };
  scene.add(hotspotStates);
  clickableHotspots.push(hotspotStates);

  // 4. Tab for Module Triangle (Hình 1.4 trên Trang 7) - Lề ngoài trang 7 (phía dưới)
  hotspotTriangle = new THREE.Mesh(tabGeom, new THREE.MeshBasicMaterial({
    map: createMarginTabCanvas('Tam Giác Chuyển Thể', '🔄', '#00e5ff'),
    transparent: true, opacity: 0.95
  }));
  hotspotTriangle.position.set(11.0, 0.42, 4.2);
  hotspotTriangle.rotation.x = -Math.PI / 2;
  hotspotTriangle.userData = { action: 'toggleTriangle' };
  scene.add(hotspotTriangle);
  clickableHotspots.push(hotspotTriangle);

  // 5. Tab for Module 3 (Hình 1.5 trên Trang 8) - Lề ngoài trang 8 (phía trên)
  hotspotMelting = new THREE.Mesh(tabGeom, new THREE.MeshBasicMaterial({
    map: createMarginTabCanvas('Đèn Cồn & Đồ Thị Sôi', '🔥', '#ff7043'),
    transparent: true, opacity: 0.95
  }));
  hotspotMelting.position.set(-11.0, 0.42, -3.8);
  hotspotMelting.rotation.x = -Math.PI / 2;
  hotspotMelting.userData = { action: 'toggleMelting' };
  hotspotMelting.visible = false;
  scene.add(hotspotMelting);
  clickableHotspots.push(hotspotMelting);

  // 6. Tab for Module 4 (Hình 1.6 Tinh thể NaCl trên Trang 8) - Lề ngoài trang 8 (phía dưới)
  hotspotNacl = new THREE.Mesh(tabGeom, new THREE.MeshBasicMaterial({
    map: createMarginTabCanvas('Tinh Thể Muối NaCl', '💎', '#00b0ff'),
    transparent: true, opacity: 0.95
  }));
  hotspotNacl.position.set(-11.0, 0.42, 4.2);
  hotspotNacl.rotation.x = -Math.PI / 2;
  hotspotNacl.userData = { action: 'toggleNacl' };
  hotspotNacl.visible = false;
  scene.add(hotspotNacl);
  clickableHotspots.push(hotspotNacl);

  // 7. Tab for Module 6 (Hình 1.7 Đồ Thị Nóng Chảy trên Trang 9) - Lề ngoài trang 9 (phía trên)
  hotspotMeltingGraph = new THREE.Mesh(tabGeom, new THREE.MeshBasicMaterial({
    map: createMarginTabCanvas('Đồ Thị Nóng Chảy 3D', '📈', '#00e5ff'),
    transparent: true, opacity: 0.95
  }));
  hotspotMeltingGraph.position.set(11.0, 0.42, -3.8);
  hotspotMeltingGraph.rotation.x = -Math.PI / 2;
  hotspotMeltingGraph.userData = { action: 'toggleMeltingGraph' };
  hotspotMeltingGraph.visible = false;
  scene.add(hotspotMeltingGraph);
  clickableHotspots.push(hotspotMeltingGraph);

  // 8. Tab for Module 5 (Hình 1.8 Luồng Plasma trên Trang 9) - Lề ngoài trang 9 (phía dưới)
  hotspotPlasma = new THREE.Mesh(tabGeom, new THREE.MeshBasicMaterial({
    map: createMarginTabCanvas('Thể Plasma Mặt Trời', '⚡', '#ff9100'),
    transparent: true, opacity: 0.95
  }));
  hotspotPlasma.position.set(11.0, 0.42, 4.2);
  hotspotPlasma.rotation.x = -Math.PI / 2;
  hotspotPlasma.userData = { action: 'togglePlasma' };
  hotspotPlasma.visible = false;
  scene.add(hotspotPlasma);
  clickableHotspots.push(hotspotPlasma);
}


// ============================================================================
// 6. MODULE 1: POP-UP 3D THÍ NGHIỆM CHUYỂN ĐỘNG BROWN (TRANG 6)
// ============================================================================
let waterDropMesh, pollenGrainMesh, brownTrailLine, brownTrailGeom;
let waterMoleculeParticles = [];
let brownTrailPoints = [];
const MAX_BROWN_TRAIL = 130;
let brownTempFactor = 1.0;
let isBrownTrailVisible = true;
const DROPLET_RADIUS = 3.2;

function createModule1BrownMotion() {
  brownModuleGroup = new THREE.Group();
  brownModuleGroup.position.set(-5.6, 3.8, 2.6);
  brownModuleGroup.scale.set(0.001, 0.001, 0.001);
  brownModuleGroup.visible = false;

  const dropGeom = new THREE.SphereGeometry(DROPLET_RADIUS, 32, 32);
  const dropMat = new THREE.MeshPhysicalMaterial({
    color: 0x4fc3f7,
    transparent: true,
    opacity: 0.3,
    roughness: 0.1,
    transmission: 0.8,
    ior: 1.33
  });
  waterDropMesh = new THREE.Mesh(dropGeom, dropMat);
  brownModuleGroup.add(waterDropMesh);

  const ringGeom = new THREE.TorusGeometry(DROPLET_RADIUS, 0.05, 16, 48);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.6 });
  const ring = new THREE.Mesh(ringGeom, ringMat);
  ring.rotation.x = Math.PI / 2;
  brownModuleGroup.add(ring);

  const pollenGeom = new THREE.DodecahedronGeometry(0.68, 2);
  const pollenMat = new THREE.MeshStandardMaterial({
    color: 0xffd54f,
    emissive: 0xff8f00,
    emissiveIntensity: 0.5,
    roughness: 0.3,
    metalness: 0.2
  });
  pollenGrainMesh = new THREE.Mesh(pollenGeom, pollenMat);
  pollenGrainMesh.position.set(0, 0, 0);
  pollenGrainMesh.userData.velocity = new THREE.Vector3(0, 0, 0);
  brownModuleGroup.add(pollenGrainMesh);

  brownTrailGeom = new THREE.BufferGeometry();
  const trailPositions = new Float32Array(MAX_BROWN_TRAIL * 3);
  brownTrailGeom.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
  const trailMat = new THREE.LineBasicMaterial({ color: 0xff1744, linewidth: 3, transparent: true, opacity: 0.95 });
  brownTrailLine = new THREE.Line(brownTrailGeom, trailMat);
  brownModuleGroup.add(brownTrailLine);

  const numWater = 120;
  const waterGeom = new THREE.SphereGeometry(0.11, 10, 10);
  const waterMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00b0ff, emissiveIntensity: 0.65, roughness: 0.1 });

  waterMoleculeParticles = [];
  for (let i = 0; i < numWater; i++) {
    const mesh = new THREE.Mesh(waterGeom, waterMat);
    const r = (DROPLET_RADIUS - 0.35) * Math.cbrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    mesh.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
    const speed = 0.12 + Math.random() * 0.08;
    const vel = new THREE.Vector3((Math.random() - 0.5) * speed, (Math.random() - 0.5) * speed, (Math.random() - 0.5) * speed);
    waterMoleculeParticles.push({ mesh, vel });
    brownModuleGroup.add(mesh);
  }

  scene.add(brownModuleGroup);

  const slider = document.getElementById('sliderBrownTemp');
  const lbl = document.getElementById('lblBrownTemp');
  if (slider) {
    slider.addEventListener('input', (e) => {
      const v = parseInt(e.target.value);
      if (lbl) lbl.textContent = v;
      brownTempFactor = 0.4 + (v / 100) * 2.2;
    });
  }
}

function toggleModule1Popup() {
  isBrownPopped = !isBrownPopped;
  const btn = document.getElementById('btnToggleBrown3D');
  const ctrlTemp = document.getElementById('ctrlBrownTemp');
  const btnTrail = document.getElementById('btnBrownTrail');

  if (isBrownPopped) {
    popOut3D(brownModuleGroup);
    if (btn) btn.textContent = "✕ Thu Gọn Giọt Nước";
    if (ctrlTemp) ctrlTemp.style.display = 'flex';
    if (btnTrail) btnTrail.style.display = 'inline-block';
    if (hotspotBrown) hotspotBrown.material.map = createMarginTabCanvas('Thu Gọn Giọt Nước', '✕', '#ff5252');
  } else {
    foldIn3D(brownModuleGroup);
    if (btn) btn.textContent = "🔍 Mở Giọt Nước 3D (Đang gập)";
    if (ctrlTemp) ctrlTemp.style.display = 'none';
    if (btnTrail) btnTrail.style.display = 'none';
    if (hotspotBrown) hotspotBrown.material.map = createMarginTabCanvas('Giọt Nước Brown 3D', '🔬', '#00e5ff');
  }
}

function toggleBrownTrail() {
  isBrownTrailVisible = !isBrownTrailVisible;
  if (brownTrailLine) brownTrailLine.visible = isBrownTrailVisible;
  playSound('pop');
}


// ============================================================================
// 7. NHÀ BÁC HỌC HOLOGRAM ROBERT BROWN & EINSTEIN
// ============================================================================
let brownAvatarMesh, hologramLaserRing, hologramLaserRing2;
let microscopeMesh = null;

function createHologramLabel(title, subtitle) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  
  // Background glassmorphism pill
  const grad = ctx.createLinearGradient(0, 0, 512, 128);
  grad.addColorStop(0, 'rgba(8, 28, 48, 0.95)');
  grad.addColorStop(1, 'rgba(12, 45, 70, 0.95)');
  ctx.fillStyle = grad;
  ctx.strokeStyle = '#00e5ff';
  ctx.lineWidth = 4;
  
  const r = 24;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(10, 10, 492, 108, r);
  } else {
    ctx.rect(10, 10, 492, 108);
  }
  ctx.fill();
  ctx.stroke();
  
  // Accent golden line
  ctx.strokeStyle = '#ffd54f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(80, 68);
  ctx.lineTo(432, 68);
  ctx.stroke();

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px "Montserrat", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, 256, 50);
  
  // Subtitle
  ctx.fillStyle = '#00e5ff';
  ctx.font = '600 20px "Segoe UI", Arial, sans-serif';
  ctx.fillText(subtitle, 256, 98);
  
  return new THREE.CanvasTexture(canvas);
}

function createHologramPedestal() {
  const pedGroup = new THREE.Group();
  
  // 1. Titanium dark base
  const baseGeom = new THREE.CylinderGeometry(1.8, 2.0, 0.25, 36);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x1a2634, metalness: 0.85, roughness: 0.25 });
  const baseMesh = new THREE.Mesh(baseGeom, baseMat);
  pedGroup.add(baseMesh);

  // 2. Brass decorative bezel ring
  const bezelGeom = new THREE.CylinderGeometry(1.65, 1.65, 0.28, 36);
  const bezelMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.2 });
  const bezelMesh = new THREE.Mesh(bezelGeom, bezelMat);
  pedGroup.add(bezelMesh);

  // 3. Glowing cyan core
  const coreGeom = new THREE.CylinderGeometry(1.4, 1.4, 0.31, 36);
  const coreMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 0.7 });
  const coreMesh = new THREE.Mesh(coreGeom, coreMat);
  pedGroup.add(coreMesh);

  return pedGroup;
}

function createHologramRobertBrown() {
  // Place on desk beside book so it never covers textbook pages
  hologramGroupBrown = new THREE.Group();
  hologramGroupBrown.position.set(-14.2, 0.05, -1.5);
  hologramGroupBrown.scale.set(0.001, 0.001, 0.001);
  hologramGroupBrown.visible = false;

  // Projector pedestal
  const pedestal = createHologramPedestal();
  hologramGroupBrown.add(pedestal);

  // Rotating energy rings
  const laserMat1 = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
  hologramLaserRing = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.04, 16, 36), laserMat1);
  hologramLaserRing.rotation.x = Math.PI / 2;
  hologramLaserRing.position.y = 0.28;
  hologramGroupBrown.add(hologramLaserRing);

  const laserMat2 = new THREE.MeshBasicMaterial({ color: 0xffd54f });
  hologramLaserRing2 = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.03, 16, 36), laserMat2);
  hologramLaserRing2.rotation.x = Math.PI / 2;
  hologramLaserRing2.position.y = 0.29;
  hologramGroupBrown.add(hologramLaserRing2);

  // Transparent, soft-edged portrait of Robert Brown
  const avatarGeom = new THREE.PlaneGeometry(3.6, 4.5);
  const avatarMat = new THREE.MeshBasicMaterial({
    map: pageTextures.robertBrown,
    transparent: true,
    opacity: 0.96,
    side: THREE.DoubleSide
  });
  brownAvatarMesh = new THREE.Mesh(avatarGeom, avatarMat);
  brownAvatarMesh.position.set(0, 3.6, 0);
  brownAvatarMesh.rotation.y = Math.PI / 6;
  hologramGroupBrown.add(brownAvatarMesh);

  // 3D Floating Nameplate Badge
  const labelMat = new THREE.MeshBasicMaterial({
    map: createHologramLabel('ROBERT BROWN', 'Nhà thực vật học Hoàng gia Scotland'),
    transparent: true,
    opacity: 0.95
  });
  const labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.8), labelMat);
  labelMesh.position.set(0, 1.25, 0.4);
  labelMesh.rotation.y = Math.PI / 6;
  hologramGroupBrown.add(labelMesh);

  // Real 3D Optical Microscope Model (from Poly Haven CC0)
  if (typeof THREE.GLTFLoader !== 'undefined') {
    const gltfLoader = new THREE.GLTFLoader();
    gltfLoader.load(
      'assets/models/microscope/industrial_microscope.gltf',
      (gltf) => {
        microscopeMesh = gltf.scene;
        microscopeMesh.scale.set(8.5, 8.5, 8.5);
        microscopeMesh.position.set(2.4, 0.0, 2.4); // Sits on desk next to Brown
        microscopeMesh.rotation.y = Math.PI / 4;
        microscopeMesh.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        hologramGroupBrown.add(microscopeMesh);
      },
      undefined,
      (err) => console.warn('GLTFLoader note:', err)
    );
  }

  // Holographic Laser Pointer beaming towards Trang 6 Hoạt động 2
  const pointerCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0.5, 3.4, 0.0),
    new THREE.Vector3(4.5, 4.2, 0.0),
    new THREE.Vector3(8.6, 0.5, -0.3)
  );
  const pointerGeom = new THREE.TubeGeometry(pointerCurve, 24, 0.025, 8, false);
  const pointerMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.65 });
  const pointerLine = new THREE.Mesh(pointerGeom, pointerMat);
  hologramGroupBrown.add(pointerLine);

  // Glowing target reticle at Hoạt động 2
  const reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.2, 0.35, 24),
    new THREE.MeshBasicMaterial({ color: 0x00e5ff, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
  );
  reticle.position.set(8.6, 0.52, -0.3);
  reticle.rotation.x = -Math.PI / 2;
  hologramGroupBrown.add(reticle);

  scene.add(hologramGroupBrown);

  // Einstein Hologram on desk
  hologramGroupEinstein = new THREE.Group();
  hologramGroupEinstein.position.set(-14.2, 0.05, -1.5);
  hologramGroupEinstein.scale.set(0.001, 0.001, 0.001);
  hologramGroupEinstein.visible = false;

  const ePedestal = createHologramPedestal();
  hologramGroupEinstein.add(ePedestal);

  const eAvatarMat = new THREE.MeshBasicMaterial({
    map: pageTextures.albertEinstein,
    transparent: true,
    opacity: 0.96,
    side: THREE.DoubleSide
  });
  const eAvatarMesh = new THREE.Mesh(avatarGeom, eAvatarMat);
  eAvatarMesh.position.set(0, 3.6, 0);
  eAvatarMesh.rotation.y = Math.PI / 6;
  hologramGroupEinstein.add(eAvatarMesh);

  const eLabelMat = new THREE.MeshBasicMaterial({
    map: createHologramLabel('ALBERT EINSTEIN', 'Giải thích chuyển động Brown (1905)'),
    transparent: true,
    opacity: 0.95
  });
  const eLabelMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.8), eLabelMat);
  eLabelMesh.position.set(0, 1.25, 0.4);
  eLabelMesh.rotation.y = Math.PI / 6;
  hologramGroupEinstein.add(eLabelMesh);

  hologramGroupEinstein.add(pointerLine.clone());
  hologramGroupEinstein.add(reticle.clone());

  scene.add(hologramGroupEinstein);
}

function toggleRobertBrownHologram() {
  isBrownHoloPopped = !isBrownHoloPopped;
  const btn = document.getElementById('btnToggleBrownHolo');

  if (isBrownHoloPopped) {
    currentScientist = 'brown';
    popOut3D(hologramGroupBrown);
    if (hologramGroupEinstein) foldIn3D(hologramGroupEinstein);
    if (btn) btn.textContent = "✕ Thu Gọn Hologram";
    if (hotspotHoloBrown) hotspotHoloBrown.material.map = createMarginTabCanvas('Thu Gọn Hologram', '✕', '#ff5252');
    displayScientistDialogue('brown');
    playSound('summon');
  } else {
    foldIn3D(hologramGroupBrown);
    closeScientistSpeech();
    if (btn) btn.textContent = "✨ Gặp Robert Brown";
    if (hotspotHoloBrown) hotspotHoloBrown.material.map = createMarginTabCanvas('Gặp Robert Brown', '✨', '#ffd54f');
  }
}

function triggerEinsteinHologram() {
  currentScientist = 'einstein';
  if (hologramGroupBrown) foldIn3D(hologramGroupBrown);
  popOut3D(hologramGroupEinstein);
  displayScientistDialogue('einstein');
  playSound('summon');
}

function displayScientistDialogue(key) {
  const data = scientistsData[key];
  if (!data) return;

  const card = document.getElementById('scSpeechCard');
  const avatar = document.getElementById('scAvatar');
  const name = document.getElementById('scName');
  const role = document.getElementById('scRole');
  const text = document.getElementById('scDialogue');

  if (avatar) avatar.src = data.avatar;
  if (name) name.textContent = data.name;
  if (role) role.textContent = data.role;
  if (text) text.textContent = data.dialogue;
  if (card) card.classList.add('active');

  if (isAudioEnabled) {
    setTimeout(speakCurrentScientist, 300);
  }
}

function closeScientistSpeech() {
  stopCurrentScientistSpeech();
  const card = document.getElementById('scSpeechCard');
  if (card) card.classList.remove('active');
}

function speakCurrentScientist() {
  if (!('speechSynthesis' in window)) return;
  stopCurrentScientistSpeech();

  const data = scientistsData[currentScientist];
  if (!data) return;

  currentUtterance = new SpeechSynthesisUtterance(data.dialogue);
  if (availableVoices.length === 0) availableVoices = synth.getVoices();
  const vi = availableVoices.find(v => v.lang && (v.lang.includes('vi') || v.lang.includes('VIE')));
  if (vi) currentUtterance.voice = vi;
  currentUtterance.rate = 0.95;

  const wave = document.getElementById('scVoiceWave');
  currentUtterance.onstart = () => { if (wave) wave.classList.add('active'); };
  currentUtterance.onend = () => { if (wave) wave.classList.remove('active'); };
  currentUtterance.onerror = () => { if (wave) wave.classList.remove('active'); };

  synth.speak(currentUtterance);
}

function stopCurrentScientistSpeech() {
  if ('speechSynthesis' in window && synth.speaking) {
    synth.cancel();
  }
  const wave = document.getElementById('scVoiceWave');
  if (wave) wave.classList.remove('active');
}


// ============================================================================
// 8. MODULE 2: 3 HỘP 3 THỂ RẮN - LỎNG - KHÍ (TRANG 7)
// ============================================================================
let isSpringsActive = true;
let isPistonCompressed = false;
let solidPiston, liquidPiston, gasPiston;
let solidGroup, liquidGroup, gasGroup;
let solidParticles = [], liquidParticles = [], gasParticles = [];
let solidBondsMesh = null;

const STATE_BOX_W = 2.4;
const STATE_BOX_H = 3.4;
const STATE_BOX_D = 2.4;

function createModule2StatesOfMatter() {
  module2Group = new THREE.Group();
  module2Group.position.set(5.6, 0.4, -1.2);
  module2Group.scale.set(0.001, 0.001, 0.001);
  module2Group.visible = false;

  function makeStateBox(xOffset, colorHex) {
    const group = new THREE.Group();
    group.position.set(xOffset, STATE_BOX_H / 2, 0);

    const boxGeom = new THREE.BoxGeometry(STATE_BOX_W, STATE_BOX_H, STATE_BOX_D);
    const boxMat = new THREE.MeshPhysicalMaterial({ color: colorHex, transparent: true, opacity: 0.18, roughness: 0.1, metalness: 0.2 });
    const boxMesh = new THREE.Mesh(boxGeom, boxMat);
    group.add(boxMesh);

    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(boxGeom),
      new THREE.LineBasicMaterial({ color: colorHex, opacity: 0.7, transparent: true })
    );
    group.add(wire);

    const pGeom = new THREE.BoxGeometry(STATE_BOX_W - 0.08, 0.18, STATE_BOX_D - 0.08);
    const pMat = new THREE.MeshStandardMaterial({ color: 0xb0bec5, metalness: 0.8, roughness: 0.2 });
    const piston = new THREE.Mesh(pGeom, pMat);
    piston.position.y = STATE_BOX_H / 2 - 0.1;
    group.add(piston);

    module2Group.add(group);
    return { group, piston };
  }

  const sBox = makeStateBox(-3.2, 0x00e5ff);
  solidGroup = sBox.group; solidPiston = sBox.piston;

  const lBox = makeStateBox(0, 0x0288d1);
  liquidGroup = lBox.group; liquidPiston = lBox.piston;

  const gBox = makeStateBox(3.2, 0xff7043);
  gasGroup = gBox.group; gasPiston = gBox.piston;

  const pSolidGeom = new THREE.SphereGeometry(0.18, 12, 12);
  const pSolidMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00838f, emissiveIntensity: 0.5 });
  const sDim = 3, sSp = 0.65, sOff = (sDim - 1) * sSp / 2;
  const bondPositions = [];

  for (let x = 0; x < sDim; x++) {
    for (let y = 0; y < sDim; y++) {
      for (let z = 0; z < sDim; z++) {
        const mesh = new THREE.Mesh(pSolidGeom, pSolidMat);
        const basePos = new THREE.Vector3(x * sSp - sOff, y * sSp - sOff - 0.3, z * sSp - sOff);
        mesh.position.copy(basePos);
        solidParticles.push({ mesh, basePos, phase: Math.random() * Math.PI * 2 });
        solidGroup.add(mesh);

        if (x < sDim - 1) { bondPositions.push(basePos.x, basePos.y, basePos.z, basePos.x + sSp, basePos.y, basePos.z); }
        if (y < sDim - 1) { bondPositions.push(basePos.x, basePos.y, basePos.z, basePos.x, basePos.y + sSp, basePos.z); }
        if (z < sDim - 1) { bondPositions.push(basePos.x, basePos.y, basePos.z, basePos.x, basePos.y, basePos.z + sSp); }
      }
    }
  }

  const bondGeom = new THREE.BufferGeometry();
  bondGeom.setAttribute('position', new THREE.Float32BufferAttribute(bondPositions, 3));
  solidBondsMesh = new THREE.LineSegments(bondGeom, new THREE.LineBasicMaterial({ color: 0x80deea, opacity: 0.85, transparent: true }));
  solidGroup.add(solidBondsMesh);

  const pLiqGeom = new THREE.SphereGeometry(0.17, 12, 12);
  const pLiqMat = new THREE.MeshStandardMaterial({ color: 0x29b6f6, emissive: 0x0277bd, emissiveIntensity: 0.45 });
  for (let i = 0; i < 24; i++) {
    const mesh = new THREE.Mesh(pLiqGeom, pLiqMat);
    const pos = new THREE.Vector3(
      (Math.random() - 0.5) * (STATE_BOX_W - 0.5),
      -STATE_BOX_H / 2 + 0.3 + Math.random() * 1.2,
      (Math.random() - 0.5) * (STATE_BOX_D - 0.5)
    );
    mesh.position.copy(pos);
    liquidParticles.push({
      mesh, pos,
      vel: new THREE.Vector3((Math.random() - 0.5) * 0.04, (Math.random() - 0.5) * 0.03, (Math.random() - 0.5) * 0.04)
    });
    liquidGroup.add(mesh);
  }

  const pGasGeom = new THREE.SphereGeometry(0.16, 12, 12);
  const pGasMat = new THREE.MeshStandardMaterial({ color: 0xff7043, emissive: 0xd84315, emissiveIntensity: 0.6 });
  for (let i = 0; i < 12; i++) {
    const mesh = new THREE.Mesh(pGasGeom, pGasMat);
    const pos = new THREE.Vector3(
      (Math.random() - 0.5) * (STATE_BOX_W - 0.5),
      (Math.random() - 0.5) * (STATE_BOX_H - 0.8),
      (Math.random() - 0.5) * (STATE_BOX_D - 0.5)
    );
    mesh.position.copy(pos);
    gasParticles.push({
      mesh, pos,
      vel: new THREE.Vector3((Math.random() - 0.5) * 0.12, (Math.random() - 0.5) * 0.12, (Math.random() - 0.5) * 0.12)
    });
    gasGroup.add(mesh);
  }

  scene.add(module2Group);
}

function toggleModule2Popup() {
  isStatesPopped = !isStatesPopped;
  const btn = document.getElementById('btnToggleStates3D');
  const btnSprings = document.getElementById('btnDockSprings');
  const btnPiston = document.getElementById('btnDockPiston');

  if (isStatesPopped) {
    popOut3D(module2Group);
    if (btn) btn.textContent = "✕ Thu Gọn 3 Khối Hộp";
    if (btnSprings) btnSprings.style.display = 'inline-block';
    if (btnPiston) btnPiston.style.display = 'inline-block';
    if (hotspotStates) hotspotStates.material.map = createMarginTabCanvas('Thu Gọn 3 Khối Hộp', '✕', '#ff5252');
  } else {
    foldIn3D(module2Group);
    if (btn) btn.textContent = "🧊 Mở 3 Khối Hộp 3D (Đang gập)";
    if (btnSprings) btnSprings.style.display = 'none';
    if (btnPiston) btnPiston.style.display = 'none';
    if (hotspotStates) hotspotStates.material.map = createMarginTabCanvas('3 Khối Hộp 3 Thể', '🧊', '#00e676');
  }
}

function toggleSpringBonds() {
  isSpringsActive = !isSpringsActive;
  if (solidBondsMesh) solidBondsMesh.visible = isSpringsActive;
  const btn = document.getElementById('btnDockSprings');
  if (btn) btn.textContent = isSpringsActive ? "🔗 Lò Xo Lực Liên Kết" : "🔗 Lò Xo: ĐÃ TẮT";
  playSound('pop');
}

function togglePistonCompression() {
  isPistonCompressed = !isPistonCompressed;
  const btn = document.getElementById('btnDockPiston');
  if (btn) {
    btn.textContent = isPistonCompressed ? "🔼 Nhả Pittông Tự Do" : "🔽 Nén Pittông 3D";
  }
  playSound('pop');
}


// ============================================================================
// 9. MODULE TRIANGLE PHASE TRANSITIONS (HÌNH 1.4 TRÊN TRANG 7)
// ============================================================================
let triangleGasParticles = [];
let triangleLiquidParticles = [];
let triangleSolidParticles = [];
let triangleFlowStreams = [];
let triangleBillboardBadges = [];

function createBillboardBadgeTexture(mainText, subText, colorHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 140;
  const ctx = canvas.getContext('2d');

  // Dark glassy container
  ctx.fillStyle = 'rgba(6, 16, 32, 0.94)';
  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 5;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(8, 8, 496, 124, 28);
  else ctx.rect(8, 8, 496, 124);
  ctx.fill();
  ctx.stroke();

  // Subtle glow
  ctx.shadowColor = colorHex;
  ctx.shadowBlur = 14;

  // Main text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 34px "Montserrat", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(mainText, 256, 54);

  // Sub text
  ctx.fillStyle = colorHex;
  ctx.font = 'bold 23px "Segoe UI", Arial, sans-serif';
  ctx.fillText(subText, 256, 100);

  return new THREE.CanvasTexture(canvas);
}

function createStateHeaderBadge(titleText, subtitleText, colorHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 130;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(4, 12, 24, 0.94)';
  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 4;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(8, 8, 496, 114, 24);
  else ctx.rect(8, 8, 496, 114);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = colorHex;
  ctx.font = 'bold 34px "Montserrat", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(titleText, 256, 50);

  ctx.fillStyle = '#e0f2fe';
  ctx.font = '600 20px "Segoe UI", Arial, sans-serif';
  ctx.fillText(subtitleText, 256, 92);

  const tex = new THREE.CanvasTexture(canvas);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.65, 0.44),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide })
  );
  return mesh;
}

function createModuleTriangleTransition() {
  triangleModuleGroup = new THREE.Group();
  // Anchored on Page 7 directly over Figure 1.4 in the right column
  triangleModuleGroup.position.set(7.6, 0.4, 4.8);
  triangleModuleGroup.scale.set(0.001, 0.001, 0.001);
  triangleModuleGroup.visible = false; // Initially folded

  triangleGasParticles = [];
  triangleLiquidParticles = [];
  triangleSolidParticles = [];
  triangleFlowStreams = [];
  triangleBillboardBadges = [];

  // ========================================================================
  // 1. GAS CHAMBER (THỂ KHÍ) - Đỉnh trên (0, 1.85, -0.95)
  // ========================================================================
  const gasPos = new THREE.Vector3(0, 1.85, -0.95);
  const gasChamberGroup = new THREE.Group();
  gasChamberGroup.position.copy(gasPos);

  const gasOrbGeom = new THREE.SphereGeometry(0.50, 24, 24);
  const gasOrbMat = new THREE.MeshStandardMaterial({
    color: 0xff7043,
    transparent: true,
    opacity: 0.35,
    roughness: 0.15,
    metalness: 0.1
  });
  const gasOrb = new THREE.Mesh(gasOrbGeom, gasOrbMat);
  gasChamberGroup.add(gasOrb);

  const gasRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.50, 0.018, 16, 48),
    new THREE.MeshBasicMaterial({ color: 0xffa726, transparent: true, opacity: 0.9 })
  );
  gasRing.rotation.x = Math.PI / 2;
  gasChamberGroup.add(gasRing);

  // 14 energetic gas molecules inside
  const gMolGeom = new THREE.SphereGeometry(0.062, 12, 12);
  const gMolMat = new THREE.MeshStandardMaterial({
    color: 0xff7043,
    emissive: 0xff3d00,
    emissiveIntensity: 0.9
  });
  for (let i = 0; i < 14; i++) {
    const mesh = new THREE.Mesh(gMolGeom, gMolMat);
    const r = 0.36 * Math.cbrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    mesh.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
    const speed = 0.055 + Math.random() * 0.035;
    const vel = new THREE.Vector3((Math.random() - 0.5) * speed, (Math.random() - 0.5) * speed, (Math.random() - 0.5) * speed);
    triangleGasParticles.push({ mesh, vel });
    gasChamberGroup.add(mesh);
  }

  // Header billboard badge for Gas
  const gasBadge = createStateHeaderBadge('☁️ THỂ KHÍ', 'Khoảng cách rất lớn • Bay tự do', '#ffa726');
  gasBadge.position.set(0, 0.72, 0);
  gasChamberGroup.add(gasBadge);
  triangleBillboardBadges.push(gasBadge);

  triangleModuleGroup.add(gasChamberGroup);

  // ========================================================================
  // 2. LIQUID CHAMBER (THỂ LỎNG) - Góc dưới trái (-1.25, 0.65, 0.85)
  // ========================================================================
  const liqPos = new THREE.Vector3(-1.25, 0.65, 0.85);
  const liqChamberGroup = new THREE.Group();
  liqChamberGroup.position.copy(liqPos);

  const liqOrbGeom = new THREE.SphereGeometry(0.50, 24, 24);
  const liqOrbMat = new THREE.MeshStandardMaterial({
    color: 0x0288d1,
    transparent: true,
    opacity: 0.42,
    roughness: 0.12,
    metalness: 0.1
  });
  const liqOrb = new THREE.Mesh(liqOrbGeom, liqOrbMat);
  liqChamberGroup.add(liqOrb);

  const liqRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.50, 0.018, 16, 48),
    new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.9 })
  );
  liqRing.rotation.x = Math.PI / 2;
  liqChamberGroup.add(liqRing);

  // 14 liquid molecules sliding past each other
  const lMolGeom = new THREE.SphereGeometry(0.065, 12, 12);
  const lMolMat = new THREE.MeshStandardMaterial({
    color: 0x00e5ff,
    emissive: 0x0277bd,
    emissiveIntensity: 0.75
  });
  for (let i = 0; i < 14; i++) {
    const mesh = new THREE.Mesh(lMolGeom, lMolMat);
    const basePos = new THREE.Vector3(
      (Math.random() - 0.5) * 0.50,
      -0.28 + Math.random() * 0.40,
      (Math.random() - 0.5) * 0.50
    );
    mesh.position.copy(basePos);
    triangleLiquidParticles.push({
      mesh, basePos,
      phase: Math.random() * Math.PI * 2,
      speed: 1.8 + Math.random() * 1.5
    });
    liqChamberGroup.add(mesh);
  }

  // Header billboard badge for Liquid
  const liqBadge = createStateHeaderBadge('💧 THỂ LỎNG', 'Khoảng cách vừa • Trượt đổi chỗ', '#00e5ff');
  liqBadge.position.set(0, 0.72, 0);
  liqChamberGroup.add(liqBadge);
  triangleBillboardBadges.push(liqBadge);

  triangleModuleGroup.add(liqChamberGroup);

  // ========================================================================
  // 3. SOLID CHAMBER (THỂ RẮN) - Góc dưới phải (1.25, 0.65, 0.85)
  // ========================================================================
  const solidPos = new THREE.Vector3(1.25, 0.65, 0.85);
  const solidChamberGroup = new THREE.Group();
  solidChamberGroup.position.copy(solidPos);

  const solidBoxGeom = new THREE.BoxGeometry(0.88, 0.88, 0.88);
  const solidBoxMat = new THREE.MeshStandardMaterial({
    color: 0x80deea,
    transparent: true,
    opacity: 0.38,
    roughness: 0.08,
    metalness: 0.15
  });
  const solidBox = new THREE.Mesh(solidBoxGeom, solidBoxMat);
  solidChamberGroup.add(solidBox);

  // Frosty crystal edges
  const solidEdges = new THREE.LineSegments(
    new THREE.WireframeGeometry(solidBoxGeom),
    new THREE.LineBasicMaterial({ color: 0x00e5ff, opacity: 0.9, transparent: true })
  );
  solidChamberGroup.add(solidEdges);

  // 8 solid molecules arranged in regular 2x2x2 crystal lattice
  const sMolGeom = new THREE.SphereGeometry(0.066, 12, 12);
  const sMolMat = new THREE.MeshStandardMaterial({
    color: 0x00e5ff,
    emissive: 0x00838f,
    emissiveIntensity: 0.85
  });

  const nx = 2, ny = 2, nz = 2;
  const sp = 0.40;
  const off = (nx - 1) * sp / 2;
  const sBondPts = [];

  for (let ix = 0; ix < nx; ix++) {
    for (let iy = 0; iy < ny; iy++) {
      for (let iz = 0; iz < nz; iz++) {
        const mesh = new THREE.Mesh(sMolGeom, sMolMat);
        const basePos = new THREE.Vector3(ix * sp - off, iy * sp - off, iz * sp - off);
        mesh.position.copy(basePos);
        triangleSolidParticles.push({ mesh, basePos, phase: Math.random() * Math.PI * 2 });
        solidChamberGroup.add(mesh);

        if (ix < nx - 1) sBondPts.push(basePos.x, basePos.y, basePos.z, basePos.x + sp, basePos.y, basePos.z);
        if (iy < ny - 1) sBondPts.push(basePos.x, basePos.y, basePos.z, basePos.x, basePos.y + sp, basePos.z);
        if (iz < nz - 1) sBondPts.push(basePos.x, basePos.y, basePos.z, basePos.x, basePos.y, basePos.z + sp);
      }
    }
  }

  const sBondGeom = new THREE.BufferGeometry();
  sBondGeom.setAttribute('position', new THREE.Float32BufferAttribute(sBondPts, 3));
  const sBondMesh = new THREE.LineSegments(
    sBondGeom,
    new THREE.LineBasicMaterial({ color: 0x80deea, opacity: 0.85, transparent: true })
  );
  solidChamberGroup.add(sBondMesh);

  // Header billboard badge for Solid
  const solidBadge = createStateHeaderBadge('🧊 THỂ RẮN', 'Mạng tinh thể • Dao động tại chỗ', '#00e676');
  solidBadge.position.set(0, 0.72, 0);
  solidChamberGroup.add(solidBadge);
  triangleBillboardBadges.push(solidBadge);

  triangleModuleGroup.add(solidChamberGroup);

  // ========================================================================
  // 4. SIX ANIMATED PHASE TRANSITIONS WITH FLOWING ENERGY BEADS
  // ========================================================================
  function createPhaseArrowMesh(pStart, pEnd, colorHex, phaseKey, titleText, subText, badgePos) {
    const dir = new THREE.Vector3().subVectors(pEnd, pStart);
    const len = dir.length();
    const unitDir = dir.clone().normalize();

    const arrowGroup = new THREE.Group();
    arrowGroup.position.copy(pStart);

    // Guide tube
    const rodGeom = new THREE.CylinderGeometry(0.026, 0.026, len * 0.78, 10);
    const rodMat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.65 });
    const rod = new THREE.Mesh(rodGeom, rodMat);
    rod.position.y = len * 0.40;
    arrowGroup.add(rod);

    // Direction Cone head
    const coneGeom = new THREE.ConeGeometry(0.09, 0.26, 12);
    const coneMat = new THREE.MeshBasicMaterial({ color: colorHex });
    const cone = new THREE.Mesh(coneGeom, coneMat);
    cone.position.y = len * 0.82;
    arrowGroup.add(cone);

    arrowGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), unitDir);
    triangleModuleGroup.add(arrowGroup);

    // 5 Glowing Flow Beads streaming along the route
    const beadGeom = new THREE.SphereGeometry(0.055, 10, 10);
    const beadMat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.95 });
    const beads = [];
    for (let b = 0; b < 5; b++) {
      const bead = new THREE.Mesh(beadGeom, beadMat);
      bead.position.copy(pStart);
      triangleModuleGroup.add(bead);
      beads.push(bead);
    }
    triangleFlowStreams.push({ start: pStart.clone(), end: pEnd.clone(), beads, speed: 0.55 });

    // Camera-facing Billboard Badge with high contrast & crisp text
    const badgeTex = createBillboardBadgeTexture(titleText, subText, colorHex);
    const badgeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.20, 0.34),
      new THREE.MeshBasicMaterial({ map: badgeTex, transparent: true, side: THREE.DoubleSide })
    );

    badgeMesh.position.copy(badgePos);

    triangleBillboardBadges.push(badgeMesh);
    triangleModuleGroup.add(badgeMesh);

    // Make all parts interactive & clickable
    rod.userData = { phaseKey };
    cone.userData = { phaseKey };
    badgeMesh.userData = { phaseKey };
    clickablePhaseArrows.push(rod, cone, badgeMesh);
  }

  // 1. Lỏng -> Khí: HOÁ HƠI (Thu nhiệt, Outside Left, UP - Higher)
  createPhaseArrowMesh(
    new THREE.Vector3(-1.15, 0.82, 0.60),
    new THREE.Vector3(-0.28, 1.68, -0.75),
    '#ffb300', 'hoa-hoi', '🔥 HOÁ HƠI', 'Thu nhiệt (Lỏng ➡ Khí)',
    new THREE.Vector3(-1.12, 1.48, -0.05)
  );

  // 2. Khí -> Lỏng: HOÁ LỎNG (Toả nhiệt, Inside Left, DOWN - Lower)
  createPhaseArrowMesh(
    new THREE.Vector3(-0.40, 1.55, -0.55),
    new THREE.Vector3(-0.98, 0.70, 0.48),
    '#0288d1', 'hoa-long', '❄ HOÁ LỎNG', 'Toả nhiệt (Khí ➡ Lỏng)',
    new THREE.Vector3(-0.35, 1.05, 0.15)
  );

  // 3. Rắn -> Lỏng: NÓNG CHẢY (Thu nhiệt, Front Base, LEFT)
  createPhaseArrowMesh(
    new THREE.Vector3(0.90, 0.50, 1.05),
    new THREE.Vector3(-0.90, 0.50, 1.05),
    '#ff5722', 'nong-chay', '🔥 NÓNG CHẢY', 'Thu nhiệt (Rắn ➡ Lỏng)',
    new THREE.Vector3(0.0, 0.28, 1.25)
  );

  // 4. Lỏng -> Rắn: ĐÔNG ĐẶC (Toả nhiệt, Rear Base, RIGHT)
  createPhaseArrowMesh(
    new THREE.Vector3(-0.90, 0.75, 0.65),
    new THREE.Vector3(0.90, 0.75, 0.65),
    '#00e5ff', 'dong-dac', '❄ ĐÔNG ĐẶC', 'Toả nhiệt (Lỏng ➡ Rắn)',
    new THREE.Vector3(0.0, 0.95, 0.45)
  );

  // 5. Rắn -> Khí: THĂNG HOA (Thu nhiệt, Outside Right, UP - Higher)
  createPhaseArrowMesh(
    new THREE.Vector3(1.15, 0.82, 0.60),
    new THREE.Vector3(0.28, 1.68, -0.75),
    '#e040fb', 'thang-hoa', '🔥 THĂNG HOA', 'Thu nhiệt (Rắn ➡ Khí)',
    new THREE.Vector3(1.12, 1.48, -0.05)
  );

  // 6. Khí -> Rắn: NGƯNG KẾT (Toả nhiệt, Inside Right, DOWN - Lower)
  createPhaseArrowMesh(
    new THREE.Vector3(0.40, 1.55, -0.55),
    new THREE.Vector3(0.98, 0.70, 0.48),
    '#7c4dff', 'ngung-ket', '❄ NGƯNG KẾT', 'Toả nhiệt (Khí ➡ Rắn)',
    new THREE.Vector3(0.35, 1.05, 0.15)
  );

  scene.add(triangleModuleGroup);
}

function toggleTrianglePopup() {
  isTrianglePopped = !isTrianglePopped;
  const btn = document.getElementById('btnToggleTriangle3D');

  if (isTrianglePopped) {
    popOut3D(triangleModuleGroup);
    if (btn) btn.textContent = "✕ Thu Gọn Tam Giác";
    if (hotspotTriangle) hotspotTriangle.material.map = createMarginTabCanvas('Thu Gọn Tam Giác', '✕', '#ff5252');
    showPhaseDetail('hoa-hoi');
  } else {
    foldIn3D(triangleModuleGroup);
    closePhaseDetail();
    if (btn) btn.textContent = "🔄 Mở Tam Giác Chuyển Thể (Đang gập)";
    if (hotspotTriangle) hotspotTriangle.material.map = createMarginTabCanvas('Tam Giác Chuyển Thể', '🔄', '#00e5ff');
  }
}

function showPhaseDetail(key) {
  const data = phaseDescriptions[key];
  if (!data) return;
  const card = document.getElementById('phaseDetailCard');
  const title = document.getElementById('phaseTitle');
  const icon = document.getElementById('phaseIcon');
  const desc = document.getElementById('phaseDesc');

  if (card && title && desc) {
    icon.textContent = data.icon;
    title.textContent = data.title;
    desc.textContent = data.desc;
    card.classList.add('active');
    playSound('pop');
  }
}

function closePhaseDetail() {
  const card = document.getElementById('phaseDetailCard');
  if (card) card.classList.remove('active');
}


// ============================================================================
// 10. MODULE 3: ĐÈN CỒN, NÓNG CHẢY & ĐỒ THỊ NHIỆT ĐỘ THEO THỜI GIAN (HÌNH 1.5)
// ============================================================================
let flameMesh, flameLight, beakerWaterMesh, steamGroup;
let graph3DGroup, graphLine, graphLineGeom, graphCursorMesh, graphStatusMesh;
let graphStatusCanvas, graphStatusCtx, graphStatusTex;
let isMeltingTimelineRunning = false;
let meltingStage = 1;
let meltingProgress = 0;

// 100 Sample points for Hình 1.5: A (20°C) -> B (100°C) -> C (100°C ngang)
const GRAPH_TOTAL_PTS = 100;
const graphCurvePoints = [];

function initGraphCurveData() {
  graphCurvePoints.length = 0;
  // Origin offset in graph local coordinates:
  // Point A: (t=0, T=20°C) -> x = -1.7, y = -0.65
  // Point B: (t=t1, T=100°C) -> x = 0.3, y = 0.75
  // Point C: (t=t2, T=100°C) -> x = 1.9, y = 0.75
  const ptA = new THREE.Vector3(-1.7, -0.65, 0.08);
  const ptB = new THREE.Vector3(0.3, 0.75, 0.08);
  const ptC = new THREE.Vector3(1.9, 0.75, 0.08);

  const nRise = 55;
  for (let i = 0; i <= nRise; i++) {
    const alpha = i / nRise;
    graphCurvePoints.push(new THREE.Vector3().lerpVectors(ptA, ptB, alpha));
  }
  const nBoil = GRAPH_TOTAL_PTS - nRise;
  for (let i = 1; i <= nBoil; i++) {
    const alpha = i / nBoil;
    graphCurvePoints.push(new THREE.Vector3().lerpVectors(ptB, ptC, alpha));
  }
}

function updateGraphStatusBadge(tempC, stageText, subText) {
  if (!graphStatusCtx || !graphStatusTex) return;
  const ctx = graphStatusCtx;
  const w = 512, h = 180;
  ctx.clearRect(0, 0, w, h);

  // Background card
  ctx.fillStyle = 'rgba(6, 22, 42, 0.94)';
  ctx.strokeStyle = '#00e5ff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(8, 8, w - 16, h - 16, 18);
  else ctx.rect(8, 8, w - 16, h - 16);
  ctx.fill();
  ctx.stroke();

  // Title
  ctx.fillStyle = '#ffd54f';
  ctx.font = 'bold 24px "Montserrat", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('HÌNH 1.5: ĐỒ THỊ NHIỆT ĐỘ - THỜI GIAN', w / 2, 38);

  // Temperature display
  ctx.fillStyle = tempC >= 100 ? '#ff5252' : '#00e5ff';
  ctx.font = 'bold 36px "Montserrat", Arial, sans-serif';
  ctx.fillText(`Nhiệt độ: ${tempC}°C`, w / 2, 85);

  // Status & physics explanation
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 20px "Segoe UI", Arial, sans-serif';
  ctx.fillText(stageText, w / 2, 122);

  ctx.fillStyle = '#b0bec5';
  ctx.font = '500 16px "Segoe UI", Arial, sans-serif';
  ctx.fillText(subText, w / 2, 153);

  graphStatusTex.needsUpdate = true;
}

function create3DTemperatureGraph() {
  initGraphCurveData();
  graph3DGroup = new THREE.Group();
  // Positioned on the upper-right of Trang 8 (matching Figure 1.5 in the book)
  graph3DGroup.position.set(2.4, 2.3, -1.5);
  graph3DGroup.rotation.y = -Math.PI / 8;
  graph3DGroup.rotation.x = -Math.PI / 14;

  // 1. Translucent Glassmorphism Backing Plate
  const plateGeom = new THREE.PlaneGeometry(4.8, 3.8);
  const plateMat = new THREE.MeshStandardMaterial({
    color: 0x071b30,
    transparent: true,
    opacity: 0.90,
    roughness: 0.25,
    metalness: 0.5,
    side: THREE.DoubleSide
  });
  const plate = new THREE.Mesh(plateGeom, plateMat);
  graph3DGroup.add(plate);

  const border = new THREE.LineSegments(
    new THREE.EdgesGeometry(plateGeom),
    new THREE.LineBasicMaterial({ color: 0x00e5ff, linewidth: 2 })
  );
  plate.add(border);

  // 2. Coordinate Axes (O, t, T)
  const axisMatT = new THREE.MeshStandardMaterial({ color: 0xffb300, metalness: 0.8, roughness: 0.2 });
  const axisMatTime = new THREE.MeshStandardMaterial({ color: 0x00e5ff, metalness: 0.8, roughness: 0.2 });

  // Vertical axis T (°C)
  const axisT = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.2, 12), axisMatT);
  axisT.position.set(-1.7, 0.1, 0.04);
  graph3DGroup.add(axisT);

  const arrowT = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.22, 12), axisMatT);
  arrowT.position.set(-1.7, 1.25, 0.04);
  graph3DGroup.add(arrowT);

  // Horizontal axis t (min)
  const axisTime = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 3.8, 12), axisMatTime);
  axisTime.position.set(0.2, -1.0, 0.04);
  axisTime.rotation.z = -Math.PI / 2;
  graph3DGroup.add(axisTime);

  const arrowTime = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.22, 12), axisMatTime);
  arrowTime.position.set(2.1, -1.0, 0.04);
  arrowTime.rotation.z = -Math.PI / 2;
  graph3DGroup.add(arrowTime);

  // Helper function for 3D Text label
  function createTextBillboard(text, color, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.font = 'bold 30px "Montserrat", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(text, 128, 44);
    const tex = new THREE.CanvasTexture(canvas);
    return new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide })
    );
  }

  // Axis Labels
  const lblT = createTextBillboard('T (°C)', '#ffd54f', 0.85, 0.24);
  lblT.position.set(-1.7, 1.45, 0.06);
  graph3DGroup.add(lblT);

  const lblTime = createTextBillboard('t (phút)', '#00e5ff', 0.85, 0.24);
  lblTime.position.set(2.35, -1.0, 0.06);
  graph3DGroup.add(lblTime);

  // Tick 20°C
  const tick20 = createTextBillboard('20°', '#ffd54f', 0.45, 0.2);
  tick20.position.set(-2.0, -0.65, 0.06);
  graph3DGroup.add(tick20);

  // Tick 100°C
  const tick100 = createTextBillboard('100°', '#ff5252', 0.55, 0.2);
  tick100.position.set(-2.05, 0.75, 0.06);
  graph3DGroup.add(tick100);

  // Dashed guideline at 100°C
  const dashMat = new THREE.LineDashedMaterial({ color: 0x00e5ff, dashSize: 0.15, gapSize: 0.1, transparent: true, opacity: 0.5 });
  const dashGeom = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-1.7, 0.75, 0.02),
    new THREE.Vector3(1.9, 0.75, 0.02)
  ]);
  const dashLine = new THREE.Line(dashGeom, dashMat);
  dashLine.computeLineDistances();
  graph3DGroup.add(dashLine);

  // Point Labels: A, B, C
  const lblA = createTextBillboard('A (20°C)', '#ffffff', 0.75, 0.22);
  lblA.position.set(-1.25, -0.75, 0.06);
  graph3DGroup.add(lblA);

  const lblB = createTextBillboard('B (100°C)', '#ffd54f', 0.75, 0.22);
  lblB.position.set(0.3, 1.05, 0.06);
  graph3DGroup.add(lblB);

  const lblC = createTextBillboard('C (Sôi)', '#ff5252', 0.65, 0.22);
  lblC.position.set(1.9, 1.05, 0.06);
  graph3DGroup.add(lblC);

  // 3. Dynamic Animated Curve Line
  const posArr = new Float32Array(GRAPH_TOTAL_PTS * 3);
  for (let i = 0; i < GRAPH_TOTAL_PTS; i++) {
    posArr[i * 3] = graphCurvePoints[i].x;
    posArr[i * 3 + 1] = graphCurvePoints[i].y;
    posArr[i * 3 + 2] = graphCurvePoints[i].z;
  }
  graphLineGeom = new THREE.BufferGeometry();
  graphLineGeom.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
  graphLineGeom.setDrawRange(0, 0); // Initially hidden

  const lineMat = new THREE.LineBasicMaterial({ color: 0xff3d00, linewidth: 5 });
  graphLine = new THREE.Line(graphLineGeom, lineMat);
  graph3DGroup.add(graphLine);

  // 4. Glowing Tracer Cursor
  const cursorGeom = new THREE.SphereGeometry(0.12, 16, 16);
  const cursorMat = new THREE.MeshStandardMaterial({
    color: 0xffeb3b,
    emissive: 0xff6d00,
    emissiveIntensity: 1.0,
    roughness: 0.1
  });
  graphCursorMesh = new THREE.Mesh(cursorGeom, cursorMat);
  graphCursorMesh.position.copy(graphCurvePoints[0]);
  graph3DGroup.add(graphCursorMesh);

  // 5. Interactive Status Badge (Bottom-mounted Canvas HUD)
  graphStatusCanvas = document.createElement('canvas');
  graphStatusCanvas.width = 512;
  graphStatusCanvas.height = 180;
  graphStatusCtx = graphStatusCanvas.getContext('2d');
  graphStatusTex = new THREE.CanvasTexture(graphStatusCanvas);

  const statusGeom = new THREE.PlaneGeometry(4.4, 1.45);
  const statusMat = new THREE.MeshBasicMaterial({ map: graphStatusTex, transparent: true, side: THREE.DoubleSide });
  graphStatusMesh = new THREE.Mesh(statusGeom, statusMat);
  graphStatusMesh.position.set(0, -1.65, 0.10);
  graph3DGroup.add(graphStatusMesh);

  // Initial render of status badge
  updateGraphStatusBadge(20, 'Bắt đầu: Nước lỏng ở 20°C', 'Bấm "▶ Bắt Đầu Đun Lửa" để xem đồ thị vẽ động!');

  return graph3DGroup;
}

function createRealisticAlcoholBurner() {
  const burnerGroup = new THREE.Group();
  burnerGroup.position.set(-2.9, 0.0, 1.4);

  // 1. Metal Laboratory Tripod Stand
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x37474f, metalness: 0.85, roughness: 0.3 });
  
  // Tripod Ring
  const ringGeom = new THREE.TorusGeometry(1.15, 0.06, 12, 32);
  const ringMesh = new THREE.Mesh(ringGeom, metalMat);
  ringMesh.rotation.x = Math.PI / 2;
  ringMesh.position.y = 2.4;
  burnerGroup.add(ringMesh);

  // 3 Legs
  for (let i = 0; i < 3; i++) {
    const angle = (i * 2 * Math.PI) / 3;
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.45, 12), metalMat);
    leg.position.set(Math.cos(angle) * 1.15, 1.2, Math.sin(angle) * 1.15);
    leg.rotation.z = Math.sin(angle) * 0.10;
    leg.rotation.x = -Math.cos(angle) * 0.10;
    burnerGroup.add(leg);
  }

  // 2. Glass Alcohol Burner Lamp Body
  const lampBodyGeom = new THREE.CylinderGeometry(0.85, 1.15, 1.2, 24);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x80deea,
    transparent: true,
    opacity: 0.45,
    transmission: 0.75,
    roughness: 0.1,
    ior: 1.5
  });
  const lampBody = new THREE.Mesh(lampBodyGeom, glassMat);
  lampBody.position.y = 0.60;
  burnerGroup.add(lampBody);

  // Alcohol liquid inside
  const liquidGeom = new THREE.CylinderGeometry(0.78, 1.05, 0.85, 24);
  const liquidMat = new THREE.MeshStandardMaterial({ color: 0x00bcd4, transparent: true, opacity: 0.65 });
  const liquidMesh = new THREE.Mesh(liquidGeom, liquidMat);
  liquidMesh.position.y = 0.50;
  burnerGroup.add(liquidMesh);

  // Brass Cap & Wick
  const capGeom = new THREE.CylinderGeometry(0.32, 0.38, 0.30, 16);
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xffb300, metalness: 0.9, roughness: 0.2 });
  const cap = new THREE.Mesh(capGeom, brassMat);
  cap.position.y = 1.35;
  burnerGroup.add(cap);

  // 3. Dynamic Flame
  const flameGeom = new THREE.ConeGeometry(0.32, 1.1, 16);
  const flameMat = new THREE.MeshBasicMaterial({ color: 0xff5722, transparent: true, opacity: 0.92 });
  flameMesh = new THREE.Mesh(flameGeom, flameMat);
  flameMesh.position.y = 1.95;
  burnerGroup.add(flameMesh);

  // Inner blue core flame
  const innerFlame = new THREE.Mesh(
    new THREE.ConeGeometry(0.16, 0.5, 12),
    new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.85 })
  );
  innerFlame.position.y = -0.22;
  flameMesh.add(innerFlame);

  // Warm light emission
  flameLight = new THREE.PointLight(0xff7043, 1.5, 8);
  flameLight.position.set(0, 2.0, 0);
  burnerGroup.add(flameLight);

  // 4. Heat-resistant Glass Beaker with Water
  const beakerGeom = new THREE.CylinderGeometry(1.05, 1.0, 1.6, 24);
  const beakerMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.35,
    transmission: 0.85,
    roughness: 0.08,
    ior: 1.48
  });
  const beaker = new THREE.Mesh(beakerGeom, beakerMat);
  beaker.position.y = 3.25;
  burnerGroup.add(beaker);

  // Water inside beaker
  const waterGeom = new THREE.CylinderGeometry(0.98, 0.94, 1.0, 24);
  const waterMat = new THREE.MeshPhysicalMaterial({
    color: 0x29b6f6,
    transparent: true,
    opacity: 0.75,
    roughness: 0.05,
    transmission: 0.6
  });
  beakerWaterMesh = new THREE.Mesh(waterGeom, waterMat);
  beakerWaterMesh.position.y = 2.95;
  burnerGroup.add(beakerWaterMesh);

  // 5. Steam Particles (Boiling water vapour)
  steamGroup = new THREE.Group();
  const sGeom = new THREE.SphereGeometry(0.12, 8, 8);
  const sMat = new THREE.MeshBasicMaterial({ color: 0xe0f7fa, transparent: true, opacity: 0.45 });
  for (let i = 0; i < 35; i++) {
    const sm = new THREE.Mesh(sGeom, sMat);
    sm.position.set((Math.random() - 0.5) * 1.4, 3.8 + Math.random() * 3.5, (Math.random() - 0.5) * 1.4);
    sm.userData = { vy: 0.05 + Math.random() * 0.06, vx: (Math.random() - 0.5) * 0.02, origY: 3.8 };
    steamGroup.add(sm);
  }
  steamGroup.visible = false;
  burnerGroup.add(steamGroup);

  return burnerGroup;
}

function createModule3MeltingAndBoiling() {
  module3Group = new THREE.Group();
  module3Group.position.set(-5.6, 0.4, 0.0);
  module3Group.scale.set(0.001, 0.001, 0.001);
  module3Group.visible = false;

  // Add realistic laboratory burner station
  const burner = createRealisticAlcoholBurner();
  module3Group.add(burner);

  // Add 3D Holographic Temperature-Time Graph (Hình 1.5 SGK)
  const graph = create3DTemperatureGraph();
  module3Group.add(graph);

  scene.add(module3Group);
}

function toggleModule3Popup() {
  isMeltingPopped = !isMeltingPopped;
  const btn = document.getElementById('btnToggleMelting3D');
  const btnPlay = document.getElementById('btnDockMelting');
  const lbl = document.getElementById('lblMeltingTempDisplay');

  if (isMeltingPopped) {
    popOut3D(module3Group);
    if (btn) btn.textContent = "✕ Thu Gọn Đèn Cồn & Đồ Thị";
    if (btnPlay) btnPlay.style.display = 'inline-block';
    if (lbl) lbl.style.display = 'inline-block';
    if (hotspotMelting) hotspotMelting.material.map = createMarginTabCanvas('Thu Gọn Đèn Cồn', '✕', '#ff5252');
  } else {
    foldIn3D(module3Group);
    if (btn) btn.textContent = "🔥 Mở Đèn Cồn & Đồ Thị 3D (Đang gập)";
    if (btnPlay) btnPlay.style.display = 'none';
    if (lbl) lbl.style.display = 'none';
    if (hotspotMelting) hotspotMelting.material.map = createMarginTabCanvas('Đèn Cồn & Đồ Thị Sôi', '🔥', '#ff7043');
  }
}

function playMeltingTimeline() {
  if (isMeltingTimelineRunning) return;
  if (!isMeltingPopped) toggleModule3Popup();

  isMeltingTimelineRunning = true;
  meltingProgress = 0;
  playSound('pop');

  const btn = document.getElementById('btnDockMelting');
  const lbl = document.getElementById('lblMeltingTempDisplay');
  if (btn) btn.textContent = "⏳ Đang Đun Lửa...";

  const intv = setInterval(() => {
    meltingProgress += 0.012;

    const currIdx = Math.min(GRAPH_TOTAL_PTS - 1, Math.floor(meltingProgress * GRAPH_TOTAL_PTS));
    if (graphLineGeom) graphLineGeom.setDrawRange(0, currIdx + 1);

    if (graphCursorMesh && graphCurvePoints[currIdx]) {
      graphCursorMesh.position.copy(graphCurvePoints[currIdx]);
    }

    if (meltingProgress < 0.55) {
      // Phase 1: Warming up from 20°C to 100°C (Đoạn AB xiên dốc)
      meltingStage = 1;
      const t = Math.round(20 + (meltingProgress / 0.55) * 80);
      if (lbl) lbl.innerHTML = `${t}°C (Đang đun nóng)`;
      if (steamGroup) steamGroup.visible = false;
      if (flameMesh) flameMesh.scale.set(1.2, 1.3, 1.2);
      if (beakerWaterMesh) beakerWaterMesh.material.color.setHex(0x29b6f6);

      updateGraphStatusBadge(
        t,
        `Đoạn AB: Nước nhận nhiệt lượng từ đèn cồn`,
        `Nhiệt độ tăng nhanh từ 20°C lên 100°C (Độ dốc lớn)`
      );

    } else if (meltingProgress <= 1.0) {
      // Phase 2: Boiling at 100°C - Constant temperature (Đoạn BC nằm ngang)
      meltingStage = 2;
      const t = 100;
      if (lbl) lbl.innerHTML = `100°C (NƯỚC SÔI - T KHÔNG ĐỔI)`;
      if (steamGroup) steamGroup.visible = true;
      if (flameMesh) flameMesh.scale.set(1.4, 1.6, 1.4);
      if (beakerWaterMesh) beakerWaterMesh.material.color.setHex(0x0288d1);

      updateGraphStatusBadge(
        100,
        `Đoạn BC: Nước sôi & chuyển thể (Lỏng -> Khí)`,
        `Nhiệt độ KHÔNG ĐỔI (100°C) dù đèn cồn liên tục cấp nhiệt!`
      );

    } else {
      clearInterval(intv);
      isMeltingTimelineRunning = false;
      if (btn) btn.textContent = "🔄 Đun Lại";
      updateGraphStatusBadge(
        100,
        `Hoàn tất khảo sát Hình 1.5 SGK Vật lí 12`,
        `Năng lượng cung cấp dùng để bẻ gãy liên kết phân tử khi hoá hơi!`
      );
    }
  }, 50);
}

function runBoilingGraphAnim() {
  playMeltingTimeline();
}


// ============================================================================
// 11. MODULE 4: MẠNG TINH THỂ NACL 3D (TRANG 9)
// ============================================================================
let naclBadgeMesh = null;
let naclPivotGroup = null;

function createModule4NaclCrystal() {
  naclGroup = new THREE.Group();
  // Anchored on Page 8 directly over Figure 1.6 (Tinh thể muối ăn)
  naclGroup.position.set(-2.06, 1.85, 4.95);
  naclGroup.scale.set(0.001, 0.001, 0.001);
  naclGroup.visible = false;

  // Pivot group for rotating crystal lattice
  naclPivotGroup = new THREE.Group();
  naclGroup.add(naclPivotGroup);

  // Ions: Na+ (small, cyan/blue) & Cl- (larger, emerald green)
  const naGeom = new THREE.SphereGeometry(0.095, 14, 14);
  const naMat = new THREE.MeshStandardMaterial({
    color: 0x00e5ff,
    emissive: 0x00838f,
    emissiveIntensity: 0.8,
    roughness: 0.15,
    metalness: 0.2
  });

  const clGeom = new THREE.SphereGeometry(0.155, 14, 14);
  const clMat = new THREE.MeshStandardMaterial({
    color: 0x00e676,
    emissive: 0x00c853,
    emissiveIntensity: 0.8,
    roughness: 0.15,
    metalness: 0.2
  });

  const dim = 3, sp = 0.50, off = (dim - 1) * sp / 2;
  for (let x = 0; x < dim; x++) {
    for (let y = 0; y < dim; y++) {
      for (let z = 0; z < dim; z++) {
        const isNa = (x + y + z) % 2 === 0;
        const m = new THREE.Mesh(isNa ? naGeom : clGeom, isNa ? naMat : clMat);
        m.position.set(x * sp - off, y * sp - off, z * sp - off);
        naclPivotGroup.add(m);
      }
    }
  }

  // Connecting crystal struts
  const linePos = [];
  for (let x = 0; x < dim; x++) {
    for (let y = 0; y < dim; y++) {
      for (let z = 0; z < dim; z++) {
        const p1 = new THREE.Vector3(x * sp - off, y * sp - off, z * sp - off);
        if (x < dim - 1) linePos.push(p1.x, p1.y, p1.z, p1.x + sp, p1.y, p1.z);
        if (y < dim - 1) linePos.push(p1.x, p1.y, p1.z, p1.x, p1.y + sp, p1.z);
        if (z < dim - 1) linePos.push(p1.x, p1.y, p1.z, p1.x, p1.y, p1.z + sp);
      }
    }
  }
  const bGeom = new THREE.BufferGeometry();
  bGeom.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
  const bMesh = new THREE.LineSegments(
    bGeom,
    new THREE.LineBasicMaterial({ color: 0x80deea, opacity: 0.85, transparent: true })
  );
  naclPivotGroup.add(bMesh);

  // Floating billboard title badge above the NaCl crystal (stays facing camera)
  naclBadgeMesh = createStateHeaderBadge(
    '💎 HÌNH 1.6: TINH THỂ MUỐI ĂN (NaCl)',
    'Ion Na⁺ (nhỏ, xanh) xen kẽ Ion Cl⁻ (lớn, lục)',
    '#00e5ff'
  );
  naclBadgeMesh.position.set(0, 0.95, 0);
  naclGroup.add(naclBadgeMesh);

  scene.add(naclGroup);
}

function toggleModule4Popup() {
  isNaclPopped = !isNaclPopped;
  const btn = document.getElementById('btnToggleNacl3D');

  if (isNaclPopped) {
    popOut3D(naclGroup);
    if (btn) btn.textContent = "✕ Thu Gọn NaCl";
    if (hotspotNacl) hotspotNacl.material.map = createMarginTabCanvas('Thu Gọn NaCl', '✕', '#ff5252');
    flyCameraTo(-2.06, 1.4, 4.95, -2.06, 4.6, 8.8, 850);
  } else {
    foldIn3D(naclGroup);
    if (btn) btn.textContent = "💎 Mở Mạng Tinh Thể NaCl (Đang gập)";
    if (hotspotNacl) hotspotNacl.material.map = createMarginTabCanvas('Tinh Thể Muối NaCl', '💎', '#00b0ff');
    flyCameraTo(0, 1.2, 0, 0, 22, 23, 750);
  }
}

function runBoilingGraphAnim() {
  playSound('pop');
  alert("Hình 1.5: Đoạn BC nằm ngang ở 100°C: Năng lượng cung cấp dùng để bẻ gãy liên kết phân tử, nhiệt độ nước không đổi!");
}


// ============================================================================
// 12. GENERAL POP-UP & FOLD-IN SPRING ANIMATIONS
// ============================================================================
// ============================================================================
// 12. MODULE 5: THỂ PLASMA 3D POP-UP (HÌNH 1.8 TRÊN TRANG 9)
// ============================================================================
let plasmaBadgeMesh = null;
let plasmaPivotGroup = null;
let plasmaIonParticles = [];
let plasmaElectronParticles = [];
let plasmaLoopStreams = [];
let plasmaFlareParticles = [];
let sunCoreMesh, sunCoronaMesh, sunTexCanvas, sunTexture;

function createSolarTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Radial fiery gradient
  const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
  grad.addColorStop(0, '#fff59d');
  grad.addColorStop(0.25, '#ffa726');
  grad.addColorStop(0.65, '#ff3d00');
  grad.addColorStop(0.92, '#b71c1c');
  grad.addColorStop(1, '#3e0600');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Solar granules & turbulent convection cells
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 4 + Math.random() * 16;
    ctx.fillStyle = Math.random() > 0.4 ? 'rgba(255, 235, 59, 0.45)' : 'rgba(183, 28, 28, 0.55)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Sunspot magnetic clusters
  for (let s = 0; s < 6; s++) {
    const sx = 120 + Math.random() * 270;
    const sy = 120 + Math.random() * 270;
    ctx.fillStyle = 'rgba(33, 4, 0, 0.85)';
    ctx.beginPath();
    ctx.arc(sx, sy, 10 + Math.random() * 12, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function createModule5Plasma() {
  plasmaGroup = new THREE.Group();
  // Anchored directly over Figure 1.8 on Page 9
  plasmaGroup.position.set(7.66, 1.45, 3.50);
  plasmaGroup.scale.set(0.001, 0.001, 0.001);
  plasmaGroup.visible = false;

  plasmaPivotGroup = new THREE.Group();
  plasmaGroup.add(plasmaPivotGroup);

  plasmaIonParticles = [];
  plasmaElectronParticles = [];
  plasmaLoopStreams = [];
  plasmaFlareParticles = [];

  // 1. Sun Surface Base with realistic turbulent solar texture
  const sunGeom = new THREE.SphereGeometry(0.68, 32, 24);
  sunTexture = createSolarTexture();
  const sunMat = new THREE.MeshStandardMaterial({
    map: sunTexture,
    emissive: 0xff5722,
    emissiveMap: sunTexture,
    emissiveIntensity: 0.85,
    roughness: 0.4,
    metalness: 0.1
  });
  sunCoreMesh = new THREE.Mesh(sunGeom, sunMat);
  plasmaPivotGroup.add(sunCoreMesh);

  // Outer Corona Glow Shell
  const coronaGeom = new THREE.SphereGeometry(0.82, 24, 24);
  const coronaMat = new THREE.MeshBasicMaterial({
    color: 0xff6d00,
    transparent: true,
    opacity: 0.22,
    blending: THREE.AdditiveBlending
  });
  sunCoronaMesh = new THREE.Mesh(coronaGeom, coronaMat);
  plasmaPivotGroup.add(sunCoronaMesh);

  // 2. Coronal Magnetic Plasma Loops (Leaping arches)
  function createCoronalLoop(radius, tube, rotZ, rotY, colorHex) {
    const loopGeom = new THREE.TorusGeometry(radius, tube, 12, 36, Math.PI);
    const loopMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const loopMesh = new THREE.Mesh(loopGeom, loopMat);
    loopMesh.rotation.z = rotZ;
    loopMesh.rotation.y = rotY;
    loopMesh.position.y = 0.22;
    plasmaPivotGroup.add(loopMesh);

    // 6 Plasma flow beads running along the coronal loop
    const beadGeom = new THREE.SphereGeometry(tube * 1.9, 8, 8);
    const beadMat = new THREE.MeshBasicMaterial({ color: 0xffea00, blending: THREE.AdditiveBlending });
    const beads = [];
    for (let i = 0; i < 6; i++) {
      const bead = new THREE.Mesh(beadGeom, beadMat);
      plasmaPivotGroup.add(bead);
      beads.push(bead);
    }
    plasmaLoopStreams.push({ radius, rotZ, rotY, posY: 0.22, beads, speed: 0.95 });
  }

  // 3 Large dramatic coronal loops bursting into space
  createCoronalLoop(0.85, 0.032, 0, 0, 0xff9100);
  createCoronalLoop(0.78, 0.028, -Math.PI / 5, Math.PI / 3.5, 0xffab00);
  createCoronalLoop(0.80, 0.028, Math.PI / 5, -Math.PI / 3.5, 0xff6d00);

  // 3. Microscopic Ionized Cloud: Positive Ions (Ion+) & Free Electrons (e-)
  // 16 Positive Ions (warm glowing orange-red spheres)
  const ionGeom = new THREE.SphereGeometry(0.060, 12, 12);
  const ionMat = new THREE.MeshStandardMaterial({
    color: 0xff3d00,
    emissive: 0xff1744,
    emissiveIntensity: 0.95
  });
  for (let i = 0; i < 16; i++) {
    const mesh = new THREE.Mesh(ionGeom, ionMat);
    const pos = new THREE.Vector3(
      (Math.random() - 0.5) * 1.4,
      0.35 + Math.random() * 0.9,
      (Math.random() - 0.5) * 1.4
    );
    mesh.position.copy(pos);
    const vel = new THREE.Vector3((Math.random() - 0.5) * 0.04, (Math.random() - 0.5) * 0.04, (Math.random() - 0.5) * 0.04);
    plasmaIonParticles.push({ mesh, pos, vel });
    plasmaPivotGroup.add(mesh);
  }

  // 26 Free Electrons (sparkling electric cyan sparks)
  const eGeom = new THREE.SphereGeometry(0.026, 8, 8);
  const eMat = new THREE.MeshBasicMaterial({
    color: 0x00e5ff,
    blending: THREE.AdditiveBlending
  });
  for (let i = 0; i < 26; i++) {
    const mesh = new THREE.Mesh(eGeom, eMat);
    const baseIon = plasmaIonParticles[i % plasmaIonParticles.length];
    const offset = new THREE.Vector3((Math.random() - 0.5) * 0.35, (Math.random() - 0.5) * 0.35, (Math.random() - 0.5) * 0.35);
    plasmaElectronParticles.push({
      mesh,
      baseIon,
      offset,
      speed: 4.5 + Math.random() * 4.0,
      phase: Math.random() * Math.PI * 2
    });
    plasmaPivotGroup.add(mesh);
  }

  // 4. Solar Flare Eruptive Sparks (Bùng nổ hạt nhật hoa)
  const flareGeom = new THREE.SphereGeometry(0.040, 8, 8);
  const flareMat = new THREE.MeshBasicMaterial({ color: 0xffea00, blending: THREE.AdditiveBlending });
  for (let i = 0; i < 18; i++) {
    const mesh = new THREE.Mesh(flareGeom, flareMat);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 0.45;
    const dir = new THREE.Vector3(Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta)).normalize();
    plasmaFlareParticles.push({
      mesh,
      dir,
      dist: 0.70 + Math.random() * 0.9,
      speed: 0.025 + Math.random() * 0.035
    });
    plasmaPivotGroup.add(mesh);
  }

  // 5. Billboard Header Badge (Optimized sizing & high contrast)
  const bCanvas = document.createElement('canvas');
  bCanvas.width = 600;
  bCanvas.height = 135;
  const bctx = bCanvas.getContext('2d');
  bctx.fillStyle = 'rgba(10, 6, 20, 0.94)';
  bctx.strokeStyle = '#ff9100';
  bctx.lineWidth = 4;
  bctx.beginPath();
  if (bctx.roundRect) bctx.roundRect(8, 8, 584, 119, 24);
  else bctx.rect(8, 8, 584, 119);
  bctx.fill();
  bctx.stroke();

  bctx.fillStyle = '#ffb74d';
  bctx.font = 'bold 30px "Montserrat", Arial, sans-serif';
  bctx.textAlign = 'center';
  bctx.fillText('⚡ THỂ PLASMA (TRẠNG THÁI THỨ TƯ)', 300, 48);

  bctx.fillStyle = '#ffffff';
  bctx.font = '600 20px "Segoe UI", Arial, sans-serif';
  bctx.fillText('Khí ion hoá toàn phần • > 99% vật chất vũ trụ • T > 10⁶ K', 300, 92);

  const bTex = new THREE.CanvasTexture(bCanvas);
  plasmaBadgeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.35, 0.53),
    new THREE.MeshBasicMaterial({ map: bTex, transparent: true, side: THREE.DoubleSide })
  );
  plasmaBadgeMesh.position.set(0, 1.48, 0);
  plasmaGroup.add(plasmaBadgeMesh);

  scene.add(plasmaGroup);
}


const PLASMA_SPEECH_TEXT = "Ở nhiệt độ hàng triệu độ, chất không tồn tại ở các thể rắn, lỏng, khí mà ở một thể đặc biệt gọi là Plasma. Ở thể này, các va chạm nhiệt dữ dội làm cho ê léc tron bứt hoàn toàn khỏi hạt nhân nguyên tử, tạo thành hỗn hợp gồm các ion dương và các ê léc tron tự do chuyển động hỗn loạn. Plasma rất ít gặp tự nhiên trên Trái Đất, ngoại trừ tia sét và cực quang, nhưng trong toàn vũ trụ có tới trên 99% các chất tồn tại ở thể Plasma, chính là Mặt Trời và các vì sao!";

let plasmaUtterance = null;

function speakPlasmaExplanation() {
  if (!('speechSynthesis' in window)) return;
  if (!isAudioEnabled) return;

  if (synth.speaking) synth.cancel();

  plasmaUtterance = new SpeechSynthesisUtterance(PLASMA_SPEECH_TEXT);
  if (availableVoices.length === 0) availableVoices = synth.getVoices();
  const vi = availableVoices.find(v => v.lang && (v.lang.includes('vi') || v.lang.includes('VIE')));
  if (vi) plasmaUtterance.voice = vi;
  plasmaUtterance.rate = 0.95;

  const wave = document.getElementById('plasmaVoiceWave');
  plasmaUtterance.onstart = () => { if (wave) wave.classList.add('active'); };
  plasmaUtterance.onend = () => { if (wave) wave.classList.remove('active'); };
  plasmaUtterance.onerror = () => { if (wave) wave.classList.remove('active'); };

  synth.speak(plasmaUtterance);
}

function stopPlasmaSpeech() {
  if ('speechSynthesis' in window && synth.speaking) {
    synth.cancel();
  }
  const wave = document.getElementById('plasmaVoiceWave');
  if (wave) wave.classList.remove('active');
}

function togglePlasmaPopup() {
  isPlasmaPopped = !isPlasmaPopped;
  const btn = document.getElementById('btnTogglePlasma3D');

  if (isPlasmaPopped) {
    popOut3D(plasmaGroup);
    playSound('pop');
    if (btn) btn.textContent = "✕ Thu Gọn Plasma";
    if (hotspotPlasma) hotspotPlasma.material.map = createMarginTabCanvas('Thu Gọn Plasma', '✕', '#ff5252');
    showPlasmaDetailCard();
    setTimeout(speakPlasmaExplanation, 300);
    flyCameraTo(6.2, 1.45, 3.50, 6.2, 4.6, 7.6, 850);
  } else {
    foldIn3D(plasmaGroup);
    stopPlasmaSpeech();
    closePlasmaDetailCard();
    if (btn) btn.textContent = "⚡ Mở Luồng Plasma 3D (Đang gập)";
    if (hotspotPlasma) hotspotPlasma.material.map = createMarginTabCanvas('Thể Plasma Mặt Trời', '⚡', '#ff9100');
    flyCameraTo(0, 1.2, 0, 0, 22, 23, 750);
  }
}

function showPlasmaDetailCard() {
  const card = document.getElementById('plasmaDetailCard');
  if (card) {
    card.classList.add('active');
    playSound('pop');
  }
}

function closePlasmaDetailCard() {
  stopPlasmaSpeech();
  const card = document.getElementById('plasmaDetailCard');
  if (card) card.classList.remove('active');
}


// ============================================================================
// 10. MODULE 6: POP-UP 3D HÌNH 1.7 ĐỒ THỊ NÓNG CHẢY CHẤT RẮN KẾT TINH (TRANG 9)
// ============================================================================

function createModule6MeltingGraph() {
  meltingGraphGroup = new THREE.Group();
  // Anchored right over Figure 1.7 in the upper half of Page 9
  meltingGraphGroup.position.set(7.36, 1.45, -3.64);
  meltingGraphGroup.scale.set(0.001, 0.001, 0.001);
  meltingGraphGroup.visible = false;

  meltingGraphPivotGroup = new THREE.Group();
  // Slight forward tilt toward camera for optimal isometric perspective
  meltingGraphPivotGroup.rotation.x = -Math.PI * 0.12;
  meltingGraphGroup.add(meltingGraphPivotGroup);

  meltingBillboardBadges = [];
  meltingSampleMolecules = [];
  meltingSampleBonds = [];
  meltingPulseRings = [];

  // -------------------------------------------------------------
  // A. HOLOGRAPHIC GRAPH BACKING PLATE
  // -------------------------------------------------------------
  const plateGeom = new THREE.BoxGeometry(4.7, 3.2, 0.08);
  const plateMat = new THREE.MeshPhysicalMaterial({
    color: 0x07111e,
    transparent: true,
    opacity: 0.88,
    roughness: 0.2,
    metalness: 0.15,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1
  });
  const plateMesh = new THREE.Mesh(plateGeom, plateMat);
  plateMesh.userData = { isMeltingGraph: true };
  meltingGraphPivotGroup.add(plateMesh);

  // Holographic Glowing Cyan Rim
  const rimGeom = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-2.35, -1.6, 0.05),
    new THREE.Vector3(2.35, -1.6, 0.05),
    new THREE.Vector3(2.35, 1.6, 0.05),
    new THREE.Vector3(-2.35, 1.6, 0.05),
    new THREE.Vector3(-2.35, -1.6, 0.05)
  ]);
  const rimMat = new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.85 });
  const rimLine = new THREE.Line(rimGeom, rimMat);
  meltingGraphPivotGroup.add(rimLine);

  // Subtle coordinate grid on plate
  const gridMat = new THREE.LineDashedMaterial({
    color: 0x1a4666,
    dashSize: 0.1,
    gapSize: 0.08,
    transparent: true,
    opacity: 0.4
  });
  for (let gy = -1.0; gy <= 1.2; gy += 0.5) {
    const pts = [new THREE.Vector3(-2.1, gy, 0.045), new THREE.Vector3(2.1, gy, 0.045)];
    const gGeom = new THREE.BufferGeometry().setFromPoints(pts);
    const gl = new THREE.Line(gGeom, gridMat);
    gl.computeLineDistances();
    meltingGraphPivotGroup.add(gl);
  }
  for (let gx = -1.5; gx <= 1.9; gx += 0.7) {
    const pts = [new THREE.Vector3(gx, -1.3, 0.045), new THREE.Vector3(gx, 1.3, 0.045)];
    const gGeom = new THREE.BufferGeometry().setFromPoints(pts);
    const gl = new THREE.Line(gGeom, gridMat);
    gl.computeLineDistances();
    meltingGraphPivotGroup.add(gl);
  }

  // -------------------------------------------------------------
  // B. 3D NEON AXES (T - Nhiệt độ & t - Thời gian)
  // -------------------------------------------------------------
  const axisMatT = new THREE.MeshStandardMaterial({
    color: 0xff5252,
    emissive: 0xff1744,
    emissiveIntensity: 0.7,
    roughness: 0.3
  });
  const axisMatTime = new THREE.MeshStandardMaterial({
    color: 0x00e5ff,
    emissive: 0x00b0ff,
    emissiveIntensity: 0.7,
    roughness: 0.3
  });

  // Vertical axis T (°C)
  const axisT = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 2.5, 16), axisMatT);
  axisT.position.set(-1.8, 0.05, 0.06);
  meltingGraphPivotGroup.add(axisT);

  const arrowConeT = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.18, 16), axisMatT);
  arrowConeT.position.set(-1.8, 1.35, 0.06);
  meltingGraphPivotGroup.add(arrowConeT);

  // Horizontal axis t (s)
  const axisTime = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 3.8, 16), axisMatTime);
  axisTime.rotation.z = -Math.PI / 2;
  axisTime.position.set(0.05, -1.15, 0.06);
  meltingGraphPivotGroup.add(axisTime);

  const arrowConeTime = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.18, 16), axisMatTime);
  arrowConeTime.rotation.z = -Math.PI / 2;
  arrowConeTime.position.set(2.0, -1.15, 0.06);
  meltingGraphPivotGroup.add(arrowConeTime);

  // Axis Labels (Billboard mini badges)
  const badgeT = createSimpleTextBadge('T (°C)', '#ff5252');
  badgeT.position.set(-1.8, 1.55, 0.12);
  meltingGraphPivotGroup.add(badgeT);
  // badgeT sits on plate

  const badgeTime = createSimpleTextBadge('t (thời gian)', '#00e5ff');
  badgeTime.position.set(2.15, -1.15, 0.12);
  meltingGraphPivotGroup.add(badgeTime);
  // badgeTime sits on plate

  // Marked point tc (Melting Point) on T-axis
  const badgeTc = createSimpleTextBadge('tc (Nhiệt độ nóng chảy)', '#ffd700');
  badgeTc.position.set(-1.0, 0.05, 0.12);
  meltingGraphPivotGroup.add(badgeTc);
  // badgeTc sits on plate

  // Glowing dashed line at T = tc
  const tcLineGeom = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-1.8, 0.05, 0.055),
    new THREE.Vector3(0.85, 0.05, 0.055)
  ]);
  const tcLineMat = new THREE.LineDashedMaterial({
    color: 0xffd700,
    dashSize: 0.12,
    gapSize: 0.08,
    transparent: true,
    opacity: 0.85
  });
  const tcLine = new THREE.Line(tcLineGeom, tcLineMat);
  tcLine.computeLineDistances();
  meltingGraphPivotGroup.add(tcLine);

  // -------------------------------------------------------------
  // C. 3 CURVE SEGMENTS (a: Rắn nóng lên, b: Đang nóng chảy nằm ngang, c: Lỏng nóng lên)
  // -------------------------------------------------------------
  meltingP0 = new THREE.Vector3(-1.75, -0.95, 0.07);
  meltingP1 = new THREE.Vector3(-0.75, 0.05, 0.07);
  meltingP2 = new THREE.Vector3(0.75, 0.05, 0.07); // Exact horizontal plateau at y = 0.05!
  meltingP3 = new THREE.Vector3(1.75, 1.05, 0.07);

  // Segment A: Solid heating up (T < tc)
  const tubeMatA = new THREE.MeshStandardMaterial({
    color: 0xffb300,
    emissive: 0xff8f00,
    emissiveIntensity: 0.8,
    roughness: 0.3
  });
  const segCurveA = new THREE.LineCurve3(meltingP0, meltingP1);
  const segTubeA = new THREE.Mesh(new THREE.TubeGeometry(segCurveA, 20, 0.038, 12, false), tubeMatA);
  meltingGraphPivotGroup.add(segTubeA);

  const badgeSegA = createSimpleTextBadge('a: Rắn nóng lên', '#ffb300');
  badgeSegA.position.set(-1.25, -0.40, 0.15);
  meltingGraphPivotGroup.add(badgeSegA);
  // badgeSegA sits on plate

  // Segment B: Melting Plateau (T = tc KHÔNG ĐỔI!)
  const tubeMatB = new THREE.MeshStandardMaterial({
    color: 0x00e5ff,
    emissive: 0x00e5ff,
    emissiveIntensity: 1.1,
    roughness: 0.2
  });
  const segCurveB = new THREE.LineCurve3(meltingP1, meltingP2);
  const segTubeB = new THREE.Mesh(new THREE.TubeGeometry(segCurveB, 24, 0.048, 12, false), tubeMatB);
  meltingGraphPivotGroup.add(segTubeB);

  // Glowing pulsating energy rings on Segment B (horizontal plateau)
  for (let r = 0; r < 4; r++) {
    const ringGeom = new THREE.TorusGeometry(0.11, 0.016, 8, 20);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.rotation.y = Math.PI / 2;
    ringMesh.position.set(-0.55 + r * 0.38, 0.05, 0.07);
    meltingGraphPivotGroup.add(ringMesh);
    meltingPulseRings.push(ringMesh);
  }

  const badgeSegB = createSimpleTextBadge('b: ĐANG NÓNG CHẢY (T = tc KHÔNG ĐỔI)', '#00ffff', 2.5, 0.36);
  badgeSegB.position.set(0.0, 0.38, 0.10);
  meltingGraphPivotGroup.add(badgeSegB);
  // badgeSegB sits on plate

  // Segment C: Liquid heating up (T > tc)
  const tubeMatC = new THREE.MeshStandardMaterial({
    color: 0xff3d00,
    emissive: 0xdd2c00,
    emissiveIntensity: 0.8,
    roughness: 0.3
  });
  const segCurveC = new THREE.LineCurve3(meltingP2, meltingP3);
  const segTubeC = new THREE.Mesh(new THREE.TubeGeometry(segCurveC, 20, 0.038, 12, false), tubeMatC);
  meltingGraphPivotGroup.add(segTubeC);

  const badgeSegC = createSimpleTextBadge('c: Lỏng nóng lên', '#ff3d00');
  badgeSegC.position.set(1.30, 0.60, 0.15);
  meltingGraphPivotGroup.add(badgeSegC);
  // badgeSegC sits on plate

  // -------------------------------------------------------------
  // D. DYNAMIC TRAVELING CURSOR BEAD & LIGHT
  // -------------------------------------------------------------
  const cursorGeom = new THREE.SphereGeometry(0.09, 20, 20);
  const cursorMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x00ffff,
    emissiveIntensity: 2.2,
    roughness: 0.1
  });
  meltingGraphCursor = new THREE.Mesh(cursorGeom, cursorMat);
  meltingGraphCursor.position.copy(meltingP0);
  meltingGraphPivotGroup.add(meltingGraphCursor);

  meltingGraphCursorLight = new THREE.PointLight(0x00e5ff, 2.2, 2.8);
  meltingGraphCursor.add(meltingGraphCursorLight);

  // Halo ripple ring around cursor
  const rippleGeom = new THREE.RingGeometry(0.12, 0.17, 24);
  const rippleMat = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.75
  });
  const rippleMesh = new THREE.Mesh(rippleGeom, rippleMat);
  meltingGraphCursor.add(rippleMesh);

  // -------------------------------------------------------------
  // E. REAL-TIME STAGE STATUS DISPLAY BADGE (Above Graph)
  // -------------------------------------------------------------
  meltingStatusCanvas = document.createElement('canvas');
  meltingStatusCanvas.width = 1024;
  meltingStatusCanvas.height = 140;
  meltingStatusTexture = new THREE.CanvasTexture(meltingStatusCanvas);

  const statusMat = new THREE.MeshBasicMaterial({
    map: meltingStatusTexture,
    transparent: true,
    opacity: 0.96
  });
  meltingStatusMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.52), statusMat);
  meltingStatusMesh.position.set(0.0, 1.18, 0.12);
  meltingGraphPivotGroup.add(meltingStatusMesh);
  meltingBillboardBadges.push(meltingStatusMesh);
  updateMeltingStatusCanvas(0);

  // -------------------------------------------------------------
  // F. MICROSCOPIC MOLECULAR CHAMBER (Beside the graph)
  // -------------------------------------------------------------
  meltingChamberGroup = new THREE.Group();
  meltingChamberGroup.position.set(2.45, -0.05, 0.15);
  meltingChamberGroup.scale.set(0.85, 0.85, 0.85);
  meltingGraphPivotGroup.add(meltingChamberGroup);

  // Glass Cylinder Chamber
  const chamberGeom = new THREE.CylinderGeometry(0.55, 0.55, 2.1, 24);
  const chamberMat = new THREE.MeshPhysicalMaterial({
    color: 0x0a223a,
    transparent: true,
    opacity: 0.35,
    roughness: 0.1,
    metalness: 0.2,
    transmission: 0.85,
    ior: 1.4
  });
  const chamberMesh = new THREE.Mesh(chamberGeom, chamberMat);
  meltingChamberGroup.add(chamberMesh);

  // Metallic caps
  const capMat = new THREE.MeshStandardMaterial({ color: 0x4a6572, metalness: 0.8, roughness: 0.3 });
  const topCap = new THREE.Mesh(new THREE.CylinderGeometry(0.60, 0.60, 0.12, 24), capMat);
  topCap.position.y = 1.06;
  meltingChamberGroup.add(topCap);

  const btmCap = new THREE.Mesh(new THREE.CylinderGeometry(0.60, 0.60, 0.12, 24), capMat);
  btmCap.position.y = -1.06;
  meltingChamberGroup.add(btmCap);

  // Chamber Badge
  const chamberBadge = createSimpleTextBadge('Kính Vi Mô: Tinh Thể -> Lỏng', '#4fc3f7');
  chamberBadge.position.set(0, 1.35, 0);
  meltingChamberGroup.add(chamberBadge);
  // chamberBadge sits on cap

  // 3x3x3 Molecular Lattice inside chamber
  const molGeom = new THREE.SphereGeometry(0.065, 12, 12);
  const molMat = new THREE.MeshStandardMaterial({
    color: 0x29b6f6,
    emissive: 0x0288d1,
    emissiveIntensity: 0.5,
    roughness: 0.3
  });

  const spacing = 0.24;
  for (let ix = -1; ix <= 1; ix++) {
    for (let iy = -1; iy <= 1; iy++) {
      for (let iz = -1; iz <= 1; iz++) {
        const molMesh = new THREE.Mesh(molGeom, molMat.clone());
        const base = new THREE.Vector3(ix * spacing, iy * spacing, iz * spacing);
        molMesh.position.copy(base);
        meltingChamberGroup.add(molMesh);

        meltingSampleMolecules.push({
          mesh: molMesh,
          basePos: base.clone(),
          currentPos: base.clone(),
          vel: new THREE.Vector3((Math.random() - 0.5) * 0.015, (Math.random() - 0.5) * 0.015, (Math.random() - 0.5) * 0.015),
          phase: Math.random() * Math.PI * 2
        });
      }
    }
  }

  // Connecting Bonds between adjacent lattice molecules
  const bondMat = new THREE.MeshStandardMaterial({
    color: 0x81d4fa,
    transparent: true,
    opacity: 0.75,
    roughness: 0.4
  });
  for (let i = 0; i < meltingSampleMolecules.length; i++) {
    for (let j = i + 1; j < meltingSampleMolecules.length; j++) {
      const p1 = meltingSampleMolecules[i].basePos;
      const p2 = meltingSampleMolecules[j].basePos;
      if (p1.distanceTo(p2) < spacing * 1.15) {
        const bondMesh = createCylinderBond(p1, p2, 0.015, bondMat.clone());
        meltingChamberGroup.add(bondMesh);
        meltingSampleBonds.push({ mesh: bondMesh, idx1: i, idx2: j });
      }
    }
  }

  // -------------------------------------------------------------
  // G. BILLBOARD HEADER BADGE
  // -------------------------------------------------------------
  const headerMat = new THREE.MeshBasicMaterial({
    map: createBadgeCanvas('Hình 1.7: Đồ Thị Nóng Chảy Chất Rắn Kết Tinh', '📈', '#00e5ff', 840),
    transparent: true,
    opacity: 0.96
  });
  const headerMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.60), headerMat);
  headerMesh.position.set(0.0, 1.62, 0.12);
  meltingGraphPivotGroup.add(headerMesh);
  meltingBillboardBadges.push(headerMesh);

  scene.add(meltingGraphGroup);
}

function createCylinderBond(p1, p2, radius, mat) {
  const dir = new THREE.Vector3().subVectors(p2, p1);
  const len = dir.length();
  const geom = new THREE.CylinderGeometry(radius, radius, len, 8);
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.copy(p1).addScaledVector(dir, 0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  return mesh;
}

function createSimpleTextBadge(text, colorHex, w = 1.6, h = 0.36) {
  const c = document.createElement('canvas');
  c.width = 768;
  c.height = 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = 'rgba(7, 17, 30, 0.92)';
  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect(5, 5, c.width - 10, c.height - 10, 20);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = colorHex;
  ctx.font = 'bold 32px "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, c.width / 2, c.height / 2);

  const tex = new THREE.CanvasTexture(c);
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.96 });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  return mesh;
}

function updateMeltingStatusCanvas(stage) {
  if (!meltingStatusCanvas || lastMeltingStage === stage) return;
  lastMeltingStage = stage;
  const ctx = meltingStatusCanvas.getContext('2d');
  ctx.clearRect(0, 0, meltingStatusCanvas.width, meltingStatusCanvas.height);

  let bgColor = 'rgba(7, 18, 35, 0.94)';
  let borderColor = '#00e5ff';
  let title = '';
  let sub = '';

  if (stage === 0) {
    borderColor = '#ffb300';
    title = '🔥 GIAI ĐOẠN a: T < tc (Chất rắn nhận nhiệt lượng)';
    sub = 'Nhiệt độ tăng dần. Động năng dao động phân tử tại nút mạng tăng mạnh.';
  } else if (stage === 1) {
    borderColor = '#00ffff';
    title = '⚡ GIAI ĐOẠN b: T = tc KHÔNG ĐỔI! (Đoạn nằm ngang đặc trưng)';
    sub = 'Nhiệt lượng cung cấp dùng để BẺ GÃY MẠNG TINH THỂ chuyển sang thể lỏng!';
  } else {
    borderColor = '#ff5722';
    title = '💧 GIAI ĐOẠN c: T > tc (Chất lỏng tiếp tục nóng lên)';
    sub = 'Toàn bộ chất rắn đã chuyển thành chất lỏng, nhiệt độ tiếp tục tăng.';
  }

  ctx.fillStyle = bgColor;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect(6, 6, meltingStatusCanvas.width - 12, meltingStatusCanvas.height - 12, 20);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = borderColor;
  ctx.font = 'bold 30px "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, meltingStatusCanvas.width / 2, 50);

  ctx.fillStyle = '#f0f4f8';
  ctx.font = '22px "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(sub, meltingStatusCanvas.width / 2, 98);

  if (meltingStatusTexture) meltingStatusTexture.needsUpdate = true;
}

function toggleMeltingGraphPopup() {
  isMeltingGraphPopped = !isMeltingGraphPopped;
  const btn = document.getElementById('btnToggleMeltingGraph3D');
  const btnPlay = document.getElementById('btnPlayMeltingGraph');

  if (isMeltingGraphPopped) {
    popOut3D(meltingGraphGroup);
    playSound('pop');
    if (btn) btn.textContent = "📦 Thu Gọn Đồ Thị 3D";
    if (btnPlay) btnPlay.style.display = 'inline-block';
    if (hotspotMeltingGraph) hotspotMeltingGraph.material.map = createMarginTabCanvas('Thu Gọn Đồ Thị', '✕', '#ff5252');
    showMeltingGraphDetailCard();
    setTimeout(speakMeltingGraphExplanation, 400);
    // Smoothly fly camera to close-up frontal view of Figure 1.7!
    flyCameraTo(7.36, 1.35, -3.64, 7.36, 5.8, 1.4, 850);
  } else {
    foldIn3D(meltingGraphGroup);
    stopMeltingGraphSpeech();
    closeMeltingGraphDetailCard();
    if (btn) btn.textContent = "📈 Mở Đồ Thị Nóng Chảy 3D (Đang gập)";
    if (btnPlay) btnPlay.style.display = 'none';
    if (hotspotMeltingGraph) hotspotMeltingGraph.material.map = createMarginTabCanvas('Đồ Thị Nóng Chảy 3D', '📈', '#00e5ff');
    // Return to book spread overview
    flyCameraTo(0, 1.2, 0, 0, 22, 23, 750);
  }
}

function playMeltingGraphTimeline() {
  isMeltingGraphPlaying = !isMeltingGraphPlaying;
  const btn = document.getElementById('btnPlayMeltingGraph');
  if (btn) {
    btn.textContent = isMeltingGraphPlaying ? '⏸ Tạm Dừng Tiến Trình' : '▶ Tiếp Tục Tiến Trình';
  }
  playSound('pop');
}

function showMeltingGraphDetailCard() {
  const card = document.getElementById('meltingGraphDetailCard');
  if (card) {
    card.classList.add('active');
    playSound('pop');
  }
}

function closeMeltingGraphDetailCard() {
  stopMeltingGraphSpeech();
  const card = document.getElementById('meltingGraphDetailCard');
  if (card) card.classList.remove('active');
}

function speakMeltingGraphExplanation() {
  if (!isAudioEnabled) return;
  stopMeltingGraphSpeech();
  stopCurrentScientistSpeech();
  stopPlasmaSpeech();

  const text = "Hình 1.7 biểu diễn sự thay đổi nhiệt độ của chất rắn kết tinh khi được làm nóng chảy. " +
    "Đồ thị gồm ba đoạn rõ rệt: " +
    "Đoạn a: chất rắn nhận nhiệt lượng, nhiệt độ tăng dần đến nhiệt độ nóng chảy tê xê. " +
    "Đoạn b là đoạn nằm ngang đặc trưng: trong suốt thời gian nóng chảy, mặc dù tiếp tục đun nóng nhưng nhiệt độ giữ nguyên không đổi ở tê xê. " +
    "Đó là vì toàn bộ nhiệt lượng cung cấp được sử dụng để phá vỡ các liên kết trật tự trong mạng tinh thể chất rắn, chuyển sang thể lỏng mà không làm tăng động năng của các hạt. " +
    "Đoạn c: sau khi nóng chảy hoàn toàn, khối chất lỏng tiếp tục tăng nhiệt độ khi được đun tiếp.";

  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'vi-VN';
    utter.rate = 0.95;
    utter.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(v => v.lang.includes('vi') || v.lang.includes('VIE'));
    if (viVoice) utter.voice = viVoice;

    const wave = document.getElementById('meltingGraphVoiceWave');
    utter.onstart = () => {
      if (wave) wave.classList.add('active');
    };
    utter.onend = () => {
      if (wave) wave.classList.remove('active');
    };
    utter.onerror = () => {
      if (wave) wave.classList.remove('active');
    };

    window.speechSynthesis.speak(utter);
  }
}

function stopMeltingGraphSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  const wave = document.getElementById('meltingGraphVoiceWave');
  if (wave) wave.classList.remove('active');
}

function popOut3D(object3D) {
  object3D.visible = true;
  let startTime = performance.now();
  const duration = 500;
  playSound('pop');

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1.0, elapsed / duration);
    const val = Math.min(1.0, progress * 1.25);
    object3D.scale.set(val, val, val);

    if (progress < 1.0) {
      requestAnimationFrame(step);
    } else {
      object3D.scale.set(1.0, 1.0, 1.0);
    }
  }
  requestAnimationFrame(step);
}

function foldIn3D(object3D) {
  let startTime = performance.now();
  const duration = 350;
  playSound('page');

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1.0, elapsed / duration);
    const val = 1.0 - progress;
    object3D.scale.set(val, val, val);

    if (progress < 1.0) {
      requestAnimationFrame(step);
    } else {
      object3D.scale.set(0.001, 0.001, 0.001);
      object3D.visible = false;
    }
  }
  requestAnimationFrame(step);
}


// ============================================================================
// 13. SPREAD NAVIGATION & TURNING
// ============================================================================
function setSpread(spreadIndex, playAudio = true) {
  currentSpread = spreadIndex;
  if (playAudio) playSound('page');

  // Fold all popped models whenever turning pages
  if (isBrownPopped) toggleModule1Popup();
  if (isBrownHoloPopped) toggleRobertBrownHologram();
  if (isStatesPopped) toggleModule2Popup();
  if (isTrianglePopped) toggleTrianglePopup();
  if (isMeltingPopped) toggleModule3Popup();
  if (isNaclPopped) toggleModule4Popup();
  if (isPlasmaPopped) togglePlasmaPopup();
  if (isMeltingGraphPopped) toggleMeltingGraphPopup();
  closeScientistSpeech();
  closePhaseDetail();

  const tracker = document.getElementById('hudPageTracker');
  const btnPrev = document.getElementById('btnPrevSpread');
  const btnNext = document.getElementById('btnNextSpread');
  const dock1 = document.getElementById('dockSpread1');
  const dock2 = document.getElementById('dockSpread2');

  if (currentSpread === 0) {
    if (tracker) tracker.textContent = "Bìa Sách";
    if (btnPrev) btnPrev.disabled = true;
    if (btnNext) btnNext.disabled = false;
    if (dock1) dock1.classList.remove('active');
    if (dock2) dock2.classList.remove('active');

    frontCoverMesh.visible = true;
    frontCoverMesh.position.y = 0.42;
    leftPageMesh.visible = false;
    rightPageMesh.visible = false;

    // Hotspots
    if (hotspotBrown) hotspotBrown.visible = false;
    if (hotspotHoloBrown) hotspotHoloBrown.visible = false;
    if (hotspotStates) hotspotStates.visible = false;
    if (hotspotTriangle) hotspotTriangle.visible = false;
    if (hotspotMelting) hotspotMelting.visible = false;
    if (hotspotNacl) hotspotNacl.visible = false;
    if (hotspotPlasma) hotspotPlasma.visible = false;
    if (hotspotMeltingGraph) hotspotMeltingGraph.visible = false;

  } else if (currentSpread === 1) {
    // Spread 1 (Pages 6 & 7)
    if (tracker) tracker.textContent = "Trang 6 - 7";
    if (btnPrev) btnPrev.disabled = false;
    if (btnNext) btnNext.disabled = false;
    if (dock1) dock1.classList.add('active');
    if (dock2) dock2.classList.remove('active');

    frontCoverMesh.visible = false;
    frontCoverMesh.position.y = -50.0; // Hide completely below desk
    leftPageMesh.visible = true;
    rightPageMesh.visible = true;
    leftPageMesh.material.map = pageTextures.page6;
    rightPageMesh.material.map = pageTextures.page7;
    leftPageMesh.material.needsUpdate = true;
    rightPageMesh.material.needsUpdate = true;

    // Show margin tabs for Spread 1 (Pages 6 & 7)
    if (hotspotBrown) hotspotBrown.visible = true;
    if (hotspotHoloBrown) hotspotHoloBrown.visible = true;
    if (hotspotStates) hotspotStates.visible = true;
    if (hotspotTriangle) hotspotTriangle.visible = true;
    if (hotspotMelting) hotspotMelting.visible = false;
    if (hotspotNacl) hotspotNacl.visible = false;
    if (hotspotPlasma) hotspotPlasma.visible = false;
    if (hotspotMeltingGraph) hotspotMeltingGraph.visible = false;

  } else if (currentSpread === 2) {
    // Spread 2 (Pages 8 & 9)
    if (tracker) tracker.textContent = "Trang 8 - 9";
    if (btnPrev) btnPrev.disabled = false;
    if (btnNext) btnNext.disabled = true;
    if (dock1) dock1.classList.remove('active');
    if (dock2) dock2.classList.add('active');

    frontCoverMesh.visible = false;
    frontCoverMesh.position.y = -50.0; // Hide completely below desk
    leftPageMesh.visible = true;
    rightPageMesh.visible = true;
    leftPageMesh.material.map = pageTextures.page8;
    rightPageMesh.material.map = pageTextures.page9;
    leftPageMesh.material.needsUpdate = true;
    rightPageMesh.material.needsUpdate = true;

    // Show ONLY margin tabs for Spread 2 (Pages 8 & 9)
    if (hotspotBrown) hotspotBrown.visible = false;
    if (hotspotHoloBrown) hotspotHoloBrown.visible = false;
    if (hotspotStates) hotspotStates.visible = false;
    if (hotspotTriangle) hotspotTriangle.visible = false;
    if (hotspotMelting) hotspotMelting.visible = true;
    if (hotspotNacl) hotspotNacl.visible = true;
    if (hotspotPlasma) hotspotPlasma.visible = true;
    if (hotspotMeltingGraph) hotspotMeltingGraph.visible = true;
  }
}

function goToCover() { setSpread(0); }
function flipPrevSpread() { if (currentSpread > 0) setSpread(currentSpread - 1); }
function flipNextSpread() { if (currentSpread < 2) setSpread(currentSpread + 1); }

function resetCameraView() {
  flyCameraTo(0, 1.2, 0, 0, 22, 23, 750);
  playSound('pop');
}


// ============================================================================
// 14. INTERACTION SYSTEM: DOUBLE-CLICK / DOUBLE-TAP TO TOGGLE POP-UPS
// (Book pages are completely clean without any badges blocking text)
// ============================================================================

let lastPointerTapTime = 0;
let lastPointerTapPos = { x: 0, y: 0 };

function showDoubleTapRipple(clientX, clientY) {
  const ripple = document.createElement('div');
  ripple.className = 'double-tap-ripple';
  ripple.style.left = `${clientX}px`;
  ripple.style.top = `${clientY}px`;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

function handleBookDoubleAction(clientX, clientY) {
  mouse.x = (clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  showDoubleTapRipple(clientX, clientY);

  // Targets to intersect
  const targets = [];

  // A. First check if double-clicked on any ACTIVE POPPED 3D MODEL to collapse/fold it!
  if (isMeltingGraphPopped && meltingGraphGroup && meltingGraphGroup.visible) {
    targets.push(meltingGraphGroup);
  }
  if (isPlasmaPopped && plasmaGroup && plasmaGroup.visible) {
    targets.push(plasmaGroup);
  }
  if (isNaclPopped && naclGroup && naclGroup.visible) {
    targets.push(naclGroup);
  }
  if (isMeltingPopped && module3Group && module3Group.visible) {
    targets.push(module3Group);
  }
  if (isTrianglePopped && triangleModuleGroup && triangleModuleGroup.visible) {
    targets.push(triangleModuleGroup);
  }
  if (isStatesPopped && module2Group && module2Group.visible) {
    targets.push(module2Group);
  }
  if (isBrownPopped && waterDropMesh && waterDropMesh.visible) {
    targets.push(waterDropMesh);
    if (pollenGrainMesh) targets.push(pollenGrainMesh);
  }
  if (isBrownHoloPopped && brownAvatarMesh && brownAvatarMesh.visible) {
    targets.push(brownAvatarMesh);
  }

  // B. Margin Tabs (Nút chạm nổi lề sách) & Book page leaves
  targets.push(...clickableHotspots.filter(h => h && h.visible));

  if (currentSpread === 0) {
    if (frontCoverMesh && frontCoverMesh.visible) targets.push(frontCoverMesh);
  } else {
    if (leftPageMesh && leftPageMesh.visible) targets.push(leftPageMesh);
    if (rightPageMesh && rightPageMesh.visible) targets.push(rightPageMesh);
  }

  const intersects = raycaster.intersectObjects(targets, true);
  if (intersects.length === 0) return;

  const hitObj = intersects[0].object;

    // Check Margin Tab action
  if (hitObj.userData && hitObj.userData.action) {
    const act = hitObj.userData.action;
    if (act === 'toggleBrown') toggleModule1Popup();
    else if (act === 'toggleHoloBrown') toggleRobertBrownHologram();
    else if (act === 'toggleStates') toggleModule2Popup();
    else if (act === 'toggleTriangle') toggleTrianglePopup();
    else if (act === 'toggleMelting') toggleModule3Popup();
    else if (act === 'toggleNacl') toggleModule4Popup();
    else if (act === 'togglePlasma') togglePlasmaPopup();
    else if (act === 'toggleMeltingGraph') toggleMeltingGraphPopup();
    return;
  }

  // 1. Double-click on any active popped 3D model -> TOGGLE OFF (Close/Fold)
  function isDescendantOf(child, parent) {
    let curr = child;
    while (curr) {
      if (curr === parent) return true;
      curr = curr.parent;
    }
    return false;
  }

  if (isMeltingGraphPopped && isDescendantOf(hitObj, meltingGraphGroup)) {
    toggleMeltingGraphPopup();
    return;
  }
  if (isPlasmaPopped && isDescendantOf(hitObj, plasmaGroup)) {
    togglePlasmaPopup();
    return;
  }
  if (isNaclPopped && isDescendantOf(hitObj, naclGroup)) {
    toggleModule4Popup();
    return;
  }
  if (isMeltingPopped && isDescendantOf(hitObj, module3Group)) {
    toggleModule3Popup();
    return;
  }
  if (isTrianglePopped && isDescendantOf(hitObj, triangleModuleGroup)) {
    toggleTrianglePopup();
    return;
  }
  if (isStatesPopped && isDescendantOf(hitObj, module2Group)) {
    toggleModule2Popup();
    return;
  }
  if (isBrownPopped && (hitObj === waterDropMesh || hitObj === pollenGrainMesh || isDescendantOf(hitObj, waterDropMesh))) {
    toggleModule1Popup();
    return;
  }
  if (isBrownHoloPopped && (hitObj === brownAvatarMesh || isDescendantOf(hitObj, brownAvatarMesh))) {
    toggleRobertBrownHologram();
    return;
  }

  // 2. Double-click on Front Cover (Spread 0) -> Open book
  if (currentSpread === 0 && (hitObj === frontCoverMesh || isDescendantOf(hitObj, frontCoverMesh))) {
    setSpread(1);
    playSound('pop');
    return;
  }

  // 3. Double-click on Book Page Surface -> Toggle corresponding 3D Pop-Up!
  // Find intersection with the page surface
  const pageIntersect = intersects.find(i => i.object.userData && i.object.userData.isPage);
  if (pageIntersect) {
    const pageObj = pageIntersect.object;
    const uv = pageIntersect.uv;

    if (pageObj.userData.side === 'left' && currentSpread === 1) {
      // Trang 6 (Spread 1 Left Page)
      if (uv && uv.y < 0.45) {
        // Lower region: Hình 1.1 / Chuyển động Brown giọt nước
        toggleModule1Popup();
      } else {
        // Upper region: Chân dung Robert Brown & Lịch sử
        toggleRobertBrownHologram();
      }
    } else if (pageObj.userData.side === 'right' && currentSpread === 1) {
      // Trang 7 (Spread 1 Right Page)
      if (uv && uv.y > 0.40) {
        // Upper region: Hình 1.3: 3 Thể Rắn - Lỏng - Khí
        toggleModule2Popup();
      } else {
        // Lower region: Hình 1.4: Tam Giác Chuyển Thể
        toggleTrianglePopup();
      }
    } else if (pageObj.userData.side === 'left' && currentSpread === 2) {
      // Trang 8 (Spread 2 Left Page)
      if (uv && uv.x > 0.60 && uv.y < 0.40) {
        // Bottom right: Hình 1.6 Tinh thể muối ăn NaCl
        toggleModule4Popup();
      } else {
        // Main area: Hình 1.5 Đèn cồn & Đồ thị sôi
        toggleModule3Popup();
      }
    } else if (pageObj.userData.side === 'right' && currentSpread === 2) {
      // Trang 9 (Spread 2 Right Page)
      if (uv && uv.y < 0.42) {
        // Bottom area: Hình 1.8 Thể Plasma Mặt Trời
        togglePlasmaPopup();
      } else {
        // Upper area: Hình 1.7 Đồ thị nóng chảy chất rắn kết tinh
        toggleMeltingGraphPopup();
      }
    }
  }
}

// Double click handler for Desktop
function onDocumentDoubleClick(event) {
  if (event.target.closest('.hud-topbar, .hud-bottom-dock, .scientist-speech-card, .phase-detail-card, .melting-graph-detail-card, .plasma-detail-card, .help-backdrop')) {
    return;
  }
  handleBookDoubleAction(event.clientX, event.clientY);
}

// Single click handler for interactive sub-parts (Pistons, Phase Arrows, Scientist speech)
function onDocumentPointerDown(event) {
  if (event.target.closest('.hud-topbar, .hud-bottom-dock, .scientist-speech-card, .phase-detail-card, .melting-graph-detail-card, .plasma-detail-card, .help-backdrop')) {
    return;
  }

  // Check double-tap on mobile/touch devices
  const now = performance.now();
  const dx = event.clientX - lastPointerTapPos.x;
  const dy = event.clientY - lastPointerTapPos.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (now - lastPointerTapTime < 340 && dist < 30) {
    // Detected DOUBLE TAP!
    handleBookDoubleAction(event.clientX, event.clientY);
    lastPointerTapTime = 0;
    return;
  }

  lastPointerTapTime = now;
  lastPointerTapPos = { x: event.clientX, y: event.clientY };

  // Single click raycasting for sub-interactions
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const targets = [];

  // Single click on front cover when closed opens book
  if (currentSpread === 0 && frontCoverMesh && frontCoverMesh.visible) {
    targets.push(frontCoverMesh);
  }

  // Active Margin Tabs & interactive sub-parts
  targets.push(...clickableHotspots.filter(h => h && h.visible));
  targets.push(...clickablePhaseArrows.filter(a => a && a.visible));
  if (isStatesPopped) {
    if (solidPiston) targets.push(solidPiston);
    if (liquidPiston) targets.push(liquidPiston);
    if (gasPiston) targets.push(gasPiston);
  }
  if (isBrownHoloPopped && brownAvatarMesh) {
    targets.push(brownAvatarMesh);
  }

  const intersects = raycaster.intersectObjects(targets, true);
  if (intersects.length > 0) {
    const hit = intersects[0].object;

        // Single click on Margin Tab button also activates/deactivates!
    if (hit.userData && hit.userData.action) {
      const act = hit.userData.action;
      if (act === 'toggleBrown') toggleModule1Popup();
      else if (act === 'toggleHoloBrown') toggleRobertBrownHologram();
      else if (act === 'toggleStates') toggleModule2Popup();
      else if (act === 'toggleTriangle') toggleTrianglePopup();
      else if (act === 'toggleMelting') toggleModule3Popup();
      else if (act === 'toggleNacl') toggleModule4Popup();
      else if (act === 'togglePlasma') togglePlasmaPopup();
      else if (act === 'toggleMeltingGraph') toggleMeltingGraphPopup();
      return;
    }

    // Phase Arrow click (Hoá hơi, Hoá lỏng, ...)
    if (hit.userData && hit.userData.phaseKey) {
      showPhaseDetail(hit.userData.phaseKey);
      return;
    }

    // Cover single click
    if (currentSpread === 0 && hit === frontCoverMesh) {
      setSpread(1);
      return;
    }

    // Interactive pistons in States module
    if (hit === solidPiston || hit === liquidPiston || hit === gasPiston) {
      togglePistonCompression();
      return;
    }

    // Robert Brown avatar speak
    if (hit === brownAvatarMesh) {
      speakCurrentScientist();
      return;
    }
  }
}

// Hover cursor pointer over book figures
function onDocumentPointerMove(event) {
  if (!leftPageMesh || !camera) return;
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const targets = [];
  if (leftPageMesh && leftPageMesh.visible) targets.push(leftPageMesh);
  if (rightPageMesh && rightPageMesh.visible) targets.push(rightPageMesh);
  if (frontCoverMesh && frontCoverMesh.visible) targets.push(frontCoverMesh);

  const intersects = raycaster.intersectObjects(targets, false);
  if (intersects.length > 0) {
    document.body.style.cursor = 'pointer';
  } else {
    document.body.style.cursor = 'default';
  }
}

function openHelpModal() {
  const modal = document.getElementById('helpModal');
  if (modal) modal.classList.add('active');
}
function closeHelpModal() {
  const modal = document.getElementById('helpModal');
  if (modal) modal.classList.remove('active');
}

document.getElementById('btnAudioToggle')?.addEventListener('click', function() {
  isAudioEnabled = !isAudioEnabled;
  this.textContent = isAudioEnabled ? '🔊' : '🔇';
  if (!isAudioEnabled) { stopCurrentScientistSpeech(); stopPlasmaSpeech(); }
});


// ============================================================================
// 15. ANIMATION LOOP
// ============================================================================
let trailCounter = 0;
let cameraAnimation = null;

function flyCameraTo(targetX, targetY, targetZ, camX, camY, camZ, duration = 750) {
  if (!controls || !camera) return;
  const startTarget = controls.target.clone();
  const endTarget = new THREE.Vector3(targetX, targetY, targetZ);
  const startCam = camera.position.clone();
  const endCam = new THREE.Vector3(camX, camY, camZ);
  const startTime = performance.now();

  cameraAnimation = {
    update(now) {
      const elapsed = now - startTime;
      let t = Math.min(1.0, elapsed / duration);
      // Smooth cubic ease-out
      const ease = 1 - Math.pow(1 - t, 3);

      controls.target.lerpVectors(startTarget, endTarget, ease);
      camera.position.lerpVectors(startCam, endCam, ease);
      controls.update();

      if (t >= 1.0) {
        cameraAnimation = null;
      }
    }
  };
}

function focusCurrentModel() {
  if (isMeltingGraphPopped) {
    flyCameraTo(7.36, 1.35, -3.64, 7.36, 5.8, 1.4, 850);
  } else if (isPlasmaPopped) {
    flyCameraTo(6.2, 1.45, 3.50, 6.2, 4.6, 7.6, 750);
  } else if (isNaclPopped) {
    flyCameraTo(-2.06, 1.4, 4.95, -2.06, 4.6, 8.8, 750);
  } else if (isMeltingPopped) {
    flyCameraTo(-4.5, 1.4, -3.2, -4.5, 4.8, 1.2, 750);
  } else if (isTrianglePopped) {
    flyCameraTo(7.0, 1.4, 4.8, 7.0, 5.0, 9.2, 750);
  } else if (isStatesPopped) {
    flyCameraTo(7.0, 1.4, -3.5, 7.0, 5.2, 1.5, 750);
  } else if (isBrownPopped) {
    flyCameraTo(-5.6, 1.4, 4.5, -5.6, 4.8, 8.5, 750);
  } else if (isBrownHoloPopped) {
    flyCameraTo(-7.5, 2.5, -4.0, -7.5, 5.5, 1.0, 750);
  } else {
    if (currentSpread === 2) {
      flyCameraTo(5.2, 1.2, 0, 5.2, 15, 15, 750);
    } else if (currentSpread === 1) {
      flyCameraTo(5.2, 1.2, 0, 5.2, 15, 15, 750);
    } else {
      resetCameraView();
    }
  }
  playSound('pop');
}

function setTopDownView() {
  if (isMeltingGraphPopped) {
    flyCameraTo(6.2, 1.45, -3.64, 6.2, 6.8, -3.64, 750);
  } else if (isPlasmaPopped) {
    flyCameraTo(7.66, 1.45, 3.50, 7.66, 7.0, 3.50, 750);
  } else if (isNaclPopped) {
    flyCameraTo(-2.06, 1.4, 4.95, -2.06, 7.0, 4.95, 750);
  } else if (currentSpread === 2) {
    flyCameraTo(5.2, 1.2, 0, 5.2, 24, 0.1, 750);
  } else if (currentSpread === 1) {
    flyCameraTo(0, 1.2, 0, 0, 24, 0.1, 750);
  } else {
    flyCameraTo(0, 1.2, 0, 0, 24, 0.1, 750);
  }
  playSound('pop');
}

function animate() {
  requestAnimationFrame(animate);

  if (cameraAnimation) {
    cameraAnimation.update(performance.now());
  } else if (controls) {
    controls.update();
  }

  const time = Date.now() * 0.003;

  // Pulse Hotspot badges slightly to invite touch
  const pulse = 1.0 + Math.sin(time * 3) * 0.04;
  [hotspotBrown, hotspotHoloBrown, hotspotStates, hotspotTriangle, hotspotMelting, hotspotNacl, hotspotPlasma, hotspotMeltingGraph].forEach(h => {
    if (h && h.visible) {
      h.scale.set(pulse, pulse, pulse);
    }
  });

  // 1. Module 1 Brownian Motion
  if (isBrownPopped && waterMoleculeParticles.length > 0) {
    const pollen = pollenGrainMesh;
    const pVel = pollen.userData.velocity;

    for (let i = 0; i < waterMoleculeParticles.length; i++) {
      const wp = waterMoleculeParticles[i];
      const pos = wp.mesh.position;
      const vel = wp.vel;

      pos.addScaledVector(vel, brownTempFactor);

      if (pos.length() > DROPLET_RADIUS - 0.2) {
        const norm = pos.clone().normalize();
        vel.reflect(norm);
        pos.copy(norm.multiplyScalar(DROPLET_RADIUS - 0.25));
      }

      const d = pos.distanceTo(pollen.position);
      if (d < 0.85) {
        const norm = pos.clone().sub(pollen.position).normalize();
        vel.reflect(norm);
        pVel.addScaledVector(norm, -0.04 * brownTempFactor);
      }
    }

    pVel.multiplyScalar(0.965);
    pollen.position.add(pVel);

    if (pollen.position.length() > DROPLET_RADIUS - 0.9) {
      const pNorm = pollen.position.clone().normalize();
      pollen.position.copy(pNorm.multiplyScalar(DROPLET_RADIUS - 0.92));
      pVel.reflect(pNorm).multiplyScalar(0.5);
    }

    pollen.rotation.x += 0.01;
    pollen.rotation.y += 0.015;

    trailCounter++;
    if (trailCounter % 3 === 0 && brownTrailGeom) {
      brownTrailPoints.push(pollen.position.clone());
      if (brownTrailPoints.length > MAX_BROWN_TRAIL) brownTrailPoints.shift();

      const arr = brownTrailGeom.attributes.position.array;
      for (let i = 0; i < brownTrailPoints.length; i++) {
        arr[i * 3] = brownTrailPoints[i].x;
        arr[i * 3 + 1] = brownTrailPoints[i].y;
        arr[i * 3 + 2] = brownTrailPoints[i].z;
      }
      brownTrailGeom.attributes.position.needsUpdate = true;
      brownTrailGeom.setDrawRange(0, brownTrailPoints.length);
    }

    if (waterDropMesh) waterDropMesh.rotation.y += 0.003;
  }

  // 2. Hologram laser rotation
  if (isBrownHoloPopped) {
    if (hologramLaserRing) hologramLaserRing.rotation.z += 0.03;
    if (hologramLaserRing2) hologramLaserRing2.rotation.z -= 0.025;
    if (brownAvatarMesh) brownAvatarMesh.position.y = 3.6 + Math.sin(time * 2) * 0.08;
  }

  // 3. Module 2: Solid, Liquid, Gas
  if (isStatesPopped) {
    solidParticles.forEach(sp => {
      sp.mesh.position.x = sp.basePos.x + Math.sin(time * 3 + sp.phase) * 0.05;
      sp.mesh.position.y = sp.basePos.y + Math.cos(time * 3.5 + sp.phase) * 0.05;
      sp.mesh.position.z = sp.basePos.z + Math.sin(time * 2.8 + sp.phase) * 0.05;
    });

    liquidParticles.forEach(lp => {
      lp.pos.add(lp.vel);
      if (Math.abs(lp.pos.x) > STATE_BOX_W / 2 - 0.25) lp.vel.x *= -1;
      if (Math.abs(lp.pos.z) > STATE_BOX_D / 2 - 0.25) lp.vel.z *= -1;
      if (lp.pos.y < -STATE_BOX_H / 2 + 0.25 || lp.pos.y > 0.1) lp.vel.y *= -1;
      lp.mesh.position.copy(lp.pos);
    });

    const topY = isPistonCompressed ? (STATE_BOX_H / 2 - 1.6) : (STATE_BOX_H / 2 - 0.25);
    gasParticles.forEach(gp => {
      gp.pos.add(gp.vel);
      if (Math.abs(gp.pos.x) > STATE_BOX_W / 2 - 0.25) gp.vel.x *= -1;
      if (Math.abs(gp.pos.z) > STATE_BOX_D / 2 - 0.25) gp.vel.z *= -1;
      if (gp.pos.y < -STATE_BOX_H / 2 + 0.25 || gp.pos.y > topY) gp.vel.y *= -1;
      gp.mesh.position.copy(gp.pos);
    });

    const targetGasY = isPistonCompressed ? (STATE_BOX_H / 2 - 1.5) : (STATE_BOX_H / 2 - 0.1);
    if (gasPiston) gasPiston.position.y += (targetGasY - gasPiston.position.y) * 0.12;
    const targetSolidY = isPistonCompressed ? (STATE_BOX_H / 2 - 0.18) : (STATE_BOX_H / 2 - 0.1);
    if (solidPiston) solidPiston.position.y += (targetSolidY - solidPiston.position.y) * 0.12;
    if (liquidPiston) liquidPiston.position.y += (targetSolidY - liquidPiston.position.y) * 0.12;
  }

  // 4. Module Triangle Phase: Floating, Molecular Dynamics & Energy Flow Streams
  if (isTrianglePopped && triangleModuleGroup) {
    triangleModuleGroup.position.y = 0.4 + Math.sin(time * 2) * 0.05;

    // A. Orient all billboard badges to face camera directly
    if (camera) {
      triangleBillboardBadges.forEach(b => {
        if (b) b.quaternion.copy(camera.quaternion);
      });
    }

    // B. Animate gas molecules inside sphere (fast random bounce)
    triangleGasParticles.forEach(gp => {
      gp.mesh.position.add(gp.vel);
      if (gp.mesh.position.length() > 0.58) {
        const norm = gp.mesh.position.clone().normalize();
        gp.vel.reflect(norm);
        gp.mesh.position.copy(norm.multiplyScalar(0.57));
      }
    });

    // C. Animate liquid molecules (gentle fluid undulations & sliding)
    triangleLiquidParticles.forEach(lp => {
      lp.mesh.position.x = lp.basePos.x + Math.sin(time * lp.speed + lp.phase) * 0.07;
      lp.mesh.position.y = lp.basePos.y + Math.cos(time * (lp.speed * 0.8) + lp.phase) * 0.05;
      lp.mesh.position.z = lp.basePos.z + Math.sin(time * (lp.speed * 1.1) + lp.phase) * 0.07;
    });

    // D. Animate solid lattice molecules (rapid vibration around crystal nodes)
    triangleSolidParticles.forEach(sp => {
      sp.mesh.position.x = sp.basePos.x + Math.sin(time * 12.0 + sp.phase) * 0.022;
      sp.mesh.position.y = sp.basePos.y + Math.cos(time * 10.5 + sp.phase) * 0.022;
      sp.mesh.position.z = sp.basePos.z + Math.sin(time * 11.2 + sp.phase) * 0.022;
    });

    // E. Animate the 6 flowing energy streams (particles traveling along arrows)
    triangleFlowStreams.forEach(stream => {
      const { start, end, beads, speed } = stream;
      const num = beads.length;
      for (let i = 0; i < num; i++) {
        const alpha = ((time * speed) + (i / num)) % 1.0;
        beads[i].position.lerpVectors(start, end, alpha);
        const s = Math.sin(alpha * Math.PI) * 0.45 + 0.75;
        beads[i].scale.set(s, s, s);
      }
    });
  }

  // 5. Module 3: Flame & Steam
  if (isMeltingPopped) {
    if (flameMesh) {
      const f = 0.85 + Math.random() * 0.3;
      flameMesh.scale.set(f, 0.9 + Math.random() * 0.25, f);
    }
    if (flameLight) {
      flameLight.intensity = 1.2 + Math.random() * 0.6;
    }
    if (steamGroup && steamGroup.visible) {
      steamGroup.children.forEach(sm => {
        sm.position.y += sm.userData.vy;
        sm.position.x += sm.userData.vx;
        if (sm.position.y > 8.5) {
          sm.position.y = sm.userData.origY || 4.3;
          sm.position.x = (Math.random() - 0.5) * 1.5;
        }
      });
    }
  }

  // 6. NaCl Rotation
  if (isNaclPopped && naclGroup) {
    if (naclPivotGroup) naclPivotGroup.rotation.y += 0.012;
    if (naclBadgeMesh && camera) {
      naclBadgeMesh.quaternion.copy(camera.quaternion);
    }
  }

  // 8. Module 6: Melting Graph Dynamics & Molecular Phase Transition
  if (isMeltingGraphPopped && meltingGraphGroup) {
    // Face billboard badges to camera
    if (camera) {
      meltingBillboardBadges.forEach(b => {
        if (b) {
          b.quaternion.copy(camera.quaternion);
          // Compensate for parent tilt so badge faces camera flat
          b.rotateX(-meltingGraphPivotGroup.rotation.x);
        }
      });
    }

    // Pulse horizontal rings along plateau segment b
    const pulseB = 1.0 + Math.sin(time * 6) * 0.15;
    meltingPulseRings.forEach(r => {
      r.scale.set(pulseB, pulseB, pulseB);
    });

    // Advance timeline progress
    if (isMeltingGraphPlaying) {
      meltingGraphTimelineProgress = (meltingGraphTimelineProgress + 0.0032) % 1.0;
    }

    // Determine position along path P0 -> P1 -> P2 -> P3
    let curPos = new THREE.Vector3();
    let stage = 0;

    if (meltingGraphTimelineProgress < 0.30) {
      // Stage A: P0 -> P1
      stage = 0;
      const alpha = meltingGraphTimelineProgress / 0.30;
      curPos.lerpVectors(meltingP0, meltingP1, alpha);
    } else if (meltingGraphTimelineProgress < 0.70) {
      // Stage B: P1 -> P2 (Melting Plateau!)
      stage = 1;
      const alpha = (meltingGraphTimelineProgress - 0.30) / 0.40;
      curPos.lerpVectors(meltingP1, meltingP2, alpha);
    } else {
      // Stage C: P2 -> P3
      stage = 2;
      const alpha = (meltingGraphTimelineProgress - 0.70) / 0.30;
      curPos.lerpVectors(meltingP2, meltingP3, alpha);
    }

    if (meltingGraphCursor) {
      meltingGraphCursor.position.copy(curPos);
    }
    updateMeltingStatusCanvas(stage);

    // Animate Microscopic Sample in Chamber based on stage
    if (stage === 0) {
      // Solid lattice vibrating
      const vibAmp = 0.015 + (meltingGraphTimelineProgress / 0.30) * 0.035;
      meltingSampleMolecules.forEach(m => {
        m.mesh.position.x = m.basePos.x + Math.sin(time * 16 + m.phase) * vibAmp;
        m.mesh.position.y = m.basePos.y + Math.cos(time * 15 + m.phase) * vibAmp;
        m.mesh.position.z = m.basePos.z + Math.sin(time * 14 + m.phase) * vibAmp;
        m.mesh.material.color.setHex(0x29b6f6);
        m.mesh.material.emissive.setHex(0x0288d1);
      });
      meltingSampleBonds.forEach(b => {
        b.mesh.visible = true;
        b.mesh.material.opacity = 0.75;
      });
    } else if (stage === 1) {
      // Stage B: Melting - Lattice bonds breaking, collapsing into liquid
      const meltAlpha = (meltingGraphTimelineProgress - 0.30) / 0.40;
      meltingSampleMolecules.forEach((m, idx) => {
        const fall = meltAlpha * 0.45;
        const driftX = Math.sin(time * 4 + m.phase) * 0.08 * meltAlpha;
        const driftZ = Math.cos(time * 4 + m.phase) * 0.08 * meltAlpha;
        m.mesh.position.x = m.basePos.x + driftX;
        m.mesh.position.y = Math.max(-0.85, m.basePos.y - fall + Math.sin(time * 6 + m.phase) * 0.04);
        m.mesh.position.z = m.basePos.z + driftZ;
        m.mesh.material.color.setHex(0x00e5ff);
        m.mesh.material.emissive.setHex(0x00b0ff);
      });
      // Fade and break bonds
      meltingSampleBonds.forEach((b, idx) => {
        const breakThreshold = (idx / meltingSampleBonds.length);
        if (meltAlpha > breakThreshold) {
          b.mesh.visible = false;
        } else {
          b.mesh.visible = true;
          b.mesh.material.opacity = Math.max(0.1, 0.75 * (1.0 - meltAlpha));
        }
      });
    } else {
      // Stage C: 100% Liquid - Fluid convection currents
      meltingSampleMolecules.forEach(m => {
        m.mesh.position.x = m.basePos.x * 0.8 + Math.sin(time * 3 + m.phase) * 0.16;
        m.mesh.position.y = -0.55 + Math.cos(time * 2.5 + m.phase) * 0.22;
        m.mesh.position.z = m.basePos.z * 0.8 + Math.sin(time * 2.8 + m.phase) * 0.16;
        m.mesh.material.color.setHex(0xff7043);
        m.mesh.material.emissive.setHex(0xe64a19);
      });
      meltingSampleBonds.forEach(b => {
        b.mesh.visible = false;
      });
    }
  }

  // 7. Module 5: Plasma Solar Dynamics
  if (isPlasmaPopped && plasmaGroup) {
    if (sunCoreMesh) {
      const s = 1.0 + Math.sin(time * 3.5) * 0.025;
      sunCoreMesh.scale.set(s, s, s);
      if (sunTexture) sunTexture.offset.x += 0.0015;
    }
    if (sunCoronaMesh) {
      sunCoronaMesh.rotation.y += 0.005;
      sunCoronaMesh.rotation.z += 0.003;
    }
    if (plasmaPivotGroup) {
      plasmaPivotGroup.rotation.y += 0.006;
    }
    if (plasmaBadgeMesh && camera) {
      plasmaBadgeMesh.quaternion.copy(camera.quaternion);
    }

    // Coronal Loop Flow Streams
    plasmaLoopStreams.forEach(stream => {
      const { radius, rotZ, rotY, posY, beads, speed } = stream;
      beads.forEach((bead, idx) => {
        const theta = ((time * speed) + (idx / beads.length)) % 1.0 * Math.PI;
        const lx = radius * Math.cos(theta);
        const ly = radius * Math.sin(theta);
        const p = new THREE.Vector3(lx, ly, 0);
        p.applyAxisAngle(new THREE.Vector3(0, 0, 1), rotZ);
        p.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotY);
        p.y += posY;
        bead.position.copy(p);
      });
    });

    // Positive Ions
    plasmaIonParticles.forEach(ip => {
      ip.pos.add(ip.vel);
      if (ip.pos.length() > 1.35 || ip.pos.y < 0.2) {
        ip.vel.multiplyScalar(-1);
      }
      ip.mesh.position.copy(ip.pos);
    });

    // Free Electrons (fast buzzing swarm around ions)
    plasmaElectronParticles.forEach(ep => {
      const bp = ep.baseIon ? ep.baseIon.mesh.position : ep.mesh.position;
      const angle = time * ep.speed + ep.phase;
      const r = 0.18 + Math.sin(angle * 2) * 0.05;
      ep.mesh.position.set(
        bp.x + r * Math.cos(angle),
        bp.y + r * Math.sin(angle * 1.4) * 0.5,
        bp.z + r * Math.sin(angle)
      );
    });

    // Solar Flare Eruptions
    plasmaFlareParticles.forEach(fp => {
      fp.dist += fp.speed;
      if (fp.dist > 1.85) fp.dist = 0.88;
      fp.mesh.position.copy(fp.dir).multiplyScalar(fp.dist);
      const scale = Math.max(0.2, 1.2 - (fp.dist - 0.88));
      fp.mesh.scale.set(scale, scale, scale);
    });
  }

  renderer.render(scene, camera);
}

function onWindowResize() {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

// Start Engine
window.addEventListener('DOMContentLoaded', init3DWorld);
