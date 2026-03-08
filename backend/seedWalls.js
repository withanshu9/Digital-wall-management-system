require('dotenv').config();
const mongoose = require('mongoose');
const Wall = require('./models/Wall');
const User = require('./models/User');

const demoWalls = [
    { title: "Bandra Linking Road Billboard", city: "Mumbai", locationType: "Commercial Area", type: "LED Video Wall", width: 30, height: 15, trafficLevel: "High Traffic", pricingType: "monthly", basePrice: 75000, trafficEstimate: 95000, images: ["https://images.unsplash.com/photo-1510408479815-5606d1dfcbb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"] },
    { title: "Andheri Metro Flyover Wall", city: "Mumbai", locationType: "Metro/Bus Stand", type: "Static Painted Wall", width: 20, height: 12, trafficLevel: "High Traffic", pricingType: "monthly", basePrice: 45000, trafficEstimate: 70000, images: ["https://images.unsplash.com/photo-1508614999368-9260051292e5?auto=format&fit=crop&q=80&w=800"] },
    { title: "Connaught Place Outer Circle Panel", city: "Delhi", locationType: "Commercial Area", type: "LED Video Wall", width: 25, height: 14, trafficLevel: "High Traffic", pricingType: "monthly", basePrice: 90000, trafficEstimate: 120000, images: ["https://images.unsplash.com/photo-1543161099-0a6ea21f8a29?auto=format&fit=crop&q=80&w=800"] },
    { title: "Karol Bagh Market Wall", city: "Delhi", locationType: "Market Area", type: "Flex Banner Wall", width: 18, height: 10, trafficLevel: "High Traffic", pricingType: "monthly", basePrice: 38000, trafficEstimate: 65000, images: ["https://images.unsplash.com/photo-1518640578641-cb6ae76ddac7?auto=format&fit=crop&q=80&w=800"] },
    { title: "MG Road Junction Billboard", city: "Bengaluru", locationType: "Near Mall", type: "LED Video Wall", width: 28, height: 12, trafficLevel: "High Traffic", pricingType: "monthly", basePrice: 80000, trafficEstimate: 100000, images: ["https://images.unsplash.com/photo-1557997321-729909c2a5dc?auto=format&fit=crop&q=80&w=800"] },
    { title: "Whitefield Tech Park Wall", city: "Bengaluru", locationType: "Industrial Area", type: "Static Painted Wall", width: 22, height: 11, trafficLevel: "Medium Traffic", pricingType: "monthly", basePrice: 42000, trafficEstimate: 50000, images: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800"] },
    { title: "Dak Bungalow Chowk Wall", city: "Patna", locationType: "Commercial Area", type: "Flex Banner Wall", width: 20, height: 10, trafficLevel: "High Traffic", pricingType: "monthly", basePrice: 35000, trafficEstimate: 60000, images: ["https://images.unsplash.com/photo-1481144214532-6aedb0a3692d?auto=format&fit=crop&q=80&w=800"] },
    { title: "Patna Airport Road Panel", city: "Patna", locationType: "Highway", type: "LED Video Wall", width: 30, height: 15, trafficLevel: "High Traffic", pricingType: "monthly", basePrice: 55000, trafficEstimate: 75000, images: ["https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&q=80&w=800"] },
    { title: "Park Street Corner Billboard", city: "Kolkata", locationType: "Market Area", type: "LED Video Wall", width: 26, height: 13, trafficLevel: "High Traffic", pricingType: "monthly", basePrice: 70000, trafficEstimate: 90000, images: ["https://images.unsplash.com/photo-1518640026260-29c36d22efcd?auto=format&fit=crop&q=80&w=800"] },
    { title: "Salt Lake Sector V Wall", city: "Kolkata", locationType: "Industrial Area", type: "Static Painted Wall", width: 20, height: 12, trafficLevel: "Medium Traffic", pricingType: "monthly", basePrice: 40000, trafficEstimate: 55000, images: ["https://images.unsplash.com/photo-1518331776997-6a282f1b7ba1?auto=format&fit=crop&q=80&w=800"] },
    { title: "Banjara Hills Road Panel", city: "Hyderabad", locationType: "Residential Area", type: "LED Video Wall", width: 24, height: 12, trafficLevel: "High Traffic", pricingType: "monthly", basePrice: 68000, trafficEstimate: 85000, images: ["https://images.unsplash.com/photo-1544458316-2415170d30fe?auto=format&fit=crop&q=80&w=800"] },
    { title: "Hitech City Metro Wall", city: "Hyderabad", locationType: "Metro/Bus Stand", type: "Flex Banner Wall", width: 22, height: 10, trafficLevel: "High Traffic", pricingType: "monthly", basePrice: 48000, trafficEstimate: 70000, images: ["https://images.unsplash.com/photo-1603529323380-60b2d69ccff3?auto=format&fit=crop&q=80&w=800"] },
    { title: "Anna Salai Main Road Billboard", city: "Chennai", locationType: "Commercial Area", type: "LED Video Wall", width: 28, height: 14, trafficLevel: "High Traffic", pricingType: "monthly", basePrice: 72000, trafficEstimate: 95000, images: ["https://images.unsplash.com/photo-1601006509425-3b9af567ecbd?auto=format&fit=crop&q=80&w=800"] },
    { title: "T Nagar Market Wall", city: "Chennai", locationType: "Market Area", type: "Static Painted Wall", width: 18, height: 9, trafficLevel: "Medium Traffic", pricingType: "monthly", basePrice: 32000, trafficEstimate: 45000, images: ["https://images.unsplash.com/photo-1616422368923-d8c9735d46f4?auto=format&fit=crop&q=80&w=800"] },
    { title: "SG Highway LED Panel", city: "Ahmedabad", locationType: "Highway", type: "LED Video Wall", width: 30, height: 16, trafficLevel: "High Traffic", pricingType: "monthly", basePrice: 60000, trafficEstimate: 80000, images: ["https://images.unsplash.com/photo-1563851508-d2e1b1255eab?auto=format&fit=crop&q=80&w=800"] },
    { title: "Law Garden Market Wall", city: "Ahmedabad", locationType: "Market Area", type: "Flex Banner Wall", width: 20, height: 10, trafficLevel: "Medium Traffic", pricingType: "monthly", basePrice: 30000, trafficEstimate: 40000, images: ["https://images.unsplash.com/photo-1561081514-419b40fdb24d?auto=format&fit=crop&q=80&w=800"] },
    { title: "FC Road Commercial Billboard", city: "Pune", locationType: "Near College/School", type: "Static Painted Wall", width: 22, height: 11, trafficLevel: "High Traffic", pricingType: "monthly", basePrice: 44000, trafficEstimate: 65000, images: ["https://images.unsplash.com/photo-1533816670860-2621c46399a9?auto=format&fit=crop&q=80&w=800"] },
    { title: "Hinjewadi IT Park Wall", city: "Pune", locationType: "Industrial Area", type: "LED Video Wall", width: 26, height: 12, trafficLevel: "High Traffic", pricingType: "monthly", basePrice: 78000, trafficEstimate: 92000, images: ["https://images.unsplash.com/photo-1582283885449-623bb6ebad4f?auto=format&fit=crop&q=80&w=800"] },
    { title: "Hazratganj Market Billboard", city: "Lucknow", locationType: "Commercial Area", type: "Flex Banner Wall", width: 20, height: 10, trafficLevel: "Medium Traffic", pricingType: "monthly", basePrice: 28000, trafficEstimate: 38000, images: ["https://images.unsplash.com/photo-1520608977461-1ff573caedcb?auto=format&fit=crop&q=80&w=800"] },
    { title: "Alambagh Highway Panel", city: "Lucknow", locationType: "Highway", type: "Static Painted Wall", width: 24, height: 12, trafficLevel: "High Traffic", pricingType: "monthly", basePrice: 36000, trafficEstimate: 52000, images: ["https://images.unsplash.com/photo-1526487971363-2fb2fa00b73c?auto=format&fit=crop&q=80&w=800"] }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dwms')
    .then(async () => {
        let owner = await User.findOne({ email: 'owner@test.com' });

        if (!owner) {
            owner = new User({
                name: 'Test Owner',
                email: 'owner@test.com',
                password: 'password123',
                role: 'owner'
            });
            await owner.save();
            console.log('Created owner@test.com identity.');
        }

        console.log('Clearing existing walls to prevent duplicate clutter during demo...');
        await Wall.deleteMany({});

        console.log('Seeding 20 realistic walls...');
        for (let i = 0; i < demoWalls.length; i++) {
            const wall = new Wall({
                ...demoWalls[i],
                location: demoWalls[i].title, // Simplified for demo
                owner: owner._id,
                status: 'approved', // Pre-approve for presentation layer
                availability: 'available'
            });
            await wall.save();
        }

        console.log('✅ Base database seeded successfully with 20 Indian locations.');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
