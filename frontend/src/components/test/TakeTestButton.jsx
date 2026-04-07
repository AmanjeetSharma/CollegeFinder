import { Button } from "../ui/button";

const TakeTestButton = ({ onClick }) => (
  <Button
    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow hover:from-blue-600 hover:to-blue-800 transition"
    onClick={onClick}
  >
    Take Test
  </Button>
);

export default TakeTestButton;
