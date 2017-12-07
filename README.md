_Disclaimer: This is an educational project to identify bot activity on Twitter._
# Robobot: Oto Boto
![](/extension/icons/icon128.png)<br><br>
_**A chrome extension to change the way you view your newsfeed**_
## What does it do?
Robobot provides the user with additional bot-detecting features whenever they access Twitter. These additional resources allow the user to filter bot activity in their newsfeed as well as inspect tweets and profiles they find suspicious. Specifically these main features include:
* Automatic scanning of tweet posters currently in the user's feed
* Loading icons to show the status of scanning
* Bot or not icons displayed once scanning has finished
* Blurred tweets that have been labeled as bot posted
* Modal to view detailed results of tweet
* Hoverable badge to provide additional details
* Highlight button in chrome popup to outline clickable elements that can be tested for bot influence
* Power off functionality for highlight button to remove highlighting
* Bot threshold score slider in chrome popup to change the bot tolerance in the feed
* Chrome popup state saved across page changes
* Whitelist functionality to remove bot filtering of selected profile
* Blacklist functionality to add bot filtering of selected profile
* And more...

## How do I use it?
Oto Boto works by making use of a Flask server running in the background that interacts with the Chrome extension.<br><br> 
**Loading Chrome extension**
1. Download this repository
2. Open Chrome and click the menu icon in the top right portion of the window
3. Go to More tools -> Extensions
4. Then click "Load unpacked extension..."
5. Navigate to the downloaded repository and select the "Extension" subfolder
6. Make sure the enabled extension checkbox is selected
7. Your extension is ready to use!

**Setting up Flask server (Mac)**<br>
1. Navigate inside of the "Server" subfolder of this downloaded repository in the Terminal
1. Make sure Flask is installed, if not use the command "pip install Flask"
2. Set the environment variable with the command "export FLASK_APP=hello.py"
3. Start the Flask server with the command "flask run"
4. Your Flask server is ready to use!

