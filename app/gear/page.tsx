export default function GearPage() {
  const gear = [
    { name: "La Sportiva Boots", category: "Footwear" },
    { name: "Arcteryx Alpha SV Jacket", category: "Clothing" },
    { name: "Black Diamond Crampons", category: "Hardware" },
  ];

  return (
    <main className="max-w-4xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-6">Gear Room</h1>
      <p className="mb-4 text-gray-700">Filterable list of all gear used on expeditions.</p>
      <ul className="space-y-4">
        {gear.map((item, idx) => (
          <li key={idx} className="p-4 border rounded shadow flex justify-between">
            <span>{item.name}</span>
            <span className="text-gray-500">{item.category}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}