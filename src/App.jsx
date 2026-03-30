import { useEffect, useState } from "react";
import AzenseLogo from "./assets/Azense-logo.png";

const API_BASE = import.meta.env.VITE_API_BASE;

const TOP_TABS = ["notes", "labs", "imaging", "summary", "ekgs", "procedures"];
const TOP_TAB_LABELS = {
  notes: "Notes",
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

function App() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [ehr, setEhr] = useState(null);
  const [activeTopTab, setActiveTopTab] = useState("notes");
  const [activeNoteType, setActiveNoteType] = useState("hp");
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [ownNote, setOwnNote] = useState("");

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
        setPatients(list);
        if (list.length > 0) setSelectedPatientId(list[0].id);
      } catch (err) {
        console.error("Patient load error:", err);
        setPatients([]);
      }
    })();
  }, []);

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
                height: 36,
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
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: colors.teal,
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
              <div style={{ fontSize: 12, color: "#94A3B8", padding: "8px 0" }}>
                Loading patients…
              </div>
            ) : (
              patients.map((p) => {
                const active = selectedPatientId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPatientId(p.id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 8,
                      border: active
                        ? "1.5px solid #0F766E"
                        : "1px solid #E2E8F0",
                      background: active
                        ? "linear-gradient(135deg, #CCFBF1, #D1FAE5)"
                        : "#FFFFFF",
                      color: active ? "#134E4A" : "#334155",
                      fontSize: 12,
                      fontWeight: active ? 700 : 500,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      boxShadow: active
                        ? "0 2px 8px rgba(15,118,110,0.15)"
                        : "0 1px 2px rgba(15,23,42,0.04)",
                    }}
                  >
                    {p.label || `Patient ${p.id}`}
                  </button>
                );
              })
            )}
          </div>

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

            {/* ─── LABS TAB ─── */}
            {activeTopTab === "labs" && (
              <div>
                {ehr?.labs?.length ? (
                  <div style={{ overflowX: "auto", width: "100%" }}>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "separate",
                        borderSpacing: 0,
                        fontSize: 13,
                      }}
                    >
                      <thead>
                        <tr>
                          {["Time", "Test", "Value", "Normal Range"].map(
                            (h) => (
                              <th
                                key={h}
                                style={{
                                  padding: "10px 14px",
                                  textAlign: "left",
                                  fontSize: 11,
                                  fontWeight: 700,
                                  letterSpacing: "0.05em",
                                  textTransform: "uppercase",
                                  color: "#64748B",
                                  background: "#F8FAFC",
                                  borderBottom: "2px solid #E2E8F0",
                                }}
                              >
                                {h}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {ehr.labs.map((lab, idx) => (
                          <tr
                            key={idx}
                            style={{
                              background:
                                idx % 2 === 0 ? "#FFFFFF" : "#F8FAFC",
                            }}
                          >
                            <td
                              style={{
                                padding: "9px 14px",
                                borderBottom: "1px solid #F1F5F9",
                                color: "#64748B",
                                fontSize: 12,
                              }}
                            >
                              {lab.timestamp}
                            </td>
                            <td
                              style={{
                                padding: "9px 14px",
                                borderBottom: "1px solid #F1F5F9",
                                fontWeight: 600,
                                color: "#0F172A",
                              }}
                            >
                              {lab.name}
                            </td>
                            <td
                              style={{
                                padding: "9px 14px",
                                borderBottom: "1px solid #F1F5F9",
                                color: "#0F172A",
                              }}
                            >
                              {lab.value}
                              {lab.unit ? ` ${lab.unit}` : ""}
                            </td>
                            <td
                              style={{
                                padding: "9px 14px",
                                borderBottom: "1px solid #F1F5F9",
                                color: "#64748B",
                              }}
                            >
                              {lab.normal_range || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyState text="No structured labs for this case." />
                )}
              </div>
            )}

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
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#94A3B8",
                    marginBottom: 10,
                  }}
                >
                  Vitals trends
                </div>
                {ehr?.summary?.vitals?.length ? (
                  <pre
                    style={{
                      margin: 0,
                      background: "#F8FAFC",
                      borderRadius: 12,
                      padding: "14px 16px",
                      border: "1px solid #E2E8F0",
                      fontSize: 12,
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.55,
                      color: "#334155",
                      fontFamily: "ui-monospace, 'SF Mono', Consolas, monospace",
                    }}
                  >
                    {JSON.stringify(ehr.summary.vitals, null, 2)}
                  </pre>
                ) : (
                  <EmptyState text="No structured vitals bundle." />
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
              padding: "18px 20px",
              borderRadius: 16,
              background: colors.sectionBg,
              border: `1px solid ${colors.sectionBorder}`,
              boxShadow: colors.subtleShadow,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: colors.teal,
                marginBottom: 8,
              }}
            >
              Your teaching note
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#64748B",
                marginBottom: 12,
                lineHeight: 1.55,
              }}
            >
              Use this area during teaching sessions for residents to hand-write
              their own H&P or progress note based on the simulated EHR. This
              text is not saved.
            </div>
            <textarea
              rows={14}
              value={ownNote}
              onChange={(e) => setOwnNote(e.target.value)}
              placeholder="Write your own assessment and plan here…"
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
                minHeight: 200,
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
