import { useEffect } from 'react';
import { HashRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { BottomNav, ToastProvider } from './components/ui';
import { useStore } from './store/useStore';
import Onboarding from './pages/Onboarding';
import Placement from './pages/Placement';
import Home from './pages/Home';
import Course from './pages/Course';
import UnitDetail from './pages/UnitDetail';
import LessonSession from './pages/LessonSession';
import SkipTest from './pages/SkipTest';
import Free from './pages/Free';
import WordList from './pages/WordList';
import WordDetail from './pages/WordDetail';
import WordStudy from './pages/WordStudy';
import WordQuiz from './pages/WordQuiz';
import GrammarList from './pages/GrammarList';
import GrammarDetail from './pages/GrammarDetail';
import Practice from './pages/Practice';
import Review from './pages/Review';
import WrongNotes from './pages/WrongNotes';
import Stats from './pages/Stats';
import My from './pages/My';
import SavedWords from './pages/SavedWords';
import NotFound from './pages/NotFound';
import Notifications from './pages/Notifications';
import { ListeningDetail, ListeningList } from './pages/Listening';
import { SpeakingList, SpeakingSession } from './pages/Speaking';
import { ExpressionDetail, ExpressionHub } from './pages/Expressions';
import { NotificationRunner } from './components/NotificationCenter';

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function RequireOnboarded() {
  const onboarded = useStore((s) => s.profile.onboarded);
  if (!onboarded) return <Navigate to="/onboarding" replace />;
  return <Outlet />;
}

/** 하단 내비게이션이 있는 메인 탭 레이아웃 */
function TabLayout() {
  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  );
}

export default function App() {
  const onboarded = useStore((s) => s.profile.onboarded);
  return (
    <ToastProvider>
      <HashRouter>
        <ScrollTop />
        <NotificationRunner />
        <div className="max-w-app mx-auto min-h-screen bg-surface relative">
          <Routes>
            <Route path="/" element={<Navigate to={onboarded ? '/home' : '/onboarding'} replace />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/placement" element={<Placement />} />
            <Route element={<RequireOnboarded />}>
              <Route element={<TabLayout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/course" element={<Course />} />
                <Route path="/course/unit/:unitId" element={<UnitDetail />} />
                <Route path="/free" element={<Free />} />
                <Route path="/free/words" element={<WordList />} />
                <Route path="/free/words/:wordId" element={<WordDetail />} />
                <Route path="/free/grammar" element={<GrammarList />} />
                <Route path="/grammar/:conceptId" element={<GrammarDetail />} />
                <Route path="/wrong-notes" element={<WrongNotes />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/my" element={<My />} />
                <Route path="/my/saved-words" element={<SavedWords />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/free/listening" element={<ListeningList />} />
                <Route path="/listening/:dialogueId" element={<ListeningDetail />} />
                <Route path="/free/speaking" element={<SpeakingList />} />
                <Route path="/expressions" element={<ExpressionHub />} />
                <Route path="/expressions/:expressionId" element={<ExpressionDetail />} />
              </Route>
              {/* 몰입형 학습 화면: 하단 내비게이션 숨김 */}
              <Route path="/course/lesson/:lessonId" element={<LessonSession />} />
              <Route path="/course/skip/:unitId" element={<SkipTest />} />
              <Route path="/free/word-study" element={<WordStudy />} />
              <Route path="/free/word-quiz" element={<WordQuiz />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/review" element={<Review />} />
              <Route path="/speaking" element={<SpeakingSession />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </HashRouter>
    </ToastProvider>
  );
}
