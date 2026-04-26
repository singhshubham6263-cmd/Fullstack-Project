const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Load models
const Phrase = require('./models/Phrase');

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const phrases = [
  { region: "KYOTO, JAPAN", language: "ja", originalPhrase: "一期一会", genericMeaning: "Cherish every encounter, for it will never recur in the same way again." },
  { region: "MADRID, SPAIN", language: "es", originalPhrase: "Ponerse las pilas", genericMeaning: "To wake up, get energized, or start working hard on a specific task." },
  { region: "BERLIN, GERMANY", language: "de", originalPhrase: "Dumm wie Bohnenstroh", genericMeaning: "Extremely unintelligent or lacking common sense." },
  { region: "PARIS, FRANCE", language: "fr", originalPhrase: "Avoir le cafard", genericMeaning: "To be depressed, melancholy, or generally 'feeling blue'." },
  { region: "DUBAI, UAE", language: "ar", originalPhrase: "على راسي", genericMeaning: "Anything for you; I'll do it with pleasure and respect." },
  { region: "SHANGHAI, CHINA", language: "zh", originalPhrase: "马到成功", genericMeaning: "Wishing someone instant success or a smooth project completion." },
  { region: "US", language: "en", originalPhrase: "piece of cake", genericMeaning: "very easy" },
  { region: "US", language: "en", originalPhrase: "raining cats and dogs", genericMeaning: "raining heavily" }
];

// Import into DB
const importData = async () => {
  try {
    // Clear existing to avoid duplicates if run multiple times
    await Phrase.deleteMany();
    
    // Create new
    await Phrase.create(phrases);

    console.log('Data Imported!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();
