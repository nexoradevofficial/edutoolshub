import { lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";

const Tools = lazy(() => import("./pages/Tools"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const GpaCalculatorPage = lazy(() => import("./pages/GpaCalculatorPage"));
const GpaRequirementCheckerPage = lazy(() => import("./pages/GpaRequirementCheckerPage"));
const UniversityDetailPage = lazy(() => import("./pages/UniversityDetailPage"));
const AttendancePage = lazy(() => import("./pages/AttendancePage"));
const ExamMarksNeededPage = lazy(() => import("./pages/ExamMarksNeededPage"));
const GpaToPercentagePage = lazy(() => import("./pages/GpaToPercentagePage"));
const LessonPlannerPage = lazy(() => import("./pages/LessonPlannerPage"));
const FeeReceiptPage = lazy(() => import("./pages/FeeReceiptPage"));
const AdminUniversitiesPage = lazy(() => import("./pages/AdminUniversitiesPage"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

function RedirectUniversityDetail() {
  const { slug } = useParams();
  return (
    <Navigate
      to={`/tools/college-university-gpa-requirement-checker/${slug}`}
      replace
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="tools" element={<Tools />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="tools/gpa-calculator" element={<GpaCalculatorPage />} />
          <Route
            path="tools/college-university-gpa-requirement-checker"
            element={<GpaRequirementCheckerPage />}
          />
          <Route
            path="tools/college-university-gpa-requirement-checker/:slug"
            element={<UniversityDetailPage />}
          />
          <Route path="tools/attendance-sheet" element={<AttendancePage />} />
          <Route path="tools/final-grade-calculator" element={<ExamMarksNeededPage />} />
          <Route
            path="tools/gpa-requirement-checker"
            element={
              <Navigate to="/tools/college-university-gpa-requirement-checker" replace />
            }
          />
          <Route
            path="tools/gpa-requirement-checker/:slug"
            element={<RedirectUniversityDetail />}
          />
          <Route
            path="tools/exam-marks-needed"
            element={<Navigate to="/tools/final-grade-calculator" replace />}
          />
          <Route path="tools/gpa-to-percentage" element={<GpaToPercentagePage />} />
          <Route path="tools/lesson-planner" element={<LessonPlannerPage />} />
          <Route path="tools/fee-receipt" element={<FeeReceiptPage />} />
          <Route path="admin/universities" element={<AdminUniversitiesPage />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
