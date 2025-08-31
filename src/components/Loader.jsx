import useThemeStyles from '../hooks/useThemeStyles';
import './components.css'

export default function Loader() {
  const { loaderBg } = useThemeStyles();

  return (
    <div className="w-full h-full flex justify-center items-center z-[500] bg-black/15">
      <div className="relative w-16 h-16">
        {
          Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`dot ${loaderBg}`} style={{ transform: `rotate(${i * 30}deg) translate(0, -50%)` }} />
          ))
        }
      </div>
    </div>
  )
}
