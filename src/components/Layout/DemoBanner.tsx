import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export const DemoBanner = () => {
  return (
    <Alert className="mb-4 bg-blue-50 border-blue-200">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <strong>Demo Mode:</strong> You're viewing a demo version. Login with{" "}
        <code className="px-1 py-0.5 bg-blue-100 rounded">admin@demo.com / admin</code> or{" "}
        <code className="px-1 py-0.5 bg-blue-100 rounded">student@demo.com / student</code>
        . All data is stored locally and will reset on page refresh.
      </AlertDescription>
    </Alert>
  );
};
