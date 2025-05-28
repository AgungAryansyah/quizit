-- +goose Up
-- +goose StatementBegin

INSERT INTO users (id, name, profile_picture, email, password, role_id) VALUES
('11111111-1111-1111-1111-111111111111', 'Alice Wonderland', '', 'alice@example.com', 'hashed_password_alice', 1),
('22222222-2222-2222-2222-222222222222', 'Bob The Builder', '', 'bob@example.com', 'hashed_password_bob', 2),
('33333333-3333-3333-3333-333333333333', 'Charlie Brown', '', 'charlie@example.com', 'hashed_password_charlie', 2);

INSERT INTO quizzes (id, theme, title, user_id, quiz_code) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Science', 'Solar System Trivia', '11111111-1111-1111-1111-111111111111', 'SOLAR1');

INSERT INTO questions (id, quiz_id, score, text, image) VALUES
('b1c2d3e4-f5a6-8790-2345-67890abcdef1', 'a1b2c3d4-e5f6-7890-1234-567890abcdef', 10, 'What is the largest planet in our solar system?', ''),
('c1d2e3f4-a5b6-9870-3456-7890abcdef12', 'a1b2c3d4-e5f6-7890-1234-567890abcdef', 10, 'Which planet is known as the Red Planet?', '');

INSERT INTO options (id, question_id, is_correct, text, image) VALUES
('d1e2f3a4-b5c6-0987-4567-890abcdef123', 'b1c2d3e4-f5a6-8790-2345-67890abcdef1', FALSE, 'Earth', ''),
('e1f2a3b4-c5d6-1987-5678-90abcdef1234', 'b1c2d3e4-f5a6-8790-2345-67890abcdef1', TRUE, 'Jupiter', ''),
('f1a2b3c4-d5e6-2987-6789-0abcdef12345', 'b1c2d3e4-f5a6-8790-2345-67890abcdef1', FALSE, 'Mars', '');

INSERT INTO options (id, question_id, is_correct, text, image) VALUES
('a2b3c4d5-e6f7-3098-7890-bcdefa123456', 'c1d2e3f4-a5b6-9870-3456-7890abcdef12', TRUE, 'Mars', ''),
('b2c3d4e5-f7a8-4098-8901-cdefab234567', 'c1d2e3f4-a5b6-9870-3456-7890abcdef12', FALSE, 'Venus', ''),
('c2d3e4f5-a8b9-5098-9012-defabc345678', 'c1d2e3f4-a5b6-9870-3456-7890abcdef12', FALSE, 'Jupiter', '');

INSERT INTO quizzes (id, theme, title, user_id, quiz_code) VALUES
('d2e3f4a5-b9c0-6098-0123-efabcd456789', 'History', 'World War II Facts', '22222222-2222-2222-2222-222222222222', 'WWII02');

INSERT INTO questions (id, quiz_id, score, text, image) VALUES
('e2f3a4b5-c0d1-7098-1234-fabcde567890', 'd2e3f4a5-b9c0-6098-0123-efabcd456789', 15, 'In which year did World War II end?', ''),
('f2a3b4c5-d1e2-8098-2345-abcdef678901', 'd2e3f4a5-b9c0-6098-0123-efabcd456789', 5, 'What event triggered the start of World War II in Europe?', '');

INSERT INTO options (id, question_id, is_correct, text, image) VALUES
('a3b4c5d6-e2f3-9098-3456-bcdefa789012', 'e2f3a4b5-c0d1-7098-1234-fabcde567890', FALSE, '1943', ''),
('b3c4d5e6-f3a4-0198-4567-cdefab890123', 'e2f3a4b5-c0d1-7098-1234-fabcde567890', TRUE, '1945', ''),
('c3d4e5f6-a4b5-1198-5678-defabc901234', 'e2f3a4b5-c0d1-7098-1234-fabcde567890', FALSE, '1947', '');

INSERT INTO options (id, question_id, is_correct, text, image) VALUES
('d3e4f5a6-b5c0-2198-6789-efabcd012345', 'f2a3b4c5-d1e2-8098-2345-abcdef678901', FALSE, 'Attack on Pearl Harbor', ''),
('e3f4a5b6-c0d1-3198-7890-fabcde123456', 'f2a3b4c5-d1e2-8098-2345-abcdef678901', TRUE, 'Invasion of Poland', '');

INSERT INTO quizzes (id, theme, title, user_id, quiz_code) VALUES
('f3a4b5c6-d1e2-4198-8901-abcdef234567', 'Geography', 'Capital Cities Challenge', '33333333-3333-3333-3333-333333333333', 'CAPCTY');

INSERT INTO questions (id, quiz_id, score, text, image) VALUES
('a4b5c6d7-e2f3-5198-9012-bcdefa345678', 'f3a4b5c6-d1e2-4198-8901-abcdef234567', 10, 'What is the capital of France?', ''),
('b4c5d6e7-f3a4-6198-0123-cdefab456789', 'f3a4b5c6-d1e2-4198-8901-abcdef234567', 10, 'What is the capital of Japan?', '');

INSERT INTO options (id, question_id, is_correct, text, image) VALUES
('c4d5e6f7-a4b5-7198-1234-defabc567890', 'a4b5c6d7-e2f3-5198-9012-bcdefa345678', TRUE, 'Paris', ''),
('d4e5f6a7-b5c0-8198-2345-efabcd678901', 'a4b5c6d7-e2f3-5198-9012-bcdefa345678', FALSE, 'London', '');

