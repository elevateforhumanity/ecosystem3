const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);
let db;

async function init() {
  try {
    await client.connect();
    db = client.db('elevateLicensing');
    
    // Create indexes for better performance
    await db.collection('licenses').createIndex({ licenseKey: 1 }, { unique: true });
    await db.collection('licenses').createIndex({ email: 1 });
    await db.collection('licenses').createIndex({ productId: 1 });
    await db.collection('licenses').createIndex({ issuedAt: -1 });
    
    console.log('🗂️ Connected to MongoDB and indexes created');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    // Fallback to file-based storage
    console.log('📁 Falling back to file-based storage');
    return false;
  }
}

async function saveLicense(licenseData) {
  try {
    if (db) {
      // MongoDB storage
      const collection = db.collection('licenses');
      const result = await collection.insertOne({
        ...licenseData,
        issuedAt: new Date(),
        status: 'active',
        usageCount: 0,
        lastUsed: null
      });
      console.log('💾 License saved in MongoDB:', result.insertedId);
      return result.insertedId;
    } else {
      // File-based fallback
      const fs = require('fs').promises;
      await fs.mkdir('./data', { recursive: true });
      
      const licenseFile = `./data/${licenseData.licenseKey}.json`;
      await fs.writeFile(licenseFile, JSON.stringify({
        ...licenseData,
        issuedAt: new Date(),
        status: 'active',
        usageCount: 0,
        lastUsed: null
      }, null, 2));
      
      console.log('💾 License saved to file:', licenseFile);
      return licenseData.licenseKey;
    }
  } catch (error) {
    console.error('❌ License save failed:', error);
    throw error;
  }
}

async function getLicense(licenseKey) {
  try {
    if (db) {
      // MongoDB lookup
      const collection = db.collection('licenses');
      const license = await collection.findOne({ licenseKey });
      return license;
    } else {
      // File-based lookup
      const fs = require('fs').promises;
      const licenseFile = `./data/${licenseKey}.json`;
      const data = await fs.readFile(licenseFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('❌ License lookup failed:', error);
    return null;
  }
}

async function updateLicenseUsage(licenseKey) {
  try {
    if (db) {
      // MongoDB update
      const collection = db.collection('licenses');
      await collection.updateOne(
        { licenseKey },
        { 
          $inc: { usageCount: 1 },
          $set: { lastUsed: new Date() }
        }
      );
    } else {
      // File-based update
      const license = await getLicense(licenseKey);
      if (license) {
        license.usageCount = (license.usageCount || 0) + 1;
        license.lastUsed = new Date();
        
        const fs = require('fs').promises;
        const licenseFile = `./data/${licenseKey}.json`;
        await fs.writeFile(licenseFile, JSON.stringify(license, null, 2));
      }
    }
    console.log('📊 License usage updated:', licenseKey);
  } catch (error) {
    console.error('❌ License usage update failed:', error);
  }
}

async function getAnalytics() {
  try {
    if (db) {
      // MongoDB analytics
      const collection = db.collection('licenses');
      
      const totalLicenses = await collection.countDocuments();
      const activeLicenses = await collection.countDocuments({ status: 'active' });
      
      const revenueData = await collection.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: '$price' } } }
      ]).toArray();
      
      const productBreakdown = await collection.aggregate([
        { $group: { _id: '$productId', count: { $sum: 1 }, revenue: { $sum: '$price' } } }
      ]).toArray();
      
      const recentSales = await collection.find()
        .sort({ issuedAt: -1 })
        .limit(10)
        .toArray();
      
      return {
        totalLicenses,
        activeLicenses,
        totalRevenue: revenueData[0]?.totalRevenue || 0,
        productBreakdown,
        recentSales
      };
    } else {
      // File-based analytics
      const fs = require('fs').promises;
      const files = await fs.readdir('./data');
      const licenses = [];
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const data = await fs.readFile(`./data/${file}`, 'utf8');
          licenses.push(JSON.parse(data));
        }
      }
      
      const totalRevenue = licenses.reduce((sum, license) => sum + (license.price || 0), 0);
      const activeLicenses = licenses.filter(license => license.status === 'active').length;
      
      return {
        totalLicenses: licenses.length,
        activeLicenses,
        totalRevenue,
        productBreakdown: {},
        recentSales: licenses.slice(-10)
      };
    }
  } catch (error) {
    console.error('❌ Analytics generation failed:', error);
    return {
      totalLicenses: 0,
      activeLicenses: 0,
      totalRevenue: 0,
      productBreakdown: {},
      recentSales: []
    };
  }
}

async function revokeLicense(licenseKey, reason = 'Manual revocation') {
  try {
    if (db) {
      const collection = db.collection('licenses');
      await collection.updateOne(
        { licenseKey },
        { 
          $set: { 
            status: 'revoked',
            revokedAt: new Date(),
            revocationReason: reason
          }
        }
      );
    } else {
      const license = await getLicense(licenseKey);
      if (license) {
        license.status = 'revoked';
        license.revokedAt = new Date();
        license.revocationReason = reason;
        
        const fs = require('fs').promises;
        const licenseFile = `./data/${licenseKey}.json`;
        await fs.writeFile(licenseFile, JSON.stringify(license, null, 2));
      }
    }
    console.log('🚫 License revoked:', licenseKey);
  } catch (error) {
    console.error('❌ License revocation failed:', error);
    throw error;
  }
}

module.exports = { 
  init, 
  saveLicense, 
  getLicense, 
  updateLicenseUsage, 
  getAnalytics, 
  revokeLicense 
};