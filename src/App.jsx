import { useEffect, useState } from "react";
import AzenseLogo from "./assets/Azense-logo.png";

const API_BASE = import.meta.env.VITE_API_BASE;

// ── Patient chief complaints for 100-patient EHR ───────────────────────────
const PATIENT_CHIEF_COMPLAINTS_EHR = {
  "1": "Chest pain and shortness of breath",
  "2": "Altered mental status",
  "3": "Fever and chills",
  "4": "Abdominal pain",
  "5": "Syncope",
  "6": "Dyspnea",
  "7": "Nausea and vomiting",
  "8": "Back pain and weakness",
  "9": "Headache",
  "10": "Lower extremity swelling",
  "11": "Dizziness and falls",
  "12": "GI bleed",
  "13": "Hypertensive urgency",
  "14": "Hypoglycemia",
  "15": "Acute kidney injury",
  "16": "Substernal pressure radiating to left arm for 3 hours",
  "17": "Progressive dyspnea, orthopnea, and 8-pound weight gain over 3 days",
  "18": "Palpitations, lightheadedness, and mild dyspnea for 1 day",
  "19": "Severe occipital headache, blurry vision, and nausea with BP 230/130",
  "20": "3 days of worsening dyspnea, productive yellow sputum, and increased inhaler use",
  "21": "Fever, productive cough, and worsening dyspnea 3 days after hospital discharge",
  "22": "Sudden-onset pleuritic chest pain and dyspnea after long-haul flight",
  "23": "Found confused and diaphoretic at home, glucose 32 mg/dL",
  "24": "Several days of polyuria, polydipsia, and fatigue; home glucose reading HI",
  "25": "Decreased urine output, dizziness, and rising creatinine",
  "26": "Melena, lightheadedness, and epigastric discomfort",
  "27": "Painless bright red blood per rectum and mild lightheadedness",
  "28": "Sudden severe epigastric pain radiating to the back with nausea and vomiting",
  "29": "Several weeks of jaundice, abdominal discomfort, anorexia, and weakness",
  "30": "Progressive abdominal distension, bilateral leg edema, and fatigue over 3 weeks",
  "31": "3 days of high fevers, right flank pain, and dysuria with hypotension",
  "32": "Rapidly spreading redness and warmth of right lower leg with fevers for 2 days",
  "33": "4 days of watery diarrhea, abdominal cramping, and low-grade fevers after antibiotics",
  "34": "Acute onset right-sided weakness and expressive aphasia 1 hour ago",
  "35": "20 minutes of unilateral arm weakness and facial droop that fully resolved",
  "36": "Brief loss of consciousness in a hot crowded room with prodrome",
  "37": "Multiple episodes of large-volume hematemesis with lightheadedness",
  "38": "2 days of severe pain, swelling, and erythema of right first MTP joint",
  "39": "Plantar foot ulcer with spreading erythema, swelling, and foul-smelling drainage",
  "40": "Tremors, anxiety, palpitations, and nausea 24 hours after last drink",
  "41": "2 days of acute worsening confusion, visual hallucinations, and agitation",
  "42": "Outpatient labs showing potassium 6.5 mEq/L; asymptomatic",
  "43": "Fatigue, dizziness, unsteady gait, and mild confusion; sodium 118 mEq/L",
  "44": "Progressive leg swelling, orthopnea, and 5-pound weight gain after vacation",
  "45": "4 days of fever, purulent sputum, increased dyspnea, and chest pain",
  "46": "Cough, low-grade fevers, and dyspnea 3 days after a choking episode",
  "47": "Chronic nonhealing plantar ulcer with new deep foot pain",
  "48": "High fevers, rigors, severe left flank pain and vomiting",
  "49": "Unilateral left leg swelling, pain, and erythema 10 days post knee replacement",
  "50": "Hematemesis after repeated vomiting with heavy alcohol intake",
  "51": "Severe dyspnea at rest, hypotension, cool extremities, and oliguria",
  "52": "Sharp pleuritic chest pain improved by leaning forward, low-grade fever",
  "53": "Worsening dyspnea and somnolence in severe COPD",
  "54": "Sudden severe dyspnea, orthopnea, and pink frothy sputum after missing antihypertensives",
  "55": "Fever, severe headache, neck stiffness, and photophobia for 1 day",
  "56": "Actively seizing for over 5 minutes without regaining consciousness; missed seizure meds",
  "57": "24 hours of periumbilical pain migrating to right lower quadrant, anorexia, and fever",
  "58": "Crampy abdominal pain, vomiting, distension, and absence of flatus for 24 hours",
  "59": "Right upper quadrant pain, fevers, nausea, and vomiting with positive Murphy sign",
  "60": "2 days of progressive dyspnea, fever, and confusion with hypotension",
  "61": "Sudden severe right leg pain, pallor, coolness, and decreased pulses",
  "62": "Hypothermia, bradycardia, hypotension, and altered mental status",
  "63": "High fever, tachycardia, agitation, and diarrhea in a patient with untreated Graves disease",
  "64": "Confusion, polyuria, constipation, and proximal muscle weakness; markedly elevated calcium",
  "65": "Nausea, decreased urine output, and weakness 2 days after starting chemotherapy",
  "66": "Fever 38.9°C and chills in a patient on chemotherapy; ANC 400",
  "67": "Severe nausea, abdominal pain, Kussmaul respirations, and lethargy; missed insulin doses",
  "68": "Sudden dyspnea, pleuritic chest pain, and syncope; hypotensive",
  "69": "Confusion and focal left-sided weakness; glucose 1100 mg/dL",
  "70": "Persistent agitation and disorientation on day 5 of ICU stay after extubation",
  "71": "Increasing confusion, asterixis, and somnolence in a patient with cirrhosis",
  "72": "Diffuse abdominal pain, low-grade fevers, and worsening ascites in cirrhosis",
  "73": "Atypical chest discomfort and dyspnea; troponin elevated with ST depressions on ECG",
  "74": "Exertional chest discomfort, progressive dyspnea, and a syncopal episode climbing stairs",
  "75": "Fevers, malaise, pleuritic chest pain, and cough in an IV drug user with new murmur",
  "76": "Several weeks of progressive dyspnea, nonproductive cough, and weight loss in untreated HIV",
  "77": "Worsening edema, dyspnea, and rising creatinine despite higher outpatient diuretics",
  "78": "Pleuritic chest pain and dyspnea in patient with metastatic breast cancer; RV strain on imaging",
  "79": "Increased sputum volume and purulence with mild dyspnea; no focal infiltrate on imaging",
  "80": "Severe dyspnea, hypotension, tachycardia, and confusion; bilateral infiltrates on chest imaging",
  "81": "Melena, lightheadedness, and orthostatic hypotension on apixaban for AF",
  "82": "Palpitations, weight loss, heat intolerance, and tremor with new reduced EF and AF with RVR",
  "83": "Melena and fatigue in a dialysis patient; endoscopy shows bleeding gastric angiodysplasia",
  "84": "Rapidly progressive bilateral leg weakness, numbness, and urinary retention in metastatic breast cancer",
  "85": "Crampy left lower quadrant pain and bloody diarrhea after a hypotensive episode",
  "86": "Sudden severe headache, vomiting, and right-sided weakness; basal ganglia hemorrhage on CT",
  "87": "Collapse; telemetry shows polymorphic VT in patient on QT-prolonging medications",
  "88": "Severe dyspnea, inability to speak full sentences, accessory muscle use after viral URI",
  "89": "Pleuritic chest pain, dyspnea, and tachycardia at 28 weeks gestation",
  "90": "Progressive dyspnea, nonproductive cough, and orthopnea; large unilateral pleural effusion on imaging",
  "91": "Fevers, chills, malaise, and a new murmur in a patient with mechanical aortic valve",
  "92": "Severe diffuse bone pain after cold exposure and dehydration in sickle cell disease",
  "93": "Fever, chest pain, cough, and new pulmonary infiltrate in sickle cell disease",
  "94": "Oozing from IV sites, petechiae, thrombocytopenia, and prolonged PT/INR in septic shock",
  "95": "Multiple ICD shocks and presyncope; device shows frequent VT episodes",
  "96": "Confusion, ataxic gait, and horizontal nystagmus in a patient with alcohol use disorder",
  "97": "Epigastric pain radiating to back and vomiting; markedly elevated triglycerides",
  "98": "Diffuse muscle pain, weakness, and dark tea-colored urine after intense exercise and heat exposure",
  "99": "Fevers, rigors, flank pain, and hypotension; obstructing ureteral stone with hydroureteronephrosis",
  "100": "Worsening dyspnea on exertion and fatigue over several weeks; iron-deficiency anemia found on labs",
};

