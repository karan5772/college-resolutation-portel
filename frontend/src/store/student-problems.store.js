import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useStudentStore = create((set, get) => ({
  problems: [],
  isLoading: false,
  isCreating: false,
  error: null,

  getProblems: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/student/allProblem");
      set({ problems: res.data.problems, error: null });
      const { problems } = get();
    } catch (error) {
      console.log("❌ Error reteriving problems:", error);
      set({ problems: null });
    } finally {
      set({ isLoading: false });
    }
  },

  createProblem: async (data) => {
    try {
      console.log(data);

      const res = await axiosInstance.post("/student/createProblem", data);
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error creating problem", error);
      toast.error("Error creating problem");
    }
  },
}));
