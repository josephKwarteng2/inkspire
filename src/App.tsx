import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

import AppRoutes from "@/routes/index";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserRoleProvider } from "@/context/UserRoleContext";
import "./App.css";
import { Toaster } from "sonner";

function App() {
  return (
    <UserRoleProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AppRoutes />
          <Toaster richColors position="top-right" />
        </QueryClientProvider>
      </ThemeProvider>
    </UserRoleProvider>
  );
}

export default App;
