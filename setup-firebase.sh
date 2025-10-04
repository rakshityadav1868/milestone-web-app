#!/bin/bash

echo "🔥 CelebrateHub Firebase Setup Script"
echo "====================================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

echo "✅ Firebase CLI is installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << 'EOF'
# Firebase Configuration (Server-side)
FIREBASE_PROJECT_ID=milestonehub-16c64
FIREBASE_PRIVATE_KEY_ID=fb5a39f437aca955880f39de206767c044633445
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCigDx0kX1GwibZ\nTAMJewpnYehiGWkPb15UoTgZztSMUWjpn3lSutDj/V8Lex0j7z2KzFInOC6FGLhf\n7BChJOQIOJY0kToDnRVz7zpsdIOHc4OgRC2UL63cPQKHXAYwR5IfINFw6MGWLAUG\nUz014gF9PcLEVgofSMWuBPJSKS5VnZ2656xhlEQ3KEKg5GHWu1M17RmmgBDVZxja\nO6fCPYYKojmoa2IZlSgITuCfGfcNYTL1+hsoSGVzp23qq5vkCBrX1yNERbF0idMM\n9Cr47Js0DZbQgcxok5Pi09hGmWjJ1tSedIc7iNWG1aBmCbGufYL8RvJypLvgjKng\nRRmausCRAgMBAAECggEATrNElEASKD7Hid3iaqkIdOFaJoif9TW+vcYG4ZjmH78d\nzGfL3mFT4ddIPMs3ZbvsVlh2QUBYZ2V9hhdSRnkTZ1fghzz+l9lwFmH6LaSQPv2W\n9fuPB4G/9jYmD2BmLuO6xRCj3scbWpufI10U/A+lIP7UYTo6VMRt2MXUhi4jnpqd\ncB+iWh5B14sCs3EaJEqFvkMxAfdK2Sxt3JlNQUP3wHGJC8ozAgDpBe/bC8SMAf+y\nMKwZ1Yg8TdSOTzasF7TUaQSn54140bp0rxQeyv2XRBxnbnrlyFWqewOhPr1roPsa\nUlq5Zlkn4Bx4l1p72CB1nbVN/6cOpkcaaAZO8RCzMQKBgQDYJ7UuHzPIodTZxmHW\nNUrRoL+I6A2C72tpPCbE90t7qp9A1qusAjJQhuVRYgOg0BtxEcCZnuaK1+77tVzM\n//4cAGCRemkDOQ6coOYOE0Tt1C5R3gKumlQ8WMoWuHVF4wiDrE6TlEPO3ES2rf1Q\nwRAyX92q4cWUq0BotE2iiyKKSwKBgQDAdJqlzGvvpd6SABCM8S+klK+/vZLwW89u\nHfm0zGtvSaTBKA5gRb9YXqiwRzBHBfpDMfU4GElqrJ5xFLcVwGHHoFGOsI6zNQjj\nbnfio4v6Zxn9dp+aLq7yOwsb5wB3swkSN3BZqFiPF7TAImyO+gn/fIuDFPG/9Web\newDME6FXEwKBgQDRxedtdVaaFYQuPPriGiIcQvbe9OV39sa1AG1Xpe+ZesLG+A7v\nBcqyn9eZHZgLzytylhnmfHGcuWby3NXNFXsUzcDqLnQPbqYhl3zsmALDFLJHPUA5\nFwk876ZgWm9lfanbr7MqQi90aAw/hadbYaJIYQUNO8K2P2RouOLHJmRE9QKBgGQB\nc4bqNcA++ev2GqOShMZJ+RVyphM+MgivjN01SDJ5GyK/9NB0Dd0WuyN2qpCNe6FF\nKX6vqB7FekOalxS3dlfsZ9T0zAI1cdv0wFlF0OwafTfnV0IgNgprQfeKzwRkRTdx\nFXGReAtLL0KT4MNfDKj1B+3iiUjNdbwma6CgJrt/AoGBAKebIjiWGMYl7jIFVXac\nYkS2efmNyExo7BGhjeNy3v9D4/fpHYxCtGoPfmHBs1W9fpEMQNaZf39oClyO5tvo\nbAnTPl1z2PBuU0unNEf/lzfgFLcMSKVkukZh1O9lFex9JxN9FqKx6i+lEtz7cCTN\nQluiTBy7mB0oZPEjqm6Oj6v9\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@milestonehub-16c64.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=111233038865624206784
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token

# OpenAI Configuration (Optional)
OPENAI_API_KEY=your-openai-api-key

# Server Configuration
PORT=5000
NODE_ENV=development
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

echo ""

# Create client/.env.local template
if [ ! -f "client/.env.local" ]; then
    echo "📝 Creating client/.env.local template..."
    cat > client/.env.local << 'EOF'
# Firebase Configuration (Client-side)
# Get these values from Firebase Console > Project Settings > General > Your apps
REACT_APP_FIREBASE_API_KEY=your-actual-api-key-here
REACT_APP_FIREBASE_AUTH_DOMAIN=milestonehub-16c64.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=milestonehub-16c64
REACT_APP_FIREBASE_STORAGE_BUCKET=milestonehub-16c64.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id-here
REACT_APP_FIREBASE_APP_ID=your-actual-app-id-here
EOF
    echo "✅ client/.env.local template created"
    echo "⚠️  You need to update client/.env.local with actual Firebase config values"
else
    echo "✅ client/.env.local already exists"
fi

echo ""
echo "🚀 Next Steps:"
echo "1. Run: firebase login"
echo "2. Run: firebase use milestonehub-16c64"
echo "3. Get Firebase client config from console or run: firebase apps:sdkconfig web"
echo "4. Update client/.env.local with actual config values"
echo "5. Enable GitHub OAuth in Firebase Console"
echo "6. Deploy functions: cd functions && npm run build && firebase deploy --only functions"
echo "7. Start the app: npm run dev"
echo ""
echo "📖 See FIREBASE_CONFIGURATION.md for detailed instructions"
