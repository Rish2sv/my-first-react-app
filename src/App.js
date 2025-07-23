import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom';
import './App.css'; // Import the CSS file

// --- Helper Components & Icons (No Changes) ---
const HomeIcon = ({ className = "icon" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const BookOpenIcon = ({ className = "icon" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const UserIcon = ({ className = "icon" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const BarChartIcon = ({ className = "icon" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" x2="12" y1="20" y2="10"></line><line x1="18" x2="18" y1="20" y2="4"></line><line x1="6" x2="6" y1="20" y2="16"></line></svg>;
const CheckCircleIcon = ({ className = "icon-large" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const XCircleIcon = ({ className = "icon-large" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>;
const Share2Icon = ({ className = "icon-small" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>;
const SunIcon = ({ className = "icon" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>;
const MoonIcon = ({ className = "icon" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>;

// --- Data Store (No Changes) ---
const quotesData = [
    { id: 1, partial: "Arise, ___ and stop not till the goal is ___.", blanks: ["awake", "reached"], full: "Arise, awake and stop not till the goal is reached.", meaning: "Wake up, realize your potential, and pursue your life's purpose with unwavering determination until you achieve it.", interpretation: "A powerful call to action, this quote emphasizes perseverance, self-belief, and the importance of having a clear goal in life.", category: "Motivation" },
    { id: 2, "partial": "You have to ___ from the inside out. None can ___ you, none can make you spiritual.", "blanks": ["grow", "teach"], "full": "You have to grow from the inside out. None can teach you, none can make you spiritual.", "meaning": "Spiritual growth is a personal journey of self-discovery. It cannot be imposed or taught by others; it must be experienced.", "interpretation": "This highlights the core of self-realization: true wisdom and spiritual evolution come from within, not from external sources.", "category": "Self-realization" },
    { id: 3, "partial": "The greatest ___ is to ___ in yourself.", "blanks": ["religion", "believe"], "full": "The greatest religion is to believe in yourself.", "meaning": "Having faith in your own abilities and potential is the most fundamental and empowering belief you can hold.", "interpretation": "This quote elevates self-confidence to a spiritual principle, suggesting that self-belief is the foundation for all great achievements.", "category": "Strength" },
    { id: 4, "partial": "You cannot believe in ___ until you believe in ___.", "blanks": ["God", "yourself"], "full": "You cannot believe in God until you believe in yourself.", "meaning": "Self-worth and self-belief are prerequisites to understanding and connecting with a higher power or universal consciousness.", "interpretation": "It connects the divine to the individual, implying that the path to the universal starts with acknowledging the power within oneself.", "category": "Self-realization" },
    { id: 5, "partial": "All the ___ in the universe are already ours. It is we who have put our ___ before our eyes and cry that it is dark.", "blanks": ["powers", "hands"], "full": "All the powers in the universe are already ours. It is we who have put our hands before our eyes and cry that it is dark.", "meaning": "We inherently possess immense potential and strength, but our self-imposed limitations and ignorance prevent us from seeing it.", "interpretation": "A profound statement on human potential, urging us to remove our mental blocks to realize our innate capabilities.", "category": "Strength" },
    { id: 6, "partial": "My ___, be strong! You are the makers of your ___.", "blanks": ["faith", "destiny"], "full": "My faith, be strong! You are the makers of your destiny.", "meaning": "This is an empowering call, especially to the youth, to recognize their power in shaping their own future and the future of their nation.", "interpretation": "It emphasizes agency and responsibility, inspiring young people to take charge of their lives with courage and conviction.", "category": "Youth" },
    { id: 7, "partial": "Take up one ___. Make that one idea your life – think of it, ___ of it, live on that idea.", "blanks": ["idea", "dream"], "full": "Take up one idea. Make that one idea your life – think of it, dream of it, live on that idea.", "meaning": "To achieve greatness, you must have a singular focus and dedicate your entire being to that one purpose.", "interpretation": "This is a masterclass in focus and dedication. It teaches that complete immersion in a goal is the key to success.", "category": "Motivation" }
];

// --- Main App Component Structure ---
// We wrap the main logic in a component that can use router hooks,
// and wrap that component in the BrowserRouter.
export default function App() {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <AppContent />
        </BrowserRouter>
    );
}

function AppContent() {
    // --- State Management ---
    const navigate = useNavigate();
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect'
    const [progress, setProgress] = useState({ attempted: 0, mastered: 0, streak: 0 });
    const [darkMode, setDarkMode] = useState(false);
    
    // Memoize the quote of the day
    const quoteOfTheDay = useMemo(() => quotesData[Math.floor(Math.random() * quotesData.length)], []);

    // Effect for dark mode
    useEffect(() => {
        document.body.className = darkMode ? 'dark' : '';
    }, [darkMode]);
    
    // Set initial user answers when quote index changes
    useEffect(() => {
        const currentQuote = quotesData[currentQuoteIndex];
        setUserAnswers(new Array(currentQuote.blanks.length).fill(''));
    }, [currentQuoteIndex]);


    // --- Event Handlers ---
    const handleStartJourney = () => {
        setCurrentQuoteIndex(0);
        setFeedback(null);
        navigate('/challenge');
    };

    const handleAnswerChange = (index, value) => {
        const newAnswers = [...userAnswers];
        newAnswers[index] = value;
        setUserAnswers(newAnswers);
    };

    const handleSubmitAnswer = () => {
        const currentQuote = quotesData[currentQuoteIndex];
        const isCorrect = userAnswers.every((answer, index) => 
            answer.trim().toLowerCase() === currentQuote.blanks[index].toLowerCase()
        );

        setFeedback(isCorrect ? 'correct' : 'incorrect');
        
        setProgress(prev => ({
            ...prev,
            attempted: prev.attempted + 1,
            mastered: isCorrect ? prev.mastered + 1 : prev.mastered,
            streak: isCorrect ? prev.streak + 1 : 0
        }));

        navigate('/feedback');
    };
    
    const handleNextQuote = () => {
        const nextIndex = (currentQuoteIndex + 1) % quotesData.length;
        setCurrentQuoteIndex(nextIndex);
        setFeedback(null);
        navigate('/challenge');
    };

    const handleRepeat = () => {
        setFeedback(null);
        navigate('/challenge');
    };

    const handleShare = async () => {
        const quote = quotesData[currentQuoteIndex].full;
        const textToCopy = `"${quote}" - Swami Vivekananda`;
        try {
            await navigator.clipboard.writeText(textToCopy);
            alert('Quote copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy quote.');
        }
    };

    return (
        <div className="app-container">
            <div className="app-card">
                <div className="app-content">
                    <header className="app-header">
                        <div className="header-title">
                            <img src="https://placehold.co/50x50/f97316/ffffff?text=SV" alt="Swami Vivekananda Icon" className="header-icon" />
                            <h1>Vivekananda Speaks</h1>
                        </div>
                        <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle">
                            {darkMode ? <SunIcon /> : <MoonIcon />}
                        </button>
                    </header>

                    <main className="main-content">
                        <Routes>
                             <Route path="/" element={<HomeScreen onStart={handleStartJourney} quoteOfTheDay={quoteOfTheDay} />} />
                             <Route path="/challenge" element={<QuoteChallengeScreen quote={quotesData[currentQuoteIndex]} userAnswers={userAnswers} onAnswerChange={handleAnswerChange} onSubmit={handleSubmitAnswer} />} />
                             <Route path="/feedback" element={<FeedbackScreen quote={quotesData[currentQuoteIndex]} feedback={feedback} onNext={handleNextQuote} onRepeat={handleRepeat} onShare={handleShare} />} />
                             <Route path="/explore" element={<ExploreQuotesScreen quotes={quotesData} />} />
                             <Route path="/about" element={<AboutScreen />} />
                             <Route path="/progress" element={<ProgressScreen progress={progress} totalQuotes={quotesData.length} />} />
                             <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unknown paths to home */}
                        </Routes>
                    </main>
                </div>
                
                <footer className="app-footer">
                    <nav className="footer-nav">
                        {/* NavLink automatically adds 'active' class to the active link */}
                        <NavLink to="/" className={({isActive}) => `nav-button ${isActive ? 'active' : ''}`}>
                            <HomeIcon /> <span className="nav-label">Home</span>
                        </NavLink>
                        <NavLink to="/explore" className={({isActive}) => `nav-button ${isActive ? 'active' : ''}`}>
                            <BookOpenIcon /> <span className="nav-label">Explore</span>
                        </NavLink>
                        <NavLink to="/about" className={({isActive}) => `nav-button ${isActive ? 'active' : ''}`}>
                            <UserIcon /> <span className="nav-label">About</span>
                        </NavLink>
                        <NavLink to="/progress" className={({isActive}) => `nav-button ${isActive ? 'active' : ''}`}>
                            <BarChartIcon /> <span className="nav-label">Progress</span>
                        </NavLink>
                    </nav>
                </footer>
            </div>
        </div>
    );
}

// --- Sub-Components (No logic changes needed) ---

const HomeScreen = ({ onStart, quoteOfTheDay }) => (
    <div className="home-screen animate-fade-in">
        <h2>Welcome to the Journey</h2>
        <p>Discover the timeless wisdom of Swami Vivekananda. Challenge your knowledge and find inspiration.</p>
        
        <div className="quote-of-the-day">
            <h3>Quote of the Day</h3>
            <blockquote>
                "{quoteOfTheDay.full}"
            </blockquote>
        </div>

        <button onClick={onStart} className="btn btn-primary">
            Start the Journey
        </button>
    </div>
);

const QuoteChallengeScreen = ({ quote, userAnswers, onAnswerChange, onSubmit }) => {
    const quoteParts = quote.partial.split('___');
    
    return (
        <div className="quote-challenge-screen animate-fade-in">
            <h2>Complete the Quote</h2>
            <p>Fill in the missing words to reveal the wisdom.</p>
            
            <div className="quote-input-area">
                {quoteParts.map((part, i) => (
                    <React.Fragment key={i}>
                        <span>{part}</span>
                        {i < quote.blanks.length && (
                            <input
                                type="text"
                                value={userAnswers[i] || ''}
                                onChange={(e) => onAnswerChange(i, e.target.value)}
                                className="quote-input"
                                placeholder="answer"
                                aria-label={`Blank word ${i + 1}`}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div className="submit-container">
                <button onClick={onSubmit} className="btn btn-success">
                    Submit Answer
                </button>
            </div>
        </div>
    );
};

const FeedbackScreen = ({ quote, feedback, onNext, onRepeat, onShare }) => {
    if (feedback === null) {
        // Redirect if someone lands on this page directly without feedback
        return <Navigate to="/challenge" />;
    }
    const isCorrect = feedback === 'correct';

    return (
        <div className={`feedback-screen animate-fade-in ${isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="feedback-header">
                {isCorrect ? (
                    <div className="feedback-title-correct">
                        <CheckCircleIcon />
                        <h2>Well done! You got it right.</h2>
                    </div>
                ) : (
                    <div className="feedback-title-incorrect">
                        <XCircleIcon />
                        <h2>Oops! Let’s learn it better.</h2>
                    </div>
                )}
            </div>

            <div className="feedback-details">
                <h3>The complete quote is:</h3>
                <blockquote>
                    "{quote.full}"
                </blockquote>
                
                <div className="feedback-explanation">
                    <div>
                        <h4>Simple Meaning:</h4>
                        <p>{quote.meaning}</p>
                    </div>
                    <div>
                        <h4>Motivational Interpretation:</h4>
                        <p>{quote.interpretation}</p>
                    </div>
                </div>
            </div>

            <div className="feedback-actions">
                <button onClick={onNext} className="btn btn-primary">
                    Next Quote
                </button>
                 <button onClick={onRepeat} className="btn btn-secondary">
                    Repeat
                </button>
                <button onClick={onShare} className="btn btn-info">
                    <Share2Icon />
                    <span>Share</span>
                </button>
            </div>
        </div>
    );
};

const ExploreQuotesScreen = ({ quotes }) => {
    const [filter, setFilter] = useState('All');
    const categories = ['All', 'Motivation', 'Self-realization', 'Strength', 'Youth'];
    
    const filteredQuotes = quotes.filter(q => filter === 'All' || q.category === filter);

    return (
        <div className="explore-screen animate-fade-in">
            <h2>Explore Quotes</h2>
            <div className="filter-buttons">
                {categories.map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => setFilter(cat)}
                        className={`filter-btn ${filter === cat ? 'active' : ''}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="quotes-list">
                {filteredQuotes.map(quote => (
                    <div key={quote.id} className="quote-list-item">
                        <blockquote>
                            "{quote.full}"
                        </blockquote>
                        <p><span>Meaning:</span> {quote.meaning}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AboutScreen = () => (
    <div className="about-screen animate-fade-in">
        <h2>About Swami Vivekananda</h2>
        <div className="prose">
            <p>
                Swami Vivekananda (1863-1902) was an Indian Hindu monk, philosopher, and a chief disciple of the 19th-century Indian mystic Ramakrishna. He was a key figure in the introduction of the Indian philosophies of Vedanta and Yoga to the Western world and is credited with raising interfaith awareness, bringing Hinduism to the status of a major world religion during the late 19th century.
            </p>
            <h3>Teachings in Modern Context</h3>
            <p>
                Vivekananda's teachings were not just for spiritual seekers but for all of humanity. He championed education, self-reliance, and service to mankind. His message of universal brotherhood, self-belief, and harnessing one's inner power remains incredibly relevant today, inspiring millions to lead a life of purpose, courage, and compassion.
            </p>
            <h3>Major Works & Timeline</h3>
            <ul>
                <li><strong>1863:</strong> Born Narendranath Datta in Calcutta.</li>
                <li><strong>1881:</strong> Met his guru, Sri Ramakrishna Paramahamsa.</li>
                <li><strong>1893:</strong> Delivered his famous speech at the Parliament of the World's Religions in Chicago.</li>
                <li><strong>1897:</strong> Founded the Ramakrishna Mission.</li>
                <li><strong>1902:</strong> Attained Mahasamadhi (left his mortal body).</li>
            </ul>
            <p>His lectures and writings have been compiled into 'The Complete Works of Swami Vivekananda', a multi-volume set that serves as a guide for spiritual and practical living.</p>
        </div>
    </div>
);

const ProgressScreen = ({ progress, totalQuotes }) => {
    const masteryPercentage = totalQuotes > 0 ? Math.round((progress.mastered / totalQuotes) * 100) : 0;

    return (
        <div className="progress-screen animate-fade-in">
            <h2>Your Progress</h2>
            <div className="stats-grid">
                <div className="stat-card">
                    <p className="stat-number-blue">{progress.attempted}</p>
                    <p className="stat-label">Attempted</p>
                </div>
                <div className="stat-card">
                    <p className="stat-number-green">{progress.mastered}</p>
                    <p className="stat-label">Mastered</p>
                </div>
                <div className="stat-card">
                    <p className="stat-number-orange">{progress.streak} 🔥</p>
                    <p className="stat-label">Streak</p>
                </div>
            </div>
            <div className="mastery-section">
                <h3>Quote Mastery</h3>
                <div className="progress-bar-container">
                    <div 
                        className="progress-bar-fill" 
                        style={{ width: `${masteryPercentage}%` }}
                    >
                       {masteryPercentage > 10 && `${masteryPercentage}%`}
                    </div>
                </div>
            </div>
        </div>
    );
};