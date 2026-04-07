import { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/http";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


import { useAuth } from "../../context/AuthContext";

const AllTests = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;
    setLoading(true);
    axiosInstance.get(`/test/user/${user._id}`)
      .then(res => setTests(res.data.tests))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user?._id) return null;

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (selected) {
    const test = tests.find(t => t._id === selected);
    if (!test) return null;
    const totalQuestions = test.sections.reduce((sum, s) => sum + s.questions.length, 0);
    const correct = test.sections.reduce((sum, s) => sum + s.questions.filter(q => q.userAnswer === q.correctAnswer).length, 0);
    const wrong = totalQuestions - correct;
    return (
      <div className="p-4">
        <Button variant="outline" onClick={() => setSelected(null)} className="mb-4">Back to All Tests</Button>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Test Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div>Total Questions: <b>{totalQuestions}</b></div>
            <div>Correct: <b className="text-green-600">{correct}</b></div>
            <div>Wrong: <b className="text-red-600">{wrong}</b></div>
            <div>Date: {new Date(test.createdAt).toLocaleString()}</div>
          </CardContent>
        </Card>
        {test.sections.map((section, sIdx) => (
          <div key={sIdx} className="mb-6">
            <h3 className="font-semibold mb-2">Section: {section.sectionName}</h3>
            {section.questions.map((q, qIdx) => (
              <Card key={qIdx} className="mb-3">
                <CardContent>
                  <div className="mb-1 font-medium">Q{qIdx + 1}. {q.question}</div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {q.options.map((opt, oIdx) => (
                      <Badge key={oIdx} className={
                        opt === q.userAnswer ? "bg-blue-200 text-blue-900 border-blue-400" :
                        opt === q.correctAnswer ? "bg-green-200 text-green-900 border-green-400" :
                        "bg-gray-100 text-gray-700 border-gray-300"
                      }>
                        {opt}
                        {opt === q.correctAnswer && <span className="ml-1">(Correct)</span>}
                        {opt === q.userAnswer && <span className="ml-1">(Your Answer)</span>}
                      </Badge>
                    ))}
                  </div>
                  {q.userAnswer === q.correctAnswer ? (
                    <span className="text-green-600 font-semibold">Correct</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Wrong</span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">All Tests</h2>
      {tests.length === 0 && <div>No tests found.</div>}
      {tests.map((test, idx) => (
        <Card key={test._id} className="mb-3 cursor-pointer hover:shadow-lg" onClick={() => setSelected(test._id)}>
          <CardContent className="flex justify-between items-center">
            <div>
              <div className="font-semibold">Test {idx + 1}</div>
              <div className="text-gray-500 text-sm">{new Date(test.createdAt).toLocaleString()}</div>
            </div>
            <div className="text-lg font-bold">{test.totalScore}%</div>
            <Button variant="secondary" size="sm">View</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AllTests;
