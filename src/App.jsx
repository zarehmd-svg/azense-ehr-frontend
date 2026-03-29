import { useEffect, useState } from "react";
import AzenseLogo from "./assets/Azense-logo.png"; // add logo file

const API_BASE = import.meta.env.VITE_API_BASE;

const TOP_TABS = ["notes", "labs", "imaging", "summary", "ekgs", "procedures"];

const NOTE_TYPES = [
  { id: "triage", label: "Triage" },
  { id: "nursing", label: "Nursing" },
  { id: "ed", label: "ED" },
  { id: "hp", label: "H&P" },
  { id: "progress", label: "Progress" },
  { id: "consult", label: "Consults" },
  { id: "discharge", label: "Discharge" },
];

function App() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [ehr, setEhr] = useState(null);
  const [activeTopTab, setActiveTopTab] = useState("notes");
  const [activeNoteType, setActiveNoteType] = useState("hp");
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [ownNote, setOwnNote] = useState("");

  // Load patient list once
useEffect(() => {
  const loadPatients = async () => {
    try {
      const res = await fetch(`${API_BASE}/ehr/patients`);
      const text = await res.text();
      console.log("PATIENT LIST RAW:", text);

      const json = JSON.parse(text);
      console.log("PATIENT LIST JSON:", json);

      const list = Array.isArray(json)
        ? json
        : Array.isArray(json?.patients)
        ? json.patients
        : Array.isArray(json?.data)
        ? json.data
        : [];

      setPatients(list);

      if (list.length > 0) {
        setSelectedPatientId(list[0].id);
      }
    } catch (err) {
      console.error("PATIENT LOAD ERROR:", err);
      setPatients([]);
    }
  };

  loadPatients();
}, []);

  // Load EHR for selected patient
useEffect(() => {
  if (!selectedPatientId) return;

  const loadEhr = async () => {
    try {
      const res = await fetch(`${API_BASE}/ehr/patients/${selectedPatientId}`);
      const json = await res.json();

      console.log("PATIENT DETAIL RESPONSE:", json);

      setEhr(json);
      setSelectedNoteId(null);
      setOwnNote("");
    } catch (err) {
      console.error("EHR LOAD ERROR:", err);
    }
  };

  loadEhr();
}, [selectedPatientId]);

  const notesOfType =
    ehr?.notes?.filter((n) => n.type === activeNoteType) ?? [];

    const selectedNote =
    notesOfType.find((n) => n.id === selectedNoteId) || notesOfType[0];

  return (
    <div
      style={{
        minHeight: "100vh",
        margin: 0,
        padding: 20,
        boxSizing: "border-box",
        background:
          "linear-gradient(180deg, #E0F2FE 0%, #F8FCFF 35%, #EEF6FF 100%)",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1380,
          background: "rgba(255,255,255,0.96)",
          borderRadius: 24,
          padding: 24,
          boxShadow: "0 20px 60px rgba(15,23,42,0.12)",
          border: "1px solid rgba(148,163,184,0.22)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Header */}
        <header
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 18,
    padding: "4px 2px 10px 2px",
  }}
>
  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
    <div
      style={{
        padding: 10,
        borderRadius: 16,
        background: "linear-gradient(135deg, #EFF6FF, #ECFEFF)",
        border: "1px solid rgba(125,211,252,0.55)",
        boxShadow: "0 8px 24px rgba(14,116,144,0.10)",
      }}
    >
      <img
        src={AzenseLogo}
        alt="AZense logo"
        style={{ height: 40, width: "auto", display: "block" }}
      />
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: "#0F172A",
          letterSpacing: "-0.02em",
        }}
      >
        Azense Simulation EHR
      </div>
      <div
        style={{
          fontSize: 13,
          color: "#0369A1",
          fontWeight: 500,
        }}
      >
        Read-only teaching view of sample admissions
      </div>
    </div>
  </div>

  <div
    style={{
      padding: "8px 14px",
      borderRadius: 999,
      border: "1px solid rgba(14,165,233,0.35)",
      background: "linear-gradient(135deg, #F0F9FF, #ECFEFF)",
      fontSize: 12,
      fontWeight: 700,
      color: "#0369A1",
      whiteSpace: "nowrap",
      boxShadow: "0 6px 20px rgba(14,165,233,0.10)",
    }}
  >
    View only · No note writing in EHR
  </div>
