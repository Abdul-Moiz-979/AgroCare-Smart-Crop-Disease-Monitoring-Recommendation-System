// Initialize demo user in localStorage
export function initializeDemoUser() {
    if (typeof window === 'undefined') return;

    const users = JSON.parse(localStorage.getItem(' agrocare_users') || '[]');

    // Check if demo user already exists
    const demoExists = users.find(u => u.email === 'demo@agrocare.com');

    if (!demoExists) {
        const demoUser = {
            id: 'user_demo',
            name: 'Demo User',
            email: 'demo@agrocare.com',
            password: 'demo123',
            location: 'Punjab, Pakistan',
            farmSize: '25 acres',
            primaryCrops: ['Wheat', 'Rice', 'Maize'],
            joinedDate: '2025-06-15T00:00:00.000Z',
            totalScans: 247
        };

        users.push(demoUser);
        localStorage.setItem('agrocare_users', JSON.stringify(users));
    }
}
