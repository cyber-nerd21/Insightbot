export default function Sidebar({ docId, activeTab, setActiveTab }: any) {
  return (
    <div style={{ width: "260px", background: "var(--sidebar)", borderRight: "1px solid var(--border)" }}>
      <p className="p-4 font-semibold">InsightBot</p>
    </div>
  );
}