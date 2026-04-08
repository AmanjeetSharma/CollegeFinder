import { Dialog, DialogContent } from "../../ui/dialog";
import { FaWandMagicSparkles } from "react-icons/fa6";
import "./TestLoader.css";

const TestLoader = ({ open }) => (
  <Dialog open={open}>
    <DialogContent className="flex flex-col items-center justify-center gap-4 max-w-sm border-0 bg-slate-900 shadow-none p-6">
      <div className="text-slate-200 text-base font-medium mb-2">
        <FaWandMagicSparkles className="inline-block w-6 h-6 mr-2 text-purple-300" />
        Test is being generated...
      </div>
      <div className="loader-wrapper">
        <span className="loader-letter">G</span>
        <span className="loader-letter">e</span>
        <span className="loader-letter">n</span>
        <span className="loader-letter">e</span>
        <span className="loader-letter">r</span>
        <span className="loader-letter">a</span>
        <span className="loader-letter">t</span>
        <span className="loader-letter">i</span>
        <span className="loader-letter">n</span>
        <span className="loader-letter">g</span>
        <div className="loader"></div>
      </div>
      <div className="text-slate-300 text-sm text-center">
        Please wait while we generate your personalized test.
      </div>
    </DialogContent>
  </Dialog>
);

export default TestLoader;