import { createHashRouter } from 'react-router';
import Authenticated from './components/auth/Authenticated';
import Authorized from './components/auth/Authorized';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import MainLayout from './components/layout/MainLayout';
import AttributeDefManagementPage from './pages/admin/AttributeDefManagementPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import ClosetPage from './pages/ClosetPage';
import FeedPage from './pages/FeedPage';
import Home from './pages/Home';
import PasswordResetPage from './pages/PasswordResetPage';
import ProfileMamagementPage from './pages/ProfileMamagementPage';
import ProfilePage from './pages/ProfilePage';
import RecommendationPage from './pages/RecommendationPage';
import SignOutPage from './pages/SignOutPage';
import HotFeedPage from './pages/HotFeedPage'; // 1. import 추가

export const ROUTE_OBJECTS: Record<string, { path: string; title: string }> = {
  home: { path: '/', title: '홈' },
  hotFeed: { path: '/hot-feed', title: '인기 피드' }, // 2. hotFeed 경로 추가
  recommendation: { path: '/recommendation', title: '날씨 별 옷 추천' },
  closet: { path: '/closet', title: '옷장' },
  feed: { path: '/feed', title: '피드' },

  userManagement: { path: '/user-management', title: '사용자 관리' },
  attributeDefManagement: { path: '/attribute-def-management', title: '속성 관리' },

  signIn: { path: '/sign-in', title: '로그인' },
  signUp: { path: '/sign-up', title: '회원가입' },
  signOut: { path: '/sign-out', title: '로그아웃' },
  passwordReset: { path: '/password-reset', title: '비밀번호 재설정' },
  profileManagement: { path: '/profile-management', title: '프로필 관리' },
  profile: { path: '/profile', title: '프로필' },
};

const router = createHashRouter([
  {
    element: <MainLayout />,
    children: [
      {
        element: <Authenticated />,
        children: [
          {
            path: ROUTE_OBJECTS.home.path,
            element: <Home />,
          },
          {
            path: ROUTE_OBJECTS.recommendation.path,
            element: <RecommendationPage />,
          },
          {
            path: ROUTE_OBJECTS.hotFeed.path,
            element: <HotFeedPage />,
          },
          {
            path: ROUTE_OBJECTS.closet.path,
            element: <ClosetPage />,
          },
          {
            path: ROUTE_OBJECTS.feed.path,
            element: <FeedPage />,
          },
          {
            path: ROUTE_OBJECTS.profileManagement.path,
            element: <ProfileMamagementPage />,
          },
          {
            path: ROUTE_OBJECTS.profile.path,
            element: <ProfilePage />,
          },
          {
            element: <Authorized roles={['ADMIN']} />,
            children: [
              {
                path: ROUTE_OBJECTS.userManagement.path,
                element: <UserManagementPage />,
              },
              {
                path: ROUTE_OBJECTS.attributeDefManagement.path,
                element: <AttributeDefManagementPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: ROUTE_OBJECTS.signIn.path,
    element: <SignIn />,
  },
  {
    path: ROUTE_OBJECTS.signUp.path,
    element: <SignUp />,
  },
  {
    path: ROUTE_OBJECTS.signOut.path,
    element: <SignOutPage />,
  },
  {
    path: ROUTE_OBJECTS.passwordReset.path,
    element: <PasswordResetPage />,
  },
]);

export default router;
