import React from "react";

function ChannelList({ channels, onSelect }) {
  const grouped = channels.reduce((acc, ch, idx) => {
    acc[ch.group] = acc[ch.group] || [];
    acc[ch.group].push({ ...ch, idx });
    return acc;
  }, {});

  return (
    <div style={{ margin: "20px" }}>
      <h3>Available Channels</h3>
      {Object.keys(grouped).map((group) => (
        <div key={group} style={{ marginBottom: "15px" }}>
          <h4>{group}</h4>
          <ul>
            {grouped[group].map((ch) => (
              <li key={ch.idx} style={{ listStyle: "none", margin: "5px 0" }}>
                <button onClick={() => onSelect(ch.idx)}>
                  {ch.logo && (
                    <img
                      src={ch.logo}
                      alt={ch.name}
                      style={{ width: "30px", marginRight: "10px" }}
                    />
                  )}
                  {ch.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default ChannelList;