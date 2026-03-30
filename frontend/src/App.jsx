// App.jsx
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layouts/Navbar";
import ScrollToTop from "./components/layouts/ScrollToTop";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { PasswordProvider } from "./context/PasswordContext";
import { CollegeProvider } from "./context/CollegeContext";
import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <AuthProvider>
                <UserProvider>
                    <PasswordProvider>
                        <CollegeProvider>

                            <div className="min-h-screen bg-gray-50">
                                <Navbar />
                                <main>
                                    <AppRoutes />
                                </main>
                                <Toaster
                                    richColors={false}
                                    closeButton
                                    position="top-center"
                                    expand={false}
                                    visibleToasts={3}
                                    toastOptions={{
                                        className: "schaden-toast",
                                        duration: 4000,
                                    }}
                                />
                            </div>
                        </CollegeProvider>
                    </PasswordProvider>
                </UserProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;