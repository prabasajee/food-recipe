document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('main section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active-section'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('href');
            document.querySelector(sectionId).classList.add('active-section');
        });
    });
    
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
        quoteText.textContent = `"${quote.text}"`;
        quoteAuthor.textContent = `- ${quote.author}`;
    }
    
    newQuoteBtn.addEventListener('click', displayQuote);
    
    // Save quote to local storage
    saveQuoteBtn.addEventListener('click', function() {
        const currentQuote = quoteText.textContent;
        const currentAuthor = quoteAuthor.textContent;
        
        if (currentQuote === 'Click the button below to get your daily motivational quote!') {
            alert('Please generate a quote first!');
            return;
        }
        
        let savedQuotes = JSON.parse(localStorage.getItem('savedQuotes')) || [];
        savedQuotes.push({ text: currentQuote, author: currentAuthor });
        localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes));
        
        updateSavedQuotesList();
    });
    
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
    
    // Random Tip Generator
    const tipCards = document.querySelectorAll('.tip-card');
    const randomTipBtn = document.getElementById('random-tip');
    
    randomTipBtn.addEventListener('click', function() {
        // Reset all cards
        tipCards.forEach(card => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'var(--shadow)';
        });
        
        // Select random card and highlight it
        const randomIndex = Math.floor(Math.random() * tipCards.length);
        const randomCard = tipCards[randomIndex];
        
        randomCard.style.transform = 'translateY(-10px)';
        randomCard.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
        
        // Scroll to the random card
        randomCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    
    // Display a random quote on page load
    displayQuote();
});