const TOP_TABS = ["notes", "medications", "labs", "imaging", "summary", "ekgs", "procedures"];
const TOP_TAB_LABELS = {
  notes: "Notes",
  medications: "Meds",
  labs: "Labs",
  imaging: "Imaging",
  summary: "Summary",
  ekgs: "EKGs",
  procedures: "Procedures",
};

const NOTE_TYPES = [
  { id: "triage", label: "Triage" },
  { id: "nursing", label: "Nursing" },
  { id: "ed", label: "ED" },
  { id: "hp", label: "H&P" },
  { id: "progress", label: "Progress" },
  { id: "consult", label: "Consults" },
  { id: "discharge", label: "Discharge" },
];

/* ── note-writing assignment per patient ── */
const ASSIGN_COLORS = {
  hp:        { bg: "linear-gradient(135deg, #E0F2FE 0%, #EFF6FF 50%, #DBEAFE 100%)",
               border: "rgba(14,165,233,0.45)", iconBg: "rgba(3,105,161,0.10)",
               label: "#0369A1", title: "#0F172A" },
  progress:  { bg: "linear-gradient(135deg, #DCFCE7 0%, #F0FDF4 50%, #D1FAE5 100%)",
               border: "rgba(22,163,74,0.40)", iconBg: "rgba(22,163,74,0.10)",
               label: "#15803D", title: "#14532D" },
  discharge: { bg: "linear-gradient(135deg, #FFF7ED 0%, #FFFBEB 50%, #FEF3C7 100%)",
               border: "rgba(245,158,11,0.50)", iconBg: "rgba(245,158,11,0.12)",
               label: "#B45309", title: "#78350F" },
};

const NOTE_ASSIGNMENTS = {
  "1":  { label: "History & Physical (H&P)",  icon: "📋", color: "hp" },
  "2":  { label: "Progress Note",             icon: "📝", color: "progress" },
  "3":  { label: "Discharge Summary",         icon: "📄", color: "discharge" },
  "4":  { label: "History & Physical (H&P)",  icon: "📋", color: "hp" },
  "5":  { label: "Progress Note",             icon: "📝", color: "progress" },
  "6":  { label: "Discharge Summary",         icon: "📄", color: "discharge" },
  "7":  { label: "History & Physical (H&P)",  icon: "📋", color: "hp" },
  "8":  { label: "Progress Note",             icon: "📝", color: "progress" },
  "9":  { label: "Discharge Summary",         icon: "📄", color: "discharge" },
  "10": { label: "History & Physical (H&P)",  icon: "📋", color: "hp" },
  "11": { label: "Progress Note",             icon: "📝", color: "progress" },
  "12": { label: "Discharge Summary",         icon: "📄", color: "discharge" },
  "13": { label: "ICU H&P (Systems-Based)",   icon: "🏥", color: "hp" },
  "14": { label: "Progress Note",             icon: "📝", color: "progress" },
  "15": { label: "Discharge Summary",         icon: "📄", color: "discharge" },
};

/* ── lab panel mapping ──────────────────────────────── */
const LAB_PANELS = [
  { id: "cbc", label: "CBC", match: /\b(hemoglobin|hematocrit|wbc|wbc count|platelets|platelet count|mcv|mch\b|mchc|rdw|neutrophil|lymphocyte|monocyte|eosinophil|basophil|bands?|neutrophil\s*%|lymphocyte\s*%|monocyte\s*%)/i },
  { id: "bmp", label: "BMP", match: /\b(sodium|potassium|chloride|co2|bicarbonate|bun|creatinine|glucose|calcium|egfr|anion\s*gap|bun\/cr)/i },
  { id: "lfts", label: "LFTs", match: /\b(alt|ast|alkaline\s*phosphatase|alk\s*phos|total\s*bilirubin|direct\s*bilirubin|total\s*protein|albumin|ggt|ldh)/i },
  { id: "coags", label: "Coags", match: /\b(pt\b|ptt|aptt|inr|fibrinogen|d-dimer|anti-xa)/i },
  { id: "cardiac", label: "Cardiac", match: /\b(troponin|high-sensitivity\s*troponin|bnp|nt-probnp|pro.?bnp|ck\b|ck-mb|myoglobin)/i },
  { id: "other", label: "Other" },
];

function categorizeLab(name) {
  const n = (name || "").trim();
  for (const panel of LAB_PANELS) {
    if (panel.match && panel.match.test(n)) return panel.id;
  }
  return "other";
}

/* ── shared style tokens ────────────────────────────────── */
const colors = {
  navy: "#0F172A",
  teal: "#0369A1",
  tealLight: "#0EA5E9",
  tealBg: "#E0F2FE",
  tealBorder: "rgba(14,165,233,0.35)",
  cardBg: "rgba(255,255,255,0.97)",
  sectionBg: "linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 100%)",
  sectionBorder: "rgba(170,210,240,0.9)",
  subtleShadow: "0 4px 16px rgba(15,23,42,0.07)",
  cardShadow: "0 20px 50px rgba(15,23,42,0.12), 0 4px 12px rgba(15,23,42,0.05)",
};

const inputFocus =
  "1px solid rgba(14,165,233,0.6)";

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(148,163,184,0.3)",
  fontSize: 14,
  outline: "none",
  background: "rgba(248,250,252,0.8)",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  boxSizing: "border-box",
};

