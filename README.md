# Web Scraper for transfermarkt.co.uk
Description: 
This web scraper scrapes data from www.transfermarkt.co.uk. 
The program gathers data about footballers for a given league, based on the URL the user enters. Data includes: name, age, height, position, preferred foot, club, country and player photo. 
Then, the program stores the data within a MongoDB database.

The purpose of the web scraper, was to bypass issues with gathering data from API's. Whilst looking for a suitable API for my Footballer Guessing Game, Footle, I discovered that many API's had low rate limits, and many cost money to use. To combat this, I decided to create a web scraper which gathered data from a reliable website - transfermarkt.co.uk. 

The program takes advanatge of jsDOM, a JavaScript library used to take HTML files from websites, and allow them to be accessed and manipulated using Document Object Model manipulation.
Beautiful Soup is an alterantive library for web scraping, but as the code was written in JavaScript, I opted to go with jsDOM.

Whilst coding this project, many obstacles had to be overcome. 
A major challenge was 
