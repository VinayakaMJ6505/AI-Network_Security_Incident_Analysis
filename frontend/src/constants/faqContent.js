// Page-specific FAQ copy rendered by <FAQSection /> on each view.
// Each item is { q, a, fields? } — `fields` renders an optional term/description
// breakdown under the answer (e.g. what each column or widget field means).
// Keep answers short and in plain, human-readable language.

export const DASHBOARD_FAQ = [
  {
    q: 'What does the Dashboard show?',
    a: 'A live overview of network security posture — total events processed, detected attacks, high-risk and critical incident counts, attack distribution and trend charts, and the most recent incidents stream.',
  },
  {
    q: 'What is the DEFCON level indicator?',
    a: 'A 1–5 threat-posture scale derived from the current incident mix, ranging from DEFCON 5 (normal baseline traffic) to DEFCON 1 (active critical compromise).',
  },
  {
    q: 'What do the KPI cards at the top mean?',
    a: 'Four running totals pulled straight from the incident database.',
    fields: [
      { term: 'Total Events', desc: 'Every network flow the pipeline has processed so far — benign and malicious combined.' },
      { term: 'Detected Attacks', desc: 'Flows the XGBoost model classified as an attack category, with the % of total traffic that represents.' },
      { term: 'High-Risk Incidents', desc: 'Incidents scored 61–80 on the 0–100 risk scale — worth a look, not yet critical.' },
      { term: 'Critical Incidents', desc: 'Incidents scored 81–100 — the highest bucket, flagged for immediate containment.' },
    ],
  },
  {
    q: 'What is the Attack Distribution chart?',
    a: 'A breakdown of classified events by UNSW-NB15 attack category (e.g. Exploits, DoS, Reconnaissance, Fuzzers), so you can see which attack types dominate current traffic.',
  },
  {
    q: 'What does the attack trends chart show?',
    a: 'A time series comparing normal vs. malicious traffic volume over the last 8 hours, useful for spotting spikes in attack activity.',
  },
  {
    q: 'What is the Active Security Incidents Stream?',
    a: 'The most recent incidents the pipeline has detected, one row per flow.',
    fields: [
      { term: 'Source IP', desc: 'The address the traffic originated from.' },
      { term: 'Destination / Port', desc: 'The target address plus the port and protocol (TCP/UDP/etc.) it connected on.' },
      { term: 'Attack Type', desc: "The category the model assigned (e.g. Exploits, DoS), with its confidence %." },
      { term: 'Risk Score', desc: 'A 0–100 severity score combining attack category, port sensitivity, and model confidence.' },
      { term: 'Severity', desc: 'The risk score bucketed into Low, Medium, High, or Critical.' },
      { term: 'Timestamp', desc: 'When the flow was recorded.' },
      { term: 'Actions', desc: 'Opens the full incident dossier with the AI-generated investigation summary.' },
    ],
  },
  {
    q: 'Can I rearrange the widgets?',
    a: 'Yes — drag a widget by its header to reposition it, resize it from the corner handle, and use "Reset Layout" to restore the default arrangement.',
  },
  {
    q: 'Why are some charts empty?',
    a: 'They populate once the FastAPI backend is online and has ingested traffic/incident data — check the status indicator in the header.',
  },
];

export const TELEMETRY_FAQ = [
  {
    q: 'What does the Telemetry view track?',
    a: 'Real-time network-layer signals — protocol breakdown, most-targeted ports, top talking source IPs, attack trends over time, and a live incident stream.',
  },
  {
    q: 'What is Protocol Breakdown?',
    a: 'A pie chart of traffic share by network protocol — TCP, UDP, ICMP, ARP, and OSPF — showing which protocol carries most of the current flow volume.',
  },
  {
    q: 'What is Top Targeted Ports?',
    a: 'A bar chart of the destination ports receiving the most hits.',
    fields: [
      { term: 'Port', desc: 'The destination port number receiving traffic.' },
      { term: 'Service', desc: 'The application typically running on that port (shown on hover).' },
      { term: 'Risk (bar color)', desc: 'How sensitive that service is if compromised — Critical, High, or Medium.' },
      { term: 'Hits', desc: 'How many flows targeted that port.' },
    ],
  },
  {
    q: "What is Top Talkers?",
    a: 'The source IPs generating the highest volume of flagged network events, useful for spotting a single host driving an attack campaign.',
    fields: [
      { term: 'IP', desc: 'The source address generating traffic.' },
      { term: 'Country', desc: 'The geographic origin attributed to that IP (or "LAN" for internal addresses).' },
      { term: 'Primary Threat', desc: 'The most common attack category associated with that source.' },
      { term: 'Count', desc: 'Total events attributed to that source IP.' },
    ],
  },
  {
    q: 'What is Attack Trend Telemetry?',
    a: 'The same normal-vs-malicious trend chart shown on the Dashboard, kept here for a denser, analyst-focused layout.',
  },
  {
    q: 'What is the Live Incident Stream widget?',
    a: 'A compact, continuously updating feed of incidents as they occur.',
    fields: [
      { term: 'Source → Destination', desc: 'Where the flow came from and what it targeted, with the assigned attack type underneath.' },
      { term: 'Time', desc: 'How long ago the incident was recorded, shown as relative time (e.g. "2 minutes ago").' },
    ],
  },
  {
    q: 'Is this layout customizable too?',
    a: 'Yes — the same drag, resize, and reset controls as the Dashboard. Your layout is saved locally per view.',
  },
];

