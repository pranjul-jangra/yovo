import MainContent from "../components/MainContent";
import Sidebar from "../components/Sidebar";
import SideContent from "../components/SideContent";
import useThemeStyles from "../hooks/useThemeStyles";


export default function Home() {
  const { bgColor } = useThemeStyles();

  return (
    <main className={`w-screen min-h-dvh flex gap-4 ${bgColor}`}>
      <Sidebar />
      <MainContent />
      
      <div className="max-md:hidden">
        <SideContent />
      </div>
    </main>
  )
}
