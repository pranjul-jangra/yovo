import useThemeStyles from '../hooks/useThemeStyles'
import './components.css';
import MainContent from './MainContent';
import SideContent from './SideContent';

export default function ContentPage() {
  const { bgColor } = useThemeStyles();


  return (
    <section className={`h-full content-page-width absolute top-0 right-0 overflow-y-auto ${bgColor} z-10 py-5 px-7 flex gap-8`}>
      <MainContent />
      <SideContent />
    </section>
  )
}