</header>

        {/* Divider */}
        <div
  style={{
    height: 1,
    width: "100%",
    background:
      "linear-gradient(90deg, rgba(14,165,233,0) 0, rgba(14,165,233,0.85) 22%, rgba(34,211,238,0.85) 50%, rgba(14,165,233,0.85) 78%, rgba(14,165,233,0) 100%)",
    marginBottom: 18,
  }}
/>

        {/* Two-column layout */}
        <div
  style={{
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: 18,
  }}
>
          {/* LEFT COLUMN: EHR content */}
          <div
  style={{
    minWidth: 0,
    maxWidth: "100%",
  }}
>
            {/* Patient list */}
            <section
  style={{
    marginBottom: 14,
    padding: 14,
    borderRadius: 16,
    background: "linear-gradient(180deg, #FFFFFF, #F8FBFF)",
    border: "1px solid rgba(186,230,253,0.9)",
    boxShadow: "0 10px 30px rgba(14,116,144,0.05)",
  }}
>

              {/* NEW patient selector block */}
              <div
  style={{
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#0369A1",
    marginBottom: 10,
  }}
>
  Patients
</div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  maxHeight: 120,
                  overflowY: "auto",
                  marginBottom: 4,
                }}
              >
                {patients.length === 0 ? (
                  <div
                    style={{
                      fontSize: 12,
                      color: "#94A3B8",
                      padding: "8px 0",
                    }}
                  >
                    No patients loaded
                  </div>
                ) : (
                  patients.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPatientId(p.id)}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 10,
                        border:
                          selectedPatientId === p.id
                            ? "1px solid #0F766E"
                            : "1px solid #CBD5E1",
                        background:
                          selectedPatientId === p.id ? "#CCFBF1" : "#FFFFFF",
                        color:
                          selectedPatientId === p.id ? "#134E4A" : "#0F172A",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {p.label || `Patient ${p.id}`}
                    </button>
                  ))
                )}
              </div>

              {ehr?.overview?.brief_reason && (
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 11,
                    color: "#4B5563",
                  }}
                >
                  Reason: {ehr.overview.brief_reason}
                </div>
              )}
            </section>

            {/* Top tabs */}
            <section style={{ marginBottom: 10 }}>
  <div
    style={{
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      fontSize: 11,
      padding: 6,
      borderRadius: 999,
      background: "rgba(239,246,255,0.8)",
      border: "1px solid rgba(191,219,254,0.9)",
    }}
  >
    {TOP_TABS.map((id) => {
      const label = {
        notes: "Notes",
        labs: "Labs",
        imaging: "Imaging",
        summary: "Summary",
        ekgs: "EKGs",
        procedures: "Procedures",
      }[id];
      const active = activeTopTab === id;
      return (
        <button
          key={id}
          onClick={() => setActiveTopTab(id)}
          style={{
  padding: "7px 12px",
  borderRadius: 999,
  border: active
    ? "1px solid rgba(2,132,199,0.9)"
    : "1px solid rgba(186,230,253,0.95)",
  background: active
    ? "linear-gradient(135deg,#0284C7,#22D3EE)"
    : "#FFFFFF",
  color: active ? "#F8FAFC" : "#0369A1",
  fontWeight: active ? 700 : 600,
  boxShadow: active
    ? "0 8px 18px rgba(14,165,233,0.22)"
    : "0 1px 2px rgba(15,23,42,0.04)",
  cursor: "pointer",
}}
        >
          {label}
        </button>
      );
    })}
  </div>
</section>

            {/* Content area per top tab */}
            <section
  style={{
    marginTop: 6,
    padding: 14,
    borderRadius: 18,
    border: "1px solid rgba(186,230,253,0.95)",
    background: "linear-gradient(180deg, #FFFFFF, #F8FBFF)",
    boxShadow: "0 14px 34px rgba(14,116,144,0.06)",
    minHeight: 300,
  }}
