import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/pageComponent/Dashboard/AppSidebar';
import { useCurrentUser } from '@/Redux/features/auth/authSlice';
import { useAppSelector } from '@/Redux/features/hook';
import useUser from '@/Utils/useUser';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
    const userToken = useAppSelector(useCurrentUser);
    const { user } = useUser(userToken?.email);
    return (
        <SidebarProvider className=''>
            <AppSidebar user={user} />
            <main className='w-full min-h-screen'>
                <SidebarTrigger className='absolute md:hidden right-12 top-4 z-50' />
                <Outlet />
            </main>
        </SidebarProvider >
    );
}

export default Dashboard;
