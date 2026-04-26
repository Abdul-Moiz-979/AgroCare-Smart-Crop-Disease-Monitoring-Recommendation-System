// Utility functions for AgroCare application

/**
 * Validate image file
 * @param {File} file - The file to validate
 * @returns {Object} - Validation result with isValid and error message
 */
export const validateImageFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!file) {
        return { isValid: false, error: 'No file selected' };
    }

    if (!allowedTypes.includes(file.type)) {
        return {
            isValid: false,
            error: 'Invalid file type. Please upload JPG, PNG, or WebP images only.'
        };
    }

    if (file.size > maxSize) {
        return {
            isValid: false,
            error: `File size too large. Maximum size is ${formatFileSize(maxSize)}.`
        };
    }

    return { isValid: true, error: null };
};

/**
 * Format file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - d);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        if (diffHours === 0) {
            const diffMinutes = Math.floor(diffTime / (1000 * 60));
            return diffMinutes === 0 ? 'Just now' : `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
        }
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
};

/**
 * Format date to full format
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatFullDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Generate random disease prediction based on crop type
 * @param {string} cropType - Type of crop (wheat, maize, rice)
 * @param {Object} diseases - Disease database
 * @returns {Object} - Random disease prediction
 */
export const generateRandomPrediction = (cropType, diseases) => {
    if (!cropType || !diseases[cropType]) {
        return null;
    }

    const cropDiseases = diseases[cropType];
    const randomIndex = Math.floor(Math.random() * cropDiseases.length);

    return cropDiseases[randomIndex];
};

/**
 * Save prediction to localStorage
 * @param {Object} prediction - Prediction data to save
 * @returns {boolean} - Success status
 */
export const savePredictionToHistory = (prediction) => {
    try {
        const history = getPredictionHistory();
        const newPrediction = {
            ...prediction,
            id: `pred_${Date.now()}`,
            date: new Date().toISOString()
        };

        history.unshift(newPrediction);

        // Keep only last 50 predictions
        const limitedHistory = history.slice(0, 50);

        localStorage.setItem('agrocare_history', JSON.stringify(limitedHistory));
        return true;
    } catch (error) {
        console.error('Error saving prediction:', error);
        return false;
    }
};

/**
 * Get prediction history from localStorage
 * @returns {Array} - Array of predictions
 */
export const getPredictionHistory = () => {
    try {
        const history = localStorage.getItem('agrocare_history');
        return history ? JSON.parse(history) : [];
    } catch (error) {
        console.error('Error getting prediction history:', error);
        return [];
    }
};

/**
 * Clear all prediction history
 * @returns {boolean} - Success status
 */
export const clearPredictionHistory = () => {
    try {
        localStorage.removeItem('agrocare_history');
        return true;
    } catch (error) {
        console.error('Error clearing history:', error);
        return false;
    }
};

/**
 * Delete single prediction from history
 * @param {string} predictionId - ID of prediction to delete
 * @returns {boolean} - Success status
 */
export const deletePrediction = (predictionId) => {
    try {
        const history = getPredictionHistory();
        const updatedHistory = history.filter(pred => pred.id !== predictionId);
        localStorage.setItem('agrocare_history', JSON.stringify(updatedHistory));
        return true;
    } catch (error) {
        console.error('Error deleting prediction:', error);
        return false;
    }
};

/**
 * Get URL parameters
 * @param {string} paramName - Parameter name
 * @returns {string|null} - Parameter value
 */
export const getUrlParameter = (paramName) => {
    if (typeof window === 'undefined') return null;

    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramName);
};

/**
 * Create URL with parameters
 * @param {string} path - Base path
 * @param {Object} params - Parameters object
 * @returns {string} - URL with parameters
 */
export const createUrlWithParams = (path, params) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            searchParams.append(key, value);
        }
    });

    const queryString = searchParams.toString();
    return queryString ? `${path}?${queryString}` : path;
};

/**
 * Get severity color
 * @param {string} severity - Severity level
 * @returns {string} - CSS color class name
 */
export const getSeverityColor = (severity) => {
    const colors = {
        'High': 'high',
        'Medium': 'medium',
        'Low': 'low',
        'None': 'none'
    };

    return colors[severity] || 'medium';
};

/**
 * Get confidence level
 * @param {number} confidence - Confidence percentage
 * @returns {string} - Confidence level description
 */
export const getConfidenceLevel = (confidence) => {
    if (confidence >= 90) return 'Very High';
    if (confidence >= 80) return 'High';
    if (confidence >= 70) return 'Moderate';
    if (confidence >= 60) return 'Low';
    return 'Very Low';
};

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert file to base64
 * @param {File} file - File to convert
 * @returns {Promise<string>} - Base64 string
 */
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};
