const PhraseIntelligenceService = require('../../services/PhraseIntelligenceService');
const Phrase = require('../../models/Phrase');

// Mock Mongoose Model
jest.mock('../../models/Phrase');

describe('PhraseIntelligenceService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return original text if no phrases match', async () => {
    // Mock the Phrase.find method to return an empty array
    Phrase.find.mockResolvedValue([]);

    const result = await PhraseIntelligenceService.processText('Hello world', 'en', 'US');
    
    expect(result.processedText).toBe('Hello world');
    expect(result.phrasesReplaced).toEqual([]);
    expect(Phrase.find).toHaveBeenCalledWith({ language: 'en', region: 'US' });
  });

  it('should replace regional phrase with generic meaning', async () => {
    // Mock Phrase.find to return our idioms
    Phrase.find.mockResolvedValue([
      { originalPhrase: 'piece of cake', genericMeaning: 'very easy' },
      { originalPhrase: 'raining cats and dogs', genericMeaning: 'raining heavily' }
    ]);

    const result = await PhraseIntelligenceService.processText('The test was a piece of cake', 'en', 'US');
    
    expect(result.processedText).toBe('The test was a very easy');
    expect(result.phrasesReplaced.length).toBe(1);
    expect(result.phrasesReplaced[0].originalPhrase).toBe('piece of cake');
    expect(result.phrasesReplaced[0].genericMeaning).toBe('very easy');
  });

  it('should replace multiple phrases and sort by length to avoid partial replacements', async () => {
    Phrase.find.mockResolvedValue([
      { originalPhrase: 'cake', genericMeaning: 'dessert' },
      { originalPhrase: 'piece of cake', genericMeaning: 'very easy' }
    ]);

    const result = await PhraseIntelligenceService.processText('This is a piece of cake', 'en', 'US');
    
    // "piece of cake" should be matched before "cake"
    expect(result.processedText).toBe('This is a very easy');
    expect(result.phrasesReplaced.length).toBe(1);
    expect(result.phrasesReplaced[0].originalPhrase).toBe('piece of cake');
  });
});
