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
            marginBottom: 14,
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src={AzenseLogo}
              alt="AZense logo"
              style={{ height: 52, width: "auto", display: "block" }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#0F172A",
                }}
              >
                Azense Simulation EHR
              </div>
              <div style={{ fontSize: 12, color: "#1D4ED8" }}>
                Read‑only teaching view of sample admissions
              </div>
            </div>
          </div>
          <div
            style={{
              padding: "4px 10px",
              borderRadius: 999,
              border: "1px solid rgba(37,99,235,0.7)",
              background:
                "linear-gradient(135deg, rgba(37,99,235,0.16), rgba(56,189,248,0.10))",
              fontSize: 11,
              fontWeight: 600,
              color: "#1D4ED8",
              whiteSpace: "nowrap",
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
              "linear-gradient(90deg, rgba(37,99,235,0) 0, rgba(37,99,235,0.9) 45, rgba(37,99,235,0) 100)",
            marginBottom: 14,
          }}
        />

        {/* Two-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1.3fr)",
            gap: 16,
          }}
        >
          {/* LEFT COLUMN: EHR content */}
          <div style={{ minWidth: 0 }}>
            {/* Patient list */}
            <section style={{ marginBottom: 10 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#475569",
                  marginBottom: 6,
                }}
              ></div>

              {/* NEW patient selector block */}
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#64748B",
                  marginBottom: 8,
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
            <section style={{ marginBottom: 8 }}>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                  fontSize: 11,
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
                        padding: "4px 10px",
                        borderRadius: 999,
                        border: active
                          ? "1px solid rgba(37,99,235,0.9)"
                          : "1px solid rgba(148,163,184,0.8)",
                        background: active
                          ? "linear-gradient(135deg,#2563EB,#60A5FA)"
                          : "#EFF6FF",
                        color: active ? "#F9FAFB" : "#1D4ED8",
                        fontWeight: active ? 700 : 600,
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
                marginTop: 4,
                padding: 10,
                borderRadius: 10,
                border: "1px solid rgba(148,163,184,0.7)",
                background: "#F9FAFB",
                minHeight: 260,
              }}
            >
              {activeTopTab === "notes" && (
                <div style={{ display: "flex", gap: 10 }}>
                  {/* Note sub-tabs */}
                  <div style={{ width: 130 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#4B5563",
                        marginBottom: 4,
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
                              padding: "3px 8px",
                              borderRadius: 999,
                              border: active
                                ? "1px solid rgba(30,64,175,0.9)"
                                : "1px solid rgba(148,163,184,0.8)",
                              background: active ? "#EEF2FF" : "#FFFFFF",
                              color: active ? "#1D4ED8" : "#111827",
                              fontSize: 11,
                              textAlign: "left",
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
                          width: 160,
                          borderRadius: 8,
                          border: "1px solid rgba(148,163,184,0.8)",
                          background: "#FFFFFF",
                          overflowY: "auto",
                          fontSize: 11,
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
                              padding: "5px 7px",
                              borderBottom:
                                "1px solid rgba(226,232,240,0.9)",
                              cursor: "pointer",
                              background:
                                selectedNote?.id === n.id
                                  ? "rgba(191,219,254,0.7)"
                                  : "transparent",
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
                          borderRadius: 8,
                          border: "1px solid rgba(148,163,184,0.8)",
                          background: "#FFFFFF",
                          padding: 8,
                          overflowY: "auto",
                          fontSize: 12,
                          whiteSpace: "pre-wrap",
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
          <div style={{ minWidth: 0 }}>
            <section>
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
                  borderRadius: 10,
                  border: "1px solid rgba(148,163,184,0.9)",
                  padding: 10,
                  fontSize: 13,
                  fontFamily:
                    "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                  outline: "none",
                  background:
                    "linear-gradient(135deg,#F9FAFB,#EEF2FF,#FFFFFF)",
                  color: "#0F172A",
                  resize: "vertical",
                  minHeight: 260,
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