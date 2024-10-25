const jsdom = require("jsdom");
const { JSDOM } = jsdom;

class Player {
    constructor(url) {
        this.html = null;
        this.url = url;
        this.dom;
        this.name;
        this.age;
        this.height;
        this.country;
        this.value;
        this.position;
        this.club;
        this.photo;
    }

    async setHTMLBody() {
        const resp = await fetch(this.url);
        this.html = await resp.text();
        this.dom = new JSDOM(this.html);
    }

    async getHTMLBody() {
        while (this.html == null) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        return this.html
    }

    getStats() {
        this.name = this.getName();
        this.age = this.getAge();
        this.country = this.getCountry();
        this.height = this.getHeight();
        this.club = this.getClub();
        this.photo = this.getPhoto();
        this.position = this.getPosition();
        this.value = this.getValue();

        if (!this.name || !this.age || !this.height || !this.photo || !this.position || !this.value) {
            return false;
        }

        return {
            name: this.name, 
            age: this.age, 
            height: this.height,
            country: this.country,
            club: this.club,
            photo: this.photo,
            pos: this.position,
            value: this.value
        }
    }

    getAge() {
        const dob = this.dom.window.document.querySelector('[itemprop="birthDate"]')
        const str = dob.textContent.trim()
        const age = str.match(/\((\d+)\)/);
        return Number(age[1])
    }

    getCountry() {
        let country = this.dom.window.document.querySelector('img.flaggenrahmen.flagge');
        if (country) {
            return country.title ?? '';
        }
        country = this.dom.window.document.querySelector('img.flaggenrahmen');
        return country.title ?? '';
        //maybe add it so it uses internal images of flags, and just matches it based on the name
        //this is because the img is too low quality
    }

    getHeight() {
        const height = this.dom.window.document.querySelector('[itemprop="height"]');
        if (height) {
            return height.textContent.trim().replace(',','.').slice(0,4)
        }
        console.log(this.name, 'no height')
        return ''
    }

    getClub() {
        const club = this.dom.window.document.querySelector('a.data-header__box__club-link');
        const img = club.firstElementChild
        const srcset = img.getAttribute('srcset');

        const urls = srcset.split(',').map((entry) => entry.trim());
        const parsedUrls = urls.map((url) => {
            const [imageURL, resolution] = url.split(' ');
            return { imageURL, resolution };
        });
        return parsedUrls[parsedUrls.length -1].imageURL
    }

    getName() {
        const h1 = this.dom.window.document.querySelector('h1.data-header__headline-wrapper');
        const h1Text = h1.childNodes;

        let name = '';
        h1Text.forEach(node => {
            name += (node.textContent.trim() && !(/\d/.test(node.textContent.trim())))? node.textContent.trim() + ' ':  ''
        })

        return name.trim();
    }

    getPhoto() {
        const photo = this.dom.window.document.querySelector('img.data-header__profile-image'); 
        return photo ? photo.src : '';
    }

    getValue() {
        const price = this.dom.window.document.querySelector('a.data-header__market-value-wrapper');
        if (!price) {
            console.log(this.name, 'no price')
            return ''
        }
        const value = Number(price.childNodes[1].textContent)
        const units = price.childNodes[2].textContent
        
        return units == 'm' ? value : value / 1000
    }

    getPosition() {
        const t = this.dom.window.document.querySelectorAll('span.data-header__content');
        let pos = '';
        t.forEach(item => {
            switch (item.textContent.trim()) {
                case 'Goalkeeper': {
                    pos = 'GK';
                    break;
                }
                case 'Centre-Back': {
                    pos = 'DEF';
                    break;
                }
                case 'Right-Back': {
                    pos = 'DEF';
                    break;
                }
                case 'Left-Back': {
                    pos = 'DEF';
                    break;
                }
                case 'Defensive Midfield': {
                    pos = 'MID';
                    break;
                }
                case 'Central Midfield': {
                    pos = 'MID';
                    break;
                }
                case 'Left Midfield': {
                    pos = 'MID';
                    break;
                }
                case 'Right Midfield': {
                    pos = 'MID';
                    break;
                }
                case 'Attacking Midfield': {
                    pos = 'MID';
                    break;
                }
                case 'Left Winger': {
                    pos = 'FWD';
                    break;
                }
                case 'Right Winger': {
                    pos = 'FWD';
                    break;
                }
                case 'Centre Forward': {
                    pos = 'FWD';
                    break;
                }
            }
        })
        return pos;
    }
}

module.exports = {
    Player
}