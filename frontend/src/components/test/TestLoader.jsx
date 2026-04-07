import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Loader2 } from "lucide-react";

const TestLoader = ({ open }) => (
  <Dialog open={open}>
    <DialogContent className="flex flex-col items-center justify-center gap-4 max-w-xs">
      <DialogHeader>
        <DialogTitle>Generating Your Test</DialogTitle>
      </DialogHeader>
      <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      <div className="text-gray-600 text-center">
        Please wait while we generate your personalized test.<br />
        This may take a few moments...
      </div>
    </DialogContent>
  </Dialog>
);

export default TestLoader;
