import React, { useEffect, useState } from "react";
import {
  Send,
  X,
  User,
  FileText,
  Clock,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { useStudentStore } from "../store/student-problems.store";

const StudentProblemModal = ({ isOpen, onClose, problem, isSubmitting }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const { createProblem } = useStudentStore();

  useEffect(() => {
    if (problem) {
      setTitle(problem.title || "");
      setDescription(problem.description || "");
      setTags(problem.tags || []);
    } else {
      // New problem
      setTitle("");
      setDescription("");
      setTags([]);
    }
  }, [problem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      return;
    }

    const problemData = {
      title: title.trim(),
      description: description.trim(),
      tags: tags.filter((tag) => tag.trim() !== ""),
    };

    await createProblem(problemData);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "RESOLVED":
        return "text-green-700 bg-green-100";
      case "INPROGRESS":
        return "text-blue-700 bg-blue-100";
      case "PENDING":
        return "text-orange-700 bg-orange-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "text-red-600";
      case "MEDIUM":
        return "text-yellow-600";
      case "LOW":
        return "text-green-600";
      default:
        return "text-gray-400";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full h-full sm:max-w-4xl sm:max-h-[95vh] sm:h-auto overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <span className="font-medium text-gray-900 text-sm sm:text-base">
                {problem ? "Problem Details" : "Submit New Problem"}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Problem Header (for existing problems) */}
          {problem && (
            <div className="px-3 sm:px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 space-y-2 sm:space-y-0">
                <h1 className="text-lg sm:text-xl font-medium text-gray-900 flex-1 mr-0 sm:mr-4">
                  {problem.title}
                </h1>
                <div className="flex items-center space-x-2 shrink-0">
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(
                      problem.status
                    )}`}
                  >
                    {problem.status}
                  </span>
                </div>
              </div>

              {/* Student Info */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-gray-900 text-sm sm:text-base truncate block">
                      You
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-xs sm:text-sm">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{formatDate(problem.createdAt)}</span>
                </div>
              </div>

              {/* Tags */}
              {problem.tags && problem.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 sm:gap-2 mt-3">
                  {problem.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Problem Content */}
          <div className="flex-1 overflow-y-auto">
            {problem ? (
              // View Mode
              <div className="px-3 sm:px-6 py-4 sm:py-6">
                <div className="prose max-w-none">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                    {problem.description}
                  </p>
                </div>

                {/* Response Section */}
                {problem.response && (
                  <div className="mt-6 sm:mt-8 border-l-4 border-indigo-200 bg-indigo-50 p-3 sm:p-4 rounded-r-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-2 sm:mb-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                        <span className="font-medium text-indigo-900 text-sm sm:text-base">
                          Professor Response
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm text-indigo-600">
                        {formatDate(problem.updatedAt)}
                      </span>
                    </div>
                    <p className="text-indigo-800 leading-relaxed text-sm sm:text-base">
                      {problem.response}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Submit Mode
              <form onSubmit={handleSubmit} className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4">
                  {/* Title */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Problem Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Brief title describing your problem..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Problem Description *
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your problem in detail. Include what you're struggling with, what you've tried, and any specific questions you have..."
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                      required
                    />
                  </div>

                  {/* Tags */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (Optional)
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-indigo-600 hover:text-indigo-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Add a tag..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="border-t border-gray-200 bg-gray-50 px-3 sm:px-6 py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                    <div className="text-xs sm:text-sm text-gray-500">
                      {title.length > 0 && description.length > 0
                        ? "Ready to submit"
                        : "Please fill in all required fields"}
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={
                          isSubmitting || !title.trim() || !description.trim()
                        }
                        onClick={handleSubmit}
                        on
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Submit Problem</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProblemModal;
