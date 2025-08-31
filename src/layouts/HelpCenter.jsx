import { useState } from "react"
import { Link } from "react-router-dom"
import { FiSearch } from "react-icons/fi"
import { faqData } from "../utils/faqData"
import useThemeStyles from "../hooks/useThemeStyles"


export default function HelpCenter() {
    const { bgColor, border } = useThemeStyles();
    const [search, setSearch] = useState("");

    const filtered = faqData?.map((section) => ({
        ...section,
        items: section.items.filter((item) =>
            item.q.toLowerCase().includes(search.toLowerCase())
        ),
    }))

    return (
        <main className={`${bgColor} w-screen min-h-dvh`}>
            <section className={`max-w-3xl mx-auto py-4 px-4 space-y-8`}>
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">Help & Support Center</h1>
                    <p className="text-muted-foreground text-sm">Find answers or <Link to="/settings/feedback" className="underline text-blue-600">send us your query</Link>.</p>

                    <div className="mt-4 relative max-w-md mx-auto">
                        <FiSearch className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search help articles..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`w-full pl-10 pr-3 py-2 border ${border} rounded-lg`}
                            aria-label="Search help articles"
                        />
                    </div>
                </div>

                {filtered?.map((section, idx) =>
                    section.items.length > 0
                        ?
                        <div key={idx}>
                            <h2 className="text-lg font-semibold mb-3">{section.category}</h2>
                            <div className="space-y-3">
                                {section.items.map((item, i) => (
                                    <details key={`${idx}-${i}`} className={`bg-muted p-4 rounded-lg border ${border}`}>
                                        <summary className="cursor-pointer font-medium">{item.q}</summary>
                                        <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
                                    </details>
                                ))}
                            </div>
                        </div>
                        :
                        null
                )}

                <div className={`pt-6 border-t ${border} text-sm text-center text-muted-foreground`}>
                    Didn't find what you were looking for?{" "}
                    <Link to="/settings/feedback" className="text-blue-600 font-medium underline">Submit your question</Link>
                </div>
            </section>
        </main>
    )
}
