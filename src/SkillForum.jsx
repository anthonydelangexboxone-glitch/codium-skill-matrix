import { useEffect, useState } from "react";
import Print from "./pdf";
import "./index.css";

function SkillForum() {
  const [isEditing, setIsEditing] = useState(null);
  const [skills, setSkills] = useState(() => {
    const savedData = localStorage.getItem("skillForumData");
    // If no data then return default //
    return savedData ? JSON.parse(savedData) : [{ id: 1, name: "", level: 0 }];
  });

  useEffect(() => {
    localStorage.setItem("skillForumData", JSON.stringify(skills));
  }, [skills]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };

  const addNewSkill = () => {
    setSkills([...skills, { id: Date.now(), name: "", level: 0 }]);
  };

  const updateSkill = (id, field, newValue) => {
    let value = newValue;

    // 1. Logic/Clamping for the 'level' field
    if (field === "level") {
      let numValue = parseFloat(newValue);
      if (numValue > 10) numValue = 10;
      if (numValue < 0) numValue = 0;
      value = isNaN(numValue) ? 0 : numValue;
    }

    // 2. Single Source of Truth for the state update
    // We use the functional update (prevSkills) to ensure data integrity
    setSkills((prevSkills) =>
      prevSkills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill,
      ),
    );
  };

  const removeSkill = (id) => {
    setSkills((prev) => prev.filter((skill) => skill.id !== id));
  };

  const refreshMatrix = () => {
    setSkills([{ id: 1, name: "", level: 0 }]);
  };

  const calculateScore = () => {
    if (skills.length === 0) return 0;

    const totalPoints = skills.reduce(
      (acc, skill) => acc + parseFloat(skill.level || 0),
      0,
    );
    const maxPossible = skills.length * 10;
    return ((totalPoints / maxPossible) * 100).toFixed(0); // Returns whole Number
  };

  return (
    <div className="skillforum">
      <div className="matrix-header-row">
        <span className="matrixheader">Name</span>
        <span className="matrixheader">Level / 10</span>
      </div>
      {skills.map((skill) => (
        <SkillMatrix
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleKeyDown={handleKeyDown}
          key={skill.id}
          skill={skill}
          updateSkill={updateSkill}
          removeSkill={removeSkill}
        />
      ))}
      <ScoreCalc calculateScore={calculateScore} />
      <button onClick={addNewSkill}>Add Skill</button>
      <button onClick={refreshMatrix}>Refresh</button>
      <Print skills={skills} score={calculateScore()} />
    </div>
  );
}

function SkillMatrix({
  skill,
  updateSkill,
  removeSkill,
  isEditing,
  setIsEditing,
  handleKeyDown,
}) {
  // Only trigger edit if the ID matches
  const setRowEdit = isEditing === skill.id;

  return (
    <div className="skill-row">
      {setRowEdit ? (
        <input
          type="text"
          value={skill.name}
          onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
          onKeyDown={handleKeyDown}
          className="header-input-active"
          // Stop the blur if the user is just moving between inputs in the same row
          onBlur={(e) => {
            // If the new element gaining focus is inside this same row, don't close!
            if (
              e.relatedTarget &&
              e.relatedTarget.closest(".skill-row") ===
                e.currentTarget.parentElement
            ) {
              return;
            }
            setIsEditing(null);
          }}
          autoFocus
        />
      ) : (
        <span
          onClick={() => setIsEditing(skill.id)}
          className="header-text-inactive"
        >
          {skill.name || "Click to set Name"}
        </span>
      )}

      {setRowEdit ? (
        <input
          type="number"
          value={skill.level}
          min={1}
          step={0.5}
          max={10}
          onChange={(e) => updateSkill(skill.id, "level", e.target.value)}
          onKeyDown={handleKeyDown}
          className="header-input-active"
          onBlur={(e) => {
            if (
              e.relatedTarget &&
              e.relatedTarget.closest(".skill-row") ===
                e.currentTarget.parentElement
            ) {
              return;
            }
            setIsEditing(null);
          }}
        />
      ) : (
        <span
          onClick={() => setIsEditing(skill.id)}
          className="header-text-inactive"
        >
          {skill.level}
        </span>
      )}

      <button
        className="btn-remove"
        onClick={() => removeSkill(skill.id)}
        title="Remove skill"
      >
        &times;
      </button>
    </div>
  );
}

function ScoreCalc({ calculateScore }) {
  return (
    <div className="score-display">
      <h3>Your Proficiency:</h3>
      <span className="score-value">{calculateScore()}%</span>
    </div>
  );
}

export default SkillForum;
