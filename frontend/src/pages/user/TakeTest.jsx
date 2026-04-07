
import { useLocation, useNavigate } from "react-router-dom";
import TestPage from "../../components/test/TestPage";
import { axiosInstance } from "../../lib/http";
import { schadenToast } from "@/components/schadenToast/ToastConfig.jsx";
import { useAuth } from "../../context/AuthContext";

const TakeTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const test = location.state?.test;
  const { user } = useAuth();

  if (!test) {
    // If no test data, redirect to dashboard
    navigate("/dashboard");
    return null;
  }


  const handleSubmit = async (answers) => {
    // answers: [{ sectionName, questions: [{ question, answer, userAnswer }] }]
    try {
      await axiosInstance.post("/test/submit", {
        userId: user?._id,
        answers
      });
      schadenToast.success("Test submitted successfully!", {
        description: "Your answers have been saved.",
      });
      navigate("/dashboard"); // Or show result page/modal
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to submit test. Please try again later.";
      schadenToast.error(msg, {
        description: "If the problem persists, contact support.",
      });
    }
  };

  return <TestPage test={test} onSubmit={handleSubmit} />;
};

export default TakeTest;
