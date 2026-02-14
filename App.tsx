import "./global.css";
import React, { useEffect } from "react";
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

  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();

  // Check auth on app start
  useEffect(() => {
    checkAuth();
  }, []);

  // Screen navigation handlers
  const handleSplashFinish = () => {
    if (isAuthenticated) {
      setScreen("home");
    } else {
      setScreen("onboarding");
    }
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

  const handleRoleSelect = (
    role: (typeof USER_ROLES)[keyof typeof USER_ROLES],
  ) => {
    setSelectedRole(role);
    setScreen("login");
  };

  const handleLoginSuccess = () => {
    setScreen("home");
  };

  const handleRegisterSuccess = () => {
    setScreen("home");
  };

  const handleForgotPassword = (email: string) => {
    console.log("Reset password for:", email);
  };

  const handleLogout = async () => {
    await logout();
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
            onForgotPassword={() => setScreen("forgot_password")}
            onRegister={() => setScreen("register")}
            onBack={() => setScreen("role_selection")}
            onSuccess={handleLoginSuccess}
          />
        );

      case "register":
        return (
          <RegisterScreen
            onLogin={() => setScreen("login")}
            onBack={() => setScreen("login")}
            onSuccess={handleRegisterSuccess}
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
      <SafeAreaProvider>{renderScreen()}</SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
