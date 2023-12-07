import { createBrowserRouter, redirect, Outlet } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { MainHeader, MainNav } from '../components';
import { AuthContextProvider } from '../contexts/AuthContexts';
import { theme } from '../styles/theme';
import {
  QuestionCreationPage,
  QuestionDetailPage,
  LoginPage,
  SignupPage,
  QuestionSearchPage,
  MainPage,
  ProfilePage,
  NotFoundPage,
} from '../pages';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const { DEV } = import.meta.env;

const unAuthorizedLoader = () => {
  const isLogined = !!localStorage.getItem('userInfo');
  return !isLogined ? redirect('/') : null;
};

const authorizedLoader = () => {
  const isLogined = !!localStorage.getItem('userInfo');
  return isLogined ? redirect('/') : null;
};

const queryClient = new QueryClient();

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <QueryClientProvider client={queryClient}>
        {DEV && <ReactQueryDevtools initialIsOpen={true} />}
        <AuthContextProvider>
          <ThemeProvider theme={theme}>
            <MainHeader />
            <MainNav />
            <Outlet />
          </ThemeProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    ),
    children: [
      {
        path: '',
        element: <MainPage />,
      },
      {
        path: '/question/create',
        element: <QuestionCreationPage />,
        loader: unAuthorizedLoader,
      },
      {
        path: '/question/:id',
        element: <QuestionDetailPage />,
      },
      {
        path: '/search',
        element: <QuestionSearchPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
        loader: authorizedLoader,
      },
      {
        path: '/signup',
        element: <SignupPage />,
        loader: authorizedLoader,
      },
    ],
  },
  {
    path: '*',
    element: (
      <ThemeProvider theme={theme}>
        <NotFoundPage />
      </ThemeProvider>
    ),
  },
]);