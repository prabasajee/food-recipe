document.addEventListener('DOMContentLoaded', function() {
    // Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Load saved theme or use system preference
    const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add a subtle animation
        this.style.transform = 'rotate(360deg) scale(1.2)';
        setTimeout(() => {
            this.style.transform = '';
        }, 300);
    });
    
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            icon.className = 'fas fa-moon';
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }
    
    // Navigation with improved accessibility
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('main section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => {
                l.classList.remove('active');
                l.removeAttribute('aria-current');
            });
            sections.forEach(s => s.classList.remove('active-section'));
            
            // Add active class to clicked link
            this.classList.add('active');
            this.setAttribute('aria-current', 'page');
            
            // Show corresponding section with smooth transition
            const sectionId = this.getAttribute('href');
            const targetSection = document.querySelector(sectionId);
            targetSection.classList.add('active-section');
            
            // Announce section change to screen readers
            const sectionTitle = targetSection.querySelector('h2').textContent;
            announceToScreenReader(`Navigated to ${sectionTitle} section`);
            
            // Focus on the section for keyboard users
            targetSection.setAttribute('tabindex', '-1');
            targetSection.focus();
        });
        
        // Keyboard navigation
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Screen reader announcements
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    // Quote Generator
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const newQuoteBtn = document.getElementById('new-quote');
    const saveQuoteBtn = document.getElementById('save-quote');
    const savedQuotesList = document.getElementById('saved-quotes-list');
    
    const quotes = [
        {
            text: "You are enough just as you are.",
            author: "Megan Markle"
        },
        {
            text: "Mental health needs a great deal of attention. It's the final taboo and it needs to be faced and dealt with.",
            author: "Adam Ant"
        },
        {
            text: "You don't have to control your thoughts. You just have to stop letting them control you.",
            author: "Dan Millman"
        },
        {
            text: "Self-care is how you take your power back.",
            author: "Lalah Delia"
        },
        {
            text: "It's okay to not be okay as long as you're not giving up.",
            author: "Karen Salmansohn"
        },
        {
            text: "You, yourself, as much as anybody in the entire universe, deserve your love and affection.",
            author: "Buddha"
        },
        {
            text: "Healing is an art. It takes time, it takes practice, it takes love.",
            author: "Maza Dohta"
        },
        {
            text: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
            author: "Unknown"
        },
        {
            text: "The only journey is the journey within.",
            author: "Rainer Maria Rilke"
        },
        {
            text: "What mental health needs is more sunlight, more candor, and more unashamed conversation.",
            author: "Glenn Close"
        }
    ];
    
    function getRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    }
    
    function displayQuote() {
        const quote = getRandomQuote();
        
        // Add fade effect
        quoteText.style.opacity = '0';
        quoteAuthor.style.opacity = '0';
        
        setTimeout(() => {
            quoteText.textContent = `"${quote.text}"`;
            quoteAuthor.textContent = `- ${quote.author}`;
            
            quoteText.style.opacity = '1';
            quoteAuthor.style.opacity = '1';
            
            // Announce new quote to screen readers
            announceToScreenReader(`New quote: ${quote.text} by ${quote.author}`);
        }, 150);
    }
    
    newQuoteBtn.addEventListener('click', function() {
        displayQuote();
        
        // Add button feedback
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
    
    // Keyboard shortcut for new quote (Ctrl/Cmd + Q)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'q') {
            e.preventDefault();
            displayQuote();
            announceToScreenReader('Generated new quote using keyboard shortcut');
        }
    });
    
    // Save quote to local storage with enhanced feedback
    saveQuoteBtn.addEventListener('click', function() {
        const currentQuote = quoteText.textContent;
        const currentAuthor = quoteAuthor.textContent;
        
        if (currentQuote === 'Click the button below to get your daily motivational quote!') {
            showNotification('Please generate a quote first!', 'warning');
            return;
        }
        
        let savedQuotes = JSON.parse(localStorage.getItem('savedQuotes')) || [];
        
        // Check for duplicates
        const isDuplicate = savedQuotes.some(quote => 
            quote.text === currentQuote && quote.author === currentAuthor
        );
        
        if (isDuplicate) {
            showNotification('This quote is already saved!', 'warning');
            return;
        }
        
        savedQuotes.push({ text: currentQuote, author: currentAuthor });
        localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes));
        
        updateSavedQuotesList();
        showNotification('Quote saved successfully!', 'success');
        
        // Button animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
    
    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'assertive');
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Update saved quotes list
    function updateSavedQuotesList() {
        savedQuotesList.innerHTML = '';
        const savedQuotes = JSON.parse(localStorage.getItem('savedQuotes')) || [];
        
        if (savedQuotes.length === 0) {
            savedQuotesList.innerHTML = '<li>No saved quotes yet.</li>';
            return;
        }
        
        savedQuotes.forEach((quote, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${quote.text} ${quote.author}</span>
                <button class="delete-quote" data-index="${index}">Delete</button>
            `;
            savedQuotesList.appendChild(li);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-quote').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                let savedQuotes = JSON.parse(localStorage.getItem('savedQuotes')) || [];
                savedQuotes.splice(index, 1);
                localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes));
                updateSavedQuotesList();
            });
        });
    }
    
    // Initialize saved quotes list
    updateSavedQuotesList();
    
    // Music Player
    const audioPlayer = document.getElementById('audio-player');
    const playButtons = document.querySelectorAll('.play-btn');
    let currentlyPlaying = null;
    
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const trackContainer = this.closest('.track');
            const trackSrc = trackContainer.getAttribute('data-src');
            
            // If this track is already playing, pause it
            if (currentlyPlaying === trackContainer) {
                audioPlayer.pause();
                currentlyPlaying = null;
                this.innerHTML = '<i class="fas fa-play"></i> Play';
                return;
            }
            
            // Stop any currently playing track
            if (currentlyPlaying) {
                const currentlyPlayingButton = currentlyPlaying.querySelector('.play-btn');
                currentlyPlayingButton.innerHTML = '<i class="fas fa-play"></i> Play';
            }
            
            // Play the selected track
            audioPlayer.src = trackSrc;
            audioPlayer.play();
            currentlyPlaying = trackContainer;
            this.innerHTML = '<i class="fas fa-pause"></i> Pause';
            
            // Update when track ends
            audioPlayer.onended = function() {
                button.innerHTML = '<i class="fas fa-play"></i> Play';
                currentlyPlaying = null;
            };
        });
    });
    
    // Journal
    const journalDate = document.getElementById('journal-date');
    const journalMood = document.getElementById('journal-mood');
    const journalEntry = document.getElementById('journal-entry');
    const saveEntryBtn = document.getElementById('save-entry');
    const clearEntryBtn = document.getElementById('clear-entry');
    const entriesList = document.getElementById('entries-list');
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    journalDate.value = today;
    
    // Save journal entry
    saveEntryBtn.addEventListener('click', function() {
        const date = journalDate.value;
        const mood = journalMood.value;
        const entry = journalEntry.value.trim();
        
        if (!entry) {
            alert('Please write something in your journal entry!');
            return;
        }
        
        let journalEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
        journalEntries.unshift({ date, mood, entry });
        localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
        
        updateJournalEntriesList();
        journalEntry.value = '';
    });
    
    // Clear journal entry
    clearEntryBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear your current entry?')) {
            journalEntry.value = '';
        }
    });
    
    // Update journal entries list
    function updateJournalEntriesList() {
        entriesList.innerHTML = '';
        const journalEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
        
        if (journalEntries.length === 0) {
            entriesList.innerHTML = '<p>No journal entries yet.</p>';
            return;
        }
        
        journalEntries.forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'entry';
            entryDiv.innerHTML = `
                <div class="entry-date">${entry.date}</div>
                <div class="entry-mood">${entry.mood}</div>
                <div class="entry-text">${entry.entry}</div>
            `;
            entriesList.appendChild(entryDiv);
        });
    }
    
    // Initialize journal entries list
    updateJournalEntriesList();
    
    // Random Tip Generator with enhanced animations
    const tipCards = document.querySelectorAll('.tip-card');
    const randomTipBtn = document.getElementById('random-tip');
    
    randomTipBtn.addEventListener('click', function() {
        // Reset all cards with staggered animation
        tipCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = 'var(--shadow)';
                card.style.borderColor = 'var(--border-color)';
            }, index * 50);
        });
        
        // Select random card and highlight it
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * tipCards.length);
            const randomCard = tipCards[randomIndex];
            
            randomCard.style.transform = 'translateY(-15px) scale(1.02)';
            randomCard.style.boxShadow = '0 20px 40px rgba(106, 90, 205, 0.3)';
            randomCard.style.borderColor = 'var(--primary-color)';
            
            // Scroll to the random card
            randomCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Announce to screen readers
            const tipTitle = randomCard.querySelector('h3').textContent;
            const tipContent = randomCard.querySelector('p').textContent;
            announceToScreenReader(`Random tip selected: ${tipTitle}. ${tipContent}`);
            
            // Focus on the card for accessibility
            randomCard.setAttribute('tabindex', '-1');
            randomCard.focus();
        }, tipCards.length * 50 + 100);
        
        // Button feedback
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
    
    // Display a random quote on page load
    displayQuote();
});