export function parseM3U(text) {
  const lines = text.split("\n");
  const channels = [];
  let current = {};

  lines.forEach((line) => {
    line = line.trim();
    if (line.startsWith("#EXTINF")) {
      const nameMatch = line.match(/,(.*)$/);
      const groupMatch = line.match(/group-title="([^"]+)"/);
      const logoMatch = line.match(/tvg-logo="([^"]+)"/);

      current.name = nameMatch ? nameMatch[1] : "Unknown";
      current.group = groupMatch ? groupMatch[1] : "Uncategorized";
      current.logo = logoMatch ? logoMatch[1] : null;
    } else if (line && !line.startsWith("#")) {
      current.url = line;
      channels.push(current);
      current = {};
    }
  });

  return channels;
}