>
              {activeTopTab === "notes" && (
                <div style={{ display: "flex", gap: 10 }}>
                  {/* Note sub-tabs */}
                  <div style={{ width: 130 }}>
                    <div
  style={{
    width: 140,
    padding: 10,
    borderRadius: 14,
    background: "#F8FBFF",
    border: "1px solid rgba(191,219,254,0.9)",
  }}
>
                      Note types
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
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
  padding: "8px 10px",
  borderRadius: 12,
  border: active
    ? "1px solid rgba(2,132,199,0.85)"
    : "1px solid rgba(226,232,240,0.95)",
  background: active
    ? "linear-gradient(135deg, #E0F2FE, #ECFEFF)"
    : "#FFFFFF",
  color: active ? "#075985" : "#0F172A",
  fontSize: 11,
  fontWeight: active ? 700 : 600,
  textAlign: "left",
  boxShadow: active
    ? "0 8px 18px rgba(14,165,233,0.14)"
    : "0 1px 2px rgba(15,23,42,0.04)",
  cursor: "pointer",
}}
                          >
                            {nt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Note list + text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#4B5563",
                        marginBottom: 4,
                      }}
                    >
                      {activeNoteType.toUpperCase()} notes
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        height: 220,
                      }}
                    >
                      {/* Note list */}
                      <div
  style={{
    width: 180,
    borderRadius: 14,
    border: "1px solid rgba(191,219,254,0.95)",
    background: "linear-gradient(180deg, #FFFFFF, #F8FBFF)",
    overflowY: "auto",
    fontSize: 11,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
  }}