export const INCIDENTS_FAQ = [
  {
    q: 'What is the Incidents Explorer?',
    a: 'A searchable, filterable catalog of every detected security incident, each with a full attack dossier and AI-generated investigation recommendations.',
  },
  {
    q: 'What do the search and filter controls do?',
    a: 'Narrow down the incident catalog without leaving the page.',
    fields: [
      { term: 'Search box', desc: 'Matches against source/destination IP, attack type, or port.' },
      { term: 'Severity filter', desc: 'Shows only incidents of a chosen severity — Low, Medium, High, or Critical.' },
      { term: 'Category filter', desc: 'Shows only incidents of a chosen attack type.' },
    ],
  },
  {
    q: 'What do the table columns mean?',
    a: 'Each row is one detected incident, sortable by clicking a column header.',
    fields: [
      { term: 'Source IP', desc: 'The address the traffic originated from.' },
      { term: 'Destination / Port', desc: 'The target address plus the port and protocol it connected on.' },
      { term: 'Attack Type', desc: 'The category the model assigned, with its confidence %.' },
      { term: 'Risk Score', desc: 'A 0–100 severity score combining attack category, port sensitivity, and model confidence.' },
      { term: 'Severity', desc: 'The risk score bucketed into Low, Medium, High, or Critical.' },
      { term: 'Timestamp', desc: 'When the flow was recorded.' },
      { term: 'Actions', desc: 'Opens the full incident dossier with the AI-generated investigation summary.' },
    ],
  },
  {
    q: "What does 'Export JSON' do?",
    a: 'Downloads the currently loaded incident list as a JSON file for offline analysis or reporting.',
  },
  {
    q: 'How is severity determined?',
    a: 'Each incident is scored 0–100 from a weighted mix of attack category, targeted-port sensitivity, and model confidence, then bucketed into Low, Medium, High, or Critical.',
  },
];

export const ANALYZER_FAQ = [
  {
    q: 'What does the Live Analyzer do?',
    a: "Lets you submit a single network flow's parameters and get an instant XGBoost classification with a risk score and AI-written explanation.",
  },
  {
    q: 'What are the Attack Scenario presets?',
    a: 'Pre-filled example flows for common attack patterns (port scan, DoS, exploit, etc.) so you can see how the model responds without hand-crafting values.',
  },
  {
    q: 'What do the Network Flow Parameters fields mean?',
    a: 'The inputs the model uses to classify a flow, based on the UNSW-NB15 schema.',
    fields: [
      { term: 'Source / Destination IP', desc: 'Where the simulated traffic is sent from and to.' },
      { term: 'Target Port', desc: 'The destination port number being connected to.' },
      { term: 'Protocol (proto)', desc: 'The network protocol used — TCP, UDP, ICMP, ARP, or OSPF.' },
      { term: 'Service', desc: 'The application-layer service the port maps to (e.g. http, ssh, dns).' },
      { term: 'Connection State', desc: 'How the connection ended — Connected, Finished, Interrupted, Requested, or Reset.' },
      { term: 'Flow Duration (dur)', desc: 'How long the flow lasted, in seconds.' },
      { term: 'Source Load (sload)', desc: 'Bits per second sent from the source — a high value can indicate a flood or exfiltration.' },
      { term: 'Source / Destination Bytes', desc: 'Total bytes sent from the source, and sent back from the destination.' },
      { term: 'Source Packets (spkts)', desc: 'Number of packets sent from the source.' },
      { term: 'Failed Auth Attempts', desc: 'Failed login attempts observed on this flow — a strong brute-force signal.' },
    ],
  },
  {
    q: 'What is the AI Classification Output?',
    a: 'The result panel after you click "Analyze Event".',
    fields: [
      { term: 'Attack Type & Confidence', desc: 'The predicted category and how confident the model is.' },
      { term: 'Risk Score & Severity', desc: 'The 0–100 risk score and its Low/Medium/High/Critical bucket.' },
      { term: 'AI Summary & Recommendations', desc: 'A generated plain-language explanation plus suggested SOC response steps.' },
      { term: 'Copy Report', desc: 'Copies a short text summary of the result to your clipboard.' },
    ],
  },
];

