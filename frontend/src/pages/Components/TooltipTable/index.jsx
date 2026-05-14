import React from "react";

const cellStyle = {
  border: "1px solid #ccc",
  padding: "4px 8px",
  verticalAlign: "top",
  fontSize: 13,
};

const TooltipTable = ({ fields }) => {
  if (!Array.isArray(fields)) return null;

  const validFields = fields.filter(
    (field) =>
      field.value !== null && field.value !== undefined && field.value !== ""
  );

  if (!validFields.length) return null;

  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <tbody>
        {fields
          .filter((field) => field.value !== null && field.value !== undefined)
          .map((field, index) => (
            <tr key={index}>
              <td style={cellStyle}>
                <strong>{field.label}</strong>
              </td>
              <td style={cellStyle}>{field.value}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default TooltipTable;
