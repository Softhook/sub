/**
 * MOD file parser
 * Basic implementation of a MOD file parser for music module playback
 */
class Mod {
    constructor(buffer) {
        // Parse the MOD file from the provided ArrayBuffer
        this.parseModFile(buffer);
    }

    parseModFile(buffer) {
        // Create a DataView to read binary data
        const view = new DataView(buffer);
        const bytes = new Uint8Array(buffer);
        
        // Parse header
        this.title = this.extractString(bytes, 0, 20).trim();
        
        // Number of instruments (samples)
        this.instruments = [null]; // Start with null at index 0
        
        // Determine MOD type and number of instruments
        let numInstruments = 15; // Default for standard 15-instrument MOD
        let patternTableOffset = 20 + (30 * numInstruments);
        
        // Check for 31-instrument formats
        const possibleModType = this.extractString(bytes, 1080, 4);
        if (['M.K.', '4CHN', 'FLT4'].includes(possibleModType)) {
            numInstruments = 31;
            patternTableOffset = 20 + (30 * numInstruments);
        }
        
        // Parse instruments (samples)
        let offset = 20; // Start after title
        for (let i = 1; i <= numInstruments; i++) {
            const instrument = {
                name: this.extractString(bytes, offset, 22).trim(),
                length: view.getUint16(offset + 22) * 2, // Length in bytes
                finetune: bytes[offset + 24] & 0x0f, // Lower 4 bits only
                volume: bytes[offset + 25],
                repeatOffset: view.getUint16(offset + 26) * 2,
                repeatLength: view.getUint16(offset + 28) * 2,
                bytes: null // Will be filled later
            };
            
            // Determine if the sample is looped
            instrument.isLooped = instrument.repeatLength > 2;
            
            this.instruments.push(instrument);
            offset += 30; // Move to next instrument
        }
        
        // Pattern table
        const songLength = bytes[patternTableOffset]; // Number of patterns in the song
        this.length = songLength;
        
        // Maximum pattern number found in pattern table
        let maxPattern = 0;
        this.patternTable = [];
        for (let i = 0; i < songLength; i++) {
            const patternNumber = bytes[patternTableOffset + 2 + i];
            this.patternTable.push(patternNumber);
            maxPattern = Math.max(maxPattern, patternNumber);
        }
        
        // Calculate pattern data offset
        const patternDataOffset = patternTableOffset + 130; // 128 bytes for pattern table + 2 for song length and flag
        
        // Parse patterns
        this.patterns = [];
        for (let i = 0; i <= maxPattern; i++) {
            const pattern = {
                rows: []
            };
            
            // Each pattern has 64 rows
            for (let row = 0; row < 64; row++) {
                const rowData = {
                    notes: []
                };
                
                // Each row has 4 channels
                for (let channel = 0; channel < 4; channel++) {
                    const offset = patternDataOffset + i * 1024 + row * 16 + channel * 4;
                    
                    // Extract note data
                    const byte1 = bytes[offset];
                    const byte2 = bytes[offset + 1];
                    const byte3 = bytes[offset + 2];
                    const byte4 = bytes[offset + 3];
                    
                    const period = ((byte1 & 0x0F) << 8) | byte2;
                    const instrument = (byte1 & 0xF0) | ((byte3 & 0xF0) >> 4);
                    const effectId = byte3 & 0x0F;
                    const effectData = byte4;
                    
                    rowData.notes.push({
                        period: period > 0 ? period : 0,
                        instrument: instrument > 0 ? instrument : 0,
                        hasEffect: (effectId !== 0 || effectData !== 0),
                        effectId,
                        effectData,
                        effectHigh: (effectData & 0xF0) >> 4,
                        effectLow: effectData & 0x0F
                    });
                }
                
                pattern.rows.push(rowData);
            }
            
            this.patterns.push(pattern);
        }
        
        // Calculate sample data offset
        let sampleDataOffset = patternDataOffset + (maxPattern + 1) * 1024;
        
        // Extract sample data
        for (let i = 1; i <= numInstruments; i++) {
            const instrument = this.instruments[i];
            if (instrument.length > 0) {
                // Extract sample bytes
                instrument.bytes = new Int8Array(instrument.length);
                for (let j = 0; j < instrument.length; j++) {
                    instrument.bytes[j] = bytes[sampleDataOffset + j];
                }
                sampleDataOffset += instrument.length;
            } else {
                instrument.bytes = new Int8Array(0);
            }
        }
    }
    
    extractString(bytes, offset, length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            const char = bytes[offset + i];
            if (char === 0) break; // Stop at null terminator
            result += String.fromCharCode(char);
        }
        return result;
    }
}

// Make Mod class available globally
window.Mod = Mod;
