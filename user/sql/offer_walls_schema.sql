-- SQL Schema for Offer Walls functionality

-- Create offer_providers table to store information about different offer walls
CREATE TABLE IF NOT EXISTS offer_providers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    website VARCHAR(255),
    api_url VARCHAR(255) NOT NULL,
    api_key VARCHAR(255) NOT NULL,
    provider_type ENUM('offerwall', 'survey', 'task', 'video') NOT NULL DEFAULT 'offerwall',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create offers table to store individual offers from providers
CREATE TABLE IF NOT EXISTS offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provider_id INT NOT NULL,
    external_offer_id VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    image VARCHAR(255),
    payout DECIMAL(10,2) NOT NULL,
    payout_type ENUM('points', 'cash') NOT NULL DEFAULT 'points',
    url VARCHAR(512) NOT NULL,
    device_support ENUM('All', 'Desktop', 'Mobile', 'Android', 'iOS') NOT NULL DEFAULT 'All',
    countries VARCHAR(255), -- Comma-separated country codes
    category VARCHAR(100),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    expires_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES offer_providers(id) ON DELETE CASCADE,
    UNIQUE KEY idx_provider_external_id (provider_id, external_offer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create user_offers table to track user interactions with offers
CREATE TABLE IF NOT EXISTS user_offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    offer_id INT NOT NULL,
    provider_id INT NOT NULL,
    transaction_id VARCHAR(100) NULL,
    status ENUM('clicked', 'started', 'completed', 'rejected', 'pending', 'paid') NOT NULL,
    points_awarded DECIMAL(10,2) DEFAULT 0,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    completion_date DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES offer_providers(id) ON DELETE CASCADE,
    UNIQUE KEY idx_user_offer_transaction (user_id, offer_id, transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create offer_callbacks table to log raw callbacks from providers
CREATE TABLE IF NOT EXISTS offer_callbacks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provider_id INT NOT NULL,
    external_offer_id VARCHAR(100) NULL,
    transaction_id VARCHAR(100) NULL,
    user_id INT NULL,
    raw_data TEXT NOT NULL,
    ip_address VARCHAR(45) NULL,
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES offer_providers(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create indexes for performance
CREATE INDEX idx_offers_provider_id ON offers(provider_id);
CREATE INDEX idx_offers_is_active ON offers(is_active);
CREATE INDEX idx_offers_device_support ON offers(device_support);
CREATE INDEX idx_user_offers_user_id ON user_offers(user_id);
CREATE INDEX idx_user_offers_status ON user_offers(status);
CREATE INDEX idx_callbacks_provider_transaction ON offer_callbacks(provider_id, transaction_id);

-- Sample INSERT statements for offer_providers (you'll need to add your own API keys)
INSERT INTO offer_providers (name, description, icon, website, api_url, api_key, provider_type, is_active, is_featured, sort_order)
VALUES 
('OfferToro', 'Complete surveys, download apps, and more to earn rewards', '/assets/img/providers/offertoro.png', 'https://www.offertoro.com', 'https://api.offertoro.com', 'YOUR_API_KEY', 'offerwall', TRUE, TRUE, 1),
('AdGate', 'Earn points by completing offers, surveys, and more', '/assets/img/providers/adgate.png', 'https://adgatemedia.com', 'https://api.adgatemedia.com', 'YOUR_API_KEY', 'offerwall', TRUE, FALSE, 2),
('Pollfish', 'Complete surveys and earn rewards', '/assets/img/providers/pollfish.png', 'https://www.pollfish.com', 'https://api.pollfish.com', 'YOUR_API_KEY', 'survey', TRUE, FALSE, 3),
('AdscendMedia', 'Complete offers and earn rewards', '/assets/img/providers/adscend.png', 'https://adscendmedia.com', 'https://api.adscendmedia.com', 'YOUR_API_KEY', 'offerwall', TRUE, FALSE, 4),
('AyeT-Studios', 'Complete offers and play games to earn rewards', '/assets/img/providers/ayet.png', 'https://www.ayetstudios.com', 'https://api.ayetstudios.com', 'YOUR_API_KEY', 'offerwall', TRUE, TRUE, 5),
('KiwiWall', 'Complete offers and surveys to earn rewards', '/assets/img/providers/kiwiwall.png', 'https://www.kiwiwall.com', 'https://api.kiwiwall.com', 'YOUR_API_KEY', 'offerwall', TRUE, FALSE, 6); 