INSERT INTO options (id, question_id, is_correct, text, image) VALUES
('e4f5a6b7-c0d1-9198-3456-fabcde789012', 'b4c5d6e7-f3a4-6198-0123-cdefab456789', FALSE, 'Beijing', ''),
('f4a5b6c7-d1e2-0298-4567-abcdef890123', 'b4c5d6e7-f3a4-6198-0123-cdefab456789', TRUE, 'Tokyo', '');

INSERT INTO quizzes (id, theme, title, user_id, quiz_code) VALUES
('a5b6c7d8-e2f3-1298-5678-bcdefa901234', 'Literature', 'Classic Novels', '11111111-1111-1111-1111-111111111111', 'NOVELS');

INSERT INTO questions (id, quiz_id, score, text, image) VALUES
('b5c6d7e8-f3a4-2298-6789-cdefab012345', 'a5b6c7d8-e2f3-1298-5678-bcdefa901234', 5, 'Who wrote "Pride and Prejudice"?', '');

INSERT INTO options (id, question_id, is_correct, text, image) VALUES
('c5d6e7f8-a4b5-3298-7890-defabc123456', 'b5c6d7e8-f3a4-2298-6789-cdefab012345', TRUE, 'Jane Austen', ''),
('d5e6f7a8-b5c0-4298-8901-efabcd234567', 'b5c6d7e8-f3a4-2298-6789-cdefab012345', FALSE, 'Charles Dickens', '');

INSERT INTO quizzes (id, theme, title, user_id, quiz_code) VALUES
('e5f6a7b8-c0d1-5298-9012-fabcde345678', 'Movies', 'Sci-Fi Blockbusters', '22222222-2222-2222-2222-222222222222', 'SCIFI5');

INSERT INTO questions (id, quiz_id, score, text, image) VALUES
('f5a6b7c8-d1e2-6298-0123-abcdef456789', 'e5f6a7b8-c0d1-5298-9012-fabcde345678', 10, 'Who directed the movie "Avatar"?', '');

INSERT INTO options (id, question_id, is_correct, text, image) VALUES
('a6b7c8d9-e2f3-7298-1234-bcdefa567890', 'f5a6b7c8-d1e2-6298-0123-abcdef456789', FALSE, 'Steven Spielberg', ''),
('b6c7d8e9-f3a4-8298-2345-cdefab678901', 'f5a6b7c8-d1e2-6298-0123-abcdef456789', TRUE, 'James Cameron', '');

INSERT INTO articles (id, user_id, title, text) VALUES
('c6d7e8f9-a4b5-9298-3456-defabc789012', '11111111-1111-1111-1111-111111111111', 'The Future of Renewable Energy', 'The global shift towards renewable energy sources marks a pivotal moment in our history, driven by the urgent need to combat climate change and ensure sustainable development. Solar power, with its rapidly decreasing costs and increasing efficiency, is leading the charge. Photovoltaic panels are becoming ubiquitous, adorning rooftops and vast solar farms alike. Wind energy, harnessed by towering turbines, both onshore and offshore, contributes significantly to the clean energy mix. Hydropower remains a steadfast source, while geothermal and biomass offer consistent, albeit more geographically constrained, alternatives. Innovation in energy storage, particularly battery technology, is crucial for overcoming the intermittency of solar and wind. Smart grids are emerging to better manage the dynamic flow of electricity from these diverse sources. Policy support, through incentives and regulatory frameworks, plays a vital role in accelerating this transition. The journey to a fully renewable energy future is complex, involving technological advancements, infrastructure development, and societal adaptation. However, the environmental and economic benefits, including reduced carbon emissions, improved air quality, and new job creation, make this transition not just necessary but also an incredible opportunity for global progress. The collective commitment to this goal will shape the well-being of generations to come, ensuring a healthier planet. This is a very long text to make sure it passes the 200 word count for sure. This is a very long text to make sure it passes the 200 word count for sure. This is a very long text to make sure it passes the 200 word count for sure.'),
('d6e7f8a9-b5c0-0399-4567-efabcd890123', '22222222-2222-2222-2222-222222222222', 'Understanding Blockchain Technology', 'Blockchain technology, initially conceived for cryptocurrencies like Bitcoin, has evolved into a versatile tool with applications spanning numerous industries. At its core, a blockchain is a decentralized, distributed, and immutable digital ledger. Transactions or data entries are grouped into "blocks," which are then cryptographically linked together in a "chain." This structure ensures that once a block is added, it cannot be altered or deleted, providing a high level of security and transparency. Decentralization means that the ledger is not controlled by a single entity but is maintained by a network of computers, making it resistant to censorship and single points of failure. Smart contracts, self-executing contracts with the terms of the agreement directly written into code, are a powerful feature built on blockchain platforms like Ethereum. These contracts automate processes and reduce the need for intermediaries. Beyond finance, blockchain is finding use cases in supply chain management for tracking goods, in healthcare for secure patient records, and in voting systems for transparent elections. While challenges such as scalability, energy consumption, and regulatory uncertainty remain, the potential of blockchain to revolutionize how we interact and transact is undeniable. Its principles of trust, transparency, and immutability are reshaping digital landscapes. This is a very long text to make sure it passes the 200 word count for sure. This is a very long text to make sure it passes the 200 word count for sure.')

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM users
WHERE id IN (
    '11111111-1111-1111-1111-111111111111', 
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333'
);
-- +goose StatementEnd