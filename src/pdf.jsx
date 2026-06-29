import { SkillTable } from "./SkillTable";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import "./index.css";

export default function Print({ skills, score }) {
  const contentRef = useRef(null);
  const componentToPrint = useReactToPrint({ contentRef });

  return (
    <div className="print-container">
      <button onClick={() => componentToPrint()}>Print</button>
      <div style={{ display: "none" }}>
        <div ref={contentRef}>
          <SkillTable skills={skills} score={score} />
        </div>
      </div>
    </div>
  );
}
