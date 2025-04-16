-- SQL to insert offer wall data into the existing tables from improved-schema.sql

-- Insert data into offer_walls table
INSERT INTO `offer_walls` (`name`, `api_key`, `api_secret`, `base_url`, `status`, `image_url`, `description`)
VALUES
('OfferToro', 'YOUR_OFFERTORO_API_KEY', 'YOUR_OFFERTORO_SECRET', 'https://www.offertoro.com/api', TRUE, '/assets/img/providers/offertoro.png', 'Complete surveys, download apps, and more to earn rewards'),
('AdGate', 'YOUR_ADGATE_API_KEY', 'YOUR_ADGATE_SECRET', 'https://api.adgatemedia.com', TRUE, '/assets/img/providers/adgate.png', 'Earn points by completing offers, surveys, and more'),
('Pollfish', 'YOUR_POLLFISH_API_KEY', 'YOUR_POLLFISH_SECRET', 'https://api.pollfish.com', TRUE, '/assets/img/providers/pollfish.png', 'Complete surveys and earn rewards'),
('AdscendMedia', 'YOUR_ADSCEND_API_KEY', 'YOUR_ADSCEND_SECRET', 'https://api.adscendmedia.com', TRUE, '/assets/img/providers/adscend.png', 'Complete offers and earn rewards'),
('AyeT-Studios', 'YOUR_AYET_API_KEY', 'YOUR_AYET_SECRET', 'https://api.ayetstudios.com', TRUE, '/assets/img/providers/ayet.png', 'Complete offers and play games to earn rewards'),
('KiwiWall', 'YOUR_KIWIWALL_API_KEY', 'YOUR_KIWIWALL_SECRET', 'https://api.kiwiwall.com', TRUE, '/assets/img/providers/kiwiwall.png', 'Complete offers and surveys to earn rewards');

-- Sample offers data for each provider
-- Note: You would populate these from the actual offer wall APIs in production
-- OfferToro offers (wall_id = 1)
INSERT INTO `offers` (`offer_wall_id`, `external_offer_id`, `title`, `description`, `instructions`, `points`, `image_url`, `offer_url`, `countries`, `category`, `status`)
VALUES
(1, 'ot_1001', 'Install Game App XYZ', 'Download and play this exciting new game!', 'Install the app, create an account, and reach level 5 to earn rewards.', 250, 'https://example.com/images/game_xyz.jpg', 'https://offertoro.com/track/1001', 'US,CA,UK,AU', 'Games', TRUE),
(1, 'ot_1002', 'Survey: Consumer Habits', 'Share your opinion on consumer products', 'Complete a 10-minute survey about your shopping preferences.', 100, 'https://example.com/images/survey.jpg', 'https://offertoro.com/track/1002', 'US,CA,UK', 'Surveys', TRUE),
(1, 'ot_1003', 'Sign up for Premium Trial', 'Get a 7-day trial of Premium Music Service', 'Sign up using valid credit card. Cancel anytime before trial ends.', 300, 'https://example.com/images/music_service.jpg', 'https://offertoro.com/track/1003', 'US,CA,UK,AU,DE,FR', 'Free Trials', TRUE);

-- AdGate offers (wall_id = 2)
INSERT INTO `offers` (`offer_wall_id`, `external_offer_id`, `title`, `description`, `instructions`, `points`, `image_url`, `offer_url`, `countries`, `category`, `status`)
VALUES
(2, 'ag_2001', 'Fantasy RPG Adventure', 'Embark on an epic journey', 'Install the game and reach level 10 to earn your reward.', 400, 'https://example.com/images/fantasy_rpg.jpg', 'https://adgate.com/track/2001', 'US,CA,UK,AU', 'Games', TRUE),
(2, 'ag_2002', 'Credit Score Check', 'Get your free credit report', 'Sign up and complete the verification process to view your credit score.', 150, 'https://example.com/images/credit_check.jpg', 'https://adgate.com/track/2002', 'US', 'Finance', TRUE);

