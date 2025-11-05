// Coffee Shop Journal App
let appInstance = null;

// Google Maps callback function
function initMap() {
    if (appInstance) {
        appInstance.initializeGoogleMaps();
    }
}

class CoffeeJournal {
    constructor() {
        this.entries = this.loadEntries();
        this.currentEditId = null;
        this.currentRating = 0;
        this.autocomplete = null;
        this.formMap = null;
        this.formMarker = null;
        this.selectedLocation = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderEntries();
        this.setDefaultDate();
        // Google Maps will initialize via callback
    }

    initializeGoogleMaps() {
        if (typeof google === 'undefined') {
            console.warn('Google Maps API not loaded');
            return;
        }

        // Initialize autocomplete
        const locationInput = document.getElementById('location');
        this.autocomplete = new google.maps.places.Autocomplete(locationInput, {
            types: ['establishment', 'geocode']
        });

        this.autocomplete.addListener('place_changed', () => {
            const place = this.autocomplete.getPlace();
            if (place.geometry) {
                this.selectedLocation = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                    address: place.formatted_address || place.name
                };
                this.showFormMap();
            }
        });
    }

    showFormMap() {
        if (!this.selectedLocation || typeof google === 'undefined') return;

        const formMapDiv = document.getElementById('formMap');
        formMapDiv.style.display = 'block';

        if (!this.formMap) {
            this.formMap = new google.maps.Map(formMapDiv, {
                center: this.selectedLocation,
                zoom: 15
            });
            this.formMarker = new google.maps.Marker({
                map: this.formMap,
                position: this.selectedLocation
            });
        } else {
            this.formMap.setCenter(this.selectedLocation);
            this.formMarker.setPosition(this.selectedLocation);
        }
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('coffeeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Star rating
        const stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                this.setRating(parseInt(star.dataset.rating));
            });

            star.addEventListener('mouseenter', () => {
                this.highlightStars(parseInt(star.dataset.rating));
            });
        });

        document.getElementById('starRating').addEventListener('mouseleave', () => {
            this.highlightStars(this.currentRating);
        });

        // Cancel button
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.resetForm();
        });

        // Sort dropdown
        document.getElementById('sortBy').addEventListener('change', (e) => {
            this.renderEntries(e.target.value);
        });
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('visitDate').value = today;
    }

    setRating(rating) {
        this.currentRating = rating;
        document.getElementById('rating').value = rating;
        this.highlightStars(rating);
    }

    highlightStars(rating) {
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    handleSubmit() {
        const entry = {
            id: this.currentEditId || Date.now().toString(),
            shopName: document.getElementById('shopName').value.trim(),
            visitDate: document.getElementById('visitDate').value,
            rating: parseInt(document.getElementById('rating').value),
            liked: document.getElementById('liked').value.trim(),
            disliked: document.getElementById('disliked').value.trim(),
            notes: document.getElementById('notes').value.trim(),
            location: this.selectedLocation,
            createdAt: this.currentEditId ?
                this.entries.find(e => e.id === this.currentEditId).createdAt :
                new Date().toISOString()
        };

        if (!entry.rating) {
            alert('Please select a rating!');
            return;
        }

        if (this.currentEditId) {
            // Update existing entry
            const index = this.entries.findIndex(e => e.id === this.currentEditId);
            this.entries[index] = entry;
        } else {
            // Add new entry
            this.entries.push(entry);
        }

        this.saveEntries();
        this.resetForm();
        this.renderEntries();
    }

    editEntry(id) {
        const entry = this.entries.find(e => e.id === id);
        if (!entry) return;

        this.currentEditId = id;
        document.getElementById('shopName').value = entry.shopName;
        document.getElementById('visitDate').value = entry.visitDate;
        document.getElementById('liked').value = entry.liked;
        document.getElementById('disliked').value = entry.disliked;
        document.getElementById('notes').value = entry.notes;
        this.setRating(entry.rating);

        // Set location if available
        if (entry.location) {
            this.selectedLocation = entry.location;
            document.getElementById('location').value = entry.location.address;
            this.showFormMap();
        }

        document.getElementById('formTitle').textContent = 'Edit Coffee Shop';
        document.getElementById('submitBtn').textContent = 'Update Entry';
        document.getElementById('cancelBtn').style.display = 'inline-block';

        // Scroll to form
        document.getElementById('formSection').scrollIntoView({ behavior: 'smooth' });
    }

    deleteEntry(id) {
        if (!confirm('Are you sure you want to delete this entry?')) return;

        this.entries = this.entries.filter(e => e.id !== id);
        this.saveEntries();
        this.renderEntries();
    }

    resetForm() {
        document.getElementById('coffeeForm').reset();
        this.currentEditId = null;
        this.currentRating = 0;
        this.selectedLocation = null;
        this.highlightStars(0);
        document.getElementById('formTitle').textContent = 'Add New Coffee Shop';
        document.getElementById('submitBtn').textContent = 'Add Entry';
        document.getElementById('cancelBtn').style.display = 'none';
        document.getElementById('formMap').style.display = 'none';
        this.setDefaultDate();
    }

    renderEntries(sortBy = null) {
        const entriesList = document.getElementById('entriesList');
        const emptyState = document.getElementById('emptyState');
        const entryCount = document.getElementById('entryCount');

        if (!sortBy) {
            sortBy = document.getElementById('sortBy').value;
        }

        if (this.entries.length === 0) {
            entriesList.innerHTML = '';
            emptyState.style.display = 'block';
            entryCount.textContent = '0';
            return;
        }

        emptyState.style.display = 'none';
        entryCount.textContent = this.entries.length;

        // Sort entries
        const sortedEntries = this.sortEntries(this.entries, sortBy);

        entriesList.innerHTML = sortedEntries.map(entry => this.createEntryCard(entry)).join('');

        // Add click listeners for expand/collapse
        document.querySelectorAll('.entry-card').forEach(card => {
            const cardElement = card.querySelector('.entry-header');
            if (cardElement) {
                cardElement.addEventListener('click', (e) => {
                    if (!e.target.closest('.entry-actions')) {
                        card.classList.toggle('expanded');
                    }
                });
            }
        });

        // Add edit/delete listeners
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editEntry(btn.dataset.id);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteEntry(btn.dataset.id);
            });
        });

        // Initialize maps for entries with location
        this.initializeEntryMaps();
    }

    initializeEntryMaps() {
        if (typeof google === 'undefined') return;

        this.entries.forEach(entry => {
            if (entry.location) {
                const mapDiv = document.getElementById(`entry-map-${entry.id}`);
                if (mapDiv) {
                    const map = new google.maps.Map(mapDiv, {
                        center: entry.location,
                        zoom: 15
                    });
                    new google.maps.Marker({
                        map: map,
                        position: entry.location
                    });
                }
            }
        });
    }

    sortEntries(entries, sortBy) {
        const sorted = [...entries];

        switch(sortBy) {
            case 'date-desc':
                return sorted.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
            case 'date-asc':
                return sorted.sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate));
            case 'rating-desc':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'rating-asc':
                return sorted.sort((a, b) => a.rating - b.rating);
            case 'name-asc':
                return sorted.sort((a, b) => a.shopName.localeCompare(b.shopName));
            default:
                return sorted;
        }
    }

    createEntryCard(entry) {
        const stars = '★'.repeat(entry.rating) + '☆'.repeat(5 - entry.rating);
        const formattedDate = new Date(entry.visitDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <div class="entry-card" data-id="${entry.id}">
                <div class="entry-header">
                    <div class="entry-title">
                        <h3>${this.escapeHtml(entry.shopName)}</h3>
                        <div class="entry-meta">
                            <span class="entry-rating">${stars}</span>
                            <span>${formattedDate}</span>
                        </div>
                        ${entry.location ? `
                            <div class="location-info">${this.escapeHtml(entry.location.address)}</div>
                        ` : ''}
                    </div>
                    <div class="entry-actions">
                        <button class="btn btn-small btn-edit" data-id="${entry.id}">Edit</button>
                        <button class="btn btn-small btn-delete" data-id="${entry.id}">Delete</button>
                    </div>
                </div>
                <div class="entry-details">
                    ${entry.location ? `
                        <div class="detail-section">
                            <h4>📍 Location</h4>
                            <div id="entry-map-${entry.id}" class="entry-map"></div>
                        </div>
                    ` : ''}
                    ${entry.liked ? `
                        <div class="detail-section">
                            <h4>👍 What I Liked</h4>
                            <p>${this.escapeHtml(entry.liked)}</p>
                        </div>
                    ` : ''}
                    ${entry.disliked ? `
                        <div class="detail-section">
                            <h4>👎 What I Didn't Like</h4>
                            <p>${this.escapeHtml(entry.disliked)}</p>
                        </div>
                    ` : ''}
                    ${entry.notes ? `
                        <div class="detail-section">
                            <h4>📝 Additional Notes</h4>
                            <p>${this.escapeHtml(entry.notes)}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // LocalStorage methods
    loadEntries() {
        try {
            const stored = localStorage.getItem('coffeeJournalEntries');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading entries:', error);
            return [];
        }
    }

    saveEntries() {
        try {
            localStorage.setItem('coffeeJournalEntries', JSON.stringify(this.entries));
        } catch (error) {
            console.error('Error saving entries:', error);
            alert('Error saving data. Please check your browser storage settings.');
        }
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    appInstance = new CoffeeJournal();
});
