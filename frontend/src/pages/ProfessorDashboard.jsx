import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/auth.store";
import { useProfessorStore } from "../store/professor-problems.store";
import {
  RefreshCw,
  LogOut,
  Menu,
  Search,
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Calendar,
  Eye,
  Send,
  X,
  Inbox,
  Star,
  Archive,
  Trash2,
  Settings,
  User,
  Mail,
  Flag,
  Plus,
  MoreHorizontal,
  ArrowLeft,
  ChevronDown,
  User2,
} from "lucide-react";
import toast from "react-hot-toast";
import ProfessorResponseModel from "../components/ProfessorResponseModel";

const ProfessorDashboard = () => {
  const { logout, authUser } = useAuthStore();
  const {
    problems,
    isLoading,
    getProblems,
    updateProblem,
    respondToProblem,
    isUpdating,
  } = useProfessorStore();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showRespondModal, setShowRespondModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  useEffect(() => {
    fetchProblems();
  }, [getProblems]);

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchProblems = async () => {
    try {
      await getProblems();
    } catch (error) {
      toast.error("Failed to fetch problems");
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProblems();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleViewDetails = (problem) => {
    setSelectedProblem(problem);
    setShowRespondModal(true);
  };

  const handleStatusUpdate = async (problemId, newStatus) => {
    try {
      await updateProblem(problemId, { status: newStatus });
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleSubmitResponse = async (responseText, status) => {
    if (!responseText.trim()) {
      toast.error("Please enter a response");
      return;
    }

    try {
      await Promise.all([
        respondToProblem(selectedProblem._id, responseText),
        status !== selectedProblem.status
          ? updateProblem(selectedProblem._id, { status })
          : Promise.resolve(),
      ]);

      setShowRespondModal(false);
      setSelectedProblem(null);
      toast.success("Response submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit response");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "RESOLVED":
        return "text-green-600 bg-green-50";
      case "INPROGRESS":
        return "text-blue-600 bg-blue-50";
      case "PENDING":
        return "text-orange-600 bg-orange-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "HIGH":
        return <Flag className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />;
      case "MEDIUM":
        return <Flag className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />;
      case "LOW":
        return <Flag className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />;
      default:
        return null;
    }
  };

  // Filter problems based on selected filter and search query
  const filteredProblems =
    problems?.filter((problem) => {
      const matchesFilter =
        selectedFilter === "all" ||
        (selectedFilter === "pending" && problem.status === "PENDING") ||
        (selectedFilter === "inprogress" && problem.status === "INPROGRESS") ||
        (selectedFilter === "resolved" && problem.status === "RESOLVED");

      const matchesSearch =
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (problem.createdBy?.name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    }) || [];

  // Calculate statistics
  const stats = {
    total: problems?.length || 0,
    pending: problems?.filter((p) => p.status === "PENDING").length || 0,
    inprogress: problems?.filter((p) => p.status === "INPROGRESS").length || 0,
    resolved: problems?.filter((p) => p.status === "RESOLVED").length || 0,
  };

  const sidebarItems = [
    { id: "all", label: "All Problems", icon: Inbox, count: stats.total },
    { id: "pending", label: "Pending", icon: Clock, count: stats.pending },
    {
      id: "inprogress",
      label: "In Progress",
      icon: AlertTriangle,
      count: stats.inprogress,
    },
    {
      id: "resolved",
      label: "Resolved",
      icon: CheckCircle,
      count: stats.resolved,
    },
  ];

  const toggleProblemSelection = (problemId) => {
    setSelectedProblems((prev) =>
      prev.includes(problemId)
        ? prev.filter((id) => id !== problemId)
        : [...prev, problemId]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 mr-2 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <img
                className="rounded-2xl"
                src="https://www.educatly.com/_next/image?url=https%3A%2F%2Fapi.educatly.com%2F%2Frails%2Factive_storage%2Fblobs%2FeyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBL0FHQ0E9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ%3D%3D--53e28a301f7944fce002eee3c82af751be769df0%2Fb_k_birla_institute_of_engineering_%26_technology_pilani_profile&w=1080&q=75"
                alt="BKBIET Logo"
              />
            </div>
            <h1 className="text-xl font-medium text-gray-900">
              Grevience Portel
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={logout}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <LogOut className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="lg:hidden px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 mr-2 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <img
                className="rounded-2xl"
                src="https://www.educatly.com/_next/image?url=https%3A%2F%2Fapi.educatly.com%2F%2Frails%2Factive_storage%2Fblobs%2FeyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBL0FHQ0E9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ%3D%3D--53e28a301f7944fce002eee3c82af751be769df0%2Fb_k_birla_institute_of_engineering_%26_technology_pilani_profile&w=1080&q=75"
                alt="BKBIET Logo"
              />
            </div>
            <h1 className="text-xl font-medium text-gray-900">
              BKBIET Grevience Portel
            </h1>
          </div>
        </div>

        {/* Desktop Search Bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search problems, students, or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-full text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Desktop User Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-600 ${
                isRefreshing || isLoading ? "animate-spin" : ""
              }`}
            />
          </button>
          <button
            onClick={logout}
            className="flex bg-blue-100 items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-blue-200 rounded-lg transition-colors"
          >
            <span className="hidden xl:block">Logout</span>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setMobileMenuOpen(false)}
            ></div>
            <div className="absolute left-0 top-0 h-full w-64 bg-white border-r border-gray-200 overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Menu</h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full py-3 px-4 font-medium transition-colors flex items-center justify-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>New Response</span>
                </button>
              </div>

              <nav className="px-2 pb-4">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = selectedFilter === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedFilter(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-left transition-colors mb-1 ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon
                          className={`w-5 h-5 ${
                            isActive ? "text-indigo-600" : "text-gray-500"
                          }`}
                        />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      {item.count > 0 && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            isActive
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="p-2 border-t border-gray-200">
                <button className="w-full flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings className="w-5 h-5 text-gray-500" />
                  <span className="text-sm">Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <div
          className={`hidden mt-2 lg:flex ${
            sidebarCollapsed ? "w-16" : "w-64"
          } bg-white border-r border-gray-200 transition-all duration-300 flex-col`}
        >
          <nav className="flex-1 px-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = selectedFilter === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedFilter(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors mb-1 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? "text-indigo-600" : "text-gray-500"
                      }`}
                    />
                    {!sidebarCollapsed && (
                      <span className="text-sm">{item.label}</span>
                    )}
                  </div>
                  {!sidebarCollapsed && item.count > 0 && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        isActive
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-2 border-t border-gray-200">
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <User2 className="w-5 h-5 text-gray-500" />
              {!sidebarCollapsed && (
                <span className="text-sm">{authUser.name}</span>
              )}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Filter Bar */}
          <div className="lg:hidden px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">
                  Filter:
                </span>
                <div className="flex space-x-2 overflow-x-auto">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedFilter(item.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                        selectedFilter === item.id
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {item.label} ({item.count})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Toolbar */}
          <div className="hidden lg:flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={
                  selectedProblems.length === filteredProblems.length &&
                  filteredProblems.length > 0
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedProblems(
                      filteredProblems.map((p) => p._id || p.id)
                    );
                  } else {
                    setSelectedProblems([]);
                  }
                }}
              />
              <span className="text-sm text-gray-600">
                {selectedProblems.length > 0
                  ? `${selectedProblems.length} selected`
                  : `${filteredProblems.length} problems`}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {selectedProblems.length > 0 && (
                <>
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <Archive className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <Trash2 className="w-4 h-4 text-gray-600" />
                  </button>
                </>
              )}
              <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                <Filter className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Problems List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <span className="ml-3 text-gray-600">Loading problems...</span>
              </div>
            ) : filteredProblems.length === 0 ? (
              <div className="text-center py-20 px-4">
                <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                  {searchQuery
                    ? "No matching problems found"
                    : "No problems found"}
                </h3>
                <p className="text-gray-500 text-sm">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "All student issues have been addressed."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredProblems.map((problem) => {
                  const isSelected = selectedProblems.includes(
                    problem._id || problem.id
                  );
                  const isUnread = !problem.response;

                  return (
                    <div
                      key={problem._id || problem.id}
                      className={`flex items-center px-3 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        isSelected ? "bg-indigo-50" : ""
                      }`}
                      onClick={() => handleViewDetails(problem)}
                    >
                      {/* Checkbox - Hidden on mobile */}
                      <div
                        className="hidden sm:block mr-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() =>
                            toggleProblemSelection(problem._id || problem.id)
                          }
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Priority/Star */}
                      <div className="mr-2 sm:mr-4">
                        <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                          {getPriorityIcon(problem.priority) || (
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
                          )}
                        </button>
                      </div>

                      {/* Problem Content */}
                      <div className="flex-1 min-w-0">
                        {/* Header Row */}
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                            <span
                              className={`text-xs sm:text-sm truncate ${
                                isUnread
                                  ? "font-semibold text-gray-900"
                                  : "font-normal text-gray-700"
                              }`}
                            >
                              {problem.createdBy?.name || "Student"}
                            </span>
                            <span
                              className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium shrink-0 ${getStatusColor(
                                problem.status
                              )}`}
                            >
                              {problem.status === "INPROGRESS"
                                ? "In Progress"
                                : problem.status}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 shrink-0 ml-2">
                            {formatDate(problem.createdAt)}
                          </span>
                        </div>

                        {/* Content Row */}
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1 mr-2">
                            <h3
                              className={`text-sm sm:text-base truncate ${
                                isUnread
                                  ? "font-semibold text-gray-900"
                                  : "font-normal text-gray-800"
                              }`}
                            >
                              {problem.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 truncate mt-0.5 sm:mt-1 line-clamp-2 sm:line-clamp-1">
                              {problem.description}
                            </p>
                          </div>

                          {/* Tags - Hidden on mobile */}
                          {problem.tags && problem.tags.length > 0 && (
                            <div className="hidden sm:flex space-x-1 ml-4 shrink-0">
                              {problem.tags.slice(0, 2).map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                              {problem.tags.length > 2 && (
                                <span className="text-xs text-gray-500">
                                  +{problem.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Mobile Tags */}
                        {problem.tags && problem.tags.length > 0 && (
                          <div className="sm:hidden flex flex-wrap gap-1 mt-2">
                            {problem.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {problem.tags.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{problem.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="ml-2 sm:ml-4 flex items-center space-x-1 shrink-0">
                        {problem.status === "PENDING" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(problem._id, "INPROGRESS");
                            }}
                            disabled={isUpdating}
                            className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-colors disabled:opacity-50"
                          >
                            <span className="hidden sm:inline">Review</span>
                            <span className="sm:hidden">📋</span>
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(problem);
                          }}
                          className="p-1.5 sm:p-2 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mobile Bottom Stats */}
          <div className="lg:hidden px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>{filteredProblems.length} problems</span>
              <div className="flex space-x-4">
                <span>Pending: {stats.pending}</span>
                <span>In Progress: {stats.inprogress}</span>
                <span>Resolved: {stats.resolved}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Response Modal */}
      <ProfessorResponseModel
        isOpen={showRespondModal}
        onClose={() => {
          setShowRespondModal(false);
          setSelectedProblem(null);
        }}
        problem={selectedProblem}
        onSubmit={handleSubmitResponse}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default ProfessorDashboard;
