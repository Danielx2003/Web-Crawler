# Web Scraper for transfermarkt.co.uk
This web scraper scrapes data from www.transfermarkt.co.uk. 
The program gathers data about footballers for a given league, based on the URL the user enters. Data includes: name, age, height, position, preferred foot, club, country and player photo. 
Then, the program stores the data within a MongoDB database.

The purpose of the web scraper, was to bypass issues with gathering data from API's. Whilst looking for a suitable API for my Footballer Guessing Game, Footle, I discovered that many API's had low rate limits, and many cost money to use. To combat this, I decided to create a web scraper which gathered data from a reliable website with up to date information about players, whilst also covering a vast amount of leagues.

The program takes advanatge of jsDOM, a JavaScript library used to take HTML files from websites, and allow them to be accessed and manipulated using Document Object Model manipulation.
Beautiful Soup is an alterantive library for web scraping, but as the code was written in JavaScript, I opted to go with jsDOM.

Whilst coding this project, many obstacles had to be overcome. 
A major challenge was handling errors within the program. As there are many requests made, it was important that 1 bad request for a player would not result in the whole program crashing. To solve this, default player stats were added, as well as try and except statements to ensure the smooth running of the code.

## Executing the code
Once the code has been added to Visual Studio, you will need to alter the code in places. First of all, you need to change this line of code. ![image](https://github.com/Danielx2003/Web-Crawler/assets/70431670/528ba7b9-1454-4886-b34d-3de73964e5fa)
