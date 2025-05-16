import { Card } from "@/components/ui/card";

interface StatsCardProps {
  value: number | string;
  label: string;
  loading?: boolean;
}

export default function StatsCard({ value, label, loading = false }: StatsCardProps) {
  return (
    <Card className="bg-gray-50 p-6 text-center">
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <div className="h-8 w-16 bg-gray-200 rounded-md animate-pulse mb-2"></div>
          <div className="h-4 w-20 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      ) : (
        <>
          <p className="text-3xl font-bold text-primary mb-2">{value}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </>
      )}
    </Card>
  );
}
