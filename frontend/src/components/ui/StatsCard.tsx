interface StatsCardProps {
  title: string;
  subtitle: string;
  quantity: number | string;
}

export const StatsCard = ({title, subtitle, quantity}: StatsCardProps) => {
  return (
    <div
      className="flex w-full flex-col p-4 justify-center items-center gap-2 bg-white/90 hover:-translate-y-1 shadow-2xl rounded transition">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500">
        {subtitle}: <span className="font-bold text-amber-600">{quantity}</span>
      </p>
    </div>
  )
}