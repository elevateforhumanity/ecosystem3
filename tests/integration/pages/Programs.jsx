import React from "react";

const programs = [
  {
    name: "Construction Pre-Apprenticeship",
    credentials: ["OSHA 10", "NCCER Core", "First Aid/CPR", "Forklift Certification"],
    funding: ["WIOA", "WRG", "OJT", "WEX", "JRI", "IMPLY", "INDY", "DOL", "2Exclusive LLCs"],
    folder: "/curriculum/construction/"
  },
  {
    name: "Music & Dance Liberal Arts",
    credentials: ["Arts Integration Certificate", "Performance Readiness", "Music Theory Basics"],
    funding: ["WIOA", "WRG", "WEX", "IMPLY", "INDY", "2Exclusive LLCs"],
    folder: "/curriculum/music-dance-liberal-arts/"
  },
  {
    name: "Financial Literacy",
    credentials: ["Financial Literacy Certificate", "Budgeting Basics", "Credit Management"],
    funding: ["WIOA", "WRG", "WEX", "IMPLY", "INDY", "2Exclusive LLCs"],
    folder: "/curriculum/financial-literacy/"
  },
  {
    name: "CPR Instructor",
    credentials: ["CPR Instructor Certification", "First Aid", "AED Training"],
    funding: ["WIOA", "WRG", "OJT", "WEX", "IMPLY", "INDY", "DOL", "2Exclusive LLCs"],
    folder: "/curriculum/cpr-instructor/"
  },
  {
    name: "Phlebotomy Technician",
    credentials: ["Phlebotomy Certification", "Bloodborne Pathogens", "HIPAA"],
    funding: ["WIOA", "WRG", "OJT", "WEX", "IMPLY", "INDY", "DOL", "2Exclusive LLCs"],
    folder: "/curriculum/phlebotomy/"
  },
  {
    name: "Drug Testing Collector",
    credentials: ["DOT Collector Certification", "Chain of Custody Training"],
    funding: ["WIOA", "WRG", "OJT", "WEX", "IMPLY", "INDY", "DOL", "2Exclusive LLCs"],
    folder: "/curriculum/drug-testing-collector/"
  },
  {
    name: "OTR (Over-the-Road) Truck Driving",
    credentials: ["CDL Class A", "DOT Safety", "Logistics Basics"],
    funding: ["WIOA", "WRG", "OJT", "WEX", "IMPLY", "INDY", "DOL", "2Exclusive LLCs"],
    folder: "/curriculum/otr-driving/"
  }
];

export default function Programs() {
  return (
    <main style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <h1>Stackable Credential Programs</h1>
      <ul>
        {programs.map((p, i) => (
          <li key={i} style={{ marginBottom: 24 }}>
            <strong>{p.name}</strong>
            <div>Credentials: {p.credentials.join(", ")}</div>
            <div>Funding: {p.funding.join(", ")}</div>
            <a
              href={p.folder}
              style={{ color: "#1976d2", textDecoration: "underline" }}
              download
            >
              Download Curriculum Folder
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}