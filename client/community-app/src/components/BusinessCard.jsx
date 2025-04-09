export default function BusinessCard({ biz, onClick }) {
    return (
        <div onClick={() => onClick(biz)} className="p-4 border rounded shadow hover:bg-gray-100 cursor-pointer">
            <h2 className="text-xl font-bold">{biz.name}</h2>
            <p>{biz.description}</p>
            {biz.deals?.map((deal, i) => (
                <p key={i}>🎁 {deal}</p>
            ))}
        </div>
    );
}