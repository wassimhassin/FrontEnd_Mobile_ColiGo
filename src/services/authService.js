import axios from "axios";
import * as SecureStore from "expo-secure-store";


// For Android Emulator, use: http://10.0.2.2:8080
const USER_SERVICE_API_URL = "http://192.168.1.2:8085"
const AUTH_SERVICE_API_URL = "http://192.168.1.2:8080"
// const AUTH_SERVICE_API_URL = "http://172.20.10.14:8080"
// const USER_SERVICE_API_URL = "http://172.20.10.14:8085"

export const authService = {
  /**
   * GET USER PROFILE - Fetch current user data after login
   */
  async getUserProfile() {
    try {
      console.log("👤 Fetching user profile...");

      const response = await axios.get(
        `${USER_SERVICE_API_URL}/user/profile`,
        {
          withCredentials: true, // Important for session cookies
        }
      );

      console.log("✅ User profile fetched successfully");

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("❌ Failed to fetch user profile:", error.response?.data || error.message);

      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch user profile",
      };
    }
  },

  /**
   * LOGIN - Call REST API login endpoint
   */
  async login(username, password) {
    try {
      console.log("🔐 Attempting login...", username);

      // Call the new REST API login endpoint
      const response = await axios.post(
        `${AUTH_SERVICE_API_URL}/api/auth/login`,
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Important for session cookies
        }
      );

      console.log("✅ Login successful!");

      // Extract user data from response
      const userData = response.data.user;
      const sessionId = response.data.sessionId;

      // Store user data and authentication state
      await SecureStore.setItemAsync("user_data", JSON.stringify(userData));
      await SecureStore.setItemAsync("user_email", username);
      await SecureStore.setItemAsync("session_id", sessionId);
      await SecureStore.setItemAsync("is_logged_in", "true");

      return {
        success: true,
        message: response.data.message || "Login successful",
        user: userData,
      };
    } catch (error) {
      console.error("❌ Login failed:", error.response?.data || error.message);
      console.log("Full error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method,
        headers: error.response?.headers,
      });

      return {
        success: false,
        message: error.response?.data?.message || "Invalid credentials",
      };
    }
  },

  /**
     * REGISTER - Inscription utilisateur avec rôle CLIENT par défaut
     */
  async register(userData) {
    try {
      console.log('📝 Attempting registration...', userData.email);

      const response = await axios.post(
        `${USER_SERVICE_API_URL}/user/register`,
        {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          username: userData.email, // Email utilisé comme username
          password: userData.password,
          address: userData.address,
          roleName: userData.roleName, // Rôle par défaut statique
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ Registration successful!', response.data);

      return {
        success: true,
        message: response.data.message || 'Inscription réussie. Vérifiez votre email.',
        data: response.data.data,
      };
    } catch (error) {
      console.log('error', error)
      console.error('❌ Registration failed:', error.response?.data || error.message);

      let errorMessage = 'Échec de l\'inscription';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'Données invalides. Vérifiez vos informations.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Cet email est déjà utilisé.';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Erreur de connexion. Vérifiez votre réseau.';
      }

      return {
        success: false,
        message: errorMessage,
        error: error.response?.data,
      };
    }
  },

  /**
  * VERIFY ACCOUNT - Vérification du compte via token email
  */
  async verifyAccount(token) {
    try {
      const response = await axios.get(
        `${process.env.USER_SERVICE_API_URL}/user/verify/account?token=${token}`
      );

      return {
        success: true,
        message: response.data.message || 'Compte vérifié avec succès',
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Échec de la vérification',
      };
    }
  },

  /**
   * VERIFY CODE - Vérification du compte via code à 6 chiffres
   */
  async verifyCode(code) {
    try {
      console.log('🔐 Attempting code verification...', code);

      const response = await axios.post(
        `${USER_SERVICE_API_URL}/user/verify/code`,
        { code },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ Code verification successful!', response.data);

      return {
        success: true,
        message: response.data.message || 'Compte vérifié avec succès',
        data: response.data.data,
      };
    } catch (error) {
      console.error('❌ Code verification failed:', error.response?.data || error.message);

      return {
        success: false,
        message: error.response?.data?.message || 'Code de vérification invalide',
      };
    }
  },

  /**
   * RESEND CODE - Renvoyer le code de vérification
   */
  async resendCode(email) {
    try {
      console.log('🔄 Requesting new verification code...', email);

      const response = await axios.post(
        `${USER_SERVICE_API_URL}/user/resend/code`,
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ Code resent successfully!', response.data);

      return {
        success: true,
        message: response.data.message || 'Nouveau code envoyé',
        data: response.data.data,
      };
    } catch (error) {
      console.error('❌ Resend code failed:', error.response?.data || error.message);

      return {
        success: false,
        message: error.response?.data?.message || 'Impossible de renvoyer le code',
      };
    }
  },




  /**
   * LOGOUT - Clear session on backend and local storage
   */
  async logout() {
    try {
      console.log("🚪 Logging out...");

      // Call backend logout endpoint to clear session
      try {
        await axios.post(
          `${AUTH_SERVICE_API_URL}/api/auth/logout`,
          {},
          {
            withCredentials: true,
          }
        );
        console.log("✅ Backend session cleared");
      } catch (error) {
        console.warn("⚠️ Backend logout failed, clearing local data anyway", error.message);
      }

      // Clear all local storage
      await SecureStore.deleteItemAsync("user_email");
      await SecureStore.deleteItemAsync("user_data");
      await SecureStore.deleteItemAsync("session_id");
      await SecureStore.deleteItemAsync("is_logged_in");

      console.log("✅ Logout successful");
      return { success: true };
    } catch (error) {
      console.error("❌ Logout error:", error);
      return { success: false };
    }
  },

  /**
   * FORGOT PASSWORD - Request password reset
   */
  async forgotPassword(email) {
    try {
      console.log("📧 Requesting password reset for:", email);

      const response = await axios.post(
        `${USER_SERVICE_API_URL}/user/password/reset/request`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Password reset email sent");

      return {
        success: true,
        message: response.data.message || "Email de réinitialisation envoyé",
      };
    } catch (error) {
      console.error("❌ Password reset request failed:", error.response?.data || error.message);

      return {
        success: false,
        error: error.response?.data?.message || "Échec de l'envoi de l'email",
      };
    }
  },

  /**
   * CHECK IF USER IS LOGGED IN
   */
  async isLoggedIn() {
    try {
      const isLoggedIn = await SecureStore.getItemAsync("is_logged_in");
      return isLoggedIn === "true";
    } catch (error) {
      return false;
    }
  },
};
