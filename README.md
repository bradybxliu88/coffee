# Coffee Shop Journal

A simple, elegant web app to track and rate all the coffee shops you visit. Keep a mini journal of what you liked and didn't like about each place!

## Features

- **Rate Coffee Shops**: 1-5 star rating system
- **Track Visits**: Record the date of each visit
- **Location Mapping**: Add shop locations with Google Maps integration (optional)
- **Journal Entries**: Note what you liked and didn't like about each shop
- **Additional Notes**: Add any extra thoughts or details
- **Sort & Filter**: Sort by date, rating, or name
- **Persistent Storage**: All data saved locally in your browser
- **Responsive Design**: Works on desktop and mobile

## How to Use

1. **Open the app**: Simply open `index.html` in your web browser
2. **Add a coffee shop**:
   - Fill in the shop name
   - (Optional) Search for the location - autocomplete will suggest addresses
   - Select the visit date
   - Click on the stars to rate (1-5)
   - Write what you liked and didn't like
   - Add any additional notes
   - Click "Add Entry"
3. **View your entries**: All your coffee shop visits appear on the right side
4. **Expand details**: Click on any entry card to see the full journal details
5. **Edit an entry**: Click the "Edit" button on any entry
6. **Delete an entry**: Click the "Delete" button (you'll be asked to confirm)
7. **Sort entries**: Use the dropdown to sort by date, rating, or name

## Quick Start

```bash
# Just open the file in your browser
open index.html
# or on Linux
xdg-open index.html
# or on Windows
start index.html
```

No installation or server needed!

## Google Maps Setup (Optional)

To enable location features with interactive maps:

1. Get a free Google Maps API key (see [GOOGLE_MAPS_SETUP.md](GOOGLE_MAPS_SETUP.md) for detailed instructions)
2. Open `index.html`
3. Replace `YOUR_API_KEY_HERE` with your actual API key on line 8
4. Save and reload the app

**Without an API key:** The app works perfectly fine! Location features are optional - you can still track all your coffee shops without maps.

## Data Storage

All your coffee shop entries are stored locally in your browser using localStorage. This means:
- Your data never leaves your computer
- No internet connection required
- Data persists between sessions
- Data is tied to your browser (clearing browser data will remove entries)

## Technology

- Pure HTML, CSS, and JavaScript
- No frameworks or dependencies
- Works offline
- Mobile-friendly responsive design

Enjoy tracking your coffee adventures!