import api from './api';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
const auth = getAuth();

export const AuthSDK = {
    login: async (email, password) => {
        try {
            const userData = await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
},
   signup: async (name,email,password)=>{
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            return response.user;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
   },
    logout: async () => {
        try {
            await signOut(auth);
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },
    me: async () => {
         try {
           const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
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