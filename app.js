const {
  useEffect,
  useMemo,
  useRef,
  useState
} = React;
const STORAGE_KEYS = {
  apiKey: "promptmvp.geminiApiKey",
  model: "promptmvp.geminiModel",
  rememberApiKey: "promptmvp.rememberApiKey"
};
const DEFAULT_MODEL = "gemini-2.5-flash";
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";
const Icon = ({
  name,
  className = ""
}) => {
  const containerRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current || !window.lucide) return;
    containerRef.current.innerHTML = `<i data-lucide="${name}" class="${className}"></i>`;
    window.lucide.createIcons({
      root: containerRef.current
    });
  }, [name, className]);
  return React.createElement("span", {
    ref: containerRef,
    style: {
      display: "contents"
    },
    "aria-hidden": "true"
  });
};
const TABS = [{
  id: "new",
  title: "New Project",
  icon: "folder-plus"
}, {
  id: "existing",
  title: "Existing Project",
  icon: "folder-tree"
}];
const COMPLEXITY_RULES = {
  level0: {
    label: "Level 0 — Tiny Task",
    ai: "Codex only",
    stack: "Existing stack",
    ide: "VS Code",
    examples: ["แก้ CSS", "แก้ typo", "เปลี่ยนข้อความ", "แก้ error เล็ก"]
  },
  level1: {
    label: "Level 1 — Simple Static App",
    ai: "Codex only",
    stack: "index.html + Tailwind CDN + GitHub Pages",
    ide: "VS Code",
    examples: ["เครื่องคิดเลข", "เว็บ prompt helper", "หน้า landing page", "เว็บข้อมูลหน้าเดียว"]
  },
  level2: {
    label: "Level 2 — Medium Interactive App",
    ai: "Claude mini-plan → Codex",
    stack: "Vite + React + TypeScript + Tailwind",
    ide: "VS Code + Codex",
    examples: ["หลาย component", "state เยอะ", "filter/search", "localStorage", "export markdown"]
  },
  level3: {
    label: "Level 3 — Full-stack App",
    ai: "Claude full-plan → Codex phase-by-phase → Claude review",
    stack: "Next.js App Router + TypeScript + Tailwind CSS v4 + Firebase + Vercel",
    ide: "VS Code + Codex",
    examples: ["login", "dashboard", "database", "Firestore", "upload", "admin/student"]
  },
  level4: {
    label: "Level 4 — High-risk / Production System",
    ai: "Claude architecture first → Codex phase-by-phase → Claude review every major phase",
    stack: "Next.js + Firebase + Security Rules + Vercel + strong QA",
    ide: "VS Code + Codex + Claude review",
    examples: ["payment", "permission", "security", "multi-user roles", "production data", "analytics"]
  }
};
const STACK_OPTIONS = {
  A: "index.html + Tailwind CDN + GitHub Pages",
  B: "Vite + React + TypeScript + Tailwind",
  C: "Next.js App Router + TypeScript + Tailwind CSS v4 + Firebase + Vercel"
};
const WORKFLOWS = {
  new: {
    scratch: {
      id: "scratch",
      title: "Build From Scratch",
      icon: "wand-sparkles",
      desc: "ใส่ไอเดียภาษาไทยครั้งเดียว แล้วได้แผน Claude + prompt Codex แบบต่อเนื่อง",
      placeholder: "เช่น: เว็บคำนวณค่า BMI หน้าเดียว",
      defaultText: "เว็บคำนวณค่า BMI หน้าเดียว",
      tips: ["พิมพ์ไอเดียหลักเป็นภาษาไทย ไม่ต้องแยก Step 0/1/2 เอง", "ระบบจะเลือกความซับซ้อน, AI model, stack, tooling และ workflow ให้", "ถ้าเป็นงานมี login/database/upload ให้เริ่มที่ Claude plan ก่อน Codex"],
      systemPrompt: "Analyze the Thai coding project idea and produce a full AI project workflow package for Claude Pro planning, Codex implementation, optional Gemini prompt generation, and deployment."
    },
    planning: {
      id: "planning",
      title: "Legacy Step 0 Prompt",
      icon: "map",
      desc: "โหมดเก่าสำหรับแปลงคำขอหนึ่งก้อนเป็น planning prompt เดี่ยว",
      placeholder: "เช่น: อยากทำแอปจดบันทึกด้วย Next.js และ Firebase",
      defaultText: "อยากทำโปรเจคเกี่ยวกับ...\n\nฟีเจอร์หลักที่ต้องการ:\n1. \n2. \n\nTech Stack ที่เล็งไว้:\n- \n- ",
      tips: ["ใช้เมื่ออยากได้ prompt planning แบบสั้น ไม่ต้องการ package เต็ม", "ถ้าเริ่มโปรเจกต์ใหม่จริง ให้ใช้ Build From Scratch เป็นหลัก", "เหมาะกับการปรับ prompt ก่อนส่งให้ Claude หรือ Gemini"],
      systemPrompt: "You are an expert product manager and senior software architect. Convert the Thai project idea into a structured English Step 0 planning prompt. Include Goal, Users, Core Features, Tech Stack, Architecture, Data Model, Phases, Risks, QA checklist, and explicit constraints. Keep it actionable for an AI coding agent."
    },
    build: {
      id: "build",
      title: "Mid-Dev Build",
      icon: "code-2",
      desc: "สร้าง prompt สำหรับเพิ่มฟีเจอร์ย่อยในงานที่กำลังพัฒนา",
      placeholder: "เช่น: เพิ่มปุ่ม Login และเก็บ session ใน localStorage",
      defaultText: "ฟีเจอร์ที่อยากเพิ่ม:\n- \n\nบริบทของโปรเจค:\n- \n\nข้อจำกัด (Constraints):\n- ให้แก้ไขเฉพาะจุดที่จำเป็น ห้ามกระทบโครงสร้างหลัก\n- ",
      tips: ["บอกไฟล์หรือ component ที่เกี่ยวข้องถ้ารู้", "ระบุ acceptance criteria เพื่อให้ตรวจงานง่าย", "ย้ำให้ทำ diff เล็กและทดสอบจุดที่เปลี่ยน"],
      systemPrompt: "Convert the Thai feature request into an optimized English coding prompt for an AI coding agent. Emphasize minimal diffs, existing style, explicit acceptance criteria, test expectations, and what files or behaviors must not be changed."
    },
    debug: {
      id: "debug",
      title: "Debug & Fix",
      icon: "bug",
      desc: "จัดรูปคำสั่งสำหรับไล่บั๊กและแก้ปัญหาอย่างเป็นระบบ",
      placeholder: "บอกพฤติกรรมที่เกิดขึ้นจริง เทียบกับสิ่งที่คาดหวัง",
      defaultText: "พฤติกรรมปัจจุบัน (Current Behavior):\n- \n\nสิ่งที่ควรจะเป็น (Expected Behavior):\n- \n\nError Log หรือขั้นตอนทำซ้ำ (ถ้ามี):\n- ",
      tips: ["ใส่ขั้นตอนทำซ้ำและ error log ให้ครบ", "แยก current behavior กับ expected behavior", "ให้ AI อธิบาย root cause ก่อนแก้โค้ด"],
      systemPrompt: "You are an expert debugging prompt optimizer. Convert the Thai bug report into a structured English debugging prompt with Reproduction Steps, Current Behavior, Expected Behavior, Logs, Suspected Scope, Root Cause Analysis requirement, Fix Constraints, and Regression Tests."
    },
    qa: {
      id: "qa",
      title: "Final QA",
      icon: "check-circle-2",
      desc: "เตรียมคำสั่งตรวจคุณภาพ ฟีเจอร์ตกหล่น และ responsive",
      placeholder: "เช่น: ตรวจ flow สมัครสมาชิกและการแสดงผลมือถือ",
      defaultText: "รบกวนตรวจสอบ (QA) ส่วนต่อไปนี้ให้หน่อย:\n1. \n2. \n\nเช็คเรื่อง responsive บนมือถือ, accessibility, และ error ใน console ด้วย",
      tips: ["ระบุ flow สำคัญที่ห้ามพัง", "ให้รายงานเฉพาะประเด็นที่มีผลต่อผู้ใช้", "แยก findings, risk, และ test gaps"],
      systemPrompt: "You are a QA engineering prompt optimizer. Convert the Thai QA request into a structured English audit prompt. Ask the AI to inspect behavior, responsiveness, accessibility, console errors, missing edge cases, and regression risk. Findings should be listed before any suggested fixes."
    }
  },
  existing: {
    extract: {
      id: "extract",
      title: "Step 0: Extract Context",
      icon: "file-text",
      desc: "ให้ AI ศึกษาโปรเจกต์เดิมและสรุปเป็นเอกสาร",
      placeholder: "ช่วยสรุปโครงสร้างไฟล์และการไหลของข้อมูล",
      defaultText: "ช่วยวิเคราะห์และสรุปโครงสร้างของโปรเจคนี้ให้หน่อยครับ\n\nสิ่งที่ต้องการให้ AI โฟกัสเป็นพิเศษ:\n1. ภาพรวมของ architecture\n2. การจัดการ state และ data flow\n3. component หลักๆ ที่สำคัญ",
      tips: ["ให้ Codex อ่านไฟล์ใน VS Code โดยตรง จะตรงกว่าการแปะลิงก์", "บอก stack, โฟลเดอร์สำคัญ และไฟล์ entry point ถ้ารู้", "ขอผลลัพธ์เป็นไฟล์เอกสารที่ใช้ต่อในงานถัดไป"],
      systemPrompt: "You are an expert software architect. Generate an English prompt for Codex running locally in VS Code to scan the existing codebase. The assistant must create architecture.md and components.md with architecture overview, data flow, state management, main files, risks, and maintenance notes. Do not imply that an external AI can read a GitHub link unless a connected tool is explicitly available."
    },
    action: {
      id: "action",
      title: "Existing Project Patch Prompt",
      icon: "git-merge",
      desc: "สั่งแก้หรือเพิ่มฟีเจอร์ในโปรเจกต์เดิมแบบ diff เล็กและตรวจสอบได้",
      placeholder: "เช่น: อ้างอิง architecture.md แล้วเพิ่ม export CSV",
      defaultText: "อ้างอิงจากไฟล์ document เช่น architecture.md ของโปรเจคนี้\n\nสิ่งที่ต้องการให้ทำ (Action):\n- \n\nข้อจำกัด (Constraints):\n- ให้ยึดตามโครงสร้างและสไตล์การเขียนโค้ดเดิมอย่างเคร่งครัด\n- แก้ไขเฉพาะไฟล์ที่เกี่ยวข้องเท่านั้น",
      tips: ["อ้างชื่อไฟล์เอกสารจาก Step 0", "ระบุขอบเขตไฟล์หรือ module ที่อยากให้แตะ", "แนบ package.json, ไฟล์ component ที่เกี่ยวข้อง และ error log ถ้ามี", "ใส่ acceptance criteria เพื่อกันการตีความกว้าง"],
      systemPrompt: "Generate an English Existing Project Patch Prompt for modifying an existing project based on its context documents. Emphasize strict consistency with the current architecture, minimal file changes, no unrelated refactors, acceptance criteria, exact files to inspect or edit, and verification commands. Tell the agent to request package.json, related component files, globals.css for Tailwind issues, Firebase config/rules for Firebase issues, and logs when relevant."
    },
    debug_existing: {
      id: "debug_existing",
      title: "Debug Rescue Prompt",
      icon: "alert-triangle",
      desc: "แก้บั๊กในระบบเดิม พร้อมกฎ 2 รอบ: ถ้า Codex พลาดสองครั้ง ให้ Claude วิเคราะห์ root cause",
      placeholder: "บั๊กที่เจอในโปรเจค",
      defaultText: "อ้างอิงจากไฟล์ document ของโปรเจค\n\nปัญหาที่เจอตอนนี้ (Current Behavior):\n- \n\nข้อจำกัดในการแก้:\n- ห้ามเปลี่ยนแปลงโครงสร้าง data flow เดิม\n- ห้ามแก้ไฟล์ที่ไม่เกี่ยวข้อง",
      tips: ["บอก scope ที่น่าจะเกี่ยวข้องกับบั๊ก", "ย้ำให้หาสาเหตุก่อนลงมือแก้", "แนบ package.json, error log, related files, globals.css หรือ Firebase rules ตามประเภทปัญหา", "ถ้า Codex แก้ไม่สำเร็จ 2 รอบ ให้หยุดแล้วถาม Claude เพื่อหา root cause"],
      systemPrompt: "Generate an English Debug Rescue Prompt for an existing system. Require root cause analysis before code changes, alignment with current architecture, minimal diffs, no unrelated edits, and regression checks for dependent features. Include the two-round rule: if Codex fails twice, stop implementation and ask Claude for root cause analysis using package.json, error logs, related component files, globals.css for Tailwind problems, and Firebase config/rules for Firebase problems."
    }
  }
};
const classNames = (...values) => values.filter(Boolean).join(" ");
const countMatches = (text, keywords) => keywords.filter(word => text.includes(word.toLowerCase())).length;
const detectSignals = idea => {
  const text = idea.toLowerCase();
  const groups = {
    auth: ["login", "ล็อกอิน", "ลอกอิน", "signin", "sign in", "register", "สมัคร", "auth", "authentication"],
    dashboard: ["dashboard", "แดชบอร์ด", "หน้าจัดการ", "panel"],
    database: ["database", "ฐานข้อมูล", "firebase", "firestore", "db", "บันทึกข้อมูล", "เก็บข้อมูล"],
    upload: ["upload", "อัปโหลด", "อัพโหลด", "image upload", "file storage", "storage", "แนบไฟล์", "รูปภาพ"],
    roles: ["admin", "student", "teacher", "role", "permission", "สิทธิ์", "ผู้ดูแล", "นักเรียน", "ครู", "multi-user", "หลาย user", "หลายผู้ใช้"],
    highRisk: ["payment", "จ่ายเงิน", "ชำระเงิน", "security", "ปลอดภัย", "production", "ข้อมูลจริง", "analytics", "permission", "api key", "secret"],
    medium: ["api", "realtime", "real-time", "report", "รายงาน", "export", "portfolio", "ค้นหา", "search", "filter", "localstorage", "หลายหน้า", "หลาย component", "state", "ai"],
    simple: ["bmi", "calculator", "คำนวณ", "หน้าเดียว", "landing", "ข้อมูลหน้าเดียว", "prompt helper", "static"],
    tiny: ["แก้", "เปลี่ยน", "typo", "css", "error เล็ก", "เพิ่มระบบค้นหาในเว็บเดิม", "ปรับข้อความ"]
  };
  return Object.fromEntries(Object.entries(groups).map(([key, keywords]) => [key, countMatches(text, keywords)]));
};
const chooseStack = (signals, idea) => {
  const wantsBackend = signals.auth || signals.database || signals.dashboard || signals.upload || signals.roles;
  const wantsMaintainableUi = signals.medium >= 2 || /หลาย|ซับซ้อน|component|screen|state/i.test(idea);
  if (wantsBackend) {
    return {
      key: "C",
      label: STACK_OPTIONS.C,
      reason: "มีสัญญาณของ auth/database/dashboard/role/upload จึงควรใช้ stack ที่รองรับ backend, security rules และ deployment จริง"
    };
  }
  if (wantsMaintainableUi) {
    return {
      key: "B",
      label: STACK_OPTIONS.B,
      reason: "ยังไม่จำเป็นต้องมี backend แต่มีหลายหน้าจอหรือ state เยอะ จึงควรแยก component และใช้ TypeScript"
    };
  }
  return {
    key: "A",
    label: STACK_OPTIONS.A,
    reason: "เป็นเครื่องมือหน้าเดียวหรือ UI ง่าย ไม่มี login/database/backend ใช้ไฟล์ static จะเร็วและดูแลง่ายที่สุด"
  };
};
const analyzeIdea = idea => {
  const signals = detectSignals(idea);
  const backendScore = signals.auth + signals.database + signals.dashboard + signals.upload + signals.roles;
  const stack = chooseStack(signals, idea);
  let level = 1;
  const warnings = [];
  if (signals.tiny && !backendScore && signals.medium <= 1) level = 0;
  if (signals.simple && !backendScore && signals.medium <= 1) level = 1;
  if (signals.medium >= 2 && !backendScore) level = 2;
  if (backendScore >= 2 || signals.auth && signals.database || signals.upload || signals.roles) level = 3;
  if (signals.highRisk >= 1 || signals.roles && signals.database && signals.auth) level = 4;
  if (level >= 3) warnings.push("Lock security rules and client/server boundaries before Codex starts implementation.");
  if (level >= 4) warnings.push("Do not let an agent build the whole system in one pass; lock architecture first and build phase by phase.");
  if (stack.key === "A") warnings.push("GitHub Pages is a good fit, but do not add a backend or hide secrets in index.html.");
  if (idea.toLowerCase().includes("firebase")) warnings.push("If Firebase is selected, review Firestore and Storage security rules before deployment.");
  const rule = COMPLEXITY_RULES[`level${level}`];
  return {
    level,
    label: rule.label,
    ai: rule.ai,
    stack: stack.label,
    stackKey: stack.key,
    stackReason: stack.reason,
    ide: rule.ide,
    signals,
    warnings,
    explanation: level === 0 ? "เป็นงานแก้ไขเล็กหรือเพิ่มจุดเดียว ใช้ Codex ใน VS Code ได้เลย" : level === 1 ? "เป็นเว็บหรือเครื่องมือหน้าเดียว ไม่มีข้อมูลผู้ใช้หลายคน จึงควรทำแบบ static ก่อน" : level === 2 ? "มี interaction หรือ state หลายส่วน แต่ยังไม่เห็นความจำเป็นของ auth/database/backend" : level === 3 ? "มีสัญญาณของระบบเต็ม เช่น login, dashboard, database, role หรือ upload ควรวางแผนก่อนลงมือ" : "มีความเสี่ยงด้าน permission, security, payment, production data หรือ multi-user จึงต้องออกแบบ architecture และ review เป็นรอบ",
    explanationEn: level === 0 ? "This is a tiny edit or one focused change. Codex in VS Code is enough." : level === 1 ? "This is a one-page static app with no multi-user data. Start with a static GitHub Pages-friendly stack." : level === 2 ? "This needs more interaction or state, but there is no clear need for auth, database, or backend." : level === 3 ? "This has full-stack signals such as login, dashboard, database, roles, or upload. Plan first, then build phase by phase." : "This has risk around permissions, security, payment, production data, or multi-user behavior. Architecture and review must happen before broad implementation."
  };
};
const planningFiles = ["00_PROJECT_BRIEF.md", "01_IDEA_ANALYSIS.md", "02_TECH_STACK_DECISION.md", "03_ARCHITECTURE.md", "04_UI_DESIGN_SYSTEM.md", "05_IMPLEMENTATION_PHASES.md", "06_CODEX_PHASE_PROMPTS.md", "07_QA_CHECKLIST.md", "08_DEBUG_PLAYBOOK.md", "09_HANDOFF_SUMMARY.md"];
const buildClaudePrompt = (idea, analysis) => ["คุณคือ Claude Pro ทำหน้าที่เป็น product architect + senior coding project planner", "", "โปรเจกต์ที่ต้องวางแผน:", idea.trim(), "", "บริบทจาก local analyzer:", `- Complexity: ${analysis.label}`, `- Recommended AI: ${analysis.ai}`, `- Recommended stack: ${analysis.stack}`, `- Recommended IDE/tooling: ${analysis.ide}`, "", "งานของคุณ:", "สร้าง full project planning package เป็น Markdown ที่นำไปให้ Codex ใน VS Code ทำงานทีละ phase ได้ทันที", "", "ต้องสร้างไฟล์ Markdown เหล่านี้ใน /project-docs/:", ...planningFiles.map(file => `- ${file}`), "", "ข้อกำหนดสำคัญ:", "- ใช้ token ให้น้อย กระชับ แต่ implementation-ready", "- แบ่งงานเป็น phase เล็กๆ ที่ build/lint/test ได้จริง", "- ระบุ exact files to create/edit ในทุก phase", "- ห้าม overengineering", "- ห้ามเลือก Next.js ถ้า index.html เพียงพอ", "- ถ้าเลือก Next.js ให้ใช้ App Router + TypeScript + Tailwind CSS v4", "- Tailwind v4 ต้องใช้ globals.css แบบ @import \"tailwindcss\"; ห้ามใช้ @tailwind base/components/utilities", "- ถ้าเลือก Firebase ให้เตือนเรื่อง Firestore/Storage security rules และห้ามเปิด permission กว้าง", "- Codex ต้อง implement ทีละ phase เท่านั้น ห้ามทำทุก phase ในครั้งเดียว", "- ทุก phase ต้องจบด้วย build/lint/test instructions และ acceptance checklist", "- ระบุ debug playbook และ rollback guidance สำหรับ phase ที่เสี่ยง", "", "รูปแบบผลลัพธ์:", "ให้ตอบเป็น Markdown พร้อมหัวข้อแยกตามชื่อไฟล์ แต่ละไฟล์ต้องมีเนื้อหาที่สามารถนำไปสร้างไฟล์จริงได้"].join("\n");
const buildCodexPrompt = (idea, analysis) => {
  const stackSpecific = analysis.stackKey === "A" ? ["- Edit only index.html", "- Preserve GitHub Pages compatibility", "- Do not add build tools", "- Do not add an external backend", "- Do not convert the project to Next.js"] : analysis.stackKey === "C" ? ["- Use Next.js App Router only", "- Use TypeScript", "- Use Tailwind CSS v4 syntax", "- globals.css must use @import \"tailwindcss\";", "- Do not use old @tailwind base/components/utilities", "- Respect Firebase client/server boundaries", "- Do not expose server secrets or private keys to client code"] : ["- Use Vite + React + TypeScript + Tailwind", "- Keep state and components small", "- Do not add auth/database/backend unless the planning docs explicitly changed the stack"];
  return ["You are Codex running inside VS Code for this project.", "", "Project idea:", idea.trim(), "", "Locked recommendation:", `- Complexity: ${analysis.label}`, `- Stack: ${analysis.stack}`, "", "Before coding:", "- Read every file in /project-docs/*.md first", "- Confirm the locked tech stack from 02_TECH_STACK_DECISION.md", "- Implement Phase 1 only", "- Do not continue to Phase 2", "- Follow the locked tech stack exactly", "- Do not change package versions unless necessary", "- Do not refactor unrelated files", "- Keep the diff focused and explain the files changed", "", "Stack-specific rules:", ...stackSpecific, "", "After coding:", "- Run the build/lint/test commands specified for Phase 1", "- If a command fails, stop and report the exact command, exact error, and suspected root cause", "- Update the Phase 1 checklist in /project-docs/05_IMPLEMENTATION_PHASES.md if the docs ask for checklist updates", "- Report what is done, what was not done, and the next recommended phase prompt"].join("\n");
};
const buildTimeline = analysis => [["Idea Input", "current", "this app", "ใส่ไอเดียหลักภาษาไทยครั้งเดียว"], ["Complexity Analysis", "current", "this app", `ระบบประเมินเป็น ${analysis.label}`], ["Tech Stack Decision", "current", "this app", analysis.stackReason], ["Claude Planning Prompt", analysis.level <= 1 ? "next" : "current", "Claude Pro", "ให้ Claude สร้าง planning package เป็น Markdown"], ["Markdown Planning Files", "next", "Claude Pro", "สร้าง /project-docs/*.md ตามรายการไฟล์ที่กำหนด"], ["Codex Phase Build", "later", "VS Code + Codex", "ให้ Codex ทำ Phase 1 เท่านั้น"], ["Build/Lint Check", "later", "terminal", "รันคำสั่งตรวจตามที่ Claude ระบุท้าย phase"], ["Debug Rescue", "later", "Codex + Claude Pro", "ถ้า Codex แก้ไม่สำเร็จ 2 รอบ ให้ Claude วิเคราะห์ root cause"], ["Claude Review", "later", "Claude Pro", "ส่ง diff และไฟล์สำคัญให้ Claude review หลัง phase สำคัญ"], ["Deploy", "later", analysis.stackKey === "C" ? "Vercel" : "GitHub Pages", analysis.stackKey === "C" ? "deploy ผ่าน Vercel พร้อมตรวจ env/security rules" : "deploy เป็น static ผ่าน GitHub Pages"]].map(([title, status, tool, desc], index) => ({
  title,
  status,
  tool,
  desc,
  index: index + 1
}));
const buildScratchOutput = idea => {
  const analysis = analyzeIdea(idea);
  const timeline = buildTimeline(analysis);
  return ["# COOLNUTCODE AI Project Workflow Builder", "", "## 1. Idea Analysis", `Original Thai idea: ${idea.trim()}`, "", `Summary: ${analysis.explanationEn}`, `Detected signals: ${Object.entries(analysis.signals).filter(([, value]) => value).map(([key, value]) => `${key}=${value}`).join(", ") || "simple static idea"}`, "", "## 2. Complexity Level", analysis.label, "", "## 3. Recommended AI Model", analysis.ai, "", "## 4. Recommended Tech Stack", analysis.stack, analysis.stackReason, "", "## 5. Recommended IDE / Tooling", analysis.ide, "", "## 6. Claude Planning Prompt", "```text", buildClaudePrompt(idea, analysis), "```", "", "## 7. Markdown File Structure for Planning", "```text", "/project-docs/", ...planningFiles.map(file => `  ${file}`), "```", "", "## 8. Codex Implementation Prompt", "```text", buildCodexPrompt(idea, analysis), "```", "", "## 9. Phase-by-phase Implementation Workflow", "- Phase 0: Claude creates only the /project-docs planning files.", "- Phase 1: Codex reads the docs and implements the smallest usable foundation.", "- Phase 2: Codex adds the next feature group only after Phase 1 passes build/lint/test.", "- Phase 3: Codex handles persistence/auth/upload only if the selected stack requires it.", "- Phase 4: QA, responsive checks, accessibility checks, and deploy preparation.", "- After every phase: run checks, update the checklist, and stop before the next phase.", "", "## 10. Debug and Review Workflow", "- Codex must report exact command failures and exact error text.", "- If Codex fails twice on the same problem, stop and ask Claude for root cause analysis.", "- For Tailwind issues, provide globals.css, package.json, component file, and error log.", "- For Firebase issues, provide Firebase config shape, security rules, related client/server files, and error log.", "- For review, send Claude the changed files, phase checklist, command output, and known risks.", "", "## Workflow Timeline", ...timeline.map(step => `${step.index}. ${step.title} [${step.status}] - ${step.tool}: ${step.desc}`), "", "## Warnings", ...(analysis.warnings.length ? analysis.warnings.map(warning => `- ${warning}`) : ["- No special warnings."])].join("\n");
};
const modeUsage = {
  planning: {
    title: "Quick Planning Prompt",
    tool: "Claude Pro, Gemini, or Codex chat",
    ide: "Use before opening VS Code if the idea is still rough; use VS Code + Codex after the plan is accepted.",
    next: ["Paste the prompt into Claude Pro if the project is medium or complex.", "Ask Claude to keep the plan short and phase-based.", "After the plan is approved, move to Codex with one phase only."],
    promptGoal: "Create a compact project plan, not a full planning package."
  },
  build: {
    title: "Mid-Dev Feature Build Prompt",
    tool: "Codex in VS Code",
    ide: "Open the existing project folder in VS Code first, then paste this into Codex.",
    next: ["Tell Codex which files are likely related if you know them.", "Let Codex inspect the codebase before editing.", "Run the suggested build/lint/test commands before asking for the next feature."],
    promptGoal: "Implement one scoped feature with minimal unrelated changes."
  },
  debug: {
    title: "Debug and Fix Prompt",
    tool: "Codex in VS Code first, Claude Pro for root cause review if stuck",
    ide: "Use inside VS Code with the project open and the failing command/log available.",
    next: ["Paste the exact error log and reproduction steps.", "Ask Codex to explain root cause before changing code.", "If two fix attempts fail, send the logs and relevant files to Claude for root cause analysis."],
    promptGoal: "Find root cause, fix the smallest necessary area, and prevent regression."
  },
  qa: {
    title: "Final QA Review Prompt",
    tool: "Claude Pro for review, Codex for small follow-up fixes",
    ide: "Run this after the app works locally and before deployment.",
    next: ["Paste the prompt into Claude with screenshots, changed files, and test results.", "Ask for findings first, not rewrites.", "Send only confirmed fix items back to Codex one at a time."],
    promptGoal: "Audit behavior, responsiveness, accessibility, and deployment risk."
  },
  extract: {
    title: "Existing Project Context Extraction Prompt",
    tool: "Codex in VS Code",
    ide: "Open the existing project folder in VS Code. Do not paste a GitHub link and expect the AI to read it.",
    next: ["Paste this into Codex so it scans local files.", "Ask it to create or update architecture/context docs.", "Use those docs as input for later patch, debug, or QA prompts."],
    promptGoal: "Create reliable local project context before making changes."
  },
  action: {
    title: "Existing Project Patch Prompt",
    tool: "Codex in VS Code",
    ide: "Use inside VS Code after Codex can read the actual files.",
    next: ["Provide package.json, relevant files, and acceptance criteria.", "Tell Codex to edit only the files needed for this patch.", "Run build/lint/test and stop before requesting another patch."],
    promptGoal: "Apply one focused change to an existing project safely."
  },
  debug_existing: {
    title: "Existing Project Debug Rescue Prompt",
    tool: "Codex in VS Code, then Claude Pro after two failed attempts",
    ide: "Use inside VS Code with full error logs and the relevant files visible.",
    next: ["Provide the exact command and error output.", "For Tailwind issues include globals.css and package.json.", "For Firebase issues include config shape, rules, and related client/server files."],
    promptGoal: "Recover from a bug without broad refactors or repeated blind fixes."
  }
};
const buildStackNotes = analysis => {
  if (analysis.stackKey === "A") return ["This should stay static and GitHub Pages-compatible.", "Do not add a backend, package manager, build process, or Next.js conversion.", "If Codex edits the project, it should usually edit only index.html/app.js/styles.css depending on the current file layout."];
  if (analysis.stackKey === "C") return ["Use Next.js App Router, TypeScript, Tailwind CSS v4, Firebase, and Vercel only if the plan confirms full-stack needs.", "Tailwind v4 uses @import \"tailwindcss\"; in globals.css, not old @tailwind base/components/utilities.", "Firebase work must include client/server boundaries and security rules review."];
  return ["Use Vite + React + TypeScript + Tailwind when component/state complexity is real but auth/database/backend are not needed.", "Keep components small and avoid adding Firebase or Next.js unless the plan changes."];
};
const buildModePrompt = ({
  modeId,
  idea,
  analysis
}) => {
  const commonRules = ["Write the final answer in concise implementation-ready English.", "Preserve the user's constraints and do not invent unavailable project details.", "Prefer small phases, exact files, acceptance criteria, and verification commands.", "Ask clarifying questions only if the task cannot be completed safely."];
  if (modeId === "planning") {
    return ["You are a senior product planner and software architect.", "", "Task:", "Turn the user's rough project idea into a compact Step 0 plan.", "", "User idea:", idea.trim(), "", "Local analyzer context:", `- Complexity: ${analysis.label}`, `- Recommended AI flow: ${analysis.ai}`, `- Recommended stack: ${analysis.stack}`, "", "Output format:", "1. Project brief", "2. User and goal", "3. Complexity and why", "4. Recommended stack and why", "5. Core features", "6. Non-goals and overengineering risks", "7. Implementation phases", "8. Files likely to create/edit", "9. Verification commands", "10. Handoff prompt for Codex Phase 1", "", "Rules:", ...commonRules, "- Keep this shorter than a full Build From Scratch package.", "- Do not recommend Next.js if a static index.html app is enough.", ...buildStackNotes(analysis)].join("\n");
  }
  if (modeId === "build") {
    return ["You are Codex running in VS Code.", "", "Task:", "Implement exactly one scoped feature in the current project.", "", "Feature request:", idea.trim(), "", "Before editing:", "- Inspect the existing files and follow local style.", "- Identify the smallest relevant file set.", "- Restate the acceptance criteria.", "", "Implementation rules:", ...commonRules, "- Make minimal diffs.", "- Do not refactor unrelated files.", "- Do not change package versions unless necessary.", "- Stop after this feature; do not continue into adjacent work.", ...buildStackNotes(analysis), "", "After editing:", "- Run the relevant build/lint/test command if available.", "- Report exact changed files.", "- Report exact errors if verification fails."].join("\n");
  }
  if (modeId === "debug") {
    return ["You are Codex debugging inside VS Code.", "", "Bug report:", idea.trim(), "", "Debug workflow:", "1. Extract reproduction steps.", "2. Compare current behavior vs expected behavior.", "3. Identify likely files and root cause before editing.", "4. Apply the smallest safe fix.", "5. Add or describe a regression check.", "", "Rules:", ...commonRules, "- Do not rewrite working areas.", "- If the same issue fails after two fix attempts, stop and ask for Claude root cause analysis.", "- For Tailwind issues inspect package.json, globals.css/styles.css, and related components.", "- For Firebase issues inspect config shape, security rules, and client/server boundaries.", "", "After editing:", "- Run the failing command again.", "- Report the exact command, result, changed files, and remaining risk."].join("\n");
  }
  if (modeId === "qa") {
    return ["You are a strict QA reviewer.", "", "Review request:", idea.trim(), "", "Review output must prioritize findings first.", "", "Check:", "- Critical user flows", "- Missing requirements", "- Responsive layout", "- Accessibility basics", "- Console/runtime errors", "- Build/lint/test gaps", "- Deployment risk", "", "Rules:", ...commonRules, "- Do not rewrite code unless explicitly asked.", "- Separate confirmed bugs from suggestions.", "- Include exact file or UI references when possible.", "- End with a short Codex fix prompt for the highest-priority issue only."].join("\n");
  }
  if (modeId === "extract") {
    return ["You are Codex running locally in VS Code.", "", "Task:", "Inspect the existing codebase and create compact project context documents.", "", "User focus:", idea.trim(), "", "Create or update:", "- architecture.md", "- components.md", "- data-flow.md if data/state is non-trivial", "", "Inspect:", "- package.json", "- app entry points", "- routing/pages", "- components", "- state/data flow", "- styling setup", "- Firebase/API/config boundaries if present", "", "Rules:", ...commonRules, "- Read local files directly; do not rely on a GitHub URL.", "- Do not edit application behavior.", "- Keep docs short enough to reuse in later Codex prompts.", "- List risks and unknowns honestly."].join("\n");
  }
  if (modeId === "action") {
    return ["You are Codex running locally in VS Code.", "", "Patch request:", idea.trim(), "", "Before editing:", "- Read package.json and relevant context docs if present.", "- Inspect only the files needed for this patch.", "- Confirm acceptance criteria.", "", "Implementation rules:", ...commonRules, "- Preserve existing architecture and style.", "- Edit only relevant files.", "- No unrelated refactors.", "- Do not change package versions unless required.", "- If Tailwind is involved, inspect globals.css/styles.css and Tailwind version first.", "- If Firebase is involved, inspect config, rules, and client/server boundaries first.", "", "After editing:", "- Run build/lint/test or the closest available verification.", "- Report changed files, verification result, and any follow-up risks."].join("\n");
  }
  return ["You are Codex debugging an existing project in VS Code.", "", "Problem:", idea.trim(), "", "Required workflow:", "1. Read package.json and the exact error log.", "2. Identify the likely scope.", "3. Explain root cause before editing.", "4. Apply the smallest fix.", "5. Run the failing command again.", "", "Two-round rule:", "- If Codex already failed twice on this same issue, stop coding.", "- Ask Claude Pro for root cause analysis with package.json, error log, related files, and any relevant config.", "", "Special file guidance:", "- Tailwind: include package.json, globals.css/styles.css, related components, and full error log.", "- Firebase: include Firebase config shape, Firestore/Storage rules, related client/server files, and full error log.", "- Next.js: include app route files, layout files, server/client component boundary, and build error.", "", "Rules:", ...commonRules, "- No broad rewrites.", "- No unrelated refactors.", "- Report exact changed files and exact command output."].join("\n");
};
const makeLocalPrompt = ({
  activeModeData,
  activeMode,
  inputText
}) => {
  const analysis = analyzeIdea(inputText || "");
  const usage = modeUsage[activeMode] || modeUsage.planning;
  return ["# " + usage.title, "", "## When to use this output", `- Best tool: ${usage.tool}`, `- IDE/workspace: ${usage.ide}`, `- Complexity estimate: ${analysis.label}`, `- Stack guidance: ${analysis.stack}`, "", "## What to do next", ...usage.next.map(item => `- ${item}`), "", "## Copy this prompt", "```text", buildModePrompt({
    modeId: activeMode,
    idea: inputText,
    analysis
  }), "```", "", "## Why this prompt is shaped this way", `- Goal: ${usage.promptGoal}`, "- It keeps the task scoped, asks for exact files and verification, and avoids the common mistake of letting an agent continue into the next phase automatically.", "- If the generated prompt feels too broad, add file names and acceptance criteria before pasting it into the recommended tool."].filter(Boolean).join("\n");
};
const App = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [activeMode, setActiveMode] = useState("scratch");
  const [inputText, setInputText] = useState(WORKFLOWS.new.scratch.defaultText);
  const [outputText, setOutputText] = useState("");
  const [statusText, setStatusText] = useState("พร้อมใช้งานแบบ local fallback");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [rememberApiKey, setRememberApiKey] = useState(() => localStorage.getItem(STORAGE_KEYS.rememberApiKey) === "true");
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(STORAGE_KEYS.apiKey) || sessionStorage.getItem(STORAGE_KEYS.apiKey) || "");
  const [model, setModel] = useState(() => localStorage.getItem(STORAGE_KEYS.model) || DEFAULT_MODEL);
  const [useApi, setUseApi] = useState(() => Boolean(localStorage.getItem(STORAGE_KEYS.apiKey) || sessionStorage.getItem(STORAGE_KEYS.apiKey)));
  const [showSettings, setShowSettings] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeModeData = WORKFLOWS[activeTab][activeMode];
  const scratchAnalysis = useMemo(() => analyzeIdea(inputText || ""), [inputText]);
  const scratchTimeline = useMemo(() => buildTimeline(scratchAnalysis), [scratchAnalysis]);
  const isScratchMode = activeTab === "new" && activeMode === "scratch";
  const modeGuide = isScratchMode ? {
    title: "Build From Scratch ต่างจาก Step 0 ยังไง?",
    body: "โหมดนี้คือ workflow เต็ม: วิเคราะห์ไอเดีย, เลือก stack, สร้าง Claude planning prompt, สร้าง Codex phase prompt และ timeline ในครั้งเดียว เหมาะกับเริ่มโปรเจกต์ใหม่จริง"
  } : activeTab === "new" && activeMode === "planning" ? {
    title: "Legacy Step 0 Prompt",
    body: "โหมดนี้เป็น prompt optimizer แบบเก่า: รับคำขอแล้วจัดรูปเป็น planning prompt เดี่ยว ไม่ได้ตัดสิน complexity, stack และ Codex workflow ให้ครบเหมือน Build From Scratch"
  } : activeTab === "existing" ? {
    title: "Existing Project Mode",
    body: "ใช้กับโปรเจกต์ที่เปิดอยู่ใน VS Code ให้ Codex อ่านไฟล์จริงในเครื่อง แปะ task, error log, ชื่อไฟล์ และบริบทที่จำเป็นแทนการแปะลิงก์ GitHub"
  } : null;
  const apiStateLabel = useMemo(() => {
    if (!useApi) return "Local mode";
    if (!apiKey.trim()) return "API key needed";
    return "Gemini API ready";
  }, [apiKey, useApi]);
  useEffect(() => {
    if (apiKey.trim()) {
      if (rememberApiKey) {
        localStorage.setItem(STORAGE_KEYS.apiKey, apiKey.trim());
        sessionStorage.removeItem(STORAGE_KEYS.apiKey);
      } else {
        sessionStorage.setItem(STORAGE_KEYS.apiKey, apiKey.trim());
        localStorage.removeItem(STORAGE_KEYS.apiKey);
      }
    } else {
      localStorage.removeItem(STORAGE_KEYS.apiKey);
      sessionStorage.removeItem(STORAGE_KEYS.apiKey);
    }
  }, [apiKey, rememberApiKey]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.rememberApiKey, rememberApiKey ? "true" : "false");
    if (!rememberApiKey) {
      localStorage.removeItem(STORAGE_KEYS.apiKey);
      if (apiKey.trim()) sessionStorage.setItem(STORAGE_KEYS.apiKey, apiKey.trim());
    }
  }, [rememberApiKey, apiKey]);
  useEffect(() => {
    const normalized = model.trim() || DEFAULT_MODEL;
    localStorage.setItem(STORAGE_KEYS.model, normalized);
  }, [model]);
  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1800);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = outputText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1800);
    }
  };
  const handleModeChange = (tabId, modeId) => {
    setActiveTab(tabId);
    setActiveMode(modeId);
    setInputText(WORKFLOWS[tabId][modeId].defaultText || "");
    setOutputText("");
    setStatusText("เปลี่ยน workflow แล้ว");
    setIsMenuOpen(false);
  };
  const callGemini = async fullInput => {
    const payload = {
      contents: [{
        role: "user",
        parts: [{
          text: fullInput
        }]
      }],
      systemInstruction: {
        parts: [{
          text: activeModeData.systemPrompt
        }]
      },
      generationConfig: {
        temperature: 0.25
      }
    };
    const cleanModel = (model.trim() || DEFAULT_MODEL).replace(/^models\//, "");
    const response = await fetch(`${GEMINI_ENDPOINT}/${encodeURIComponent(cleanModel)}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey.trim()
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      let detail = "";
      try {
        const errorBody = await response.json();
        detail = errorBody.error?.message ? `: ${errorBody.error.message}` : "";
      } catch {}
      throw new Error(`เรียก Gemini API ไม่สำเร็จ (${response.status})${detail}`);
    }
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.map(part => part.text || "").join("\n").trim() || "ไม่พบข้อความใน response จาก API";
  };
  const generatePrompt = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setOutputText("");
    setIsCopied(false);
    if (isScratchMode) {
      const result = buildScratchOutput(inputText);
      setOutputText(result);
      setStatusText("สร้าง workflow จาก local analyzer สำเร็จ");
      setIsLoading(false);
      return;
    }
    const fullInput = makeLocalPrompt({
      activeModeData,
      activeMode,
      inputText
    });
    try {
      if (useApi && apiKey.trim()) {
        setStatusText("กำลังเรียก Gemini API...");
        const result = await callGemini(fullInput);
        setOutputText(result);
        setStatusText("สร้างด้วย Gemini API สำเร็จ");
      } else {
        const result = makeLocalPrompt({
          activeModeData,
          activeMode,
          inputText
        });
        setOutputText(result);
        setStatusText("สร้างแบบ local fallback สำเร็จ");
      }
    } catch (error) {
      const fallback = makeLocalPrompt({
        activeModeData,
        activeMode,
        inputText
      });
      setOutputText(`${fallback}\n\n---\nAPI note: ${error.message}\nระบบจึงสร้าง prompt แบบ local fallback ให้แทน`);
      setStatusText("API มีปัญหา ใช้ local fallback แทน");
    } finally {
      setIsLoading(false);
    }
  };
  return React.createElement("div", {
    className: "min-h-screen bg-[#090d14] text-slate-100"
  }, React.createElement("div", {
    className: "min-h-screen flex flex-col lg:flex-row"
  }, isMenuOpen && React.createElement("button", {
    type: "button",
    "aria-label": "Close workflow menu",
    onClick: () => setIsMenuOpen(false),
    className: "fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm lg:hidden"
  }), React.createElement("aside", {
    className: classNames("glass-panel fixed inset-y-0 left-0 z-40 w-[min(88vw,20rem)] max-w-full shrink-0 flex flex-col border-r border-slate-700/60 transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-72 lg:translate-x-0", isMenuOpen ? "translate-x-0" : "-translate-x-full")
  }, React.createElement("div", {
    className: "p-5 border-b border-slate-700/60"
  }, React.createElement("div", {
    className: "flex items-center justify-between gap-3"
  }, React.createElement("div", {
    className: "flex min-w-0 items-center gap-3"
  }, React.createElement("img", {
    src: "./logo%20coolnutcode.png",
    alt: "COOLNUTCODE logo",
    className: "h-12 w-12 shrink-0 rounded-lg object-contain"
  }), React.createElement("div", null, React.createElement("h1", {
    className: "text-xl font-bold tracking-tight"
  }, "COOLNUTCODE"), React.createElement("p", {
    className: "text-xs text-slate-400"
  }, "Static workspace for GitHub Pages"))), React.createElement("button", {
    type: "button",
    "aria-label": "Close workflow menu",
    onClick: () => setIsMenuOpen(false),
    className: "focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 lg:hidden"
  }, React.createElement(Icon, {
    name: "x",
    className: "w-4 h-4"
  })))), React.createElement("div", {
    className: "p-3 border-b border-slate-700/60 grid grid-cols-2 gap-2"
  }, TABS.map(tab => React.createElement("button", {
    key: tab.id,
    type: "button",
    onClick: () => handleModeChange(tab.id, Object.keys(WORKFLOWS[tab.id])[0]),
    className: classNames("focus-ring rounded-lg px-3 py-3 text-xs font-semibold transition flex flex-col items-center gap-1.5", activeTab === tab.id ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:bg-slate-800")
  }, React.createElement(Icon, {
    name: tab.icon,
    className: "w-4 h-4"
  }), React.createElement("span", null, tab.title)))), React.createElement("nav", {
    className: "p-4 flex-1 overflow-y-auto custom-scrollbar"
  }, React.createElement("p", {
    className: "text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3"
  }, "Workflow"), React.createElement("div", {
    className: "space-y-2"
  }, Object.values(WORKFLOWS[activeTab]).map(mode => React.createElement("button", {
    key: mode.id,
    type: "button",
    onClick: () => handleModeChange(activeTab, mode.id),
    className: classNames("focus-ring w-full text-left rounded-lg px-4 py-3 flex items-center gap-3 border transition", activeMode === mode.id ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-200" : "border-transparent text-slate-400 hover:border-slate-700 hover:bg-slate-800/80")
  }, React.createElement(Icon, {
    name: mode.icon,
    className: "w-4 h-4 shrink-0"
  }), React.createElement("span", {
    className: "text-sm font-medium"
  }, mode.title)))))), React.createElement("main", {
    className: "flex-1 min-w-0 w-full"
  }, React.createElement("header", {
    className: "glass-panel border-b border-slate-700/60 px-4 sm:px-6 py-4"
  }, React.createElement("div", {
    className: "flex flex-col xl:flex-row xl:items-center justify-between gap-4"
  }, React.createElement("div", {
    className: "flex items-center gap-3 min-w-0"
  }, React.createElement("button", {
    type: "button",
    "aria-label": "Open workflow menu",
    onClick: () => setIsMenuOpen(true),
    className: "focus-ring grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-slate-700 bg-slate-900 text-cyan-200 lg:hidden"
  }, React.createElement(Icon, {
    name: "menu",
    className: "w-5 h-5"
  })), React.createElement("img", {
    src: "./logo%20coolnutcode.png",
    alt: "COOLNUTCODE logo",
    className: "h-11 w-11 shrink-0 rounded-lg object-contain"
  }), React.createElement("div", {
    className: "min-w-0"
  }, React.createElement("h2", {
    className: "text-lg font-bold truncate"
  }, activeModeData.title), React.createElement("p", {
    className: "text-sm text-slate-400 line-clamp-2"
  }, activeModeData.desc))), React.createElement("div", {
    className: "flex w-full flex-wrap items-center gap-2 xl:w-auto"
  }, React.createElement("span", {
    className: classNames("rounded-full px-3 py-1 text-xs font-semibold border", useApi && apiKey.trim() ? "bg-emerald-400/10 text-emerald-300 border-emerald-300/25" : "bg-amber-400/10 text-amber-200 border-amber-200/25")
  }, apiStateLabel), React.createElement("button", {
    type: "button",
    onClick: () => {
      window.location.href = "./guide.html";
    },
    className: "focus-ring flex flex-1 items-center justify-center gap-2 rounded-lg border border-cyan-300/25 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-400/15 sm:flex-none"
  }, React.createElement(Icon, {
    name: "book-open",
    className: "w-4 h-4"
  }), "คู่มือ"), React.createElement("button", {
    type: "button",
    onClick: () => setShowSettings(value => !value),
    className: "focus-ring flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 sm:flex-none"
  }, React.createElement(Icon, {
    name: "settings",
    className: "w-4 h-4"
  }), "API Settings"))), showSettings && React.createElement("div", {
    className: "mt-4 grid gap-3 rounded-lg border border-slate-700 bg-slate-950/75 p-4 md:grid-cols-[1fr_1fr_auto]"
  }, React.createElement("label", {
    className: "block"
  }, React.createElement("span", {
    className: "text-xs font-semibold text-slate-400"
  }, "Gemini API Key (\u0E44\u0E21\u0E48\u0E1D\u0E31\u0E07\u0E25\u0E07\u0E44\u0E1F\u0E25\u0E4C\u0E40\u0E27\u0E47\u0E1A)"), React.createElement("input", {
    type: "password",
    value: apiKey,
    onChange: event => setApiKey(event.target.value),
    placeholder: "AIza...",
    className: "focus-ring mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600"
  })), React.createElement("label", {
    className: "block"
  }, React.createElement("span", {
    className: "text-xs font-semibold text-slate-400"
  }, "Model"), React.createElement("input", {
    type: "text",
    value: model,
    onChange: event => setModel(event.target.value),
    placeholder: DEFAULT_MODEL,
    className: "focus-ring mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600"
  })), React.createElement("label", {
    className: "flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
  }, React.createElement("input", {
    type: "checkbox",
    checked: useApi,
    onChange: event => setUseApi(event.target.checked),
    className: "h-4 w-4 accent-cyan-400"
  }), React.createElement("span", {
    className: "text-sm text-slate-200"
  }, "Use API")), React.createElement("label", {
    className: "md:col-span-3 flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2"
  }, React.createElement("input", {
    type: "checkbox",
    checked: rememberApiKey,
    onChange: event => setRememberApiKey(event.target.checked),
    className: "h-4 w-4 accent-cyan-400"
  }), React.createElement("span", {
    className: "text-sm text-slate-300"
  }, "Remember key on this browser")), React.createElement("p", {
    className: "md:col-span-3 text-xs leading-5 text-slate-500"
  }, "GitHub Pages \u0E40\u0E01\u0E47\u0E1A secret \u0E1D\u0E31\u0E48\u0E07 server \u0E44\u0E21\u0E48\u0E44\u0E14\u0E49 \u0E08\u0E36\u0E07\u0E44\u0E21\u0E48\u0E04\u0E27\u0E23\u0E1D\u0E31\u0E07 API key \u0E43\u0E19\u0E44\u0E1F\u0E25\u0E4C\u0E19\u0E35\u0E49 \u0E04\u0E48\u0E32\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19\u0E08\u0E30\u0E40\u0E01\u0E47\u0E1A\u0E04\u0E35\u0E22\u0E4C\u0E41\u0E04\u0E48\u0E43\u0E19 session \u0E02\u0E2D\u0E07 browser; \u0E16\u0E49\u0E32\u0E44\u0E21\u0E48\u0E40\u0E1B\u0E34\u0E14 API \u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E30\u0E2A\u0E23\u0E49\u0E32\u0E07 prompt \u0E14\u0E49\u0E27\u0E22 template \u0E43\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E27\u0E47\u0E1A\u0E41\u0E17\u0E19"))), React.createElement("section", {
    className: "p-4 sm:p-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]"
  }, React.createElement("div", {
    className: "grid gap-5"
  }, React.createElement("section", {
    className: "glass-panel rounded-lg overflow-hidden"
  }, React.createElement("div", {
    className: "border-b border-slate-700/60 bg-slate-900/70 p-4 grid gap-3"
  }, React.createElement("div", {
    className: "flex items-center justify-between gap-3"
  }, React.createElement("h3", {
    className: "text-xs font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "message-square",
    className: "w-4 h-4"
  }), "Thai Input Area"), React.createElement("span", {
    className: "text-xs text-slate-500"
  }, inputText.trim().length, " chars")), activeTab === "existing" && React.createElement("div", {
    className: "rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs leading-5 text-slate-400"
  }, "Existing Project mode assumes Codex is running in VS Code and can read local files directly. Paste the task, error log, and relevant file names here instead of a GitHub link.")), React.createElement("textarea", {
    className: "focus-ring custom-scrollbar block min-h-[260px] w-full resize-y bg-slate-950/70 p-5 text-sm leading-7 text-slate-100 placeholder:text-slate-600 outline-none",
    placeholder: activeModeData.placeholder,
    value: inputText,
    onChange: event => setInputText(event.target.value)
  }), React.createElement("div", {
    className: "border-t border-slate-700/60 bg-slate-900/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
  }, React.createElement("p", {
    className: "text-xs text-slate-400"
  }, statusText), React.createElement("button", {
    type: "button",
    onClick: generatePrompt,
    disabled: isLoading || !inputText.trim(),
    className: "focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500 sm:w-auto"
  }, isLoading ? React.createElement(Icon, {
    name: "loader-2",
    className: "w-4 h-4 animate-spin"
  }) : React.createElement(Icon, {
    name: "sparkles",
    className: "w-4 h-4"
  }), isLoading ? "Processing..." : isScratchMode ? "Generate Project Workflow" : "Generate English Prompt"))), isScratchMode && React.createElement("section", {
    className: "grid gap-4"
  }, React.createElement("div", {
    className: "grid gap-4 lg:grid-cols-3"
  }, React.createElement("section", {
    className: "glass-panel rounded-lg p-4"
  }, React.createElement("div", {
    className: "flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-300"
  }, React.createElement(Icon, {
    name: "scan-search",
    className: "w-4 h-4"
  }), "Analysis"), React.createElement("h3", {
    className: "mt-3 text-lg font-bold text-slate-50"
  }, scratchAnalysis.label), React.createElement("p", {
    className: "mt-2 text-sm leading-6 text-slate-400"
  }, scratchAnalysis.explanation), React.createElement("div", {
    className: "mt-3 flex flex-wrap gap-2"
  }, Object.entries(scratchAnalysis.signals).filter(([, value]) => value).slice(0, 6).map(([key, value]) => React.createElement("span", {
    key: key,
    className: "rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-slate-300"
  }, key, ": ", value)), !Object.values(scratchAnalysis.signals).some(Boolean) && React.createElement("span", {
    className: "rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-slate-300"
  }, "simple UI"))), React.createElement("section", {
    className: "glass-panel rounded-lg p-4"
  }, React.createElement("div", {
    className: "flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-300"
  }, React.createElement(Icon, {
    name: "layers-3",
    className: "w-4 h-4"
  }), "Recommended Stack"), React.createElement("h3", {
    className: "mt-3 text-base font-bold text-slate-50"
  }, scratchAnalysis.stack), React.createElement("p", {
    className: "mt-2 text-sm leading-6 text-slate-400"
  }, scratchAnalysis.stackReason)), React.createElement("section", {
    className: "glass-panel rounded-lg p-4"
  }, React.createElement("div", {
    className: "flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-300"
  }, React.createElement(Icon, {
    name: "brain-circuit",
    className: "w-4 h-4"
  }), "Recommended AI/IDE"), React.createElement("div", {
    className: "mt-3 space-y-2 text-sm"
  }, React.createElement("p", null, React.createElement("span", {
    className: "text-slate-500"
  }, "AI:"), " ", React.createElement("span", {
    className: "font-semibold text-slate-100"
  }, scratchAnalysis.ai)), React.createElement("p", null, React.createElement("span", {
    className: "text-slate-500"
  }, "IDE:"), " ", React.createElement("span", {
    className: "font-semibold text-slate-100"
  }, scratchAnalysis.ide))), scratchAnalysis.warnings.length > 0 && React.createElement("p", {
    className: "mt-3 rounded-lg border border-amber-300/20 bg-amber-300/10 p-3 text-xs leading-5 text-amber-100"
  }, scratchAnalysis.warnings[0]))), React.createElement("section", {
    className: "glass-panel rounded-lg overflow-hidden"
  }, React.createElement("div", {
    className: "border-b border-slate-700/60 bg-slate-900/70 p-4 flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "route",
    className: "w-5 h-5 text-cyan-300"
  }), React.createElement("h3", {
    className: "text-sm font-bold"
  }, "Workflow Timeline")), React.createElement("div", {
    className: "grid gap-3 p-4 md:grid-cols-2"
  }, scratchTimeline.map(step => React.createElement("div", {
    key: step.index,
    className: "rounded-lg border border-slate-800 bg-slate-950/60 p-3"
  }, React.createElement("div", {
    className: "flex items-center justify-between gap-2"
  }, React.createElement("p", {
    className: "text-sm font-bold text-slate-100"
  }, step.index, ". ", step.title), React.createElement("span", {
    className: classNames("rounded-full px-2 py-0.5 text-[11px] font-bold uppercase", step.status === "current" ? "bg-cyan-400 text-slate-950" : step.status === "next" ? "bg-emerald-400/15 text-emerald-200" : "bg-slate-800 text-slate-400")
  }, step.status)), React.createElement("p", {
    className: "mt-1 text-xs font-semibold text-cyan-200"
  }, step.tool), React.createElement("p", {
    className: "mt-2 text-xs leading-5 text-slate-400"
  }, step.desc)))))), React.createElement("section", {
    className: "glass-panel rounded-lg overflow-hidden min-h-[360px] flex flex-col"
  }, React.createElement("div", {
    className: "border-b border-slate-700/60 bg-slate-900/70 p-4 flex items-center justify-between gap-3"
  }, React.createElement("h3", {
    className: "text-xs font-bold uppercase tracking-widest text-emerald-300 flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "terminal",
    className: "w-4 h-4"
  }), isScratchMode ? "Complete Workflow Output" : "Optimized Prompt"), React.createElement("button", {
    type: "button",
    onClick: handleCopy,
    disabled: !outputText,
    className: "focus-ring inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 disabled:opacity-40"
  }, React.createElement(Icon, {
    name: isCopied ? "check" : "copy",
    className: "w-4 h-4"
  }), isCopied ? "Copied" : "Copy")), React.createElement("div", {
    className: "custom-scrollbar flex-1 overflow-auto break-words bg-[#05080f] p-4 font-mono text-sm leading-7 text-slate-300 whitespace-pre-wrap sm:p-5"
  }, outputText || React.createElement("div", {
    className: "grid h-full min-h-[260px] place-items-center text-center text-slate-600"
  }, React.createElement("div", null, React.createElement(Icon, {
    name: "box-select",
    className: "w-10 h-10 mx-auto mb-3"
  }), React.createElement("p", null, isScratchMode ? "workflow แบบเต็มจะปรากฏที่นี่" : "ผลลัพธ์ภาษาอังกฤษจะปรากฏที่นี่")))))), React.createElement("aside", {
    className: "grid gap-5 content-start"
  }, modeGuide && React.createElement("section", {
    className: "glass-panel rounded-lg p-4"
  }, React.createElement("div", {
    className: "flex items-center gap-2 text-sm font-bold text-slate-100"
  }, React.createElement(Icon, {
    name: "info",
    className: "w-5 h-5 text-cyan-300"
  }), modeGuide.title), React.createElement("p", {
    className: "mt-3 text-sm leading-6 text-slate-400"
  }, modeGuide.body)), React.createElement("section", {
    className: "glass-panel rounded-lg overflow-hidden"
  }, React.createElement("div", {
    className: "border-b border-slate-700/60 bg-slate-900/70 p-4 flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "lightbulb",
    className: "w-5 h-5 text-amber-300"
  }), React.createElement("h3", {
    className: "text-sm font-bold"
  }, "Tips & How-to")), React.createElement("ul", {
    className: "p-4 space-y-3"
  }, activeModeData.tips.map((tip, index) => React.createElement("li", {
    key: index,
    className: "flex gap-3 text-sm leading-6 text-slate-300"
  }, React.createElement("span", {
    className: "mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-400/10 text-emerald-300"
  }, React.createElement(Icon, {
    name: "check",
    className: "w-3 h-3"
  })), React.createElement("span", null, tip))))), React.createElement("section", {
    className: "glass-panel rounded-lg p-4"
  }, React.createElement("div", {
    className: "flex items-center gap-2 text-sm font-bold text-slate-100"
  }, React.createElement(Icon, {
    name: "shield-check",
    className: "w-5 h-5 text-cyan-300"
  }), "GitHub Pages Compatible"), React.createElement("p", {
    className: "mt-3 text-sm leading-6 text-slate-400"
  }, "\u0E40\u0E27\u0E47\u0E1A\u0E19\u0E35\u0E49\u0E22\u0E31\u0E07\u0E40\u0E1B\u0E47\u0E19 static HTML + React CDN \u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14 \u0E43\u0E0A\u0E49\u0E1A\u0E19 GitHub Pages \u0E44\u0E14\u0E49\u0E42\u0E14\u0E22\u0E44\u0E21\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35 backend \u0E41\u0E15\u0E48 API key \u0E08\u0E30\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E0B\u0E48\u0E2D\u0E19\u0E16\u0E49\u0E32\u0E1D\u0E31\u0E07\u0E25\u0E07 repo \u0E08\u0E36\u0E07\u0E43\u0E2B\u0E49\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E43\u0E2A\u0E48\u0E40\u0E2D\u0E07\u0E43\u0E19\u0E40\u0E1A\u0E23\u0E32\u0E27\u0E4C\u0E40\u0E0B\u0E2D\u0E23\u0E4C")))))));
};
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App, null));
