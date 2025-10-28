import React, { useEffect, useState } from "react";
import { useProfessorStore } from "../store/professor-problems.store";
import {
  Send,
  X,
  Calendar,
  User,
  FileText,
  Tag,
  AlertCircle,
  Mail,
  Clock,
  ArrowLeft,
  Star,
  Archive,
  Trash2,
  Forward,
  Reply,
  MoreHorizontal,
  CheckCircle,
  Menu,
  IdCard,
} from "lucide-react";

const ProfessorResponseModel = ({ isOpen, onClose, problem }) => {
  const { respondToProblem, isUpdating } = useProfessorStore();
  const [responseText, setResponseText] = useState("");
  const [status, setStatus] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (problem) {
      setResponseText(problem.response || "");
      setSelectedStatus(problem.status || "PENDING");
      // Auto-open compose if no response exists
      setIsComposing(!problem.response);
    }
  }, [problem]);

  // Handle response submission
  const handleSubmit = async (customResponse = null) => {
    const finalResponse =
      customResponse !== null ? customResponse : responseText;
    const data = {
      response: finalResponse,
      status: selectedStatus,
    };
    try {
      await respondToProblem(problem._id, data);
      setIsComposing(false);
    } catch (error) {
      console.log("Submit error:", error);
    }
  };

  // Handle status updates only
  const handleStatusUpdate = (newStatus) => {
    setSelectedStatus(newStatus);
  };

  // Handle combined response + status update
  const handleResponseWithStatus = async (responseText, newStatus) => {
    try {
      const data = {
        response: responseText,
        status: newStatus,
      };

      await respondToProblem(problem._id, data);
      setIsComposing(false);
    } catch (error) {
      console.log("Combined update error:", error);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.ctrlKey &&
        e.key === "Enter" &&
        isComposing &&
        responseText.trim()
      ) {
        e.preventDefault();
        handleSubmit();
      }
      // Close sidebar with Escape on mobile
      if (e.key === "Escape" && showSidebar) {
        setShowSidebar(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, isComposing, responseText, showSidebar]);

  const handleClose = () => {
    setResponseText(problem?.response || "");
    setStatus(problem?.status || "PENDING");

    setSelectedStatus(problem?.status || "PENDING");
    setIsComposing(false);
    setShowSidebar(false);
    onClose();
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

  if (!isOpen || !problem) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full h-full sm:max-w-6xl sm:max-h-[95vh] sm:h-auto overflow-hidden flex flex-col">
        {/* Gmail-style Header */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <span className="font-medium text-gray-900 text-sm sm:text-base">
                Problem Details
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Menu className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex relative">
          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Problem Header */}
            <div className="px-3 sm:px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 space-y-2 sm:space-y-0">
                <h1 className="text-lg sm:text-xl font-medium text-gray-900 flex-1 mr-0 sm:mr-4">
                  {problem.title}
                </h1>
                <div className="flex items-center space-x-2 shrink-0">
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(
                      status
                    )}`}
                  >
                    {status}
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
                      {problem.createdBy?.name}
                    </span>
                    {problem.createdBy?.sid && (
                      <span className="text-gray-500 text-xs sm:text-sm truncate block">
                        {problem.createdBy?.sid}
                      </span>
                    )}
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

            {/* Message Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-3 sm:px-6 py-4 sm:py-6">
                <div className="prose max-w-none">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                    {problem.description}
                  </p>
                </div>

                {/* Existing Response */}
                {problem.response && (
                  <div className="mt-6 sm:mt-8 border-l-4 border-indigo-200 bg-indigo-50 p-3 sm:p-4 rounded-r-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-2 sm:mb-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                        <span className="font-medium text-indigo-900 text-sm sm:text-base">
                          Your Response
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
            </div>

            {/* Reply Section */}
            <div className="border-t border-gray-200 bg-gray-50">
              {!isComposing ? (
                <div className="px-3 sm:px-6 py-4">
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={() => setIsComposing(true)}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
                    >
                      <Reply className="w-4 h-4" />
                      <span>
                        {problem.response ? "Update Response" : "Reply"}
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-3 sm:px-6 py-4 bg-white border-t border-gray-200">
                  {/* Status Selector */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => handleStatusUpdate(e.target.value)}
                      disabled={isUpdating}
                      className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="INPROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>
                  </div>

                  {/* Compose Area */}
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    {/* Compose Header */}
                    <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-gray-50 border-b border-gray-200">
                      <span className="text-xs sm:text-sm text-gray-600 truncate">
                        Response to {problem.createdBy?.name}
                      </span>
                      <button
                        onClick={() => {
                          setIsComposing(false);
                          setResponseText(problem.response || "");
                          setStatus(problem.status || "PENDING");
                        }}
                        className="p-1 hover:bg-gray-200 rounded shrink-0"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>

                    {/* Text Area */}
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Write your response here... Be clear, helpful, and professional."
                      rows={6}
                      className="w-full px-3 sm:px-4 py-3 border-0 resize-none focus:outline-none text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                      autoFocus
                    />

                    {/* Compose Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-3 sm:px-4 py-3 bg-gray-50 border-t border-gray-200 space-y-3 sm:space-y-0">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                        <button
                          onClick={() => handleSubmit()}
                          disabled={isUpdating || !responseText.trim()}
                          className="flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        >
                          {isUpdating ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>Send Response</span>
                            </>
                          )}
                        </button>

                        {/* Combined Response + Status Button */}
                        {status !== problem.status && responseText.trim() && (
                          <button
                            onClick={() =>
                              handleResponseWithStatus(
                                responseText,
                                selectedStatus
                              )
                            }
                            disabled={isUpdating}
                            className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                          >
                            {isUpdating ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                <span>Updating...</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                <span className="hidden sm:inline">
                                  Send & Update Status
                                </span>
                                <span className="sm:hidden">Send & Update</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Character Count */}
                      <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-right">
                        {responseText.length} characters
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Desktop */}
          <div className="hidden lg:block w-80 border-l border-gray-200 bg-gray-50 p-4">
            <h3 className="font-medium text-gray-900 mb-4">Problem Details</h3>

            <div className="space-y-4">
              {/* Status Card */}
              <div className="bg-white rounded-lg p-3 border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Current Status
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      status
                    )}`}
                  >
                    {status}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Last updated:{" "}
                  {formatDate(problem.updatedAt || problem.createdAt)}
                </p>
              </div>

              {/* Student Info Card */}
              <div className="bg-white rounded-lg p-3 border">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Student Information
                </h4>
                <div className="space-y-2 text-gray-900">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 " />
                    <span className="text-sm ">{problem.createdBy?.name}</span>
                  </div>
                  {problem.createdBy?.sid && (
                    <div className="flex items-center space-x-2">
                      <IdCard className="w-4 h-4 " />
                      <span className="text-sm ">{problem.createdBy?.sid}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 " />
                    <span className="text-sm ">
                      {new Date(problem.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Status Actions */}
              <div className="bg-white rounded-lg p-3 border">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Quick Status Updates
                </h4>
                <div className="space-y-2">
                  {status !== "INPROGRESS" && (
                    <button
                      onClick={() => handleStatusUpdate("INPROGRESS")}
                      disabled={isUpdating}
                      className="w-full px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded border hover:bg-blue-100 transition-colors disabled:opacity-50"
                    >
                      {isUpdating ? "Updating..." : "Mark as In Progress"}
                    </button>
                  )}

                  {status !== "RESOLVED" && (
                    <button
                      onClick={() => handleStatusUpdate("RESOLVED")}
                      disabled={isUpdating}
                      className="w-full px-3 py-2 text-sm bg-green-50 text-green-700 rounded border hover:bg-green-100 transition-colors disabled:opacity-50"
                    >
                      {isUpdating ? "Updating..." : "Mark as Resolved"}
                    </button>
                  )}

                  {status !== "PENDING" && (
                    <button
                      onClick={() => handleStatusUpdate("PENDING")}
                      disabled={isUpdating}
                      className="w-full px-3 py-2 text-sm bg-orange-50 text-orange-700 rounded border hover:bg-orange-100 transition-colors disabled:opacity-50"
                    >
                      {isUpdating ? "Updating..." : "Mark as Pending"}
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg p-3 border">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setIsComposing(!isComposing)}
                    className="w-full px-3 py-2 text-sm bg-indigo-50 text-indigo-700 rounded border hover:bg-indigo-100 transition-colors"
                  >
                    {isComposing ? "Cancel Reply" : "Compose Reply"}
                  </button>

                  <button
                    onClick={() => handleSubmit(responseText)}
                    disabled={isUpdating || !responseText.trim()}
                    className="w-full px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded border hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? "Saving..." : "Send Current Response"}
                  </button>
                </div>
              </div>

              {/* Problem Stats */}
            </div>
          </div>

          {/* Mobile Sidebar Overlay */}
          {showSidebar && (
            <div className="lg:hidden fixed inset-0 z-50">
              <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={() => setShowSidebar(false)}
              ></div>
              <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-gray-50 p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Problem Details</h3>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Mobile Status Card */}
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Current Status
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Last updated:{" "}
                      {formatDate(problem.updatedAt || problem.createdAt)}
                    </p>
                  </div>

                  {/* Mobile Student Info */}
                  <div className="bg-white rounded-lg p-3 border">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Student Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-900 truncate">
                          {problem.createdBy?.name ||
                            problem.student?.name ||
                            "Student"}
                        </span>
                      </div>
                      {(problem.createdBy?.email || problem.student?.email) && (
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600 truncate">
                            {problem.createdBy?.email || problem.student?.email}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile Quick Actions */}
                  <div className="bg-white rounded-lg p-3 border">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Quick Status Updates
                    </h4>
                    <div className="space-y-2">
                      {status !== "INPROGRESS" && (
                        <button
                          onClick={() => {
                            handleStatusUpdate("INPROGRESS");
                            setShowSidebar(false);
                          }}
                          disabled={isUpdating}
                          className="w-full px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded border hover:bg-blue-100 transition-colors disabled:opacity-50"
                        >
                          {isUpdating ? "Updating..." : "Mark as In Progress"}
                        </button>
                      )}

                      {status !== "RESOLVED" && (
                        <button
                          onClick={() => {
                            handleStatusUpdate("RESOLVED");
                            setShowSidebar(false);
                          }}
                          disabled={isUpdating}
                          className="w-full px-3 py-2 text-sm bg-green-50 text-green-700 rounded border hover:bg-green-100 transition-colors disabled:opacity-50"
                        >
                          {isUpdating ? "Updating..." : "Mark as Resolved"}
                        </button>
                      )}

                      {status !== "PENDING" && (
                        <button
                          onClick={() => {
                            handleStatusUpdate("PENDING");
                            setShowSidebar(false);
                          }}
                          disabled={isUpdating}
                          className="w-full px-3 py-2 text-sm bg-orange-50 text-orange-700 rounded border hover:bg-orange-100 transition-colors disabled:opacity-50"
                        >
                          {isUpdating ? "Updating..." : "Mark as Pending"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessorResponseModel;