>
                        {notesOfType.length === 0 && (
                          <div
                            style={{
                              padding: 6,
                              color: "#9CA3AF",
                            }}
                          >
                            No notes of this type.
                          </div>
                        )}
                        {notesOfType.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => setSelectedNoteId(n.id)}
                            style={{
  padding: "9px 10px",
  borderBottom: "1px solid rgba(226,232,240,0.9)",
  cursor: "pointer",
  background:
    selectedNote?.id === n.id
      ? "linear-gradient(135deg, rgba(224,242,254,0.95), rgba(236,254,255,0.95))"
      : "transparent",
  borderLeft:
    selectedNote?.id === n.id
      ? "3px solid #0EA5E9"
      : "3px solid transparent",
}}
                          >
                            <div
                              style={{
                                fontWeight: 600,
                                color: "#0F172A",
                                marginBottom: 2,
                              }}
                            >
                              {n.title || "Note"}
                            </div>
                            {n.timestamp && (
                              <div
                                style={{
                                  fontSize: 10,
                                  color: "#6B7280",
                                }}
                              >
                                {n.timestamp}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Note text */}
                      <div
  style={{
    flex: 1,
    borderRadius: 16,
    border: "1px solid rgba(191,219,254,0.95)",
    background: "linear-gradient(180deg, #FFFFFF, #F9FCFF)",
    padding: 14,
    overflowY: "auto",
    fontSize: 12,
    whiteSpace: "pre-wrap",
    boxShadow: "0 10px 24px rgba(15,23,42,0.04)",
    lineHeight: 1.5,
  }}
>
                        {selectedNote ? (
                          <>
                            <div
                              style={{
                                fontWeight: 600,
                                marginBottom: 4,
                                color: "#0F172A",
                              }}
                            >
                              {selectedNote.title}
                            </div>
                            <div style={{ color: "#111827" }}>
                              {selectedNote.text}
                            </div>
                          </>
                        ) : (
                          <div style={{ color: "#9CA3AF" }}>
                            Select a note to view its contents.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTopTab === "labs" && (
                <div style={{ fontSize: 12, color: "#111827" }}>
                  {ehr?.labs?.length ? (
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: 12,
                      }}
                    >
                      <thead>
                        <tr style={{ background: "#E5E7EB" }}>
                          <th style={{ padding: 4, textAlign: "left" }}>
                            Time
                          </th>
                          <th style={{ padding: 4, textAlign: "left" }}>
                            Test
                          </th>
                          <th style={{ padding: 4, textAlign: "left" }}>
                            Value
                          </th>
                          <th style={{ padding: 4, textAlign: "left" }}>
                            Normal
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {ehr.labs.map((lab, idx) => (
                          <tr
                            key={idx}
                            style={{
                              borderTop: "1px solid #E5E7EB",
                              background:
                                idx % 2 === 0 ? "#FFFFFF" : "#F9FAFB",
                            }}
                          >
                            <td style={{ padding: 4 }}>{lab.timestamp}</td>
                            <td style={{ padding: 4 }}>{lab.name}</td>
                            <td style={{ padding: 4 }}>
                              {lab.value}
                              {lab.unit ? ` ${lab.unit}` : ""}
                            </td>
                            <td style={{ padding: 4 }}>
                              {lab.normal_range || ""}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ color: "#9CA3AF" }}>
                      No structured labs for this case.
                    </div>
                  )}
                </div>
              )}

              {activeTopTab === "imaging" && (
                <div style={{ fontSize: 12 }}>
                  {ehr?.imaging?.length ? (
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: 16,
                      }}
                    >
                      {ehr.imaging.map((img) => (
                        <li key={img.id} style={{ marginBottom: 4 }}>
                          <div
                            style={{
                              fontWeight: 600,
                              color: "#0F172A",
                            }}
                          >
                            {img.modality} {img.body_part}{" "}
                            {img.timestamp && `· ${img.timestamp}`}
                          </div>
                          <div
                            style={{
                              color: "#111827",
                            }}
                          >
                            {img.impression}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div style={{ color: "#9CA3AF" }}>
                      No imaging reports for this case.
                    </div>
                  )}
                </div>
              )}

              {activeTopTab === "summary" && (
                <div style={{ fontSize: 12, color: "#111827" }}>
                  <div style={{ marginBottom: 6, fontWeight: 600 }}>
                    Vitals trends
                  </div>
                  {ehr?.summary?.vitals?.length ? (
                    <pre
                      style={{
                        margin: 0,
                        background: "#FFFFFF",
                        borderRadius: 6,
                        padding: 6,
                        border: "1px solid rgba(209,213,219,0.9)",
                        fontSize: 11,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {JSON.stringify(ehr.summary.vitals, null, 2)}
                    </pre>
                  ) : (
                    <div style={{ color: "#9CA3AF" }}>
                      No structured vitals bundle.
                    </div>
                  )}
                </div>
              )}

              {activeTopTab === "ekgs" && (
                <div style={{ fontSize: 12 }}>
                  {ehr?.ekgs?.length ? (
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {ehr.ekgs.map((e) => (
                        <li key={e.id} style={{ marginBottom: 4 }}>
                          <div style={{ fontWeight: 600, color: "#0F172A" }}>
                            {e.timestamp || "EKG"}
                          </div>
                          <div>{e.interpretation}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div style={{ color: "#9CA3AF" }}>
                      No EKG interpretations for this case.
                    </div>
                  )}
                </div>
              )}

              {activeTopTab === "procedures" && (
                <div style={{ fontSize: 12 }}>
                  {ehr?.procedures?.length ? (
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {ehr.procedures.map((p) => (
                        <li key={p.id} style={{ marginBottom: 4 }}>
                          <div style={{ fontWeight: 600, color: "#0F172A" }}>
                            {p.name} {p.timestamp && `· ${p.timestamp}`}
                          </div>
                          {p.description && <div>{p.description}</div>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div style={{ color: "#9CA3AF" }}>
                      No procedures documented in this case.
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* RIGHT COLUMN: blank note area for residents */}
        <div
  style={{
    minWidth: 0,
    width: "100%",
  }}
>
            <section
  style={{
    padding: 14,
    borderRadius: 18,
    background: "linear-gradient(180deg, #FFFFFF, #F8FBFF)",
    border: "1px solid rgba(186,230,253,0.95)",
    boxShadow: "0 14px 34px rgba(14,116,144,0.06)",
  }}
>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#475569",
                  marginBottom: 6,
                }}
              >
                Your teaching note
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                  marginBottom: 4,
                }}
              >
                Use this area during teaching sessions for residents to
                hand‑write their own H&P or progress note based on the simulated
                EHR. This text is not saved.
              </div>
              <textarea
                rows={18}
                value={ownNote}
                onChange={(e) => setOwnNote(e.target.value)}
                placeholder="Write your own assessment and plan here..."
                style={{
  width: "100%",
  borderRadius: 16,
  border: "1px solid rgba(191,219,254,0.95)",
  padding: 14,
  fontSize: 13,
  lineHeight: 1.55,
  fontFamily:
    "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  outline: "none",
  background: "linear-gradient(180deg, #FFFFFF, #F8FBFF)",
  color: "#0F172A",
  resize: "vertical",
  minHeight: 300,
  boxShadow: "inset 0 1px 2px rgba(15,23,42,0.04)",
}}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;