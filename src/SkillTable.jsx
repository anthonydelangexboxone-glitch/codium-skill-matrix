export const SkillTable = ({ skills, score }) => (
  <table className="print-table">
    <thead>
      <tr>
        <th>Skill</th>
        <th>Level</th>
      </tr>
    </thead>
    <tbody>
      {skills.map((s) => (
        <tr key={s.id}>
          <td>{s.name}</td>
          <td>{s.level}</td>
        </tr>
      ))}
    </tbody>
    <tfoot>
      <tr>
        <td>Proficiency</td>
        <td>{score}%</td>
      </tr>
    </tfoot>
  </table>
);
