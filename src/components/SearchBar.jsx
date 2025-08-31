import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SearchResultList from './SearchResultList';
import useThemeStyles from '../hooks/useThemeStyles';
import { FiSearch } from 'react-icons/fi';
import interceptor from '../middleware/axiosInterceptor';

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState({ posts: [], users: [], tags: [] });
    const [showAll, setShowAll] = useState(false);
    const [loading, setLoading] = useState(false);
    const { border, bgColor, grayText, blueText } = useThemeStyles();

    // Fetch preview results
    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setResults({ posts: [], users: [], tags: [] });
                return;
            }

            try {
                setLoading(true);
                const res = await interceptor.get(`/api/explore/search/preview?q=${query}`);
                setResults(res.data);
            } catch (err) {
                console.error("Search error:", err);
            } finally {
                setLoading(false);
            }
        };

        const delayDebounce = setTimeout(fetchResults, 400);
        return () => clearTimeout(delayDebounce);
    }, [query]);

    // Fetch full paginated results
    const handleShowAll = async () => {
        try {
            const res = await interceptor.get(`/api/explore/search`, {
                params: { query },
            });
            setResults(res.data);
            setShowAll(true);
        } catch (err) {
            console.error("Search pagination error:", err);
        }
    };

    const showResults = query.trim().length > 0;

    // Body lock
    useEffect(() => {
        document.body.style.overflow = showResults ? 'hidden' : 'auto';
    }, [showResults]);

    return (
        <div className="relative mb-4">
            <div className={`flex items-center px-3 py-2 rounded-xl border ${border}`}>
                <FiSearch className={`${grayText} mr-2`} />
                <input
                    type="text"
                    placeholder="Search posts, users, or tags..."
                    className="w-full bg-transparent outline-none"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setShowAll(false); }}
                />
            </div>

            {/* Search results */}
            <AnimatePresence>
                {showResults && (
                    <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute z-10 mt-1 w-full rounded-xl border ${border} ${bgColor} p-3 shadow-lg`}
                    >
                        <SearchResultList
                            posts={results.posts}
                            users={results.users}
                            tags={results.tags}
                            showLimited={!showAll}
                            setResults={setResults}
                        />

                        {loading && (
                            <div className={`w-3 h-3 my-3 rounded-full border-2 border-dotted ${grayText} animate-spin`}></div>
                        )}

                        {(results.posts.length + results.users.length + results.tags.length > 7 && !showAll) && (
                            <button onClick={handleShowAll} className={`mt-2 text-sm ${blueText}`}>
                                Show More
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
