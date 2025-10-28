import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useProfessorStore = create((set, get) => ({
  problems: [],
  isLoading: false,
  isUpdating: false,
  error: null,

  // Get all problems for professor review
  getProblems: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/professor");

      set({ problems: res.data.problems || res.data || [], error: null });
    } catch (error) {
      console.log("❌ Error retrieving problems:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to fetch problems";

      set({
        problems: [],
        error: errorMessage,
      });

      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  // Respond to a problem
  respondToProblem: async (problemId, data) => {
    set({ isUpdating: true });
    try {
      const res = await axiosInstance.post(
        `/professor/respondToProblemById/${problemId}`,
        { data }
      );

      toast.success("Response sent successfully");

      // Refresh problems after responding
      const { getProblems } = get();
      await getProblems();

      return res.data;
    } catch (error) {
      console.log("Error responding to problem:", error);
      const errorMessage =
        error.response?.data?.message || "Error sending response";

      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isUpdating: false });
    }
  },
}));
