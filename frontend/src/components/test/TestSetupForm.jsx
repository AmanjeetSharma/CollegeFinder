import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";

const classOptions = [
  "8", "9", "10", "11", "12"
];

const interestSuggestions = [
  "Mathematics", "Science", "English", "Art", "Technology", "Sports", "Music", "Coding", "Robotics", "Business"
];

const TestSetupForm = ({ open, onClose, onSubmit }) => {
  const [studentClass, setStudentClass] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [interests, setInterests] = useState([]);
  const [error, setError] = useState("");

  const handleAddInterest = () => {
    const trimmed = interestInput.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
      setInterestInput("");
    }
  };

  const handleRemoveInterest = (interest) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentClass || interests.length === 0) {
      setError("Please select a class and at least one interest.");
      return;
    }
    setError("");
    onSubmit({ studentClass, interests });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Start a New Test</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="class">Class</Label>
            <select
              id="class"
              className="w-full border rounded px-3 py-2 mt-1"
              value={studentClass}
              onChange={e => setStudentClass(e.target.value)}
              required
            >
              <option value="">Select Class</option>
              {classOptions.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="interest">Interests</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="interest"
                placeholder="Type and press Enter"
                value={interestInput}
                onChange={e => setInterestInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddInterest();
                  }
                }}
                className="flex-1"
              />
              <Button type="button" onClick={handleAddInterest} variant="secondary">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {interests.map(interest => (
                <Badge key={interest} className="cursor-pointer" onClick={() => handleRemoveInterest(interest)}>
                  {interest} <span className="ml-1">×</span>
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {interestSuggestions.filter(s => !interests.includes(s)).map(s => (
                <Badge key={s} variant="outline" className="cursor-pointer" onClick={() => {
                  setInterests([...interests, s]);
                }}>{s}</Badge>
              ))}
            </div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Generate Test</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TestSetupForm;
