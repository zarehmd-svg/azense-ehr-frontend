import { useEffect, useState, useRef, useCallback } from "react";
import AzenseLogo from "./assets/Azense-logo.png";

const API_BASE = import.meta.env.VITE_API_BASE;

// ── Patient chief complaints for 100-patient EHR ───────────────────────────
const PATIENT_CHIEF_COMPLAINTS_EHR = {
  "1": "Fever, chills, and progressive left lower extremity pain, swelling, and redness for 3 days",
  "2": "Worsening shortness of breath for 4 days, unable to maintain oxygen on home supplemental oxygen",
  "3": "Worsening shortness of breath and bilateral leg swelling for 2 weeks",
  "4": "Squeezing chest pain since this morning, radiating to left jaw and left arm",
  "5": "High fevers, shaking chills, and worsening difficulty breathing for 3 days",
  "6": "Unable to breathe lying down for 4 nights and severe bilateral leg swelling",
  "7": "Severe crushing chest pain at rest for over 1 hour with radiation to left shoulder and jaw",
  "8": "Worsening chest pain with activity for 1 week, new episode at rest lasting 20 minutes",
  "9": "Nausea, vomiting for 2 days, excessive thirst, and frequent urination for 1 month",
  "10": "Confusion and decreased responsiveness for 2 days, brought in by family",
  "11": "Sudden right-sided weakness and difficulty speaking",
  "12": "Found unresponsive on floor with right-sided weakness",
  "13": "Severe shortness of breath, unable to breathe, and bilateral leg swelling",
  "14": "Difficulty breathing, lip and tongue swelling, and hives after eating at a restaurant",
  "15": "Confusion, fever, and decreased oral intake for 3 days",
  "16": "Substernal pressure radiating to left arm for 3 hours",
  "17": "Progressive dyspnea, orthopnea, and 8-pound weight gain over 3 days",
  "18": "Palpitations, lightheadedness, and mild dyspnea for 1 day",
  "19": "Severe occipital headache, blurry vision, and nausea",
  "20": "3 days of worsening dyspnea, productive yellow sputum, and increased inhaler use",
  "21": "Intermittent substernal chest pressure radiating to left shoulder with diaphoresis for 3 hours",
  "22": "Substernal chest pain with exertional dyspnea, admitted for ongoing evaluation",
  "23": "Fever, shortness of breath, and confusion",
  "24": "Fever, shortness of breath, and confusion — ongoing hospitalization",
  "25": "Decreased urine output and dizziness for 2 days",
  "26": "Melena, lightheadedness, and epigastric discomfort for 2 days",
  "27": "Painless bright red blood per rectum and mild lightheadedness",
  "28": "Severe epigastric and right upper quadrant pain with nausea and vomiting",
  "29": "Several weeks of jaundice, abdominal discomfort, anorexia, and weakness",
  "30": "Progressive abdominal distension, bilateral leg edema, and fatigue over 3 weeks",
  "31": "Fever, right flank pain, and chills for 1 day",
  "32": "Rapidly spreading redness and warmth of right lower leg with fevers for 2 days",
  "33": "4 days of watery diarrhea, abdominal cramping, and low-grade fevers after recent antibiotic course",
  "34": "Acute onset right-sided weakness and difficulty speaking 1 hour ago",
  "35": "20 minutes of left arm weakness and left facial droop that fully resolved",
  "36": "Brief loss of consciousness in a hot crowded venue with prodromal nausea and dizziness",
  "37": "Multiple episodes of large-volume bright red hematemesis with lightheadedness",
  "38": "2 days of severe pain, swelling, and erythema of right first MTP joint, unable to bear weight",
  "39": "3-week-old plantar foot ulcer with spreading erythema, swelling, and foul-smelling drainage",
  "40": "Tremors, anxiety, palpitations, and nausea 24 hours after last drink",
  "41": "2 days of worsening confusion, visual hallucinations, and agitation",
  "42": "Referred by primary care for abnormal blood work; currently asymptomatic",
  "43": "Fatigue, dizziness, unsteady gait, and mild confusion for 5 days",
  "44": "Progressive bilateral leg swelling, orthopnea, and 5-pound weight gain after vacation",
  "45": "4 days of fever, purulent sputum, worsening dyspnea, and right-sided chest pain",
  "46": "Cough, fever, and difficulty swallowing for 2 days",
  "47": "Chronic nonhealing plantar ulcer with new deep foot pain",
  "48": "High fevers, rigors, severe left flank pain, and vomiting",
  "49": "Unilateral left leg swelling, pain, and erythema 10 days post right knee replacement",
  "50": "Hematemesis after repeated vomiting with heavy alcohol intake",
  "51": "Severe shortness of breath at rest, lightheadedness, and decreased urine output",
  "52": "Sharp pleuritic chest pain improved by leaning forward and low-grade fever",
  "53": "Worsening shortness of breath and increasing drowsiness for 3 days",
  "54": "Sudden severe shortness of breath, inability to lie flat, and frothy sputum",
  "55": "Fever, severe headache, neck stiffness, and photophobia for 1 day",
  "56": "Continuous seizure activity for over 5 minutes without regaining consciousness",
  "57": "24 hours of periumbilical pain migrating to right lower quadrant, anorexia, and fever",
  "58": "Crampy abdominal pain, vomiting, distension, and absence of flatus for 24 hours",
  "59": "Right upper quadrant pain radiating to right shoulder, fevers, nausea, and vomiting for 2 days",
  "60": "Fever, productive cough, and severe shortness of breath",
  "61": "Sudden onset severe right leg pain with leg going 'white and cold'",
  "62": "Found unresponsive by staff, cold to touch",
  "63": "Fever, extreme agitation, rapid heart rate, and shortness of breath",
  "64": "Confusion, increased urination, constipation, and weakness for 2 weeks",
  "65": "Nausea, decreased urine output, weakness, and severe muscle cramps",
  "66": "Fever and chills",
  "67": "Nausea, vomiting, severe abdominal pain, rapid deep breathing, and decreased responsiveness",
  "68": "Sudden shortness of breath, right-sided chest pain, and fainting during a long car trip",
  "69": "Profound confusion, left-sided weakness, and slurred speech",
  "70": "Persistent agitation, confusion, and disorientation",
  "71": "Increasing confusion, hand tremors, and drowsiness for 3 days",
  "72": "Diffuse abdominal pain, low-grade fevers, and worsening abdominal distension",
  "73": "Progressive chest discomfort and worsening shortness of breath over several weeks",
  "74": "Chest discomfort with exertion, progressive shortness of breath, and fainting while climbing stairs",
  "75": "Fevers, night sweats, chest pain, and cough for 2 weeks",
  "76": "Several weeks of progressive shortness of breath, dry cough, and unintentional weight loss",
  "77": "Worsening bilateral leg swelling, inability to lie flat, and shortness of breath with activity",
  "78": "Sudden right-sided chest pain and shortness of breath",
  "79": "Increased sputum volume and purulence with worsening dyspnea for 4 days",
  "80": "Severe shortness of breath, fever, and altered mental status",
  "81": "Three days of black stools, lightheadedness, and dizziness when standing",
  "82": "Palpitations, unintentional weight loss, hand tremor, and heat intolerance",
  "83": "Black tarry stools and severe fatigue for 3 days",
  "84": "Rapidly progressive bilateral leg weakness, numbness, and inability to urinate",
  "85": "Left lower quadrant pain and bloody diarrhea",
  "86": "Sudden severe headache, vomiting, and right-sided weakness",
  "87": "Found unresponsive at home",
  "88": "Severe shortness of breath and inability to speak in full sentences",
  "89": "Chest pain and shortness of breath at 28 weeks pregnant",
  "90": "Progressive shortness of breath and right-sided chest heaviness over 6 weeks",
  "91": "Fevers, chills, and malaise for 2 weeks",
  "92": "Severe bone pain in back, hips, and chest with fever",
  "93": "Fever, chest pain, and shortness of breath",
  "94": "Confusion, high fever, and bleeding from IV site",
  "95": "Multiple defibrillator shocks, diaphoresis, and confusion",
  "96": "Confusion and unsteady gait",
  "97": "Severe epigastric pain radiating to back with repeated vomiting",
  "98": "Dark cola-colored urine and severe muscle pain after physical training",
  "99": "Severe left flank pain, high fever, and shaking chills",
  "100": "Worsening shortness of breath and leg swelling for 5 days"
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

/* ── Lab reference ranges for color coding ── */
const LAB_RANGES = {
  wbc:        { low: 4.5,  high: 11.0, critLow: 2,    critHigh: 20,   unit: "K/uL" },
  hemoglobin: { low: 12,   high: 17,   critLow: 7,    critHigh: null,  unit: "g/dL" },
  hematocrit: { low: 36,   high: 51,   critLow: 21,   critHigh: null,  unit: "%" },
  platelets:  { low: 150,  high: 400,  critLow: 50,   critHigh: 1000, unit: "K/uL" },
  sodium:     { low: 136,  high: 145,  critLow: 125,  critHigh: 155,  unit: "mEq/L" },
  potassium:  { low: 3.5,  high: 5.0,  critLow: 3.0,  critHigh: 6.0,  unit: "mEq/L" },
  creatinine: { low: 0.7,  high: 1.3,  critLow: null, critHigh: 4.0,  unit: "mg/dL" },
  bun:        { low: 7,    high: 20,   critLow: null, critHigh: null,  unit: "mg/dL" },
  glucose:    { low: 70,   high: 100,  critLow: 50,   critHigh: 400,  unit: "mg/dL" },
  troponin:   { low: 0,    high: 0.04, critLow: null, critHigh: 0.1,  unit: "ng/mL" },
  lactate:    { low: 0.5,  high: 2.0,  critLow: null, critHigh: 4.0,  unit: "mmol/L" },
  ph:         { low: 7.35, high: 7.45, critLow: 7.2,  critHigh: 7.55, unit: "" },
  calcium:    { low: 8.5,  high: 10.5, critLow: 6.5,  critHigh: 13,   unit: "mg/dL" },
  chloride:   { low: 98,   high: 106,  critLow: null, critHigh: null,  unit: "mEq/L" },
  co2:        { low: 23,   high: 29,   critLow: null, critHigh: null,  unit: "mEq/L" },
  bicarbonate:{ low: 22,   high: 28,   critLow: 10,   critHigh: null,  unit: "mEq/L" },
};

function matchLabRange(labName) {
  const n = (labName || "").toLowerCase().trim();
  for (const [key, range] of Object.entries(LAB_RANGES)) {
    if (n.includes(key)) return range;
  }
  return null;
}

function getLabColor(lab) {
  const val = parseFloat(lab.value);
  if (isNaN(val)) return { color: null, level: "normal" };
  const range = matchLabRange(lab.name);
  if (!range) {
    if (lab.flag === "H") return { color: "#DC2626", level: "high" };
    if (lab.flag === "L") return { color: "#7C3AED", level: "low" };
    return { color: null, level: "normal" };
  }
  if (range.critHigh != null && val >= range.critHigh) return { color: "#DC2626", bg: "rgba(248,113,113,0.12)", level: "critical_high" };
  if (range.critLow != null && val <= range.critLow) return { color: "#DC2626", bg: "rgba(248,113,113,0.12)", level: "critical_low" };
  if (val > range.high) return { color: "#EA580C", level: "high" };
  if (val < range.low) return { color: "#7C3AED", level: "low" };
  return { color: null, level: "normal" };
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

// ── Embed mode: skip login when loaded inside an iframe with ?embed=true&patient=N ──
const URL_PARAMS = new URLSearchParams(window.location.search);
const EMBED_MODE = URL_PARAMS.get("embed") === "true";
const EMBED_PATIENT = URL_PARAMS.get("patient");

function App() {
  const [loggedIn, setLoggedIn] = useState(
    () => EMBED_MODE || window.localStorage.getItem("azense_ehr_logged_in") === "true"
  );
  const [loginError, setLoginError] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Trial / signup state
  const [showSignup, setShowSignup] = useState(false);
  const [signupData, setSignupData] = useState({
    first_name: "", last_name: "", role: "student", institution: "", email: "", username: "", password: "", referral_code: "",
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
  const [ehrLoading, setEhrLoading] = useState(false);
  const [activeTopTab, setActiveTopTab] = useState("notes");
  const [activeNoteType, setActiveNoteType] = useState("hp");
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [ownNote, setOwnNote] = useState("");
  const noteRef = useRef(null);
  const [activeFontSize, setActiveFontSize] = useState("3");
  const [selectedLabPanel, setSelectedLabPanel] = useState(null);
  const [selectedLabDay, setSelectedLabDay] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewInitials, setReviewInitials] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

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
      const submitData = { ...signupData };
      if (!submitData.referral_code) delete submitData.referral_code;
      const res = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
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
      // Clear old auth so user logs in fresh with updated paid status
      window.localStorage.removeItem("azense_token");
      window.localStorage.removeItem("azense_is_trial");
      window.localStorage.removeItem("azense_trial_days_left");
      window.localStorage.removeItem("azense_allowed_patients");
      window.localStorage.removeItem("azense_display_name");
      window.localStorage.removeItem("azense_username");
      window.localStorage.removeItem("azense_subscription_status");
      setToken(null);
      setIsTrial(false);
      setTrialExpired(false);
      setShowUpgradePanel(false);
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
        // Trial users can only see allowed patients (skip in embed mode)
        if (!EMBED_MODE && allowedPatients && allowedPatients.length > 0) {
          filtered = filtered.filter(p => allowedPatients.includes(String(p.id)));
        }
        setPatients(filtered);
        // In embed mode, auto-select the patient from URL param
        if (EMBED_MODE && EMBED_PATIENT) {
          const embedPid = parseInt(EMBED_PATIENT, 10) || EMBED_PATIENT;
          const match = filtered.find(p => String(p.id) === String(embedPid));
          if (match) setSelectedPatientId(match.id);
          else if (filtered.length > 0) setSelectedPatientId(filtered[0].id);
        } else if (filtered.length > 0) {
          setSelectedPatientId(filtered[0].id);
        }
      } catch (err) {
        console.error("Patient load error:", err);
        setPatients([]);
      }
    })();
  }, [allowedPatients]);

  /* ── load EHR for selected patient ── */
  useEffect(() => {
    if (!selectedPatientId) return;
    setEhrLoading(true);
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/ehr/patients/${selectedPatientId}`
        );
        const json = await res.json();
        setEhr(json);
        setSelectedNoteId(null);
        clearNoteContent();
        setSelectedLabPanel(null);
        setSelectedLabDay(null);
      } catch (err) {
        console.error("EHR load error:", err);
      } finally {
        setEhrLoading(false);
      }
    })();
  }, [selectedPatientId]);

  /* ── postMessage bridge: let parent (training app) request the note text ── */
  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === "GET_EHR_NOTE") {
        window.parent.postMessage({ type: "EHR_NOTE_TEXT", text: ownNote || "" }, "*");
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  });

  /* ── Rich-text editor helpers ── */
  const syncNote = useCallback(() => {
    if (noteRef.current) {
      setOwnNote(noteRef.current.innerText || "");
    }
  }, []);

  const applyBold = useCallback(() => {
    document.execCommand("bold", false, null);
    noteRef.current?.focus();
  }, []);

  const applyFontSize = useCallback((size) => {
    document.execCommand("fontSize", false, size);
    setActiveFontSize(size);
    noteRef.current?.focus();
  }, []);

  const setNoteContent = useCallback((text) => {
    setOwnNote(text);
    if (noteRef.current) {
      noteRef.current.innerText = text;
    }
  }, []);

  const clearNoteContent = useCallback(() => {
    setOwnNote("");
    if (noteRef.current) {
      noteRef.current.innerHTML = "";
    }
  }, []);

  /* ── fetch reviews ── */
  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE}/reviews`);
      if (res.ok) {
        const json = await res.json();
        setReviews(Array.isArray(json) ? json : []);
      }
    } catch (err) {
      console.error("Reviews load error:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewStars || !reviewInitials.trim() || !reviewComment.trim()) return;
    setReviewLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initials: reviewInitials.trim(),
          rating: reviewStars,
          comment: reviewComment.trim(),
          source: "ehr",
        }),
      });
      if (res.ok) {
        setReviewSubmitted(true);
        setReviewStars(0);
        setReviewInitials("");
        setReviewComment("");
        fetchReviews();
        setTimeout(() => setReviewSubmitted(false), 3000);
      }
    } catch (err) {
      console.error("Review submit error:", err);
    } finally {
      setReviewLoading(false);
    }
  };

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
          className="ehr-login-card"
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
              className="ehr-login-logo"
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
              padding: "20px 22px", borderRadius: 14, marginBottom: 16,
              background: "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
              border: "1px solid #A7F3D0", textAlign: "center",
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>\u2705</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#065F46", marginBottom: 6 }}>
                Payment confirmed
              </div>
              <div style={{ fontSize: 13, color: "#047857" }}>
                Your subscription is active. Log in below to enjoy full access to all patients, cases, and features.
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
              <input placeholder="Referral code (optional)" value={signupData.referral_code}
                onChange={(e) => setSignupData({ ...signupData, referral_code: e.target.value })}
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
              <div style={{
                width: 56, height: 56, borderRadius: "50%", margin: "0 auto 14px",
                background: "linear-gradient(135deg, #FEE2E2, #FECACA)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26,
              }}>
                🔒
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#1E293B", marginBottom: 6 }}>
                Your free trial has expired
              </div>
              <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 6px" }}>
                Your 7-day trial for <strong>{expiredUsername || "your account"}</strong> has ended.
              </p>
              <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 22px" }}>
                Subscribe to unlock all patients, cases, and features.
              </p>
              <div style={{
                border: "1px solid #E2E8F0", borderRadius: 14, padding: "16px 20px",
                marginBottom: 10, textAlign: "left", background: "rgba(248,250,252,0.7)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>Monthly</div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>$24.99 / month</div>
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
                      Yearly <span style={{ fontSize: 11, fontWeight: 600, color: "#0D9488", background: "#CCFBF1", padding: "2px 8px", borderRadius: 6, marginLeft: 6 }}>Save $50</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>$249.99 / year ($20.83/mo)</div>
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
      className="ehr-app-wrapper"
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
      <style>{`
[contenteditable][data-placeholder]:empty::before {
          content: attr(data-placeholder);
          color: #94A3B8;
          pointer-events: none;
          display: block;
        }
      `}</style>
      {/* ── main card ── */}
      <div
        className="ehr-main-card"
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
        {/* Trial banner (hidden in embed mode) */}
        {!EMBED_MODE && isTrial && trialDaysLeft > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div className="ehr-trial-banner" style={{
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
                <div className="ehr-upgrade-panel-cards" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  {/* Monthly */}
                  <div style={{
                    flex: "1 1 180px", maxWidth: 220, borderRadius: 12, padding: "16px 18px",
                    border: "1px solid rgba(148,163,184,0.25)", background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(8px)",
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0" }}>Monthly</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#5EEAD4", margin: "6px 0 2px" }}>$24.99<span style={{ fontSize: 12, fontWeight: 500, color: "#94A3B8" }}>/mo</span></div>
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
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#5EEAD4", margin: "6px 0 2px" }}>$249.99<span style={{ fontSize: 12, fontWeight: 500, color: "#94A3B8" }}>/yr</span></div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 14 }}>$20.83/mo \u2014 Save $50</div>
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

        {/* ── HEADER ── (hidden in embed mode) */}
        {!EMBED_MODE && <header
          className="ehr-app-header"
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
              className="ehr-header-logo"
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
              <button
                onClick={() => setShowTutorial(true)}
                style={{
                  marginTop: 6,
                  padding: "5px 14px",
                  borderRadius: 999,
                  border: "1.5px solid rgba(139,92,246,0.35)",
                  background: "linear-gradient(135deg, #7C3AED, #8B5CF6)",
                  color: "#FFFFFF",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: "0.02em",
                  boxShadow: "0 3px 10px rgba(124,58,237,0.30)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 5px 16px rgba(124,58,237,0.45)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 3px 10px rgba(124,58,237,0.30)"; }}
              >
                ▶ Tutorial
              </button>
            </div>
          </div>

          <div className="ehr-header-right" style={{ display: "flex", alignItems: "center", gap: 10 }}>
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

            {/* ── Reviews button ── */}
            <button
              onClick={() => setShowReviewModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "7px 14px",
                borderRadius: 999,
                border: "1.5px solid rgba(245,158,11,0.35)",
                background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 700,
                color: "#92400E",
                letterSpacing: "0.02em",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(245,158,11,0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #FEF3C7, #FDE68A)";
                e.currentTarget.style.borderColor = "rgba(245,158,11,0.55)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(245,158,11,0.30)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #FFFBEB, #FEF3C7)";
                e.currentTarget.style.borderColor = "rgba(245,158,11,0.35)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(245,158,11,0.15)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <span style={{ fontSize: 14 }}>★</span> Review
            </button>

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
                clearNoteContent();
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
        </header>}

        {/* ── PATIENT SELECTOR ── (hidden in embed mode) */}
        {!EMBED_MODE && <section
          className="ehr-patient-selector"
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
        </section>}

        {/* ── NOTE ASSIGNMENT BANNER ── */}
        {(() => {
          const assign = NOTE_ASSIGNMENTS[String(selectedPatientId)];
          if (!assign) return null;
          const ac = ASSIGN_COLORS[assign.color];
          return (
            <div
              className="ehr-assignment-banner"
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
                className="ehr-assignment-icon"
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
                    fontSize: 11,
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
                  className="ehr-assignment-title"
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

        {/* ── PATIENT HEADER BAR (sticky) ── */}
        {selectedPatientId && ehr && (
          <div
            className="ehr-patient-header"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 50,
              marginBottom: 14,
              padding: "12px 18px",
              borderRadius: 14,
              background: "linear-gradient(135deg, #0891B2 0%, #0EA5E9 60%, #06B6D4 100%)",
              border: "1px solid rgba(14,165,233,0.35)",
              boxShadow: "0 4px 20px rgba(8,145,178,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div className="ehr-patient-header-left" style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: "linear-gradient(135deg, #0D9488, #14B8A6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, color: "#FFFFFF", fontWeight: 800, flexShrink: 0,
              }}>
                {selectedPatientId}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#E2E8F0", letterSpacing: "-0.01em" }}>
                  Patient #{selectedPatientId}
                </div>
                <div style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 340 }}>
                  {PATIENT_CHIEF_COMPLAINTS_EHR[String(selectedPatientId)] || ""}
                </div>
              </div>
            </div>
            <div className="ehr-patient-header-right" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
              {ehr?.overview?.admission_date && (
                <div style={{
                  padding: "4px 10px", borderRadius: 8,
                  background: "rgba(14,165,233,0.12)", fontSize: 11,
                  color: "#7DD3FC", fontWeight: 600, whiteSpace: "nowrap",
                }}>
                  Admitted: {ehr.overview.admission_date}
                </div>
              )}

              {ehr?.overview?.allergies && (
                <div style={{
                  padding: "4px 10px", borderRadius: 8,
                  background: "rgba(248,113,113,0.15)", fontSize: 11,
                  color: "#FCA5A5", fontWeight: 700, whiteSpace: "nowrap",
                }}>
                  ⚠ Allergies: {typeof ehr.overview.allergies === "string" ? ehr.overview.allergies : Array.isArray(ehr.overview.allergies) ? ehr.overview.allergies.join(", ") : "See chart"}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TOP TABS ── */}
        <section style={{ marginBottom: 12 }}>
          <div
            className="ehr-top-tabs"
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
            className="ehr-content-section"
            style={{
              padding: "18px 20px",
              borderRadius: 16,
              border: `1px solid ${colors.sectionBorder}`,
              background: colors.sectionBg,
              boxShadow: colors.subtleShadow,
              minHeight: 320,
            }}
          >
            {/* ── Loading skeleton ── */}
            {ehrLoading && (
              <div style={{ padding: "20px 0" }}>
                <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                  {[80, 60, 50, 70, 60, 50, 80].map((w, i) => (
                    <div key={i} className="skeleton-block" style={{ width: w, height: 32, borderRadius: 10 }} />
                  ))}
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ width: 150, display: "flex", flexDirection: "column", gap: 8 }}>
                    {[1,2,3,4,5].map(i => <div key={i} className="skeleton-line" style={{ height: 28, width: "100%" }} />)}
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div className="skeleton-line" style={{ height: 16, width: "60%" }} />
                    <div className="skeleton-line" style={{ height: 12, width: "90%" }} />
                    <div className="skeleton-line" style={{ height: 12, width: "80%" }} />
                    <div className="skeleton-line" style={{ height: 12, width: "85%" }} />
                    <div className="skeleton-line" style={{ height: 12, width: "70%" }} />
                    <div className="skeleton-line" style={{ height: 12, width: "95%" }} />
                    <div className="skeleton-line" style={{ height: 12, width: "60%" }} />
                    <div className="skeleton-line" style={{ height: 12, width: "75%" }} />
                  </div>
                </div>
              </div>
            )}

            {!ehrLoading && (<>
            {/* ─── NOTES TAB ─── */}
            {activeTopTab === "notes" && (
              <div className="ehr-notes-layout" style={{ display: "flex", gap: 14, minHeight: 400 }}>
                {/* Note type sidebar */}
                <div style={{ width: 150, flexShrink: 0 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
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
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#94A3B8",
                      marginBottom: 8,
                    }}
                  >
                    {activeNoteType.toUpperCase()} notes
                  </div>
                  <div className="ehr-notes-content" style={{ display: "flex", gap: 12, height: 420 }}>
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
                        padding: "18px 22px",
                        overflowY: "auto",
                        fontSize: 13.5,
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.75,
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
                <div className="ehr-meds-section" style={{ padding: "12px 16px" }}>
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
                  <div className="ehr-lab-panels" style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 12, padding: "2px 0" }}>
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
                  <div className="ehr-lab-table-wrapper" style={{ overflowX: "auto", width: "100%" }}>
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
                          const labColor = getLabColor(lab);
                          const isCritical = labColor.level === "critical_high" || labColor.level === "critical_low";
                          const rowBg = isCritical
                            ? "rgba(248,113,113,0.08)"
                            : idx % 2 === 0 ? "#FFFFFF" : "#F8FAFC";
                          return (
                            <tr key={idx} style={{ background: rowBg }}>
                              <td style={{ padding: "9px 14px", borderBottom: "1px solid #F1F5F9", fontWeight: 600, color: labColor.color || "#0F172A" }}>
                                {lab.name}
                              </td>
                              <td style={{ padding: "9px 14px", borderBottom: "1px solid #F1F5F9", fontWeight: 700, color: labColor.color || "#0F172A" }}>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                                  {lab.value}
                                  {isCritical && (
                                    <span style={{
                                      fontSize: 9, fontWeight: 800, color: "#FFFFFF",
                                      background: "#DC2626", padding: "1px 5px", borderRadius: 4,
                                      letterSpacing: "0.04em",
                                    }}>CRIT</span>
                                  )}
                                </span>
                              </td>
                              <td style={{ padding: "9px 14px", borderBottom: "1px solid #F1F5F9", color: "#64748B" }}>
                                {lab.unit || "—"}
                              </td>
                              <td style={{ padding: "9px 14px", borderBottom: "1px solid #F1F5F9", color: "#64748B" }}>
                                {lab.normal_range || "—"}
                              </td>
                              <td style={{ padding: "9px 14px", borderBottom: "1px solid #F1F5F9" }}>
                                {lab.flag ? (
                                  <span style={{
                                    display: "inline-flex", alignItems: "center", gap: 3,
                                    padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700,
                                    background: lab.flag === "H" ? "rgba(220,38,38,0.1)" : lab.flag === "L" ? "rgba(124,58,237,0.1)" : "transparent",
                                    color: lab.flag === "H" ? "#DC2626" : lab.flag === "L" ? "#7C3AED" : "#64748B",
                                  }}>
                                    {lab.flag === "H" ? "↑ High" : lab.flag === "L" ? "↓ Low" : lab.flag}
                                  </span>
                                ) : (
                                  <span style={{ color: "#94A3B8" }}>—</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* ── Lab color legend ── */}
                  <div style={{
                    marginTop: 12, padding: "8px 14px", borderRadius: 10,
                    background: "rgba(241,245,249,0.7)", border: "1px solid rgba(226,232,240,0.6)",
                    display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center",
                  }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Legend:</span>
                    {[
                      { color: "#DC2626", bg: "rgba(220,38,38,0.1)", label: "Critical", badge: "CRIT" },
                      { color: "#EA580C", bg: "rgba(234,88,12,0.1)", label: "Abnormal High" },
                      { color: "#7C3AED", bg: "rgba(124,58,237,0.1)", label: "Abnormal Low" },
                      { color: "#15803D", bg: "rgba(21,128,61,0.08)", label: "Normal" },
                    ].map(item => (
                      <span key={item.label} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: item.color, fontWeight: 600 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: item.bg || item.color, border: `1.5px solid ${item.color}`, display: "inline-block" }} />
                        {item.label}
                      </span>
                    ))}
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
                        className="ehr-card-hover"
                        style={{
                          padding: "14px 16px 14px 20px",
                          borderRadius: 12,
                          background: "#FFFFFF",
                          border: "1px solid #E2E8F0",
                          borderLeft: "4px solid #0EA5E9",
                          position: "relative",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <rect x="2" y="2" width="20" height="20" rx="2" />
                            <path d="M7 2v20" />
                            <path d="M17 2v20" />
                            <path d="M2 12h20" />
                            <path d="M2 7h5" />
                            <path d="M2 17h5" />
                            <path d="M17 7h5" />
                            <path d="M17 17h5" />
                          </svg>
                          <span style={{ fontWeight: 700, color: colors.navy, fontSize: 13 }}>
                            {img.modality} {img.body_part}
                          </span>
                          {img.timestamp && (
                            <span style={{ fontWeight: 400, color: "#94A3B8", fontSize: 12 }}>
                              · {img.timestamp}
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "#334155",
                            lineHeight: 1.65,
                            marginLeft: 23,
                          }}
                        >
                          {img.impression}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState text="No imaging reports for this case." icon="imaging" />
                )}
              </div>
            )}

            {/* ─── SUMMARY TAB ─── */}
            {activeTopTab === "summary" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                {/* ── VITALS TABLE ── */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 8 }}>Vitals Trends</div>
                  {ehr?.summary?.vitals?.length ? (
                    <div className="ehr-vitals-wrapper" style={{ overflowX: "auto" }}>
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
                  <div className="ehr-summary-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {ehr.summary.respiratory?.length > 0 && (
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 8 }}>Respiratory</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {ehr.summary.respiratory.map((r, i) => (
                            <div key={i} style={{ padding: "8px 12px", borderRadius: 8, background: "#EFF6FF", border: "1px solid #BFDBFE", fontSize: 12, color: "#1E40AF", lineHeight: 1.5 }}>{r}</div>
                          ))}
                        </div>
                      </div>
                    )}
                    {ehr.summary.lines?.length > 0 && (
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 8 }}>Lines / Access</div>
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
                        className="ehr-card-hover"
                        style={{
                          padding: "14px 16px 14px 20px",
                          borderRadius: 12,
                          background: "#FFFFFF",
                          border: "1px solid #E2E8F0",
                          borderLeft: "4px solid #F43F5E",
                          position: "relative",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                          </svg>
                          <span style={{ fontWeight: 700, color: colors.navy, fontSize: 13 }}>
                            {e.timestamp || "EKG"}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "#334155",
                            lineHeight: 1.65,
                            marginLeft: 24,
                          }}
                        >
                          {e.interpretation}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState text="No EKG interpretations for this case." icon="ekgs" />
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
                        className="ehr-card-hover"
                        style={{
                          padding: "14px 16px 14px 20px",
                          borderRadius: 12,
                          background: "#FFFFFF",
                          border: "1px solid #E2E8F0",
                          borderLeft: "4px solid #8B5CF6",
                          position: "relative",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                          </svg>
                          <span style={{ fontWeight: 700, color: colors.navy, fontSize: 13 }}>
                            {p.name}
                          </span>
                          {p.timestamp && (
                            <span style={{ fontWeight: 400, color: "#94A3B8", fontSize: 12 }}>
                              · {p.timestamp}
                            </span>
                          )}
                        </div>
                        {p.description && (
                          <div
                            style={{
                              fontSize: 13,
                              color: "#334155",
                              lineHeight: 1.65,
                              marginLeft: 22,
                            }}
                          >
                            {p.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState text="No procedures documented in this case." icon="procedures" />
                )}
              </div>
            )}

            </>)}
          </section>

          {/* ── TEACHING NOTE AREA ── */}
          <section
            className="ehr-teaching-section"
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
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
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

            </div>

            {/* ── Template buttons ── */}
            <div
              className="ehr-template-buttons"
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
                  onClick={() => setNoteContent(tmpl.template)}
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

            {/* ── Clinical Note Label ── */}
            <div className="ehr-clinical-banner" style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "14px 18px",
              background: "linear-gradient(135deg, #0891B2, #0EA5E9, #06B6D4)",
              borderRadius: "12px 12px 0 0",
              marginBottom: 0,
              boxShadow: "0 2px 8px rgba(8,145,178,0.25)",
            }}>
              <span className="ehr-clinical-banner-icon" style={{ fontSize: 22 }}>📝</span>
              <span className="ehr-clinical-banner-text" style={{
                fontSize: 19, fontWeight: 800, color: "#FFFFFF",
                letterSpacing: "0.03em",
              }}>Clinical Note</span>
            </div>
            {/* ── Formatting Toolbar ── */}
            <div className="ehr-format-toolbar" style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 12px",
              background: "linear-gradient(135deg, rgba(14,165,233,0.06), rgba(6,182,212,0.04))",
              borderLeft: "6px solid #0EA5E9",
              borderRight: "1px solid rgba(226,232,240,0.8)",
              borderBottom: "1px solid rgba(226,232,240,0.5)",
            }}>
              <button
                onMouseDown={(e) => { e.preventDefault(); applyBold(); }}
                title="Bold"
                style={{
                  padding: "4px 10px", borderRadius: 6,
                  border: "1px solid rgba(14,165,233,0.25)",
                  background: "rgba(255,255,255,0.9)",
                  color: "#0F172A", fontSize: 13, fontWeight: 800,
                  cursor: "pointer", transition: "all 0.15s",
                  lineHeight: 1.4,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(14,165,233,0.12)"; e.currentTarget.style.borderColor = "#0EA5E9"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.9)"; e.currentTarget.style.borderColor = "rgba(14,165,233,0.25)"; }}
              >B</button>
              <span style={{ width: 1, height: 20, background: "rgba(14,165,233,0.15)", margin: "0 4px" }} />
              <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600, marginRight: 2 }}>Size:</span>
              {[
                { label: "S", size: "2", title: "Small" },
                { label: "M", size: "3", title: "Medium" },
                { label: "L", size: "5", title: "Large" },
                { label: "XL", size: "7", title: "Extra Large" },
              ].map((s) => (
                <button
                  key={s.size}
                  onMouseDown={(e) => { e.preventDefault(); applyFontSize(s.size); }}
                  title={s.title}
                  style={{
                    padding: "4px 8px", borderRadius: 6,
                    border: activeFontSize === s.size ? "1px solid #0EA5E9" : "1px solid rgba(14,165,233,0.2)",
                    background: activeFontSize === s.size ? "rgba(14,165,233,0.1)" : "rgba(255,255,255,0.9)",
                    color: activeFontSize === s.size ? "#0284C7" : "#475569",
                    fontSize: 11, fontWeight: 600,
                    cursor: "pointer", transition: "all 0.15s",
                    lineHeight: 1.4,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(14,165,233,0.12)"; e.currentTarget.style.borderColor = "#0EA5E9"; }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = activeFontSize === s.size ? "rgba(14,165,233,0.1)" : "rgba(255,255,255,0.9)";
                    e.currentTarget.style.borderColor = activeFontSize === s.size ? "#0EA5E9" : "rgba(14,165,233,0.2)";
                  }}
                >{s.label}</button>
              ))}
            </div>
            {/* ── Rich Text Editor ── */}
            <div style={{
              borderRadius: "0 0 12px 12px",
              padding: 2,
              background: "linear-gradient(135deg, rgba(14,165,233,0.08), rgba(6,182,212,0.06))",
              boxShadow: "0 0 24px rgba(14,165,233,0.06)",
              animation: "notePulseGlow 2.5s ease-in-out infinite",
            }}>
            <div
              ref={noteRef}
              className="ehr-note-editor"
              contentEditable
              suppressContentEditableWarning
              onInput={syncNote}
              data-placeholder="📝 Write your clinical note here..."
              style={{
                width: "100%",
                borderRadius: "0 0 10px 10px",
                border: "1px solid rgba(226,232,240,0.8)",
                borderLeft: "6px solid #0EA5E9",
                borderTop: "none",
                padding: "14px 16px",
                fontSize: 14,
                lineHeight: 1.6,
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                outline: "none",
                background: "rgba(14,165,233,0.04)",
                color: "#0F172A",
                minHeight: 260,
                overflowY: "auto",
                maxHeight: 500,
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                boxSizing: "border-box",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(14,165,233,0.5)";
                e.target.style.boxShadow = "inset 0 0 0 1px rgba(14,165,233,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(226,232,240,0.8)";
                e.target.style.boxShadow = "none";
              }}
            />
            </div>
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

      {/* ── Tutorial YouTube Modal ── */}
      {showTutorial && (
        <div
          onClick={() => setShowTutorial(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 10000,
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", width: "90vw", maxWidth: 900, aspectRatio: "16/9", background: "#000", borderRadius: 12, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
            <button
              onClick={() => setShowTutorial(false)}
              style={{ position: "absolute", top: -36, right: 0, background: "transparent", border: "none", color: "#fff", fontSize: "1.4rem", cursor: "pointer", zIndex: 10, opacity: 0.8 }}
            >
              ✕
            </button>
            <iframe
              src="https://www.youtube.com/embed/pCRJDuasxc0"
              title="Azense Tutorial"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </div>
        </div>
      )}

      {/* ── Review Modal ── */}
      {showReviewModal && (
        <div
          onClick={() => { setShowReviewModal(false); setReviewSubmitted(false); }}
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(15,23,42,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            animation: "fadeIn 0.2s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#FFFFFF",
              borderRadius: 20,
              padding: "28px 32px",
              width: "100%",
              maxWidth: 420,
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              position: "relative",
            }}
          >
            {/* Close button */}
            <button
              onClick={() => { setShowReviewModal(false); setReviewSubmitted(false); }}
              style={{
                position: "absolute", top: 14, right: 16,
                background: "none", border: "none", cursor: "pointer",
                fontSize: 20, color: "#94A3B8", lineHeight: 1,
              }}
            >×</button>

            {reviewSubmitted ? (
              <div style={{ textAlign: "center", padding: "30px 0" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "linear-gradient(135deg, #10B981, #047857)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px", fontSize: 28, color: "#FFF",
                }}>✓</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#047857", marginBottom: 6 }}>Thank you for your review!</div>
                <div style={{ fontSize: 13, color: "#059669" }}>Your feedback helps us improve AZense.</div>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                  <span style={{ fontSize: 22, color: "#F59E0B" }}>★</span>
                  <span style={{ fontSize: 17, fontWeight: 700, color: "#0F172A" }}>Leave a Review</span>
                </div>

                <form onSubmit={handleReviewSubmit}>
                  {/* Star rating */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 8 }}>Rating</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onClick={() => setReviewStars(star)}
                          style={{
                            fontSize: 32, cursor: "pointer", userSelect: "none",
                            color: star <= reviewStars ? "#F59E0B" : "#D1D5DB",
                            transition: "color 0.15s ease, transform 0.15s ease",
                            transform: star <= reviewStars ? "scale(1.15)" : "scale(1)",
                          }}
                        >★</span>
                      ))}
                      {reviewStars > 0 && (
                        <span style={{ fontSize: 13, color: "#92400E", alignSelf: "center", marginLeft: 6, fontWeight: 700 }}>
                          {reviewStars}/5
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Initials */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 6 }}>Your Initials</div>
                    <input
                      type="text" placeholder="e.g. J.C." value={reviewInitials}
                      onChange={(e) => setReviewInitials(e.target.value)} maxLength={10}
                      style={{
                        width: "100%", padding: "10px 14px", borderRadius: 10,
                        border: "1.5px solid #E2E8F0", fontSize: 14, backgroundColor: "#F8FAFC",
                        color: "#0F172A", outline: "none", boxSizing: "border-box",
                        transition: "border-color 0.15s ease",
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#F59E0B"}
                      onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
                    />
                  </div>

                  {/* Comment */}
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 6 }}>Your Review</div>
                    <textarea
                      placeholder="Share your experience with AZense..." value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)} rows={4}
                      style={{
                        width: "100%", padding: "10px 14px", borderRadius: 10,
                        border: "1.5px solid #E2E8F0", fontSize: 14, backgroundColor: "#F8FAFC",
                        color: "#0F172A", outline: "none", resize: "vertical",
                        fontFamily: "inherit", boxSizing: "border-box",
                        transition: "border-color 0.15s ease",
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#F59E0B"}
                      onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={reviewLoading || !reviewStars || !reviewInitials.trim() || !reviewComment.trim()}
                    style={{
                      width: "100%", padding: "12px", borderRadius: 12, border: "none",
                      background: (!reviewStars || !reviewInitials.trim() || !reviewComment.trim())
                        ? "#CBD5E1" : "linear-gradient(135deg, #0284C7, #0EA5E9)",
                      color: "#FFFFFF", fontSize: 14, fontWeight: 700,
                      cursor: (!reviewStars || !reviewInitials.trim() || !reviewComment.trim()) ? "not-allowed" : "pointer",
                      boxShadow: (!reviewStars || !reviewInitials.trim() || !reviewComment.trim())
                        ? "none" : "0 4px 14px rgba(14,165,233,0.35)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {reviewLoading ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── empty state helper ── */
function EmptyState({ text, icon }) {
  const icons = {
    imaging: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
        <rect x="2" y="2" width="20" height="20" rx="2" />
        <path d="M7 2v20" /><path d="M17 2v20" />
        <path d="M2 12h20" /><path d="M2 7h5" /><path d="M2 17h5" />
        <path d="M17 7h5" /><path d="M17 17h5" />
      </svg>
    ),
    ekgs: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    procedures: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  };
  return (
    <div
      style={{
        textAlign: "center",
        padding: "48px 20px",
        color: "#94A3B8",
        fontSize: 13,
      }}
    >
      <div style={{ marginBottom: 10, display: "flex", justifyContent: "center" }}>
        {icons[icon] || <span style={{ fontSize: 28, opacity: 0.5 }}>📋</span>}
      </div>
      <div style={{ fontWeight: 500 }}>{text}</div>
    </div>
  );
}

export default App;