export const LOGPARSER_FAQ = [
  {
    q: 'What does this page do?',
    a: 'Parses free-form log lines (syslog/firewall text) using NLP extraction, maps the fields onto the UNSW-NB15 schema, and runs them through the same detection pipeline as Live Analyzer.',
  },
  {
    q: 'What are the sample log templates?',
    a: 'Ready-made example log formats you can load with one click to see the extraction and classification in action.',
  },
  {
    q: 'What do the extracted entity fields mean?',
    a: 'What the NLP extraction step pulled out of the raw log text you submitted.',
    fields: [
      { term: 'Source IP', desc: 'The origin address the parser found in the log text.' },
      { term: 'Destination IP', desc: 'The target address the parser found in the log text.' },
      { term: 'Port / Proto', desc: 'The destination port and protocol mentioned in the log.' },
      { term: 'Target User', desc: 'The username referenced in the log, if any.' },
      { term: 'Failed Attempts', desc: 'How many failed authentication attempts the log text reports.' },
      { term: 'Action Status', desc: 'What the log said happened to the traffic — e.g. Blocked, Logged, Allowed.' },
    ],
  },
  {
    q: 'What happens after a log is parsed?',
    a: 'If the extracted entities match an attack pattern, a Classified Incident card appears with the attack type, severity, and risk score, and you can jump straight to its full dossier via "View Full Dossier".',
  },
];

export const ANALYTICS_FAQ = [
  {
    q: 'What is this page for?',
    a: 'Aggregate, big-data-style views over the full incident set — modeled on PySpark GroupBy-style aggregations — surfacing top attacking source IPs and top targeted ports.',
  },
  {
    q: 'What does the Top Attacking Source IPs table show?',
    a: 'Source addresses ranked by how much flagged traffic they have generated.',
    fields: [
      { term: 'Rank', desc: 'Position by total event count, highest first.' },
      { term: 'Source IP', desc: 'The external address generating the traffic.' },
      { term: 'Target Scope', desc: 'The geographic origin/region attributed to that IP.' },
      { term: 'Primary Threat', desc: 'The most common attack category associated with that source.' },
      { term: 'Packets', desc: 'Total packet count attributed to that source IP.' },
    ],
  },
  {
    q: 'What does the Top Targeted Destination Ports table show?',
    a: 'Destination ports ranked by how much traffic has targeted them.',
    fields: [
      { term: 'Port', desc: 'The destination port number receiving traffic.' },
      { term: 'Service', desc: 'The application typically running on that port (e.g. HTTP, SSH, DNS).' },
      { term: 'Risk Rating', desc: 'How sensitive that service is if compromised — Critical, High, or Medium.' },
      { term: 'Hits', desc: 'How many flows targeted that port.' },
    ],
  },
  {
    q: "Why 'PySpark-style'?",
    a: 'The aggregations mirror how this analysis would run in a distributed PySpark pipeline at production scale, even though the UI reads pre-aggregated results.',
  },
];

export const ARCHITECTURE_FAQ = [
  {
    q: 'What does this page describe?',
    a: 'The end-to-end ML pipeline — from raw UNSW-NB15 traffic through feature engineering, XGBoost multiclass classification, risk/severity scoring, to generative-AI explanation.',
  },
  {
    q: 'What do the 5 pipeline steps mean?',
    a: 'Each card is one stage the data passes through, left to right.',
    fields: [
      { term: '01 · Raw Traffic & Logs', desc: 'Ingests UNSW-NB15 CSV flow records and syslog text with Pandas/PySpark.' },
      { term: '02 · Feature Engineering', desc: 'One-hot encodes categorical fields and standard-scales the 194 numerical features.' },
      { term: '03 · XGBoost Multiclass', desc: 'Classifies each flow into one of 10 attack categories, or Normal.' },
      { term: '04 · Risk & Severity', desc: 'Turns the prediction into a 0–100 risk score weighted by port sensitivity and model confidence.' },
      { term: '05 · Generative AI', desc: 'Writes a plain-language incident summary and recommended SOC response steps.' },
    ],
  },
  {
    q: 'What does the Evaluated Machine Learning Models table show?',
    a: 'A side-by-side comparison of every model tried during development.',
    fields: [
      { term: 'Model Algorithm', desc: 'Logistic Regression, Random Forest, or the production XGBoost model.' },
      { term: 'Task Type', desc: 'The classification task it was evaluated on (10-category multiclass).' },
      { term: 'Accuracy / Precision / Recall / F1', desc: 'Standard classification metrics, weighted across all 10 attack categories.' },
      { term: 'Status', desc: 'Baseline, Evaluated, or PRODUCTION — which model is actually deployed.' },
    ],
  },
  {
    q: 'Why compare three models?',
    a: "To show why XGBoost was chosen for production — it's benchmarked here against a Logistic Regression baseline and a Random Forest model on the same 10-category multiclass task.",
  },
  {
    q: 'Are these real numbers?',
    a: 'Yes — accuracy, precision, recall, and F1 are measured results from the training notebook and evaluation report, not placeholders.',
  },
];
