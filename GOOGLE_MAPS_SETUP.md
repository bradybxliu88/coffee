# Google Maps API Setup Guide

To enable the location features in your Coffee Shop Journal app, you need to set up a Google Maps API key. Follow these steps:

## Step 1: Get a Google Maps API Key

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a Project** (if you don't have one)
   - Click "Select a project" at the top
   - Click "NEW PROJECT"
   - Name it (e.g., "Coffee Journal")
   - Click "CREATE"

3. **Enable Required APIs**
   - Go to "APIs & Services" > "Library"
   - Search for and enable these APIs:
     - **Maps JavaScript API**
     - **Places API**
   - Click "ENABLE" for each

4. **Create API Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "CREATE CREDENTIALS"
   - Select "API key"
   - Copy your API key (looks like: `AIzaSyA...`)

5. **Restrict Your API Key** (Recommended for security)
   - Click on your API key to edit it
   - Under "Application restrictions":
     - Select "HTTP referrers (web sites)"
     - Add your website URL (or `*` for testing)
   - Under "API restrictions":
     - Select "Restrict key"
     - Check "Maps JavaScript API" and "Places API"
   - Click "SAVE"

## Step 2: Add API Key to Your App

1. **Open `index.html`**

2. **Find this line** (around line 8):
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&libraries=places&callback=initMap" async defer></script>
   ```

3. **Replace `YOUR_API_KEY_HERE` with your actual API key:**
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA1234567890abcdefg&libraries=places&callback=initMap" async defer></script>
   ```

4. **Save the file**

## Step 3: Test It Out

1. Open `index.html` in your browser
2. Try adding a new coffee shop
3. Click in the "Location" field
4. Start typing an address or place name
5. You should see autocomplete suggestions!
6. Select a location and a map preview should appear

## Pricing Information

Google Maps offers a **free tier** with generous limits:
- $200 free credit per month
- Covers approximately:
  - 28,000 map loads per month
  - 100,000 autocomplete requests per month

For personal use tracking coffee shops, you'll likely stay within the free tier.

## Troubleshooting

### Maps not loading?
- Check browser console (F12) for error messages
- Verify your API key is correct
- Make sure both APIs are enabled (Maps JavaScript API and Places API)

### "This page can't load Google Maps correctly"
- Your API key might not have billing enabled
- Go to Google Cloud Console > Billing and add a payment method (you won't be charged within free tier)

### Autocomplete not working?
- Make sure "Places API" is enabled
- Check that your API key isn't restricted to only Maps JavaScript API

## Without API Key

If you don't want to set up Google Maps, the app will still work perfectly fine! The location features are optional:
- All other features work normally
- You just won't see the map displays
- You can still add and track coffee shops without locations

## Need Help?

- Google Maps API Documentation: https://developers.google.com/maps/documentation
- API Key Help: https://developers.google.com/maps/documentation/javascript/get-api-key
