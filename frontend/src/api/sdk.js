
import api from "./api";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
    updateProfile,
} from "firebase/auth";
import { auth } from "../firebase.js";

export const AuthSDK = {
  signup: async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      await updateProfile(user, {
        displayName: name,
      });
      await sendEmailVerification(user);
      await signOut(auth);

      return { message: "Verification email sent" };
    } catch (error) {
      throw new Error(error.message);
    }
  },
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,      
        email,
        password
      );

      const user = userCredential.user;
      await user.reload();

      if (!user.emailVerified) {
        await signOut(auth);
        throw new Error("Please verify your email before logging in");
      }

      const firebaseToken = await user.getIdToken(true);

      const response = await api.post("/auth/login", {
        firebaseToken,
      });

      localStorage.setItem("jwt", response.data.token);

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  logout: async () => {
    await signOut(auth);
    localStorage.removeItem("jwt");
  },
  me: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

export const ExpenseSDK ={
    getAll: async()=>{
        try{
            const response = await api.get('/expenses');
            return response.data;
        }catch(error){
            throw error.response ? error.response.data : error;
        }
    },
    create: async(data)=>{
        try{
            const response = await api.post('/expenses',data);
            return response.data;
        }catch(error){
        throw error.response ? error.response.data : error;
    }
},
    update: async(id,data)=>{
        try{
            const response = await api.put(`/expenses/${id}`,data);
            return response.data;
        }catch(error){
        throw error.response ? error.response.data : error;
    }
},
    delete: async(id)=>{
        try{
            await api.delete(`/expenses/${id}`);
        }catch(error){
        throw error.response ? error.response.data : error;
    }},
};
export const BudgetSDK ={
    getBudget: async()=>{
        try{
            const response = await api.get('/budget');
            return response.data;
        }catch(error){
            throw error.response ? error.response.data : error;
        }
    },
    updateBudget: async(amount)=>{
        try{
            const response = await api.put('/budget',{amount});
            return response.data;
        }catch(error){
            throw error.response ? error.response.data : error;
        }
    },
    setBudget: async(amount)=>{
        try{
            const response = await api.post('/budget',{amount});
            return response.data;
        }catch(error){
            throw error.response ? error.response.data : error;
        }
    },
}