function App() {
  const [loggedIn, setLoggedIn] = useState(
    () => window.localStorage.getItem("azense_ehr_logged_in") === "true"
  );
  const [loginError, setLoginError] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Trial / signup state
  const [showSignup, setShowSignup] = useState(false);
  const [signupData, setSignupData] = useState({
    first_name: "", last_name: "", role: "student", institution: "", email: "", username: "", password: "",
  });
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [trialExpired, setTrialExpired] = useState(false);
  const [expiredUsername, setExpiredUsername] = useState("");
  const [expiredEmail, setExpiredEmail] = useState("");
  const [upgradeLoading, setUpgradeLoading] = useState("");
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const [showUpgradePanel, setShowUpgradePanel] = useState(false);
  const [isTrial, setIsTrial] = useState(
    () => window.localStorage.getItem("azense_ehr_is_trial") === "true"
  );
  const [trialDaysLeft, setTrialDaysLeft] = useState(
    () => parseInt(window.localStorage.getItem("azense_ehr_trial_days_left") || "0", 10)
  );
  const [allowedPatients, setAllowedPatients] = useState(
    () => {
      try { return JSON.parse(window.localStorage.getItem("azense_ehr_allowed_patients") || "null"); } catch { return null; }
    }
  );
  const [displayName, setDisplayName] = useState(
    () => window.localStorage.getItem("azense_ehr_display_name") || ""
  );

  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [ehr, setEhr] = useState(null);
  const [activeTopTab, setActiveTopTab] = useState("notes");
  const [activeNoteType, setActiveNoteType] = useState("hp");
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [ownNote, setOwnNote] = useState("");
  const [selectedLabPanel, setSelectedLabPanel] = useState(null);
  const [selectedLabDay, setSelectedLabDay] = useState(null);

  const _storeAuthData = (json, usernameOverride) => {
    window.localStorage.setItem("azense_ehr_logged_in", "true");
    window.localStorage.setItem("azense_ehr_last_active", Date.now().toString());
    window.localStorage.setItem("azense_ehr_token", json.token);
    window.localStorage.setItem("azense_ehr_username", json.username || usernameOverride);
    window.localStorage.setItem("azense_ehr_is_trial", json.is_trial ? "true" : "false");
    window.localStorage.setItem("azense_ehr_trial_days_left", String(json.trial_days_left || 0));
    window.localStorage.setItem("azense_ehr_allowed_patients", JSON.stringify(json.allowed_patients || null));
    window.localStorage.setItem("azense_ehr_display_name", json.display_name || "");
    setIsTrial(!!json.is_trial);
    setTrialDaysLeft(json.trial_days_left || 0);
    setAllowedPatients(json.allowed_patients || null);
    setDisplayName(json.display_name || "");
    setLoggedIn(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        if (res.status === 403 && errJson?.detail?.trial_expired) {
          setTrialExpired(true);
          setExpiredUsername(errJson.detail.username || "");
          setExpiredEmail(errJson.detail.email || "");
          return;
        }
        let detail = "Invalid username or password.";
        if (errJson?.detail) {
          detail = typeof errJson.detail === "string" ? errJson.detail
            : Array.isArray(errJson.detail) ? errJson.detail.map(e => e.msg || JSON.stringify(e)).join(", ")
            : "Invalid username or password.";
        }
        setLoginError(detail);
        return;
      }
      const json = await res.json();
      if (!json.token) {
        throw new Error("No token in response");
      }
      _storeAuthData(json, loginUsername);
    } catch (err) {
      console.error(err);
      if (!loginError) setLoginError("Invalid username or password.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError("");
    setSignupLoading(true);
    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        const detail = errJson?.detail;
        const msg = !detail ? "Signup failed. Please try again."
          : typeof detail === "string" ? detail
          : Array.isArray(detail) ? detail.map(e => e.msg || JSON.stringify(e)).join(", ")
          : "Signup failed. Please try again.";
        setSignupError(msg);
        return;
      }
      const json = await res.json();
      _storeAuthData(json, signupData.username);
    } catch (err) {
      console.error(err);
      setSignupError("Connection error. Please try again.");
    } finally {
      setSignupLoading(false);
    }
  };

  const handleUpgrade = async (plan) => {
    setUpgradeLoading(plan);
    try {
      const res = await fetch(`${API_BASE}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, username: expiredUsername || loginUsername || window.localStorage.getItem("azense_ehr_username") || "", email: expiredEmail }),
      });
      const json = await res.json();
      if (json.url) {
        window.open(json.url, "_blank");
      } else {
        alert("Could not start checkout. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Connection error. Please try again.");
    } finally {
      setUpgradeLoading("");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("upgrade") === "success") {
      window.history.replaceState({}, "", window.location.pathname);
      setUpgradeSuccess(true);
    }
  }, []);

  /* ── 3-hour inactivity auto-logout ── */
  useEffect(() => {
    const TIMEOUT_MS = 3 * 60 * 60 * 1000; // 3 hours

    const resetTimer = () => {
      window.localStorage.setItem("azense_ehr_last_active", Date.now().toString());
    };

    const checkTimeout = () => {
      const last = parseInt(window.localStorage.getItem("azense_ehr_last_active") || "0", 10);
      if (Date.now() - last > TIMEOUT_MS) {
        window.localStorage.removeItem("azense_ehr_logged_in");
        window.localStorage.removeItem("azense_ehr_last_active");
        setLoggedIn(false);
      }
    };

    // Check every minute
    const interval = setInterval(checkTimeout, 60 * 1000);

    // Reset timer on any user activity
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((ev) => window.addEventListener(ev, resetTimer, { passive: true }));

    return () => {
      clearInterval(interval);
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
    };
  }, [loggedIn]);

  /* ── load patient list ── */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/ehr/patients`);
        const json = await res.json();
        const list = Array.isArray(json)
          ? json
          : Array.isArray(json?.patients)
          ? json.patients
          : Array.isArray(json?.data)
          ? json.data
          : [];
        let filtered = list;
        // Trial users can only see allowed patients
        if (allowedPatients && allowedPatients.length > 0) {
          filtered = filtered.filter(p => allowedPatients.includes(String(p.id)));
        }
        setPatients(filtered);
        if (filtered.length > 0) setSelectedPatientId(filtered[0].id);
      } catch (err) {
        console.error("Patient load error:", err);
        setPatients([]);
      }
    })();
  }, [allowedPatients]);

  /* ── load EHR for selected patient ── */
  useEffect(() => {
    if (!selectedPatientId) return;
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/ehr/patients/${selectedPatientId}`
        );
        const json = await res.json();
        setEhr(json);
        setSelectedNoteId(null);
        setOwnNote("");
        setSelectedLabPanel(null);
        setSelectedLabDay(null);
      } catch (err) {
        console.error("EHR load error:", err);
      }
    })();
  }, [selectedPatientId]);

  const notesOfType =
    ehr?.notes?.filter((n) => n.type === activeNoteType) ?? [];
  const selectedNote =
    notesOfType.find((n) => n.id === selectedNoteId) || notesOfType[0];

  /* ══════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════ */

  // ───── LOGIN SCREEN ─────
  if (!loggedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
          background:
            "linear-gradient(165deg, #C8E3F5 0%, #D6E4FA 30%, #D0DAEF 60%, #DEE5F0 100%)",
        }}
      >
        <div
          style={{
            width: 380,
            padding: "40px 36px",
            borderRadius: 24,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 25px 60px rgba(15,23,42,0.12), 0 4px 16px rgba(15,23,42,0.05)",
            border: "1px solid rgba(190,210,235,0.5)",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: 28,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={AzenseLogo}
              alt="AZense logo"
              style={{
                height: 120,
                width: "auto",
                marginBottom: 16,
                filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.06))",
              }}
            />
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#0F172A",
                letterSpacing: "-0.02em",
              }}
            >
              Sign in to AZense EHR
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#64748B",
                marginTop: 6,
              }}
            >
              Simulation EHR for teaching
            </div>
          </div>

          {upgradeSuccess && (
            <div style={{
              padding: "14px 18px", borderRadius: 12, marginBottom: 14,
              background: "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
              border: "1px solid #A7F3D0", textAlign: "center",
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#065F46", marginBottom: 4 }}>
                Payment successful
              </div>
              <div style={{ fontSize: 12, color: "#047857" }}>
                Your subscription is active. Sign in to access all patients, cases, and features.
              </div>
            </div>
          )}

          {!trialExpired ? (<>
          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <input
              type="text"
              placeholder="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              style={inputStyle}
            />

            {loginError && (
              <div
                style={{
                  fontSize: 12,
                  color: "#DC2626",
                  padding: "8px 12px",
                  borderRadius: 10,
                  background: "rgba(239,68,68,0.06)",
                  border: "1px solid rgba(239,68,68,0.15)",
                }}
              >
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              style={{
                marginTop: 4,
                width: "100%",
                padding: "12px 16px",
                borderRadius: 14,
                border: "none",
                background:
                  "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
                color: "#F8FAFC",
                fontWeight: 700,
                fontSize: 14,
                cursor: loginLoading ? "wait" : "pointer",
                letterSpacing: "0.01em",
                boxShadow: "0 8px 24px rgba(15,23,42,0.20)",
                transition: "transform 0.1s ease, box-shadow 0.15s ease",
              }}
            >
              {loginLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* ── Sign Up toggle ── */}
          {!showSignup ? (
            <button
              onClick={() => { setShowSignup(true); setLoginError(""); }}
              style={{
                marginTop: 12,
                width: "100%",
                padding: "10px 16px",
                borderRadius: 12,
                border: "1px solid #CBD5E1",
                background: "transparent",
                color: "#475569",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              Create Free Trial Account
            </button>
          ) : (
            <form
              onSubmit={handleSignup}
              style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16,
                       padding: 16, borderRadius: 14, border: "1px solid #E2E8F0", background: "rgba(248,250,252,0.7)" }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", marginBottom: 2 }}>
                7-Day Free Trial
              </div>
              <div style={{ fontSize: 11, color: "#64748B", marginBottom: 4 }}>
                Access to Patient 1, 2, and 3 during your trial period.
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <input placeholder="First name" required value={signupData.first_name}
                  onChange={(e) => setSignupData({ ...signupData, first_name: e.target.value })}
                  style={{ ...inputStyle, flex: 1 }} />
                <input placeholder="Last name" required value={signupData.last_name}
                  onChange={(e) => setSignupData({ ...signupData, last_name: e.target.value })}
                  style={{ ...inputStyle, flex: 1 }} />
              </div>

              <select value={signupData.role}
                onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="student">Student</option>
                <option value="resident">Resident</option>
                <option value="physician">Physician</option>
              </select>

              <input placeholder="Medical school or residency program" required value={signupData.institution}
                onChange={(e) => setSignupData({ ...signupData, institution: e.target.value })}
                style={inputStyle} />
              <input type="email" placeholder="Email" required value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                style={inputStyle} />
              <input placeholder="Choose a username" required value={signupData.username}
                onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                style={inputStyle} />
              <input type="password" placeholder="Choose a password (min 6 chars)" required
                minLength={6} value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                style={inputStyle} />

              {signupError && (
                <div style={{ fontSize: 12, color: "#DC2626", padding: "8px 12px", borderRadius: 10,
                  background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
                  {signupError}
                </div>
              )}

              <button type="submit" disabled={signupLoading}
                style={{
                  width: "100%", padding: "11px 16px", borderRadius: 14, border: "none",
                  background: "linear-gradient(135deg, #0F766E 0%, #0D9488 50%, #0F766E 100%)",
                  color: "#F0FDFA", fontWeight: 700, fontSize: 13,
                  cursor: signupLoading ? "wait" : "pointer",
                  boxShadow: "0 6px 20px rgba(15,118,110,0.20)",
                  transition: "transform 0.1s ease",
                }}>
                {signupLoading ? "Creating account\u2026" : "Start Free Trial"}
              </button>

              <button type="button" onClick={() => { setShowSignup(false); setSignupError(""); }}
                style={{ background: "none", border: "none", color: "#94A3B8",
                  fontSize: 12, cursor: "pointer", marginTop: 2 }}>
                ← Back to Sign In
              </button>
            </form>
          )}
          </>) : (
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1E293B", marginBottom: 6 }}>
                Your free trial has expired
              </div>
              <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 20px" }}>
                Upgrade to get full access to all question banks, cases, and features.
              </p>
              <div style={{
                border: "1px solid #E2E8F0", borderRadius: 14, padding: "16px 20px",
                marginBottom: 10, textAlign: "left", background: "rgba(248,250,252,0.7)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>Monthly</div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>$19.99 / month</div>
                  </div>
                  <button onClick={() => handleUpgrade("monthly")} disabled={!!upgradeLoading}
                    style={{
                      padding: "8px 20px", borderRadius: 10, border: "none",
                      background: "linear-gradient(135deg, #0F766E, #0D9488)",
                      color: "#F0FDFA", fontWeight: 700, fontSize: 13,
                      cursor: upgradeLoading ? "wait" : "pointer",
                    }}>
                    {upgradeLoading === "monthly" ? "Loading\u2026" : "Subscribe"}
                  </button>
                </div>
              </div>
              <div style={{
                border: "2px solid #0D9488", borderRadius: 14, padding: "16px 20px",
                marginBottom: 16, textAlign: "left", background: "rgba(240,253,250,0.5)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0F766E" }}>
                      Yearly <span style={{ fontSize: 11, fontWeight: 600, color: "#0D9488", background: "#CCFBF1", padding: "2px 8px", borderRadius: 6, marginLeft: 6 }}>Save $40</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>$200 / year ($16.67/mo)</div>
                  </div>
                  <button onClick={() => handleUpgrade("yearly")} disabled={!!upgradeLoading}
                    style={{
                      padding: "8px 20px", borderRadius: 10, border: "none",
                      background: "linear-gradient(135deg, #0F766E, #0D9488)",
                      color: "#F0FDFA", fontWeight: 700, fontSize: 13,
                      cursor: upgradeLoading ? "wait" : "pointer",
                    }}>
                    {upgradeLoading === "yearly" ? "Loading\u2026" : "Subscribe"}
                  </button>
                </div>
              </div>
              <button onClick={() => { setTrialExpired(false); setLoginError(""); }}
                style={{ background: "none", border: "none", color: "#94A3B8", fontSize: 12, cursor: "pointer" }}>
                ← Back to Sign In
              </button>
            </div>
          )}

          {/* ── Training link ── */}
          <div style={{ borderTop: "1px solid #E2E8F0", marginTop: 24 }} />
          <a
            href="https://training.azense.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 14,
              padding: "11px 14px",
              borderRadius: 12,
              border: "1px solid #DDE5F0",
              backgroundColor: "#F8FAFD",
              textDecoration: "none",
              color: "#334155",
              boxShadow: "0 1px 4px rgba(15,23,42,0.05)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#EEF3FB";
              e.currentTarget.style.borderColor = "#B6C8E8";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(15,23,42,0.10)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#F8FAFD";
              e.currentTarget.style.borderColor = "#DDE5F0";
              e.currentTarget.style.boxShadow = "0 1px 4px rgba(15,23,42,0.05)";
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34,
                height: 34,
                borderRadius: 8,
                backgroundColor: "#E8F4EC",
                color: "#047857",
                flexShrink: 0,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </span>
            <span style={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1E3A5F", lineHeight: 1.3 }}>
                Open AZense Training
              </span>
              <span style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.3 }}>
                training.azense.app
              </span>
            </span>
            <span style={{ color: "#94A3B8", fontSize: 14, lineHeight: 1 }}>↗</span>
          </a>
        </div>
      </div>
    );
  }

  // ───── MAIN APP ─────
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px 16px",
        background:
          "linear-gradient(165deg, #C8E3F5 0%, #D6E4FA 30%, #D0DAEF 60%, #DEE5F0 100%)",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      {/* ── main card ── */}
      <div
        style={{
          width: "100%",
          maxWidth: 1400,
          background: "rgba(255,255,255,0.90)",
          borderRadius: 20,
          padding: "28px 28px 32px",
          boxShadow: colors.cardShadow,
          border: "1px solid rgba(190,210,235,0.5)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Trial banner */}
        {isTrial && trialDaysLeft > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              padding: "10px 16px", borderRadius: showUpgradePanel ? "12px 12px 0 0" : 12,
              background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
              border: "1px solid #A7F3D0", borderBottom: showUpgradePanel ? "none" : "1px solid #A7F3D0",
              flexWrap: "wrap",
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#065F46" }}>
                Free Trial {displayName ? `\u2014 Welcome, ${displayName}` : ""}
              </span>
              <span style={{
                fontSize: 12, fontWeight: 700, color: "#047857",
                padding: "3px 10px", borderRadius: 999, background: "rgba(5,150,105,0.12)",
              }}>
                {trialDaysLeft} {trialDaysLeft === 1 ? "day" : "days"} remaining
              </span>
              <button onClick={() => setShowUpgradePanel(!showUpgradePanel)} style={{
                padding: "4px 14px", borderRadius: 8, border: "none",
                background: "#047857", color: "#ECFDF5", fontWeight: 700,
                fontSize: 12, cursor: "pointer", transition: "all 0.15s",
              }}>
                {showUpgradePanel ? "Close" : "Upgrade"}
              </button>
            </div>

            {showUpgradePanel && (
              <div style={{
                background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                border: "1px solid #A7F3D0", borderTop: "none",
                borderRadius: "0 0 12px 12px",
                padding: "20px 16px",
              }}>
                <div style={{ textAlign: "center", marginBottom: 14 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#F0FDFA" }}>Choose Your Plan</div>
                  <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>Full access to all patients, question banks, and features</div>
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  {/* Monthly */}
                  <div style={{
                    flex: "1 1 180px", maxWidth: 220, borderRadius: 12, padding: "16px 18px",
                    border: "1px solid rgba(148,163,184,0.25)", background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(8px)",
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0" }}>Monthly</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#5EEAD4", margin: "6px 0 2px" }}>$19.99<span style={{ fontSize: 12, fontWeight: 500, color: "#94A3B8" }}>/mo</span></div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 14 }}>Billed monthly</div>
                    <button onClick={() => handleUpgrade("monthly")} disabled={!!upgradeLoading} style={{
                      width: "100%", padding: "9px 16px", borderRadius: 10,
                      border: "1px solid rgba(94,234,212,0.3)", background: "transparent",
                      color: "#5EEAD4", fontWeight: 600, fontSize: 13,
                      cursor: upgradeLoading ? "wait" : "pointer", transition: "all 0.15s",
                    }}>
                      {upgradeLoading === "monthly" ? "Loading\u2026" : "Select Monthly"}
                    </button>
                  </div>
                  {/* Yearly */}
                  <div style={{
                    flex: "1 1 180px", maxWidth: 220, borderRadius: 12, padding: "16px 18px",
                    border: "2px solid #0D9488", background: "rgba(13,148,136,0.1)",
                    backdropFilter: "blur(8px)", position: "relative",
                  }}>
                    <span style={{
                      position: "absolute", top: -10, right: 12,
                      fontSize: 10, fontWeight: 700, color: "#0F766E",
                      background: "#CCFBF1", padding: "2px 10px", borderRadius: 999,
                    }}>BEST VALUE</span>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#5EEAD4" }}>Yearly</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#5EEAD4", margin: "6px 0 2px" }}>$200<span style={{ fontSize: 12, fontWeight: 500, color: "#94A3B8" }}>/yr</span></div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 14 }}>$16.67/mo \u2014 Save $40</div>
                    <button onClick={() => handleUpgrade("yearly")} disabled={!!upgradeLoading} style={{
                      width: "100%", padding: "9px 16px", borderRadius: 10,
                      border: "none", background: "linear-gradient(135deg, #0F766E, #0D9488)",
                      color: "#F0FDFA", fontWeight: 700, fontSize: 13,
                      cursor: upgradeLoading ? "wait" : "pointer",
                      boxShadow: "0 4px 16px rgba(29,233,182,0.2)", transition: "all 0.15s",
                    }}>
                      {upgradeLoading === "yearly" ? "Loading\u2026" : "Select Yearly"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── HEADER ── */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 20,
            paddingBottom: 20,
            borderBottom: "1px solid rgba(148,163,184,0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img
              src={AzenseLogo}
              alt="AZense logo"
              style={{
                height: 80,
                width: "auto",
                filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.05))",
              }}
            />
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: "#64748B",
                  fontWeight: 500,
                  letterSpacing: "0.03em",
                  marginBottom: 2,
                }}
              >
                Simulation EHR
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: colors.teal,
                  fontWeight: 600,
                }}
              >
                Read-only teaching view of sample admissions
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                padding: "7px 16px",
                borderRadius: 999,
                border: `1px solid ${colors.tealBorder}`,
                background:
                  "linear-gradient(135deg, #F0F9FF 0%, #ECFEFF 100%)",
                fontSize: 12,
                fontWeight: 600,
                color: colors.teal,
                whiteSpace: "nowrap",
                letterSpacing: "0.01em",
              }}
            >
              View only · No note writing in EHR
            </div>

            {/* ── Training pill ── */}
            <a
              href="https://training.azense.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                borderRadius: 999,
                border: "1px solid #A8D5B5",
                background: "rgba(220,243,228,0.7)",
                textDecoration: "none",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                color: "#14532D",
                letterSpacing: "0.01em",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(187,232,200,0.9)";
                e.currentTarget.style.borderColor = "#6BBF85";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(220,243,228,0.7)";
                e.currentTarget.style.borderColor = "#A8D5B5";
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              AZense Training
            </a>

            <button
              onClick={() => {
                window.localStorage.removeItem("azense_ehr_logged_in");
                window.localStorage.removeItem("azense_ehr_token");
                window.localStorage.removeItem("azense_ehr_username");
                window.localStorage.removeItem("azense_ehr_is_trial");
                window.localStorage.removeItem("azense_ehr_trial_days_left");
                window.localStorage.removeItem("azense_ehr_allowed_patients");
                window.localStorage.removeItem("azense_ehr_display_name");
                setLoggedIn(false);
                setLoginUsername("");
                setLoginPassword("");
                setLoginError("");
                setIsTrial(false);
                setTrialDaysLeft(0);
                setAllowedPatients(null);
                setDisplayName("");
                setEhr(null);
                setOwnNote("");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 16px",
                borderRadius: 999,
                border: "1px solid rgba(220,38,38,0.25)",
                background: "rgba(254,242,242,0.6)",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                color: "#DC2626",
                letterSpacing: "0.01em",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(254,226,226,0.9)";
                e.currentTarget.style.borderColor = "rgba(220,38,38,0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(254,242,242,0.6)";
                e.currentTarget.style.borderColor = "rgba(220,38,38,0.25)";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Log out
            </button>
          </div>
        </header>

        {/* ── PATIENT SELECTOR ── */}
        <section
          style={{
            marginBottom: 16,
            padding: "16px 18px",
            borderRadius: 16,
            background: colors.sectionBg,
            border: `1px solid ${colors.sectionBorder}`,
            boxShadow: colors.subtleShadow,
          }}
        >
          {/* Patient selector — Select Patient button + modal */}
          <div style={{ marginBottom: 8 }}>
            <button
              onClick={() => setShowPatientModal(true)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 12,
                border: "1.5px solid #0F766E",
                background: "linear-gradient(135deg, #CCFBF1 0%, #D1FAE5 100%)",
                color: "#134E4A",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                letterSpacing: "0.01em",
                boxShadow: "0 2px 10px rgba(15,118,110,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <span>
                {selectedPatientId
                  ? `▶ Patient #${selectedPatientId}`
                  : "Select Patient"}
              </span>
              <span style={{ fontSize: 11, color: "#0F766E", fontWeight: 500 }}>
                {selectedPatientId && PATIENT_CHIEF_COMPLAINTS_EHR[String(selectedPatientId)]
                  ? PATIENT_CHIEF_COMPLAINTS_EHR[String(selectedPatientId)].length > 40
                    ? PATIENT_CHIEF_COMPLAINTS_EHR[String(selectedPatientId)].slice(0, 40) + "…"
                    : PATIENT_CHIEF_COMPLAINTS_EHR[String(selectedPatientId)]
                  : "Click to browse 100 cases"}
              </span>
            </button>
          </div>

          {/* Patient selection modal */}
          {showPatientModal && (
            <div
              onClick={() => setShowPatientModal(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(15,23,42,0.55)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "#FFFFFF",
                  borderRadius: 20,
                  boxShadow: "0 24px 80px rgba(15,23,42,0.28)",
                  width: "min(92vw, 900px)",
                  maxHeight: "82vh",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {/* Modal header */}
                <div style={{
                  padding: "20px 24px 16px",
                  borderBottom: "1px solid #E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexShrink: 0,
                }}>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.01em" }}>
                      Select Patient
                    </div>
                    <div style={{ fontSize: 12, color: "#64748B", marginTop: 3 }}>
                      {patients.length} patients available — click a case to load the EHR
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPatientModal(false)}
                    style={{
                      width: 32, height: 32, borderRadius: "50%",
                      border: "1px solid #E2E8F0", background: "#F8FAFC",
                      color: "#475569", fontSize: 16, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, flexShrink: 0,
                    }}
                  >
                    ×
                  </button>
                </div>
                {/* Modal body — scrollable grid */}
                <div style={{
                  overflowY: "auto",
                  padding: "16px 20px 24px",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: 10,
                }}>
                  {patients.length === 0 ? (
                    <div style={{ gridColumn: "1/-1", padding: 32, textAlign: "center", color: "#94A3B8" }}>
                      Loading patients…
                    </div>
                  ) : (
                    patients.map((p) => {
                      const active = selectedPatientId === p.id;
                      const cc = PATIENT_CHIEF_COMPLAINTS_EHR[String(p.id)];
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            setSelectedPatientId(p.id);
                            setShowPatientModal(false);
                          }}
                          style={{
                            padding: "12px 14px",
                            borderRadius: 12,
                            border: active ? "2px solid #0F766E" : "1.5px solid #E2E8F0",
                            background: active
                              ? "linear-gradient(135deg, #CCFBF1, #D1FAE5)"
                              : "#FAFAFA",
                            color: active ? "#134E4A" : "#1E293B",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.12s ease",
                            boxShadow: active
                              ? "0 4px 14px rgba(15,118,110,0.2)"
                              : "0 1px 3px rgba(15,23,42,0.05)",
                          }}
                        >
                          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                            Patient #{p.id}
                          </div>
                          <div style={{
                            fontSize: 11,
                            color: active ? "#0F766E" : "#64748B",
                            lineHeight: 1.4,
                            fontWeight: 400,
                          }}>
                            {cc || p.label || `Patient ${p.id}`}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {ehr?.overview?.brief_reason && (
            <div
              style={{
                marginTop: 6,
                fontSize: 12,
                color: "#475569",
                fontStyle: "italic",
              }}
            >
              Reason: {ehr.overview.brief_reason}
            </div>
          )}
        </section>

        {/* ── NOTE ASSIGNMENT BANNER ── */}
        {(() => {
          const assign = NOTE_ASSIGNMENTS[String(selectedPatientId)];
          if (!assign) return null;
          const ac = ASSIGN_COLORS[assign.color];
          return (
            <div
              style={{
                marginBottom: 14,
                padding: "14px 20px",
                borderRadius: 14,
                background: ac.bg,
                border: `1.5px solid ${ac.border}`,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: ac.iconBg,
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                {assign.icon}
              </span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: ac.label,
                    marginBottom: 3,
                  }}
                >
                  Your Assignment
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: ac.title,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Write a {assign.label}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── TOP TABS ── */}
        <section style={{ marginBottom: 12 }}>
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              padding: "5px 6px",
              borderRadius: 14,
              background: "rgba(241,245,249,0.8)",
              border: "1px solid rgba(226,232,240,0.8)",
            }}
          >
            {TOP_TABS.map((id) => {
              const active = activeTopTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTopTab(id)}
                  style={{
                    padding: "7px 16px",
                    borderRadius: 10,
                    border: "none",
                    background: active
                      ? "linear-gradient(135deg, #0284C7, #0EA5E9)"
                      : "transparent",
                    color: active ? "#FFFFFF" : "#475569",
                    fontWeight: active ? 700 : 500,
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    boxShadow: active
                      ? "0 4px 12px rgba(14,165,233,0.25)"
                      : "none",
                  }}
                >
                  {TOP_TAB_LABELS[id]}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── CONTENT AREA ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 20,
          }}
        >
          {/* ── EHR content panel ── */}
          <section
            style={{
              padding: "18px 20px",
              borderRadius: 16,
              border: `1px solid ${colors.sectionBorder}`,
              background: colors.sectionBg,
              boxShadow: colors.subtleShadow,
              minHeight: 320,
            }}
          >
            {/* ─── NOTES TAB ─── */}
            {activeTopTab === "notes" && (
              <div style={{ display: "flex", gap: 14, minHeight: 400 }}>
                {/* Note type sidebar */}
                <div style={{ width: 150, flexShrink: 0 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#94A3B8",
                      marginBottom: 8,
                      padding: "0 2px",
                    }}
                  >
                    Note types
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                    }}
                  >
                    {NOTE_TYPES.map((nt) => {
                      const active = nt.id === activeNoteType;
                      return (
                        <button
                          key={nt.id}
                          onClick={() => {
                            setActiveNoteType(nt.id);
                            setSelectedNoteId(null);
                          }}
                          style={{
                            padding: "8px 12px",
                            borderRadius: 10,
                            border: "none",
                            background: active
                              ? "linear-gradient(135deg, #E0F2FE, #ECFEFF)"
                              : "transparent",
                            color: active ? "#075985" : "#334155",
                            fontSize: 12,
                            fontWeight: active ? 700 : 500,
                            textAlign: "left",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            borderLeft: active
                              ? "3px solid #0EA5E9"
                              : "3px solid transparent",
                          }}
                        >
                          {nt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Note content area */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#94A3B8",
                      marginBottom: 8,
                    }}
                  >
                    {activeNoteType.toUpperCase()} notes
                  </div>
                  <div style={{ display: "flex", gap: 12, height: 420 }}>
                    {/* Note list */}
                    <div
                      style={{
                        width: 200,
                        borderRadius: 12,
                        border: "1px solid rgba(226,232,240,0.8)",
                        background: "#FFFFFF",
                        overflowY: "auto",
                      }}
                    >
                      {notesOfType.length === 0 && (
                        <div
                          style={{
                            padding: 14,
                            color: "#94A3B8",
                            fontSize: 12,
                            textAlign: "center",
                          }}
                        >
                          No notes of this type.
                        </div>
                      )}
                      {notesOfType.map((n) => {
                        const active = selectedNote?.id === n.id;
                        return (
                          <div
                            key={n.id}
                            onClick={() => setSelectedNoteId(n.id)}
                            style={{
                              padding: "10px 12px",
                              borderBottom: "1px solid rgba(241,245,249,0.9)",
                              cursor: "pointer",
                              background: active
                                ? "linear-gradient(135deg, rgba(224,242,254,0.7), rgba(236,254,255,0.7))"
                                : "transparent",
                              borderLeft: active
                                ? "3px solid #0EA5E9"
                                : "3px solid transparent",
                              transition: "all 0.12s ease",
                            }}
                          >
                            <div
                              style={{
                                fontWeight: active ? 700 : 600,
                                color: active ? "#075985" : "#0F172A",
                                fontSize: 12,
                                marginBottom: 2,
                              }}
                            >
                              {n.title || "Note"}
                            </div>
                            {n.timestamp && (
                              <div
                                style={{
                                  fontSize: 10,
                                  color: "#94A3B8",
                                }}
                              >
                                {n.timestamp}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Note text viewer */}
                    <div
                      style={{
                        flex: 1,
                        borderRadius: 12,
                        border: "1px solid rgba(226,232,240,0.8)",
                        background: "#FFFFFF",
                        padding: "16px 20px",
                        overflowY: "auto",
                        fontSize: 13,
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.65,
                        color: "#1E293B",
                      }}
                    >
                      {selectedNote ? (
                        <>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: 14,
                              marginBottom: 8,
                              color: colors.navy,
                              paddingBottom: 8,
                              borderBottom: "1px solid rgba(226,232,240,0.6)",
                            }}
                          >
                            {selectedNote.title}
                          </div>
                          <div>{selectedNote.text}</div>
                        </>
                      ) : (
                        <div
                          style={{
                            color: "#94A3B8",
                            textAlign: "center",
                            paddingTop: 60,
                          }}
                        >
                          Select a note to view its contents.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── MEDICATIONS TAB ─── */}
            {activeTopTab === "medications" && (() => {
              const meds = ehr?.medications || {};
              const MedCard = ({ med, bg, border, tagColor, tagBg, tagText }) => (
                <div style={{
                  background: bg, border: `1px solid ${border}`,
                  borderRadius: 8, padding: "10px 14px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>
                      {med.name}
                    </span>
                    {tagText && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, color: tagColor,
                        background: tagBg, padding: "2px 6px",
                        borderRadius: 4, letterSpacing: 0.5,
                      }}>{tagText}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "#334155", marginTop: 3 }}>
                    {[med.dose, med.route, med.frequency].filter(Boolean).join(" · ")}
                  </div>
                  {med.indication && (
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
                      {med.indication}
                    </div>
                  )}
                  {med.reason && (
                    <div style={{ fontSize: 11, color: "#B45309", marginTop: 2, fontStyle: "italic" }}>
                      {med.reason}
                    </div>
                  )}
                  {(med.start_day || med.admin_day) && (
                    <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 3 }}>
                      {med.admin_day ? `Administered ${med.admin_day}` : `Started ${med.start_day}`}
                    </div>
                  )}
                </div>
              );

              const Section = ({ title, icon, color, borderColor, items, emptyText, bg, border, tagColor, tagBg, tagText }) => (
                <div style={{ marginBottom: 20 }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    fontSize: 12, fontWeight: 700, color,
                    marginBottom: 8, borderBottom: `2px solid ${borderColor}`,
                    paddingBottom: 6, textTransform: "uppercase", letterSpacing: 0.5,
                  }}>
                    <span>{icon}</span> {title}
                    <span style={{
                      fontSize: 10, fontWeight: 600, color: "#94A3B8",
                      marginLeft: "auto", textTransform: "none", letterSpacing: 0,
                    }}>{items?.length || 0}</span>
                  </div>
                  {items?.length ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      {items.map((med, idx) => (
                        <MedCard key={idx} med={med} bg={bg} border={border}
                          tagColor={tagColor} tagBg={tagBg} tagText={tagText} />
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: 11, color: "#CBD5E1", padding: "6px 0" }}>{emptyText}</div>
                  )}
                </div>
              );

              return (
                <div style={{ padding: "12px 16px" }}>
                  <Section
                    title="Active Scheduled" icon="●" color="#047857" borderColor="#A7F3D0"
                    items={meds.active_scheduled} emptyText="No active scheduled orders"
                    bg="#F0FDF4" border="#BBF7D0" tagColor="#065F46" tagBg="#D1FAE5" tagText="ACTIVE"
                  />
                  <Section
                    title="PRN (As Needed)" icon="◆" color="#7C3AED" borderColor="#DDD6FE"
                    items={meds.active_prn} emptyText="No PRN orders"
                    bg="#FEFCE8" border="#FDE68A" tagColor="#6D28D9" tagBg="#EDE9FE" tagText="PRN"
                  />
                  <Section
                    title="Administered (One-Time)" icon="✓" color="#6B7280" borderColor="#E5E7EB"
                    items={meds.one_time_admin} emptyText="No one-time administrations"
                    bg="#F9FAFB" border="#E5E7EB" tagColor="#6B7280" tagBg="#F3F4F6" tagText="GIVEN"
                  />
                  <Section
                    title="Held / Discontinued" icon="⊘" color="#DC2626" borderColor="#FECACA"
                    items={meds.held_discontinued} emptyText="No held or discontinued medications"
                    bg="#FEF2F2" border="#FECACA" tagColor="#991B1B" tagBg="#FEE2E2" tagText="HELD"
                  />
                </div>
              );
            })()}

            {/* ─── LABS TAB ─── */}
            {activeTopTab === "labs" && (() => {
              const labs = ehr?.labs || [];
              if (!labs.length) return <EmptyState text="No labs available" />;

              /* group by panel */
              const panelMap = {};
              labs.forEach((lab) => {
                const pid = categorizeLab(lab.name);
                if (!panelMap[pid]) panelMap[pid] = [];
                panelMap[pid].push(lab);
              });
              const availablePanels = LAB_PANELS.filter((p) => panelMap[p.id]);
              const activePanel = selectedLabPanel && panelMap[selectedLabPanel] ? selectedLabPanel : availablePanels[0]?.id;
              const panelLabs = panelMap[activePanel] || [];

              /* group by day within panel */
              const dayMap = {};
              panelLabs.forEach((lab) => {
                const d = lab.day != null ? lab.day : 1;
                if (!dayMap[d]) dayMap[d] = [];
                dayMap[d].push(lab);
              });
              const sortedDays = Object.keys(dayMap).map(Number).sort((a, b) => a - b);
              const activeDay = selectedLabDay != null && dayMap[selectedLabDay] ? selectedLabDay : sortedDays[0];
              const dayLabs = dayMap[activeDay] || [];

              return (
                <div>
                  {/* ── Panel tabs (Level 1) ── */}
                  <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 12, padding: "2px 0" }}>
                    {availablePanels.map((panel) => {
                      const isActive = panel.id === activePanel;
                      const hasAbnormal = (panelMap[panel.id] || []).some((l) => l.flag === "H" || l.flag === "L");
                      return (
                        <button
                          key={panel.id}
                          onClick={() => { setSelectedLabPanel(panel.id); setSelectedLabDay(null); }}
                          style={{
                            padding: "6px 14px",
                            borderRadius: 20,
                            border: isActive ? "1.5px solid #0284C7" : "1px solid #E2E8F0",
                            background: isActive ? "#FFFFFF" : "#F8FAFC",
                            color: isActive ? "#0284C7" : "#475569",
                            fontSize: 12,
                            fontWeight: isActive ? 700 : 500,
                            cursor: "pointer",
                            transition: "all 0.12s ease",
                            boxShadow: isActive ? "0 2px 8px rgba(2,132,199,0.10)" : "none",
                            whiteSpace: "nowrap",
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          {panel.label}
                          {hasAbnormal && (
                            <span style={{
                              display: "inline-block",
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background: "#DC2626",
                              flexShrink: 0,
                            }} />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* ── Day sub-tabs (Level 2) ── */}
                  {sortedDays.length >= 1 && (
                    <div style={{ display: "flex", gap: 4, marginBottom: 12, padding: "2px 0" }}>
                      {sortedDays.map((d) => {
                        const isActive = d === activeDay;
                        return (
                          <button
                            key={d}
                            onClick={() => setSelectedLabDay(d)}
                            style={{
                              padding: "4px 12px",
                              borderRadius: 16,
                              border: isActive ? "none" : "1px solid #E2E8F0",
                              background: isActive ? "#0284C7" : "#FFFFFF",
                              color: isActive ? "#FFFFFF" : "#64748B",
                              fontSize: 11,
                              fontWeight: isActive ? 700 : 500,
                              cursor: "pointer",
                              transition: "all 0.12s ease",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Day {d}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* ── Lab results table ── */}
                  <div style={{ overflowX: "auto", width: "100%" }}>
                    <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13 }}>
                      <thead>
                        <tr>
                          {["Test", "Value", "Unit", "Normal Range", "Flag"].map((h) => (
                            <th key={h} style={{
                              padding: "10px 14px",
                              textAlign: "left",
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: "0.05em",
                              textTransform: "uppercase",
                              color: "#64748B",
                              background: "#F8FAFC",
                              borderBottom: "2px solid #E2E8F0",
                            }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dayLabs.map((lab, idx) => {
                          const flagColor = lab.flag === "H" ? "#DC2626" : lab.flag === "L" ? "#7C3AED" : null;
                          return (
                            <tr key={idx} style={{ background: idx % 2 === 0 ? "#FFFFFF" : "#F8FAFC" }}>
                              <td style={{ padding: "9px 14px", borderBottom: "1px solid #F1F5F9", fontWeight: 600, color: flagColor || "#0F172A" }}>
                                {lab.name}
                              </td>
                              <td style={{ padding: "9px 14px", borderBottom: "1px solid #F1F5F9", fontWeight: 600, color: flagColor || "#0F172A" }}>
                                {lab.value}
                              </td>
                              <td style={{ padding: "9px 14px", borderBottom: "1px solid #F1F5F9", color: "#64748B" }}>
                                {lab.unit || "—"}
                              </td>
                              <td style={{ padding: "9px 14px", borderBottom: "1px solid #F1F5F9", color: "#64748B" }}>
                                {lab.normal_range || "—"}
                              </td>
                              <td style={{ padding: "9px 14px", borderBottom: "1px solid #F1F5F9", fontWeight: 700, color: flagColor || "#64748B" }}>
                                {lab.flag || "—"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            {/* ─── IMAGING TAB ─── */}
            {activeTopTab === "imaging" && (
              <div>
                {ehr?.imaging?.length ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {ehr.imaging.map((img) => (
                      <div
                        key={img.id}
                        style={{
                          padding: "14px 16px",
                          borderRadius: 12,
                          background: "#FFFFFF",
                          border: "1px solid #E2E8F0",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 700,
                            color: colors.navy,
                            fontSize: 13,
                            marginBottom: 4,
                          }}
                        >
                          {img.modality} {img.body_part}{" "}
                          {img.timestamp && (
                            <span
                              style={{
                                fontWeight: 400,
                                color: "#94A3B8",
                                fontSize: 12,
                              }}
                            >
                              · {img.timestamp}
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "#334155",
                            lineHeight: 1.55,
                          }}
                        >
                          {img.impression}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState text="No imaging reports for this case." />
                )}
              </div>
            )}

            {/* ─── SUMMARY TAB ─── */}
            {activeTopTab === "summary" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                {/* ── VITALS TABLE ── */}
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 8 }}>Vitals Trends</div>
                  {ehr?.summary?.vitals?.length ? (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
                        <thead>
                          <tr style={{ background: "linear-gradient(135deg, #1E3A8A, #2563EB)" }}>
                            {["Time", "Temp", "HR", "BP", "RR", "SpO₂", "Pain", "Notes"].map(h => (
                              <th key={h} style={{ padding: "6px 8px", color: "#fff", fontWeight: 700, fontSize: 10.5, textAlign: "left", whiteSpace: "nowrap", letterSpacing: "0.04em" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {ehr.summary.vitals.map((v, i) => {
                            const hr = parseFloat(v.heart_rate) || 0;
                            const spo2 = parseFloat((v.spo2 || v.SpO2 || "").toString().replace("%","")) || 100;
                            const rr = parseFloat(v.respiratory_rate) || 0;
                            const hrColor = hr > 100 ? "#DC2626" : hr < 60 ? "#7C3AED" : "#15803D";
                            const spo2Color = spo2 < 92 ? "#DC2626" : spo2 < 95 ? "#D97706" : "#15803D";
                            const rrColor = rr > 20 ? "#DC2626" : rr < 12 ? "#7C3AED" : "#15803D";
                            const bp = v.blood_pressure || v.bp || "";
                            const sysBP = parseInt((bp || "").split("/")[0]) || 0;
                            const bpColor = sysBP < 90 ? "#DC2626" : sysBP > 160 ? "#D97706" : "#15803D";
                            return (
                              <tr key={i} style={{ background: i % 2 === 0 ? "#F8FAFC" : "#FFFFFF", borderBottom: "1px solid #E2E8F0" }}>
                                <td style={{ padding: "5px 8px", color: "#475569", fontWeight: 600, whiteSpace: "nowrap", fontSize: 11 }}>{(v.timestamp || "").replace("2026-", "")}</td>
                                <td style={{ padding: "5px 8px", color: "#334155" }}>{v.temperature || "—"}</td>
                                <td style={{ padding: "5px 8px", fontWeight: 700, color: hrColor }}>{v.heart_rate || "—"}</td>
                                <td style={{ padding: "5px 8px", fontWeight: 700, color: bpColor }}>{bp || "—"}</td>
                                <td style={{ padding: "5px 8px", fontWeight: 700, color: rrColor }}>{v.respiratory_rate || "—"}</td>
                                <td style={{ padding: "5px 8px", fontWeight: 700, color: spo2Color }}>{v.spo2 || v.SpO2 || "—"}</td>
                                <td style={{ padding: "5px 8px", color: "#64748B" }}>{v.pain_score ?? "—"}</td>
                                <td style={{ padding: "5px 8px", color: "#64748B", fontSize: 11, maxWidth: 160, whiteSpace: "normal" }}>{v.notes || v.oxygen_delivery || ""}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <div style={{ marginTop: 6, display: "flex", gap: 12, flexWrap: "wrap" }}>
                        {[["#DC2626","Abnormal high"],["#7C3AED","Abnormal low"],["#D97706","Borderline"],["#15803D","Normal"]].map(([c,l]) => (
                          <span key={l} style={{ fontSize: 10, color: c, fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "inline-block" }} />{l}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <EmptyState text="No structured vitals bundle." />
                  )}
                </div>

                {/* ── RESPIRATORY / LINES ── */}
                {(ehr?.summary?.respiratory?.length > 0 || ehr?.summary?.lines?.length > 0) && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {ehr.summary.respiratory?.length > 0 && (
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 8 }}>Respiratory</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {ehr.summary.respiratory.map((r, i) => (
                            <div key={i} style={{ padding: "8px 12px", borderRadius: 8, background: "#EFF6FF", border: "1px solid #BFDBFE", fontSize: 12, color: "#1E40AF", lineHeight: 1.5 }}>{r}</div>
                          ))}
                        </div>
                      </div>
                    )}
                    {ehr.summary.lines?.length > 0 && (
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 8 }}>Lines / Access</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {ehr.summary.lines.map((l, i) => (
                            <div key={i} style={{ padding: "8px 12px", borderRadius: 8, background: "#F0FDF4", border: "1px solid #BBF7D0", fontSize: 12, color: "#15803D", lineHeight: 1.5 }}>{l}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

            {/* ─── EKGs TAB ─── */}
            {activeTopTab === "ekgs" && (
              <div>
                {ehr?.ekgs?.length ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {ehr.ekgs.map((e) => (
                      <div
                        key={e.id}
                        style={{
                          padding: "14px 16px",
                          borderRadius: 12,
                          background: "#FFFFFF",
                          border: "1px solid #E2E8F0",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 700,
                            color: colors.navy,
                            fontSize: 13,
                            marginBottom: 4,
                          }}
                        >
                          {e.timestamp || "EKG"}
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "#334155",
                            lineHeight: 1.55,
                          }}
                        >
                          {e.interpretation}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState text="No EKG interpretations for this case." />
                )}
              </div>
            )}

            {/* ─── PROCEDURES TAB ─── */}
            {activeTopTab === "procedures" && (
              <div>
                {ehr?.procedures?.length ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {ehr.procedures.map((p) => (
                      <div
                        key={p.id}
                        style={{
                          padding: "14px 16px",
                          borderRadius: 12,
                          background: "#FFFFFF",
                          border: "1px solid #E2E8F0",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 700,
                            color: colors.navy,
                            fontSize: 13,
                            marginBottom: 4,
                          }}
                        >
                          {p.name}{" "}
                          {p.timestamp && (
                            <span
                              style={{
                                fontWeight: 400,
                                color: "#94A3B8",
                                fontSize: 12,
                              }}
                            >
                              · {p.timestamp}
                            </span>
                          )}
                        </div>
                        {p.description && (
                          <div
                            style={{
                              fontSize: 13,
                              color: "#334155",
                              lineHeight: 1.55,
                            }}
                          >
                            {p.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState text="No procedures documented in this case." />
                )}
              </div>
            )}
          </section>

          {/* ── TEACHING NOTE AREA ── */}
          <section
            style={{
              padding: "20px 22px",
              borderRadius: 16,
              background: colors.sectionBg,
              border: `1px solid ${colors.sectionBorder}`,
              boxShadow: colors.subtleShadow,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: colors.teal,
                    marginBottom: 3,
                  }}
                >
                  Your teaching note
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#94A3B8",
                    lineHeight: 1.4,
                  }}
                >
                  Pick a template, write your note, then paste into training.azense.app to compare with AI
                </div>
              </div>

              {/* ── Clear button ── */}
              {ownNote && (
                <button
                  onClick={() => setOwnNote("")}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 6,
                    border: "1px solid #E2E8F0",
                    background: "#FFFFFF",
                    color: "#94A3B8",
                    fontSize: 11,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = "#FDA4AF";
                    e.target.style.color = "#E11D48";
                    e.target.style.background = "#FFF1F2";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = "#E2E8F0";
                    e.target.style.color = "#94A3B8";
                    e.target.style.background = "#FFFFFF";
                  }}
                >
                  Clear
                </button>
              )}
            </div>

            {/* ── Template buttons ── */}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 14,
                flexWrap: "wrap",
              }}
            >
              {[
                {
                  id: "hp",
                  label: "H&P",
                  icon: "📋",
                  gradient: "linear-gradient(135deg, #3B82F6, #2563EB)",
                  shadow: "0 4px 14px rgba(37,99,235,0.3)",
                  hoverBg: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                  template:
`HPI:


Assessment:


Problem List and Plan:
1. 
2. 
3. `,
                },
                {
                  id: "pn",
                  label: "Progress Note",
                  icon: "📝",
                  gradient: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                  shadow: "0 4px 14px rgba(124,58,237,0.3)",
                  hoverBg: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                  template:
`Assessment:


Problem List and Plan:
1. 
2. 
3. `,
                },
                {
                  id: "dc",
                  label: "Discharge Summary",
                  icon: "📤",
                  gradient: "linear-gradient(135deg, #10B981, #059669)",
                  shadow: "0 4px 14px rgba(5,150,105,0.3)",
                  hoverBg: "linear-gradient(135deg, #059669, #047857)",
                  template:
`Assessment / Reason for Admission:


Problem List:
1. 
2. 
3. 

Hospital Course:


Discharge Plan:
`,
                },
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setOwnNote(tmpl.template)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "9px 18px",
                    borderRadius: 10,
                    border: "none",
                    background: tmpl.gradient,
                    color: "#FFFFFF",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: tmpl.shadow,
                    letterSpacing: "0.01em",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = tmpl.hoverBg;
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = tmpl.shadow.replace("0.3", "0.45");
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = tmpl.gradient;
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = tmpl.shadow;
                  }}
                >
                  <span style={{ fontSize: 15 }}>{tmpl.icon}</span>
                  {tmpl.label}
                </button>
              ))}
            </div>

            {/* ── Textarea ── */}
            <textarea
              rows={16}
              value={ownNote}
              onChange={(e) => setOwnNote(e.target.value)}
              placeholder="Select a template above or start writing your note here…"
              style={{
                width: "100%",
                borderRadius: 12,
                border: "1px solid rgba(226,232,240,0.8)",
                padding: "14px 16px",
                fontSize: 13,
                lineHeight: 1.6,
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                outline: "none",
                background: "#FFFFFF",
                color: "#0F172A",
                resize: "vertical",
                minHeight: 260,
                transition: "border-color 0.15s ease",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(14,165,233,0.5)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(226,232,240,0.8)")
              }
            />
          </section>
        </div>
        {/* LLC Footer */}
        <div style={{
          padding: "8px 16px",
          borderTop: "1px solid #E2E8F0",
          background: "#FAFBFC",
          textAlign: "center",
          fontSize: 10,
          color: "#94A3B8",
          letterSpacing: "0.02em",
          flexShrink: 0,
        }}>
          © 2026 Azense AI LLC. All rights reserved.
        </div>
      </div>
    </div>
  );
}

/* ── empty state helper ── */
function EmptyState({ text }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px 20px",
        color: "#94A3B8",
        fontSize: 13,
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.5 }}>
        {"📋"}
      </div>
      {text}
    </div>
  );
}

export default App;
