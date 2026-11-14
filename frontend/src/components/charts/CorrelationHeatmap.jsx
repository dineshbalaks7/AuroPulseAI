import React from 'react';

const getCorrColor = (val) => {
  if (val === undefined || isNaN(val)) return '#F1F5F9';
  if (val >= 0.8) return '#087F78'; // Strong positive
  if (val >= 0.5) return '#2DD4BF';
  if (val >= 0.2) return '#99F6E4';
  if (val >= -0.2) return '#F8FAFC'; // Neutral
  if (val >= -0.5) return '#FECACA';
  if (val >= -0.8) return '#F87171';
  return '#DC2626'; // Strong negative
};

const getTextColor = (val) => {
  if (Math.abs(val) >= 0.5) return '#FFFFFF';
  return '#172B3A';
};

export const CorrelationHeatmap = ({ correlationMatrix = {}, activeSensors = [] }) => {
  const sensors = activeSensors.length > 0 ? activeSensors : Object.keys(correlationMatrix);

  if (!sensors.length || !Object.keys(correlationMatrix).length) {
    return (
      <div className="p-8 text-center text-xs text-secondary">
        Correlation data unavailable.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[11px] font-mono mx-auto">
        <thead>
          <tr>
            <th className="p-1.5 text-left text-secondary font-sans font-semibold">Sensor</th>
            {sensors.map((s) => (
              <th key={s} className="p-1.5 text-center text-secondary font-medium w-10">
                {s.replace('sensor_', 'S')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sensors.map((sRow) => (
            <tr key={sRow}>
              <td className="p-1.5 font-semibold text-main text-right pr-3 font-sans">
                {sRow.replace('sensor_', 'Sensor ')}
              </td>
              {sensors.map((sCol) => {
                const val = correlationMatrix[sRow]?.[sCol];
                const numVal = Number(val);
                return (
                  <td
                    key={sCol}
                    className="p-1.5 text-center transition-transform hover:scale-110 cursor-pointer rounded-xs"
                    style={{
                      backgroundColor: getCorrColor(numVal),
                      color: getTextColor(numVal),
                    }}
                    title={`${sRow} ↔ ${sCol}: ${numVal.toFixed(3)}`}
                  >
                    {isNaN(numVal) ? '—' : numVal.toFixed(2)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-secondary">
        <span>-1.0 (Inverse)</span>
        <div className="h-2.5 w-32 rounded bg-gradient-to-r from-red-600 via-slate-100 to-[#087F78]" />
        <span>+1.0 (Direct)</span>
      </div>
    </div>
  );
};

export default CorrelationHeatmap;
