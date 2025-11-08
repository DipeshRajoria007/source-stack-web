import { Table2 } from "lucide-react";

interface GoogleSheetsCardProps {
  className?: string;
  compact?: boolean;
}

export function GoogleSheetsCard({
  className = "",
  compact = false,
}: GoogleSheetsCardProps) {
  const data = [
    {
      name: "Rajesh Kumar",
      email: "rajesh.kumar@gmail.com",
      phone: "98765 43210",
    },
    {
      name: "Priya Sharma",
      email: "priya.sharma@yahoo.co.in",
      phone: "87654 32109",
    },
    {
      name: "Amit Patel",
      email: "amit.patel@outlook.com",
      phone: "76543 21098",
    },
  ];

  if (compact) {
    return (
      <div
        className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 ${className}`}
      >
        <div className="mb-3 flex items-center gap-2 pb-2 border-b border-white/20">
          <Table2 className="w-5 h-5 text-white" />
          <span className="text-white text-sm font-semibold">
            Google Sheets
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-white text-xs">
          <div className="bg-white/20 p-1.5 rounded text-center font-semibold text-[10px]">
            Name
          </div>
          <div className="bg-white/20 p-1.5 rounded text-center font-semibold text-[10px]">
            Email
          </div>
          <div className="bg-white/20 p-1.5 rounded text-center font-semibold text-[10px]">
            Phone
          </div>
          {data.map((row, index) => (
            <div key={index} className="contents">
              <div className="p-1.5 text-center text-[11px] truncate">
                {row.name}
              </div>
              <div className="p-1.5 text-center text-[11px] truncate">
                {row.email}
              </div>
              <div className="p-1.5 text-center text-[11px] truncate">
                {row.phone}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 w-full md:w-96 shadow-2xl transition-all duration-200 hover:bg-white/12 hover:border-white/30 ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <Table2 className="w-6 h-6 text-white" />
        <span className="text-white font-medium">Google Sheets</span>
      </div>
      <div className="bg-white/5 rounded overflow-hidden">
        <table className="w-full text-white text-xs">
          <thead>
            <tr className="border-b border-white/20">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Phone</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className={
                  index < data.length - 1 ? "border-b border-white/10" : ""
                }
              >
                <td className="p-2 truncate max-w-[120px]">{row.name}</td>
                <td className="p-2 truncate max-w-[180px]">{row.email}</td>
                <td className="p-2 truncate">{row.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
