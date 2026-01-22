import "./global.css";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAppStore, useAuthStore } from "./src/store";
import { USER_ROLES } from "./src/constants";
import {
  SplashScreen,
  OnboardingScreen,
  TermsScreen,
  RoleSelectionScreen,
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  HomeScreen,
} from "./src/screens";

export default function App() {
  const {
    currentScreen,
    selectedRole,
    setScreen,
    completeOnboarding,
    acceptTerms,
    setSelectedRole,
  } = useAppStore();

  const { user, isAuthenticated, login, logout } = useAuthStore();

  // Screen navigation handlers
  const handleSplashFinish = () => {
    setScreen("onboarding");
  };

  const handleOnboardingComplete = () => {
    setScreen("terms");
  };

  const handleTermsAccept = () => {
    acceptTerms();
    setScreen("role_selection");
  };

  const handleTermsDecline = () => {
    setScreen("onboarding");
  };

  const handleRoleSelect = (role: typeof USER_ROLES[keyof typeof USER_ROLES]) => {
    setSelectedRole(role);
    setScreen("login");
  };

  const handleLogin = (email: string, password: string) => {
    // Simulate login - replace with actual API call
    const mockUser = {
      id: "1",
      email,
      firstName: "Jean",
      lastName: "Dupont",
      role: selectedRole || USER_ROLES.CLIENT,
      kycVerified: false,
      createdAt: new Date().toISOString(),
    };
    login(mockUser, "mock-token");
    setScreen("home");
  };

  const handleRegister = (data: any) => {
    // Simulate registration - replace with actual API call
    const mockUser = {
      id: "1",
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: selectedRole || USER_ROLES.CLIENT,
      kycVerified: false,
      createdAt: new Date().toISOString(),
    };
    login(mockUser, "mock-token");
    setScreen("home");
  };

  const handleForgotPassword = (email: string) => {
    console.log("Reset password for:", email);
  };

  const handleLogout = () => {
    logout();
    setScreen("login");
  };

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case "splash":
        return <SplashScreen onFinish={handleSplashFinish} />;

      case "onboarding":
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;

      case "terms":
        return (
          <TermsScreen
            onAccept={handleTermsAccept}
            onDecline={handleTermsDecline}
          />
        );

      case "role_selection":
        return (
          <RoleSelectionScreen
            onSelectRole={handleRoleSelect}
            onBack={() => setScreen("terms")}
          />
        );

      case "login":
        return (
          <LoginScreen
            onLogin={handleLogin}
            onForgotPassword={() => setScreen("forgot_password")}
            onRegister={() => setScreen("register")}
            onBack={() => setScreen("role_selection")}
          />
        );

      case "register":
        return (
          <RegisterScreen
            selectedRole={selectedRole || USER_ROLES.CLIENT}
            onRegister={handleRegister}
            onLogin={() => setScreen("login")}
            onBack={() => setScreen("login")}
          />
        );

      case "forgot_password":
        return (
          <ForgotPasswordScreen
            onSubmit={handleForgotPassword}
            onBack={() => setScreen("login")}
          />
        );

      case "home":
        return (
          <HomeScreen
            userName={user?.firstName || "Utilisateur"}
            userRole={user?.role || "client"}
            onLogout={handleLogout}
          />
        );

      default:
        return <SplashScreen onFinish={handleSplashFinish} />;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {renderScreen()}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
