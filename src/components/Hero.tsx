import { Play, FileText, Table2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GetStartedButton } from "@/components/ui/get-started-button";

export default function Hero() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 md:px-12 lg:px-16 py-24">
      <div className="max-w-5xl w-full">
        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-center">
          Automate your hiring stack — from Drive to Sheet.
        </h1>

        {/* Subtext */}
        <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed text-center">
          Upload shortlisted resumes, extract candidate data automatically, and
          sync to Google Sheets in seconds.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <GetStartedButton size="lg" />
          <Button variant="outline" size="lg">
            <Play className="w-4 h-4" />
            Watch Demo
          </Button>
        </div>

        {/* Screenshot Mock - Resume PDF → Spreadsheet */}
        <div className="relative mt-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {/* Resume PDF Card */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 w-full md:w-80 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-white" />
                <span className="text-white font-medium">Resume.pdf</span>
              </div>
              <div className="bg-white/5 rounded p-4 space-y-2">
                <div className="h-3 bg-white/20 rounded w-3/4"></div>
                <div className="h-3 bg-white/20 rounded w-1/2"></div>
                <div className="h-3 bg-white/20 rounded w-5/6"></div>
                <div className="h-3 bg-white/20 rounded w-2/3 mt-4"></div>
                <div className="h-3 bg-white/20 rounded w-4/5"></div>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:block">
              <ArrowRight className="w-8 h-8 text-white/50" />
            </div>
            <div className="md:hidden">
              <ArrowRight className="w-8 h-8 text-white/50 rotate-90" />
            </div>

            {/* Spreadsheet Card */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 w-full md:w-96 shadow-2xl">
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
                      <th className="p-2 text-left">Experience</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="p-2">John Doe</td>
                      <td className="p-2">john@email.com</td>
                      <td className="p-2">5 years</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="p-2">Jane Smith</td>
                      <td className="p-2">jane@email.com</td>
                      <td className="p-2">3 years</td>
                    </tr>
                    <tr>
                      <td className="p-2">Mike Johnson</td>
                      <td className="p-2">mike@email.com</td>
                      <td className="p-2">7 years</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
