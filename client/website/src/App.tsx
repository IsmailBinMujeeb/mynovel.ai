import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/auth.context";
import ProtectedRoute from "@/components/protectedRoute";
import IndexPage from "./pages";
import SignupPage from "./pages/signup";
import SigninPage from "./pages/signin";
import HomePage from "./pages/home";
import NewNovelPage from "./pages/NewNovel";
import OverviewPage from "./pages/overview";
import SettingsPage from "./pages/settings";
import ContextPage from "./pages/context";
import NewChapterPage from "./pages/newChapter";
import ReadNovelPage from "./pages/readNovel";
import ReadChapterPage from "./pages/readChapter";
import ChaptersPage from "./pages/chapters";
import EditChapterPage from "./pages/editChapter";
import NotFoundPage from "./pages/notFound";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/new/novel" element={<NewNovelPage />} />
            <Route path="/novel/overview/:novelId" element={<OverviewPage />} />
            <Route path="/novel/settings/:novelId" element={<SettingsPage />} />
            <Route path="/novel/context/:novelId" element={<ContextPage />} />
            <Route
              path="/novel/new-chapter/:novelId"
              element={<NewChapterPage />}
            />
            <Route path="/novel/read/:novelId" element={<ReadNovelPage />} />
            <Route path="/novel/chapters/:novelId" element={<ChaptersPage />} />
            <Route
              path="/novel/read-chapter/:novelId/:chapterId"
              element={<ReadChapterPage />}
            />
            <Route
              path="/novel/edit-chapter/:novelId/:chapterId"
              element={<EditChapterPage />}
            />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
