import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatDateToLocal, formatDaysFromNow, getInitials } from "@/lib/utils";
import { Link } from "wouter";

interface OccasionTableProps {
  occasions: any[];
  loading?: boolean;
}

export default function OccasionTable({ occasions, loading = false }: OccasionTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recipient</TableHead>
                <TableHead>Occasion</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center space-x-3 animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                      <div>
                        <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 w-16 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  <TableCell>
                    <div className="h-4 w-32 bg-gray-200 rounded mb-1 animate-pulse"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell><div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  <TableCell><div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (occasions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <i className="ri-calendar-event-line text-2xl text-gray-400"></i>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming occasions</h3>
        <p className="text-gray-500">Add special dates for your recipients to get reminders about upcoming gift opportunities.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recipient</TableHead>
              <TableHead>Occasion</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {occasions.map((occasion) => {
              const daysFromNow = formatDaysFromNow(occasion.date);
              const isPast = new Date(occasion.date) < new Date();
              const isUrgent = !isPast && daysFromNow.includes("In") && parseInt(daysFromNow.split(" ")[1]) <= 14;

              return (
                <TableRow key={occasion.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        <div className="absolute inset-0 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                          {getInitials(occasion.recipient.name)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{occasion.recipient.name}</div>
                        <div className="text-sm text-gray-500">{occasion.recipient.relationship}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{occasion.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{formatDateToLocal(occasion.date)}</div>
                    <div className={`text-xs ${isUrgent ? 'text-primary' : 'text-gray-500'}`}>{daysFromNow}</div>
                  </TableCell>
                  <TableCell>
                    {occasion.status === "gift_selected" ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Gift selected
                      </span>
                    ) : occasion.status === "needs_gift" || isUrgent ? (
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        Needs gift
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        Not started
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/recipients/${occasion.recipient.id}`}>
                        <a className="text-secondary hover:text-secondary-700 text-sm font-medium">
                          View suggestions
                        </a>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
