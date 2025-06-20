// --- JSONBin HighScore Manager ---
class JSONBinHighScores {
  constructor() {
    // Provided credentials
    this.apiKey = '$2a$10$XRHnUXHeO2GrvFemcCQxvOZTa9EyvkQsd8HELile0yws/UkuVIC46'; // X-Master-Key
    this.accessKey = '$2a$10$7wznneBgwFUQbnCsNIQ.eO/O9UBheBQomVH6oNlSv7voOtxDaawFW'; // X-Access-Key
    this.accessKeyId = '684eb2228960c979a5aa3f65'; // Access Key ID
    // Use a fixed bin ID for global highscores across all devices
    this.binId = '6853faef8960c979a5acc795'; // Fixed global bin ID
    this.baseUrl = 'https://api.jsonbin.io/v3/b';
    this.binName = 'SUBMARINE';
  }

  async initializeBin() {
    try {
      // First, try to access the fixed global bin
      const response = await fetch(`${this.baseUrl}/${this.binId}`, {
        headers: {
          'X-Master-Key': this.apiKey,
          'X-Access-Key': this.accessKey
        }
      });
      
      if (response.ok) {
        console.log('Using existing global SUBMARINE highscore bin:', this.binId);
        return true;
      } else {
        console.error('Global bin not accessible, status:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error accessing global bin:', error);
      return false;
    }
  }

  async getHighScores() {
    if (!this.binId) {
      const initialized = await this.initializeBin();
      if (!initialized) return [];
    }

    try {
      const response = await fetch(`${this.baseUrl}/${this.binId}/latest`, {
        headers: {
          'X-Master-Key': this.apiKey,
          'X-Access-Key': this.accessKey
        }
      });

      if (response.ok) {
        const data = await response.json();
        const scores = data.record.scores || [];
        return scores.sort((a, b) => b.score - a.score).slice(0, 10);
      }
      return [];
    } catch (error) {
      console.error('Error fetching scores:', error);
      return [];
    }
  }

  async submitScore(playerName, score) {
    if (!this.binId) {
      const initialized = await this.initializeBin();
      if (!initialized) return false;
    }

    try {
      const currentData = await this.getCurrentBinData();
      if (!currentData) return false;

      const newScore = {
        name: playerName.substring(0, 20),
        score: score,
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now(),
        gameVersion: '1.0'
      };

      if (!currentData.scores) currentData.scores = [];
      currentData.scores.push(newScore);
      currentData.scores = currentData.scores
        .sort((a, b) => b.score - a.score)
        .slice(0, 50);

      const response = await fetch(`${this.baseUrl}/${this.binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': this.apiKey,
          'X-Access-Key': this.accessKey
        },
        body: JSON.stringify(currentData)
      });

      return response.ok;
    } catch (error) {
      console.error('Error submitting score:', error);
      return false;
    }
  }

  async getCurrentBinData() {
    try {
      const response = await fetch(`${this.baseUrl}/${this.binId}/latest`, {
        headers: {
          'X-Master-Key': this.apiKey,
          'X-Access-Key': this.accessKey
        }
      });
      return response.ok ? (await response.json()).record : null;
    } catch (error) {
      return null;
    }
  }

  async isHighScore(score) {
    const scores = await this.getHighScores();
    return scores.length < 10 || score > (scores[scores.length - 1]?.score || 0);
  }
}