export default function BusinessCard({ biz, onClick }) {
    return (
<div
  onClick={() => onClick(biz)}
  className="cursor-pointer bg-zinc-900/80 hover:bg-zinc-800 transition-all p-5 rounded-xl shadow-md border border-zinc-700"
>
  <h2 className="text-xl font-bold text-cyan-400 mb-2">{biz.name}</h2>
  <p className="text-zinc-300 mb-3">{biz.description}</p>
  <div className="space-y-1 text-sm text-emerald-400">
    {biz.deals?.map((deal, i) => (
      <p key={i}>🎁 {deal}</p>
    ))}
  </div>
</div>

    );
}