-- Pollfish offers (wall_id = 3)
INSERT INTO `offers` (`offer_wall_id`, `external_offer_id`, `title`, `description`, `instructions`, `points`, `image_url`, `offer_url`, `countries`, `category`, `status`)
VALUES
(3, 'pf_3001', 'Technology Survey', 'Share your opinions on latest tech', 'Complete a 15-minute survey about your technology usage.', 125, 'https://example.com/images/tech_survey.jpg', 'https://pollfish.com/track/3001', 'US,CA,UK,AU,DE,FR,JP', 'Surveys', TRUE),
(3, 'pf_3002', 'Lifestyle Questionnaire', 'Answer questions about your lifestyle', 'Complete this short lifestyle survey to earn points.', 75, 'https://example.com/images/lifestyle.jpg', 'https://pollfish.com/track/3002', 'US,CA,UK,DE,FR', 'Surveys', TRUE);

-- AdscendMedia offers (wall_id = 4)
INSERT INTO `offers` (`offer_wall_id`, `external_offer_id`, `title`, `description`, `instructions`, `points`, `image_url`, `offer_url`, `countries`, `category`, `status`)
VALUES
(4, 'as_4001', 'Mobile Casino Game', 'Play and win in this casino game', 'Install the app and reach level 20 to earn your reward.', 350, 'https://example.com/images/casino_game.jpg', 'https://adscend.com/track/4001', 'US,CA,UK,AU', 'Games', TRUE),
(4, 'as_4002', 'Food Delivery Signup', 'Sign up for food delivery service', 'Create an account and complete your first order.', 200, 'https://example.com/images/food_delivery.jpg', 'https://adscend.com/track/4002', 'US,CA,UK', 'Food & Dining', TRUE);

-- AyeT-Studios offers (wall_id = 5)
INSERT INTO `offers` (`offer_wall_id`, `external_offer_id`, `title`, `description`, `instructions`, `points`, `image_url`, `offer_url`, `countries`, `category`, `status`)
VALUES
(5, 'ay_5001', 'Strategy Game Challenge', 'Build your empire in this strategy game', 'Install the game and reach level 15 within 7 days.', 450, 'https://example.com/images/strategy_game.jpg', 'https://ayet.com/track/5001', 'US,CA,UK,AU,DE', 'Games', TRUE),
(5, 'ay_5002', 'Streaming Service Trial', 'Try premium streaming for 30 days', 'Sign up using valid credit card. Cancel anytime before trial ends.', 300, 'https://example.com/images/streaming.jpg', 'https://ayet.com/track/5002', 'US,CA,UK', 'Free Trials', TRUE);

-- KiwiWall offers (wall_id = 6)
INSERT INTO `offers` (`offer_wall_id`, `external_offer_id`, `title`, `description`, `instructions`, `points`, `image_url`, `offer_url`, `countries`, `category`, `status`)
VALUES
(6, 'kw_6001', 'Mobile RPG Adventure', 'Embark on a mobile RPG journey', 'Install the game and complete the tutorial quest.', 200, 'https://example.com/images/mobile_rpg.jpg', 'https://kiwiwall.com/track/6001', 'US,CA,UK,AU,DE,FR', 'Games', TRUE),
(6, 'kw_6002', 'Fitness App Signup', 'Start your fitness journey', 'Install the app, create an account, and complete 3 workouts.', 150, 'https://example.com/images/fitness_app.jpg', 'https://kiwiwall.com/track/6002', 'US,CA,UK,AU', 'Health & Fitness', TRUE);

-- Add system settings for offer walls configuration
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `setting_type`, `description`) 
VALUES 
('offerwall_enabled', 'true', 'boolean', 'Enable or disable offer walls functionality'),
('offerwall_verification_enabled', 'true', 'boolean', 'Enable offer verification before crediting points'),
('offerwall_default_hold_days', '3', 'number', 'Default number of days to hold offer rewards for verification'); 